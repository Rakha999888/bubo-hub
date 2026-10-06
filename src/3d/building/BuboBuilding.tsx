import { useRef, useState, useEffect } from 'react';
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

/** Framed Official Portrait Component */
function FramedPhoto({
  position,
  url,
  label
}: {
  position: [number, number, number];
  url: string;
  label?: string;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => console.error('Failed to load framed photo texture', url, err)
    );
  }, [url]);

  return (
    <group position={position}>
      {/* Outer Golden/Wood Frame */}
      <Box p={[0, 0, 0]} s={[1.24, 1.54, 0.06]} c="#854d0e" />
      {/* Inner Black Mat Border */}
      <Box p={[0, 0, 0.02]} s={[1.14, 1.44, 0.04]} c="#0f172a" />

      {/* Picture Canvas Plane */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.06, 1.36]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#334155" />
        )}
      </mesh>

      {/* Subtle label plate if specified */}
      {label && (
        <group position={[0, -0.84, 0.04]}>
          <Box p={[0, 0, 0]} s={[1.0, 0.16, 0.02]} c="#ca8a04" />
          <Text position={[0, 0, 0.02]} fontSize={0.08} color="#000000" anchorX="center" anchorY="middle">
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}

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

      {/* ─── QUIET REST, SLEEPING PODS & BEDS (RIGHT) ─── */}
      {/* Sleeping Bunk Pod 1 (Bed Frame, Mattress, Duvet, Pillow, Privacy Partition) */}
      <group position={[2.4, 0, 1.6]}>
        <Box p={[0, 0.25, 0]} s={[2.2, 0.35, 1.3]} c="#334155" />       {/* Wood Base */}
        <Box p={[0, 0.48, 0]} s={[2.1, 0.15, 1.2]} c="#f1f5f9" />       {/* Soft White Mattress */}
        <Box p={[-0.3, 0.54, 0]} s={[1.3, 0.08, 1.18]} c="#0ea5e9" />    {/* Sky Blue Duvet / Blanket */}
        <Box p={[0.7, 0.58, 0]} s={[0.45, 0.12, 0.9]} c="#ffffff" />     {/* Fluffy Pillow */}
        <Box p={[1.05, 0.65, 0]} s={[0.1, 0.9, 1.3]} c="#1e293b" />      {/* Headboard */}
        <Box p={[0, 0.65, -0.65]} s={[2.2, 0.9, 0.1]} c="#475569" />     {/* Privacy Wall Partition */}
      </group>

      {/* Sleeping Bunk Pod 2 (Second comfortable bed) */}
      <group position={[5.2, 0, 1.6]}>
        <Box p={[0, 0.25, 0]} s={[2.2, 0.35, 1.3]} c="#334155" />       {/* Wood Base */}
        <Box p={[0, 0.48, 0]} s={[2.1, 0.15, 1.2]} c="#f1f5f9" />       {/* Soft White Mattress */}
        <Box p={[-0.3, 0.54, 0]} s={[1.3, 0.08, 1.18]} c="#6366f1" />    {/* Indigo Duvet / Blanket */}
        <Box p={[0.7, 0.58, 0]} s={[0.45, 0.12, 0.9]} c="#ffffff" />     {/* Fluffy Pillow */}
        <Box p={[1.05, 0.65, 0]} s={[0.1, 0.9, 1.3]} c="#1e293b" />      {/* Headboard */}
        <Box p={[0, 0.65, -0.65]} s={[2.2, 0.9, 0.1]} c="#475569" />     {/* Privacy Wall Partition */}
      </group>

      {/* Nightstand & Warm Sleep Lamp */}
      <Box p={[3.8, 0.35, 2.1]} s={[0.5, 0.55, 0.5]} c="#1e293b" />
      <Box p={[3.8, 0.72, 2.1]} s={[0.2, 0.2, 0.2]} c="#fef08a" e={0.8} />

      {/* Coffee Bar Counter */}
      <Box p={[3.5, 0.7, -3.8]} s={[4.2, 1.1, 0.9]} c="#78350f" />
      {/* Espresso Coffee Machine */}
      <Box p={[2.2, 1.45, -3.8]} s={[0.6, 0.55, 0.5]} c="#1e293b" />
      <Box p={[2.2, 1.45, -3.53]} s={[0.1, 0.1, 0.05]} c="#f59e0b" e={1} />
      {/* Bar Stools */}
      {[2.2, 3.2, 4.2].map((x, i) => (
        <group key={i}>
          <Box p={[x, 0.45, -2.5]} s={[0.4, 0.08, 0.4]} c="#d97706" />
          <Box p={[x, 0.22, -2.5]} s={[0.06, 0.44, 0.06]} c="#1e293b" />
        </group>
      ))}

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

export function BuboBuilding({
  onContextMenu
}: {
  onContextMenu?: (e: any, agent: AgentConfig) => void;
}) {
  const agents = AGENTS;

  return (
    <group position={[0, 0, 0]}>
      {/* ─── 1. EXPANSIVE SINGLE-LEVEL FLOOR SLAB (Width 36m, Depth 13m) ─── */}
      {/* Main diagonal/warm oak parquet plank floor */}
      <Box p={[0, 0, 0]} s={[36, 0.35, 13]} c="#e2d4be" />

      {/* Perimeter Exterior Walls (Background & Left/Right) */}
      {/* Back Wall with solid enclosing structure */}
      <Box p={[0, 2.5, -6.6]} s={[38, 5.0, 0.5]} c="#0f172a" />
      {/* Left Wall (Executive Wing) */}
      <Box p={[-18.5, 2.5, 0]} s={[0.5, 5.0, 14]} c="#1e293b" />
      {/* Executive Wall Art Poster (Large Vertical) */}
      <group position={[-18.2, 2.4, 0]}>
        <Box p={[0, 0, 0]} s={[0.04, 2.2, 1.6]} c="#0f172a" />
        <Box p={[0.02, 0, 0]} s={[0.02, 2.0, 1.4]} c="#334155" />
        <Box p={[0.035, 0.3, 0]} s={[0.01, 0.8, 0.9]} c="#f59e0b" />
        <Box p={[0.035, -0.4, 0]} s={[0.01, 0.12, 1.0]} c="#f8fafc" />
      </group>

      {/* Right Wall (Entertainment & Rest Wing) */}
      <Box p={[18.5, 2.5, 0]} s={[0.5, 5.0, 14]} c="#1e293b" />
      {/* Game Room Creative Canvas Poster */}
      <group position={[18.2, 2.4, 1.2]}>
        <Box p={[0, 0, 0]} s={[0.04, 2.2, 1.6]} c="#0f172a" />
        <Box p={[-0.02, 0, 0]} s={[0.02, 2.0, 1.4]} c="#020617" />
        <Box p={[-0.035, 0.3, 0]} s={[0.01, 0.8, 0.9]} c="#38bdf8" />
        <Box p={[-0.035, -0.4, 0]} s={[0.01, 0.12, 1.0]} c="#a855f7" />
      </group>
      {/* Front Low Border Baseboard (So scene never exposes raw floor clip) */}
      <Box p={[0, 0.4, 6.6]} s={[38, 0.8, 0.5]} c="#1e293b" />

      {/* Exterior Panoramic Window Panes along the Back Wall */}
      {[-14, -10, -5, 0, 5, 10, 14].map((x) => (
        <group key={x}>
          <Box p={[x, 2.4, -6.32]} s={[3.2, 1.8, 0.06]} c="#93c5fd" e={0.35} />
          <Box p={[x, 2.4, -6.34]} s={[0.08, 1.8, 0.08]} c="#334155" />
          <Box p={[x, 2.4, -6.34]} s={[3.2, 0.08, 0.08]} c="#334155" />
        </group>
      ))}

      {/* ─── 2. ZONE CARPETS & FLOOR MARKINGS ─── */}
      {/* Executive Wing Carpet (Warm Burgundy / Rich Dark Slate) */}
      <mesh position={[-11.5, 0.18, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 10]} />
        <meshStandardMaterial color="#334155" opacity={0.35} transparent roughness={0.9} />
      </mesh>
      {/* Central Engineering Open Floor Carpet (Tech Slate Blue) */}
      <mesh position={[0.0, 0.18, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11.5, 10]} />
        <meshStandardMaterial color="#1e293b" opacity={0.3} transparent roughness={0.9} />
      </mesh>
      {/* Pantry Tile Area (Terracotta Warm Wood) */}
      <mesh position={[8.5, 0.18, -3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.2, 5.0]} />
        <meshStandardMaterial color="#78350f" opacity={0.25} transparent roughness={0.8} />
      </mesh>
      {/* Entertainment & Gaming Red Rug (Like Game Dev Tycoon reference!) */}
      <mesh position={[14.2, 0.18, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 5.5]} />
        <meshStandardMaterial color="#991b1b" opacity={0.65} transparent roughness={0.85} />
      </mesh>

      {/* ─── 3. INTERIOR LOW PARTITIONS & GLASS DIVIDERS ─── */}
      {/* Executive Wing Divider (with door opening at z = 1.5) */}
      <Box p={[-6.2, 1.2, -3.2]} s={[0.2, 2.2, 6.2]} c="#334155" />
      <Box p={[-6.2, 1.2, 4.2]} s={[0.2, 2.2, 4.2]} c="#334155" />

      {/* Game Room / Rest Wing Divider */}
      <Box p={[11.2, 1.2, -3.2]} s={[0.2, 2.2, 6.2]} c="#334155" />
      <Box p={[11.2, 1.2, 4.2]} s={[0.2, 2.2, 4.2]} c="#334155" />

      {/* ─── 4. LEFT WING: EXECUTIVE SUITE & MEETING AREA ─── */}
      {/* Executive Bookshelf run along the left wall */}
      <group position={[-17.6, 0, 0]}>
        <Box p={[0, 1.4, 0]} s={[0.6, 2.6, 6.0]} c="#1e293b" />
        {/* Books & Folders */}
        {[-2.2, -1.0, 0.2, 1.4, 2.2].map((z, i) => (
          <group key={z}>
            <Box p={[0.2, 0.7 + (i % 3) * 0.7, z]} s={[0.3, 0.5, 0.8]} c={i % 2 ? '#3b82f6' : '#f59e0b'} />
          </group>
        ))}
      </group>
      {/* Executive Round Meeting Table with 3 Chairs */}
      <group position={[-12.0, 0, 2.8]}>
        <Box p={[0, 0.7, 0]} s={[2.2, 0.08, 2.2]} c="#78350f" />
        <Box p={[0, 0.35, 0]} s={[0.3, 0.65, 0.3]} c="#0f172a" />
        {/* Chairs around meeting table */}
        <Box p={[-1.3, 0.45, 0]} s={[0.45, 0.08, 0.45]} c="#1e293b" />
        <Box p={[1.3, 0.45, 0]} s={[0.45, 0.08, 0.45]} c="#1e293b" />
        <Box p={[0, 0.45, 1.3]} s={[0.45, 0.08, 0.45]} c="#1e293b" />
      </group>

      {/* ─── 5. CENTER: OFFICIAL PORTRAITS & CORPORATE POSTERS ─── */}
      {/* Official State Portraits: President Prabowo Subianto (Left) & Vice President Gibran Rakabuming Raka (Right) */}
      <group position={[0, 2.35, -6.32]}>
        {/* Indonesian State Emblem / Garuda Pancasila with Golden Wings & Shield */}
        <group position={[0, 0.45, 0]}>
          <Box p={[0, 0, 0]} s={[0.85, 0.85, 0.04]} c="#ca8a04" e={0.2} />
          {/* Wings */}
          <Box p={[-0.32, 0.12, 0.02]} s={[0.45, 0.35, 0.02]} c="#eab308" e={0.25} />
          <Box p={[0.32, 0.12, 0.02]} s={[0.45, 0.35, 0.02]} c="#eab308" e={0.25} />
          {/* Center Shield Pancasila */}
          <Box p={[0, -0.05, 0.03]} s={[0.32, 0.36, 0.02]} c="#b91c1c" />
          <Box p={[0, -0.05, 0.04]} s={[0.18, 0.2, 0.02]} c="#ffffff" />
          {/* Bhinneka Tunggal Ika Ribbon scroll */}
          <Box p={[0, -0.28, 0.02]} s={[0.62, 0.1, 0.02]} c="#fef08a" />
        </group>

        {/* Official Portrait: Presiden Republik Indonesia Prabowo Subianto */}
        <FramedPhoto
          position={[-1.7, 0, 0]}
          url="./presiden_prabowo.jpg"
          label="Presiden RI"
        />

        {/* Official Portrait: Wakil Presiden Republik Indonesia Gibran Rakabuming Raka */}
        <FramedPhoto
          position={[1.7, 0, 0]}
          url="./wapres_gibran.jpg"
          label="Wakil Presiden RI"
        />

        {/* Wall Clock above center emblem */}
        <group position={[0, 1.25, 0]}>
          <Box p={[0, 0, 0]} s={[0.7, 0.7, 0.04]} c="#0f172a" />
          <Box p={[0, 0, 0.02]} s={[0.62, 0.62, 0.02]} c="#ffffff" />
          <Box p={[0, 0.08, 0.03]} s={[0.04, 0.2, 0.01]} c="#0f172a" />
          <Box p={[0.08, 0, 0.03]} s={[0.2, 0.04, 0.01]} c="#ef4444" />
        </group>
      </group>

      {/* ─── WALL DECORATIONS ACROSS ENTIRE OFFICE ─── */}
      {/* 1. Wood Wall Sconces / Warm LED Up-Down Accent Wall Lights */}
      {[-16.5, -12, -7.5, -4.5, 4.5, 7.5, 12, 16.5].map((lx) => (
        <group key={'sconce-' + lx} position={[lx, 3.2, -6.32]}>
          <Box p={[0, 0, 0]} s={[0.2, 0.35, 0.06]} c="#334155" />
          <Box p={[0, 0.12, 0.04]} s={[0.14, 0.06, 0.04]} c="#fef08a" e={1} />
          <Box p={[0, -0.12, 0.04]} s={[0.14, 0.06, 0.04]} c="#fef08a" e={1} />
        </group>
      ))}

      {/* 2. Office Information & Notice Bulletin Board (Pantry area) */}
      <group position={[6.0, 2.3, -6.32]}>
        <Box p={[0, 0, 0]} s={[1.8, 1.4, 0.04]} c="#854d0e" />
        <Box p={[0, 0, 0.02]} s={[1.65, 1.25, 0.02]} c="#d97706" />
        {/* Memo notes pinned on board */}
        <Box p={[-0.45, 0.25, 0.04]} s={[0.35, 0.4, 0.01]} c="#ffffff" />
        <Box p={[0.2, 0.3, 0.04]} s={[0.4, 0.35, 0.01]} c="#fef08a" />
        <Box p={[-0.2, -0.25, 0.04]} s={[0.45, 0.3, 0.01]} c="#93c5fd" />
        <Box p={[0.42, -0.2, 0.04]} s={[0.3, 0.38, 0.01]} c="#86efac" />
      </group>

      {/* 3. Wall Certificate / Achievement Diplomas (Executive Wing) */}
      <group position={[-7.8, 2.3, -6.32]}>
        <Box p={[0, 0.35, 0]} s={[1.1, 0.75, 0.04]} c="#ca8a04" />
        <Box p={[0, 0.35, 0.02]} s={[0.98, 0.65, 0.02]} c="#f8fafc" />
        <Box p={[0, 0.35, 0.03]} s={[0.7, 0.2, 0.01]} c="#1e293b" />

        <Box p={[0, -0.45, 0]} s={[1.1, 0.75, 0.04]} c="#ca8a04" />
        <Box p={[0, -0.45, 0.02]} s={[0.98, 0.65, 0.02]} c="#f8fafc" />
        <Box p={[0, -0.45, 0.03]} s={[0.7, 0.2, 0.01]} c="#1e293b" />
      </group>

      {/* 4. Left Wall: Acoustic Wood Slat Wall Panels & Corporate Motto */}
      {[-4.5, -3.2, 3.2, 4.5].map((wz) => (
        <group key={'w-panel-' + wz} position={[-17.82, 2.2, wz]}>
          <Box p={[0, 0, 0]} s={[0.04, 3.2, 0.8]} c="#334155" />
          {/* Vertical wood ribs */}
          {[-0.28, -0.1, 0.1, 0.28].map((rx) => (
            <Box key={rx} p={[0.03, 0, rx]} s={[0.02, 3.1, 0.08]} c="#a16207" />
          ))}
        </group>
      ))}

      {/* 5. Right Wall: Wall Shelves with decorative succulent pots & Neon Bar */}
      <group position={[17.82, 2.8, -3.0]}>
        <Box p={[0, 0, 0]} s={[0.04, 0.06, 2.2]} c="#0f172a" />
        {/* Books & mini pot on shelf */}
        <Box p={[-0.08, 0.15, -0.6]} s={[0.15, 0.25, 0.4]} c="#3b82f6" />
        <Box p={[-0.08, 0.15, 0.1]} s={[0.15, 0.25, 0.3]} c="#10b981" />
        {/* Mini plant pot */}
        <Box p={[-0.08, 0.1, 0.7]} s={[0.2, 0.16, 0.2]} c="#f8fafc" />
        <Box p={[-0.08, 0.24, 0.7]} s={[0.16, 0.14, 0.16]} c="#22c55e" />
      </group>

      <group position={[17.82, 1.8, -3.0]}>
        <Box p={[0, 0, 0]} s={[0.04, 0.06, 2.2]} c="#0f172a" />
        <Box p={[-0.08, 0.15, -0.3]} s={[0.15, 0.22, 0.5]} c="#e11d48" />
        <Box p={[-0.08, 0.15, 0.5]} s={[0.15, 0.22, 0.4]} c="#eab308" />
      </group>

      {/* ─── 6. RIGHT TOP: PANTRY & KITCHENETTE ─── */}
      <group position={[8.5, 0, -4.5]}>
        {/* Refrigerator */}
        <Box p={[1.8, 1.3, 0]} s={[1.1, 2.4, 1.0]} c="#f1f5f9" />
        <Box p={[1.8, 1.3, 0.52]} s={[0.04, 0.6, 0.04]} c="#64748b" />
        {/* Microwave Counter & Cabinet */}
        <Box p={[-0.5, 0.5, 0]} s={[2.8, 0.95, 0.9]} c="#1e293b" />
        <Box p={[-0.5, 0.98, 0]} s={[2.9, 0.06, 0.95]} c="#94a3b8" />
        {/* Microwave */}
        <Box p={[-1.2, 1.3, 0]} s={[0.7, 0.45, 0.5]} c="#334155" />
        {/* Coffee Maker / Espresso Machine */}
        <Box p={[0.2, 1.35, 0]} s={[0.6, 0.55, 0.5]} c="#0f172a" />
        <Box p={[0.2, 1.35, 0.26]} s={[0.1, 0.1, 0.05]} c="#f59e0b" e={1} />
        {/* Trash Can */}
        <Box p={[-2.2, 0.4, 0]} s={[0.45, 0.75, 0.45]} c="#475569" />
      </group>
      {/* Standing Round Cafe Table */}
      <group position={[8.5, 0, -1.5]}>
        <Box p={[0, 0.95, 0]} s={[1.2, 0.06, 1.2]} c="#f8fafc" />
        <Box p={[0, 0.47, 0]} s={[0.12, 0.92, 0.12]} c="#0f172a" />
        <Box p={[0, 0.02, 0]} s={[0.7, 0.04, 0.7]} c="#0f172a" />
      </group>

      {/* ─── 7. RIGHT BOTTOM: GAMING, ENTERTAINMENT & SLEEPING PODS ─── */}
      <group position={[14.2, 0, 1.0]}>
        {/* Big Screen Entertainment TV on Stand */}
        <Box p={[0, 0.45, -2.2]} s={[3.2, 0.85, 0.6]} c="#1e293b" />
        <Box p={[0, 1.7, -2.2]} s={[2.8, 1.6, 0.1]} c="#020617" />
        {/* Dynamic TV Screen Glow */}
        <Box p={[0, 1.7, -2.14]} s={[2.6, 1.45, 0.04]} c="#38bdf8" e={0.8} />

        {/* PlayStation 5 Console & Blue LED Strip */}
        <Box p={[1.0, 0.95, -2.1]} s={[0.2, 0.55, 0.35]} c="#ffffff" />
        <Box p={[1.0, 1.25, -2.05]} s={[0.18, 0.04, 0.04]} c="#3b82f6" e={1} />

        {/* Casual Blue & Indigo Beanbag Chairs (Game Dev Tycoon style!) */}
        <Box p={[-1.2, 0.3, 0.8]} s={[0.9, 0.5, 0.9]} c="#2563eb" />
        <Box p={[0.0, 0.3, 1.0]} s={[0.9, 0.5, 0.9]} c="#3b82f6" />
        <Box p={[1.2, 0.3, 0.8]} s={[0.9, 0.5, 0.9]} c="#1d4ed8" />

        {/* Comfortable Gaming Sofa */}
        <Box p={[0, 0.35, 2.2]} s={[2.8, 0.5, 0.9]} c="#1e293b" />
        <Box p={[0, 0.7, 2.6]} s={[2.8, 0.6, 0.3]} c="#0f172a" />
      </group>

      {/* Quiet Sleeping Rest Pods (Comfortable Beds with pillows & blankets) */}
      <group position={[15.0, 0, -4.5]}>
        {/* Bed 1 */}
        <group position={[-1.5, 0, 0]}>
          <Box p={[0, 0.25, 0]} s={[2.2, 0.35, 1.3]} c="#334155" />
          <Box p={[0, 0.48, 0]} s={[2.1, 0.15, 1.2]} c="#f1f5f9" />
          <Box p={[-0.3, 0.54, 0]} s={[1.3, 0.08, 1.18]} c="#0ea5e9" />
          <Box p={[0.7, 0.58, 0]} s={[0.45, 0.12, 0.9]} c="#ffffff" />
        </group>
        {/* Bed 2 */}
        <group position={[1.2, 0, 0]}>
          <Box p={[0, 0.25, 0]} s={[2.2, 0.35, 1.3]} c="#334155" />
          <Box p={[0, 0.48, 0]} s={[2.1, 0.15, 1.2]} c="#f1f5f9" />
          <Box p={[-0.3, 0.54, 0]} s={[1.3, 0.08, 1.18]} c="#6366f1" />
          <Box p={[0.7, 0.58, 0]} s={[0.45, 0.12, 0.9]} c="#ffffff" />
        </group>
        {/* Nightstand & Lamp */}
        <Box p={[-0.15, 0.35, 0.8]} s={[0.5, 0.55, 0.5]} c="#1e293b" />
        <Box p={[-0.15, 0.72, 0.8]} s={[0.2, 0.2, 0.2]} c="#fef08a" e={0.8} />
      </group>

      {/* ─── 8. ALL WORKSTATIONS & CHARACTERS (ALL 8 IN ONE FLAT WIDE OFFICE) ─── */}
      {agents.map((a) => (
        <group key={a.id}>
          <Workstation cfg={a} />
          <AgentActor cfg={a} showNameplate={false} onContextMenu={onContextMenu} />
        </group>
      ))}

      {/* ─── 9. AIR CONDITIONING UNITS (AC) IN EVERY ZONE ─── */}
      <ACUnit x={-11.5} y={3.4} z={-6.3} />  {/* Executive AC */}
      <ACUnit x={-3.5} y={3.4} z={-6.3} />   {/* Dev Hub Left AC */}
      <ACUnit x={3.5} y={3.4} z={-6.3} />    {/* Dev Hub Right AC */}
      <ACUnit x={8.5} y={3.4} z={-6.3} />    {/* Pantry AC */}
      <ACUnit x={14.5} y={3.4} z={-6.3} />   {/* Entertainment & Sleeping AC */}

      {/* ─── 10. INDOOR TROPICAL POTTED PLANTS (LIKE REFERENCE) ─── */}
      <Plant x={-17.2} z={5.5} />
      <Plant x={-7.0} z={5.5} />
      <Plant x={-5.5} z={-5.6} />
      <Plant x={5.5} z={-5.6} />
      <Plant x={10.5} z={5.5} />
      <Plant x={17.2} z={5.5} />
    </group>
  );
}
