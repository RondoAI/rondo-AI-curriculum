---
source: "SemiAnalysis"
title: "Meta’s Bizarre AI Infrastructure Choice Costs Them $100s of Millions"
subtitle: "Meta is paying more for the same performance at higher power."
date: "2023-05-06"
authors: ["Dylan Patel", "Gerald Wong"]
audience: "only_paid"
paywalled: true
wordcount: 1366
url: "https://newsletter.semianalysis.com/p/metas-bizarre-ai-infrastructure-choice"
post_id: 175661020
captured_at: "2026-05-16T10:53:15.252999+00:00"
---

# Meta’s Bizarre AI Infrastructure Choice Costs Them $100s of Millions

_Meta is paying more for the same performance at higher power._

**Authors:** Dylan Patel, Gerald Wong  
**Published:** 2023-05-06  
**Audience:** only_paid  
**URL:** https://newsletter.semianalysis.com/p/metas-bizarre-ai-infrastructure-choice

---

> **Paywalled.** Captured below is the free preview Substack renders publicly (2,730 chars of body markdown). For long-form analyses this is typically 70 to 90 percent of the article, with the final deep-dive section paywalled. The Oracle may cite the captured content; do not assert claims that depend on the paywalled tail (look for a 'This post is for paid subscribers' marker at the end of the body).

Meta is squarely in the top 3 for AI capabilities, after Microsoft/OpenAI and Google. They have innovated and brought to market many pieces of software, including [PyTorch](https://www.semianalysis.com/p/nvidiaopenaitritonpytorch), [LLAMA](https://ai.facebook.com/blog/large-language-model-llama-meta-ai/), [Cicero](https://ai.facebook.com/research/cicero/diplomacy/), the [most advanced deep learning recommendation models](https://arxiv.org/pdf/2104.05158.pdf), [RecD](https://research.facebook.com/publications/recd-deduplication-for-end-to-end-deep-learning-recommendation-model-training-infrastructure/), [Segment Anything](https://ai.facebook.com/blog/segment-anything-foundation-model-image-segmentation/), and more. It should be no surprise, then, that Meta also has one of the largest AI infrastructures. In fact, our data shows that Meta will purchase more Nvidia H100 GPUs this year than any other company, including Microsoft. Despite this, everything at Meta is not all is sunshine and rainbows.

Meta has historically made very odd AI infrastructure choices. First, they overly relied on CPUs for smaller recommendation models despite GPUs being far superior on a total cost of ownership basis. Then they fumbled their efforts on 7nm-based internal AI silicon with programs that were, by any reasonable definition, failures.

While Meta finally going all in on Nvidia GPUs…

> We've shifted the models from being more CPU-based to being GPU-based. The current surge in CapEx is really due to the building out of AI infrastructure, which we really began last year and are continuing into this year.[Meta Earnings Call February 2023](https://s21.q4cdn.com/399680738/files/doc_financials/2022/q4/META-Q4-2022-Earnings-Call-Transcript.pdf)

That doesn’t mean their bizarre infrastructure choices have stopped occurring. Meta is currently deploying billions of dollars of servers with silicon that increases costs, increases power, and, worst of all, reduces performance by increasing latency. The benefits of this infrastructure choice range from very limited to non-existent, and it will cost them hundreds of millions of dollars to implement.

Today we want to dive into Meta’s bizarre choice and explain why they made it. We also want to explain the alternative. Lastly, we want to dive into the adoption of that alternative at firms like Microsoft.

[Get 20% off a group subscription](https://newsletter.semianalysis.com/subscribe?group=true&coupon=fe141654)

## This post is for paid subscribers

[Subscribe](https://newsletter.semianalysis.com/subscribe?simple=true&next=https%3A%2F%2Fnewsletter.semianalysis.com%2Fp%2Fmetas-bizarre-ai-infrastructure-choice&utm_source=paywall&utm_medium=web&utm_content=175661020)
