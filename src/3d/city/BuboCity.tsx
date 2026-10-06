import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const B = ({ p, s, c, e = 0 }: { p: [number, number, number]; s: [number, number, number]; c: string; e?: number }) => (
  <mesh position={p} receiveShadow castShadow><boxGeometry args={s} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} /></mesh>
);

// Shared traffic phase: x-axis road is green 0-7s of a 12s cycle.
const xGreen = (t: number) => t % 12 < 7;
const STOP_PLUS = 22, STOP_MINUS = 30;       // stop lines before the intersection at x=26

function Car({ color, z, dir, x0, all, idx }: { color: string; z: number; dir: 1 | -1; x0: number; all: React.MutableRefObject<number[]>; idx: number }) {
  const g = useRef<THREE.Group>(null); const x = useRef(x0);
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime; let nx = x.current + dir * 4 * Math.min(dt, 0.1);
    const red = !xGreen(t);
    const holdLine = red && ((dir > 0 && x.current < STOP_PLUS && nx >= STOP_PLUS) || (dir < 0 && x.current > STOP_MINUS && nx <= STOP_MINUS));
    const blocked = all.current.some((ox, j) => j !== idx && Math.sign(ox - x.current) === dir && Math.abs(ox - x.current) < 3.2 && Math.abs(ox - x.current) > 0 && allZ(j) === z);
    if (!holdLine && !blocked) x.current = nx; if (x.current > 60) x.current = -60; if (x.current < -60) x.current = 60;
    all.current[idx] = x.current; g.current?.position.set(x.current, 0, z);
  });
  return (<group ref={g} rotation={[0, dir > 0 ? 0 : Math.PI, 0]}><B p={[0, 0.35, 0]} s={[2, 0.5, 0.95]} c={color} /><B p={[-0.1, 0.8, 0]} s={[1.0, 0.4, 0.85]} c="#cfe6f2" />{[-0.7, 0.7].map((wx) => [-0.5, 0.5].map((wz) => <mesh key={`${wx}${wz}`} position={[wx, 0.18, wz]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.15, 10]} /><meshStandardMaterial color="#222" /></mesh>))}</group>);
}
const laneZ = [17.5, 17.5, 14.5, 14.5]; const allZ = (j: number) => laneZ[j];

function Traffic() {
  const pos = useRef([-40, 10, 40, -10]);
  const cols = ['#e9524a', '#3b82c4', '#f2c230', '#5cb85c'];
  const dirs: (1 | -1)[] = [1, 1, -1, -1];
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((s) => { if (lamp.current) { const g = xGreen(s.clock.elapsedTime); lamp.current.color.set(g ? '#2ee86a' : '#ff3b3b'); lamp.current.emissive.set(g ? '#2ee86a' : '#ff3b3b'); } });
  return (
    <group>
      {cols.map((c, i) => <Car key={i} idx={i} color={c} z={laneZ[i]} dir={dirs[i]} x0={pos.current[i]} all={pos} />)}
      <group position={[21, 0, 12.8]}><B p={[0, 1.5, 0]} s={[0.12, 3, 0.12]} c="#333" /><mesh position={[0, 3.1, 0]}><sphereGeometry args={[0.22, 10, 10]} /><meshStandardMaterial ref={lamp} color="#2ee86a" emissive="#2ee86a" emissiveIntensity={1.2} /></mesh></group>
      <group position={[31, 0, 19.2]}><B p={[0, 1.5, 0]} s={[0.12, 3, 0.12]} c="#333" /><mesh position={[0, 3.1, 0]}><sphereGeometry args={[0.22, 10, 10]} /><meshStandardMaterial color="#888" emissive="#888" emissiveIntensity={0.3} /></mesh></group>
    </group>
  );
}

