# README — For GitHub Readers #
---
Welcome to **Project Tiramisu**. These writeups are the full written record of building a privacy-focused Blue Team home lab from absolute zero: no prior Linux server experience, no existing infrastructure and a Rain 101 LTE router  as the only internet connection. 

For all intents and purposes, it is designed to be a breakdown of learning and experience in setting up my homelab. I am still new to this space and have a lot to learn but my failures are documented at least as thoroughly as successes, because the failures are where the real learning happened. In here you will find a technical record of every decision made, every command run and every wall hit — along with exactly how each one was eventually broken through. I have Google and chatbots to thank for overcoming hurdles and explaining concepts to me.

---

## 💡	Key Principle
I wanted to build a homelab with that I had, so at my very best I researched what was possible given my setup. It's important to note that it requires time to explore and implement new learning experiences, so take your time. The goal is not to run software — it is to know what the software is doing and why.

---

### What this document covers:

- The hardware used and the practical constraints it imposed.
- A full Proxmox VE installation and network bridge configuration on a Wi-Fi-only laptop — including errors and how it was fixed.
- The complete network architecture: virtual bridges, a three-interface OPNsense firewall (WAN · LAN · Attack) and the reasoning behind it
- The OPNsense partition errors that blocked installation for hours and the exact shell commands that resolved them.
- The revised security stack and the reasons for pivoting away from the original plan.
- Remote management access via Tailscale without any port forwarding
- A three-device architecture designed for daily use, Blue Team monitoring, and Red Team testing.
- A Phase 2 roadmap: Wazuh SIEM, n8n SOAR, Grafana and Loki.
- A Phase 1 verification protocol.
