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
  const camera = useThree((s) => s.camera as any);
  const size = useThree((s) => s.size);
  const controls = useRef<any>(null);

  useEffect(() => {
    let pos: [number, number, number], tgt: [number, number, number];
    let targetFov = 40;

    const aspect = size.width / Math.max(1, size.height);

    if (view === 'agent') {
      return;
    } else if (level === 'city') {
      pos = [28, 32, 28];
      tgt = [0, 4, 0];
      targetFov = 45;
    } else if (level === 'building') {
      pos = [16, 22, 18];
      tgt = [0, 4, 0];
      targetFov = 45;
    } else {
      // Wide sprawling horizontal single-floor office:
      if (aspect < 0.75) {
        // Narrow portrait smartphone (iPhone / Android)
        pos = [1.5, 34, 38];
        tgt = [0, 0, -1];
        targetFov = 58;
      } else if (aspect < 1.15) {
        // Tablet / Foldable portrait
        pos = [2, 28, 32];
        tgt = [0.2, 0.2, -0.8];
        targetFov = 48;
      } else {
        // Desktop landscape (16:9 / wide)
        pos = [2, 21, 24];
        tgt = [0.5, 0.5, -0.5];
        targetFov = 40;
      }
    }

    const c = controls.current;
    if (!c) return;
    const upd = () => {
      camera.updateProjectionMatrix();
      c.update();
    };
    const tw = gsap.timeline({ defaults: { duration: 1.1, ease: 'power2.inOut', onUpdate: upd } });
    tw.to(camera.position, { x: pos[0], y: pos[1], z: pos[2] }, 0)
      .to(c.target, { x: tgt[0], y: tgt[1], z: tgt[2] }, 0)
      .to(camera, { fov: targetFov }, 0);

    return () => {
      tw.kill();
    };
  }, [view, floor, level, selectedAgentId, camera, size.width, size.height]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={true}
      enablePan={true}
      enableDamping={true}
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={70}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.25}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  );
}
