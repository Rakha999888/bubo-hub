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
    <form className={`prompt-bar ${selectedId ? 'has-panel' : ''}`} onSubmit={handleSubmit}>
      <div className="prompt-top-row">
        <select
          className="prompt-select"
          value={currentId}
          onChange={(e) => selectAgent(e.target.value)}
        >
          {Object.values(agents).map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <button className="prompt-submit-btn prompt-submit-btn-mobile" type="submit">
          Kirim ↵
        </button>
      </div>
      <input
        className="prompt-input"
        type="text"
        placeholder={`Kirim prompt untuk ${currentAgent?.name || 'Agen'}...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="prompt-submit-btn prompt-submit-btn-desktop" type="submit">
        Kirim Perintah ↵
      </button>
    </form>
  );
}
