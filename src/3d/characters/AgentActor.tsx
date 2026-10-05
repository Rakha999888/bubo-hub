import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AgentConfig, AgentStatus } from '../../types';
import { BREAK_SPOT } from '../../config/agents';
import { BuboCharacter, Pose } from './BuboCharacter';
import { useStore } from '../../state/store';

const SIT_STATES: AgentStatus[] = ['working', 'thinking', 'sitting', 'waiting', 'error', 'success'];
export const STATUS_COLOR: Record<AgentStatus, string> = {
  idle: '#8aa0b8', working: '#3b9dff', thinking: '#a78bfa', walking: '#8aa0b8', sitting: '#3b9dff', waiting: '#f5b942',
  error: '#ef4444', success: '#34d399', meeting: '#f5b942', break: '#f59e0b', offline: '#556070'
};
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** State-driven actor: walks to its anchor, then sits (Walk -> Sit -> Type), stands + walks away otherwise. */
export function AgentActor({ cfg }: { cfg: AgentConfig }) {
  const st = useStore((s) => s.agents[cfg.id]);
  const selected = useStore((s) => s.selectedAgentId === cfg.id);
  const selectAgent = useStore((s) => s.selectAgent);
  const root = useRef<THREE.Group>(null);
  const pose = useRef<Pose>({ sit: 0, walking: false, typing: false, mood: 'normal' });
  const yaw = useRef(0);
  const latest = useRef(st); latest.current = st;

  const anchors = useMemo(() => ({
    sit: new THREE.Vector3(cfg.desk[0], 0.15, cfg.desk[1] + 0.9),      // SitAnchor
    stand: new THREE.Vector3(cfg.desk[0] + 1.3, 0.15, cfg.desk[1] + 1.0),
    brk: new THREE.Vector3(BREAK_SPOT[cfg.floor][0], 0.15, BREAK_SPOT[cfg.floor][1])
  }), [cfg]);

  useEffect(() => { root.current?.position.copy(anchors.stand); }, [anchors]);

  useFrame((_, dt) => {
    const g = root.current; if (!g) return;
    const s = latest.current; const p = pose.current;
    let target = anchors.stand; let wantSit = false;
    if (s.status === 'break') target = anchors.brk;
    else if (s.status === 'walking') target = s.location === 'lounge' ? anchors.brk : anchors.sit;
    else if (SIT_STATES.includes(s.status)) { target = anchors.sit; wantSit = true; }

    const to = target.clone().sub(g.position); to.y = 0; const dist = to.length();
    const canMove = p.sit < 0.2;                                         // must stand up before walking
    p.walking = canMove && dist > 0.06;
    if (p.walking) { g.position.addScaledVector(to.normalize(), Math.min(dist, 1.8 * dt)); }

    const atSeat = wantSit && dist < 0.12;
    p.sit = THREE.MathUtils.damp(p.sit, atSeat ? 1 : 0, 5, dt);
    p.typing = s.status === 'working' && p.sit > 0.9;
    p.mood = s.status === 'error' ? 'error' : s.status === 'success' ? 'success' : s.status === 'thinking' ? 'think' : 'normal';

    const goalYaw = p.walking ? Math.atan2(to.x, to.z) : (atSeat || p.sit > 0.5) ? Math.PI : 0; // face desk when seated
    yaw.current += wrap(goalYaw - yaw.current) * Math.min(1, 8 * dt);
    g.rotation.y = yaw.current;
  });

  const color = STATUS_COLOR[st.status];
  return (
    <group ref={root} onClick={(e) => { e.stopPropagation(); selectAgent(cfg.id); }}>
      <BuboCharacter pose={pose} accessory={cfg.accessory} manager={cfg.manager} dim={st.status === 'offline'} />
      {selected && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><ringGeometry args={[0.55, 0.65, 32]} /><meshBasicMaterial color="#3b9dff" /></mesh>}
      <Html position={[0, 2.35, 0]} center distanceFactor={9} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div className="agent-label">
          <b>{st.name}</b>
          <span style={{ color }}>● {st.status.toUpperCase()}</span>
          {st.status === 'working' && <i>{st.activity}</i>}
        </div>
      </Html>
    </group>
  );
}
