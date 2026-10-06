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
  'bubo-manager': { emoji: '👑', channel: '#💬・general-chat', division: 'Management' },
  'bubo-building': { emoji: '🏗', channel: '#🏗・bubo-building', division: 'Software Engineering' },
  'bubo-portal': { emoji: '🌐', channel: '#🌐・bubo-portal', division: 'Frontend Engineering' },
  'bubo-admin-portal': { emoji: '🎨', channel: '#🛡・bubo-admin-portal', division: 'UI/UX Design' },
  'bubo-backend-portal': { emoji: '💻', channel: '#💻・bubo-backend-portal', division: 'Backend Development' },
  'bubo-qc-portal': { emoji: '🔍', channel: '#🔍・bubo-qc-portal', division: 'QA Automation' },
  'bubo-source-video': { emoji: '🎬', channel: '#🎬・bubo-source-video', division: 'Video Production' },
  'bubo-ticketing': { emoji: '🎫', channel: '#🎫・bubo-ticketing', division: 'Ticketing & Support' }
};

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * AgentActor:
 * Seated on their workstation chair in office.
 * Above head: 3D badge showing full Bubo name, exact Discord channel, and division with real-time status.
 */
export function AgentActor({ cfg, showNameplate = true }: { cfg: AgentConfig; showNameplate?: boolean }) {
  const allAgents = useStore((s) => s.agents);
  const st = allAgents[cfg.id] || { status: 'idle', task: '', activity: '' };
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

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const s = latest.current;
    const p = pose.current;
    const t = state.clock.elapsedTime;

    // Custom Dynamic Motor Behavior: Rakha (Manager Walkaround & Inspection)
    let dynamicTarget = anchors.sit;
    let shouldWalk = false;

    if (cfg.id === 'bubo-manager') {
      // 60-second routine: 0-25s seated desk, 25-35s walk to office inspection point 1, 35-45s walk to observation window, 45-60s return
      const cycle = t % 60;
      if (cycle >= 25 && cycle < 38) {
        dynamicTarget = new THREE.Vector3(-1.8, 0.15, 0.6); // walking to office observation zone
        shouldWalk = true;
      } else if (cycle >= 38 && cycle < 50) {
        dynamicTarget = new THREE.Vector3(1.2, 0.15, 1.8); // observing lounge / meeting entrance
        shouldWalk = true;
      } else {
        dynamicTarget = anchors.sit;
        shouldWalk = false;
      }
    } else if (cfg.id === 'bubo-building') {
      // Custom Dynamic Motor Behavior: Koko (Senior Software Engineer Mentoring & PR review)
      // Check if Budi (FE) or Samsul (BE) has error, or periodic walkaround mentoring
      const budiErr = allAgents['bubo-portal']?.status === 'error';
      const samsulErr = allAgents['bubo-backend-portal']?.status === 'error';

      if (budiErr) {
        dynamicTarget = new THREE.Vector3(-1.5, 0.15, -1.6); // beside Budi desk
        shouldWalk = true;
      } else if (samsulErr) {
        dynamicTarget = new THREE.Vector3(1.5, 0.15, -1.6); // beside Samsul desk
        shouldWalk = true;
      } else {
        // Periodic 75s senior checkup
        const cycle = t % 75;
        if (cycle >= 40 && cycle < 55) {
          dynamicTarget = new THREE.Vector3(1.0, 0.15, -1.5); // checking server & architecture
          shouldWalk = true;
        } else {
          dynamicTarget = anchors.sit;
          shouldWalk = false;
        }
      }
    } else {
      const wantSit = s.status !== 'break';
      dynamicTarget = wantSit ? anchors.sit : anchors.brk;
      shouldWalk = !wantSit;
    }

    const to = dynamicTarget.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

    const atSeat = dynamicTarget === anchors.sit && dist < 0.2;
    p.sit = THREE.MathUtils.damp(p.sit, atSeat ? 1 : 0, 5, dt);

    const canMove = p.sit < 0.3;
    p.walking = dist > 0.12 && canMove;

    if (p.walking) {
      const speed = cfg.id === 'bubo-manager' ? 1.4 : 1.6;
      g.position.addScaledVector(to.normalize(), Math.min(dist, speed * dt));
    }

    // Role-specific typing & activities
    if (cfg.id === 'bubo-manager') {
      p.typing = atSeat && s.status === 'working';
    } else if (cfg.id === 'bubo-building') {
      // Koko slow deliberate typing
      p.typing = atSeat && (s.status === 'working' || s.status === 'thinking');
    } else {
      p.typing = atSeat && (s.status === 'working' || s.status === 'thinking');
    }

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
