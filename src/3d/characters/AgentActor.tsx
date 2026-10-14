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

// Clean Discord Channel mapping (no emojis)
const DISCORD_META: Record<string, { channel: string; division: string }> = {
  'bubo-manager': { channel: '#general-chat', division: 'Coordinator' },
  'bubo-n8n': { channel: '#bubo-n8n', division: 'n8n Automation' },
  'bubo-portal': { channel: '#bubo-portal', division: 'Frontend Portal' },
  'bubo-backend-portal': { channel: '#bubo-backend-portal', division: 'Backend Portal' },
  'bubo-admin-portal': { channel: '#bubo-admin-portal', division: 'Admin Portal' },
  'bubo-source-video': { channel: '#bubo-source-video', division: 'Source Video' },
  'bubo-pdf': { channel: '#bubo-pdf', division: 'PDF Processing' },
  'bubo-qc-portal': { channel: '#bubo-qc-portal', division: 'QC Portal' },
  'bubo-ticketing': { channel: '#bubo-ticketing', division: 'Ticketing Helpdesk' },
  'bubo-building': { channel: '#bubo-building', division: 'Building & Infra' }
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
    channel: cfg.department || '#general',
    division: cfg.workspace || 'General'
  };

  // Exact anchor matching Workstation chair at (x, 0.15, z + 0.85)
  const anchors = useMemo(() => ({
    sit: new THREE.Vector3(cfg.desk[0], 0.15, cfg.desk[1] + 0.85),
    stand: new THREE.Vector3(cfg.desk[0] + 1.2, 0.15, cfg.desk[1] + 0.85),
    brk: new THREE.Vector3(BREAK_SPOT[cfg.floor]?.[0] || 0, 0.15, BREAK_SPOT[cfg.floor]?.[1] || 0)
  }), [cfg]);

  // Initial mount: start directly seated at their own workstation chair
  useEffect(() => {
    if (root.current) {
      root.current.position.set(cfg.desk[0], 0.15, cfg.desk[1] + 0.85);
      root.current.rotation.y = Math.PI;
    }
    pose.current.sit = 1;
    yaw.current = Math.PI;
  }, [cfg, anchors]);

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

    // ─── AUTONOMOUS FREE ROAMING & OFFICE LIFE CYCLE ───
    // Agen bebas bergerak keliling kantor (pantry, meeting room, lounge, sofa, koridor)
    // dan kembali sesekali ke meja kerja. Jika Hermes sedang mengerjakan prompt / task,
    // agen langsung berjalan kembali ke meja dan fokus mengetik.
    const hasActivePromptOrTask = !!s.task && s.task.trim().length > 0;
    const isHermesBusy = (s.status === 'working' || s.status === 'thinking' || s.status === 'error') && hasActivePromptOrTask;

    // Siklus bebas roaming per agen (offset berbeda agar tidak serentak)
    const cycle = (t * 0.15 + charOffset) % 100;

    // 60% waktu bebas roaming keliling berbagai spot kantor, 40% waktu duduk santai di meja
    const isFreeRoaming = !isHermesBusy && cycle < 65;

    let dynamicTarget = anchors.sit;
    let isSofa = false;

    if (isFreeRoaming) {
      // Pilihan spot roaming santai dan eksplorasi di seantero kantor:
      // executive meeting table, sofa lounge, coffee bar, pantry, central hall, gaming pods
      const roamWaypoints: Array<{ pos: [number, number, number]; isSofa?: boolean }> = [
        { pos: [-13.5, 0.15, 3.2], isSofa: true },  // Executive sofa lounge
        { pos: [-10.5, 0.15, 2.5] },                // Executive round meeting table
        { pos: [-4.0, 0.15, 2.2] },                 // Left central corridor
        { pos: [0.0, 0.15, 2.4] },                  // Center corridor & discussion zone
        { pos: [4.0, 0.15, 2.2] },                  // Right central corridor
        { pos: [7.5, 0.15, -3.5] },                 // Coffee bar & kitchen counter
        { pos: [9.0, 0.15, -1.5] },                 // Standing cafe round table
        { pos: [14.0, 0.15, 2.2], isSofa: true },  // Game room beanbags
        { pos: [15.2, 0.15, 2.0], isSofa: true },  // Game room sofa
        { pos: [15.0, 0.15, -3.8] },                // Rest & sleeping pods
      ];

      // Tentukan waypoint dinamis berdasarkan siklus waktu
      const spotIndex = Math.floor((cycle + charOffset) % roamWaypoints.length);
      const chosenSpot = roamWaypoints[spotIndex];
      dynamicTarget = new THREE.Vector3(chosenSpot.pos[0], chosenSpot.pos[1], chosenSpot.pos[2]);
      isSofa = !!chosenSpot.isSofa;
    } else {
      // Kembali duduk di meja kerja sendiri
      dynamicTarget = anchors.sit;
      isSofa = false;
    }

    const to = dynamicTarget.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

    // Duduk jika sudah sampai di kursi meja kerja atau sofa
    const isSeatedAtDesk = dist < 0.35 && dynamicTarget === anchors.sit;
    const isSeatedAtSofa = dist < 0.35 && isSofa;
    const shouldSit = isSeatedAtDesk || isSeatedAtSofa;

    // Animasi duduk / berdiri yang mulus
    p.sit = THREE.MathUtils.damp(p.sit, shouldSit ? 1 : 0, 5.0, dt);

    // Boleh berjalan jika tidak sedang duduk diam
    const canMove = p.sit < 0.4;
    p.walking = dist > 0.15 && canMove;

    if (p.walking) {
      const speed = isHermesBusy ? 1.8 : 1.35; // Jalan lebih cepat saat dipanggil bekerja
      g.position.addScaledVector(to.normalize(), Math.min(dist, speed * dt));
    }

    // Role-specific gesture / posture
    if (isSeatedAtDesk) {
      // Saat di meja: mengetik dengan tangan ke depan di atas keyboard
      p.typing = isHermesBusy || (Math.sin(t * 1.5 + charOffset) > -0.1);
      p.mood = isHermesBusy ? 'focused' : 'normal';
    } else if (isSeatedAtSofa) {
      p.typing = false;
      p.mood = 'happy';
    } else {
      p.typing = false;
      p.mood = 'normal';
    }

    // Arah hadap: jika berjalan hadap arah jalan, jika duduk di meja hadap monitor (-Z)
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
