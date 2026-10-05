import { create } from 'zustand';
import { AGENTS } from '../config/agents';
import { FLOOR_NAMES } from '../config/rooms';
import { AgentState, CameraLevel, FloorId, HermesEvent, ViewMode } from '../types';
import { hermes } from '../services/hermes/hermesClient';

const initialAgents = (): Record<string, AgentState> =>
  Object.fromEntries(AGENTS.map((a) => [a.id, {
    id: a.id, name: a.name, department: a.department, floor: a.floor,
    status: 'idle', task: 'Waiting for instructions', activity: 'Idle', progress: 0,
    location: 'desk', animation: 'idle', tool: '-', recent: [], log: []
  } as AgentState]));

interface UIState {
  view: ViewMode; floor: FloorId; cameraLevel: CameraLevel;
  selectedAgentId: string | null; agentMode: boolean;
  agents: Record<string, AgentState>;
  setView: (v: ViewMode) => void;
  setFloor: (f: FloorId) => void;
  setCameraLevel: (l: CameraLevel) => void;
  selectAgent: (id: string | null) => void;
  openAgent: () => void;
  closeAgentMode: () => void;
  applyEvent: (e: HermesEvent) => void;
  sendPrompt: (agentId: string, text: string) => void;
}

export const useStore = create<UIState>((set, get) => ({
  view: 'office', floor: 2, cameraLevel: 'city',
  selectedAgentId: null, agentMode: false, agents: initialAgents(),
  setView: (view) => set((s) => {
    if (view === 'agent') {
      const activeId = s.selectedAgentId || 'bubo-manager';
      const targetAgent = AGENTS.find((a) => a.id === activeId) || AGENTS[0];
      return { view, selectedAgentId: activeId, floor: targetAgent.floor as FloorId, cameraLevel: 'floor' };
    }
    return { view, selectedAgentId: null, agentMode: false };
  }),
  setFloor: (floor) => set({ floor, cameraLevel: 'floor' }),
  setCameraLevel: (cameraLevel) => set({ cameraLevel }),
  selectAgent: (selectedAgentId) => set((s) => {
    if (!selectedAgentId) return { selectedAgentId: null, agentMode: false };
    const targetAgent = AGENTS.find((a) => a.id === selectedAgentId);
    return {
      selectedAgentId,
      agentMode: false,
      floor: targetAgent ? (targetAgent.floor as FloorId) : s.floor
    };
  }),
  openAgent: () => set({ agentMode: true }),
  closeAgentMode: () => set({ agentMode: false }),
  applyEvent: (e) => set((s) => {
    const cur = s.agents[e.agentId];
    if (!cur) return s;
    if (e.type === 'agent_log') {
      return { agents: { ...s.agents, [e.agentId]: { ...cur, log: [...cur.log, e.line].slice(-60), recent: [e.line, ...cur.recent].slice(0, 5) } } };
    }
    return { agents: { ...s.agents, [e.agentId]: { ...cur, ...e.patch } } };
  }),
  sendPrompt: (agentId, text) => {
    get().applyEvent({ type: 'agent_log', agentId, line: `User: ${text}` });
    hermes.sendPrompt(agentId, text);
  }
}));

hermes.connect((e) => useStore.getState().applyEvent(e));

export const floorLabel = (f: number) => `Floor ${f} · ${FLOOR_NAMES[f]}`;
