export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName?: string;
}

export interface TechnicalPillar {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  accentColor: 'cyan' | 'emerald' | 'indigo' | 'amber';
  protocols: string[];
  keyTopics: string[];
  terminalCommand: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  repoName: string;
  status: 'verified' | 'in_progress' | 'specs_pending';
  category: 'Backend' | 'Systems & Scripts' | 'Networking' | 'Cybersecurity' | 'Utility';
  description: string;
  technicalHighlights: string[];
  architectureTags: string[];
  githubUrl?: string;
  isVerifiedReal: boolean;
  requiresInput?: boolean;
}

export interface SecurityLabItem {
  id: string;
  code: string;
  title: string;
  domain: 'Networking' | 'Defensive Security' | 'System Hardening' | 'Protocol Analysis';
  status: 'Documented' | 'Active Lab' | 'Planned Scenario';
  summary: string;
  toolsUsed: string[];
  keyTakeaway: string;
}

export interface ResearchItem {
  id: string;
  category: 'RFC & Protocol Study' | 'Linux Systems' | 'Network Defense' | 'Backend Patterns';
  title: string;
  status: 'Deep Study' | 'Completed Analysis' | 'Queued';
  notes: string;
  references: string[];
  dateAdded: string;
}

export interface ExtensibleSocialProfile {
  platform: string;
  handle: string;
  url: string;
  isVerified: boolean;
  type: 'github' | 'email' | 'upcoming';
  note?: string;
}

export interface TelemetryMetric {
  label: string;
  value: string;
  status: 'nominal' | 'active' | 'synced';
  detail: string;
}
