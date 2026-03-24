import { useState, useEffect } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #080718; color: #ede8ff; font-family: 'DM Sans', sans-serif; }
  h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(184,168,248,0.25); border-radius: 2px; }
  @keyframes slide-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse-soft { 0%,100%{opacity:0.55} 50%{opacity:1} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  .anim-in { animation: slide-up 0.38s ease both; }
  .anim-in-delay { animation: slide-up 0.38s ease 0.1s both; }
  .pulse { animation: pulse-soft 2.2s ease-in-out infinite; }
  .float { animation: float 3.2s ease-in-out infinite; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  button:disabled { cursor: not-allowed; }
`;

const C = {
  bg: '#080718',
  lav: '#b8a8f8', lavDim: 'rgba(184,168,248,0.14)', lavGlow: '0 0 18px rgba(184,168,248,0.25)',
  teal: '#5ef5cc', tealDim: 'rgba(94,245,204,0.12)', tealGlow: '0 0 18px rgba(94,245,204,0.25)',
  pink: '#f07db8', pinkDim: 'rgba(240,125,184,0.12)', pinkGlow: '0 0 18px rgba(240,125,184,0.25)',
  amber: '#f5c870', amberDim: 'rgba(245,200,112,0.12)', amberGlow: '0 0 18px rgba(245,200,112,0.22)',
  mint: '#9af5be', red: '#f08080',
  text: '#ede8ff', muted: 'rgba(237,232,255,0.55)', dim: 'rgba(237,232,255,0.28)',
  surface: 'rgba(255,255,255,0.04)', border: 'rgba(190,168,255,0.12)',
};

const OSI = [
  { n:7, name:'Application',   color:C.lav,   eg:'HTTP, DNS, SMTP'          },
  { n:6, name:'Presentation',  color:C.teal,  eg:'TLS / SSL, encoding'       },
  { n:5, name:'Session',       color:C.mint,  eg:'Session mgmt, RPC'         },
  { n:4, name:'Transport',     color:C.pink,  eg:'TCP / UDP, ports'          },
  { n:3, name:'Network',       color:C.amber, eg:'IP, ICMP, routing'         },
  { n:2, name:'Data Link',     color:'#f0b85a', eg:'Ethernet, MAC, switches' },
  { n:1, name:'Physical',      color:'#e08888', eg:'Cables, Wi-Fi, bits'     },
];

const STEP_TO_LAYER = {0:-1, 1:0, 2:1, 3:3, 4:4, 5:5, 6:6};

const SCENARIOS = [
  {
    id:'grandfather', icon:'👴', title:'The Grandfather Test',
    sub:"You know all the acronyms. Can you explain them?",
    accent:C.lav, glow: C.lavGlow,
    chapters:[
      { id:'osi', title:'Getting Dressed', label:'OSI Encapsulation', vis:'osi', steps:[
        {v:"I'm just raw data right now — a few bytes your browser wants to send. Before I can travel anywhere, I need to get dressed. Seven layers of clothing. Each one solving a different problem.",
         d:'The OSI model gives each layer a single responsibility. Lower layers handle hardware and signals; upper layers handle logic, security, and application data.'},
        {v:"Layer 7 — Application. This is where I was born. HTTP said: GET /index.html. That's my purpose, my DNA. Everything else from here is just wrapping around that original intent.",
         d:'Layer 7 examples: HTTP, HTTPS, DNS, SMTP, FTP. The protocol the application uses to speak. Your browser, email client, and SSH terminal all originate here.'},
        {v:"Layer 6 — Presentation. TLS takes me in and encrypts me. I now look like random noise to anyone intercepting. Only the intended destination holds the key. This is where your padlock icon comes from.",
         d:'Layer 6: TLS/SSL encryption, data compression, character encoding. Makes data readable to the application on the other side. Not all protocols use L6 explicitly.'},
        {v:"Layer 4 — Transport. TCP wraps me in a segment, assigns a sequence number and ports. Source: 54231. Destination: 443. If I get lost or corrupted, TCP will know and retransmit. UDP skips all this — faster, no guarantees.",
         d:'Layer 4: TCP (reliable, ordered) vs UDP (fast, connectionless). Port numbers identify the application: 443=HTTPS, 22=SSH, 53=DNS, 80=HTTP.'},
        {v:"Layer 3 — Network. My address labels go on. Source IP: 192.168.1.42. Destination IP: 140.82.121.4 (GitHub). Routers read only this layer — they don't care what's inside me, only where I'm headed.",
         d:'Layer 3: IP addressing, routing, TTL. IP packets carry source and destination addresses. Routers operate exclusively at this layer, forwarding based on destination IP.'},
        {v:"Layer 2 — Data Link. A MAC address frame wraps me for the next single hop only. My laptop's MAC to the router's MAC. This frame is stripped and rewritten at every hop. It's a local delivery label, not a global one.",
         d:'Layer 2: Ethernet frames, MAC addresses, switches. MAC addresses are hardware identifiers (48-bit). ARP resolves IP addresses to MACs on local networks.'},
        {v:"Layer 1 — Physical. I become electricity, light, or radio waves. I stop being data and become physics. On the other side, this entire process runs in reverse — seven layers unwrapping me one by one. Grandpa: seven envelopes, each opened by a different department.",
         d:'Layer 1: Copper (Cat6), fibre optic, wireless radio. Defines voltage levels, modulation, physical connectors. No addressing here — just energy carrying encoded bits.'},
      ]},
      { id:'tcp', title:'The Handshake', label:'TCP Three-Way Handshake', vis:'tcp', steps:[
        {v:"TCP refuses to send data before both parties are ready. Think of it as calling someone before reading them a long document. Step one: SYN. I knock on the door. 'I want to talk. My conversation starts at sequence number 1000.'",
         d:'SYN (Synchronise): client → server. Initiates connection. The ISN (Initial Sequence Number) is randomised for security. TCP flag: SYN=1, ACK=0. State: SYN_SENT.'},
        {v:"The server responds: SYN-ACK. Two things in one message. 'I acknowledge your sequence number (1001). And here's mine — my conversation starts at 4000.' Both sides are now synchronised.",
         d:'SYN-ACK: server → client. Ack=1001 (client ISN+1). Seq=4000 (server ISN). TCP flags: SYN=1, ACK=1. Server state: SYN_RECEIVED.'},
        {v:"Your machine sends ACK. 'I acknowledge yours (4001).' Both sides enter ESTABLISHED state. Only now does real data move. Grandpa: you ring someone, they pick up, you both say hello, then you speak.",
         d:'ACK: client → server. Connection ESTABLISHED on both ends. SYN floods exploit this — send many SYNs, never complete the ACK, exhaust server memory with half-open connections.'},
      ]},
      { id:'nat', title:'Border Crossing', label:'Routing & NAT', vis:'nat', steps:[
        {v:"I leave your machine wearing private address 192.168.1.42. This is invisible to the internet — RFC 1918 reserved this range for private use. Every home network uses the same ranges. Millions of devices share 192.168.1.x.",
         d:'RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Not globally routable. Internet routers have no route to these — packets using them as source are dropped at the border.'},
        {v:"At the router, NAT performs the swap. My source IP changes from 192.168.1.42 to the router's public IP: 102.45.67.89. The router logs: 'port 54231 belongs to 192.168.1.42 — route any reply back there.'",
         d:'NAT / PAT (Port Address Translation): one public IP shared across many private devices, differentiated by source port. Stateful — the router tracks each session to reverse-map replies.'},
        {v:"I hop across the public internet. Each router reads my destination IP and consults its routing table: which interface gets me closer to 140.82.121.4? Longest prefix match wins. BGP governs the global backbone. I might cross 15 hops.",
         d:'Routing: longest prefix match determines the next hop. Interior gateway protocols: OSPF, EIGRP. Exterior: BGP (Border Gateway Protocol). TTL decrements at each hop — hits 0, discarded.'},
        {v:"GitHub replies. The response comes back to 102.45.67.89. My router intercepts it, consults the NAT table, rewrites the destination to 192.168.1.42, and delivers it home. Grandpa: it's like using a PO Box.",
         d:'Reverse NAT: inbound response hits router public IP → NAT table lookup by port → destination rewritten to original private IP → delivered to correct internal host.'},
      ]},
    ]
  },
  {
    id:'vpn', icon:'🏢', title:'Working From Home',
    sub:"The office server is on a private network. Let's build a tunnel.",
    accent:C.teal, glow:C.tealGlow,
    chapters:[
      { id:'vpn', title:'The Tunnel', label:'VPN Encapsulation & Routing', vis:'vpn', steps:[
        {v:"You need to reach the file server at 10.0.1.50 — deep inside the office network. From your home laptop, that address is unreachable. Private IP, different network, no route. I would die at the first router.",
         d:'10.0.1.50: RFC 1918 private address inside a separate private network. Without a route injected by VPN, the packet is dropped. VPN creates a virtual route between the two private spaces.'},
        {v:"Your VPN client performs a handshake with the VPN server at the office (203.0.113.10). Credentials verified. A cryptographic tunnel is bored through the public internet. You are now virtually inside the office network.",
         d:'VPN protocols: WireGuard (modern, fast, minimal), OpenVPN (widely compatible), IPSec/IKEv2 (OS-native). Authentication: pre-shared keys, certificates, MFA. WireGuard uses Curve25519 key pairs.'},
        {v:"Now something strange happens to me. I get wrapped inside another packet. My original self — headed for 10.0.1.50 — is encrypted and becomes the payload. A new outer packet is created with destination: the VPN server's public IP.",
         d:'Tunnel encapsulation: inner packet (original) + encryption → payload. Outer IP header carries it to VPN endpoint. WireGuard uses UDP 51820. OpenVPN typically UDP 1194. IPSec uses UDP 500/4500.'},
        {v:"The outer packet travels the public internet normally. NAT happens. Routing happens. But my inner contents are sealed. Your ISP sees you communicating with 203.0.113.10. That's all. Destination, volume, timing — nothing more.",
         d:'ISP visibility with VPN: destination IP of VPN server, volume of data, session timing. Cannot see: inner destination (10.0.1.50), payload, application data. Volume analysis is still possible at scale.'},
        {v:"At the VPN server, the outer layer is stripped. I re-emerge with my original destination: 10.0.1.50. Forwarded into the office network as if I originated there. The file server never knows I came from a sofa.",
         d:'Split tunnelling: route only traffic destined for office subnets (10.x.x.x) through VPN; personal browsing goes direct. Reduces VPN load, improves latency for general internet use.'},
      ]},
    ]
  },
  {
    id:'coffee', icon:'☕', title:'The Coffee Shop',
    sub:"Open WiFi. Harvard credentials. TLS is the reason you're safe.",
    accent:C.pink, glow:C.pinkGlow,
    chapters:[
      { id:'threat', title:'What They Can See', label:'Open WiFi Threat Model', vis:'threat', steps:[
        {v:"You connect to CoffeeShop_Free_WiFi. No WPA key — the network is open. Anyone here with Wireshark and a wireless adapter in monitor mode can capture all unencrypted traffic. Passive. Often legal. Completely invisible to you.",
         d:'Open WiFi: no wireless encryption. WPA2/WPA3 encrypt per-client, preventing others from reading your frames. Without it, all unencrypted traffic is broadcast-readable. Wireshark is free and legal on your own network.'},
        {v:"You type harvard.edu. Before HTTPS starts, your machine sends a DNS query — plaintext UDP, port 53 — asking for Harvard's IP. The router sees this. Anyone sniffing the network sees this. Your destination is known before TLS does anything.",
         d:'DNS over UDP 53: historically unencrypted. DoH (DNS-over-HTTPS) encrypts DNS queries inside HTTPS. DoT (DNS-over-TLS) uses port 853. Firefox and Brave enable DoH by default. Check: browser security settings.'},
        {v:"Once TLS is active, here is the exact line. CAN see: the server IP (104.18.x.x), and the SNI field (canvas.harvard.edu). CANNOT see: URL path, username, password, session cookie, page content. Your credentials travel safely.",
         d:'SNI (Server Name Indication): TLS extension in ClientHello that reveals the hostname. Required for virtual hosting on shared IPs. Encrypted Client Hello (ECH) is the successor — hides SNI. Still rolling out across the web.'},
      ]},
      { id:'tls', title:'The Shield', label:'TLS 1.3 Handshake', vis:'tls', steps:[
        {v:"Your browser sends ClientHello to Harvard's server. It announces: I speak TLS 1.3. Here are the cipher suites I support. Here are my Diffie-Hellman key share values. Here is a client random — a nonce making this session unique.",
         d:"ClientHello: TLS version, supported cipher suites (e.g. TLS_AES_256_GCM_SHA384), key share for ECDHE (x25519), client random (32 bytes), SNI (canvas.harvard.edu), ALPN (h2, http/1.1)."},
        {v:"Harvard's server replies with ServerHello and its certificate. The cert says: I am canvas.harvard.edu, signed by DigiCert. Your browser walks the chain: DigiCert Intermediate → DigiCert Root CA → trusted by your OS. All pass.",
         d:'Certificate chain: leaf cert → intermediate CA → root CA. Root CAs are baked into your browser and OS (~130 trusted roots). Checks: signature valid, not expired, not revoked (OCSP stapling), hostname matches.'},
        {v:"Key exchange. Both sides have each other's public ECDH values. Each independently computes the same shared secret using their own private value. The secret never crosses the wire. The coffee shop watches this exchange and learns nothing useful.",
         d:'ECDHE (x25519): Elliptic Curve Diffie-Hellman Ephemeral. Forward secrecy — even if the server private key leaks tomorrow, past sessions cannot be decrypted. Contrast RSA key exchange: no forward secrecy.'},
        {v:"Both sides send Finished — a MAC over all handshake messages, encrypted with the new session key. If it decrypts correctly, the handshake is trusted. From here, your Harvard login, your password, your coursework — all sealed. The barista gets coffee orders.",
         d:'TLS 1.3: 1-RTT handshake (vs TLS 1.2 2-RTT). 0-RTT session resumption possible (replay risk, use carefully). AES-GCM provides authenticated encryption. Mandatory: forward secrecy. Removed: RC4, MD5, SHA-1, RSA key exchange.'},
      ]},
    ]
  },
];

function OSIVisual({ step }) {
  const active = STEP_TO_LAYER[step] ?? -1;
  return (
    <svg viewBox="0 0 420 300" width="100%" style={{overflow:'visible'}}>
      <defs>
        <filter id="glow-osi" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {OSI.map((l, i) => {
        const isActive = i === active;
        const isPast = active > i;
        const op = active === -1 ? 0.28 : isActive ? 1 : isPast ? 0.6 : 0.22;
        const y = 12 + i * 39;
        return (
          <g key={l.n} style={{transition:'all 0.4s ease'}}>
            <rect x={isActive ? 12 : 16} y={y} width={isActive ? 268 : 260} height={33}
              rx={6} fill={isActive ? `${l.color}18` : 'rgba(255,255,255,0.025)'}
              stroke={l.color} strokeOpacity={op} strokeWidth={isActive ? 1.4 : 0.7}
              filter={isActive ? 'url(#glow-osi)' : undefined}/>
            <text x={30} y={y+20} fill={l.color} fillOpacity={op}
              fontSize={11} fontFamily="'Syne',sans-serif" fontWeight={700}>{l.n}</text>
            <text x={48} y={y+20} fill={isActive ? C.text : C.muted} fillOpacity={op}
              fontSize={12} fontFamily="'DM Sans',sans-serif" fontWeight={isActive?500:400}>{l.name}</text>
            <text x={152} y={y+20} fill={C.dim} fillOpacity={isActive ? 0.8 : op * 0.6}
              fontSize={10} fontFamily="'DM Sans',sans-serif">{l.eg}</text>
            {isActive && <circle cx={288} cy={y+16} r={4} fill={l.color} opacity={0.9} className="pulse"/>}
          </g>
        );
      })}
      <g transform="translate(302,8)">
        <text x={46} y={12} fill={C.dim} fontSize={9} fontFamily="'Syne',sans-serif" textAnchor="middle">PACKET</text>
        {[6,5,4,3,2,1,0].map((li, si) => {
          const l = OSI[li];
          if (active !== -1 && active < li) return null;
          const pad = si * 5;
          return (
            <rect key={li} x={pad} y={16+pad} width={92-pad*2} height={270-pad*2}
              rx={4} fill={`${l.color}14`}
              stroke={l.color} strokeOpacity={active === li ? 0.85 : 0.25}
              strokeWidth={active === li ? 1.4 : 0.6}/>
          );
        })}
        <text x={46} y={155} fill={C.text} fillOpacity={0.6} fontSize={9}
          fontFamily="'DM Sans',sans-serif" textAnchor="middle">DATA</text>
      </g>
    </svg>
  );
}

function TCPVisual({ step }) {
  const arrows = [
    {x1:108,x2:308,y:88, label:'SYN', sub:'Seq=1000 · SYN=1', color:C.lav},
    {x1:308,x2:108,y:158,label:'SYN-ACK', sub:'Seq=4000 · Ack=1001', color:C.teal},
    {x1:108,x2:308,y:228,label:'ACK', sub:'Ack=4001 · state: ESTABLISHED', color:C.pink},
  ];
  return (
    <svg viewBox="0 0 420 290" width="100%">
      <defs>
        <filter id="glow-tcp"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      {[{x:60,label:'Your Laptop',sub:'Client'},{x:360,label:'GitHub',sub:'Server'}].map((e,i) => (
        <g key={i}>
          <rect x={e.x-46} y={16} width={92} height={40} rx={7}
            fill="rgba(255,255,255,0.04)" stroke={C.border} strokeWidth={0.8}/>
          <text x={e.x} y={33} textAnchor="middle" fill={C.text}
            fontSize={11} fontFamily="'Syne',sans-serif" fontWeight={600}>{e.label}</text>
          <text x={e.x} y={48} textAnchor="middle" fill={C.dim}
            fontSize={9} fontFamily="'DM Sans',sans-serif">{e.sub}</text>
          <line x1={e.x} y1={56} x2={e.x} y2={268}
            stroke="rgba(190,168,255,0.12)" strokeWidth={1} strokeDasharray="3,4"/>
        </g>
      ))}
      {step >= 2 && (
        <g>
          <rect x={108} y={252} width={204} height={24} rx={5}
            fill="rgba(94,245,204,0.07)" stroke={C.teal} strokeWidth={0.8} strokeOpacity={0.5}/>
          <text x={210} y={267} textAnchor="middle" fill={C.teal}
            fontSize={10} fontFamily="'Syne',sans-serif">✓ CONNECTION ESTABLISHED</text>
        </g>
      )}
      {arrows.map((a,i) => {
        if (i > step) return null;
        const isActive = i === step;
        const mx = (a.x1 + a.x2) / 2;
        return (
          <g key={i} filter={isActive ? 'url(#glow-tcp)' : undefined}>
            <line x1={a.x1} y1={a.y} x2={a.x2} y2={a.y}
              stroke={a.color} strokeWidth={isActive ? 1.8 : 1}
              strokeOpacity={isActive ? 1 : 0.35}
              markerEnd="url(#arr)"/>
            <text x={mx} y={a.y-9} textAnchor="middle" fill={a.color}
              fillOpacity={isActive ? 1 : 0.45}
              fontSize={12} fontFamily="'Syne',sans-serif" fontWeight={700}>{a.label}</text>
            <text x={mx} y={a.y+17} textAnchor="middle" fill={C.muted}
              fillOpacity={isActive ? 0.8 : 0.3}
              fontSize={9} fontFamily="'DM Sans',sans-serif">{a.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

function NATVisual({ step }) {
  const nodes = [
    {x:50, label:'192.168.1.42', sub:'Your Laptop', color:C.lav},
    {x:163,label:'Router / NAT', sub:step>=1?'102.45.67.89':'private edge', color:C.amber},
    {x:280,label:'Internet', sub:'Public routers', color:C.mint},
    {x:390,label:'140.82.121.4', sub:'GitHub', color:C.teal},
  ];
  const pkX = step===0?50:step===1?163:step===2?280:step===2?390:50;
  const pkColor = step>=1?C.amber:C.lav;
  const isReturn = step===3;
  return (
    <svg viewBox="0 0 440 220" width="100%">
      <defs>
        <filter id="glow-nat"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x={12} y={55} width={125} height={130} rx={8}
        fill="rgba(184,168,248,0.03)" stroke="rgba(184,168,248,0.14)" strokeWidth={0.7} strokeDasharray="4,3"/>
      <text x={74} y={72} textAnchor="middle" fill={C.dim} fontSize={9} fontFamily="'Syne',sans-serif">PRIVATE</text>
      <rect x={222} y={55} width={208} height={130} rx={8}
        fill="rgba(94,245,204,0.02)" stroke="rgba(94,245,204,0.1)" strokeWidth={0.7} strokeDasharray="4,3"/>
      <text x={326} y={72} textAnchor="middle" fill={C.dim} fontSize={9} fontFamily="'Syne',sans-serif">PUBLIC INTERNET</text>
      {nodes.map((n,i) => i<3 && (
        <line key={i} x1={n.x+32} y1={130} x2={nodes[i+1].x-32} y2={130}
          stroke="rgba(190,168,255,0.12)" strokeWidth={0.8}/>
      ))}
      {nodes.map((n,i) => {
        const isActive = (!isReturn && i===step) || (isReturn && i===0);
        return (
          <g key={i}>
            <rect x={n.x-32} y={110} width={64} height={40} rx={6}
              fill={isActive ? `${n.color}18` : 'rgba(255,255,255,0.03)'}
              stroke={n.color} strokeOpacity={isActive?0.9:0.22} strokeWidth={isActive?1.4:0.7}
              filter={isActive?'url(#glow-nat)':undefined}/>
            <text x={n.x} y={127} textAnchor="middle" fill={n.color}
              fillOpacity={isActive?1:0.45} fontSize={9} fontFamily="'Syne',sans-serif" fontWeight={600}>{n.label}</text>
            <text x={n.x} y={141} textAnchor="middle" fill={C.dim}
              fillOpacity={isActive?0.9:0.35} fontSize={8} fontFamily="'DM Sans',sans-serif">{n.sub}</text>
          </g>
        );
      })}
      {step>=1 && (
        <text x={163} y={98} textAnchor="middle" fill={C.amber} fontSize={9} fontFamily="'DM Sans',sans-serif" opacity={0.8}>
          .42 → .89 (NAT swap)
        </text>
      )}
      {!isReturn && (
        <g>
          <circle cx={step===0?50:step===1?163:step===2?280:390} cy={104} r={7}
            fill={pkColor} fillOpacity={0.25} stroke={pkColor} strokeWidth={1.2}
            filter="url(#glow-nat)"/>
          <text x={step===0?50:step===1?163:step===2?280:390} y={108}
            textAnchor="middle" fill={pkColor} fontSize={7}>▶</text>
        </g>
      )}
      {isReturn && (
        <g>
          <circle cx={50} cy={104} r={7} fill={C.teal} fillOpacity={0.25}
            stroke={C.teal} strokeWidth={1.2} filter="url(#glow-nat)"/>
          <text x={50} y={108} textAnchor="middle" fill={C.teal} fontSize={7}>◀</text>
          <text x={220} y={95} textAnchor="middle" fill={C.teal} fontSize={9}
            fontFamily="'DM Sans',sans-serif" opacity={0.8}>← reply returning via NAT lookup</text>
        </g>
      )}
    </svg>
  );
}

function VPNVisual({ step }) {
  return (
    <svg viewBox="0 0 440 230" width="100%">
      <defs>
        <filter id="glow-vpn"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="tunnel-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.teal} stopOpacity={0.35}/>
          <stop offset="50%" stopColor={C.lav} stopOpacity={0.18}/>
          <stop offset="100%" stopColor={C.teal} stopOpacity={0.35}/>
        </linearGradient>
      </defs>
      <rect x={8} y={35} width={108} height={170} rx={10}
        fill="rgba(184,168,248,0.03)" stroke="rgba(184,168,248,0.18)" strokeWidth={0.8}/>
      <text x={62} y={53} textAnchor="middle" fill={C.lav} fontSize={10} fontFamily="'Syne',sans-serif" fontWeight={600}>HOME</text>
      <rect x={324} y={35} width={108} height={170} rx={10}
        fill="rgba(94,245,204,0.03)" stroke="rgba(94,245,204,0.18)" strokeWidth={0.8}/>
      <text x={378} y={53} textAnchor="middle" fill={C.teal} fontSize={10} fontFamily="'Syne',sans-serif" fontWeight={600}>OFFICE</text>
      <rect x={22} y={82} width={80} height={44} rx={6}
        fill="rgba(184,168,248,0.08)" stroke={C.lav} strokeWidth={1} strokeOpacity={0.6}/>
      <text x={62} y={101} textAnchor="middle" fill={C.lav} fontSize={9} fontFamily="'Syne',sans-serif">Your Laptop</text>
      <text x={62} y={115} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily="'DM Sans',sans-serif">192.168.1.42</text>
      <rect x={338} y={82} width={80} height={44} rx={6}
        fill={step>=4?'rgba(94,245,204,0.1)':'rgba(255,255,255,0.03)'}
        stroke={C.teal} strokeWidth={1} strokeOpacity={step>=4?0.8:0.28}/>
      <text x={378} y={101} textAnchor="middle" fill={C.teal} fillOpacity={step>=4?1:0.4}
        fontSize={9} fontFamily="'Syne',sans-serif">File Server</text>
      <text x={378} y={115} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily="'DM Sans',sans-serif">10.0.1.50</text>
      <text x={220} y={70} textAnchor="middle" fill={C.dim} fontSize={9} fontFamily="'DM Sans',sans-serif">PUBLIC INTERNET</text>
      {step>=1 && (
        <g>
          <rect x={172} y={148} width={96} height={36} rx={6}
            fill="rgba(245,200,112,0.08)" stroke={C.amber} strokeWidth={0.9} strokeOpacity={0.7}/>
          <text x={220} y={163} textAnchor="middle" fill={C.amber} fontSize={9} fontFamily="'Syne',sans-serif">VPN Server</text>
          <text x={220} y={175} textAnchor="middle" fill={C.dim} fontSize={7.5} fontFamily="'DM Sans',sans-serif">203.0.113.10</text>
        </g>
      )}
      {step>=2 && (
        <g>
          <rect x={118} y={95} width={204} height={28} rx={14}
            fill="url(#tunnel-grad)" stroke={C.teal} strokeWidth={0.8} strokeOpacity={0.6}
            strokeDasharray={step===2?'5,3':undefined}
            filter="url(#glow-vpn)"/>
          <text x={220} y={112} textAnchor="middle" fill={C.teal} fillOpacity={0.75}
            fontSize={8} fontFamily="'Syne',sans-serif">
            {step>=3?'ENCRYPTED TUNNEL':'ESTABLISHING...'}
          </text>
        </g>
      )}
      {step>=2 && (
        <g transform="translate(183,82)">
          <rect x={0} y={0} width={50} height={26} rx={4} fill="rgba(94,245,204,0.1)" stroke={C.teal} strokeWidth={0.7}/>
          <rect x={6} y={4} width={38} height={18} rx={3} fill="rgba(184,168,248,0.15)" stroke={C.lav} strokeWidth={0.7}/>
          <text x={25} y={15} textAnchor="middle" fill={C.lav} fontSize={7} fontFamily="'DM Sans',sans-serif">payload</text>
        </g>
      )}
    </svg>
  );
}

function ThreatVisual({ step }) {
  return (
    <svg viewBox="0 0 440 255" width="100%">
      <defs>
        <filter id="glow-threat"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x={16} y={72} width={82} height={50} rx={8}
        fill="rgba(184,168,248,0.07)" stroke={C.lav} strokeWidth={1} strokeOpacity={0.7}/>
      <text x={57} y={94} textAnchor="middle" fill={C.lav} fontSize={10} fontFamily="'Syne',sans-serif">You</text>
      <text x={57} y={108} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily="'DM Sans',sans-serif">harvard.edu?</text>
      <rect x={171} y={72} width={98} height={50} rx={8}
        fill={step===0?'rgba(240,120,120,0.08)':'rgba(255,255,255,0.03)'}
        stroke={step===0?C.red:'rgba(190,168,255,0.22)'}
        strokeWidth={step===0?1.4:0.8}
        filter={step===0?'url(#glow-threat)':undefined}/>
      <text x={220} y={94} textAnchor="middle" fill={step===0?C.red:C.muted}
        fontSize={9} fontFamily="'Syne',sans-serif">Coffee WiFi</text>
      <text x={220} y={108} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily="'DM Sans',sans-serif">
        {step===0?'⚠ open network':'router'}
      </text>
      <rect x={340} y={72} width={84} height={50} rx={8}
        fill="rgba(94,245,204,0.06)" stroke={C.teal} strokeWidth={0.8} strokeOpacity={0.6}/>
      <text x={382} y={94} textAnchor="middle" fill={C.teal} fontSize={9} fontFamily="'Syne',sans-serif">Harvard</text>
      <text x={382} y={108} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily="'DM Sans',sans-serif">canvas.harvard.edu</text>
      <line x1={98} y1={97} x2={171} y2={97} stroke="rgba(190,168,255,0.18)" strokeWidth={0.8}/>
      <line x1={269} y1={97} x2={340} y2={97} stroke="rgba(94,245,204,0.18)" strokeWidth={0.8}/>
      {step===0 && (
        <g>
          <text x={220} y={158} textAnchor="middle" fill={C.red} fontSize={11} fontFamily="'DM Sans',sans-serif">
            👁 anyone here can listen
          </text>
          <text x={220} y={175} textAnchor="middle" fill={C.dim} fontSize={9} fontFamily="'DM Sans',sans-serif">
            no WPA key = no wireless encryption
          </text>
        </g>
      )}
      {step>=1 && (
        <g>
          <rect x={60} y={145} width={158} height={38} rx={5}
            fill="rgba(240,120,120,0.08)" stroke={C.red} strokeWidth={0.7} strokeOpacity={0.7}/>
          <text x={139} y={161} textAnchor="middle" fill={C.red} fontSize={9} fontFamily="'Syne',sans-serif">DNS query: VISIBLE</text>
          <text x={139} y={175} textAnchor="middle" fill={C.muted} fontSize={8} fontFamily="'DM Sans',sans-serif">UDP port 53 — plaintext</text>
        </g>
      )}
      {step>=2 && (
        <g>
          <rect x={228} y={140} width={200} height={100} rx={5}
            fill="rgba(255,255,255,0.025)" stroke={C.border} strokeWidth={0.7}/>
          <text x={328} y={157} textAnchor="middle" fill={C.text} fontSize={9} fontFamily="'Syne',sans-serif" fontWeight={500}>After TLS starts:</text>
          <text x={238} y={172} fill={C.red} fontSize={8.5} fontFamily="'DM Sans',sans-serif">✗ visible: server IP, SNI hostname</text>
          <text x={238} y={187} fill={C.teal} fontSize={8.5} fontFamily="'DM Sans',sans-serif">✓ hidden: URL path</text>
          <text x={238} y={201} fill={C.teal} fontSize={8.5} fontFamily="'DM Sans',sans-serif">✓ hidden: credentials &amp; cookies</text>
          <text x={238} y={215} fill={C.teal} fontSize={8.5} fontFamily="'DM Sans',sans-serif">✓ hidden: all page content</text>
          <text x={238} y={229} fill={C.teal} fontSize={8.5} fontFamily="'DM Sans',sans-serif">✓ hidden: session data</text>
        </g>
      )}
    </svg>
  );
}

function TLSVisual({ step }) {
  const msgs = [
    {x1:112,x2:306,y:90, label:'ClientHello', sub:'TLS 1.3 · cipher suites · key share · SNI', color:C.lav},
    {x1:306,x2:112,y:150,label:'ServerHello + Certificate', sub:'server key share · cert chain', color:C.teal},
    {x1:112,x2:306,y:205,label:'Key Exchange (ECDHE)', sub:'shared secret derived — never transmitted', color:C.amber, dashed:true},
    {x1:112,x2:306,y:258,label:'Finished ✓', sub:'handshake verified · session encrypted', color:C.pink},
  ];
  return (
    <svg viewBox="0 0 420 295" width="100%">
      <defs>
        <filter id="glow-tls"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      {[{x:62,label:'Browser',sub:'Your machine'},{x:356,label:'Harvard',sub:'canvas.harvard.edu'}].map((e,i)=>(
        <g key={i}>
          <rect x={e.x-52} y={16} width={104} height={40} rx={7}
            fill="rgba(255,255,255,0.04)" stroke={C.border} strokeWidth={0.8}/>
          <text x={e.x} y={33} textAnchor="middle" fill={C.text}
            fontSize={11} fontFamily="'Syne',sans-serif" fontWeight={600}>{e.label}</text>
          <text x={e.x} y={48} textAnchor="middle" fill={C.dim}
            fontSize={9} fontFamily="'DM Sans',sans-serif">{e.sub}</text>
          <line x1={e.x} y1={56} x2={e.x} y2={278}
            stroke="rgba(190,168,255,0.1)" strokeWidth={1} strokeDasharray="3,4"/>
        </g>
      ))}
      {step>=3 && (
        <g>
          <rect x={112} y={275} width={196} height={20} rx={4}
            fill="rgba(94,245,204,0.07)" stroke={C.teal} strokeWidth={0.7} strokeOpacity={0.5}/>
          <text x={210} y={288} textAnchor="middle" fill={C.teal}
            fontSize={10} fontFamily="'Syne',sans-serif">🔒 Session encrypted</text>
        </g>
      )}
      {msgs.map((m,i)=>{
        if(i>step) return null;
        const isActive = i===step;
        return (
          <g key={i} filter={isActive?'url(#glow-tls)':undefined}>
            <line x1={m.x1} y1={m.y} x2={m.x2} y2={m.y}
              stroke={m.color} strokeWidth={isActive?1.8:1} strokeOpacity={isActive?1:0.35}
              strokeDasharray={m.dashed?'5,3':undefined}
              markerEnd="url(#arr2)"/>
            <text x={209} y={m.y-9} textAnchor="middle" fill={m.color}
              fillOpacity={isActive?1:0.4} fontSize={11}
              fontFamily="'Syne',sans-serif" fontWeight={isActive?700:500}>{m.label}</text>
            <text x={209} y={m.y+16} textAnchor="middle" fill={C.muted}
              fillOpacity={isActive?0.8:0.28} fontSize={9} fontFamily="'DM Sans',sans-serif">{m.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

const VIS = {osi:OSIVisual, tcp:TCPVisual, nat:NATVisual, vpn:VPNVisual, threat:ThreatVisual, tls:TLSVisual};

function ScenarioSelector({ onSelect }) {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',padding:'48px 24px',background:C.bg}}>
      <div style={{textAlign:'center',marginBottom:52}}>
        <div style={{display:'inline-block',padding:'4px 16px',
          background:'rgba(184,168,248,0.08)',border:'1px solid rgba(184,168,248,0.22)',
          borderRadius:20,marginBottom:18,fontSize:11,fontFamily:"'Syne',sans-serif",
          letterSpacing:'0.14em',color:C.lav}}>PACKET JOURNEY</div>
        <h1 style={{fontSize:'clamp(28px,5vw,46px)',fontFamily:"'Syne',sans-serif",
          fontWeight:800,lineHeight:1.12,marginBottom:14,
          background:`linear-gradient(135deg, ${C.lav} 0%, ${C.teal} 100%)`,
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          How data moves<br/>through a network
        </h1>
        <p style={{color:C.muted,fontSize:15,fontFamily:"'DM Sans',sans-serif",
          maxWidth:440,margin:'0 auto',lineHeight:1.6}}>
          Three scenarios. One protagonist — the packet.<br/>Choose a story to begin.
        </p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',
        gap:20,maxWidth:940,width:'100%'}}>
        {SCENARIOS.map(s=><ScenarioCard key={s.id} s={s} onSelect={()=>onSelect(s.id)}/>)}
      </div>
    </div>
  );
}

function ScenarioCard({ s, onSelect }) {
  const [hov, setHov] = useState(false);
  const totalSteps = s.chapters.reduce((a,c)=>a+c.steps.length,0);
  return (
    <button onClick={onSelect} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.025)',
        border:`1px solid ${hov?s.accent+'45':C.border}`,borderRadius:16,
        padding:'28px 24px',textAlign:'left',transition:'all 0.25s ease',
        boxShadow:hov?s.glow:'none',
        transform:hov?'translateY(-3px)':'none'}}>
      <div style={{fontSize:30,marginBottom:14}}>{s.icon}</div>
      <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,
        color:s.accent,marginBottom:9}}>{s.title}</h3>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13.5,
        color:C.muted,lineHeight:1.55,marginBottom:18}}>{s.sub}</p>
      <div style={{fontSize:11,fontFamily:"'Syne',sans-serif",
        color:s.accent,opacity:0.65,letterSpacing:'0.07em'}}>
        {s.chapters.length} chapter{s.chapters.length>1?'s':''} · {totalSteps} steps →
      </div>
    </button>
  );
}

function ScenarioView({ scenario, chapter, step, stepIdx, chapterIdx, onNext, onPrev, isFirst, isLast, onBack }) {
  const [animKey, setAnimKey] = useState(0);
  useEffect(()=>{ setAnimKey(k=>k+1); }, [stepIdx, chapterIdx]);

  const totalSteps = chapter?.steps.length || 0;
  const totalChapters = scenario.chapters.length;

  let done=0, total=0;
  scenario.chapters.forEach((c,ci)=>{
    total+=c.steps.length;
    if(ci<chapterIdx) done+=c.steps.length;
    else if(ci===chapterIdx) done+=stepIdx;
  });
  const pct = total>0 ? done/total : 0;
  const Vis = chapter ? VIS[chapter.vis] : null;

  const isChapterEnd = stepIdx===totalSteps-1;
  const hasNextChapter = chapterIdx<totalChapters-1;

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:C.bg,overflow:'hidden'}}>
      {/* Top bar */}
      <div style={{padding:'12px 24px',display:'flex',alignItems:'center',gap:14,
        borderBottom:'1px solid rgba(190,168,255,0.07)',
        background:'rgba(255,255,255,0.015)',flexShrink:0}}>
        <button onClick={onBack} style={{background:'none',
          border:'1px solid rgba(190,168,255,0.2)',borderRadius:8,padding:'6px 12px',
          color:C.muted,fontFamily:"'DM Sans',sans-serif",fontSize:12,
          transition:'all 0.2s'}}>← Scenarios</button>
        <span style={{fontSize:18}}>{scenario.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,
            fontSize:13,color:scenario.accent}}>{scenario.title}</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.dim}}>
            {chapter?.title} · {chapter?.label}
          </div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {scenario.chapters.map((_,i)=>(
            <div key={i} style={{width:i===chapterIdx?22:6,height:6,borderRadius:3,
              transition:'all 0.3s ease',
              background:i<=chapterIdx?scenario.accent:'rgba(190,168,255,0.15)',
              boxShadow:i===chapterIdx?scenario.glow:'none'}}/>
          ))}
        </div>
        <div style={{fontSize:11,fontFamily:"'Syne',sans-serif",color:C.dim,minWidth:32}}>
          {Math.round(pct*100)}%
        </div>
      </div>
      {/* Progress bar */}
      <div style={{height:2,background:'rgba(190,168,255,0.06)',flexShrink:0}}>
        <div style={{height:'100%',width:`${pct*100}%`,
          background:`linear-gradient(90deg, ${scenario.accent}, ${C.teal})`,
          transition:'width 0.45s ease',
          boxShadow:`0 0 10px ${scenario.accent}55`}}/>
      </div>
      {/* Content */}
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',overflow:'hidden'}}>
        {/* Left panel */}
        <div style={{padding:'28px 30px 24px',display:'flex',flexDirection:'column',
          gap:18,borderRight:'1px solid rgba(190,168,255,0.07)',overflowY:'auto'}}>
          {/* Step dots */}
          <div style={{display:'flex',gap:5,alignItems:'center'}}>
            {chapter?.steps.map((_,i)=>(
              <div key={i} style={{height:5,borderRadius:3,transition:'all 0.3s ease',
                width:i===stepIdx?18:5,
                background:i<stepIdx?scenario.accent:i===stepIdx?scenario.accent:'rgba(190,168,255,0.15)',
                boxShadow:i===stepIdx?scenario.glow:'none'}}/>
            ))}
          </div>
          {/* Packet voice */}
          <div key={`v-${animKey}`} className="anim-in" style={{
            background:`${scenario.accent}0c`,
            border:`1px solid ${scenario.accent}25`,
            borderLeft:`3px solid ${scenario.accent}`,
            borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:9,fontFamily:"'Syne',sans-serif",
              color:scenario.accent,letterSpacing:'0.14em',marginBottom:10,opacity:0.8}}>
              ◈ PACKET VOICE
            </div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14.5,
              lineHeight:1.72,color:C.text,fontStyle:'italic'}}>
              "{step?.v}"
            </p>
          </div>
          {/* Technical detail */}
          <div key={`d-${animKey}`} className="anim-in-delay" style={{
            background:'rgba(255,255,255,0.025)',
            border:'1px solid rgba(190,168,255,0.1)',
            borderRadius:10,padding:'14px 16px'}}>
            <div style={{fontSize:9,fontFamily:"'Syne',sans-serif",
              color:C.dim,letterSpacing:'0.12em',marginBottom:8}}>TECHNICAL DETAIL</div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,
              lineHeight:1.65,color:C.muted}}>{step?.d}</p>
          </div>
          {/* Nav */}
          <div style={{display:'flex',gap:10,marginTop:'auto',paddingTop:6}}>
            <button onClick={onPrev} disabled={isFirst} style={{
              flex:1,padding:'11px',borderRadius:9,
              background:isFirst?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.045)',
              border:'1px solid rgba(190,168,255,0.14)',
              color:isFirst?C.dim:C.muted,fontFamily:"'DM Sans',sans-serif",fontSize:13,
              transition:'all 0.2s',opacity:isFirst?0.4:1}}>← Back</button>
            <button onClick={onNext} disabled={isLast} style={{
              flex:2,padding:'11px',borderRadius:9,
              background:isLast?'rgba(255,255,255,0.02)':`linear-gradient(135deg, ${scenario.accent}18, ${C.teal}10)`,
              border:`1px solid ${isLast?'rgba(190,168,255,0.12)':scenario.accent+'38'}`,
              color:isLast?C.dim:scenario.accent,
              fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,
              transition:'all 0.2s',
              boxShadow:isLast?'none':scenario.glow,
              opacity:isLast?0.4:1}}>
              {isLast?'— Complete —':isChapterEnd&&hasNextChapter?'Next Chapter →':'Next Step →'}
            </button>
          </div>
        </div>
        {/* Right panel */}
        <div style={{padding:'28px 26px',display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',overflowY:'auto',gap:14}}>
          <div style={{width:'100%',maxWidth:470,
            background:'rgba(255,255,255,0.022)',
            border:'1px solid rgba(190,168,255,0.09)',
            borderRadius:14,padding:'22px 18px'}}>
            <div style={{fontSize:9,fontFamily:"'Syne',sans-serif",
              color:C.dim,letterSpacing:'0.1em',marginBottom:14,
              display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:6,height:6,borderRadius:'50%',
                background:scenario.accent,
                boxShadow:scenario.glow}}/>
              {chapter?.label?.toUpperCase()}
            </div>
            {Vis && <div key={`vis-${chapterIdx}`}><Vis step={stepIdx}/></div>}
          </div>
          {chapter?.vis==='osi' && (
            <div style={{width:'100%',maxWidth:470,
              background:'rgba(255,255,255,0.018)',
              border:'1px solid rgba(190,168,255,0.07)',
              borderRadius:9,padding:'12px 14px'}}>
              <div style={{fontSize:9,color:C.dim,fontFamily:"'Syne',sans-serif",
                letterSpacing:'0.1em',marginBottom:8}}>OSI QUICK REF</div>
              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                {OSI.map((l,i)=>(
                  <span key={i} style={{fontSize:9,padding:'2px 7px',borderRadius:4,
                    background:`${l.color}15`,border:`1px solid ${l.color}30`,
                    color:l.color,fontFamily:"'DM Sans',sans-serif"}}>
                    L{l.n} {l.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('select');
  const [scenarioId, setSid] = useState(null);
  const [chapterIdx, setCh] = useState(0);
  const [stepIdx, setSt] = useState(0);

  const scenario = SCENARIOS.find(s=>s.id===scenarioId);
  const chapter = scenario?.chapters[chapterIdx];
  const step = chapter?.steps[stepIdx];
  const totalSteps = chapter?.steps.length||0;
  const totalChapters = scenario?.chapters.length||0;

  const goNext = () => {
    if (stepIdx<totalSteps-1) setSt(s=>s+1);
    else if (chapterIdx<totalChapters-1) { setCh(c=>c+1); setSt(0); }
  };
  const goPrev = () => {
    if (stepIdx>0) setSt(s=>s-1);
    else if (chapterIdx>0) {
      const prev = scenario.chapters[chapterIdx-1];
      setCh(c=>c-1); setSt(prev.steps.length-1);
    }
  };
  const select = (id) => { setSid(id); setCh(0); setSt(0); setScreen('scenario'); };

  const isFirst = chapterIdx===0 && stepIdx===0;
  const isLast = chapterIdx===totalChapters-1 && stepIdx===totalSteps-1;

  return (
    <>
      <style>{STYLE}</style>
      {screen==='select'
        ? <ScenarioSelector onSelect={select}/>
        : scenario && (
          <ScenarioView
            scenario={scenario} chapter={chapter} step={step}
            stepIdx={stepIdx} chapterIdx={chapterIdx}
            onNext={goNext} onPrev={goPrev}
            isFirst={isFirst} isLast={isLast}
            onBack={()=>setScreen('select')}/>
        )}
    </>
  );
}
