import { TechnicalPillar, ProjectItem, SecurityLabItem, ResearchItem, ExtensibleSocialProfile, TelemetryMetric } from '../types';

export const PERSONAL_INFO = {
  name: 'Yeasin',
  handle: 'yeasin4745',
  legalFullName: 'Md Yeasin Mia',
  email: 'yeasin.devx@gmail.com',
  githubUrl: 'https://github.com/yeasin4745',
  linkedinUrl: 'https://linkedin.com/in/yeasin4745',
  profileImageUrl: '',
  tagline: 'Architecting Backend Systems, Securing Networks, Exploring Computer Systems.',
  roleSummary: 'Technical learner and future technology professional specializing in Backend Development, Computer Networking, Network Security, and Linux Systems.',
  location: 'Bangladesh',
  status: 'Active Learner & Systems Researcher',
  availability: 'Available for technical discussions & open-source collaboration',
};

export const TELEMETRY_STATS: TelemetryMetric[] = [
  { label: 'NODE IDENTITY', value: 'yeasin4745.local', status: 'nominal', detail: 'Primary host instance' },
  { label: 'FOCUS STACK', value: 'Node.js / Python / Linux', status: 'active', detail: 'Backend & Systems runtime' },
  { label: 'NETWORK DOMAIN', value: 'TCP/IP / Sockets / TLS', status: 'synced', detail: 'Protocol layer focus' },
  { label: 'DEFENSE POSTURE', value: 'Hardened / Inspecting', status: 'nominal', detail: 'Security mindset active' },
];

export const TECHNICAL_PILLARS: TechnicalPillar[] = [
  {
    id: 'backend',
    title: 'Backend Systems & Architecture',
    subtitle: 'High-throughput, asynchronous server engines and persistent data flows',
    badge: 'CORE DOMAIN 01',
    accentColor: 'cyan',
    description: 'Engineering resilient server backends, structured REST endpoints, asynchronous request pipelines, and secure database interactions.',
    protocols: ['Node.js', 'Express', 'Python', 'RESTful APIs', 'Async I/O', 'SQL/NoSQL'],
    keyTopics: [
      'Asynchronous Event Loop & Concurrency Control',
      'API Authentication, JWT & Session Management',
      'Server-Side Request Validation & Rate Limiting',
      'Database Schema Design & Query Optimization',
    ],
    architectureFocus: 'Asynchronous Event-Driven Pipelines & Resilient REST APIs',
    codeSnippet: {
      language: 'typescript',
      title: 'Express Asynchronous Controller & Error Pipeline',
      description: 'Structured request handler with try/catch and error delegation.',
      code: `import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/api/v1/telemetry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await checkHostHealth();
    return res.status(200).json({ status: 'nominal', timestamp: Date.now(), data: status });
  } catch (error) {
    next(error);
  }
});`,
    },
  },
  {
    id: 'networking',
    title: 'Computer Networking & Protocols',
    subtitle: 'Wire-level packet communication, routing logic, and protocol stacks',
    badge: 'CORE DOMAIN 02',
    accentColor: 'emerald',
    description: 'Deconstructing the OSI & TCP/IP models, analyzing packet lifecycles with Wireshark, socket-level communication, and DNS/routing topologies.',
    protocols: ['TCP/IP', 'UDP', 'DNS', 'HTTP/HTTPS', 'TLS 1.3', 'ICMP', 'OSI Layers'],
    keyTopics: [
      'Three-Way Handshake & Socket Lifecycle Management',
      'Subnetting, CIDR, NAT, and Routing Tables',
      'Wireshark Deep Packet Inspection & Stream Analysis',
      'DNS Resolution & Recursive Query Architecture',
    ],
    architectureFocus: 'Layer 3/4 Packet Routing, Sockets & Protocol Analysis',
    codeSnippet: {
      language: 'bash',
      title: 'Socket Listener & Routing Table Inspection',
      description: 'Diagnostics for open ports, socket states, and default gateways.',
      code: `ss -tulpn | grep -E ':(80|443|3000|5432)'
ip route show default
ping -c 4 -M do -s 1472 1.1.1.1`,
    },
  },
  {
    id: 'security',
    title: 'Network Security & Cybersecurity',
    subtitle: 'Threat modeling, access control, encryption, and defensive posture',
    badge: 'CORE DOMAIN 03',
    accentColor: 'indigo',
    description: 'Studying defensive security paradigms, cryptographic standards, packet filtering, firewall configurations, and vulnerability assessments.',
    protocols: ['SSL/TLS', 'Firewalls / iptables', 'PKI & Cryptography', 'OWASP Top 10', 'Access Control (RBAC)'],
    keyTopics: [
      'Defensive Network Perimeter & Packet Filtering',
      'Transport Layer Security (TLS) Handshake Decryption',
      'API Security: Prevention of Injection, CSRF, and Broken Auth',
      'Vulnerability Surface Scanning & Hardening',
    ],
    architectureFocus: 'Zero-Trust Verification, Threat Modeling & Defensive Controls',
    codeSnippet: {
      language: 'bash',
      title: 'TLS 1.3 Cipher & Security Headers Audit',
      description: 'Testing defensive HTTP response headers and cryptographic ciphers.',
      code: `curl -sI https://yeasin-sec.vercel.app/api/health | grep -iE '(strict-transport|x-frame|content-security)'
openssl s_client -connect yeasin-sec.vercel.app:443 -tls1_3`,
    },
  },
  {
    id: 'linux',
    title: 'Linux Systems & Environment',
    subtitle: 'Kernel primitives, daemon management, shell pipelines, and system internals',
    badge: 'CORE DOMAIN 04',
    accentColor: 'amber',
    description: 'Harnessing the Linux operating system as a development and server backbone through automation scripting, process inspection, and permission hardening.',
    protocols: ['Bash / Shell Scripting', 'systemd', 'POSIX', 'SSH Hardening', 'Process Management', 'Cron'],
    keyTopics: [
      'Linux Shell Automation & Pipeline Data Processing',
      'System Services, Daemons & Log Diagnostics (journalctl)',
      'File Permissions (chmod/chown), ACLs, and Sudoers',
      'Process Lifecycle (kill, ps, top, htop, fork/exec)',
    ],
    architectureFocus: 'POSIX Process Lifecycles, Daemons & Automated Pipelines',
    codeSnippet: {
      language: 'bash',
      title: 'Systemd Unit Status & Journal Tailing',
      description: 'Inspecting hardened daemon services and real-time log output.',
      code: `sudo systemctl status backend-node.service
journalctl -u backend-node.service -f -n 50
ps aux --sort=-%mem | head -n 10`,
    },
  },
];

