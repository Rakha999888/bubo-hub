import { useState } from 'react';
import { useStore } from '../../state/store';

export function PromptBar() {
  const id = useStore((s) => s.selectedAgentId);
  const agent = useStore((s) => (id ? s.agents[id] : null));
  const sendPrompt = useStore((s) => s.sendPrompt);
  const [input, setInput] = useState('');

  if (!id || !agent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendPrompt(id, input.trim());
    setInput('');
  };

  return (
    <form
      className="prompt"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '8px 12px',
        borderRadius: '12px',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <input
        type="text"
        placeholder={`Beri tugas/prompt untuk ${agent.name} (akan langsung bekerja di laptop)...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          flex: 1,
          background: 'rgba(2, 6, 23, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#f8fafc',
          fontSize: '12px',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        style={{
          background: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        Tugaskan ↵
      </button>
    </form>
  );
}
