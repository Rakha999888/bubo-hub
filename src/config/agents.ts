import { AgentConfig } from '../types';
import { BUBO_CHARACTERS } from '../data/characters/characters.config';

export const AGENTS: AgentConfig[] = BUBO_CHARACTERS;

export const BREAK_SPOT: Record<number, [number, number]> = { 1: [8.5, -2.8] };

/** Dedicated Sofa Seat Anchors: characters approach, align with seat, sit down naturally */
export const SOFA_SEATS: Record<number, Array<{ id: string; pos: [number, number, number]; rotY: number }>> = {
  1: [
    { id: 'f1-s1', pos: [14.0, 0.15, 2.0], rotY: Math.PI },
    { id: 'f1-s2', pos: [15.2, 0.15, 2.0], rotY: Math.PI }
  ]
};

/** Office Waypoints for Autonomous Walking */
export const OFFICE_WAYPOINTS: Record<number, Array<{ name: string; pos: [number, number, number] }>> = {
  1: [
    { name: 'executive_hall', pos: [-10.5, 0.15, 1.5] },
    { name: 'central_hall', pos: [0.0, 0.15, 1.5] },
    { name: 'pantry_entry', pos: [8.5, 0.15, -1.0] },
    { name: 'game_room_entry', pos: [13.5, 0.15, 1.0] }
  ]
};
