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

const DISCORD_META: Record<string, { emoji: string; channel: string; division: string }> = {
  'bubo-manager': { emoji: '💬', channel: '#💬・general-chat', division: 'General Coordinator' },
  'bubo-n8n': { emoji: '⚡', channel: '#⚡・bubo-n8n', division: 'n8n Automation' },
  'bubo-portal': { emoji: '🌐', channel: '#🌐・bubo-portal', division: 'Portal FE' },
  'bubo-backend-portal': { emoji: '💻', channel: '#💻・bubo-backend-portal', division: 'Backend & DB' },
  'bubo-admin-portal': { emoji: '🛡', channel: '#🛡・bubo-admin-portal', division: 'Admin System' },
  'bubo-source-video': { emoji: '🎬', channel: '#🎬・bubo-source-video', division: 'Video Production' },
  'bubo-pdf': { emoji: '📄', channel: '#📄・bubo-pdf', division: 'PDF Processing' },
  'bubo-qc-portal': { emoji: '🔍', channel: '#🔍・bubo-qc-portal', division: 'QC & Troubleshooting' },
  'bubo-ticketing': { emoji: '🎫', channel: '#🎫・bubo-ticketing', division: 'Ticketing & Jira' },
  'bubo-building': { emoji: '🏗', channel: '#🏗・bubo-building', division: 'System Architecture & Build' }
};

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * AgentActor:
 * Seated on their workstation chair in office.
 * Above head: 3D badge showing full Bubo name, exact Discord channel, and division with real-time status.
 */
export function AgentActor({ cfg, showNameplate = true }: { cfg: AgentConfig; showNameplate?: boolean }) {
  const st = useStore((s) => s.agents[cfg.id] || { status: 'idle', task: '', activity: '' });
  const selected = useStore((s) => s.selectedAgentId === cfg.id);
  const selectAgent = useStore((s) => s.selectAgent);
  const root = useRef<THREE.Group>(null);
  const pose = useRef<Pose>({ sit: 1, walking: false, typing: false, mood: 'normal' });
  const yaw = useRef(Math.PI);
  const latest = useRef(st);
  latest.current = st;

  const meta = DISCORD_META[cfg.id] || {
    emoji: '🤖',
    channel: cfg.department || '#general',
    division: cfg.role || 'Division'
  };

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

    const wantSit = s.status !== 'break';
    const target = wantSit ? anchors.sit : anchors.brk;

    const to = target.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

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

      {/* Real-time Discord 3D Nameplate */}
      {showNameplate && (
        <Html position={[0, 2.38, 0]} center distanceFactor={10} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: isManager ? 'rgba(15, 23, 42, 0.96)' : 'rgba(15, 23, 42, 0.94)',
              border: isManager ? '1.5px solid #e0b341' : selected ? '1.5px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.35)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65), 0 2px 6px rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              padding: '5px 10px',
              textAlign: 'center',
              minWidth: '170px',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
              userSelect: 'none',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            {/* Top Row: Emoji + Official Name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px' }}>{meta.emoji}</span>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                {cfg.displayName}
              </span>
            </div>

            {/* Middle Row: Exact Discord Channel Tag & Division */}
            <div style={{ fontSize: '9.5px', color: '#94a3b8', margin: '2px 0 4px 0', fontWeight: 600 }}>
              <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{meta.channel}</span> · {meta.division}
            </div>

            {/* Bottom Row: Real-time Live Status Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '9px',
                fontWeight: 700,
                color: statusColor,
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '2px 8px',
                borderRadius: '999px',
                border: `1px solid ${statusColor}44`
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
              <span>{st.status === 'idle' ? 'STANDBY' : st.status.toUpperCase()}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