export const VERIFIED_PROJECTS: ProjectItem[] = [
  {
    id: 'nodejs-server',
    title: 'nodeJS-server',
    repoName: 'yeasin4745/nodeJS-server',
    status: 'verified',
    category: 'Backend',
    description: 'Custom Node.js server implementation exploring modular routing structures, middleware pipelines, dynamic request handling, and backend service lifecycle.',
    technicalHighlights: [
      'Custom HTTP request/response dispatching logic',
      'Middleware integration for request lifecycle management',
      'Modular route handlers and clean API separation',
      'Verified directly from public GitHub repository',
    ],
    architectureTags: ['Node.js', 'JavaScript', 'HTTP/REST', 'Backend Architecture'],
    githubUrl: 'https://github.com/yeasin4745/nodeJS-server',
    isVerifiedReal: true,
  },
  {
    id: 'python-systems',
    title: 'Python- (Systems & Logic Scripts)',
    repoName: 'yeasin4745/Python-',
    status: 'verified',
    category: 'Systems & Scripts',
    description: 'Structured repository of Python programs exploring core programming logic, algorithmic patterns, file handling, and computational problem-solving.',
    technicalHighlights: [
      'Modular functional programming & logic structures',
      'File I/O and data processing scripts',
      'Algorithmic foundations for backend automation',
      'Verified directly from public GitHub repository',
    ],
    architectureTags: ['Python', 'Automation', 'Algorithms', 'Logic Design'],
    githubUrl: 'https://github.com/yeasin4745/Python-',
    isVerifiedReal: true,
  },

  {
    id: 'pending-project-slot-1',
    title: 'Network Protocol & Sockets Project',
    repoName: 'yeasin4745/[Pending Input]',
    status: 'in_progress',
    category: 'Networking',
    description: 'Designated slot for upcoming socket-level server implementation, network daemon, or protocol parser currently under study or development.',
    technicalHighlights: [
      'Authentic placeholder awaiting project input from Yeasin',
      'Planned for socket communication / packet parser integration',
      'No fictional achievements or fabricated repositories',
    ],
    architectureTags: ['Sockets', 'TCP/UDP', 'Under Development'],
    isVerifiedReal: false,
    requiresInput: true,
  },
  {
    id: 'pending-project-slot-2',
    title: 'Security Hardening & Defensive Lab Project',
    repoName: 'yeasin4745/[Pending Input]',
    status: 'specs_pending',
    category: 'Cybersecurity',
    description: 'Dedicated slot for upcoming network security audit tool, authentication gateway, or Linux server hardening framework.',
    technicalHighlights: [
      'Authentic placeholder awaiting project documentation from Yeasin',
      'Planned for defensive authentication & security rule configuration',
      'Strictly maintained with zero artificial claims',
    ],
    architectureTags: ['Security', 'Defensive Auth', 'Under Development'],
    isVerifiedReal: false,
    requiresInput: true,
  },
];

