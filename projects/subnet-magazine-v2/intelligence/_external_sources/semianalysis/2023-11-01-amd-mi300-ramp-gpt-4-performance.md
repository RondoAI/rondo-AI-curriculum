---
source: "SemiAnalysis"
title: "AMD MI300 Ramp, GPT-4 Performance, ASP & Volumes"
subtitle: "Order Volumes From Microsoft, Meta, Oracle, Google, Supermicro/Quanta direct, Amazon"
date: "2023-11-01"
authors: ["Dylan Patel", "Myron Xie"]
audience: "only_paid"
paywalled: true
wordcount: 1010
url: "https://newsletter.semianalysis.com/p/amd-mi300-ramp-gpt-4-performance"
post_id: 175661067
captured_at: "2026-05-16T10:50:58.214964+00:00"
---

# AMD MI300 Ramp, GPT-4 Performance, ASP & Volumes

_Order Volumes From Microsoft, Meta, Oracle, Google, Supermicro/Quanta direct, Amazon_

**Authors:** Dylan Patel, Myron Xie  
**Published:** 2023-11-01  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/amd-mi300-ramp-gpt-4-performance

---

> **Paywalled.** Captured below is the free preview Substack renders publicly (7,100 chars of body markdown). For long-form analyses this is typically 70 to 90 percent of the article, with the final deep-dive section paywalled. The Oracle may cite the captured content; do not assert claims that depend on the paywalled tail (look for a 'This post is for paid subscribers' marker at the end of the body).

AMD’s upcoming MI300 is poised as the only legitimate competitor to Nvidia and Google hardware in LLM inference. Groq, SambaNova, Intel, Amazon, Microsoft Athena, etc still do not compete. To enable this AMD has been investing heavily into their own RoCM software, the PyTorch ecosystem, and OpenAI’s Triton.

