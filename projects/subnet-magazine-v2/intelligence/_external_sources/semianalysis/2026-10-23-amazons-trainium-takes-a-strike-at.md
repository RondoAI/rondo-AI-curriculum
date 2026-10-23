---
source: "SemiAnalysis"
title: "Amazon’s Trainium Takes a Strike at the Training King"
subtitle: "Trainium Best for Inference? But now good for Training too, Native Trainium PyTorch, High Quality CI, TorchTitan, GPU Impossible Profiler"
date: "2026-10-23"
authors: ["Kimbo Chen", "Dylan Patel"]
audience: "only_paid"
paywalled: true
wordcount: 3308
url: "https://newsletter.semianalysis.com/p/amazons-trainium-takes-a-strike-at"
post_id: 221688959
captured_at: "2026-10-23T22:50:41.619886+00:00"
---

# Amazon’s Trainium Takes a Strike at the Training King

_Trainium Best for Inference? But now good for Training too, Native Trainium PyTorch, High Quality CI, TorchTitan, GPU Impossible Profiler_

**Authors:** Kimbo Chen, Dylan Patel  
**Published:** 2026-10-23  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/amazons-trainium-takes-a-strike-at

---

> **Paywalled.** Captured below is the free preview Substack renders publicly (33,310 chars of body markdown). For long-form analyses this is typically 70 to 90 percent of the article, with the final deep-dive section paywalled. The Oracle may cite the captured content; do not assert claims that depend on the paywalled tail (look for a 'This post is for paid subscribers' marker at the end of the body).

Trainium has already proven itself in the realm of inference. Anthropic is running production inference and RL rollouts on Trainium2 and Trainium3. Historically, Trainium has been great for inference but not the best fit for research training. In inference, the model architecture changes at a much slower pace compared to training, where researchers iterate on many different experiments and ablations of model architecture and need a stack that covers a broad API surface. In the past, that is where Trainium fell short.

The AWS Neuron team is aggressively working to change this pitfall with the biggest shift being moving towards a first-class, native PyTorch training experience. Gone are the days of sprinkling xm.step() through your training loop and wrestling with a bespoke XLA-style execution model. Trainium now runs PyTorch the way PyTorch users expect, in eager mode, with torch.compile and the standard APIs.

The SemiAnalysis engineering team has been trying out the Trainium3 racks for the past couple of weeks and has found the experience to be great – we love the overall direction of where it is heading. To be clear, it isn’t perfect yet, and we have personally run into a couple of bugs ourselves. It’s nowhere close to the maturity of the CUDA ecosystem, but the direction is right. Their team is making rapid progress with the help of agentic coding.

Furthermore, unlike other accelerator companies, where we had to fight tooth and nail to get their engineers a reasonably stable CI fleet, Trainium uses up to 80,000 physical cores allocated towards automated quality control.

In this article, we walk through our experience on the Trainium3 TorchTitan and TorchNeuron stack, along with our experience of Trainium’s Neuron Explorer profiler, which is way better than both Nvidia’s and AMD’s profilers. We created a bunch of demos to show how Trainium’s profiler is “GPU Impossible.”

