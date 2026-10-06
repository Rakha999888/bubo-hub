import { AgentConfig } from '../../types';

export const BUBO_CHARACTERS: AgentConfig[] = [
  // ─── 1. RAKHA — MANAGER (Technical ID: bubo-manager) ─────────────────────
  {
    id: 'bubo-manager',
    name: 'Rakha',
    displayName: 'Rakha',
    role: 'Manager',
    department: '#💬・general-chat',
    floor: 3,
    room: 'manager-office',
    website: null,
    personality: ['calm', 'strategic', 'responsible', 'observant', 'friendly', 'confident', 'leadership-oriented'],
    visualTheme: 'gold-navy',
    workspace: 'Manager Office & AI Operations',
    accessory: 'manager-badge',
    desk: [-3.2, -1.8],
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

  // ─── 2. KOKO — SENIOR SOFTWARE ENGINEER (Technical ID: bubo-building) ───
  {
    id: 'bubo-building',
    name: 'Koko',
    displayName: 'Koko',
    role: 'Senior Software Engineer',
    department: '#🏗・bubo-building',
    floor: 1,
    room: 'infra-room',
    website: null,
    personality: ['experienced', 'calm', 'analytical', 'highly-technical', 'patient', 'focused', 'problem-solver', 'mentor'],
    visualTheme: 'dark-cyan',
    workspace: 'Senior Engineering & Architecture Hub',
    accessory: 'server-rack',
    desk: [-3.5, -1.8],
    avatar: {
      hair: 'neat-dark',
      hairColor: '#1c1917',
      top: 'dark-jacket',
      topColor: '#0f172a',
      accentColor: '#06b6d4',
      bottom: 'dark-jeans',
      bottomColor: '#1e293b',
      shoes: 'sneakers-pro',
      shoeColor: '#0284c7',
      skinColor: '#f3ca98',
      props: ['headphones', 'smartwatch', 'laptop']
    }
  },

  // ─── 3. BUDI — FE (Technical ID: bubo-portal) ───────────────────────────
  {
    id: 'bubo-portal',
    name: 'Budi',
    displayName: 'Budi',
    role: 'FE',
    department: '#🌐・bubo-portal',
    floor: 2,
    room: 'frontend-studio',
    website: 'portal.smlone.com',
    personality: ['creative', 'antislop', 'responsive', 'visual-craft'],
    visualTheme: 'blue',
    workspace: 'Frontend Engineering Studio',
    accessory: 'ui-pen',
    desk: [-1.5, -2.5],
    avatar: {
      hair: 'short-modern',
      hairColor: '#332418',
      top: 'tech-jacket',
      topColor: '#2563eb',
      accentColor: '#60a5fa',
      bottom: 'modern-pants',
      bottomColor: '#1e1e2e',
      shoes: 'sneakers-casual',
      shoeColor: '#3b82f6',
      skinColor: '#fae0c1',
      props: ['headphones', 'tablet']
    }
  },

  // ─── 4. PINA — UI/UX (Technical ID: bubo-admin-portal) ───────────────────
  {
    id: 'bubo-admin-portal',
    name: 'Pina',
    displayName: 'Pina',
    role: 'UI/UX',
    department: '#🛡・bubo-admin-portal',
    floor: 3,
    room: 'admin-office',
    website: 'admin.smlone.com',
    personality: ['design-oriented', 'user-centric', 'aesthetic', 'detail-focused'],
    visualTheme: 'navy-blue',
    workspace: 'UI/UX & Product Design Studio',
    accessory: 'admin-badge',
    desk: [3.2, -1.8],
    avatar: {
      hair: 'creative-wavy',
      hairColor: '#4a2c11',
      top: 'designer-hoodie',
      topColor: '#6366f1',
      accentColor: '#a5b4fc',
      bottom: 'slim-pants',
      bottomColor: '#1e1b4b',
      shoes: 'sneakers-casual',
      shoeColor: '#818cf8',
      skinColor: '#fce3c7',
      props: ['tablet', 'headphones']
    }
  },

  // ─── 5. SAMSUL — BACKEND DEVELOPER (Technical ID: bubo-backend-portal) ───
  {
    id: 'bubo-backend-portal',
    name: 'Samsul',
    displayName: 'Samsul',
    role: 'Backend Developer',
    department: '#💻・bubo-backend-portal',
    floor: 2,
    room: 'backend-room',
    website: 'api.smlone.cloud',
    personality: ['analytical', 'reliable', 'secure', 'systematic'],
    visualTheme: 'indigo',
    workspace: 'Backend & Database Engine',
    accessory: 'db-cylinder',
    desk: [1.5, -2.5],
    avatar: {
      hair: 'office-clean',
      hairColor: '#181825',
      top: 'dark-jacket',
      topColor: '#1e1b4b',
      accentColor: '#818cf8',
      bottom: 'dark-jeans',
      bottomColor: '#111827',
      shoes: 'sneakers-pro',
      shoeColor: '#4338ca',
      skinColor: '#f6d09e',
      props: ['headphones', 'terminal-device']
    }
  },

  // ─── 6. JUKI — QA AUTOMATION ENGINEER (Technical ID: bubo-qc-portal) ────
  {
    id: 'bubo-qc-portal',
    name: 'Juki',
    displayName: 'Juki',
    role: 'QA Automation Engineer',
    department: '#🔍・bubo-qc-portal',
    floor: 2,
    room: 'qc-room',
    website: null,
    personality: ['observant', 'thorough', 'critical', 'automation-first'],
    visualTheme: 'cyan',
    workspace: 'QA Automation & Verification Lab',
    accessory: 'qc-lens',
    desk: [4.5, -2.5],
    avatar: {
      hair: 'qa-spiky',
      hairColor: '#1e293b',
      top: 'qa-vest',
      topColor: '#0284c7',
      accentColor: '#38bdf8',
      bottom: 'dark-jeans',
      bottomColor: '#0f172a',
      shoes: 'sneakers-pro',
      shoeColor: '#0284c7',
      skinColor: '#f7d0a1',
      props: ['tablet', 'smartwatch']
    }
  },

  // ─── 7. ALPIN — VIDEO EDITOR (Technical ID: bubo-source-video) ───────────
  {
    id: 'bubo-source-video',
    name: 'Alpin',
    displayName: 'Alpin',
    role: 'Video Editor',
    department: '#🎬・bubo-source-video',
    floor: 2,
    room: 'video-studio',
    website: null,
    personality: ['creative', 'storyteller', 'dynamic', 'cinematic'],
    visualTheme: 'purple',
    workspace: 'Video Editing & Production Suite',
    accessory: 'camera',
    desk: [-1.5, 1.8],
    avatar: {
      hair: 'creative-long',
      hairColor: '#3b1c32',
      top: 'creative-jacket',
      topColor: '#7e22ce',
      accentColor: '#c084fc',
      bottom: 'slim-pants',
      bottomColor: '#18181b',
      shoes: 'sneakers-casual',
      shoeColor: '#a855f7',
      skinColor: '#fce3c7',
      props: ['camera', 'headphones']
    }
  },

  // ─── 8. ROKI — TICKETING (Technical ID: bubo-ticketing) ──────────────────
  {
    id: 'bubo-ticketing',
    name: 'Roki',
    displayName: 'Roki',
    role: 'Ticketing',
    department: '#🎫・bubo-ticketing',
    floor: 2,
    room: 'helpdesk',
    website: 'https://smlone.atlassian.net',
    personality: ['responsive', 'helpful', 'organized', 'customer-centric'],
    visualTheme: 'orange',
    workspace: 'IT Helpdesk & Jira Ticketing',
    accessory: 'ticket',
    desk: [-4.5, 1.8],
    avatar: {
      hair: 'friendly-medium',
      hairColor: '#5c3d2e',
      top: 'support-shirt',
      topColor: '#ea580c',
      accentColor: '#fb923c',
      bottom: 'modern-pants',
      bottomColor: '#334155',
      shoes: 'sneakers-casual',
      shoeColor: '#f97316',
      skinColor: '#f7d2a9',
      props: ['headset', 'clipboard']
    }
  }
];