[![How Nvidia’s CUDA Monopoly In Machine Learning Is Breaking - OpenAI Triton And PyTorch 2.0](https://substackcdn.com/image/fetch/$s_!xonX!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F51ab7c47-08db-42c9-8001-e195184d2a17_936x474.jpeg) How Nvidia’s CUDA Monopoly In Machine Learning Is Breaking - OpenAI Triton And PyTorch 2.0Dylan Patel](https://www.semianalysis.com/p/nvidiaopenaitritonpytorch)·January 16, 2023[Read full story](https://www.semianalysis.com/p/nvidiaopenaitritonpytorch)

In the above we wrote about the software issues and how they were being solved as well as MI300’s primary customers, advantages, and use cases (LLM Inference) in January. This has started to come to true with firms like [Databricks](https://www.databricks.com/blog/training-llms-scale-amd-mi250-gpus), [AI21](https://blog.allenai.org/announcing-ai2-olmo-an-open-language-model-made-by-scientists-for-scientists-ab761e4e9b76), [Lamini](https://www.lamini.ai/blog/lamini-amd-paving-the-road-to-gpu-rich-enterprise-llms), [Moreph, and Korea Telecom (KT)](https://moreh.io/blog/training-221b-parameter-korean-llm-on-1200-amd-mi250-gpu-cluster-230814)using AMD GPUs for inference/training.

We detailed the MI300 architecture in June, where we reiterated those above points and dove much deeper into cost, networking, and the various configurations. Today we also want to note GPT-4 performance for MI300.

[![AMD MI300 – Taming The Hype – AI Performance, Volume Ramp, Customers, Cost, IO, Networking, Software](https://substackcdn.com/image/fetch/$s_!BwGD!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F475bbd25-8616-45ea-a880-6d596eef3cda_3016x2120.png) AMD MI300 – Taming The Hype – AI Performance, Volume Ramp, Customers, Cost, IO, Networking, SoftwareDylan Patel](https://www.semianalysis.com/p/amd-mi300-taming-the-hype-ai-performance), [George Cozma](https://substack.com/profile/132737451-george-cozma), and [Gerald Wong](https://substack.com/profile/135179316-gerald-wong)·June 12, 2023[Read full story](https://www.semianalysis.com/p/amd-mi300-taming-the-hype-ai-performance)

Companies such as Microsoft, Meta, Oracle, Google, Supermicro/Quanta direct, Amazon and more have already placed varying amounts of orders for MI300. We will detail the volumes, gross margins, and average price for these below, but first let’s talk about what AMD officially says.

> Based on the rapid progress we are making with our AI road map execution and purchase commitments from cloud customers, we now expect Datacenter GPU revenue to be approximately $400 million in the fourth quarter and exceed $2 billion in 2024 as revenue ramps throughout the year. This growth would make MI300 the fastest product to ramp to $1 billion in sales in AMD history. I look forward to sharing more details on our progress at our December AI event.Lisa Su, AMD CEO

Note she is actually sandbagging MI300 here by only saying >$2 billion. We will share our numbers below, but note there is supreme visibility due to AMD MI300’s complicated supply chain, it takes ~7 months for AMD to actually have a MI300X 8 GPU Baseboard to ship from the moment TSMC starts working on the wafers.

Positing away from AMD’s current

![](https://substackcdn.com/image/fetch/$s_!4myy!,w_728,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5e8343b-6377-4a84-bbf2-69f7cf841403_2658x1256.png)

There are two angles to go at to arrive at AMD’s revenue from MI300 next year. These are how much supply AMD can secure, and how much major customers will order.

On the supply side, our AI Accelerator model accounts for HBM volumes by memory manufacturer, CoWoS volumes, packaging yields, and more for every accelerator that is produced using CoWoS including those for Nvidia, AMD, Google/Broadcom, Meta/Broadcom, Intel/AlChip, Amazon/AlChip, Amazon/Marvell, Microsoft/GUC, and more.

[![AI Capacity Constraints - CoWoS and HBM Supply Chain](https://substackcdn.com/image/fetch/$s_!mcPz!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7200eed5-4750-42ef-9709-755af8ec5f0e_2387x2025.png) AI Capacity Constraints - CoWoS and HBM Supply ChainDylan Patel](https://www.semianalysis.com/p/ai-capacity-constraints-cowos-and), [Myron Xie](https://substack.com/profile/152214948-myron-xie), and [Gerald Wong](https://substack.com/profile/135179316-gerald-wong)·July 5, 2023[Read full story](https://www.semianalysis.com/p/ai-capacity-constraints-cowos-and)

We have updated this regularly for client, but this gives us a total units that AMD can ship by quarter. Note there is a lag on TSMC N5/N6 wafer production, SoIC reconstituted wafer production, CoWoS wafer production, GPU package shipment, testing, and 8-GPU baseboard production. The orders were placed quite some time ago in order to achieve the volumes we will discuss below, especially due to supply constraints on HBM and CoWoS.

The other side is that of customers. Microsoft, Meta, Oracle, Google, Supermicro/Quanta direct, and Amazon are the primary vectors of orders, but there are also some orders from other parts of the supply chain as well including some for the MI300A in HPC style applications. Meshing these together, we get to the picture of AMD being supply constrained until Q3, then being oversupplied in Q4. Our demand side modelling accounts for the Nvidia B100 accelerated timing.

[![Nvidia’s Plans To Crush Competition – B100, “X100”, H200, 224G SerDes, OCS, CPO, PCIe 7.0, HBM3E](https://substackcdn.com/image/fetch/$s_!g9EU!,w_140,h_140,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F486c51a2-195a-4d4a-ba7a-281140c9bf64_2208x1230.png) Nvidia’s Plans To Crush Competition – B100, “X100”, H200, 224G SerDes, OCS, CPO, PCIe 7.0, HBM3EDylan Patel](https://www.semianalysis.com/p/nvidias-plans-to-crush-competition) and [Myron Xie](https://substack.com/profile/152214948-myron-xie)·October 10, 2023[Read full story](https://www.semianalysis.com/p/nvidias-plans-to-crush-competition)

Now onto the numbers including volumes, gross margins, and ASPs. We will also discuss MI350X and MI400 briefly.

[Get 20% off a group subscription](https://newsletter.semianalysis.com/subscribe?group=true&coupon=fe141654)

## This post is for paid subscribers

[Subscribe](https://newsletter.semianalysis.com/subscribe?simple=true&next=https%3A%2F%2Fnewsletter.semianalysis.com%2Fp%2Famd-mi300-ramp-gpt-4-performance&utm_source=paywall&utm_medium=web&utm_content=175661067)
