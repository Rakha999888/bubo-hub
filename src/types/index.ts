export type AgentStatus =
  | 'idle' | 'working' | 'thinking' | 'walking' | 'sitting' | 'waiting'
  | 'error' | 'success' | 'meeting' | 'break' | 'offline';

export type AnimationName =
  | 'idle' | 'walk' | 'sit' | 'stand' | 'type' | 'think' | 'talk' | 'drink'
  | 'walk-stairs' | 'meeting' | 'success' | 'error' | 'break' | 'offline';

export type AccessoryId =
  | 'workflow-board' | 'ui-pen' | 'db-cylinder' | 'ticket' | 'camera'
  | 'pdf-doc' | 'server-rack' | 'admin-badge' | 'manager-tie';

export type FloorId = 1 | 2 | 3;
export type ViewMode = 'office' | 'agent';
export type CameraLevel = 'city' | 'building' | 'floor';

export interface AgentConfig {
  id: string; name: string; department: string; role: string;
  floor: FloorId; room: string; website: string | null;
  accessory: AccessoryId;
  desk: [number, number];          // x,z on the floor (desk center)
  manager?: boolean;
}

export interface RoomConfig {
  id: string; floor: FloorId; name: string; type: string;
  agentIds: string[]; center: [number, number]; size: [number, number]; color: string;
}

/** Normalized state coming from Hermes AgentOS. */
export interface AgentState {
  id: string; name: string; department: string; floor: FloorId;
  status: AgentStatus; task: string; activity: string; progress: number;
  location: 'desk' | 'lounge' | 'stairs'; animation: AnimationName;
  tool: string; recent: string[]; log: string[];
}

export type HermesEvent =
  | { type: 'agent_state'; agentId: string; patch: Partial<AgentState> }
  | { type: 'agent_log'; agentId: string; line: string };
