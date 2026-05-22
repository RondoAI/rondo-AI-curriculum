"""Render 'our neural network' — the system Rondo + Claude have built."""
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
import os

fig, ax = plt.subplots(figsize=(16, 13))
ax.set_xlim(0, 16)
ax.set_ylim(0, 13)
ax.axis('off')

fig.patch.set_facecolor('#0a0a0f')
ax.set_facecolor('#0a0a0f')

inputs = [
    "Deitel\n(primary book)",
    "Severance / py4e",
    "Sutton & Barto\n(RL)",
    "Russell & Norvig\n(AIMA)",
    "Brookshear\n(CS overview)",
    "Daily AI briefings",
]
agents = [
    "Claude (web)",
    "Rondo",
    "Claude (Mac)",
]
memory = [
    "CLAUDE.md",
    "CONCEPTS.md",
    "PROGRESS.md",
    "SESSION_LOG.md",
    "JOURNAL.md",
    "LEARNER_PROFILE.md",
]
outputs = [
    "GitHub: RondoAI",
    "X @rondo_ina_condo",
    "Public journal",
    "Subnet Oracle",
    "2028 release",
]


def positions(items, x):
    n = len(items)
    spacing = 10.0 / (n + 1)
    return [(x, 11.5 - spacing * (i + 1)) for i in range(n)]


xs = [1.8, 6.0, 10.3, 14.4]
pos_inputs = positions(inputs, xs[0])
pos_agents = positions(agents, xs[1])
pos_memory = positions(memory, xs[2])
pos_outputs = positions(outputs, xs[3])

c_input = '#f97316'
c_work = '#a78bfa'
c_rondo = '#fb923c'
c_memory = '#0ea5e9'
c_output = '#10b981'
c_edge = '#475569'


def edge(a, b, color, alpha=0.35, lw=0.7):
    ax.plot([a[0], b[0]], [a[1], b[1]], color=color, alpha=alpha,
            linewidth=lw, zorder=1)


for p in pos_inputs:
    edge(p, pos_agents[1], c_edge, alpha=0.55)

edge(pos_agents[0], pos_agents[1], '#a78bfa', alpha=0.75, lw=1.8)
edge(pos_agents[1], pos_agents[2], '#a78bfa', alpha=0.75, lw=1.8)
edge(pos_agents[0], pos_agents[2], '#a78bfa', alpha=0.4, lw=0.9)

for w in pos_agents:
    for m in pos_memory:
        edge(w, m, c_edge, alpha=0.25)

for m in pos_memory:
    for o in pos_outputs:
        edge(m, o, c_edge, alpha=0.2)

for o in pos_outputs:
    edge(pos_agents[1], o, '#fb923c', alpha=0.4, lw=0.9)


def node(p, label, color, size=0.32):
    circle = Circle(p, size, color=color, ec='white', linewidth=1.4, zorder=2)
    ax.add_patch(circle)
    ax.text(p[0], p[1] - size - 0.55, label, ha='center', va='top',
            fontsize=8.5, color='white', zorder=3, linespacing=1.15)


for p, label in zip(pos_inputs, inputs):
    node(p, label, c_input)
for p, label in zip(pos_agents, agents):
    if 'Rondo' in label:
        node(p, label, c_rondo, size=0.5)
    else:
        node(p, label, c_work, size=0.36)
for p, label in zip(pos_memory, memory):
    node(p, label, c_memory, size=0.26)
for p, label in zip(pos_outputs, outputs):
    node(p, label, c_output, size=0.32)

ax.text(xs[0], 12.3, "INPUTS", ha='center', fontsize=12,
        color='#94a3b8', fontweight='bold')
ax.text(xs[1], 12.3, "AGENTS", ha='center', fontsize=12,
        color='#94a3b8', fontweight='bold')
ax.text(xs[2], 12.3, "PERSISTENT  MEMORY", ha='center', fontsize=12,
        color='#94a3b8', fontweight='bold')
ax.text(xs[3], 12.3, "OUTPUTS", ha='center', fontsize=12,
        color='#94a3b8', fontweight='bold')

ax.text(8, 0.7, "our neural network", ha='center', fontsize=20,
        color='white', style='italic')
ax.text(8, 0.25, "2026-05-22  ·  Linux web session  ·  rondo-AI-curriculum",
        ha='center', fontsize=9, color='#64748b')

out_path = os.path.expanduser('/home/user/rondo-AI-curriculum/writings/our-network.png')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
plt.tight_layout()
plt.savefig(out_path, facecolor='#0a0a0f', dpi=140, bbox_inches='tight')
print(f"Saved {out_path}")
