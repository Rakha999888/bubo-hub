import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AGENTS } from '../../config/agents';
import { FLOOR_NAMES, ROOMS, floorY } from '../../config/rooms';
import { AgentConfig, FloorId } from '../../types';
import { AgentActor, STATUS_COLOR } from '../characters/AgentActor';
import { useStore } from '../../state/store';

const WOOD = '#9a7048', CREAM = '#efe6d2', NAVY = '#1c2b45', GRAY = '#8b93a0';
const Box = ({ p, s, c, e = 0 }: { p: [number, number, number]; s: [number, number, number]; c: string; e?: number }) => (
  <mesh position={p} castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.8} /></mesh>
);

function Plant({ x, z }: { x: number; z: number }) {
  return (<group position={[x, 0.15, z]}><Box p={[0, 0.2, 0]} s={[0.4, 0.4, 0.4]} c="#a8683f" /><mesh position={[0, 0.65, 0]}><icosahedronGeometry args={[0.35, 0]} /><meshStandardMaterial color="#3f9b5a" /></mesh></group>);
}

/** Workstation with named anchors: Sit = (x, z+0.9), Keyboard = (x, z+0.45), Monitor = (x, z-0.2). */
function Workstation({ cfg }: { cfg: AgentConfig }) {
  const status = useStore((s) => s.agents[cfg.id].status);
  const [x, z] = cfg.desk; const y0 = 0.15;
  const screen = status === 'offline' || status === 'idle' ? '#10151f' : STATUS_COLOR[status];
  return (
    <group>
      <Box p={[x, y0 + 0.67, z]} s={[2, 0.06, 1.1]} c={WOOD} />
      <Box p={[x - 0.9, y0 + 0.33, z]} s={[0.06, 0.66, 1]} c="#6f4f31" />
      <Box p={[x + 0.9, y0 + 0.33, z]} s={[0.06, 0.66, 1]} c="#6f4f31" />
      <Box p={[x, y0 + 1.0, z - 0.2]} s={[0.85, 0.5, 0.05]} c="#1a1d25" />
      <Box p={[x, y0 + 1.0, z - 0.17]} s={[0.78, 0.43, 0.02]} c={screen} e={status === 'idle' || status === 'offline' ? 0 : 0.8} />
      <Box p={[x, y0 + 0.78, z - 0.2]} s={[0.1, 0.1, 0.1]} c="#1a1d25" />
      <Box p={[x, y0 + 0.71, z + 0.45]} s={[0.55, 0.025, 0.18]} c="#2d323e" />
      {/* chair at SitAnchor: seat top = 0.4 above floor, hips rest on it */}
      <Box p={[x, y0 + 0.35, z + 0.9]} s={[0.6, 0.1, 0.55]} c={NAVY} />
      <Box p={[x, y0 + 0.78, z + 1.24]} s={[0.6, 0.7, 0.07]} c={NAVY} />
      <mesh position={[x, y0 + 0.17, z + 0.9]}><cylinderGeometry args={[0.05, 0.05, 0.3, 8]} /><meshStandardMaterial color="#444" /></mesh>
    </group>
  );
}

function Stairs({ from }: { from: number }) {
  const y = floorY(from); const steps = 8;
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

function Lounge() {
  const tv = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((s) => { if (tv.current) tv.current.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 3) * 0.2; });
  return (
    <group>
      <Box p={[3.4, 0.4, 2.2]} s={[2.4, 0.5, 0.9]} c="#c9694a" />
      <Box p={[3.4, 0.85, 2.6]} s={[2.4, 0.5, 0.2]} c="#c9694a" />
      <Box p={[3.4, 0.35, 0.6]} s={[1.2, 0.3, 0.7]} c={WOOD} />
      <mesh position={[3.5, 2.0, -4.85]}><boxGeometry args={[2.4, 1.2, 0.08]} /><meshStandardMaterial ref={tv} color="#6aa7ff" emissive="#6aa7ff" emissiveIntensity={0.8} /></mesh>
      <Box p={[5.7, 0.7, -4.3]} s={[1.2, 1.1, 0.7]} c="#d9d4c8" />
      <Box p={[5.5, 1.45, -4.3]} s={[0.4, 0.4, 0.4]} c="#2b2b2b" />
      <Box p={[5.8, 0.65, -2.2]} s={[0.8, 0.9, 0.5]} c="#e4a84a" />
      <Plant x={6.2} z={3.6} /><Plant x={0.8} z={-4.4} />
      <Box p={[0.9, 0.9, 3]} s={[0.4, 1.4, 1.2]} c={WOOD} />
    </group>
  );
}

