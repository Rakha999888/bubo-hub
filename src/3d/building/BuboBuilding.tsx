import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AGENTS } from '../../config/agents';
import { FLOOR_NAMES, ROOMS, floorY } from '../../config/rooms';
import { AgentConfig, FloorId } from '../../types';
import { AgentActor, STATUS_COLOR } from '../characters/AgentActor';
import { useStore } from '../../state/store';

const WOOD = '#9a7048', CREAM = '#efe6d2', NAVY = '#1c2b45';

const Box = ({ p, s, c, e = 0 }: { p: [number, number, number]; s: [number, number, number]; c: string; e?: number }) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.7} />
  </mesh>
);

function Plant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.15, z]}>
      <Box p={[0, 0.2, 0]} s={[0.4, 0.4, 0.4]} c="#a8683f" />
      <mesh position={[0, 0.65, 0]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#3f9b5a" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Wall Air Conditioner (AC) with indicator light */
function ACUnit({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      {/* AC Main Body */}
      <Box p={[0, 0, 0]} s={[1.2, 0.35, 0.25]} c="#f8fafc" />
      {/* Air Vent Grille */}
      <Box p={[0, -0.1, 0.1]} s={[1.05, 0.08, 0.04]} c="#94a3b8" />
      {/* Power LED (Cool Cyan Glow) */}
      <Box p={[0.45, 0.05, 0.13]} s={[0.04, 0.04, 0.02]} c="#38bdf8" e={1} />
    </group>
  );
}

/** Standard SMLONE Workstation: Desk, Monitor, Keyboard, and Chair with SitAnchor at (x, 0.15, z + 0.85) */
export function Workstation({ cfg }: { cfg: AgentConfig }) {
  const status = useStore((s) => s.agents[cfg.id]?.status || 'idle');
  const [x, z] = cfg.desk;
  const y0 = 0.15;
  const screen = status === 'offline' || status === 'idle' ? '#10151f' : STATUS_COLOR[status];

  return (
    <group>
      {/* Desk Top */}
      <Box p={[x, y0 + 0.67, z]} s={[2, 0.06, 1.1]} c={WOOD} />
      {/* Desk Legs */}
      <Box p={[x - 0.92, y0 + 0.33, z]} s={[0.06, 0.66, 1]} c="#6f4f31" />
      <Box p={[x + 0.92, y0 + 0.33, z]} s={[0.06, 0.66, 1]} c="#6f4f31" />

      {/* Monitor Frame & Screen */}
      <Box p={[x, y0 + 1.0, z - 0.2]} s={[0.9, 0.52, 0.05]} c="#1a1d25" />
      <Box p={[x, y0 + 1.0, z - 0.17]} s={[0.82, 0.45, 0.02]} c={screen} e={status === 'idle' || status === 'offline' ? 0 : 0.8} />
      {/* Monitor Stand */}
      <Box p={[x, y0 + 0.78, z - 0.2]} s={[0.1, 0.16, 0.1]} c="#1a1d25" />

      {/* Keyboard */}
      <Box p={[x, y0 + 0.71, z + 0.38]} s={[0.55, 0.025, 0.18]} c="#2d323e" />

      {/* Office Chair (Navy Ergonomic Chair centered at z + 0.85) */}
      {/* Seat Cushion at y0 + 0.35 */}
      <Box p={[x, y0 + 0.35, z + 0.85]} s={[0.58, 0.08, 0.52]} c={NAVY} />
      {/* Backrest */}
      <Box p={[x, y0 + 0.78, z + 1.12]} s={[0.56, 0.68, 0.06]} c={NAVY} />
      {/* Chair Central Column & Base */}
      <mesh position={[x, y0 + 0.16, z + 0.85]}>
        <cylinderGeometry args={[0.05, 0.05, 0.32, 8]} />
        <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Base Caster Star */}
      <mesh position={[x, y0 + 0.03, z + 0.85]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 5]} />
        <meshStandardMaterial color="#1a202c" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Stairs({ from }: { from: number }) {
  const y = floorY(from);
  const steps = 8;
  const upper = floorY(from + 1);
  return (
    <group>
      {Array.from({ length: steps }, (_, i) => {
        const h = (i + 1) * 0.5;
        return <Box key={i} p={[8.2, y + 0.15 + h / 2, 3.6 - i * 0.8]} s={[1.4, h, 0.8]} c="#a9a193" />;
      })}
      <Box p={[7.95, upper, -3.2]} s={[1.9, 0.3, 1.6]} c="#a9a193" />
      <Box p={[8.95, upper + 0.65, 0]} s={[0.05, 0.05, 8.4]} c={NAVY} />
    </group>
  );
}

function StandardLounge() {
  const tv = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((s) => {
    if (tv.current) tv.current.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 3) * 0.2;
  });
  return (
    <group>
      <Box p={[3.4, 0.4, 2.2]} s={[2.4, 0.5, 0.9]} c="#c9694a" />
      <Box p={[3.4, 0.85, 2.6]} s={[2.4, 0.5, 0.2]} c="#c9694a" />
      <Box p={[3.4, 0.35, 0.6]} s={[1.2, 0.3, 0.7]} c={WOOD} />
      <mesh position={[3.5, 2.0, -4.85]}>
        <boxGeometry args={[2.4, 1.2, 0.08]} />
        <meshStandardMaterial ref={tv} color="#6aa7ff" emissive="#6aa7ff" emissiveIntensity={0.8} />
      </mesh>
      <Box p={[5.7, 0.7, -4.3]} s={[1.2, 1.1, 0.7]} c="#d9d4c8" />
      <Box p={[5.5, 1.45, -4.3]} s={[0.4, 0.4, 0.4]} c="#2b2b2b" />
      <Box p={[5.8, 0.65, -2.2]} s={[0.8, 0.9, 0.5]} c="#e4a84a" />
      <Plant x={6.2} z={3.6} />
      <Plant x={0.8} z={-4.4} />
      <Box p={[0.9, 0.9, 3]} s={[0.4, 1.4, 1.2]} c={WOOD} />
    </group>
  );
}

