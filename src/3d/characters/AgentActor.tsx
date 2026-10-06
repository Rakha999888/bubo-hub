import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AgentConfig, AgentStatus } from '../../types';
import { BREAK_SPOT, SOFA_SEATS, OFFICE_WAYPOINTS } from '../../config/agents';
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
export function AgentActor({
  cfg,
  showNameplate = false,
  onContextMenu
}: {
  cfg: AgentConfig;
  showNameplate?: boolean;
  onContextMenu?: (e: any, agent: AgentConfig) => void;
}) {
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

    // Priority 1: Real active Hermes task (working / thinking) overrides everything
    const isHermesBusy = s.status === 'working' || s.status === 'thinking' || s.status === 'error';

    // Character personality hash for desynchronized staggered autonomous schedule
    const charOffset = useMemo(() => {
      let hash = 0;
      for (let i = 0; i < cfg.id.length; i++) hash = (hash * 31 + cfg.id.charCodeAt(i)) % 1000;
      return (hash / 1000) * 45; // 0..45s offset
    }, [cfg.id]);

    let dynamicTarget = anchors.sit;
    let isSofa = false;

    if (isHermesBusy) {
      // Must return immediately to workstation and work!
      dynamicTarget = anchors.sit;
      isSofa = false;
    } else if (cfg.id === 'bubo-manager') {
      // Rakha Manager Walkaround: 70s cycle
      const cycle = (t + charOffset) % 70;
      if (cycle >= 20 && cycle < 35) {
        dynamicTarget = new THREE.Vector3(-1.8, 0.15, 0.6); // inspect floor corridor
      } else if (cycle >= 35 && cycle < 48) {
        dynamicTarget = new THREE.Vector3(1.2, 0.15, 1.8); // look at lounge / meeting area
      } else if (cycle >= 48 && cycle < 58) {
        dynamicTarget = new THREE.Vector3(3.2, 0.15, 2.2); // standing near lounge observing
      } else {
        dynamicTarget = anchors.sit;
      }
    } else if (cfg.id === 'bubo-building') {
      // Koko Senior Engineer Checkup & Sofa Coffee: 80s cycle
      const budiErr = allAgents['bubo-portal']?.status === 'error';
      const samsulErr = allAgents['bubo-backend-portal']?.status === 'error';

      if (budiErr) {
        dynamicTarget = new THREE.Vector3(-1.5, 0.15, -1.6); // beside Budi
      } else if (samsulErr) {
        dynamicTarget = new THREE.Vector3(1.5, 0.15, -1.6); // beside Samsul
      } else {
        const cycle = (t + charOffset) % 80;
        if (cycle >= 25 && cycle < 45) {
          // Relax on sofa seat 1
          dynamicTarget = new THREE.Vector3(2.8, 0.15, 2.2);
          isSofa = true;
        } else if (cycle >= 45 && cycle < 60) {
          dynamicTarget = new THREE.Vector3(0, 0.15, 0); // walking hallway
        } else {
          dynamicTarget = anchors.sit;
        }
      }
    } else {
      // Other 6 agents: Autonomous Idle / Sofa / Lounge Walk system
      // Cycle: 65s period
      const cycle = (t + charOffset) % 65;
      const sofaSeats = SOFA_SEATS[cfg.floor] || SOFA_SEATS[2];
      const assignedSeat = sofaSeats[charOffset % sofaSeats.length] || sofaSeats[0];

      if (s.status === 'break' || cycle >= 32 && cycle < 54) {
        // Break period: head to sofa and relax!
        dynamicTarget = new THREE.Vector3(assignedSeat.pos[0], assignedSeat.pos[1], assignedSeat.pos[2]);
        isSofa = true;
      } else if (cycle >= 54 && cycle < 60) {
        // Stretch / water break near hallway
        dynamicTarget = new THREE.Vector3(cfg.desk[0] > 0 ? 1.0 : -1.0, 0.15, 0.2);
      } else {
        // Standard idle at desk
        dynamicTarget = anchors.sit;
      }
    }

    const to = dynamicTarget.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

    // Natural sitting transition: seated at workstation OR on sofa
    const isAtRest = dist < 0.25 && (dynamicTarget === anchors.sit || isSofa);
    p.sit = THREE.MathUtils.damp(p.sit, isAtRest ? 1 : 0, 4.5, dt);

    const canMove = p.sit < 0.35;
    p.walking = dist > 0.15 && canMove;

    if (p.walking) {
      const speed = cfg.id === 'bubo-manager' ? 1.35 : 1.5;
      g.position.addScaledVector(to.normalize(), Math.min(dist, speed * dt));
    }

    // Role-specific typing / relaxing
    if (isSofa && isAtRest) {
      p.typing = false;
      // Relaxed behavior on sofa
      if (cfg.id === 'bubo-portal' || cfg.id === 'bubo-ticketing') {
        p.mood = 'happy'; // relaxing on phone
      } else if (cfg.id === 'bubo-admin-portal') {
        p.mood = 'think'; // sketching on tablet
      } else {
        p.mood = 'normal';
      }
    } else if (dynamicTarget === anchors.sit && isAtRest) {
      p.typing = isHermesBusy;
      p.mood = isHermesBusy ? 'focused' : 'normal';
    } else {
      p.typing = false;
      p.mood = 'normal';
    }

    const goalYaw = p.walking ? Math.atan2(to.x, to.z) : Math.PI;
    yaw.current += wrap(goalYaw - yaw.current) * Math.min(1, 8 * dt);
    g.rotation.y = yaw.current;
  });

  const statusColor = STATUS_COLOR[st.status] || '#38bdf8';
  const isManager = cfg.manager;

  return (
    <group
      ref={root}
      onClick={(e) => {
        e.stopPropagation();
        selectAgent(cfg.id);
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        if (onContextMenu) {
          onContextMenu(e, cfg);
        } else {
          // Default context action: select and allow user inspect
          selectAgent(cfg.id);
        }
      }}
    >
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
