---
source: "SemiAnalysis"
title: "GB200 Hardware Architecture - Component Supply Chain & BOM"
subtitle: "Hyperscale customization, NVLink Backplane, NVL36, NVL72, NVL576, PCIe Retimers, Switches, Optics, DSP, PCB, InfiniBand/Ethernet, Substrate, CCL, CDU, Sidecar, PDU, VRM, Busbar, Railkit, BMC"
date: "2024-07-17"
authors: ["Dylan Patel", "Wega Chu", "Chaolien Tseng", "Myron Xie", "Jeremie Eliahou Ontiveros", "Daniel Nishball"]
audience: "only_paid"
paywalled: true
wordcount: 10341
url: "https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component"
post_id: 175661160
captured_at: "2026-05-16T10:40:18.931645+00:00"
---

# GB200 Hardware Architecture - Component Supply Chain & BOM

_Hyperscale customization, NVLink Backplane, NVL36, NVL72, NVL576, PCIe Retimers, Switches, Optics, DSP, PCB, InfiniBand/Ethernet, Substrate, CCL, CDU, Sidecar, PDU, VRM, Busbar, Railkit, BMC_

**Authors:** Dylan Patel, Wega Chu, Chaolien Tseng, Myron Xie, Jeremie Eliahou Ontiveros, Daniel Nishball  
**Published:** 2024-07-17  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component

---

> **Paywalled.** Only the free preview is captured below. The Oracle should treat the subtitle and preview as the indicative thesis; do not assert claims that depend on the paywalled body.

Nvidia’s GB200 brings significant advances in performance via superior hardware architecture, but the deployment complexities rise dramatically. While on the face of it, Nvidia has released a standard rack that people will just install in their datacenters without much trouble, plug-and-play style, the reality is there are dozens of different deployment variants with tradeoffs and a significant complexity increase generation on generation. The supply chain gets reworked for end datacenter deployers, clouds, server OEMs / ODMs, and downstream component supply chains.
