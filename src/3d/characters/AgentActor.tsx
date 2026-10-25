import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AgentConfig, AgentStatus } from '../../types';
import { BREAK_SPOT, SOFA_SEATS, OFFICE_WAYPOINTS } from '../../config/agents';
import { BUBO_CHARACTERS } from '../../data/characters/characters.config';
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

// Clean Discord Channel mapping
const DISCORD_META: Record<string, { channel: string; division: string }> = {
  'bubo-manager': { channel: '#💬・general-chat', division: 'Coordinator' },
  'bubo-admin-portal': { channel: '#🛡・bubo-admin-portal', division: 'Admin Portal' },
  'bubo-n8n': { channel: '#⚡・bubo-n8n', division: 'n8n Automation' },
  'bubo-portal': { channel: '#🌐・bubo-portal', division: 'Frontend Portal' },
  'bubo-backend-portal': { channel: '#💻・bubo-backend-portal', division: 'Backend DB' },
  'bubo-ptm': { channel: '#📊・bubo-ptm', division: 'Monitoring PTM' },
  'bubo-qc-portal': { channel: '#🔍・bubo-qc-portal', division: 'QC Portal' },
  'bubo-ticketing': { channel: '#🎫・bubo-ticketing', division: 'Ticketing Jira' },
  'bubo-building': { channel: '#🏗・bubo-building', division: 'Building & Infra' },
  'bubo-sheet': { channel: '#bubo-sheet', division: 'Sheets Automation' }
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

    // ─── BEKERJA HANYA JIKA ADA PROMPT / TASK AKTIF ───
    // Aturan Mutlak:
    // 1. Saat Standby (tidak ada prompt DC): 10 agen duduk tenang di meja masing-masing (monitor mati, tidak roaming liar).
    // 2. Saat Ada Prompt dari DC / UI masuk: Agen yang bersangkutan BARU BERGERAK & BEBAS BERGERAK (ngetik laptop nyala, keliling lorong/pantry/lounge dinamis).
    const isWorkingOnPrompt = s.status === 'working' || s.status === 'thinking';

    if (!isWorkingOnPrompt) {
      // ─── SAAT STANDBY (TIDAK ADA PROMPT DARI DC): TERTIB DUDUK DI KURSI MEJA ───
      g.position.copy(anchors.sit);
      p.sit = 1;
      p.walking = false;
      p.typing = false;
      p.mood = 'normal';
      yaw.current = Math.PI;
      g.rotation.y = Math.PI; // Menghadap ke monitor laptop
      return;
    }

    // ─── SAAT ADA PROMPT DARI DC / UI (isWorkingOnPrompt = true): BEBAS BERGERAK ───
    const agentIdx = BUBO_CHARACTERS.findIndex((c) => c.id === cfg.id);
    const workCycle = (t * 0.16 + charOffset) % 36; // Siklus kerja dinamis 36 detik

    const roamWaypoints: Array<{ pos: [number, number, number]; isSofa?: boolean }> = [
      { pos: [-13.5, 0.15, 3.2], isSofa: true },  // Executive sofa lounge
      { pos: [-10.5, 0.15, 1.8] },                // Executive round meeting table
      { pos: [-4.0, 0.15, 2.2] },                 // Koridor kiri
      { pos: [0.0, 0.15, 2.4] },                  // Koridor utama tengah
      { pos: [3.5, 0.15, 0.8] },                  // Sofa santai lounge tengah
      { pos: [5.5, 0.15, -3.0] },                 // Coffee bar & pantry kulkas
      { pos: [7.5, 0.15, -2.5] },                 // Meja santai cafe
      { pos: [12.5, 0.15, 1.8], isSofa: true },  // Game room sofa biru
      { pos: [14.0, 0.15, 2.2], isSofa: true },  // Beanbags santai TV
      { pos: [14.5, 0.15, -3.5] },                // Sleeping pods & quiet room
    ];

    let dynamicTarget = anchors.sit;
    let isSofa = false;

    if (workCycle < 18) {
      // Fase 1: Mengetik aktif di meja kerja laptop menyala
      dynamicTarget = anchors.sit;
      isSofa = false;
    } else {
      // Fase 2: Bergerak bebas keliling kantor (inspeksi, diskusi, ambil kopi, koordinasi tim)
      const spotIndex = (Math.floor(workCycle * 0.25) + agentIdx) % roamWaypoints.length;
      const chosenSpot = roamWaypoints[spotIndex];
      dynamicTarget = new THREE.Vector3(chosenSpot.pos[0], chosenSpot.pos[1], chosenSpot.pos[2]);
      isSofa = !!chosenSpot.isSofa;
    }

    const to = dynamicTarget.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

    // Duduk jika sudah tiba di kursi workstation atau sofa
    const isAtRest = dist < 0.45 && (dynamicTarget === anchors.sit || isSofa);
    p.sit = THREE.MathUtils.damp(p.sit, isAtRest ? 1 : 0, 5.0, dt);
    p.walking = dist > 0.25;

    if (p.walking) {
      const speed = 2.2; // Lincah bergerak saat diperintah bekerja
      g.position.addScaledVector(to.normalize(), Math.min(dist, speed * dt));
    }

    // Mengetik hanya saat di kursi workstation meja sendiri
    if (dist < 0.45 && dynamicTarget === anchors.sit) {
      p.typing = true;
      p.mood = 'focused';
    } else {
      p.typing = false;
      p.mood = isAtRest && isSofa ? 'happy' : 'normal';
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