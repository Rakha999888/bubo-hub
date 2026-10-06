import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { AccessoryId, AvatarSpec, FacialState } from '../../types';

export interface Pose {
  sit: number;
  walking: boolean;
  typing: boolean;
  mood: 'normal' | 'error' | 'success' | 'think' | 'happy' | 'focused';
}

interface BuboCharacterProps {
  pose: { current: Pose };
  accessory: AccessoryId;
  avatar: AvatarSpec;
  manager?: boolean;
  dim?: boolean;
  lod?: number; // 0 = detailed (close), 1 = medium (office view), 2 = far
}

// ─── PBR MATERIAL HELPER ──────────────────────────────────────────────
function useMat(color: string, roughness = 0.5, metalness = 0.1, dim = false, emissive = '#000000', emissiveIntensity = 0) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      opacity={dim ? 0.45 : 1}
      transparent={dim}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

// ─── HAIRSTYLE COMPONENT ──────────────────────────────────────────────
function HairMesh({ style, color }: { style: string; color: string }) {
  const mat = <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />;
  switch (style) {
    case 'executive':
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.96, 0.28, 0.92]} radius={0.1} smoothness={4}>{mat}</RoundedBox>
          <mesh position={[0.2, 0.12, 0.38]} rotation={[0.1, 0, -0.2]}>
            <boxGeometry args={[0.5, 0.12, 0.2]} />
            {mat}
          </mesh>
        </group>
      );
    case 'admin-cut':
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.94, 0.24, 0.9]} radius={0.08} smoothness={3}>{mat}</RoundedBox>
          <mesh position={[0, 0.1, 0.35]}>
            <boxGeometry args={[0.85, 0.1, 0.2]} />
            {mat}
          </mesh>
        </group>
      );
    case 'short-modern':
      return (
        <group position={[0, 0.44, 0]}>
          <RoundedBox args={[0.94, 0.3, 0.92]} radius={0.12} smoothness={4}>{mat}</RoundedBox>
          {[-0.2, 0, 0.2].map((x, i) => (
            <mesh key={i} position={[x, 0.16, 0.25]} rotation={[0.2, 0, (i - 1) * 0.15]}>
              <coneGeometry args={[0.12, 0.25, 4]} />
              {mat}
            </mesh>
          ))}
        </group>
      );
    case 'creative-wavy':
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.98, 0.36, 0.96]} radius={0.14} smoothness={4}>{mat}</RoundedBox>
          <mesh position={[-0.35, -0.1, 0.1]} rotation={[0, 0, 0.3]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            {mat}
          </mesh>
          <mesh position={[0.35, -0.05, 0.1]} rotation={[0, 0, -0.2]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            {mat}
          </mesh>
        </group>
      );
    case 'neat-dark':
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.94, 0.26, 0.9]} radius={0.1} smoothness={4}>{mat}</RoundedBox>
        </group>
      );
    case 'friendly-medium':
      return (
        <group position={[0, 0.4, 0]}>
          <RoundedBox args={[0.96, 0.32, 0.94]} radius={0.12} smoothness={4}>{mat}</RoundedBox>
          <mesh position={[0, -0.1, -0.38]}>
            <boxGeometry args={[0.88, 0.3, 0.18]} />
            {mat}
          </mesh>
        </group>
      );
    case 'creative-long':
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.98, 0.36, 0.96]} radius={0.14} smoothness={4}>{mat}</RoundedBox>
          <mesh position={[-0.4, -0.25, 0.05]}>
            <cylinderGeometry args={[0.12, 0.16, 0.5, 8]} />
            {mat}
          </mesh>
          <mesh position={[0.4, -0.25, 0.05]}>
            <cylinderGeometry args={[0.12, 0.16, 0.5, 8]} />
            {mat}
          </mesh>
        </group>
      );
    case 'office-clean':
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.92, 0.22, 0.88]} radius={0.08} smoothness={3}>{mat}</RoundedBox>
        </group>
      );
    case 'practical-short':
    default:
      return (
        <group position={[0, 0.42, 0]}>
          <RoundedBox args={[0.94, 0.26, 0.9]} radius={0.1} smoothness={3}>{mat}</RoundedBox>
        </group>
      );
  }
}

