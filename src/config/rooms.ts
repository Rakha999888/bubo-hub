import { RoomConfig } from '../types';

export const FLOOR_NAMES: Record<number, string> = {
  1: 'SMLONE Digital Headquarters'
};

export const FLOOR_HEIGHT = 4;
export const floorY = (f: number) => 0;

export const ROOMS: RoomConfig[] = [
  // ─── 1. EXECUTIVE & COMMAND WING (LEFT WING) ──────────────────────
  {
    id: 'executive-wing',
    floor: 1,
    name: 'Executive & Strategic Suite',
    type: 'executive',
    agentIds: ['bubo-manager', 'bubo-admin-portal'],
    center: [-10.5, -0.5],
    size: [8.5, 9.0],
    color: '#8b6b4a'
  },

  // ─── 2. CENTRAL OPEN DEVELOPER & OPERATIONS HUB (CENTER) ──────────
  {
    id: 'central-dev-hub',
    floor: 1,
    name: 'Central Engineering & Production Hub',
    type: 'frontend',
    agentIds: [
      'bubo-portal',
      'bubo-backend-portal',
      'bubo-qc-portal',
      'bubo-source-video',
      'bubo-ticketing',
      'bubo-building',
      'bubo-n8n'
    ],
    center: [0.0, -0.5],
    size: [11.5, 9.0],
    color: '#1e293b'
  },

  // ─── 3. PANTRY & KITCHENETTE (RIGHT TOP) ──────────────────────────
  {
    id: 'pantry-kitchenette',
    floor: 1,
    name: 'Pantry & Coffee Lounge',
    type: 'rest',
    agentIds: [],
    center: [8.5, -2.8],
    size: [5.2, 4.4],
    color: '#d97706'
  },

  // ─── 4. GAMING, ENTERTAINMENT & SLEEP REST ZONE (RIGHT BOTTOM) ────
  {
    id: 'entertainment-rest-wing',
    floor: 1,
    name: 'Gaming & Sleeping Rest Zone',
    type: 'gaming',
    agentIds: [],
    center: [14.0, -0.5],
    size: [6.5, 9.0],
    color: '#3b82f6'
  }
];
