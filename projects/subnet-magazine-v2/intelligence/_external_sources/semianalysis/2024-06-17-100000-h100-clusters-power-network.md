---
source: "SemiAnalysis"
title: "100,000 H100 Clusters: Power, Network Topology, Ethernet vs InfiniBand, Reliability, Failures, Checkpointing"
subtitle: "Frontier Model Scaling Challenges and Requirements, Fault Recovery through Memory Reconstruction, Rack Layouts"
date: "2024-06-17"
authors: ["Dylan Patel", "Daniel Nishball"]
audience: "only_paid"
paywalled: true
wordcount: 5189
url: "https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network"
post_id: 175661158
captured_at: "2026-05-16T10:40:18.932201+00:00"
---

# 100,000 H100 Clusters: Power, Network Topology, Ethernet vs InfiniBand, Reliability, Failures, Checkpointing

_Frontier Model Scaling Challenges and Requirements, Fault Recovery through Memory Reconstruction, Rack Layouts_

**Authors:** Dylan Patel, Daniel Nishball  
**Published:** 2024-06-17  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network

---

> **Paywalled.** Only the free preview is captured below. The Oracle should treat the subtitle and preview as the indicative thesis; do not assert claims that depend on the paywalled body.

There is a camp that feels AI capabilities have stagnated ever since GPT-4’s release. This is generally true, but only because no one has been able to massively increase the amount of compute dedicated to a single model. Every model that has been released is roughly GPT-4 level (~2e25 FLOP of training compute). This is because the training compute dedicated to these models have also been roughly the same level. In the case of Google’s Gemini Ultra, Nvidia Nemotron 340B, and Meta LLAMA 3 405B, the FLOPS dedicated were of similar magnitude or even higher when compared to GPT-4, but an inferior architecture was utilized, resulting in these models falling short of unlocking new capabilities.
