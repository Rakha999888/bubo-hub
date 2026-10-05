import React, { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AgentConfig } from '../../types';
import { Workstation } from '../../3d/building/BuboBuilding';
import { AgentActor } from '../../3d/characters/AgentActor';

function FrontCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.32, -2.05);
    camera.lookAt(0, 0.82, 0.35);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

export function Agent3DPortrait({ cfg, interactive = false }: { cfg: AgentConfig; interactive?: boolean }) {
  // Center desk coordinate so it positions right at (0, 0, 0)
  const localCfg = useMemo<AgentConfig>(() => ({
    ...cfg,
    desk: [0, 0]
  }), [cfg]);

  return (
    <div
      style={{
        width: '100%',
        height: interactive ? '200px' : '175px',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 35%, #2a3444 0%, #151d28 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)',
        pointerEvents: interactive ? 'auto' : 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 1.32, -2.05], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <FrontCamera />
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 4, -3]} intensity={1.4} />
        <directionalLight position={[3, 3, 2]} intensity={0.6} />
        <pointLight position={[0, 1.5, 0]} intensity={0.6} color="#ffd9a0" />
        <group position={[0, -0.68, 0]}>
          <Workstation cfg={localCfg} />
          <AgentActor cfg={localCfg} showNameplate={false} />
        </group>
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 4}
            target={[0, 0.82, 0.35]}
          />
        )}
      </Canvas>
    </div>
  );
}
