import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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

  // Character personality hash for desynchronized staggered autonomous schedule
  const charOffset = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < cfg.id.length; i++) hash = (hash * 31 + cfg.id.charCodeAt(i)) % 1000;
    return (hash / 1000) * 45; // 0..45s offset
  }, [cfg.id]);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const s = latest.current;
    const p = pose.current;
    const t = state.clock.elapsedTime;

    // Priority 1: ONLY work at laptop when there is a real prompt / task or Hermes is busy working!
    // If no active prompt or task, character remains FREE to roam / relax / not type!
    const hasActivePromptOrTask = !!s.task && s.task.trim().length > 0;
    const isHermesBusy = (s.status === 'working' || s.status === 'thinking' || s.status === 'error') && hasActivePromptOrTask;

    let dynamicTarget = anchors.sit;
    let isSofa = false;

    if (isHermesBusy) {
      // Must return immediately to workstation and work!
      dynamicTarget = anchors.sit;
      isSofa = false;
    } else if (cfg.id === 'bubo-manager') {
      // Rakha Manager: Floor 3 Manager Office & Observation Lounge
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
    } else if (cfg.id === 'bubo-admin-portal') {
      // Pina UI/UX: Floor 3 Admin Office & Design Lounge
      const cycle = (t + charOffset) % 70;
      if (cycle >= 25 && cycle < 45) {
        dynamicTarget = new THREE.Vector3(1.2, 0.15, 3.2); // sofa seat Floor 3 (max 1 person)
        isSofa = true;
      } else if (cycle >= 45 && cycle < 58) {
        dynamicTarget = new THREE.Vector3(-1.5, 0.15, 1.5); // standing balcony
      } else {
        dynamicTarget = anchors.sit;
      }
    } else if (cfg.id === 'bubo-building') {
      // Koko Senior Engineer Checkup & Coffee: 80s cycle (Floor 1 & mentoring)
      const budiErr = allAgents['bubo-portal']?.status === 'error';
      const samsulErr = allAgents['bubo-backend-portal']?.status === 'error';

      if (budiErr) {
        dynamicTarget = new THREE.Vector3(-1.5, 0.15, -1.6); // beside Budi
      } else if (samsulErr) {
        dynamicTarget = new THREE.Vector3(1.5, 0.15, -1.6); // beside Samsul
      } else {
        const cycle = (t + charOffset) % 80;
        if (cycle >= 25 && cycle < 45) {
          // Relax on Floor 1 sofa seat 1
          dynamicTarget = new THREE.Vector3(3.1, 0.15, 2.2);
          isSofa = true;
        } else if (cycle >= 45 && cycle < 60) {
          dynamicTarget = new THREE.Vector3(-3.5, 0.15, -2.5); // checking server rack
        } else {
          dynamicTarget = anchors.sit;
        }
      }
    } else {
      // Floor 2 Roaming: Unique separate destinations across entire office
      // Destinations:
      // - 1 agent on sofa seat (max 1 person from this pool, total sofa <= 2)
      // - Coffee maker / pantry [5.5, 0.15, -3.8]
      // - Vending machine / snack bar [5.8, 0.15, -1.8]
      // - Water cooler & plant corridor [-6.0, 0.15, 3.2]
      // - Window viewing balcony [4.8, 0.15, 3.2]
      // - Central communication aisle [0.0, 0.15, 0.2]
      // - Whiteboard / ideation zone [-4.2, 0.15, -0.8]
      // - Tech discussion nook [2.0, 0.15, -1.8]

      const destOptions: Record<string, { pos: [number, number, number]; isSofa?: boolean }> = {
        'bubo-portal': { pos: [2.2, 0.15, -1.8] }, // Budi: tech discussion nook near center
        'bubo-backend-portal': { pos: [5.5, 0.15, -3.6] }, // Samsul: coffee maker / pantry
        'bubo-qc-portal': { pos: [5.8, 0.15, -1.8] }, // Juki: snack area / checking wall
        'bubo-source-video': { pos: [3.7, 0.15, 2.2], isSofa: true }, // Alpin: sofa seat 2 (relaxed on phone/music)
        'bubo-ticketing': { pos: [-5.8, 0.15, 3.2] } // Roki: window & plant corridor
      };

      const myDest = destOptions[cfg.id] || { pos: [0.0, 0.15, 0.5] };

      const cycle = (t + charOffset) % 75;
      if (s.status === 'break' || (cycle >= 30 && cycle < 55)) {
        // Roam to unique assigned personal destination — NOT clustering!
        dynamicTarget = new THREE.Vector3(myDest.pos[0], myDest.pos[1], myDest.pos[2]);
        isSofa = !!myDest.isSofa;
      } else if (cycle >= 55 && cycle < 64) {
        // Short stretch in hallway midway to desk
        const midX = (cfg.desk[0] + myDest.pos[0]) * 0.5;
        dynamicTarget = new THREE.Vector3(midX, 0.15, 0.2);
        isSofa = false;
      } else {
        // Working / seated at own desk
        dynamicTarget = anchors.sit;
        isSofa = false;
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

      {/* Permanent floating 3D nameplates REMOVED completely in Phase 9 for living office simulation */}
    </group>
  );
}