export const SECURITY_LABS: SecurityLabItem[] = [
  {
    id: 'lab-01',
    code: 'LAB-NET-01',
    title: 'Wireshark TCP Handshake & Packet Flow Dissection',
    domain: 'Protocol Analysis',
    status: 'Documented',
    summary: 'Capturing and analyzing SYN, SYN-ACK, ACK sequence numbers, window scaling, and connection termination (FIN/RST) across local and remote connections.',
    toolsUsed: ['Wireshark', 'tcpdump', 'Raw Sockets', 'curl'],
    keyTakeaway: 'Deepened practical understanding of transmission reliability, retransmissions, and TCP state machine transitions.',
    codeSnippet: {
      language: 'bash',
      title: 'Packet Filter & Capture Syntax',
      description: 'Capture TCP 3-way handshake packets on port 443 with verbose headers.',
      code: `sudo tcpdump -i any -nn -v 'tcp[tcpflags] & (tcp-syn|tcp-ack|tcp-fin) != 0 and port 443' -c 10`,
    },
  },
  {
    id: 'lab-02',
    code: 'LAB-SEC-02',
    title: 'REST API Authentication & Header Security Audit',
    domain: 'Defensive Security',
    status: 'Active Lab',
    summary: 'Evaluating backend endpoints against missing security headers (HSTS, CSP, X-Frame-Options), improper CORS policies, and token leakage.',
    toolsUsed: ['Postman', 'Node.js', 'JWT Inspector', 'cURL'],
    keyTakeaway: 'Standardized defensive header practices and token expiration lifecycles on backend microservices.',
    codeSnippet: {
      language: 'bash',
      title: 'CORS Pre-Flight & Defensive Headers Inspection',
      description: 'Audit API endpoint headers for strict transport security and frame restrictions.',
      code: `curl -i -X OPTIONS https://yeasin4745-dev.vercel.app/api/contact \\
  -H "Origin: https://yeasin-sec.vercel.app" \\
  -H "Access-Control-Request-Method: POST"`,
    },
  },
  {
    id: 'lab-03',
    code: 'LAB-SYS-03',
    title: 'Linux Server Hardening & SSH Key Enforcement',
    domain: 'System Hardening',
    status: 'Active Lab',
    summary: 'Configuring non-root administrative users, enforcing Ed25519 SSH keys, disabling password authentication, and setting up basic UFW firewall rules.',
    toolsUsed: ['Ubuntu Server', 'SSH (Ed25519)', 'UFW / iptables', 'systemd'],
    keyTakeaway: 'Minimized attack surface on Linux hosts by restricting open ports and eliminating brute-force vectors.',
    codeSnippet: {
      language: 'bash',
      title: 'Defensive UFW Rules & Status Verification',
      description: 'Enforce default deny incoming and explicitly enable secured OpenSSH access.',
      code: `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw enable && sudo ufw status verbose`,
    },
  },
  {
    id: 'lab-04',
    code: 'LAB-NET-04',
    title: 'Subnet Topology & CIDR Allocation Planning',
    domain: 'Networking',
    status: 'Planned Scenario',
    summary: 'Architecting multi-tier network topologies, isolating backend database subnets from public ingress, and calculating broadcast/network address boundaries.',
    toolsUsed: ['CIDR Calculators', 'Network Diagrams', 'Routing Tables'],
    keyTakeaway: 'Clear principles for network segregation and defense-in-depth layout.',
    codeSnippet: {
      language: 'bash',
      title: 'IP Address & Subnet Routing Scope',
      description: 'Inspect assigned IPv4 network interfaces and local route table metrics.',
      code: `ip -br -c addr show
ip route show`,
    },
  },
];

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: 'rfc-793',
    category: 'RFC & Protocol Study',
    title: 'RFC 793 / RFC 9293: Transmission Control Protocol (TCP) Specification',
    status: 'Deep Study',
    notes: 'Studying state transition diagrams, sliding window algorithms, congestion window expansion, and socket teardown semantics.',
    references: ['IETF RFC 9293', 'TCP/IP Illustrated Vol. 1'],
    dateAdded: 'Active Study',
    codeSnippet: {
      language: 'bash',
      title: 'TCP Socket State & Window Buffer Inspection',
      description: 'Observing kernel TCP window buffers and active socket timers.',
      code: `ss -tin 'sport = :443 or dport = :443'
cat /proc/sys/net/ipv4/tcp_wmem`,
    },
  },
  {
    id: 'rfc-9110',
    category: 'RFC & Protocol Study',
    title: 'RFC 9110: HTTP Semantics & Transport Evolution (HTTP/1.1 to HTTP/3)',
    status: 'Deep Study',
    notes: 'Analyzing stateless request-response mechanics, idempotency of methods, keep-alive connections, and QUIC over UDP.',
    references: ['IETF RFC 9110', 'Cloudflare Learning Guides'],
    dateAdded: 'Active Study',
    codeSnippet: {
      language: 'bash',
      title: 'HTTP/2 Protocol Negotiation Probe',
      description: 'Verifying TLS ALPN negotiation for HTTP/2 frames.',
      code: `curl -Iv --http2 https://yeasin4745-dev.vercel.app/ -o /dev/null`,
    },
  },
  {
    id: 'linux-internals',
    category: 'Linux Systems',
    title: 'Linux Process Architecture & Virtual File System (/proc, /sys)',
    status: 'Deep Study',
    notes: 'Investigating how the Linux kernel exposes runtime metrics via /proc, file descriptor management, standard streams, and signals.',
    references: ['Linux Man Pages', 'The Linux Command Line'],
    dateAdded: 'Active Study',
    codeSnippet: {
      language: 'bash',
      title: 'Kernel File Descriptor & Connection Backlog Check',
      description: 'Querying runtime kernel socket backlog and file descriptors.',
      code: `cat /proc/sys/net/core/somaxconn
ls -l /proc/self/fd/`,
    },
  },
  {
    id: 'owasp-api',
    category: 'Network Defense',
    title: 'OWASP API Security Top 10 Defensive Implementations',
    status: 'Completed Analysis',
    notes: 'Focusing on Broken Object Level Authorization (BOLA), Broken Authentication, and Unrestricted Resource Consumption prevention.',
    references: ['OWASP Foundation API Security Project'],
    dateAdded: 'Recent Review',
    codeSnippet: {
      language: 'bash',
      title: 'BOLA / IDOR Defensive Verification Probe',
      description: 'Validate that cross-tenant resource requests return 403 Forbidden.',
      code: `curl -s -o /dev/null -w "%{http_code}\\n" \\
  -H "Authorization: Bearer <AUTH_TOKEN>" \\
  https://yeasin-sec.vercel.app/api/restricted_resource`,
    },
  },
];

export const EXTENSIBLE_PROFILES: ExtensibleSocialProfile[] = [
  {
    platform: 'GitHub',
    handle: 'yeasin4745',
    url: 'https://github.com/yeasin4745',
    isVerified: true,
    type: 'github',
    note: 'Primary code repositories, backend experiments, and open-source learning.',
  },
  {
    platform: 'LinkedIn',
    handle: 'in/yeasin4745',
    url: 'https://linkedin.com/in/yeasin4745',
    isVerified: true,
    type: 'linkedin',
    note: 'Professional network, career updates, and verified engineering credentials.',
  },
  {
    platform: 'Primary Technical Hub',
    handle: 'yeasin4745-dev.vercel.app',
    url: 'https://yeasin4745-dev.vercel.app',
    isVerified: true,
    type: 'website',
    note: 'Primary production hub for backend architecture and systems documentation.',
  },
  {
    platform: 'Security & Systems Hub',
    handle: 'yeasin-sec.vercel.app',
    url: 'https://yeasin-sec.vercel.app',
    isVerified: true,
    type: 'website',
    note: 'Dedicated domain for network security, protocol analysis, and lab explorations.',
  },
];
