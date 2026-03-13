# project-tiramisu
A blue team home lab built from scratch on commodity hardware. 

Planned playbook, configs and build documentation to keep the project aligned. 

**Proxmox VE · OPNsense · Wazuh · n8n · Grafana + Loki · Tailscale**

---

Project tiramisu is a documented build of a defensive security lab that I have built at home - it stems from a bare metal idea to a functionting detection and response stack. It runs on an old laptop with 16GB of RAM and an LTE connection.

The name comes from the Italian dessert: it's a single device that has many layers, each wiht a purpose and *tirami su*. This is translated as "pick me up".

The repository will contain the full technical playbook, configuration references and support material for the build. There is a companinion blog to go with the repository and that can be found at [Adam's Bytes](https://adambytes.github.io/lab.html). It walks through each phase as a narrative, including the failures and pain points.

##What this project is

It is a privacy-first Blue Team environment designed to run a firewall, a SIEM, a SOAR engine and visualisation layer on hardware that most people already own. Each tool was chosen because it can be understood and not just installed.

It is serves to act as a resource for anyone who wants to build their own homelabe. 

##Why did I do this project?

I was stuck in tutorial-hell, doing labs and preparing for certifications and I became overwhelmed by the influx of information and it was going nowhere useful. I started thinking about what I had at home and what I could start doing from a practical standpoint to make sure that I was not just engaging with the theoretical or just labs. 

##The Stack

| Layer | Tool | Role |
|-------|------|------|
| Hypervisor | Proxmox VE 8.x | Bare-metal Type 1 — runs everything |
| Firewall | OPNsense | Network segmentation, WAN gateway, syslog source |
| SIEM | Wazuh All-in-One | Log collection, anomaly detection, alerting |
| SOAR | n8n | Automated response workflows |
| Visualisation | Grafana + Loki | Dashboards and log search |
| Remote access | Tailscale | WireGuard mesh — no port forwarding required |

##Why this stack and not Elk you ask?

In my original research and idea, I was positioned the idea of using Elasticsearch, Logstash, Kibana, Shuffle SOAR and TheHive. Having looked at my technical constraints I realised that there needed to be a reavaluation of this process. I settled on this 'lean' stack as it delivers the same monitoring capability at half the cost of RAM. 

##Hardware

| Component | Detail |
|-----------|--------|
| Server | Old laptop — 16 logical cores, 16 GB RAM, NVMe SSD |
| Networking | USB-C to RJ45 adapter (no built-in Ethernet) |
| Internet | Rain 101 LTE router (CGNAT — no port forwarding possible) |
| Management | Desktop PC (Windows 11) via Tailscale |
| Attack surface | Laptop 2 (Parrot OS, LUKS encrypted) — future Red Team device |

## RAM budget

| Component | Allocation |
|-----------|-----------|
| Proxmox host OS | 1.5 GB |
| OPNsense VM | 1.5 GB |
| Management jump box VM | 2.0 GB |
| Wazuh All-in-One LXC | 4.0 GB |
| n8n SOAR LXC | 2.0 GB |
| Headroom / system buffer | 5.0 GB |
| **Total** | **16.0 GB** |

##About me

I am transitioning from a decade of working in education as a teacher, digital transformation and education technology leadership into cybersecurity and AI governance. This lab is part of building the technical depth.

You can find me at [LinkedIn.com] (www.linkedin.com/in/craig-a-75b384108)

# Licence

This repository is released as open-source reference material. Reproduce freely with attribution.
