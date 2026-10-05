import { RoomConfig } from '../types';

export const FLOOR_NAMES: Record<number, string> = { 1: 'Infrastructure Hub', 2: 'Technology & Operations Hub', 3: 'Head Office' };
export const FLOOR_HEIGHT = 4;
export const floorY = (f: number) => (f - 1) * FLOOR_HEIGHT;

export const ROOMS: RoomConfig[] = [
  { id: 'manager-office', floor: 3, name: 'Manager Office', type: 'executive', agentIds: ['bubo-manager'], center: [-3, -1.5], size: [5.4, 5], color: '#8b6b4a' },
  { id: 'admin-office', floor: 3, name: 'Admin Office', type: 'admin', agentIds: ['bubo-admin-portal'], center: [3, -1.5], size: [5.4, 5], color: '#4a6b7c' },
  { id: 'automation-lab', floor: 2, name: 'Automation Lab', type: 'automation', agentIds: ['bubo-n8n'], center: [-4.2, -2.6], size: [3.8, 2.8], color: '#3f6f73' },
  { id: 'frontend-studio', floor: 2, name: 'Frontend Studio', type: 'frontend', agentIds: ['bubo-portal'], center: [0, -2.6], size: [3.8, 2.8], color: '#4c6a8a' },
  { id: 'backend-room', floor: 2, name: 'Backend Room', type: 'backend', agentIds: ['bubo-backend-portal'], center: [4.2, -2.6], size: [3.8, 2.8], color: '#4f5f7a' },
  { id: 'helpdesk', floor: 2, name: 'Helpdesk', type: 'support', agentIds: ['bubo-ticketing'], center: [-4.2, 0.8], size: [3.8, 2.8], color: '#6b6a4a' },
  { id: 'video-studio', floor: 2, name: 'Video Studio', type: 'video', agentIds: ['bubo-source-video'], center: [0, 0.8], size: [3.8, 2.8], color: '#7a5a5a' },
  { id: 'doc-room', floor: 2, name: 'Document Room', type: 'documents', agentIds: ['bubo-pdf'], center: [4.2, 0.8], size: [3.8, 2.8], color: '#5a7a68' },
  { id: 'infra-room', floor: 1, name: 'Infrastructure Room', type: 'infra', agentIds: ['bubo-building'], center: [-3.5, -2], size: [6, 5], color: '#3d4a5c' },
  { id: 'bubo-lounge', floor: 1, name: 'Bubo Lounge & Coffee Corner', type: 'lounge', agentIds: [], center: [3.5, 0], size: [6, 8], color: '#a47a52' }
];