/** Trees use two InstancedMeshes (trunks + crowns) = 2 draw calls for all trees. */
function Trees() {
  const trunks = useRef<THREE.InstancedMesh>(null); const crowns = useRef<THREE.InstancedMesh>(null);
  const pts = useMemo(() => {
    const a: [number, number, number][] = []; let seed = 7; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let x = -50; x <= 50; x += 7) { a.push([x + r() * 2, 12 + 0, 0.9 + r() * 0.5], [x + r() * 2, 20.5, 0.9 + r() * 0.5]); }      // roadside rows
    for (let i = 0; i < 8; i++) a.push([-12 + i * 3.4, 7 + r() * 2, 0.8 + r() * 0.6]);                                              // garden
    for (let i = 0; i < 6; i++) a.push([10 + i * 2.6, 6 + r() * 0.5, 0.8 + r() * 0.4]);                                             // parking edge
    for (let i = 0; i < 24; i++) a.push([-48 + r() * 96, -30 + r() * 20, 0.8 + r() * 1.0]);                                          // back area
    return a;
  }, []);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    pts.forEach(([x, z, s], i) => {
      m.compose(new THREE.Vector3(x, 0.6 * s, z), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); trunks.current!.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(x, 1.9 * s, z), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); crowns.current!.setMatrixAt(i, m);
    });
    trunks.current!.instanceMatrix.needsUpdate = true; crowns.current!.instanceMatrix.needsUpdate = true;
  }, [pts]);
  return (<group>
    <instancedMesh ref={trunks} args={[undefined, undefined, pts.length]} castShadow><cylinderGeometry args={[0.15, 0.2, 1.2, 6]} /><meshStandardMaterial color="#7a5232" /></instancedMesh>
    <instancedMesh ref={crowns} args={[undefined, undefined, pts.length]} castShadow><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#4a9c5d" flatShading /></instancedMesh>
  </group>);
}

function ParkedCar({ x, z, c }: { x: number; z: number; c: string }) {
  return <group position={[x, 0, z]} rotation={[0, Math.PI / 2, 0]}><B p={[0, 0.35, 0]} s={[2, 0.5, 0.95]} c={c} /><B p={[-0.1, 0.8, 0]} s={[1, 0.4, 0.85]} c="#cfe6f2" /></group>;
}

function Neighbors() {
  const list = useMemo(() => {
    const cols = ['#d8c3a5', '#9bb3c4', '#c98f7a', '#b9c7a7', '#e0d7c3', '#8aa0b5'];
    const a: { p: [number, number, number]; s: [number, number, number]; c: string }[] = []; let seed = 3; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 9; i++) { const h = 5 + r() * 9; a.push({ p: [-50 + i * 11, h / 2, -22 - r() * 6], s: [7 + r() * 3, h, 7], c: cols[i % cols.length] }); }
    for (let i = 0; i < 4; i++) { const h = 4 + r() * 5; a.push({ p: [-44 + i * 9, h / 2, 28], s: [7, h, 6], c: cols[(i + 2) % cols.length] }); a.push({ p: [38 + i * 8, h / 2, 28], s: [6, h, 6], c: cols[(i + 4) % cols.length] }); }
    a.push({ p: [-24, 3, 5], s: [8, 6, 9], c: '#d8b08c' }, { p: [-36, 2.2, 5], s: [6, 4.4, 8], c: '#a3c4a8' });
    return a;
  }, []);
  return <group>{list.map((b, i) => <B key={i} p={b.p} s={b.s} c={b.c} />)}</group>;
}

export function BuboCity() {
  return (
    <group position={[0, -0.25, 0]}>
      {/* Clean Surrounding Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color="#bbf7d0" roughness={0.9} />
      </mesh>
      {/* Surrounding Park Trees outside the wide office */}
      {[-26, -22, 22, 26].map((x) =>
        [-12, 0, 12].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <B p={[0, 1.2, 0]} s={[0.3, 2.4, 0.3]} c="#78350f" />
            <mesh position={[0, 2.8, 0]} castShadow>
              <dodecahedronGeometry args={[1.6, 1]} />
              <meshStandardMaterial color="#16a34a" roughness={0.8} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}
