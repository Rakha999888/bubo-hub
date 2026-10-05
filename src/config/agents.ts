import { AgentConfig } from '../types';

// ONE data-driven list. UI + 3D render everything from here.
export const AGENTS: AgentConfig[] = [
  // Floor 3 - Head Office
  { id: 'bubo-manager', name: 'Bubo Manager', department: 'Management', role: 'AI Company Manager', floor: 3, room: 'manager-office', website: null, accessory: 'manager-tie', desk: [-3, -2.8], manager: true },
  { id: 'bubo-admin-portal', name: 'Bubo Admin Portal', department: 'Admin System', role: 'Admin Engineer', floor: 3, room: 'admin-office', website: 'admin.smlone.com', accessory: 'admin-badge', desk: [3, -2.8] },
  // Floor 2 - Technology & Operations Hub
  { id: 'bubo-n8n', name: 'Bubo n8n', department: 'Automation', role: 'Automation Engineer', floor: 2, room: 'automation-lab', website: null, accessory: 'workflow-board', desk: [-4.2, -3.2] },
  { id: 'bubo-portal', name: 'Bubo Portal', department: 'Frontend', role: 'Frontend / UI-UX Engineer', floor: 2, room: 'frontend-studio', website: 'portal.smlone.com', accessory: 'ui-pen', desk: [0, -3.2] },
  { id: 'bubo-backend-portal', name: 'Bubo Backend', department: 'Backend', role: 'Backend Engineer (Express + Neon)', floor: 2, room: 'backend-room', website: 'api.smlone.cloud', accessory: 'db-cylinder', desk: [4.2, -3.2] },
  { id: 'bubo-ticketing', name: 'Bubo Ticketing', department: 'Support', role: 'Jira / Helpdesk Agent', floor: 2, room: 'helpdesk', website: null, accessory: 'ticket', desk: [-4.2, 0.2] },
  { id: 'bubo-source-video', name: 'Bubo Video', department: 'Video Production', role: 'Video Script & Production', floor: 2, room: 'video-studio', website: null, accessory: 'camera', desk: [0, 0.2] },
  { id: 'bubo-pdf', name: 'Bubo PDF', department: 'Documents', role: 'PDF Processing Agent', floor: 2, room: 'doc-room', website: null, accessory: 'pdf-doc', desk: [4.2, 0.2] },
  // Floor 1 - Infrastructure Hub
  { id: 'bubo-building', name: 'Bubo Building', department: 'Infrastructure', role: 'Infra / Build / Deploy Engineer', floor: 1, room: 'infra-room', website: null, accessory: 'server-rack', desk: [-4, -2.8] }
];

export const BREAK_SPOT: Record<number, [number, number]> = { 1: [4.6, -2.2], 2: [6, 3], 3: [6, 3] };
