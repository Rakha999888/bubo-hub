import { useState } from 'react';
import { useStore } from '../../state/store';

export function PromptBar() {
  const selectedId = useStore((s) => s.selectedAgentId);
  const selectAgent = useStore((s) => s.selectAgent);
  const agents = useStore((s) => s.agents);
  const sendPrompt = useStore((s) => s.sendPrompt);
  const [input, setInput] = useState('');

  const currentId = selectedId || 'bubo-manager';
  const currentAgent = agents[currentId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentAgent) return;
    sendPrompt(currentId, input.trim());
    setInput('');
  };

  return (
    <form className="prompt" onSubmit={handleSubmit}>
      <select
        value={currentId}
        onChange={(e) => selectAgent(e.target.value)}
        style={{
          background: '#0a1222',
          color: '#38bdf8',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          padding: '8px 10px',
          fontSize: '12px',
          fontWeight: 600,
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        {Object.values(agents).map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder={`Kirim prompt tugas untuk ${currentAgent?.name || 'Agen'}...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        style={{
          background: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        Kirim Perintah ↵
      </button>
    </form>
  );
}
