/* =================================================================
   SUBNET MAGAZINE — INFERENCE PROMPT LIBRARY
   -----------------------------------------------------------------
   A small curated set of prompts the Compare page uses out of the
   box. For each prompt we hand-author what a typical response from
   each provider class looks like, so users see real character
   differences (Anthropic verbose-careful, OpenAI structured,
   DeepSeek shows scratchpad, Bittensor concise, etc.).

   For prompts the user types themselves, we fall back to a
   per-provider placeholder pattern. That keeps the page honest:
   every response is marked "simulated".
   ================================================================= */

/** @typedef {{ prompt: string, responses: Record<string, string> }} PromptCard */

/* Per-provider rough quality scale: 0–100. Used to drive the
   "quality" metric overlay; values are best-effort approximations
   from public benchmark data. */
export const QUALITY_BASELINE = Object.freeze({
  opus47:  96, gpt51: 95, gemini3: 93, grok4: 88,
  sonnet46:91, gpt51m: 86,
  llama5:  84, dsr3:   88, qwen3: 85, yi: 80, mistral2: 82, glm5: 80, kimi: 84,
  sn1:     74, sn4:    76, sn18:   72, sn6:  78, sn11: 70,
});

/** Hand-curated demo prompts with per-provider responses. */
export const SAMPLE_PROMPTS = Object.freeze([
  {
    prompt: 'Explain quantum entanglement in one short paragraph for a smart non-physicist.',
    responses: {
      opus47:  'Two particles can be prepared in a shared quantum state so that measuring a property of one instantaneously fixes the matching property of the other, no matter how far apart they are. Nothing actually travels between them — it\'s a single quantum system that happened to be split across space. The correlation is stronger than anything classical physics allows, but it can\'t be used to send a message: each measurement individually looks random, and the pattern only emerges when both observers compare notes.',
      gpt51:   'Quantum entanglement is when two or more particles share a single combined quantum state, so their properties stay correlated even at great distance. Measure one and you immediately know the matching property of the other. It is NOT communication — neither observer can choose what they get, only see that the results agree statistically — but the correlations are too strong to explain with hidden classical variables, as Bell\'s inequality tests have shown repeatedly.',
      gemini3: 'Imagine two coins linked so that whenever you flip one and it lands heads, the other lands tails, even on Mars. That\'s entanglement: particles are prepared together in a shared state, and measuring one fixes the other immediately. No signal travels — the result is fundamentally random until measured, and you can\'t pick what you get. But the linkage exists, and decades of experiments confirm it.',
      grok4:   'Two particles, one quantum state. Measure spin-up here, the partner is spin-down — every time, regardless of distance. No FTL signaling (you can\'t control which result you get), but the correlation is real and Nobel-winning.',
      sonnet46:'Two particles share one quantum state. Measure one — say its spin is "up" — and the partner is immediately "down", no matter the distance between them. Nothing travels: it is one entity that happens to be split in space. The strangeness is that the measurement outcomes are individually random, so no usable signal is sent, yet the correlations beat anything classical physics allows.',
      gpt51m:  'Entanglement: two particles share a single quantum state, so measuring one instantly fixes the matching property of the other. No signal moves between them. The randomness is real but the correlation is too strong to come from hidden classical variables.',
      llama5:  'Quantum entanglement is a shared state between particles where measuring one immediately determines the result of the other, even across galaxies. There is no signal — measurements look random alone, only correlated when compared. Bell tests rule out classical alternatives.',
      dsr3:    '[reasoning] Best way to explain to a smart non-physicist: avoid Bell\'s math, focus on the intuition gap.\n\nTwo particles are sometimes prepared in a single combined quantum state. Once that happens, measuring one — call the result "up" — locks the other to "down", regardless of how far apart they are. Nothing physical travels between them. The randomness is real and individual, so neither observer can send a message. What\'s strange is the strength of the correlation: it\'s too consistent to be explained by hidden bookkeeping the particles carried at birth, and decades of experiments have confirmed that.',
      qwen3:   'Two quantum particles can be prepared so that they share one combined state. Measuring one immediately determines a matching property of the other, no matter how far apart they are. There is no signal — neither party can choose what they observe — but the correlations are too strong to explain by particles "carrying" the answer in advance. This is what Bell\'s theorem and subsequent experiments confirmed.',
      yi:      'Entanglement: two particles in one quantum state behave as a single system, so measuring one immediately fixes the other\'s matching property. No information travels — you can\'t pick the outcome — but the correlations exceed any classical (pre-shared) explanation.',
      mistral2:'Entanglement: a shared quantum state of two particles means measuring one instantly determines the matching attribute of the other, regardless of distance. The outcome is random but correlated, and the correlations are too tight to be classical.',
      glm5:    'When two particles share one quantum state, measuring a property of one immediately fixes the matching property of the other, no matter the distance. Nothing is transmitted — the result is intrinsically random — yet the correlation between measurements is stronger than any classical theory allows.',
      kimi:    'Two particles can be prepared in a single, shared quantum state. Measuring one (its spin, polarization, etc.) instantly fixes the matching value on the other, however far away. There is no signaling — both outcomes look random individually — but when compared, the correlation defies any classical explanation. Bell-type experiments since the 1980s have shown this is real.',
      sn1:     'Two particles, one shared quantum state. Measure one and the other is instantly determined — no signal, no FTL, just a single split system. Cannot send messages; correlations exceed classical limits.',
      sn4:     'Quantum entanglement: particles prepared in a joint state stay correlated when measured separately, however far apart. Individual results look random; only the pattern across many runs reveals the link. Bell tests confirm it is real and beyond classical physics.',
      sn18:    'Entanglement: shared quantum state across two particles. Measurement of one immediately fixes the other. No signaling, but correlations stronger than classical.',
      sn6:     'Two particles can be entangled — sharing one quantum state. Measuring one determines the other instantly, regardless of distance. No information travels; each outcome alone is random. The strength of the correlation is what makes this strange.',
      sn11:    'Two particles, one state. Measure one — the other matches. Doesn\'t carry information, just correlation. Real, weird, Nobel-tested.',
    },
  },
  {
    prompt: 'Write a Python function that returns the nth Fibonacci number iteratively.',
    responses: {
      opus47:  '```python\ndef fib(n: int) -> int:\n    """Return the n-th Fibonacci number (0-indexed)."""\n    if n < 0:\n        raise ValueError("n must be non-negative")\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\n\nIterative, O(n) time, O(1) space. The two-variable swap avoids any recursion stack and the type hint plus the validation make it ready for production code.',
      gpt51:   '```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      gemini3: '```python\ndef fib(n: int) -> int:\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\nO(n) time, O(1) space. fib(0)=0, fib(1)=1, fib(10)=55.',
      grok4:   '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      sonnet46:'```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      gpt51m:  '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      llama5:  '```python\ndef fib(n):\n    if n < 0: raise ValueError(\"non-negative only\")\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      dsr3:    '[scratchpad] iterative + O(1) space + clean.\n\n```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      qwen3:   '```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      yi:      '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      mistral2:'```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      glm5:    '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      kimi:    '```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\nO(n), O(1).',
      sn1:     '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      sn4:     '```python\ndef fib(n):\n    if n < 0: raise ValueError\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      sn18:    '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n): a, b = b, a + b\n    return a\n```',
      sn6:     '```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```',
      sn11:    '```python\ndef fib(n):\n    a,b=0,1\n    for _ in range(n): a,b=b,a+b\n    return a\n```',
    },
  },
  {
    prompt: 'Summarize what Bittensor is in three sentences.',
    responses: {
      opus47:  'Bittensor is a decentralized network where independent operators run specialized markets ("subnets") for different kinds of AI work — language inference, image generation, training, retrieval, and more. Each subnet pays a native crypto token (τ) to the miners who produce the best output, as scored by validators staked on that subnet. The result is a permissionless competitive marketplace for AI capabilities that runs on chain instead of inside a single company.',
      gpt51:   'Bittensor is a decentralized AI network organized into "subnets", each a market for a specific kind of work (text inference, image generation, training, etc.). Miners compete to produce the best output; validators score them; emissions in the native τ token are paid to the top performers each epoch. Yuma Consensus aggregates validator weights into the actual payout.',
      gemini3: 'Bittensor (τ) is an open, on-chain marketplace for AI work. Independent subnets each run a competition for a particular AI task — language, vision, training, retrieval — and pay miners in τ proportional to validator scores. Think of it as a permissionless decentralized analogue to the centralized inference + training stack.',
      grok4:   'Bittensor: blockchain-based AI marketplace where miners run AI work and validators score it. Each subnet specializes (text, image, training, etc.) and pays its winners in τ. Decentralized substitute for centralized AI services.',
      sonnet46:'Bittensor is a decentralized AI network of "subnets" — each subnet is a market for a specific AI task. Miners produce outputs; validators score them; emissions in τ flow to the highest-scoring miners. Yuma Consensus is the on-chain scoring layer that makes the payouts trustworthy.',
      gpt51m:  'Bittensor is a decentralized AI network of subnets, each running its own competitive market for a kind of AI work. Miners ship outputs, validators score them, and the τ token pays the winners. Open, on-chain, permissionless.',
      llama5:  'Bittensor (τ) is a decentralized AI network. Each "subnet" is a competition for one type of AI task (inference, training, generation, etc.) where miners produce outputs and validators score them. τ is paid out as emissions every epoch.',
      dsr3:    '[reasoning] The user wants a concise summary; lead with what it is, then the structure, then the economic primitive.\n\nBittensor is a decentralized AI network with specialized markets called subnets, one per task. Miners compete on output quality; validators score them; the τ token is the on-chain emissions that reward the best performers. Yuma Consensus aggregates validator weights into the actual payout, making the system trustworthy without a central operator.',
      qwen3:   'Bittensor (τ) is a decentralized AI network. Each subnet is a specialized market for one kind of work — inference, training, search, vision, etc. Miners compete on output; validators score them; τ is paid as emissions every epoch.',
      yi:      'Bittensor is a decentralized AI economy. Each subnet runs an open competition for a specific AI task; miners produce outputs; validators score them; τ is paid to the best performers. No central operator.',
      mistral2:'Bittensor is a decentralized network where subnets host specialized AI markets. Miners compete; validators score; τ pays the winners. Yuma Consensus is the on-chain scoring.',
      glm5:    'Bittensor is a decentralized network of AI markets. Each subnet runs one task; miners do the work; validators score; the τ token is paid to top performers.',
      kimi:    'Bittensor is a decentralized AI network. Each subnet is a market for a specific AI task — text inference, image generation, training, retrieval. Miners compete to produce the best output, validators score, the τ token pays the winners. The whole stack lives on the Subtensor chain.',
      sn1:     'Bittensor: decentralized AI marketplace. Subnets host task-specific competitions. Miners produce; validators score; τ pays winners.',
      sn4:     'Bittensor (τ) is a decentralized AI network. Subnets are markets for individual AI tasks. Miners compete; validators score; τ flows to winners.',
      sn18:    'Bittensor: decentralized AI. Subnets = markets. Miners compete, validators score, τ pays winners.',
      sn6:     'Bittensor is a decentralized AI network where each subnet hosts a market for one AI task. Miners produce outputs; validators score them; τ is paid to the highest-scoring miners every epoch.',
      sn11:    'Decentralized AI. Each subnet = one task market. Miners compete, validators grade, τ pays winners.',
    },
  },
]);

/** Placeholder for prompts not in the curated library. */
export function placeholderFor(provider, prompt){
  return `[Simulated · ${provider.name}]  This is a prototype interface — a real connection to ${provider.org} would return a live response to "${prompt.slice(0, 60)}${prompt.length > 60 ? '…' : ''}". Wire ${provider.kind === 'subnet' ? 'a Bittensor SDK call' : 'the provider API'} to replace this placeholder.`;
}
