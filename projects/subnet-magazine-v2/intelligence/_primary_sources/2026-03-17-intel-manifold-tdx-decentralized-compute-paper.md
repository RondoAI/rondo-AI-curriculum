# Decentralized Compute on Untrusted Hardware Using Intel® TDX and Encrypted CVMs

**Source:** Intel Community Blog, posted by Sathi Nair (Intel Employee), Mar 17 2026
**URL pattern:** community.intel.com (Security category, 126 discussions section)
**Passed to Subnet Magazine on 2026-05-16 by Rondo, preserved as primary source**

**Authors (joint):**
- Manifold Labs: Venish Patidar, Dhruv Bindra, Ahmed Darwich, Josh Brown
- Intel: Haidong Xia, Sathi Nair

**This is the single most important primary source the magazine has received today.**

A Big Tech enterprise (Intel) publishing on its own official property a joint technical paper that names a Bittensor subnet (Targon / SN4 / Manifold Labs) as the system being described. This is the highest-tier enterprise validation any subnet has received to date, and it goes well beyond the "Intel co-authored paper" mention in the earlier @taomedia_ article and the WSB thesis. We now have the actual paper, with the CEO of Manifold on the record.

---

## Abstract (verbatim)

> "The rapid growth of artificial intelligence workloads has generated an unprecedented demand for secure and scalable compute resources. However, centralized cloud providers continue to dominate both pricing and security models. In an increasingly competitive AI landscape, where the compromise of training data or model weights can confer a significant advantage, there is a critical need for a computing infrastructure that safeguards data at rest, in transit, and in use, while remaining affordable and broadly accessible. Furthermore, existing GPU cluster offerings (e.g., 8xH100s, 8xH200s, 8xB200s) create financial barriers that limit access for organizations, startups, and independent researchers seeking secure, high-performance computing environments.
>
> This paper introduces a decentralized, confidential computing platform that leverages Intel® Trust Domain Extensions (TDX), Intel® Trust Authority (ITA) and NVIDIA Confidential Computing (CC) to establish a distributed ecosystem of fully encrypted Confidential Virtual Machines (CVMs). The proposed architecture incentivizes hardware providers to contribute Intel TDX capable compute resources. Each participating provider is provisioned with a freshly instantiated, uniquely encrypted Ubuntu 24.04 CVM, providing data protection across all stages, at rest, in transit, and in use."

---

## The CEO quote (the most quotable single artifact today)

Robert Myers, CEO of Manifold Labs, on the record in an Intel paper:

> "The primary challenge in building the Targon Virtual Machine was ensuring confidential computation across untrusted operators (hardware providers) without sacrificing performance. We require strong hardware-rooted isolation and portable attestation that could integrate directly into our network's validation logic. Intel TDX enables secure VM isolation with minimal overhead, while Intel Trust Authority provides verifiable remote attestation that can be embedded into validator workflows. This combination allows us to establish strong trust assurances at the protocol level rather than relying on operator reputation."

This is the single most valuable founder quote the magazine has received today. The CEO of a Bittensor subnet (Targon / SN4) explaining the technical foundation of their product, published in an Intel-authored paper on Intel's own property. There is no higher provenance bar in the Bittensor ecosystem right now.

---

## The 4 roles in the system

1. **Decentralized hardware providers** contribute confidential-compute-capable resources
2. **Decentralized validators** perform continuous attestation and security verification
3. **Users** submit workloads requiring strong confidentiality protection
4. **The Targon platform** coordinates provisioning, verification, scheduling, and incentives

---

## The 5 architectural layers (verbatim section structure)

### 3.1 Hardware Selection and Compute Layer
- Intel TDX-capable CPUs: 5th/6th Gen Xeon "Emerald Rapids / Granite Rapids"
- NVIDIA Confidential Computing GPUs: Hopper H100/H200, Blackwell B200 series
- These configurations launch every Confidential VM with hardware-rooted memory encryption, protected execution context, cryptographically isolated address space from the host