function GamingLoungeFloor4() {
  const tvScreen = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((s) => {
    if (tvScreen.current) {
      // Dynamic game screen animation (PlayStation game dynamic glow)
      const t = s.clock.elapsedTime;
      tvScreen.current.emissiveIntensity = 0.85 + Math.sin(t * 4) * 0.25;
    }
  });

  return (
    <group>
      {/* ─── GAMING ZONE (LEFT): HUGE TV, PS5 CONSOLE, SOFA, BEANBAGS ─── */}
      {/* TV Stand / Media Cabinet */}
      <Box p={[-3.2, 0.45, -4.2]} s={[3.2, 0.55, 0.9]} c="#1e293b" />
      {/* Big Screen TV (65 inch Curved Screen) */}
      <Box p={[-3.2, 2.1, -4.3]} s={[3.4, 1.8, 0.1]} c="#0f172a" />
      <mesh position={[-3.2, 2.1, -4.24]}>
        <planeGeometry args={[3.2, 1.6]} />
        <meshStandardMaterial ref={tvScreen} color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.9} />
      </mesh>

      {/* PlayStation 5 Console (White with blue LED) */}
      <Box p={[-4.2, 0.85, -4.1]} s={[0.2, 0.5, 0.35]} c="#f8fafc" />
      <Box p={[-4.2, 0.85, -3.92]} s={[0.04, 0.45, 0.02]} c="#3b82f6" e={1} />
      {/* DualSense Controllers */}
      <Box p={[-3.5, 0.76, -4.0]} s={[0.25, 0.08, 0.15]} c="#e2e8f0" />
      <Box p={[-3.0, 0.76, -4.0]} s={[0.25, 0.08, 0.15]} c="#e2e8f0" />

      {/* Luxury Gaming Sofa */}
      <Box p={[-3.2, 0.4, 0.8]} s={[2.8, 0.5, 1.0]} c="#2563eb" />
      <Box p={[-3.2, 0.9, 1.25]} s={[2.8, 0.6, 0.25]} c="#1d4ed8" />
      {/* Sofa Armrests */}
      <Box p={[-4.5, 0.65, 0.8]} s={[0.25, 0.5, 1.0]} c="#1e40af" />
      <Box p={[-1.9, 0.65, 0.8]} s={[0.25, 0.5, 1.0]} c="#1e40af" />

      {/* Beanbag Chairs */}
      <Box p={[-4.6, 0.35, -1.2]} s={[1.1, 0.5, 1.1]} c="#f59e0b" />
      <Box p={[-1.8, 0.35, -1.2]} s={[1.1, 0.5, 1.1]} c="#ec4899" />
      {/* Coffee Table in front of gaming sofa */}
      <Box p={[-3.2, 0.32, -1.5]} s={[1.8, 0.25, 0.9]} c="#334155" />

      {/* Arcade / Snack Vending Machine */}
      <Box p={[-6.0, 1.3, -2.5]} s={[0.9, 2.2, 1.1]} c="#475569" />
      <Box p={[-6.0, 1.4, -1.94]} s={[0.7, 1.0, 0.04]} c="#38bdf8" e={0.5} />

      {/* ─── QUIET REST & COFFEE BAR (RIGHT) ─── */}
      {/* Bar Counter */}
      <Box p={[3.2, 0.7, -3.8]} s={[4.2, 1.1, 0.9]} c="#78350f" />
      {/* Espresso Coffee Machine */}
      <Box p={[2.2, 1.45, -3.8]} s={[0.6, 0.55, 0.5]} c="#1e293b" />
      <Box p={[2.2, 1.45, -3.53]} s={[0.1, 0.1, 0.05]} c="#f59e0b" e={1} />
      {/* Bar Stools */}
      {[1.8, 2.8, 3.8, 4.6].map((x, i) => (
        <group key={i}>
          <Box p={[x, 0.45, -2.5]} s={[0.4, 0.08, 0.4]} c="#d97706" />
          <Box p={[x, 0.22, -2.5]} s={[0.06, 0.44, 0.06]} c="#1e293b" />
        </group>
      ))}

      {/* Rest Pod / Nap Lounge Bed */}
      <Box p={[4.2, 0.35, 1.5]} s={[2.6, 0.4, 1.4]} c="#059669" />
      <Box p={[5.3, 0.55, 1.5]} s={[0.4, 0.18, 1.2]} c="#ecfdf5" />

      {/* Plants & Decorative Floor Lamps */}
      <Plant x={-6.2} z={3.4} />
      <Plant x={6.2} z={3.4} />
      <Plant x={0.2} z={-4.2} />
      <Box p={[0.2, 1.4, 3.2]} s={[0.4, 2.4, 0.4]} c="#fef08a" e={0.6} />
    </group>
  );
}

