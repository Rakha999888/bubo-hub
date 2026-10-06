import { RoomConfig } from '../types';

export const FLOOR_NAMES: Record<number, string> = {
  1: 'Infrastructure Hub',
  2: 'Technology & Operations Hub',
  3: 'Head Office & Management',
  4: 'Lounge & Gaming Relax Zone'
};

export const FLOOR_HEIGHT = 4;
export const floorY = (f: number) => (f - 1) * FLOOR_HEIGHT;

export const ROOMS: RoomConfig[] = [
  // ─── FLOOR 3: HEAD OFFICE & ADMIN ─────────────────────────────────
  {
    id: 'manager-office',
    floor: 3,
    name: 'Manager Office',
    type: 'executive',
    agentIds: ['bubo-manager'],
    center: [-3.2, -1.8],
    size: [5.8, 5.2],
    color: '#8b6b4a'
  },
  {
    id: 'admin-office',
    floor: 3,
    name: 'UI/UX Design Studio',
    type: 'admin',
    agentIds: ['bubo-admin-portal'],
    center: [3.2, -1.8],
    size: [5.8, 5.2],
    color: '#3b556e'
  },

  // ─── FLOOR 2: TECHNOLOGY & OPERATIONS HUB ──────────────────────────
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
    name: 'Backend Engineering',
    type: 'backend',
    agentIds: ['bubo-backend-portal'],
    center: [1.5, -2.5],
    size: [2.8, 3.2],
    color: '#312e81'
  },
  {
    id: 'qc-room',
    floor: 2,
    name: 'QA Automation',
    type: 'qc',
    agentIds: ['bubo-qc-portal'],
    center: [4.5, -2.5],
    size: [2.8, 3.2],
    color: '#0369a1'
  },
  {
    id: 'helpdesk',
    floor: 2,
    name: 'IT Helpdesk & Ticketing',
    type: 'support',
    agentIds: ['bubo-ticketing'],
    center: [-4.5, 1.8],
    size: [2.8, 3.2],
    color: '#c2410c'
  },
  {
    id: 'video-studio',
    floor: 2,
    name: 'Video Production',
    type: 'video',
    agentIds: ['bubo-source-video'],
    center: [-1.5, 1.8],
    size: [2.8, 3.2],
    color: '#6b21a8'
  },

  // ─── FLOOR 1: INFRASTRUCTURE HUB ──────────────────────────────────
  {
    id: 'infra-room',
    floor: 1,
    name: 'Senior Engineering & Architecture',
    type: 'infra',
    agentIds: ['bubo-building'],
    center: [-3.5, -1.8],
    size: [6, 5.2],
    color: '#0e7490'
  },
  // ─── FLOOR 4: LOUNGE & GAMING RELAX ZONE (TV, PS5, SOFA, BEANBAGS) ─
  {
    id: 'gaming-zone',
    floor: 4,
    name: 'PlayStation & Entertainment Lounge',
    type: 'gaming',
    agentIds: [],
    center: [-3.2, -0.5],
    size: [6, 7],
    color: '#3b82f6'
  },
  {
    id: 'relax-zone',
    floor: 4,
    name: 'Quiet Rest & Coffee Bar',
    type: 'rest',
    agentIds: [],
    center: [3.2, -0.5],
    size: [6, 7],
    color: '#10b981'
  }
];
