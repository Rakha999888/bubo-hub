import { RoomConfig } from '../types';

export const FLOOR_NAMES: Record<number, string> = {
  1: 'Infrastructure Hub',
  2: 'Technology & Operations Hub',
  3: 'Head Office & Management'
};

export const FLOOR_HEIGHT = 4;
export const floorY = (f: number) => (f - 1) * FLOOR_HEIGHT;

export const ROOMS: RoomConfig[] = [
  // ─── FLOOR 3: HEAD OFFICE & ADMIN ─────────────────────────────────
  {
    id: 'manager-office',
    floor: 3,
    name: 'Head of AI Operations',
    type: 'executive',
    agentIds: ['bubo-manager'],
    center: [-3.2, -1.8],
    size: [5.8, 5.2],
    color: '#8b6b4a'
  },
  {
    id: 'admin-office',
    floor: 3,
    name: 'Admin System Management',
    type: 'admin',
    agentIds: ['bubo-admin-portal'],
    center: [3.2, -1.8],
    size: [5.8, 5.2],
    color: '#3b556e'
  },

  // ─── FLOOR 2: TECHNOLOGY & OPERATIONS HUB ──────────────────────────
  {
    id: 'automation-lab',
    floor: 2,
    name: 'Automation & Integration',
    type: 'automation',
    agentIds: ['bubo-n8n'],
    center: [-4.5, -2.5],
    size: [2.8, 3.2],
    color: '#0f766e'
  },
  {
    id: 'frontend-studio',
    floor: 2,
    name: 'Frontend Web Portal',
    type: 'frontend',
    agentIds: ['bubo-portal'],
    center: [-1.5, -2.5],
    size: [2.8, 3.2],
    color: '#1d4ed8'
  },
  {
    id: 'backend-room',
    floor: 2,
    name: 'Backend & Database',
    type: 'backend',
    agentIds: ['bubo-backend-portal'],
    center: [1.5, -2.5],
    size: [2.8, 3.2],
    color: '#312e81'
  },
  {
    id: 'qc-room',
    floor: 2,
    name: 'QC & Troubleshooting',
    type: 'qc',
    agentIds: ['bubo-qc-portal'],
    center: [4.5, -2.5],
    size: [2.8, 3.2],
    color: '#0369a1'
  },
  {
    id: 'helpdesk',
    floor: 2,
    name: 'IT Ticketing & Jira',
    type: 'support',
    agentIds: ['bubo-ticketing'],
    center: [-4.5, 1.8],
    size: [2.8, 3.2],
    color: '#c2410c'
  },
  {
    id: 'video-studio',
    floor: 2,
    name: 'Video & Creative Script',
    type: 'video',
    agentIds: ['bubo-source-video'],
    center: [-1.5, 1.8],
    size: [2.8, 3.2],
    color: '#6b21a8'
  },
  {
    id: 'doc-room',
    floor: 2,
    name: 'PDF & Document Operations',
    type: 'documents',
    agentIds: ['bubo-pdf'],
    center: [1.5, 1.8],
    size: [2.8, 3.2],
    color: '#15803d'
  },

  // ─── FLOOR 1: INFRASTRUCTURE HUB ──────────────────────────────────
  {
    id: 'infra-room',
    floor: 1,
    name: 'DevOps & Server Build',
    type: 'infra',
    agentIds: ['bubo-building'],
    center: [-3.5, -1.8],
    size: [6, 5.2],
    color: '#0e7490'
  },
  {
    id: 'bubo-lounge',
    floor: 1,
    name: 'Lounge & Coffee Corner',
    type: 'lounge',
    agentIds: [],
    center: [3.5, 0],
    size: [6, 8],
    color: '#854d0e'
  }
];
