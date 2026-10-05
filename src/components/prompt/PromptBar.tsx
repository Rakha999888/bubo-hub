import { useState } from 'react';
import { useStore } from '../../state/store';

export function PromptBar() {
  const id = useStore((s) => s.selectedAgentId); const mode = useStore((s) => s.agentMode);
  const name = useStore((s) => (id ? s.agents[id].name : ''));
  const send = useStore((s) => s.sendPrompt);
  const [text, setText] = useState('');
  if (!id || !mode) return null;
  const submit = () => { if (text.trim()) { send(id, text.trim()); setText(''); } };
  return (
    <div className="prompt">
      <input value={text} placeholder={`Prompt ${name}… e.g. Check why api.smlone.cloud returns 500`} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      <button className="primary" onClick={submit}>Send</button>
    </div>
  );
}
