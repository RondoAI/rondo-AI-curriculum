/* =================================================================
   SUBNET MAGAZINE — CATEGORY WORKFLOWS
   -----------------------------------------------------------------
   How each kind of subnet actually runs an epoch, distilled to a
   left-to-right step sequence the WorkflowDiagram chart can paint.

   Steps are intentionally generic — the SubnetDetail view merges
   the live miner / validator counts into them at render time, so
   the diagram automatically reads "256 miners" instead of "miners".

   Icons are single-character glyphs picked to read at 28pt mono.
   accent colors come from the brand red palette.
   ================================================================= */

/** @typedef {{ icon:string, label:string, key?:string, count?:any, desc?:string, accent?:string }} WorkflowStep */

/** Single fallback shape for any uncategorized subnet. */
const GENERIC = [
  { icon:'?', label:'INPUT',     desc:'A task is submitted to the subnet.' },
  { icon:'M', label:'MINERS',    key:'miners',     desc:'Miners produce candidate outputs in parallel.' },
  { icon:'V', label:'VALIDATORS',key:'validators', desc:'Validators score the outputs.' },
  { icon:'Σ', label:'CONSENSUS', desc:'Yuma Consensus aggregates weights into emissions.' },
  { icon:'τ', label:'EMISSION',  desc:'τ is minted and paid to top performers.' },
];

/** Per-category workflows. Falls back to GENERIC if a key is missing. */
export const WORKFLOWS = {
  text: [
    { icon:'?', label:'PROMPT',      desc:'A user sends a prompt or query through the validator.' },
    { icon:'M', label:'MINERS',      key:'miners',     desc:'Each miner returns its best LLM completion within the timeout.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators rubric-score every response or run an adversarial check.' },
    { icon:'Σ', label:'WEIGHTS',     desc:'Validator scores are aggregated by Yuma Consensus.' },
    { icon:'τ', label:'τ EMISSION',  desc:'τ flows to the highest-scoring miners every epoch.' },
  ],
  vision: [
    { icon:'?', label:'PROMPT',      desc:'Text or image prompt enters the subnet.' },
    { icon:'M', label:'GENERATORS',  key:'miners',     desc:'Miners generate candidate images / 3D / video.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators score on prompt fidelity, quality, and style.' },
    { icon:'Σ', label:'WEIGHTS',     desc:'Aggregated weights drive emissions.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Best generators paid in τ.' },
  ],
  video: [
    { icon:'?', label:'PROMPT',      desc:'Text-to-video prompt enters the subnet.' },
    { icon:'M', label:'GENERATORS',  key:'miners',     desc:'Miners produce short clips.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators score on temporal coherence + prompt match.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Best clips earn τ for their miners.' },
  ],
  audio: [
    { icon:'?', label:'INPUT',       desc:'Audio prompt or text-to-speech request.' },
    { icon:'M', label:'MINERS',      key:'miners',     desc:'Miners synthesize / transcribe / clone voice.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators score on WER, MOS, or adversarial listening.' },
    { icon:'τ', label:'τ EMISSION',  desc:'τ paid to top voices.' },
  ],
  multimodal: [
    { icon:'?', label:'INPUT',       desc:'Any combination of text, image, audio, or video.' },
    { icon:'M', label:'MINERS',      key:'miners',     desc:'Miners produce any-to-any output.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Adversarial validators score multimodal fidelity.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Top miners paid in τ.' },
  ],
  training: [
    { icon:'D', label:'DATASET',     desc:'A shared eval dataset is published per epoch.' },
    { icon:'M', label:'MINERS',      key:'miners',     desc:'Miners train new model weights or finetunes locally.' },
    { icon:'L', label:'EVAL LOSS',   desc:'Validators measure held-out loss on each submission.' },
    { icon:'Σ', label:'LEADERBOARD', desc:'The lowest-loss miner heads the public leaderboard.' },
    { icon:'τ', label:'τ EMISSION',  desc:'τ paid in proportion to loss-curve improvement.' },
  ],
  data: [
    { icon:'R', label:'RAW DATA',    desc:'Raw documents, pages, or rows enter the subnet.' },
    { icon:'M', label:'CURATORS',    key:'miners',     desc:'Miners label, dedupe, or transform.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators score for quality, novelty, provenance.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Curators paid per accepted row.' },
  ],
  search: [
    { icon:'Q', label:'QUERY',       desc:'A search query is broadcast to the subnet.' },
    { icon:'M', label:'CRAWLERS',    key:'miners',     desc:'Miners retrieve and rank results from their index.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators check recall + precision against ground truth.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Top retrievers earn τ.' },
  ],
  finance: [
    { icon:'$', label:'MARKET',      desc:'Live market data feeds the subnet.' },
    { icon:'M', label:'STRATEGISTS', key:'miners',     desc:'Miners submit trading or yield-strategy signals.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators measure live PnL with risk adjustment.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Top PnL miners paid in τ.' },
  ],
  agents: [
    { icon:'?', label:'TASK',        desc:'A real-world task is dispatched (web, code, tool use).' },
    { icon:'M', label:'AGENTS',      key:'miners',     desc:'Miners run multi-step agent loops to complete the task.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators verify completion or run a benchmark.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Successful agents earn τ.' },
  ],
  robotics: [
    { icon:'T', label:'TASK',        desc:'A manipulation or locomotion task is published.' },
    { icon:'M', label:'POLICIES',    key:'miners',     desc:'Miners submit robot policies (sim-trained).' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators run the policies in shared eval harness.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Top policies earn τ.' },
  ],
  science: [
    { icon:'P', label:'PROBLEM',     desc:'A scientific or optimization problem is posted.' },
    { icon:'M', label:'MINERS',      key:'miners',     desc:'Miners submit candidate solutions.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators verify against ground-truth or simulation.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Best solutions earn τ.' },
  ],
  infra: [
    { icon:'F', label:'REQUEST',     desc:'A user dispatches a function, container, or compute job.' },
    { icon:'M', label:'COMPUTE',     key:'miners',     desc:'Miner GPUs / nodes execute the workload.' },
    { icon:'R', label:'RECEIPT',     desc:'Signed verifiable receipts proving execution are returned.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators verify receipts and score reliability.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Reliable nodes earn τ proportional to FLOPs served.' },
  ],
  prediction: [
    { icon:'?', label:'EVENT',       desc:'A real-world question or market is posted.' },
    { icon:'M', label:'FORECASTERS', key:'miners',     desc:'Miners submit probabilistic forecasts.' },
    { icon:'V', label:'VALIDATORS',  key:'validators', desc:'Validators settle against the eventual outcome.' },
    { icon:'τ', label:'τ EMISSION',  desc:'Most-accurate forecasters earn τ.' },
  ],
};

/**
 * Resolve a category's workflow with the subnet's live counts merged in.
 * @param {string} cat
 * @param {{miners?:number, validators?:number}} subnet
 * @returns {WorkflowStep[]}
 */
export function workflowFor(cat, subnet = {}){
  const base = WORKFLOWS[cat] || GENERIC;
  return base.map(step => ({
    ...step,
    count: step.key && subnet[step.key] != null
      ? subnet[step.key].toLocaleString('en-US')
      : step.count,
  }));
}
