import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { useStore } from '../../state/store';
import { floorY } from '../../config/rooms';
import { BUBO_CHARACTERS } from '../../data/characters/characters.config';

/** City -> Building -> Floor -> (Agent view). One camera, smooth GSAP tweens, no snapping. */
export function CameraRig() {
  const view = useStore((s) => s.view);
  const floor = useStore((s) => s.floor);
  const level = useStore((s) => s.cameraLevel);
  const selectedAgentId = useStore((s) => s.selectedAgentId);
  const camera = useThree((s) => s.camera);
  const controls = useRef<any>(null);

  useEffect(() => {
    let pos: [number, number, number], tgt: [number, number, number];

    if (view === 'agent') {
      return;
    } else if (level === 'city') {
      pos = [28, 32, 28];
      tgt = [0, 4, 0];
    } else if (level === 'building') {
      pos = [16, 22, 18];
      tgt = [0, 4, 0];
    } else {
      // Wide sprawling horizontal single-floor office:
      // Isometric view looking at the full breadth of the office from front-left angled perspective
      pos = [2, 21, 24];
      tgt = [0.5, 0.5, -0.5];
    }

    const c = controls.current;
    if (!c) return;
    const upd = () => c.update();
    const tw = gsap.timeline({ defaults: { duration: 1.1, ease: 'power2.inOut', onUpdate: upd } });
    tw.to(camera.position, { x: pos[0], y: pos[1], z: pos[2] }, 0)
      .to(c.target, { x: tgt[0], y: tgt[1], z: tgt[2] }, 0);

    return () => {
      tw.kill();
    };
  }, [view, floor, level, selectedAgentId, camera]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={true}
      enablePan={true}
      minDistance={10}
      maxDistance={45}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.3}
      minAzimuthAngle={-Math.PI / 4}
      maxAzimuthAngle={Math.PI / 4}
    />
  );
}
