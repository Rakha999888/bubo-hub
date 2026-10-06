import { AgentConfig } from '../../types';

// ─── 8 MAIN AGENTS IN EXPANSIVE HORIZONTAL SINGLE-FLOOR OFFICE ───────────
// Central Open Workstations (x from -5.5 to +5.5, z from -2.8 to +0.5)
export const BUBO_CHARACTERS: AgentConfig[] = [
  // ─── 1. RAKHA (Manager / Coordinator) ──────────────────────────────────
  {
    id: 'bubo-manager',
    name: 'Rakha',
    displayName: 'Rakha',
    role: 'Product Lead & Coordinator',
    department: '#general-chat',
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

  // ─── 2. KOKO (Senior Automation Engineer) ──────────────────────────────
  {
    id: 'bubo-n8n',
    name: 'Koko',
    displayName: 'Koko',
    role: 'Senior Automation Engineer',
    department: '#bubo-n8n',
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

  // ─── 3. BUDI (Frontend Engineer) ───────────────────────────────────────
  {
    id: 'bubo-portal',
    name: 'Budi',
    displayName: 'Budi',
    role: 'Frontend UI/UX Web Engineer',
    department: '#bubo-portal',
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

  // ─── 4. SAMSUL (Backend Architect) ─────────────────────────────────────
  {
    id: 'bubo-backend-portal',
    name: 'Samsul',
    displayName: 'Samsul',
    role: 'Backend Engineering & DB Architect',
    department: '#bubo-backend-portal',
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

  // ─── 5. PINA (UI/UX & Design Operations) ───────────────────────────────
  {
    id: 'bubo-admin-portal',
    name: 'Pina',
    displayName: 'Pina',
    role: 'Dashboard Admin & Operations',
    department: '#bubo-admin-portal',
    floor: 1,
    room: 'executive-wing',
    website: 'admin.smlone.com',
    personality: ['organized', 'fastidious', 'protective', 'clear', 'decisive'],
    visualTheme: 'emerald-dark',
    workspace: 'Design & Admin Desk',
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

  // ─── 6. ALPIN (Media Production Lead) ──────────────────────────────────
  {
    id: 'bubo-source-video',
    name: 'Alpin',
    displayName: 'Alpin',
    role: 'Media Production & Motion Lead',
    department: '#bubo-source-video',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['visual', 'storyteller', 'meticulous', 'creative', 'cinematic'],
    visualTheme: 'violet-night',
    workspace: 'Media & Video Desk',
    accessory: 'camera',
    desk: [-4.2, 0.4],
    avatar: {
      hair: 'creative-long',
      hairColor: '#262626',
      top: 'creative-jacket',
      topColor: '#1e293b',
      accentColor: '#8b5cf6',
      bottom: 'slim-pants',
      bottomColor: '#0f172a',
      shoes: 'sneakers-casual',
      shoeColor: '#8b5cf6',
      skinColor: '#e5b88f',
      props: ['headphones']
    }
  },

  // ─── 7. JUKI (QA & Testing Lead) ───────────────────────────────────────
  {
    id: 'bubo-qc-portal',
    name: 'Juki',
    displayName: 'Juki',
    role: 'Quality Control & Automation QC',
    department: '#bubo-qc-portal',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['detail-obsessed', 'rigorous', 'skeptical', 'thorough', 'quick-tester'],
    visualTheme: 'sky-slate',
    workspace: 'Quality Control Desk',
    accessory: 'qc-lens',
    desk: [-1.4, 0.4],
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

  // ─── 8. ROKI (IT Helpdesk Lead) ────────────────────────────────────────
  {
    id: 'bubo-ticketing',
    name: 'Roki',
    displayName: 'Roki',
    role: 'IT Ticketing & Service Desk Lead',
    department: '#bubo-ticketing',
    floor: 1,
    room: 'central-dev-hub',
    website: 'https://smlone.atlassian.net',
    personality: ['empathetic', 'problem-solver', 'communicator', 'calm', 'supportive'],
    visualTheme: 'amber-dark',
    workspace: 'Helpdesk & Support Desk',
    accessory: 'ticket',
    desk: [1.4, 0.4],
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

  // ─── 9. KOKO (Building & Infrastructure Lead) ──────────────────────────
  {
    id: 'bubo-building',
    name: 'Koko',
    displayName: 'Koko',
    role: 'System Architecture & Build Lead',
    department: '#bubo-building',
    floor: 1,
    room: 'central-dev-hub',
    website: null,
    personality: ['precise', 'architectural', 'infrastructure-focused', 'pragmatic'],
    visualTheme: 'cyan-slate',
    workspace: 'Infra & Server Architecture Desk',
    accessory: 'server-rack',
    desk: [4.2, -2.5],
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
  }
];