// ─── EXPRESSIVE FACE COMPONENT WITH NATURAL BLINK & CLEAN NATURAL MOUTH ───
function ExpressiveFace({ mood }: { mood: FacialState | 'normal' | 'error' | 'success' | 'think' | 'happy' | 'focused' }) {
  const eyesGroup = useRef<THREE.Group>(null);

  let baseEyeScaleY = 1;
  let browAngle = 0.05;
  let browY = 0.20;

  if (mood === 'error') {
    browAngle = -0.25;
    baseEyeScaleY = 0.7;
  } else if (mood === 'happy' || mood === 'success') {
    browY = 0.22;
    browAngle = 0.1;
    baseEyeScaleY = 1.05;
  } else if (mood === 'think' || mood === 'thinking') {
    browAngle = 0.2;
    browY = 0.21;
    baseEyeScaleY = 0.85;
  } else if (mood === 'focused') {
    browAngle = -0.12;
    baseEyeScaleY = 0.85;
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (eyesGroup.current) {
      // Natural human blinking rhythm (every ~3.8 seconds, quick 0.12s close)
      const blinkCycle = t % 3.8;
      let blinkScale = 1.0;
      if (blinkCycle > 3.65) {
        const p = (blinkCycle - 3.65) / 0.15;
        blinkScale = Math.sin(p * Math.PI) < 0.8 ? 0.08 : 0.85;
      }
      eyesGroup.current.scale.y = baseEyeScaleY * blinkScale;
    }
  });

  return (
    <group position={[0, 0, 0.43]}>
      {/* Eyes with Natural Blinking */}
      <group ref={eyesGroup} position={[0, 0.05, 0]}>
        {[-0.22, 0.22].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {/* White outer */}
            <mesh>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            {/* Pupil / Iris */}
            <mesh position={[0, 0, 0.04]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color="#1e1b18" />
            </mesh>
            {/* Specular Highlight */}
            <mesh position={[0.02, 0.02, 0.07]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Eyebrows */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh
          key={i}
          position={[x, browY, 0.02]}
          rotation={[0, 0, (i === 0 ? 1 : -1) * browAngle]}
        >
          <boxGeometry args={[0.14, 0.03, 0.02]} />
          <meshStandardMaterial color="#2d241e" />
        </mesh>
      ))}

      {/* Clean Natural Neutral Mouth (Garis bibir biasa / normal netral) */}
      <mesh position={[0, -0.14, 0.01]}>
        <boxGeometry args={[0.16, 0.022, 0.015]} />
        <meshStandardMaterial color="#4a2e16" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─── ATTACHED PROPS & ACCESSORIES ─────────────────────────────────────
function PropItem({ name, accentColor }: { name: string; accentColor: string }) {
  const mat = (c: string, e = 0) => <meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.4} />;
  switch (name) {
    case 'headphones':
      return (
        <group position={[0, 1.05, 0]}>
          {/* Band */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.5, 0.03, 8, 24, Math.PI]} />
            {mat('#1e293b')}
          </mesh>
          {/* Ear Cups */}
          {[-0.48, 0.48].map((x, i) => (
            <mesh key={i} position={[x, -0.05, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
              {mat(accentColor, 0.3)}
            </mesh>
          ))}
        </group>
      );
    case 'headset':
      return (
        <group position={[0, 1.05, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.48, 0.02, 8, 24, Math.PI]} />
            {mat('#334155')}
          </mesh>
          <mesh position={[-0.46, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            {mat(accentColor)}
          </mesh>
          {/* Mic */}
          <mesh position={[-0.35, -0.2, 0.25]} rotation={[0.4, 0.5, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
            {mat('#1e293b')}
          </mesh>
        </group>
      );
    case 'smartwatch':
    case 'watch':
      return (
        <group position={[0.34, -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
            {mat(accentColor, 0.5)}
          </mesh>
        </group>
      );
    case 'tablet':
      return (
        <group position={[0.38, -0.3, 0.2]} rotation={[0.2, -0.4, 0.1]}>
          <boxGeometry args={[0.28, 0.38, 0.02]} />
          {mat('#0f172a')}
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.24, 0.34, 0.005]} />
            {mat(accentColor, 0.6)}
          </mesh>
        </group>
      );
    case 'laptop':
      return (
        <group position={[-0.34, -0.32, 0.18]} rotation={[0.2, 0.3, -0.1]}>
          <boxGeometry args={[0.36, 0.26, 0.03]} />
          {mat('#1e293b')}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.32, 0.22, 0.005]} />
            {mat(accentColor, 0.8)}
          </mesh>
        </group>
      );
    case 'id-badge':
    case 'manager-badge':
      return (
        <group position={[0.16, 0.42, 0.2]}>
          <boxGeometry args={[0.12, 0.16, 0.01]} />
          {mat('#ffffff')}
          <mesh position={[0, 0, 0.008]}>
            <boxGeometry args={[0.09, 0.06, 0.005]} />
            {mat(accentColor, 0.8)}
          </mesh>
        </group>
      );
    case 'tool-belt':
      return (
        <group position={[0, 0.02, 0]}>
          <mesh>
            <boxGeometry args={[0.62, 0.08, 0.42]} />
            {mat('#451a03')}
          </mesh>
          <mesh position={[0.25, -0.08, 0]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            {mat('#78350f')}
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

// ─── DEPARTMENT CHEST ACCESSORY ───────────────────────────────────────
function DepartmentAccessory({ id, accentColor }: { id: AccessoryId; accentColor: string }) {
  const mat = (c: string, e = 0) => <meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} roughness={0.3} />;
  switch (id) {
    case 'workflow-board':
      return (
        <group>
          {[-0.08, 0, 0.08].map((x, i) => (
            <mesh key={i} position={[x, i === 1 ? 0.03 : -0.02, 0]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              {mat(accentColor, 0.8)}
            </mesh>
          ))}
        </group>
      );
    case 'ui-pen':
      return (
        <mesh rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 10]} />
          {mat(accentColor, 0.5)}
        </mesh>
      );
    case 'db-cylinder':
      return (
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.14, 14]} />
          {mat(accentColor, 0.6)}
        </mesh>
      );
    case 'ticket':
      return (
        <mesh>
          <boxGeometry args={[0.18, 0.12, 0.02]} />
          {mat('#ffffff')}
        </mesh>
      );
    case 'camera':
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.18, 0.12, 0.08]} />
            {mat('#18181b')}
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
            {mat(accentColor, 0.6)}
          </mesh>
        </group>
      );
    case 'pdf-doc':
      return (
        <mesh>
          <boxGeometry args={[0.12, 0.16, 0.02]} />
          {mat(accentColor, 0.4)}
        </mesh>
      );
    case 'server-rack':
      return (
        <group>
          {[0.04, -0.01, -0.06].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[0.18, 0.04, 0.04]} />
              {mat('#334155')}
            </mesh>
          ))}
          <mesh position={[0.06, 0.04, 0.025]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            {mat(accentColor, 1)}
          </mesh>
        </group>
      );
    case 'admin-badge':
      return (
        <mesh>
          <boxGeometry args={[0.14, 0.14, 0.02]} />
          {mat(accentColor, 0.8)}
        </mesh>
      );
    case 'manager-tie':
      return (
        <group>
          <mesh position={[0, -0.04, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.02]} />
            {mat('#0f172a')}
          </mesh>
          <mesh position={[0, 0.08, 0.01]}>
            <boxGeometry args={[0.1, 0.06, 0.02]} />
            {mat(accentColor, 0.6)}
          </mesh>
        </group>
      );
  }
}

