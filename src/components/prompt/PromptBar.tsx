import { useState } from 'react';
import { useStore } from '../../state/store';

export function PromptBar() {
  const id = useStore((s) => s.selectedAgentId);
  const mode = useStore((s) => s.agentMode);
  const agent = useStore((s) => (id ? s.agents[id] : null));

  if (!id || !mode || !agent) return null;

  return (
    <div className="prompt" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.92)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9em' }}>
        <span style={{ fontSize: '1.2em' }}>💬</span>
        <span>Kirim instruksi untuk <strong>{agent.name}</strong> langsung melalui Discord di channel:</span>
        <span style={{ background: '#1e293b', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
          {agent.department || '#PEKERJAAN'}
        </span>
      </div>
    </div>
  );
}