function ServerRacks() {
  return (
    <group>
      {[-6.2, -5.2, -4.2].map((x, i) => (
        <group key={i}>
          <Box p={[x, 1.15, -4.3]} s={[0.8, 2, 0.8]} c="#2c3340" />
          {[0, 1, 2, 3].map((k) => (
            <Box key={k} p={[x + 0.25, 0.6 + k * 0.4, -3.88]} s={[0.08, 0.08, 0.04]} c={k % 2 ? '#35e07a' : '#4aa3ff'} e={1} />
          ))}
        </group>
      ))}
      <Box p={[-1.6, 2.1, -4.85]} s={[2.4, 1, 0.06]} c="#12202e" e={0.4} />
    </group>
  );
}

function Floor({
  f,
  onContextMenu
}: {
  f: FloorId;
  onContextMenu?: (e: any, agent: AgentConfig) => void;
}) {
  const y = floorY(f);
  const rooms = ROOMS.filter((r) => r.floor === f);
  const agents = AGENTS.filter((a) => a.floor === f);

  return (
    <group position={[0, y, 0]}>
      {/* Floor Slab */}
      <Box p={[0, 0, 0]} s={[14, 0.3, 10]} c={CREAM} />

      {/* Room Carpets / Floor Zones */}
      {rooms.map((r) => (
        <mesh key={r.id} position={[r.center[0], 0.16, r.center[1]]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={r.size} />
          <meshStandardMaterial color={r.color} opacity={0.4} transparent roughness={0.9} />
        </mesh>
      ))}
      {rooms.map((r) => (
        <Text key={r.id + 't'} position={[r.center[0], 0.18, r.center[1] + r.size[1] / 2 - 0.25]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color="#ffffff" anchorX="center">
          {r.name.toUpperCase()}
        </Text>
      ))}

      {/* Walls & Windows */}
      <Box p={[0, 2, -5]} s={[14, 3.7, 0.2]} c={f === 4 ? '#1e293b' : f === 3 ? '#cdbb9a' : f === 2 ? '#c9d3da' : '#b4bcc6'} />
      <Box p={[-7, 2, 0]} s={[0.2, 3.7, 10]} c={f === 4 ? '#0f172a' : '#a7b0ba'} />
      {[-5, 0, 5].map((x) => (
        <Box key={x} p={[x, 2.2, -4.88]} s={[2, 1.2, 0.04]} c="#9fd3ee" e={0.25} />
      ))}
      <Text position={[0, 3.35, -4.85]} fontSize={0.34} color={NAVY} anchorX="center">
        {`FLOOR ${f} · ${FLOOR_NAMES[f].toUpperCase()}`}
      </Text>

      {/* Workstations AND Character Actors directly in this Floor coordinate frame */}
      {agents.map((a) => (
        <group key={a.id}>
          <Workstation cfg={a} />
          <AgentActor cfg={a} showNameplate={false} onContextMenu={onContextMenu} />
        </group>
      ))}

      {/* Floor Decor & Furniture */}
      {f === 1 && (
        <>
          <StandardLounge />
          <ServerRacks />
        </>
      )}
      {f === 2 && (
        <>
          <StandardLounge />
          <Plant x={-6.3} z={3.8} />
          <Plant x={6.2} z={4} />
        </>
      )}
      {f === 3 && (
        <>
          <Box p={[0, 0.6, 2.4]} s={[3, 0.08, 1.2]} c={WOOD} />
          <Box p={[0, 0.3, 2.4]} s={[0.2, 0.6, 0.2]} c="#6f4f31" />
          {[-1.2, 1.2].map((x) => (
            <Box key={x} p={[x, 0.35, 3.3]} s={[0.5, 0.1, 0.5]} c={NAVY} />
          ))}
          <Plant x={-6.2} z={3.6} />
        </>
      )}
      {f === 4 && (
        <>
          <GamingLoungeFloor4 />
        </>
      )}

      {/* Wall Air Conditioners (AC) installed in every room / zone with active cyan LED */}
      <ACUnit x={-3.5} y={3.1} z={-4.85} />
      <ACUnit x={3.5} y={3.1} z={-4.85} />
      <ACUnit x={-6.85} y={3.1} z={0} />
    </group>
  );
}

export function BuboBuilding({
  onContextMenu
}: {
  onContextMenu?: (e: any, agent: AgentConfig) => void;
}) {
  const view = useStore((s) => s.view);
  const floor = useStore((s) => s.floor);
  const floors = ([1, 2, 3, 4] as FloorId[]).filter((f) => view === 'office' || f <= floor);

  return (
    <group>
      {floors.map((f) => (
        <Floor key={f} f={f} onContextMenu={onContextMenu} />
      ))}
      {floors.filter((f) => f < 4 && floors.includes((f + 1) as FloorId)).map((f) => (
        <Stairs key={f} from={f} />
      ))}
    </group>
  );
}
