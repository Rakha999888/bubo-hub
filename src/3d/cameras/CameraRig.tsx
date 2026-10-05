import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { useStore } from '../../state/store';
import { floorY } from '../../config/rooms';

/** City -> Building -> Floor -> (Agent view). One camera, smooth GSAP tweens, no snapping. */
export function CameraRig() {
  const view = useStore((s) => s.view); const floor = useStore((s) => s.floor); const level = useStore((s) => s.cameraLevel);
  const camera = useThree((s) => s.camera); const controls = useRef<any>(null);

  useEffect(() => {
    const y = floorY(floor);
    let pos: [number, number, number], tgt: [number, number, number];
    if (view === 'agent') { pos = [0, y + 2.8, 12]; tgt = [0, y + 0.9, -1.5]; }
    else if (level === 'city') { pos = [34, 26, 42]; tgt = [0, 4, 4]; }
    else if (level === 'building') { pos = [15, 11, 24]; tgt = [0, 4, 0]; }
    else { pos = [0, y + 3.2, 16]; tgt = [0, y + 1.2, 0]; }
    const c = controls.current; if (!c) return;
    const upd = () => c.update();
    const tw = gsap.timeline({ defaults: { duration: 1.4, ease: 'power2.inOut', onUpdate: upd } });
    tw.to(camera.position, { x: pos[0], y: pos[1], z: pos[2] }, 0).to(c.target, { x: tgt[0], y: tgt[1], z: tgt[2] }, 0);
    return () => { tw.kill(); };
  }, [view, floor, level, camera]);

  return <OrbitControls ref={controls} makeDefault enabled={view === 'office'} enablePan={false} minDistance={5} maxDistance={90} maxPolarAngle={Math.PI / 2.05} />;
}
