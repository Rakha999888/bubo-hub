import { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../../state/store';
import { AGENTS } from '../../config/agents';

interface Bubble {
  id: number;
  agentId: string;
  type: 'tech' | 'design' | 'bug' | 'research';
  text: string;
  x: number;
  z: number;
  yOffset: number;
}

export function StatBubbles() {
  const agents = useStore((s) => s.agents);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeAgents = AGENTS.filter((a) => agents[a.id]?.status === 'working');
      if (activeAgents.length === 0) return;

      const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      const types: Array<'tech' | 'design' | 'bug' | 'research'> = ['tech', 'design', 'bug', 'research'];
      const pickType = types[Math.floor(Math.random() * types.length)];
      const textMap = { tech: '+1 Tech', design: '+1 Design', bug: 'Bug Fix', research: '+1 Research' };

      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        agentId: randomAgent.id,
        type: pickType,
        text: textMap[pickType],
        x: randomAgent.desk[0],
        z: randomAgent.desk[1],
        yOffset: 2.2
      };

      setBubbles((prev) => [...prev.slice(-8), newBubble]);
    }, 1800);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <group>
      {bubbles.map((b) => (
        <Html
          key={b.id}
          position={[b.x, b.yOffset, b.z]}
          center
          distanceFactor={10}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`stat-bubble bubble-${b.type}`}>
            {b.text}
          </div>
        </Html>
      ))}
    </group>
  );
}
