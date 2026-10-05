import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AgentConfig, AgentStatus } from '../../types';
import { BREAK_SPOT } from '../../config/agents';
import { BuboCharacter, Pose } from './BuboCharacter';
import { useStore } from '../../state/store';

export const STATUS_COLOR: Record<AgentStatus, string> = {
  idle: '#38bdf8',
  working: '#10b981',
  thinking: '#a855f7',
  walking: '#38bdf8',
  sitting: '#38bdf8',
  waiting: '#f59e0b',
  error: '#ef4444',
  success: '#10b981',
  meeting: '#f59e0b',
  break: '#f97316',
  offline: '#64748b'
};

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * AgentActor:
 * By default in office, seated properly on their designated office chair facing their workstation desk.
 * When working/thinking, types on keyboard with monitor glow.
 * Only leaves chair when explicitly sent to break or walking.
 */
export function AgentActor({ cfg }: { cfg: AgentConfig }) {
  const st = useStore((s) => s.agents[cfg.id] || { status: 'idle', task: '', activity: '' });
  const selected = useStore((s) => s.selectedAgentId === cfg.id);
  const selectAgent = useStore((s) => s.selectAgent);
  const root = useRef<THREE.Group>(null);
  const pose = useRef<Pose>({ sit: 1, walking: false, typing: false, mood: 'normal' });
  const yaw = useRef(Math.PI);
  const latest = useRef(st);
  latest.current = st;

  // Exact anchor matching Workstation chair at (x, 0.15, z + 0.85)
  const anchors = useMemo(() => ({
    sit: new THREE.Vector3(cfg.desk[0], 0.15, cfg.desk[1] + 0.85),
    stand: new THREE.Vector3(cfg.desk[0] + 1.2, 0.15, cfg.desk[1] + 0.85),
    brk: new THREE.Vector3(BREAK_SPOT[cfg.floor]?.[0] || 0, 0.15, BREAK_SPOT[cfg.floor]?.[1] || 0)
  }), [cfg]);

  // Initial mount: start directly seated on office chair facing desk
  useEffect(() => {
    if (root.current) {
      root.current.position.copy(anchors.sit);
      root.current.rotation.y = Math.PI;
    }
    pose.current.sit = 1;
    yaw.current = Math.PI;
  }, [anchors]);

  useFrame((_, dt) => {
    const g = root.current;
    if (!g) return;
    const s = latest.current;
    const p = pose.current;

    // Normal office state = seated on their chair
    const wantSit = s.status !== 'break';
    const target = wantSit ? anchors.sit : anchors.brk;

    const to = target.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

    // Stand up if moving away to break
    const canMove = p.sit < 0.2;
    p.walking = !wantSit && dist > 0.08 && canMove;

    if (p.walking) {
      g.position.addScaledVector(to.normalize(), Math.min(dist, 1.8 * dt));
    }

    const atSeat = wantSit && dist < 0.15;
    p.sit = THREE.MathUtils.damp(p.sit, atSeat ? 1 : 0, 6, dt);
    p.typing = (s.status === 'working' || s.status === 'thinking') && p.sit > 0.8;

    let mood: Pose['mood'] = 'normal';
    if (s.status === 'error') mood = 'error';
    else if (s.status === 'success') mood = 'success';
    else if (s.status === 'thinking') mood = 'think';
    else if (s.status === 'working') mood = 'focused';
    else if (s.status === 'break') mood = 'happy';
    p.mood = mood;

    // Face desk (Math.PI) when seated, face movement direction when walking
    const goalYaw = p.walking ? Math.atan2(to.x, to.z) : Math.PI;
    yaw.current += wrap(goalYaw - yaw.current) * Math.min(1, 8 * dt);
    g.rotation.y = yaw.current;
  });

  const statusColor = STATUS_COLOR[st.status] || '#38bdf8';
  const isManager = cfg.manager;

  return (
    <group ref={root} onClick={(e) => { e.stopPropagation(); selectAgent(cfg.id); }}>
      <BuboCharacter
        pose={pose}
        accessory={cfg.accessory}
        avatar={cfg.avatar}
        manager={cfg.manager}
        dim={st.status === 'offline'}
      />

      {/* Selection Glow Indicator */}
      {selected && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.7, 32]} />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.54, 32]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.25} transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Professional SMLONE 3D Nameplate */}
      <Html position={[0, 2.35, 0]} center distanceFactor={10} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: isManager ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))' : 'rgba(15, 23, 42, 0.92)',
            border: isManager ? '1.5px solid #e0b341' : '1px solid rgba(148, 163, 184, 0.25)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4)',
            borderRadius: '10px',
            padding: '6px 12px',
            textAlign: 'center',
            minWidth: '150px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
            userSelect: 'none'
          }}
        >
          <div style={{ fontSize: '0.95em', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.01em' }}>
            {cfg.displayName}
          </div>
          <div style={{ fontSize: '0.72em', color: '#94a3b8', margin: '2px 0 4px 0', fontWeight: 500 }}>
            {cfg.role}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68em',
              fontWeight: 700,
              color: statusColor,
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '2px 8px',
              borderRadius: '999px',
              border: `1px solid ${statusColor}44`
            }}
          >
            <span style={{ fontSize: '1.2em', lineHeight: 0.5 }}>●</span>
            <span>{st.status === 'idle' ? 'SEATED • STANDBY' : st.status.toUpperCase()}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
