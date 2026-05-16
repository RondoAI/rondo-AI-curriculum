---
source: "SemiAnalysis"
title: "Dissecting Nvidia Blackwell - Tensor Cores, PTX Instructions, SASS, Floorsweep, Yield"
subtitle: "Microbenchmarking, tcgen05, 2SM MMA, UMMA, TMA, LDGSTS, UBLKCP, Speed of Light, Distributed Shared Memory, GPC Floorsweeps, SM Yield"
date: "2026-03-31"
authors: ["Kimbo Chen", "Dylan Patel"]
audience: "only_paid"
paywalled: true
wordcount: 4196
url: "https://newsletter.semianalysis.com/p/dissecting-nvidia-blackwell-tensor"
post_id: 191922559
captured_at: "2026-05-16T10:40:17.250737+00:00"
---

# Dissecting Nvidia Blackwell - Tensor Cores, PTX Instructions, SASS, Floorsweep, Yield

_Microbenchmarking, tcgen05, 2SM MMA, UMMA, TMA, LDGSTS, UBLKCP, Speed of Light, Distributed Shared Memory, GPC Floorsweeps, SM Yield_

**Authors:** Kimbo Chen, Dylan Patel  
**Published:** 2026-03-31  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/dissecting-nvidia-blackwell-tensor

---

> **Paywalled.** Only the free preview is captured below. The Oracle should treat the subtitle and preview as the indicative thesis; do not assert claims that depend on the paywalled body.

Nvidia’s Datacenter Blackwell GPU (SM100) represents one of the largest GPU microarchitecture change in a generation, yet no detailed whitepaper exists. Until today, there is no public datacenter Blackwell architecture microbenchmarking study on PTX and SASS instructions, such as UMMA and TMA, with a focus on AI workloads.
