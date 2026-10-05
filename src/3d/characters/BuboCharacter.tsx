import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { AccessoryId } from '../../types';

export interface Pose { sit: number; walking: boolean; typing: boolean; mood: 'normal' | 'error' | 'success' | 'think'; }

const YELLOW = '#f6c21a', TEAL = '#1fa59a', DARK = '#2a3042', MANAGER = '#14566a';

/** One shared humanoid mascot; only the small chest accessory differs per department. */
function Accessory({ id }: { id: AccessoryId }) {
  const m = (c: string, e = 0) => <meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} />;
  switch (id) {
    case 'workflow-board': return (<group>{[-0.07, 0, 0.07].map((x, i) => <mesh key={i} position={[x, i === 1 ? 0.04 : -0.03, 0]}><sphereGeometry args={[0.035, 8, 8]} />{m('#ff6d3a')}</mesh>)}</group>);
    case 'ui-pen': return <mesh rotation={[0, 0, 0.7]}><cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />{m('#ff5fa2')}</mesh>;
    case 'db-cylinder': return <mesh><cylinderGeometry args={[0.07, 0.07, 0.12, 14]} />{m('#3b82f6')}</mesh>;
    case 'ticket': return <mesh><boxGeometry args={[0.16, 0.1, 0.02]} />{m('#fdfdfd')}</mesh>;
    case 'camera': return (<group><mesh><boxGeometry args={[0.16, 0.1, 0.07]} />{m('#111')}</mesh><mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.04, 10]} />{m('#5aa9ff', 0.4)}</mesh></group>);
    case 'pdf-doc': return <mesh><boxGeometry args={[0.1, 0.14, 0.02]} />{m('#e5484d')}</mesh>;
    case 'server-rack': return (<group>{[0.04, -0.01, -0.06].map((y, i) => <mesh key={i} position={[0, y, 0]}><boxGeometry args={[0.16, 0.04, 0.03]} />{m('#8a94a6')}</mesh>)}<mesh position={[0.05, 0.04, 0.02]}><sphereGeometry args={[0.012, 6, 6]} />{m('#35e07a', 1)}</mesh></group>);
    case 'admin-badge': return <mesh><boxGeometry args={[0.12, 0.12, 0.02]} />{m('#e0b341')}</mesh>;
    case 'manager-tie': return (<group><mesh position={[0, -0.02, 0]}><boxGeometry args={[0.07, 0.3, 0.02]} />{m('#0b2540')}</mesh><mesh position={[0.14, 0.08, 0]}><boxGeometry args={[0.09, 0.05, 0.02]} />{m('#e0b341')}</mesh></group>);
  }
}

export function BuboCharacter({ pose, accessory, manager = false, dim = false }: { pose: { current: Pose }; accessory: AccessoryId; manager?: boolean; dim?: boolean }) {
  const root = useRef<THREE.Group>(null);
  const upper = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const shins = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const arms = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];

  useFrame((s) => {
    const t = s.clock.elapsedTime; const p = pose.current;
    const hips = THREE.MathUtils.lerp(0.79, 0.49, p.sit);        // standing -> seated hip height
    const swing = p.walking ? Math.sin(t * 8) : 0;
    if (root.current) root.current.position.y = p.walking ? Math.abs(Math.sin(t * 8)) * 0.05 : 0;
    if (upper.current) upper.current.position.y = hips;
    legs.forEach((r, i) => { if (!r.current) return; r.current.position.y = hips; r.current.rotation.x = -p.sit * Math.PI / 2 + swing * 0.55 * (i ? -1 : 1); });
    shins.forEach((r) => { if (r.current) r.current.rotation.x = p.sit * Math.PI / 2; });
    arms.forEach((r, i) => {
      if (!r.current) return;
      let x = -p.sit * 1.08;                                       // hands reach keyboard when seated
      if (p.typing) x += Math.sin(t * 15 + i * 2) * 0.07;
      if (p.walking) x += swing * 0.5 * (i ? 1 : -1);
      if (p.mood === 'success') x = -2.7 + Math.sin(t * 10) * 0.2;
      r.current.rotation.x = x;
    });
    if (head.current) {
      head.current.rotation.z = p.mood === 'think' ? Math.sin(t * 1.5) * 0.12 : 0;
      head.current.rotation.x = p.mood === 'error' ? 0.25 : p.sit > 0.9 ? -0.08 : 0;
    }
  });

  const shirt = manager ? MANAGER : TEAL;
  const mat = (c: string) => <meshStandardMaterial color={c} roughness={0.7} opacity={dim ? 0.45 : 1} transparent={dim} />;
  return (
    <group ref={root}>
      {/* legs: thigh pivots at hip, shin pivots at knee */}
      {[-0.14, 0.14].map((x, i) => (
        <group key={i} ref={legs[i]} position={[x, 0.79, 0]}>
          <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.17, 0.3, 0.17]} />{mat(DARK)}</mesh>
          <group ref={shins[i]} position={[0, -0.3, 0]}>
            <mesh position={[0, -0.245, 0]}><boxGeometry args={[0.15, 0.49, 0.15]} />{mat(DARK)}</mesh>
            <mesh position={[0, -0.47, 0.06]}><boxGeometry args={[0.18, 0.06, 0.28]} />{mat('#1b1f2c')}</mesh>
          </group>
        </group>
      ))}
      <group ref={upper} position={[0, 0.79, 0]}>
        <RoundedBox args={[0.56, 0.6, 0.36]} radius={0.08} position={[0, 0.3, 0]}>{mat(shirt)}</RoundedBox>
        {manager && <mesh position={[0, 0.42, 0.185]}><boxGeometry args={[0.14, 0.2, 0.01]} /><meshStandardMaterial color="#f4f4f4" /></mesh>}
        <group position={[0, 0.3, 0.19]}><Accessory id={accessory} /></group>
        {/* arms: shoulder pivot */}
        {[-0.37, 0.37].map((x, i) => (
          <group key={i} ref={arms[i]} position={[x, 0.52, 0]}>
            <mesh position={[0, -0.225, 0]}><boxGeometry args={[0.14, 0.45, 0.14]} />{mat(shirt)}</mesh>
            <mesh position={[0, -0.5, 0]}><sphereGeometry args={[0.095, 10, 10]} />{mat(YELLOW)}</mesh>
          </group>
        ))}
        {/* oversized head, simple face */}
        <group ref={head} position={[0, 1.02, 0]}>
          <RoundedBox args={[0.92, 0.82, 0.8]} radius={0.2} smoothness={3}>{mat(YELLOW)}</RoundedBox>
          {[-0.2, 0.2].map((x, i) => <mesh key={i} position={[x, 0.07, 0.4]}><sphereGeometry args={[0.055, 10, 10]} /><meshStandardMaterial color="#111" /></mesh>)}
          <mesh position={[0, -0.13, 0.4]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} /><meshStandardMaterial color="#3a2a10" /></mesh>
        </group>
      </group>
    </group>
  );
}
