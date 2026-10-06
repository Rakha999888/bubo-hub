import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { BuboCity } from './3d/city/BuboCity';
import { BuboBuilding } from './3d/building/BuboBuilding';
import { CameraRig } from './3d/cameras/CameraRig';
import { ViewSwitcher } from './components/navigation/ViewSwitcher';
import { FloorSelector } from './components/navigation/FloorSelector';
import { AgentPanel } from './components/agent-panel/AgentPanel';
import { PromptBar } from './components/prompt/PromptBar';
import { PixelOfficeRoom } from './components/agent-view/PixelOfficeRoom';
import { useStore } from './state/store';
import { STATUS_COLOR } from './3d/characters/AgentActor';
import { CameraLevel, AgentConfig } from './types';

function Counts() {
  const agents = useStore((s) => s.agents);
  const n = (k: string) => Object.values(agents).filter((a) => a.status === k).length;
  return (
    <div className="counts">
      <span style={{ color: '#34d399' }}>● Online {Object.values(agents).filter((a) => a.status !== 'offline').length}</span>
      <span style={{ color: STATUS_COLOR.working }}>● Working {n('working')}</span>
      <span style={{ color: STATUS_COLOR.waiting }}>● Waiting {n('waiting')}</span>
      <span style={{ color: STATUS_COLOR.error }}>● Error {n('error')}</span>
    </div>
  );
}

export default function App() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const level = useStore((s) => s.cameraLevel);
  const setLevel = useStore((s) => s.setCameraLevel);
  const selectAgent = useStore((s) => s.selectAgent);

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    agent: AgentConfig | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    agent: null
  });

  const [inspectAgentId, setInspectAgentId] = useState<string | null>(null);

  const handleAgentContextMenu = (e: any, agent: AgentConfig) => {
    // Native event or R3F pointer event
    const nativeEvent = e.nativeEvent || e;
    nativeEvent.preventDefault?.();
    setContextMenu({
      visible: true,
      x: nativeEvent.clientX || 200,
      y: nativeEvent.clientY || 200,
      agent
    });
  };

  const handleCloseContextMenu = () => {
    if (contextMenu.visible) {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  return (
    <div className="app" onClick={handleCloseContextMenu}>
      <header>
        <div className="brand">Bubo-Hub 3D</div>
        <Counts />
        <ViewSwitcher />
      </header>

      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [34, 26, 42], fov: 40, near: 0.5, far: 400 }}
        onPointerMissed={() => {
          selectAgent(null);
          handleCloseContextMenu();
        }}
      >
        <color attach="background" args={['#bfe3f5']} />
        <fog attach="fog" args={['#bfe3f5', 90, 220]} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[30, 40, 25]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />
        <pointLight position={[0, 6, 2]} intensity={0.6} color="#ffd9a0" />

        <BuboCity />
        <BuboBuilding onContextMenu={handleAgentContextMenu} />
        <CameraRig />
        <AdaptiveDpr pixelated />
      </Canvas>

      {/* Context Menu on Right Click */}
      {contextMenu.visible && contextMenu.agent && (
        <div
          style={{
            position: 'absolute',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            padding: '8px',
            zIndex: 9999,
            minWidth: '150px',
            backdropFilter: 'blur(10px)',
            color: '#f8fafc',
            fontFamily: "'Inter', system-ui, sans-serif"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#93c5fd',
              padding: '4px 8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '4px'
            }}
          >
            {contextMenu.agent.name}
          </div>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => {
              const targetId = contextMenu.agent?.id || null;
              setInspectAgentId(targetId);
              setView('agent');
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
          >
            <span>Lihat Agent</span>
            <span style={{ fontSize: '11px', color: '#60a5fa' }}>→</span>
          </button>
        </div>
      )}

      {view === 'office' && (
        <>
          <PromptBar />
          <FloorSelector />
          <AgentPanel />
        </>
      )}

      {view === 'agent' && (
        <PixelOfficeRoom initialAgentId={inspectAgentId} />
      )}
    </div>
  );
}
