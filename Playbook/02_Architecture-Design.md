# 2. Architecture Design — The Decisions and Why

What I have learnt is that good architecture is not about picking the most powerful tools. It is about understanding the responsibility boundaries between layers and making deliberate choices about what sits where. This section documents those choices and the reasoning behind them.

## 2.1 The Layered Model

| Layer | Component | Technology | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | Physical Hardware | Old laptop + USB-C adapter | Raw compute, storage, physical connectivity |
| 2 | Hypervisor | Proxmox VE | Virtualisation, bridge networking, snapshots, remote console |
| 3 | Security Gateway | OPNsense VM | Firewalling, NAT, DHCP for lab LAN, future IDS/IPS, DNS |
| 4 | Detection & Response | Wazuh All-in-One (Phase 2) | Log collection, indexing, alerting, compliance dashboards |
| 5 | Automation | n8n SOAR (Phase 2) | Automated incident response playbooks and notifications |
| 6 | Visualisation | Grafana + Loki (Phase 2) | Dashboard layer, log search, trend analysis |
| 7 | Remote Access | Tailscale mesh VPN | Encrypted management tunnel and emergency backdoor |

## 2.2 Virtual Network Bridges — The Critical Concept
Proxmox creates virtual bridges (vmbr) that function as software-defined network switches. Understanding the distinction between the two bridges in this lab is fundamental to understanding how the lab's security model works.

| Bridge | Physical Anchor | Role | Who Connects |
| :--- | :--- | :--- | :--- |
| vmbr0 | enx[adapter] (USB-C adapter)	| WAN / Home network | Proxmox host management; OPNsense WAN (vtnet0) | 
| vmbr1 | None — internal only, no bridge-ports set | 	Isolated internal lab LAN | 	OPNsense LAN (vtnet1); all future lab VMs and LXC containers | 
| vmbr1 | 	None — internal only, no bridge-ports set | 	Isolated internal lab LAN	|  OPNsense Attack (vtnet2); all future lab VMs and LXC containers | 

#### 📘	Why vmbr1 Makes the Firewall Real
vmbr1 has no physical bridge ports. It is a completely virtual switch that exists only inside the machine's memory. Nothing on the home Wi-Fi network can reach any device on vmbr1 directly. All traffic in or out of the lab passes through OPNsense, which sits with one interface in each bridge. This is what makes the firewall a meaningful security boundary rather than a decorative one.

## 2.3 Why OPNsense Over pfSense
The original plan specified pfSense. OPNsense was chosen instead for three reasons: it has a more actively maintained codebase, it ships with a cleaner web interface for new users, and it integrates more naturally with the plugins planned for Phase 2 — particularly Zenarmor for traffic visualisation and Suricata for IDS. The two projects share a common ancestor (m0n0wall) and are functionally equivalent for the purposes of this lab. Either would work.

## 2.4 The Case for a Lean Stack
The original stack called for a full ELK deployment (Elasticsearch, Logstash, Kibana) alongside Shuffle SOAR and TheHive. Running all of this on 16 GB of RAM while also operating OPNsense and a management workstation would leave no meaningful headroom. A system at 90% RAM utilisation is not a stable security tool — it is a liability.

| Function |	Original |	Revised	| RAM Impact |
| :--- | :--- | :--- | :--- |
| Firewall | pfSense CE | OPNsense 26.1 |	Equivalent | 
| SIEM / Indexer | ELK Stack (3 separate services) | 	Wazuh All-in-One (Indexer built-in) |	~4 GB saved |
| SOAR | Shuffle (Docker-heavy multi-container) |	n8n (single lightweight container) |	~2 GB saved |
| Log Visualisation | Kibana (standalone) |	Grafana + Loki |	~1 GB saved |

#### 📘	What Wazuh All-in-One Replaces
The Wazuh Indexer is a fork of OpenSearch, purpose-built for security data. The Wazuh Dashboard replaces Kibana. Running them as a single unified deployment via the official install script (wazuh-install.sh -a) delivers equivalent monitoring capability at roughly half the RAM cost of a separate ELK stack.

## 2.5 RAM Budget
The 5 GB headroom is intentional. This is the breathing room that prevents a misconfigured container from cascading into a full system freeze. RAM ballooning is disabled for all FreeBSD VMs (OPNsense) — see the caution note in Section 5.

| Component | Allocation | Notes |
| :--- | :--- | :--- |
| Proxmox Host OS | 	1.5 GB | 	Web GUI, bridge management, Tailscale daemon | 
| OPNsense VM | 	1.5 GB | Firewall and NAT only at this stage | 
| VM 101 — Lab-Management (Jump Box) | 	2.0 GB | Linux Mint XFCE — browser and terminal only (VM 101 — deployed) | 
| Wazuh All-in-One LXC | 	4.0 GB | Manager, Indexer, and Dashboard in one container (Phase 2) | 
| n8n SOAR LXC | 	2.0 GB | SQLite backend — lightweight footprint (Phase 2) | 
| Headroom / System Buffer | 	5.0 GB | Stability margin; future Grafana + Loki LXC (Phase 3)| 
| TOTAL |	16.0 GB | 	