### 3.2 Confidential VM Provisioning (Targon Image Gateway)
- Provisioning pipeline begins by cloning a "golden base image" (hardened Ubuntu 24.04 with NVIDIA drivers + confidential-compute-ready configurations)
- QCOW2 image encrypted with a randomly generated per-VM disk key
- Key stored in Intel ITA Key Broker Service (KBS), released only after successful remote attestation
- Pipeline injects Manifold's Attestation Agent + Targon operational runtime services
- Deterministically computes the expected Intel TDX measurement of the CVM boot chain
- Records the measurement in KBS, cryptographically associated with the per-VM disk decryption key
- Delivers launch artifacts: launch script configuring GPUs in Protected PCIe (PPCIe) mode + TDX-compatible OVMF firmware

### 3.3 Attestation Workflows
- Boot-time attestation: Manifold Attestation Agent in initramfs collects TDX measurement registers, generates an attestation quote, submits to Targon KBS → forwarded to Intel Trust Authority for verification
- Only on successful attestation + matching measurements is the disk decryption key released
- Key released bound to the requesting Manifold Attestation Agent and the attested execution context
- If any component of the boot chain has been modified, attestation fails, key is not released, disk remains encrypted, VM launch is halted
- IP-based node binding: KBS permanently binds the CVM to the hardware provider's network identity on first successful attestation. All subsequent attestation requests must originate from the same IP.
- Continuous re-attestation: every block interval (~72 minutes). Each round is challenge-response: validator issues a cryptographic nonce, CVM includes the nonce in the attestation payload to prevent replay
- Multi-layer attestation: NVIDIA nvtrust attestation produces a signed report confirming all attached GPUs are genuine NVIDIA hardware in CC mode → embedded into the user data field of the Intel TDX quote (this is the "unified attestation" the paper names) → submitted to validator → forwarded to Targon KBS → submitted to Intel Trust Authority for verification → ITA returns signed JWT confirming authenticity → KBS performs its own validation

### 3.4 Incentive Layer
- At the start of each interval (~72 minutes), validators query Targon's Tower service to retrieve: incentive pool, target nodes, price targets, caps
- Validators calculate each node's contribution relative to total compute and report as weights on-chain
- Blockchain aggregates weights across all validators, computes stake-weighted average per provider
- Payouts automatically distributed according to consensus

### 3.5 Decentralized Orchestration Layer
- Once validated, a CVM automatically joins a private WireGuard-based mesh network
- On top of the secure overlay, Targon operates a Kubernetes control plane; each CVM registers as a worker node
- All platform workloads (GPU rentals, serverless execution, managed inference) are deployed as Kubernetes workloads
- Only continuously attested nodes admitted to the scheduling pool
- If a CVM fails attestation, becomes unreachable, or fails: immediately removed from pool, Kubernetes reschedules workloads onto other attested nodes

---

## The threat model (section 4, verbatim structure)

### 4.1 Adversary model assumes a strong, adaptive adversary that:
- Possesses full physical control of the host machine
- Controls the host operating system, hypervisor, BIOS, firmware
- Can arbitrarily start, stop, snapshot, replay VM images
- Can observe all network traffic entering and leaving the host
- Can attempt to migrate, clone, or replay encrypted VM disks
- Can collude with other providers or external entities
- Can observe, delay, drop, or replay network messages
- Cannot break standard cryptographic primitives

### 4.2 Trust assumptions (what IS trusted)
- Intel TDX and NVIDIA Confidential Computing
- Intel Trust Authority for quote verification + token issuance
- NVIDIA GPU attestation mechanisms
- Hash functions, digital signatures, encryption schemes

### 4.3 Security goals (5 enforced properties)
1. Confidentiality of workloads
2. Integrity of execution
3. Authenticity of execution environment
4. Non-migratability (IP-binding)
5. Continuous trust enforcement

### 4.4 In-scope attacks and mitigations (verbatim table)

| Attack Vector | Mitigation |
|---|---|
| Disk inspection or modification | Per-VM disk encryption; decryption keys released only after successful attestation |
| VM replay on different hardware | IP-based node binding enforced by the Key Broker Service (KBS) |
| Boot-chain tampering | Verification of TDX measurement registers during attestation |
| GPU memory inspection | NVIDIA Confidential Computing with Protected PCIe (PPCIe) |
| Attestation replay | Fresh attestation quotes using validator nonces (challenge-response) and continuous re-attestation |

