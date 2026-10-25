import { AgentConfig } from '../../types';

// ─── 10 MAIN SMLONE AGENTS IN EXPANSIVE HORIZONTAL SINGLE-FLOOR OFFICE ───
// Central Open Workstations mapped 1:1 to real Discord channels
export const BUBO_CHARACTERS: AgentConfig[] = [
  // ─── 1. RAKHA (Manager / Coordinator) ──────────────────────────────────
  {
    id: 'bubo-manager',
    name: 'Rakha',
    displayName: 'Rakha (Coordinator)',
    role: 'Head of AI Operations & Coordinator',
    department: '#💬・general-chat',
    floor: 1,
    room: 'executive-wing',
    website: null,
    personality: ['calm', 'strategic', 'responsible', 'observant', 'friendly', 'confident', 'leadership-oriented'],
    visualTheme: 'gold-navy',
    workspace: 'Executive Command Desk',
    accessory: 'manager-tie',
    desk: [-11.5, -2.2],
    manager: true,
    avatar: {
      hair: 'executive',
      hairColor: '#2b2118',
      top: 'executive-blazer',
      topColor: '#1e293b',
      accentColor: '#fbbf24',
      bottom: 'form-pants',
      bottomColor: '#0f172a',
      shoes: 'sneakers-pro',
      shoeColor: '#1e293b',
      skinColor: '#f7d5a3',
      props: ['smartwatch', 'tablet', 'manager-badge']
    }
  },

  // ─── 2. BUBO ADMIN (Dashboard Admin & Operations) ──────────────────────
  {
    id: 'bubo-admin-portal',
    name: 'Bubo Admin',
    displayName: 'Bubo Admin Portal',
    role: 'Dashboard Admin & Operasional Sistem',
    department: '#🛡・bubo-admin-portal',
    floor: 1,
    room: 'executive-wing',
    website: 'admin.smlone.com',
    personality: ['organized', 'fastidious', 'protective', 'clear', 'decisive'],
    visualTheme: 'emerald-dark',
    workspace: 'Admin & Operations Desk',
    accessory: 'admin-badge',
    desk: [-8.8, -2.2],
    avatar: {
      hair: 'creative-wavy',
      hairColor: '#3c2415',
      top: 'business-blazer',
      topColor: '#0f172a',
      accentColor: '#10b981',
      bottom: 'form-pants',
      bottomColor: '#1e293b',
      shoes: 'dress-shoes',
      shoeColor: '#0f172a',
      skinColor: '#f7d5a3',
      props: ['tablet']
    }
  },

  // ─── 3. BUBO N8N (Senior Automation Engineer) ──────────────────────────
  {
    id: 'bubo-n8n',
    name: 'Bubo n8n',
    displayName: 'Bubo n8n',
    role: 'Otomasi Alur Kerja & Integrasi n8n',
    department: '#⚡・bubo-n8n',
    floor: 1,
    room: 'central-dev-hub',
    website: 'https://n8n-jua7.srv1825659.hstgr.cloud',
    personality: ['automated', 'efficient', 'integrator', 'systematic'],
    visualTheme: 'orange-red',
    workspace: 'Automation Bay 1',
    accessory: 'workflow-board',
    desk: [-4.2, -2.5],
    avatar: {
      hair: 'short-modern',
      hairColor: '#292524',
      top: 'tech-jacket',
      topColor: '#1e293b',
      accentColor: '#f97316',
      bottom: 'modern-pants',
      bottomColor: '#1c1917',
      shoes: 'work-boots',
      shoeColor: '#292524',
      skinColor: '#f4c59b',
      props: ['smartwatch', 'coffee-mug']
    }
  },

  // ─── 4. BUBO PORTAL (Frontend Engineer) ────────────────────────────────
  {
    id: 'bubo-portal',
    name: 'Bubo Portal',
    displayName: 'Bubo Portal',
    role: 'Frontend UI/UX Web Portal Trainee',
    department: '#🌐・bubo-portal',
    floor: 1,
    room: 'central-dev-hub',
    website: 'portal.smlone.com',
    personality: ['creative', 'precise', 'energetic', 'aesthetic-minded', 'responsive'],
    visualTheme: 'cyan-blue',
    workspace: 'Frontend Workstation 1',
    accessory: 'ui-pen',
    desk: [-1.4, -2.5],
    avatar: {
      hair: 'short-modern',
      hairColor: '#1c1917',
      top: 'designer-hoodie',
      topColor: '#0f172a',
      accentColor: '#06b6d4',
      bottom: 'slim-pants',
      bottomColor: '#1e293b',
      shoes: 'sneakers-pro',
      shoeColor: '#06b6d4',
      skinColor: '#eec19a',
      props: ['glasses', 'tablet']
    }
  },

  // ─── 5. BUBO BACKEND (Backend DB Architect) ────────────────────────────
  {
    id: 'bubo-backend-portal',
    name: 'Bubo Backend',
    displayName: 'Bubo Backend',
    role: 'Backend Engineering & DB Neon PostgreSQL',
    department: '#💻・bubo-backend-portal',
    floor: 1,
    room: 'central-dev-hub',
    website: 'api.smlone.cloud',
    personality: ['analytical', 'reliable', 'focus', 'architectural', 'robust'],
    visualTheme: 'green-slate',
    workspace: 'Backend Workstation 2',
    accessory: 'db-cylinder',
    desk: [1.4, -2.5],
    avatar: {
      hair: 'office-clean',
      hairColor: '#171717',
      top: 'dark-jacket',
      topColor: '#1e293b',
      accentColor: '#10b981',
      bottom: 'dark-jeans',
      bottomColor: '#0f172a',
      shoes: 'dress-shoes',
      shoeColor: '#1e293b',
      skinColor: '#dfa87a',
      props: ['glasses']
    }
  },

  // ─── 6. BUBO PTM (Monitoring & Pelaporan PTM) ──────────────────────────
  {
    id: 'bubo-ptm',
    name: 'Bubo PTM',
    displayName: 'Bubo PTM',
    role: 'Pelaporan & Tracking Monitoring PTM',
    department: '#📊・bubo-ptm',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['meticulous', 'data-driven', 'structured', 'reporting-expert'],
    visualTheme: 'blue-slate',
    workspace: 'Monitoring & Reporting Desk',
    accessory: 'workflow-board',
    desk: [4.2, -2.5],
    avatar: {
      hair: 'office-clean',
      hairColor: '#1f2937',
      top: 'tech-jacket',
      topColor: '#1e293b',
      accentColor: '#3b82f6',
      bottom: 'modern-pants',
      bottomColor: '#0f172a',
      shoes: 'sneakers-pro',
      shoeColor: '#1e293b',
      skinColor: '#e5b88f',
      props: ['tablet', 'clipboard']
    }
  },

  // ─── 7. BUBO QC PORTAL (Quality Control & Audit) ───────────────────────
  {
    id: 'bubo-qc-portal',
    name: 'Bubo QC',
    displayName: 'Bubo QC Portal',
    role: 'Quality Control & Troubleshooting Audit',
    department: '#🔍・bubo-qc-portal',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['detail-obsessed', 'rigorous', 'skeptical', 'thorough', 'quick-tester'],
    visualTheme: 'sky-slate',
    workspace: 'Quality Control Desk',
    accessory: 'qc-lens',
    desk: [-4.2, 0.4],
    avatar: {
      hair: 'qa-spiky',
      hairColor: '#1c1917',
      top: 'qa-vest',
      topColor: '#1e293b',
      accentColor: '#0ea5e9',
      bottom: 'dark-jeans',
      bottomColor: '#0f172a',
      shoes: 'sneakers-pro',
      shoeColor: '#0ea5e9',
      skinColor: '#f2c195',
      props: ['clipboard']
    }
  },

  // ─── 8. BUBO TICKETING (IT Helpdesk Lead) ──────────────────────────────
  {
    id: 'bubo-ticketing',
    name: 'Bubo Ticketing',
    displayName: 'Bubo Ticketing',
    role: 'IT Ticketing & Jira Cloud Helpdesk',
    department: '#🎫・bubo-ticketing',
    floor: 1,
    room: 'central-dev-hub',
    website: 'https://smlone.atlassian.net',
    personality: ['empathetic', 'problem-solver', 'communicator', 'calm', 'supportive'],
    visualTheme: 'amber-dark',
    workspace: 'Helpdesk & Support Desk',
    accessory: 'ticket',
    desk: [-1.4, 0.4],
    avatar: {
      hair: 'friendly-medium',
      hairColor: '#1f2937',
      top: 'support-shirt',
      topColor: '#1e293b',
      accentColor: '#f59e0b',
      bottom: 'modern-pants',
      bottomColor: '#0f172a',
      shoes: 'dress-shoes',
      shoeColor: '#111827',
      skinColor: '#e0af83',
      props: ['headset']
    }
  },

  // ─── 9. BUBO BUILDING (System Architecture & Server Build) ────────────
  {
    id: 'bubo-building',
    name: 'Bubo Building',
    displayName: 'Bubo Building',
    role: 'Arsitektur Sistem & Server Build SMLONE',
    department: '#🏗・bubo-building',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['precise', 'architectural', 'infrastructure-focused', 'pragmatic'],
    visualTheme: 'cyan-slate',
    workspace: 'Infra & Server Architecture Desk',
    accessory: 'server-rack',
    desk: [1.4, 0.4],
    avatar: {
      hair: 'neat-dark',
      hairColor: '#1f2937',
      top: 'tech-jacket',
      topColor: '#1e293b',
      accentColor: '#06b6d4',
      bottom: 'utility-pants',
      bottomColor: '#0f172a',
      shoes: 'work-boots',
      shoeColor: '#111827',
      skinColor: '#f4c59b',
      props: ['smartwatch']
    }
  },

  // ─── 10. BUBO SHEET (Pipeline Otomasi Sheets) ──────────────────────────
  {
    id: 'bubo-sheet',
    name: 'Bubo Sheet',
    displayName: 'Bubo Sheet',
    role: 'Automasi & Pipeline Google Sheets',
    department: '#bubo-sheet',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['systematic', 'data-pipeline', 'efficient', 'integrator'],
    visualTheme: 'emerald-teal',
    workspace: 'Sheets Pipeline Desk',
    accessory: 'pdf-doc',
    desk: [4.2, 0.4],
    avatar: {
      hair: 'short-modern',
      hairColor: '#1c1917',
      top: 'tech-jacket',
      topColor: '#0f172a',
      accentColor: '#10b981',
      bottom: 'modern-pants',
      bottomColor: '#1e293b',
      shoes: 'sneakers-pro',
      shoeColor: '#10b981',
      skinColor: '#f4c59b',
      props: ['tablet', 'coffee-mug']
    }
  }
];