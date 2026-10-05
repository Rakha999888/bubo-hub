import { AgentConfig } from '../types';
import { BUBO_CHARACTERS } from '../data/characters/characters.config';

export const AGENTS: AgentConfig[] = BUBO_CHARACTERS;

export const BREAK_SPOT: Record<number, [number, number]> = { 1: [4.6, -2.2], 2: [6, 3], 3: [6, 3] };
