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
 * 1. Saat Standby: 10 Agen bergerak bebas keliling kantor (koridor, sofa, pantry, lounge, ruang rapat).
 * 2. Saat Ada Prompt Masuk (Discord / UI): Agen terkait BARU BERGERAK ke laptop meja kerjanya, monitor menyala, duduk & mengetik.
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
  const pose = useRef<Pose>({ sit: 0, walking: false, typing: false, mood: 'normal' });
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

  // Initial mount: mulai dari posisi meja masing-masing
  useEffect(() => {
    if (root.current) {
      root.current.position.set(cfg.desk[0], 0.15, cfg.desk[1] + 0.85);
      root.current.rotation.y = Math.PI;
    }
    yaw.current = Math.PI;
  }, [cfg, anchors]);

  // Personality hash untuk desinkronisasi alami jadwal bergerak bebas
  const charOffset = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < cfg.id.length; i++) hash = (hash * 31 + cfg.id.charCodeAt(i)) % 1000;
    return (hash / 1000) * 50; // 0..50s offset
  }, [cfg.id]);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const s = latest.current;
    const p = pose.current;
    const t = state.clock.elapsedTime;

    // ─── STATUS PROMPT / KERJA ───
    const isWorkingOnPrompt = s.status === 'working' || s.status === 'thinking';

    const agentIdx = BUBO_CHARACTERS.findIndex((c) => c.id === cfg.id);

    // Titik-titik tujuan bergerak bebas di seluruh penjuru kantor
    const roamWaypoints: Array<{ pos: [number, number, number]; isSofa?: boolean }> = [
      { pos: [-13.5, 0.15, 3.2], isSofa: true },  // Executive sofa lounge
      { pos: [-10.5, 0.15, 1.8] },                // Executive round meeting table
      { pos: [-7.0, 0.15, 2.2] },                 // Koridor barat meeting
      { pos: [-3.5, 0.15, 2.4] },                 // Koridor dev kiri
      { pos: [0.0, 0.15, 2.2] },                  // Koridor utama tengah
      { pos: [3.5, 0.15, 0.8], isSofa: true },    // Sofa santai lounge tengah
      { pos: [6.0, 0.15, -2.6] },                 // Coffee bar & pantry kulkas
      { pos: [8.0, 0.15, -1.8] },                 // Meja santai cafe
      { pos: [10.5, 0.15, 2.2] },                 // Koridor timur entertainment
      { pos: [12.5, 0.15, 1.8], isSofa: true },  // Game room sofa biru
      { pos: [14.2, 0.15, 2.4], isSofa: true },  // Beanbags santai TV
      { pos: [14.5, 0.15, -3.2] },                // Sleeping pods & quiet room
    ];

    let dynamicTarget: THREE.Vector3;
    let isSofa = false;

    if (isWorkingOnPrompt) {
      // ─── SAAT ADA PROMPT MASUK: BERGERAK MENUJU LAPTOP MEJA KERJA, DUDUK & MENGETIK ───
      dynamicTarget = anchors.sit;
      isSofa = false;
    } else {
      // ─── SAAT STANDBY: 10 AGEN BERGERAK BEBAS KELILING KANTOR ───
      const roamCycle = Math.floor((t * 0.08 + charOffset) / 8);
      const spotIndex = (roamCycle + agentIdx * 2) % roamWaypoints.length;
      const chosenSpot = roamWaypoints[spotIndex];

      const offsetX = ((agentIdx % 3) - 1) * 0.35;
      const offsetZ = (agentIdx % 2 === 0 ? 0.3 : -0.3);

      dynamicTarget = new THREE.Vector3(
        chosenSpot.pos[0] + (chosenSpot.isSofa ? 0 : offsetX),
        chosenSpot.pos[1],
        chosenSpot.pos[2] + (chosenSpot.isSofa ? 0 : offsetZ)
      );
      isSofa = !!chosenSpot.isSofa;
    }

    const to = dynamicTarget.clone().sub(g.position);
    to.y = 0;
    const dist = to.length();

    // Duduk jika tiba di kursi workstation (saat diprompt) atau tiba di sofa lounge
    const isAtRest = dist < 0.45 && ((isWorkingOnPrompt && dynamicTarget === anchors.sit) || isSofa);
    p.sit = THREE.MathUtils.damp(p.sit, isAtRest ? 1 : 0, 5.0, dt);
    p.walking = dist > 0.25;

    if (p.walking) {
      // Jalan lincah ke laptop jika diprompt (2.4), jalan santai saat roaming (1.4)
      const speed = isWorkingOnPrompt ? 2.4 : 1.4;
      g.position.addScaledVector(to.normalize(), Math.min(dist, speed * dt));
    }

    // Mengetik HANYA jika sedang diprompt dan sudah tiba di laptop meja kerja!
    if (isWorkingOnPrompt && dist < 0.45) {
      p.typing = true;
      p.mood = 'focused';
    } else {
      // Saat bebas bergerak santai (standby): dilarang mengetik!
      p.typing = false;
      p.mood = isAtRest && isSofa ? 'happy' : 'normal';
    }

    // Rotasi: saat jalan menghadap arah tujuan, saat di laptop menghadap monitor (Math.PI)
    const goalYaw = p.walking
      ? Math.atan2(to.x, to.z)
      : (isWorkingOnPrompt ? Math.PI : (isSofa ? Math.PI : yaw.current));
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