#!/usr/bin/env python3
"""Audit both Oracle workflow files for known-broken patterns."""
import yaml, json, re, sys

issues = []
WORKFLOWS = [
    '.github/workflows/daily-research.yml',
    '.github/workflows/intelligence-poll.yml',
]

for path in WORKFLOWS:
    print(f'\n=== {path} ===')
    src = open(path).read()
    try:
        data = yaml.safe_load(src)
    except yaml.YAMLError as e:
        issues.append(f'{path}: YAML PARSE FAILURE: {e}')
        continue

    triggers = data.get('on', data.get(True))
    trig_keys = list(triggers.keys()) if isinstance(triggers, dict) else triggers
    print(f'  triggers: {trig_keys}')

    has_dispatch = isinstance(triggers, dict) and 'workflow_dispatch' in triggers
    has_schedule = isinstance(triggers, dict) and 'schedule' in triggers

    for jname, job in data.get('jobs', {}).items():
        print(f'  job: {jname}, runs-on: {job.get("runs-on")}, timeout: {job.get("timeout-minutes")}m')

        for step in job.get('steps', []):
            name = step.get('name', '(unnamed)')
            uses = step.get('uses', '')
            run = step.get('run', '')
            with_ = step.get('with', {}) or {}
            env = step.get('env', {}) or {}

            tag = name
            if uses:
                tag += f' [uses={uses}]'
            print(f'    - {tag}')

            # Rule 1: setup-python with cache:pip but no lock file
            if uses == 'actions/setup-python@v5' and with_.get('cache') == 'pip':
                issues.append(
                    f'{path}: step "{name}": cache: pip requires a discoverable '
                    f'requirements.txt/pyproject.toml/Pipfile.lock; we have none.'
                )

            # Rule 2: env references inputs.X without || '' coalesce on a workflow
            # that ALSO has schedule trigger (where inputs context is absent)
            if has_schedule and has_dispatch:
                for key, val in env.items():
                    if isinstance(val, str):
                        m = re.search(r'\$\{\{\s*inputs\.([a-zA-Z_]+)\s*\}\}', val)
                        if m:
                            issues.append(
                                f'{path}: step "{name}": env.{key} uses bare '
                                f'inputs.{m.group(1)} but workflow also runs on '
                                f'schedule; needs || coalesce.'
                            )

            # Rule 3: run script with multi-line `git commit -m "..."` containing
            # unindented continuation lines (YAML block-scalar killer in source)
            if run and 'git commit -m "' in run:
                # Look at raw source for this run block. Find a multiline -m flag.
                # The YAML parser would already have rejected this if broken,
                # so if we got here, it's fine. Just flag if structurally risky.
                lines = run.split('\n')
                for i, line in enumerate(lines):
                    if 'git commit -m "' in line and not line.rstrip().endswith('"'):
                        # opens a quoted string that doesn't close on same line
                        issues.append(
                            f'{path}: step "{name}": git commit -m opens a '
                            f'multi-line quoted string at line "{line.strip()}"; '
                            f'use two -m flags or a heredoc instead.'
                        )

            # Rule 4: run script references inputs without coalesce
            if has_schedule and run:
                m = re.findall(r'\$\{\{\s*inputs\.([a-zA-Z_]+)\s*\}\}', run)
                if m:
                    issues.append(
                        f'{path}: step "{name}": run references inputs.{m} '
                        f'but workflow has schedule trigger.'
                    )

            # Rule 5: working-directory points to a path that won't exist on main
            # (only relevant if checkout step pinned ref to a non-default branch)
            wd = step.get('working-directory', '')
            if wd and wd.startswith('projects/subnet-magazine-v2'):
                # That's fine as long as a prior checkout step grabbed
                # subnet-mag-v2; flag if no such checkout in this job
                checkout_ok = False
                for s in job.get('steps', []):
                    if s.get('uses', '').startswith('actions/checkout'):
                        if s.get('with', {}).get('ref') == 'subnet-mag-v2':
                            checkout_ok = True
                            break
                if not checkout_ok:
                    issues.append(
                        f'{path}: step "{name}": working-directory {wd} but '
                        f'no checkout step pins ref to subnet-mag-v2.'
                    )

print()
if issues:
    print('=== AUDIT FAILURES ===')
    for it in issues:
        print('  -', it)
    sys.exit(1)
print('ALL CHECKS PASSED')