### 4.5 Out-of-scope threats
- Compromise of Intel Trust Authority or NVIDIA root signing keys
- Microarchitectural attacks not covered by Intel TDX or NVIDIA CC threat models
- Denial-of-service attacks by infrastructure providers (e.g., powering off hardware)

---

## The closing strategic framing (verbatim)

> "Importantly, this architecture from Manifold Labs makes premium, enterprise-grade compute accessible at a fraction of the traditional cost. Researchers, startups, small enterprises, and independent developers, who are often unable to afford conventional high-end cloud offerings, can now deploy protected, confidential workloads on high-performance hardware. By combining hardware-rooted confidentiality, verifiable attestation, decentralized orchestration, and economic incentives, the proposed platform demonstrates a practical and scalable model for secure, decentralized AI and high-performance computing, paving the way for a more open, equitable, and sustainable computational landscape."

Future work flagged: "a user-facing approach for independently verifying the confidential execution state of CVMs using Intel Trust Authority attestation services."

---

## Desk notes for the Oracle

### Why this is the single highest-leverage primary source today

The earlier @taomedia_ article said Manifold/Targon "co-authored a paper with Intel in March." The WallStreetBets thesis cited the partnership but didn't have the document. Today the desk has the FULL paper, the FULL author list (six people across Intel + Manifold), the FULL CEO quote on the record, the FULL architectural diagram set (Figures 1-3), the FULL threat model, the FULL mitigation table. This is the document the Oracle should use to anchor any Targon Spotlight, and the document the magazine should keep on file as the canonical reference for the Targon technical stack.

### What the Oracle should write with this

The Targon Spotlight that becomes possible now:

1. **Opening hook**: "Intel published a joint paper with Manifold Labs in March 2026 on Intel's own community blog. The paper's CEO quote from Robert Myers is the most valuable founder testimonial any Bittensor subnet has received to date."

2. **The technical core**: walk the 5 architectural layers with the unified-attestation mechanism (NVIDIA nvtrust signed report embedded in Intel TDX quote, both verified by Intel Trust Authority) as the technical centerpiece. This is novel architecture, and the paper documents it cleanly.

3. **The threat model section**: most Bittensor coverage handwaves about "decentralized trust." This paper specifies what is and is not trusted, what attacks are in scope, and what the specific cryptographic mitigations are. The Oracle should walk the mitigation table verbatim.

4. **The CEO quote**: full-paragraph attribution. The line "establish strong trust assurances at the protocol level rather than relying on operator reputation" is the single best one-sentence summary of why decentralized confidential compute matters.

5. **The market positioning**: tie this to the Lium SN51 B300 stock screenshot from earlier today. Both subnets are competing in the decentralized GPU-rental space, but with different security models. Lium's pitch is price (~$6/hr B300 spot). Targon's pitch is verified confidentiality (via this Intel/NVIDIA TEE stack). They are NOT direct competitors; they are different layers of the same market. Worth synthesizing in any Ecosystem State article.

### How this resolves earlier ambiguity

We previously had Targon entry in voices.js with the line "Co-authored a paper with Intel in March 2026, a major enterprise signal." The bio should now be updated to add: the paper is publicly available on Intel's community blog, the Manifold CEO is on the record explaining the design choices, the technical architecture is specified in five layers with a verbatim threat model. This converts the partnership from a name-drop into a documented commercial relationship.

### Authors to add to voices.js

- **Robert Myers** (CEO, Manifold Labs / Targon) - already implied in existing Targon entry but no dedicated voice. The first 3 in Bittensor Discord per the earlier note.
- **Venish Patidar** (Manifold Labs)
- **Dhruv Bindra** (Manifold Labs)
- **Ahmed Darwich** (Manifold Labs)
- **Josh Brown** (Manifold Labs)
- **Haidong Xia** (Intel) - X handle unknown
- **Sathi Nair** (Intel) - X handle unknown, posted on Intel community blog

The Manifold team handles may not be public X identities. The desk should add them as "people behind the work" annotations rather than as scraped voices.
