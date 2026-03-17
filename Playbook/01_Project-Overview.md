# 1. Project Overview and Goals

---

Project Tiramisu started with a single question: can an old laptop become a privacy-first, self-managed security lab without spending money on dedicated server hardware? The answer short is yes... but I had to fight.

The project has two intertwined goals. The first is practical: build a functioning Blue Team environment that can run a firewall, a SIEM, a SOAR engine, and a visualisation layer on commodity hardware. The second is educational: understand every decision made along the way, including the ones that turn out to be wrong, so that the process itself becomes a useful record for anyone who comes after.

---

| Component | Detail |
| :--- | :--- |
| CPU Cores | 16 Logical Cores |
| RAM | 16 GB |
| Primary Storage | NVMe SSD (nvme0n1) - Proxmox installation |
| Network | Wi-Fi only (wlp2s0) - no built-in Ethernet port |
| Added networking | USB-C to RJ45 Adapter |
| Hostname | tiramisu.lan |
| Management IP | 192.168.0.100/24 |
| Router | Rain 101 LTE - gateway 192.168.0.1 - subnet 192.168.0.0/24 |
| Role | Blue Team server (hypervisor, firewall, SIEM, SOAR, visualisation) |

#### 💡	Laptop as Server — Genuine Advantages
The built-in battery acts as a primitive UPS: if mains power flickers, the lab stays up. The form factor is small enough to run permanently on a shelf. The thermal envelope is manageable. The notable constraint is the absence of a built-in Ethernet port — if replicating this setup on similar hardware, budget for a USB-C to RJ45 adapter before you begin.

## Supporting Devices

| Device | OS | Daily Role | Lab Role |
| :--- | :--- | :--- | :--- |
| Desktop | Fedora | Primary workstation | Lab management, SIEM dashboards, incident analysis |
| Laptop 2 | Parrot OS Home + LUKS | Mobile daily driver | Remote lab access; future Red Team platform |
