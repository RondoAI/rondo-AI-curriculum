---
source: "SemiAnalysis"
title: "AMD MI300 Performance - Faster Than H100, But How Much?"
subtitle: "MI400 Broadcom + AMD Anti-Nvidia Alliance Coming With UEC and Open XGMI"
date: "2023-12-06"
authors: ["Dylan Patel", "Daniel Nishball"]
audience: "only_paid"
paywalled: true
wordcount: 1049
url: "https://newsletter.semianalysis.com/p/amd-mi300-performance-faster-than"
post_id: 175661072
captured_at: "2026-05-16T10:50:49.763297+00:00"
---

# AMD MI300 Performance - Faster Than H100, But How Much?

_MI400 Broadcom + AMD Anti-Nvidia Alliance Coming With UEC and Open XGMI_

**Authors:** Dylan Patel, Daniel Nishball  
**Published:** 2023-12-06  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/amd-mi300-performance-faster-than

---

> **Paywalled.** Captured below is the free preview Substack renders publicly (9,654 chars of body markdown). For long-form analyses this is typically 70 to 90 percent of the article, with the final deep-dive section paywalled. The Oracle may cite the captured content; do not assert claims that depend on the paywalled tail (look for a 'This post is for paid subscribers' marker at the end of the body).

Today MI300X is finally released and it’s coming out with a bang. There’s a lot of customers announced, [which we discussed volumes and ASP of here, including folks like Oracle, Meta, and Microsoft](https://www.semianalysis.com/p/amd-mi300-taming-the-hype-ai-performance). We posted the [configuration and architecture back in June](https://www.semianalysis.com/p/amd-mi300-taming-the-hype-ai-performance), so while there are new low level architecture details at the end of this today we will mostly focus on performance, cost, and software. Also big news on the AMD + Broadcom anti-Nvidia alliance.

On raw specs, MI300X dominates H100 with 30% more FP8 FLOPS, 60% more memory bandwidth, and more than 2x the memory capacity. Of course, MI300X sells more against H200, which narrows the gap on memory bandwidth to the single digit range and capacity to less than 40%. MI300X unfortunately was only able to hit 5.3TB/s of memory bandwidth instead of the 5.6TB/s initially targeted.

[![](https://substackcdn.com/image/fetch/$s_!1ILh!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9553eb31-bf4c-4fa5-a6f9-5de1191af2f1_2018x1134.png)](https://substackcdn.com/image/fetch/$s_!1ILh!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9553eb31-bf4c-4fa5-a6f9-5de1191af2f1_2018x1134.png)

Of course FLOPS, capacity, and bandwidth are only potential capabilities. AMD showed a few different benchmarks, the main theme is they are still quite a bit under on peak performance versus theoretical.

- FlashAttention2 - This is forward pass only, IE inference, not training. It’s noteworthy as almost every benchmark AMD shared was forward pass only. The performance advantage is 10% to 20%, far short of the raw specs.
- LLAMA2-70B - Again forward pass only for certain kernels, not the full model, and again 10% to 20% performance. These are more compute bound workloads, not memory bound.
[![](https://substackcdn.com/image/fetch/$s_!KN91!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff8863275-655f-428a-83b0-0113a27c1ce6_4690x2000.png)](https://substackcdn.com/image/fetch/$s_!KN91!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff8863275-655f-428a-83b0-0113a27c1ce6_4690x2000.png)

Inference on the other hand, AMD showed two different inference benchmarks, one was high batch size and throughput, the other was lowest latency possible.

- Bloom - This benchmark is the most impressive of them all, but we think it is one of the classic tricks we have seen other firms do when they have a memory capacity advantage. Use a model that barely fits in the inference system, in this case, Bloom takes a bit over 350GB of memory of the 640GB that the H100 HGX has. Then you use a very large input sequence length (2k in this case) relative to the output token count (100). The system with smaller memory size is forced to run with a much smaller batch size because the KVCache takes up all the memory capacity. Meanwhile AMD can use a larger batch size to leverage their compute. To be clear, this is a real advantage and the throughput focused scenario is real, but it is an edge case.
- LLAMA 2-70B - This is a more realistic inference benchmark for most use cases. AMD has a 40% latency advantage which is very reasonable given their 60% bandwidth advantage vs H100. Given H200 comes a lot closer in bandwidth we expect it to perform similarly. Note AMD used VLLM for Nvidia which is the best open stack for throughput, but Nvidia’s closed source TensorRT LLM is just as easy to use and has somewhat better latency on H100.
[![](https://substackcdn.com/image/fetch/$s_!PLNX!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe22ed839-adcb-4791-88a2-88501cbfbc92_4666x2000.png)](https://substackcdn.com/image/fetch/$s_!PLNX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe22ed839-adcb-4791-88a2-88501cbfbc92_4666x2000.png)

The last benchmark is LLAMA 2 -13B. The performance improvement is 20% here, not much to caveat here. MI300X is cheaper. H200 likely closes the gap.

[![](https://substackcdn.com/image/fetch/$s_!_GFH!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0cc1a792-b27d-4695-95ba-e54a464a6625_2707x1160.png)](https://substackcdn.com/image/fetch/$s_!_GFH!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0cc1a792-b27d-4695-95ba-e54a464a6625_2707x1160.png)

On to training. AMD shows a bit of weakness from their software stack here. They only achieves less than 30% of the theoretical FLOPS that MI300 is capabile. Meanwhile Nvidia frequently achieves 40%. As such performance is lacking.

Their performance matches Nvidia because of a few reasons. One of the chief reasons is that AMD only gets about half the theoretical FLOPS in raw GEMM workloads. The other is that FlashAttention2 does not work well on the backward pass still. It is coming, but there are architectural differences that make it tough. AMD’s L1 cache is doubled, but the LDS is still the same size. This is still tougher to make FA2 work versus Nvidia’s larger sharedmem.

[![](https://substackcdn.com/image/fetch/$s_!KN1s!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3dc745f2-525a-4d47-95fe-bb6be21fb437_6300x2700.png)](https://substackcdn.com/image/fetch/$s_!KN1s!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3dc745f2-525a-4d47-95fe-bb6be21fb437_6300x2700.png)

Overtime, we expect this to improve meaningfully. That’s the big bright spot to these numbers, we see AMD rapidly improving.

[![How Nvidia’s CUDA Monopoly In Machine Learning Is Breaking - OpenAI Triton And PyTorch 2.0](https://substackcdn.com/image/fetch/$s_!xonX!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F51ab7c47-08db-42c9-8001-e195184d2a17_936x474.jpeg) How Nvidia’s CUDA Monopoly In Machine Learning Is Breaking - OpenAI Triton And PyTorch 2.0Dylan Patel](https://www.semianalysis.com/p/nvidiaopenaitritonpytorch)·January 16, 2023[Read full story](https://www.semianalysis.com/p/nvidiaopenaitritonpytorch)

In general, we are watching Triton performance getting better, especially for raw GEMM.

> OpenAI is working with AMD in support of an open ecosystem. We plan to support AMD’s GPUs including MI300 in the standard Triton distribution starting with the upcoming 3.0 release.Philippe Tillet, OpenAI

This is a big deal as OpenAI and Microsoft will be using AMD MI300 heavily for inference.

Also, to be clear eager mode and torch.compile just work for most models in training, fine tuning, and inference for most existing models just work out the box, but what’s lacking is performance optimization. We see it happening.

![](https://substackcdn.com/image/fetch/$s_!pg9Q!,w_474,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F680a61b1-68e2-472e-9a5b-c88a93547d5a_4666x2000.png)

![](https://substackcdn.com/image/fetch/$s_!RWYG!,w_474,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc452c1ef-555c-4c51-ad5e-8dad2da30b6f_4666x2000.png)

![](https://substackcdn.com/image/fetch/$s_!TSPT!,w_474,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff39d6ba0-38bf-488b-929d-b19a01f7625e_4666x2000.png)

![](https://substackcdn.com/image/fetch/$s_!sDel!,w_720,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F41129427-c105-4cae-8b9e-31333895777d_4666x2000.png)

![](https://substackcdn.com/image/fetch/$s_!v_Ni!,w_720,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4caa90d1-7351-4aff-8355-b1cc122cc978_4666x2000.png)

In a handful of months we’d bet AMD’s performance keeps growing versus the H100. While H200 is a reset, MI300 should still win overall with more software optimization.

[![AMD MI300 Ramp, GPT-4 Performance, ASP & Volumes](https://substackcdn.com/image/fetch/$s_!_o3-!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb46ecd95-442f-47ef-b84b-28b8c55e1ecd_1792x1024.png) AMD MI300 Ramp, GPT-4 Performance, ASP & VolumesDylan Patel](https://www.semianalysis.com/p/amd-mi300-ramp-gpt-4-performance) and [Myron Xie](https://substack.com/profile/152214948-myron-xie)·November 1, 2023[Read full story](https://www.semianalysis.com/p/amd-mi300-ramp-gpt-4-performance)

The more important thing is OEMs and clouds. Microsoft of course is supporting. Oracle will also be supporting as we noted in the pand they also announced customers such as Databricks (MosaicML).

But they aren’t the only ones.

## This post is for paid subscribers

[Subscribe](https://newsletter.semianalysis.com/subscribe?simple=true&next=https%3A%2F%2Fnewsletter.semianalysis.com%2Fp%2Famd-mi300-performance-faster-than&utm_source=paywall&utm_medium=web&utm_content=175661072)