[![](https://substackcdn.com/image/fetch/$s_!hGVA!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F680cf6ed-4bdd-4d53-9c2c-569ac56bb93c_1452x790.png)](https://substackcdn.com/image/fetch/$s_!hGVA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F680cf6ed-4bdd-4d53-9c2c-569ac56bb93c_1452x790.png)

_caption:_ Visualizing Nafea Bshara, VP at AWS In Trainium Profiler Showcasing Trainium’s Finegrain Profiler. Source: SemiAnalysis

In an upcoming article, we will go deep on writing speed-of-light NKI kernels and microbenchmarking on Trainium3. For our deep dive into the Trainium hardware, check out our previous article where we do a complete hardware breakdown.

[![AWS Trainium3 Deep Dive | A Potential Challenger Approaching](https://substackcdn.com/image/fetch/$s_!Fuoh!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F026e10fe-cce5-4c8b-80f9-284a12382b3d_1536x1024.jpeg) AWS Trainium3 Deep Dive | A Potential Challenger ApproachingDylan Patel](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential), [Daniel Nishball](https://substack.com/profile/160965795-daniel-nishball), and 8 others·December 4, 2025[Read full story](https://newsletter.semianalysis.com/p/aws-trainium3-deep-dive-a-potential)[![](https://substackcdn.com/image/fetch/$s_!kRLZ!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F66643b53-8390-4e90-a3a2-e4d46fe6bf6f_1426x1367.png)](https://substackcdn.com/image/fetch/$s_!kRLZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F66643b53-8390-4e90-a3a2-e4d46fe6bf6f_1426x1367.png)

_caption:_ Source: SemiAnalysis

# We Are Hiring

SemiAnalysis is hiring for various Member of Technical Staff roles. If you find this type of analysis interesting, apply below:

[Apply Here](https://app.dover.com/apply/SemiAnalysis/2a9c8da5-6d59-4ac8-8302-3877345dbce1?rs=55634680)

What we’re looking for:

- Highly motivated & skilled Member of Technical Staff to join our growing engineering team.
- Member of Technical Staff will play a crucial role in developing inference benchmarks & system modeling
- You will also play a role in writing and preparing our newsletter articles for publishing, with the opportunity for direct authorship recognition.
- We are hiring individual contributors at all experience levels. Compensation will be competitive
- As part of the interview process, you’ll complete a paid coding challenge designed to reflect typical daily tasks at SemiAnalysis
- Competitive Compensation depending on experience, skillset, location & business needs

Qualifications

- Proactive, self-motivated, and capable of working independently in a global team.
- Demonstrated experience in ML frameworks such as PyTorch or JAX through professional experience, personal projects, or personal Substack blogs
- Solid understanding of at least 1 of the following: transformer architecture, LLM parallelism strategies, and/or CUDA parallel programming
- Strong research skills and the ability to synthesize information from various sources to draw insights.
- English language proficiency required, Chinese language proficiency preferred

# Moving Towards a First-Class PyTorch Experience

Amazon has made a major course correction to its software strategy, and we believe it will meaningfully broaden Trainium3 adoption. TorchNeuron represents a native PyTorch experience instead of duct-taping Trainium onto PyTorch through the PyTorch/XLA project. The new backend is aimed at everyone who isn’t a frontier-lab kernel engineer. AWS has even hired the lead of Google’s native Torch on TPU effort to work on native Torch for Trainium. He was the TPU SW lead from the start of the program at Google, including XLA, xprof, Cloud TPU, etc.

The old approach made Trainium feel foreign to anyone coming from CUDA. PyTorch/XLA relied on lazy tensor graph capture and had no first-class eager mode. It also didn’t support PyTorch’s native distributed APIs (torch.distributed.*) or its native parallelism APIs (DTensor, SimpleFSDP, DDP). Users had to rely on out-of-tree XLA SPMD APIs such as torch_xla.experimental.spmd_fsdp and torch_xla.distributed.spmd. For researchers who are used to native PyTorch on CUDA, switching to Trainium meant relearning how to write a training loop.

[![](https://substackcdn.com/image/fetch/$s_!NSYi!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Feb846e38-260b-4211-9146-390bebf520bc_1446x1012.png)](https://substackcdn.com/image/fetch/$s_!NSYi!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Feb846e38-260b-4211-9146-390bebf520bc_1446x1012.png)

_caption:_ Source: AWS

The pain of converting GPU research codebases by adding XLA markers everywhere was a massive turnoff to anyone who used PyTorch/XLA before.

[![](https://substackcdn.com/image/fetch/$s_!IzTF!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F73ccd20a-b8b7-435f-8802-4960c36062d9_1126x668.png)](https://substackcdn.com/image/fetch/$s_!IzTF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F73ccd20a-b8b7-435f-8802-4960c36062d9_1126x668.png)

_caption:_ Source: AWS

At a high level, the only change needed is replacing .to(”cuda”) with .to(”neuron”), and in theory the vast majority of the PyTorch ATen operators will work decently well out of the box.

[![](https://substackcdn.com/image/fetch/$s_!OoTS!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85a8b8ec-1992-4b58-bb84-dc655d291eaf_526x329.png)](https://substackcdn.com/image/fetch/$s_!OoTS!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85a8b8ec-1992-4b58-bb84-dc655d291eaf_526x329.png)

_caption:_ Source: AWS

In theory, with PyTorch’s torch.accelerator hardware-agnostic API, lines of code like bf16 autocast won’t even need to be changed, though some APIs in PyTorch and some research codebases still haven’t migrated to the torch.accelerator namespace and still directly call the torch.cuda.* namespace.

As most academics and researchers across robotics, biotech, world models, and self-driving mainly use BF16, Trainium Torch will not support TorchAO MXFP8 on day 0 until they have made the BF16 training experience great. We don’t disagree with this sequence, as most people doing MXFP8 training are big Tier 1 labs that have enough kernel engineers to write custom kernels for the big training run.

# Trainium Torch Ecosystem

PyTorch is popular not only because of core PyTorch but also because of the entire ecosystem of libraries, including Hugging Face Transformers, PEFT, diffusers, TRL, Accelerate, TorchTitan, etc. We are amazed to see that Trainium Torch already supports a ton of these libraries in the ecosystem, including Hugging Face Accelerate, which an insane number of layers of indirection. Trainium supports one of the most popular clean open-source training codebases called TorchTitan with many Tier 2 labs forking it to serve as the foundation of their internal training codebase. Trainium’s new PyTorch experience fully supports that too.

We saw how Google was able to successfully partner with Inferact/RadixArk to bring TPUs into the vLLM/SGLang ecosystem, and also land Meta as a production TPU customer. Furthermore, by bringing TPUs into the vLLM/SGLang ecosystem, [TPUs were already able to automatically get day 0 support for Muse Spark Open](https://www.lmsys.org/blog/2026-10-15-meta-muse-spark-open#multi-platform-support) and commitments for day 0 TPU support for popular upcoming models.

While it is true that the increase in agentic coding has made the engine code itself less important, what vLLM/SGLang brings to the table is the ecosystem. No matter the open source model, on day 0, the global ML community trusts vLLM/SGLang as the go-to engine for inference. No vibe-coded engine has that reach.

[We are starting to see Trainium rapidly invest in the vLLM/SGLang community with hardware access and early access to Trainium on SGLang built on native PyTorch (TorchNeuron), similar to the TorchTPU approach.](https://x.com/sgl_project/status/2113299489394205121)

[![](https://substackcdn.com/image/fetch/$s_!iP2W!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F23423dd8-6352-4943-af4d-c303ca5ad2af_1492x1384.png)](https://substackcdn.com/image/fetch/$s_!iP2W!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F23423dd8-6352-4943-af4d-c303ca5ad2af_1492x1384.png)

_caption:_ Source: SemiAnalysis

# TorchTitan Experience

TorchTitan is one of the most popular open-source pre-training frameworks, and we tested Neuron’s support to gauge the user experience of a researcher training a non-trivial model with Trainium. Specifically, we trained a Qwen3-32B on 16 Trainium2 chips, 64 LNC=2 logical cores in total, and we also tried doing it on a rack-scale Trainium3 UltraServer with 64 physical chips.

Overall, we liked the user experience, though there were some rough edges that the Amazon team already has on its roadmap to fix.

While we will provide the Trainium2 MFU below for completeness, the part to focus on is that for ML research ablations, what matters most isn’t a speed-of-light-optimized stack but decent performance and broad support across model architecture modifications, so researchers can iterate without fighting the stack.

With Neuron’s official TorchTitan image, we were able to launch the run without any issues. We measured 11,099 tokens per second in average training throughput on eager mode, at 23.89% MFU. For compiled mode, we saw 14,156 tokens per second and 30.47% MFU, a 1.28x throughput improvement over eager mode. We tried changing the model architecture slightly in the modeling code and it worked great also.

Neuron also offers training recipes for more modern model architectures, so we tested its gpt-oss 20B training recipe. Neuron supports gpt-oss training through integration with [GraphTrainer](https://github.com/pytorch/torchtitan/blob/main/torchtitan/experiments/graph_trainer/README.md), TorchTitan’s experimental trainer module. Specifically, Neuron adds Trainium-compatible configurations of SimpleFSDP, a compilation backend for PyTorch computation graph capture, and custom NKI kernels for attention and MoE operations. In terms of user experience, the recipe worked out of the box, and everything went well.

One thing that was not yet implemented using the upstream APIs was TokenSwitch. In the age of MoE, for inference and training, MoE combine and MoE dispatch are among the most important comms ops and take anywhere from 60-70% of the communication volume, and TokenSwitch is PyTorch’s first-class API for them. Trainium doesn’t support it yet and instead relies on a custom TorchTitan class called NeuronEPTokenDispatcher. Moving it onto the TokenSwitch API looks like a simple fix, and the AWS team has committed to collaborating with the Meta PyTorch team to modify the TokenSwitch ABC such that it can support Trainium too.

The part where it was slightly disappointing was the Neuron compiler took a long time to compile, leading to a long wait in the first step. Concretely, the first step took 184.6 seconds for eager mode (255.7 seconds for compiled mode), which is 30-55x longer than the average step time, excluding the first step. For gpt-oss, this training run came at a ridiculously high compilation time of 27 minutes and 17 seconds, which leads to a terrible user experience, especially for researchers who experiment with new model architectures. The reason for this is that historically the Trainium compiler stack has mainly been focused on inference, where compile time doesn’t matter because compilation is done offline and cached once per image and doesn’t affect production inference, whereas in training it does. While this is the right call for inference at the time, for researchers iterating on model architecture, that’s a meaningful friction point.

The Neuron team is already addressing this directly. Upcoming TorchNeuron releases introduce a new compiler backend with a broad set of precompiled NKI kernels and a compile stack re-architected for fast compilation, targeting up to a 2 orders of magnitude reduction in time-to-first-step for both eager and compiled modes, with minimal or no performance regression. If they deliver on that, compilation time stops being a conversation.

# Training MatMul Performance

One of the most important things for experimental training is to have decent performance across a broad range of shapes as ML researchers try lots of different things. We benchmarked a single Trainium3 logical core (LNC=2) on the PyTorch nn.functional.linear API to understand its matrix multiplication performance, and we compared it with GB300 and B200 for reference. We swept through the matrix shapes of projection operations in major open weight models, and we set the M dimension to 1, 128, and 2048 to represent different batch size scenarios.

[![](https://substackcdn.com/image/fetch/$s_!bRyu!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b02cad9-f642-4bae-be70-4b2141f6a983_1980x1260.png)](https://substackcdn.com/image/fetch/$s_!bRyu!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b02cad9-f642-4bae-be70-4b2141f6a983_1980x1260.png)

_caption:_ Source: SemiAnalysis

In our benchmark, Trainium3 achieved a visibly higher MFU than GB300, starting from the mid-range, where the matrix multiplication performs 1 GFLOP of computation. It was only after 100 GFLOP that GB300 and B200 started outperforming Trainium3, and Trainium3 won again after 1 TFLOP.

# FlexAttention API

FlexAttention is a high-level API that allows implementing different attention variants using PyTorch, while offering backward pass auto-generation and reasonable performance. Good FlexAttention support shows a hardware’s flexibility and ease-of-use to researchers. We ran the [FlexAttention benchmark suite](https://github.com/meta-pytorch/attention-gym/blob/main/benchmarks/flex_perf.py) on Trainium3 to see its FlexAttention support.

[![](https://substackcdn.com/image/fetch/$s_!GgbZ!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd03ecc2c-c3cf-4424-a366-5a9d2bd037a6_1600x680.png)](https://substackcdn.com/image/fetch/$s_!GgbZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd03ecc2c-c3cf-4424-a366-5a9d2bd037a6_1600x680.png)

_caption:_ Source: SemiAnalysis

Overall, Trainium3 passed 89 out of 96 test cases, a 93% pass rate. All 7 failed cases were at large batch size (4) and sequence length (8192), and all failed due to compilation exceeding the time budget rather than numerical errors. These issues will be fixed in later versions of TorchNeuron.

Additionally, we tried implementing custom attention variants not in the FlexAttention benchmark suite for Trainium3, and it matched the numerics of Nvidia GPUs.

[![](https://substackcdn.com/image/fetch/$s_!BJnh!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa8cb4895-1a44-461d-838a-f13de37d3a8e_1600x680.png)](https://substackcdn.com/image/fetch/$s_!BJnh!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa8cb4895-1a44-461d-838a-f13de37d3a8e_1600x680.png)

_caption:_ Source: SemiAnalysis

# Automated Quality Assurance

SemiAnalysis is known in the global ML community to be the “CI Karen,” setting a high bar across all hardware vendors and doing whatever it takes to get senior leadership of AI chip companies to actually provide their engineers with enough resources and CI fleet to maintain a high bar of automated quality control.

[![](https://substackcdn.com/image/fetch/$s_!aaSF!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2ece87e1-1fd3-4bae-bd17-9fe9e28190e1_1040x598.png)](https://substackcdn.com/image/fetch/$s_!aaSF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2ece87e1-1fd3-4bae-bd17-9fe9e28190e1_1040x598.png)

_caption:_ Source: SemiAnalysis

One recent achievement, which took over 9 months of fighting with AMD senior leadership, was getting their engineers enough stable nodes to achieve 93% parity on gating test groups.

[![](https://substackcdn.com/image/fetch/$s_!jjqT!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F78c1bfee-bc21-46e5-bb7f-1abfe8ac31fe_2048x1065.png)](https://substackcdn.com/image/fetch/$s_!jjqT!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F78c1bfee-bc21-46e5-bb7f-1abfe8ac31fe_2048x1065.png)

_caption:_ Source: vLLM Dashboard

Inference is a narrow problem. A lab serving a handful of production models needs a forward pass, mostly fixed architectures, and a small set of hot kernels.

Training is a generality problem. Each of the thousands of operators needs a backward pass, and research codebases sometimes accidentally run operators in higher precision, which must also be supported. To ensure that Trainium works across a wide range of model architectures and can do eager mode and compile mode well, AWS collected a giant list of top 100k+ Hugging Face models that spread across a whole range of different normalization, MLP, MoE layouts and attention types. Not only do they test that it doesn’t crash, but they also test performance, which ops use CPU fallbacks and don’t have native support yet, where graph breaks are and most importantly, they test numerics against CPU and Nvidia baselines. They test tensor level parity and loss curve divergence also. It is easy to finish an exam within 10 minutes, but it doesn’t matter how fast you finish an exam if you get a 0% on it. Same thing with training stacks. It is easy to get decent MFU%, but it is hard to get decent MFU% while not introducing numeric issues.

[![](https://substackcdn.com/image/fetch/$s_!4yzy!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdb0a6c55-273d-4f78-9819-694f30224206_717x649.png)](https://substackcdn.com/image/fetch/$s_!4yzy!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdb0a6c55-273d-4f78-9819-694f30224206_717x649.png)

_caption:_ Source: AWS

Although the pass rates aren’t at 100% yet, what matters is the trajectory. AWS is climbing rapidly, with agent swarms systematically fixing the remaining failures. We think it’s a strength that AWS’s internal summary table, the one senior leadership sees, shows gaps transparently rather than hiding them.

We say this from experience. When SemiAnalysis and upstream maintainers have tried to fix quality control culture at other hardware vendors, we’ve found that senior leadership is genuinely shocked when shown the real parity pass rates. At one vendor in particular, there was so much middle management filtering that by the time CI numbers reached senior leadership, they showed 99.99%, while the actual gating parity pass rate at the time was below 5%.

# Neuron Explorer - Better than Nvidia and AMD Profilers

Trainium’s profiler is by far leading the industry and is SOTA status. Here we share our initial impressions and plan on sharing our full user experience in a future Trainium kernel article.

Trainium’s profiler is loved by all the performance engineers at Anthropic. Anthropic’s head of performance (who is ex-Jane and Finch Street) has publicly said that performance analysis on Trainium is way better than performance analysis on Nvidia GPUs (and obviously better than on AMD GPUs).

[![](https://substackcdn.com/image/fetch/$s_!qA-i!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fea535417-4c21-49ed-b9f9-c3c80eb222af_2048x822.png)](https://substackcdn.com/image/fetch/$s_!qA-i!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fea535417-4c21-49ed-b9f9-c3c80eb222af_2048x822.png)

_caption:_ Source: Tristan Hume on Twitter

We agree with Tristan Hume. In our experience, the profiling experience was amazing, after getting over the initial hump of the profiling setup being slightly confusing (but not impossible). There are multiple environment variables to set, different file types to save, and various commands to capture and view the profile traces. This is only the kernel profiling setup, and the PyTorch profiling setup is similar but with slight differences, making things even more confusing. With the help of Codex ([since Claude refuses to write Trainium kernels](https://x.com/jakehalloran1/status/2102480535369208157)), our best effort working setup is as follows:

- Launch a persistent Neuron Explorer server
- Profile the kernel with neuron-explorer capture command
- Upload the profile trace as an artifact to the Neuron Explorer server as a web request

We shared feedback with AWS that we wished the documentation could be clearer on the workflow, explaining what environment variables need to be set for what reasons, and what purpose each file type serves.

Once the setup is done, the profiler user experience is great. Neuron Explorer is co-designed with the hardware. We particularly like the timeline separating hardware units in different rows, so that bubbles are visible at a glance. In contrast, GPU programmers have to roll their own setup for intra-SM profiling as the official Nsight tools don’t support that.

[![](https://substackcdn.com/image/fetch/$s_!Fvcw!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2b780b6a-3587-41be-ac01-c268c4624261_1001x609.png)](https://substackcdn.com/image/fetch/$s_!Fvcw!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2b780b6a-3587-41be-ac01-c268c4624261_1001x609.png)

_caption:_ Source: SemiAnalysis

We also like how the viewer visualizes dependencies. When a block is selected, its dependencies and dependents light up in different colors, which helps us reason about work overlapping, e.g. whether computation sufficiently overlaps with memory loading. The image below shows that the selected white block is:

- Flow-dependent on the red block
- Order-dependent on the orange block
- A flow dependency of the blue block
- An output dependency of the purple block

![](https://substackcdn.com/image/fetch/$s_!lX4e!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9c749837-cde0-4015-8def-23186b72fc97_647x166.png)

_caption:_ Neuron Explorer dependency visualization. Source: SemiAnalysis

[![](https://substackcdn.com/image/fetch/$s_!MAqa!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd333f32c-4e37-489c-8281-b741310499d3_2048x924.png)](https://substackcdn.com/image/fetch/$s_!MAqa!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd333f32c-4e37-489c-8281-b741310499d3_2048x924.png)

_caption:_ Neuron Explorer code editor mapping. Source: SemiAnalysis

[![](https://substackcdn.com/image/fetch/$s_!aTZQ!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc19ace2d-f4ea-4fa5-8dcb-14dc63db54cf_1172x486.png)](https://substackcdn.com/image/fetch/$s_!aTZQ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc19ace2d-f4ea-4fa5-8dcb-14dc63db54cf_1172x486.png)

_caption:_ Neuron Explorer: Event information when hovering on an event. Source: SemiAnalysis

[![](https://substackcdn.com/image/fetch/$s_!KtJu!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F178ccf7f-c5f1-4763-8cea-921827276215_656x538.png)](https://substackcdn.com/image/fetch/$s_!KtJu!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F178ccf7f-c5f1-4763-8cea-921827276215_656x538.png)

_caption:_ Neuron Explorer memory bank utilization visualization. Source: SemiAnalysis

[![](https://substackcdn.com/image/fetch/$s_!VY_y!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa75e0579-f42c-49ba-96f5-336140a1fa4e_604x292.png)](https://substackcdn.com/image/fetch/$s_!VY_y!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa75e0579-f42c-49ba-96f5-336140a1fa4e_604x292.png)

_caption:_ Neuron Explorer microsecond-level memory throughput visualization. Source: SemiAnalysis

## Trainium Profiler Demo - Pixel Art

Neuron Explorer has many more features, including code editor mapping, MFU estimation, memory usage, and even creating pixel art due to how precise the profiler is. The images below are all from profiler traces of running on actual Trainium hardware, not fake profile reports. We were mainly inspired by the Bad Apple post from Daniel Liu (Anthropic Performance Engineer) and have created our own agentic coding [SKILL.md](http://skill.md) for creating images. We did not have the time yet to create one to automatically generate videos frame by frame but will in the future and open source this [SKILL.md](http://skill.md) for everyone to use. We mainly generate this pixel art by using the 16 DMA engines per physical core by “coloring in” regions by turning the DMA engines active, and the width of the shaded area is determined by how much data we have each DMA engine move.

[![](https://substackcdn.com/image/fetch/$s_!ea-N!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc62b77ad-11c6-4250-96d4-7e269fb46dff_2048x886.png)](https://substackcdn.com/image/fetch/$s_!ea-N!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc62b77ad-11c6-4250-96d4-7e269fb46dff_2048x886.png)

_caption:_ Bad Apple on Neuron Explorer. Source: Daniel Liu

[![](https://substackcdn.com/image/fetch/$s_!qsps!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc99913b4-6db5-45df-b4e8-4e1db122f915_2048x929.png)](https://substackcdn.com/image/fetch/$s_!qsps!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc99913b4-6db5-45df-b4e8-4e1db122f915_2048x929.png)

_caption:_ Visualizing the SemiAnalysis logo. Source: SemiAnalysis

[![](https://substackcdn.com/image/fetch/$s_!OgDQ!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7d1da3ef-a722-4275-9249-897009a7470a_1258x802.png)](https://substackcdn.com/image/fetch/$s_!OgDQ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7d1da3ef-a722-4275-9249-897009a7470a_1258x802.png)

_caption:_ Visualizing Jeff Bezos (pre looksmaxxing). Source: SemiAnalysis

[![](https://substackcdn.com/image/fetch/$s_!nRxA!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5811851d-661c-400e-85cf-ce78ca4f93aa_2064x1118.png)](https://substackcdn.com/image/fetch/$s_!nRxA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5811851d-661c-400e-85cf-ce78ca4f93aa_2064x1118.png)

_caption:_ Visualizing Dylan Patel (pre looksmaxxing). Source: SemiAnalysis

Since AWS is a partner of Nvidia, Jensen should tell his engineers to book a meeting with the AWS Trainium team on the hardware features needed to do accurate fine-grained profiling such that Nvidia can learn how to add this capability to Feynman or Feynman-Next GPUs.

[![](https://substackcdn.com/image/fetch/$s_!9bPt!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F45749adc-f952-40a7-a175-f4a5cd3e21d0_2048x1193.png)](https://substackcdn.com/image/fetch/$s_!9bPt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F45749adc-f952-40a7-a175-f4a5cd3e21d0_2048x1193.png)

_caption:_ Visualizing Jensen on Trainium3. Source: SemiAnalysis

Nvidia’s intra-kernel profiler Nsight Compute employs a different design. It offers aggregate metrics and detailed information on performance properties, rather than an event-based timeline viewer. The closest thing we found was Tri Dao’s QuACK intra-kernel profiler, which uses [Nvidia’s In-Kernel Event Tracing API](https://docs.nvidia.com/cutlass/latest/media/docs/pythonDSL/guides/iket_profiling.html). While QuACK requires custom design to make Perfetto visualize accordingly, it’s great to see that AWS made this a well-integrated, first-class experience in Neuron Explorer.

[![](https://substackcdn.com/image/fetch/$s_!oHdF!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F922100d3-ea70-4104-99e9-f2e6e069e6e1_2048x795.png)](https://substackcdn.com/image/fetch/$s_!oHdF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F922100d3-ea70-4104-99e9-f2e6e069e6e1_2048x795.png)

_caption:_ QuACK’s intra-kernel profiler: Visualization of a QuACK GEMM kernel. Source: QuACK

[![](https://substackcdn.com/image/fetch/$s_!24XK!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff3cbed7a-998a-454c-a7ad-485c0e8bb312_2048x1280.png)](https://substackcdn.com/image/fetch/$s_!24XK!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff3cbed7a-998a-454c-a7ad-485c0e8bb312_2048x1280.png)

_caption:_ Nsight Compute view of FlashAttention 4 workload analysis. Source: Nvidia Nsight

This post has bonus content for paid subscribers. Upgrade to get full access.

Subscribe
