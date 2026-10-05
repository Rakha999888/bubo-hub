import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AgentConfig } from '../../types';
import { Workstation } from '../../3d/building/BuboBuilding';
import { AgentActor } from '../../3d/characters/AgentActor';

export function Agent3DPortrait({ cfg }: { cfg: AgentConfig }) {
  // Center desk coordinate so it positions right at (0, 0, 0)
  const localCfg = useMemo<AgentConfig>(() => ({
    ...cfg,
    desk: [0, 0]
  }), [cfg]);

  return (
    <div
      style={{
        width: '100%',
        height: '175px',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, #2a3444 0%, #151d28 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)'
      }}
    >
      <Canvas
        camera={{ position: [0, 1.45, 2.7], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 4]} intensity={1.3} />
        <pointLight position={[0, 2, 1]} intensity={0.6} color="#ffd9a0" />
        <group position={[0, -0.68, 0]}>
          <Workstation cfg={localCfg} />
          <AgentActor cfg={localCfg} showNameplate={false} />
        </group>
      </Canvas>
    </div>
  );
}