// ─── HIGH-FIDELITY BUBO CHARACTER MESH ────────────────────────────────
export function BuboCharacter({ pose, accessory, avatar, manager = false, dim = false, lod = 0 }: BuboCharacterProps) {
  const root = useRef<THREE.Group>(null);
  const upper = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const shins = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const arms = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const p = pose.current;
    const hips = THREE.MathUtils.lerp(0.82, 0.48, p.sit); // standing -> seated hip height
    const swing = p.walking ? Math.sin(t * 8) : 0;

    if (root.current) root.current.position.y = p.walking ? Math.abs(Math.sin(t * 8)) * 0.06 : 0;
    if (upper.current) upper.current.position.y = hips;

    legs.forEach((r, i) => {
      if (!r.current) return;
      r.current.position.y = hips;
      r.current.rotation.x = -p.sit * Math.PI / 2 + swing * 0.55 * (i ? -1 : 1);
    });

    shins.forEach((r) => {
      if (r.current) r.current.rotation.x = p.sit * Math.PI / 2;
    });

    arms.forEach((r, i) => {
      if (!r.current) return;
      let x = -p.sit * 1.05;
      if (p.typing) x += Math.sin(t * 15 + i * 2) * 0.08;
      if (p.walking) x += swing * 0.5 * (i ? 1 : -1);
      if (p.mood === 'success') x = -2.7 + Math.sin(t * 10) * 0.2;
      r.current.rotation.x = x;
    });

    if (head.current) {
      head.current.rotation.z = p.mood === 'think' ? Math.sin(t * 1.5) * 0.12 : 0;
      head.current.rotation.x = p.mood === 'error' ? 0.25 : p.sit > 0.9 ? -0.06 : 0;
    }
  });

  const skinMat = useMat(avatar.skinColor, 0.6, 0.05, dim);
  const topMat = useMat(avatar.topColor, 0.4, 0.1, dim);
  const accentMat = useMat(avatar.accentColor, 0.3, 0.2, dim, avatar.accentColor, 0.3);
  const bottomMat = useMat(avatar.bottomColor, 0.6, 0.05, dim);
  const shoeMat = useMat(avatar.shoeColor, 0.5, 0.2, dim);

  return (
    <group ref={root}>
      {/* LEGS & SHOES */}
      {[-0.15, 0.15].map((x, i) => (
        <group key={i} ref={legs[i]} position={[x, 0.82, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.32, 12]} />
            {bottomMat}
          </mesh>
          {/* Shin & Foot */}
          <group ref={shins[i]} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.085, 0.075, 0.44, 12]} />
              {bottomMat}
            </mesh>
            {/* Shoe / Sneaker / Boot */}
            <group position={[0, -0.46, 0.06]}>
              <RoundedBox args={[0.18, 0.1, 0.3]} radius={0.03} smoothness={3}>
                {shoeMat}
              </RoundedBox>
              {/* Sole accent */}
              <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[0.19, 0.02, 0.31]} />
                {accentMat}
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* UPPER BODY (TORSO, HEAD, ARMS) */}
      <group ref={upper} position={[0, 0.82, 0]}>
        {/* Hips / Belt */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.26, 0.24, 0.1, 16]} />
          {bottomMat}
        </mesh>

        {/* Torso / Jacket / Hoodie */}
        <group position={[0, 0.32, 0]}>
          <RoundedBox args={[0.58, 0.58, 0.38]} radius={0.1} smoothness={4}>
            {topMat}
          </RoundedBox>

          {/* Accent Line / Zipper / Collar */}
          <mesh position={[0, 0.02, 0.195]}>
            <boxGeometry args={[0.06, 0.52, 0.01]} />
            {accentMat}
          </mesh>

          {/* Department Accessory */}
          <group position={[0, 0.05, 0.2]}>
            <DepartmentAccessory id={accessory} accentColor={avatar.accentColor} />
          </group>

          {/* Attached Props (ID badges, tool belt, etc.) */}
          {avatar.props.map((p, idx) => (
            <PropItem key={idx} name={p} accentColor={avatar.accentColor} />
          ))}
        </group>

        {/* ARMS & HANDS */}
        {[-0.38, 0.38].map((x, i) => (
          <group key={i} ref={arms[i]} position={[x, 0.54, 0]}>
            {/* Shoulder */}
            <mesh position={[0, -0.05, 0]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              {topMat}
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.08, 0.075, 0.34, 12]} />
              {topMat}
            </mesh>
            {/* Hand / Fingers */}
            <group position={[0, -0.44, 0]}>
              <mesh>
                <sphereGeometry args={[0.085, 12, 12]} />
                {skinMat}
              </mesh>
            </group>
          </group>
        ))}

        {/* HEAD & FACE */}
        <group ref={head} position={[0, 1.05, 0]}>
          {/* Head Base */}
          <RoundedBox args={[0.9, 0.8, 0.78]} radius={0.2} smoothness={4}>
            {skinMat}
          </RoundedBox>

          {/* Expressive Face (Eyes, Eyebrows, Mouth) */}
          <ExpressiveFace mood={pose.current.mood} />

          {/* Customizable Hair Style */}
          <HairMesh style={avatar.hair} color={avatar.hairColor} />
        </group>
      </group>
    </group>
  );
}
