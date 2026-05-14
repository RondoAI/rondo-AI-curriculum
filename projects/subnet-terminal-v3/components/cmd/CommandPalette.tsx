"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PANELS, VERTICAL_LABEL } from "@/lib/panels";
import type { Preset } from "@/components/chrome/TopChrome";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  group: string;
  run: () => void;
};

/** subsequence fuzzy match — every char of `q` appears in order in `s` */
function fuzzy(q: string, s: string): boolean {
  if (!q) return true;
  q = q.toLowerCase();
  s = s.toLowerCase();
  let i = 0;
  for (const c of s) if (c === q[i]) i++;
  return i === q.length;
}

const PRESETS: Preset[] = ["macro", "subnets", "gpu", "power", "news"];

/** Bloomberg-style command palette. Opens on ⌘K / Ctrl+K or the
    chrome's search button (`sbnt:command` event). Phase 1 routes:
    the five layout presets + jump-to-panel for all twelve panels. */
export function CommandPalette({ onPreset }: { onPreset: (p: Preset) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Cmd[] = useMemo(() => {
    const close = () => setOpen(false);
    const presetCmds: Cmd[] = PRESETS.map((p) => ({
      id: `layout-${p}`,
      label: `Layout · ${p[0].toUpperCase()}${p.slice(1)}`,
      hint: `layout ${p}`,
      group: "LAYOUT",
      run: () => {
        onPreset(p);
        close();
      },
    }));
    const panelCmds: Cmd[] = PANELS.map((p) => ({
      id: `panel-${p.id}`,
      label: `${p.code} · ${p.title}`,
      hint: VERTICAL_LABEL[p.vertical],
      group: "JUMP TO PANEL",
      run: () => {
        document
          .getElementById(`panel-${p.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        close();
      },
    }));
    return [...presetCmds, ...panelCmds];
  }, [onPreset]);

  const results = useMemo(
    () =>
      commands.filter(
        (c) => fuzzy(q, c.label) || fuzzy(q, c.hint) || fuzzy(q, c.group)
      ),
    [commands, q]
  );

  /* global open: ⌘K / Ctrl+K, and the chrome search button */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onCmd = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("sbnt:command", onCmd);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("sbnt:command", onCmd);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] bg-black/70"
      onMouseDown={() => setOpen(false)}
    >
      <div
        className="w-[min(620px,92vw)] bg-elev-2 border border-hairline-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 h-11 border-b border-hairline">
          <span className="text-amber text-[13px]">›</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onListKey}
            placeholder="Jump to a panel, switch layout, search the desk…"
            className="flex-1 bg-transparent outline-none text-[13px] text-ink-1 placeholder:text-ink-3"
          />
          <kbd className="text-[10px] border border-hairline-2 px-1 text-ink-3">esc</kbd>
        </div>
        <ul className="max-h-[44vh] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-3 py-3 text-[12px] text-ink-3">
              Nothing matches that. Try a panel code or a layout name.
            </li>
          )}
          {results.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                className={`w-full flex items-center gap-3 px-3 py-1.5 text-left ${
                  i === active ? "bg-elev-1" : ""
                }`}
              >
                <span
                  className={`text-[9px] smallcaps w-[92px] shrink-0 ${
                    i === active ? "text-amber" : "text-ink-3"
                  }`}
                >
                  {c.group}
                </span>
                <span className="text-[12px] text-ink-1 truncate">{c.label}</span>
                <span className="ml-auto text-[10px] text-ink-3 shrink-0">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 px-3 h-7 border-t border-hairline text-[10px] text-ink-3">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span className="ml-auto smallcaps">subneτ command</span>
        </div>
      </div>
    </div>
  );
}