function ServerRacks() {
  return (<group>{[-6.2, -5.2, -4.2].map((x, i) => (
    <group key={i}><Box p={[x, 1.15, -4.3]} s={[0.8, 2, 0.8]} c="#2c3340" />
      {[0, 1, 2, 3].map((k) => <Box key={k} p={[x + 0.25, 0.6 + k * 0.4, -3.88]} s={[0.08, 0.08, 0.04]} c={k % 2 ? '#35e07a' : '#4aa3ff'} e={1} />)}</group>))}
    <Box p={[-1.6, 2.1, -4.85]} s={[2.4, 1, 0.06]} c="#12202e" e={0.4} /></group>);
}

function Floor({ f }: { f: FloorId }) {
  const y = floorY(f);
  const rooms = ROOMS.filter((r) => r.floor === f);
  const agents = AGENTS.filter((a) => a.floor === f);
  return (
    <group position={[0, y, 0]}>
      <Box p={[0, 0, 0]} s={[14, 0.3, 10]} c={CREAM} />
      {rooms.map((r) => (
        <mesh key={r.id} position={[r.center[0], 0.17, r.center[1]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={r.size} /><meshStandardMaterial color={r.color} opacity={0.55} transparent /></mesh>
      ))}
      {rooms.map((r) => <Text key={r.id + 't'} position={[r.center[0], 0.2, r.center[1] + r.size[1] / 2 - 0.25]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.28} color="#ffffff" anchorX="center">{r.name}</Text>)}
      <Box p={[0, 2, -5]} s={[14, 3.7, 0.2]} c={f === 3 ? '#cdbb9a' : f === 2 ? '#c9d3da' : '#b4bcc6'} />
      <Box p={[-7, 2, 0]} s={[0.2, 3.7, 10]} c="#a7b0ba" />
      {[-5, 0, 5].map((x) => <Box key={x} p={[x, 2.2, -4.88]} s={[2, 1.2, 0.04]} c="#9fd3ee" e={0.25} />)}
      <Text position={[0, 3.35, -4.85]} fontSize={0.38} color={NAVY} anchorX="center">{`FLOOR ${f} · ${FLOOR_NAMES[f].toUpperCase()}`}</Text>
      {agents.map((a) => <Workstation key={a.id} cfg={a} />)}
      {f === 1 && <><Lounge /><ServerRacks /></>}
      {f === 3 && <><Box p={[0, 0.6, 2.4]} s={[3, 0.08, 1.2]} c={WOOD} /><Box p={[0, 0.3, 2.4]} s={[0.2, 0.6, 0.2]} c="#6f4f31" />{[-1.2, 1.2].map((x) => <Box key={x} p={[x, 0.35, 3.3]} s={[0.5, 0.1, 0.5]} c={NAVY} />)}<Plant x={-6.2} z={3.6} /></>}
      {f === 2 && <><Plant x={-6.3} z={3.8} /><Plant x={6.2} z={4} /></>}
    </group>
  );
}

export function BuboBuilding() {
  const view = useStore((s) => s.view);
  const floor = useStore((s) => s.floor);
  const floors = ([1, 2, 3] as FloorId[]).filter((f) => view === 'office' || f <= floor); // Agent View hides upper floors
  return (
    <group>
      {floors.map((f) => <Floor key={f} f={f} />)}
      {floors.filter((f) => f < 3 && floors.includes((f + 1) as FloorId)).map((f) => <Stairs key={f} from={f} />)}
      {AGENTS.filter((a) => floors.includes(a.floor)).map((a) => <AgentActor key={a.id} cfg={a} />)}
    </group>
  );
}
