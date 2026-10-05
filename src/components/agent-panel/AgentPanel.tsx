import { useStore } from '../../state/store';
import { AGENTS } from '../../config/agents';
import { STATUS_COLOR } from '../../3d/characters/AgentActor';

export function AgentPanel() {
  const id = useStore((s) => s.selectedAgentId); const agentMode = useStore((s) => s.agentMode);
  const st = useStore((s) => (id ? s.agents[id] : null));
  const { selectAgent, openAgent, closeAgentMode } = useStore.getState();
  if (!id || !st) return null;
  const cfg = AGENTS.find((a) => a.id === id)!;
  return (
    <aside className={'panel' + (agentMode ? ' wide' : '')}>
      <button className="x" onClick={() => selectAgent(null)}>×</button>
      <h3>{st.name}</h3>
      <p className="muted">{cfg.role}{cfg.website ? ` · ${cfg.website}` : ''}</p>
      <p style={{ color: STATUS_COLOR[st.status] }}>● {st.status.toUpperCase()}</p>
      <dl>
        <dt>Current Task</dt><dd>{st.task}</dd>
        <dt>Activity</dt><dd>{st.activity}</dd>
        <dt>Progress</dt><dd><div className="bar"><div style={{ width: st.progress + '%' }} /></div> {st.progress}%</dd>
        <dt>Current Tool</dt><dd>{st.tool}</dd>
        <dt>Recent Activity</dt>
        <dd>{st.recent.length ? st.recent.map((r, i) => <div key={i}>• {r}</div>) : <span className="muted">No activity yet</span>}</dd>
      </dl>
      {!agentMode && <button className="primary" onClick={openAgent}>Open Agent</button>}
      {agentMode && (<>
        <h4>Logs</h4>
        <pre className="log">{st.log.length ? st.log.join('\n') : 'No logs yet'}</pre>
        <button onClick={closeAgentMode}>Close Agent Mode</button>
      </>)}
    </aside>
  );
}
