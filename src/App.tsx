import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { BuboCity } from './3d/city/BuboCity';
import { BuboBuilding } from './3d/building/BuboBuilding';
import { CameraRig } from './3d/cameras/CameraRig';
import { StatBubbles } from './3d/characters/StatBubbles';
import { ViewSwitcher } from './components/navigation/ViewSwitcher';
import { FloorSelector } from './components/navigation/FloorSelector';
import { AgentPanel } from './components/agent-panel/AgentPanel';
import { PromptBar } from './components/prompt/PromptBar';
import { TycoonHUD } from './components/tycoon-hud/TycoonHUD';
import { useStore } from './state/store';
import { STATUS_COLOR } from './3d/characters/AgentActor';
import { CameraLevel } from './types';

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
  const level = useStore((s) => s.cameraLevel);
  const setLevel = useStore((s) => s.setCameraLevel);
  const selectAgent = useStore((s) => s.selectAgent);

  return (
    <div className="app">
      <header>
        <div className="brand">Bubo-Hub · Game Dev Tycoon Edition</div>
        <Counts />
        <ViewSwitcher />
      </header>

      {/* Game Dev Tycoon Top Project & Stats HUD */}
      <TycoonHUD />

      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [34, 26, 42], fov: 40, near: 0.5, far: 400 }}
        onPointerMissed={() => selectAgent(null)}
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
        <BuboBuilding />
        <StatBubbles />
        <CameraRig />
        <AdaptiveDpr pixelated />
      </Canvas>

      {view === 'office' && (
        <div className="levels">
          {(['city', 'building', 'floor'] as CameraLevel[]).map((l) => (
            <button key={l} className={level === l ? 'on' : ''} onClick={() => setLevel(l)}>
              {l === 'city' ? 'Kota' : l === 'building' ? 'Gedung' : 'Lantai'}
            </button>
          ))}
        </div>
      )}

      <FloorSelector />
      <AgentPanel />
      <PromptBar />
    </div>
  );
}
