import { AgentConfig } from '../types';
import { BUBO_CHARACTERS } from '../data/characters/characters.config';

export const AGENTS: AgentConfig[] = BUBO_CHARACTERS;

export const BREAK_SPOT: Record<number, [number, number]> = { 1: [3.4, 2.2], 2: [3.4, 2.2], 3: [1.2, 2.4] };

/** Dedicated Sofa Seat Anchors: characters approach, align with seat, sit down naturally */
export const SOFA_SEATS: Record<number, Array<{ id: string; pos: [number, number, number]; rotY: number }>> = {
  1: [
    { id: 'f1-s1', pos: [3.1, 0.15, 2.2], rotY: Math.PI },
    { id: 'f1-s2', pos: [3.7, 0.15, 2.2], rotY: Math.PI }
  ],
  2: [
    { id: 'f2-s1', pos: [3.1, 0.15, 2.2], rotY: Math.PI },
    { id: 'f2-s2', pos: [3.7, 0.15, 2.2], rotY: Math.PI }
  ],
  3: [
    { id: 'f3-s1', pos: [0.9, 0.15, 3.3], rotY: Math.PI },
    { id: 'f3-s2', pos: [1.5, 0.15, 3.3], rotY: Math.PI }
  ],
  4: [
    { id: 'f4-s1', pos: [-3.6, 0.15, 0.8], rotY: Math.PI },
    { id: 'f4-s2', pos: [-2.8, 0.15, 0.8], rotY: Math.PI }
  ]
};

/** Office Waypoints for Autonomous Walking */
export const OFFICE_WAYPOINTS: Record<number, Array<{ name: string; pos: [number, number, number] }>> = {
  1: [
    { name: 'hallway', pos: [0, 0.15, 0] },
    { name: 'server_front', pos: [-3.5, 0.15, -2.8] },
    { name: 'lounge_entry', pos: [2.0, 0.15, 1.2] },
    { name: 'window_view', pos: [5.5, 0.15, -2.0] }
  ],
  2: [
    { name: 'hallway_center', pos: [0, 0.15, 0] },
    { name: 'lounge_coffee', pos: [3.4, 0.15, 1.0] },
    { name: 'water_cooler', pos: [-2.5, 0.15, 0.5] },
    { name: 'window_balcony', pos: [5.2, 0.15, 3.0] }
  ],
  3: [
    { name: 'executive_hall', pos: [0, 0.15, 0] },
    { name: 'meeting_table', pos: [0, 0.15, 2.4] },
    { name: 'terrace', pos: [4.5, 0.15, 1.5] }
  ]
};
