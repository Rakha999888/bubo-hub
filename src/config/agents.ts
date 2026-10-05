import { AgentConfig } from '../types';

export const AGENTS: AgentConfig[] = [
  // Floor 3 - Head Office
  {
    id: 'bubo-manager',
    name: 'Bubo Manager',
    department: 'Management',
    role: 'AI Company Manager',
    floor: 3,
    room: 'manager-office',
    website: null,
    accessory: 'manager-tie',
    desk: [-3, -2.8],
    manager: true,
    avatar: {
      hair: 'executive',
      hairColor: '#2b2118',
      top: 'executive-blazer',
      topColor: '#0e2439',
      accentColor: '#e0b341',
      bottom: 'form-pants',
      bottomColor: '#172233',
      shoes: 'dress-shoes',
      shoeColor: '#11151c',
      skinColor: '#f7d5a3',
      props: ['watch', 'manager-badge']
    }
  },
  {
    id: 'bubo-admin-portal',
    name: 'Bubo Admin Portal',
    department: 'Admin System',
    role: 'Admin Engineer',
    floor: 3,
    room: 'admin-office',
    website: 'admin.smlone.com',
    accessory: 'admin-badge',
    desk: [3, -2.8],
    avatar: {
      hair: 'admin-cut',
      hairColor: '#1d232a',
      top: 'business-blazer',
      topColor: '#1e293b',
      accentColor: '#3b82f6',
      bottom: 'form-pants',
      bottomColor: '#0f172a',
      shoes: 'dress-shoes',
      shoeColor: '#1e293b',
      skinColor: '#f4c795',
      props: ['tablet', 'id-badge']
    }
  },
  // Floor 2 - Technology & Operations Hub
  {
    id: 'bubo-n8n',
    name: 'Bubo n8n',
    department: 'Automation',
    role: 'Automation Engineer',
    floor: 2,
    room: 'automation-lab',
    website: null,
    accessory: 'workflow-board',
    desk: [-4.2, -3.2],
    avatar: {
      hair: 'short-modern',
      hairColor: '#2c3e50',
      top: 'tech-jacket',
      topColor: '#0f766e',
      accentColor: '#14b8a6',
      bottom: 'utility-pants',
      bottomColor: '#1e293b',
      shoes: 'sneakers-pro',
      shoeColor: '#0d9488',
      skinColor: '#f8d2a6',
      props: ['smartwatch', 'workflow-device']
    }
  },
  {
    id: 'bubo-portal',
    name: 'Bubo Portal',
    department: 'Frontend',
    role: 'Frontend / UI-UX Engineer',
    floor: 2,
    room: 'frontend-studio',
    website: 'portal.smlone.com',
    accessory: 'ui-pen',
    desk: [0, -3.2],
    avatar: {
      hair: 'creative-wavy',
      hairColor: '#4a2c11',
      top: 'designer-hoodie',
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
  {
    id: 'bubo-backend-portal',
    name: 'Bubo Backend',
    department: 'Backend',
    role: 'Backend Engineer (Express + Neon)',
    floor: 2,
    room: 'backend-room',
    website: 'api.smlone.cloud',
    accessory: 'db-cylinder',
    desk: [4.2, -3.2],
    avatar: {
      hair: 'neat-dark',
      hairColor: '#181825',
      top: 'dark-jacket',
      topColor: '#1e1b4b',
      accentColor: '#6366f1',
      bottom: 'dark-jeans',
      bottomColor: '#111827',
      shoes: 'sneakers-pro',
      shoeColor: '#4338ca',
      skinColor: '#f6d09e',
      props: ['headphones', 'terminal-device']
    }
  },
  {
    id: 'bubo-ticketing',
    name: 'Bubo Ticketing',
    department: 'Support',
    role: 'Jira / Helpdesk Agent',
    floor: 2,
    room: 'helpdesk',
    website: null,
    accessory: 'ticket',
    desk: [-4.2, 0.2],
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
  },
  {
    id: 'bubo-source-video',
    name: 'Bubo Video',
    department: 'Video Production',
    role: 'Video Script & Production',
    floor: 2,
    room: 'video-studio',
    website: null,
    accessory: 'camera',
    desk: [0, 0.2],
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
  {
    id: 'bubo-pdf',
    name: 'Bubo PDF',
    department: 'Documents',
    role: 'PDF Processing Agent',
    floor: 2,
    room: 'doc-room',
    website: null,
    accessory: 'pdf-doc',
    desk: [4.2, 0.2],
    avatar: {
      hair: 'office-clean',
      hairColor: '#2b2118',
      top: 'doc-shirt',
      topColor: '#15803d',
      accentColor: '#4ade80',
      bottom: 'form-pants',
      bottomColor: '#1f2937',
      shoes: 'dress-shoes',
      shoeColor: '#111827',
      skinColor: '#f5d5b0',
      props: ['doc-folder', 'tablet']
    }
  },
  // Floor 1 - Infrastructure Hub
  {
    id: 'bubo-building',
    name: 'Bubo Building',
    department: 'Infrastructure',
    role: 'Infra / Build / Deploy Engineer',
    floor: 1,
    room: 'infra-room',
    website: null,
    accessory: 'server-rack',
    desk: [-4, -2.8],
    avatar: {
      hair: 'practical-short',
      hairColor: '#1c1917',
      top: 'utility-jacket',
      topColor: '#0e7490',
      accentColor: '#22d3ee',
      bottom: 'utility-pants',
      bottomColor: '#1c2430',
      shoes: 'work-boots',
      shoeColor: '#451a03',
      skinColor: '#f3ca98',
      props: ['tool-belt', 'server-device']
    }
  }
];

export const BREAK_SPOT: Record<number, [number, number]> = { 1: [4.6, -2.2], 2: [6, 3], 3: [6, 3] };
