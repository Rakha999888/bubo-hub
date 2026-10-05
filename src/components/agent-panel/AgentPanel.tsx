import { useStore } from '../../state/store';
import { AGENTS } from '../../config/agents';
import { STATUS_COLOR } from '../../3d/characters/AgentActor';

export function AgentPanel() {
  const id = useStore((s) => s.selectedAgentId);
  const agentMode = useStore((s) => s.agentMode);
  const st = useStore((s) => (id ? s.agents[id] : null));
  const { selectAgent, openAgent, closeAgentMode } = useStore.getState();
  if (!id || !st) return null;
  const cfg = AGENTS.find((a) => a.id === id)!;

  return (
    <aside className={'panel' + (agentMode ? ' wide' : '')}>
      <button className="x" onClick={() => selectAgent(null)}>×</button>

      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 2px 0', fontSize: '1.4em', letterSpacing: '0.02em' }}>{cfg.displayName}</h3>
        <p className="muted" style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>
          {cfg.role.toUpperCase()}
        </p>
        <p className="muted" style={{ margin: '2px 0 0 0', fontSize: '0.85em' }}>
          Department: <strong style={{ color: '#e2e8f0' }}>{cfg.department}</strong>
        </p>
      </div>

      <p style={{ color: STATUS_COLOR[st.status], fontWeight: 700, margin: '8px 0' }}>
        ● {st.status.toUpperCase()}
      </p>

      {cfg.personality && cfg.personality.length > 0 && (
        <div style={{ margin: '10px 0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {cfg.personality.map((p, idx) => (
            <span
              key={idx}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.78em',
                fontWeight: 500
              }}
            >
              • {p}
            </span>
          ))}
        </div>
      )}

      <dl style={{ marginTop: '12px' }}>
        <dt>Current Task</dt>
        <dd>{st.task}</dd>

        <dt>Activity</dt>
        <dd>{st.activity}</dd>

        <dt>Progress</dt>
        <dd>
          <div className="bar">
            <div style={{ width: st.progress + '%' }} />
          </div>{' '}
          {st.progress}%
        </dd>

        <dt>Location / Workspace</dt>
        <dd>
          Floor {cfg.floor} · {cfg.workspace}
        </dd>

        <dt>Technical Agent ID</dt>
        <dd style={{ fontFamily: 'monospace', opacity: 0.8 }}>{cfg.id}</dd>

        <dt>Current Tool</dt>
        <dd>{st.tool}</dd>

        <dt>Recent Activity</dt>
        <dd>
          {st.recent.length ? (
            st.recent.map((r, i) => <div key={i}>• {r}</div>)
          ) : (
            <span className="muted">No activity yet</span>
          )}
        </dd>
      </dl>

      {!agentMode && (
        <button className="primary" onClick={openAgent} style={{ marginTop: '12px', width: '100%' }}>
          Open Agent View
        </button>
      )}

      {agentMode && (
        <>
          <h4>Agent Console Logs</h4>
          <pre className="log">{st.log.length ? st.log.join('\n') : 'No logs yet'}</pre>
          <button onClick={closeAgentMode} style={{ marginTop: '8px', width: '100%' }}>
            Close Agent Mode
          </button>
        </>
      )}
    </aside>
  );
}
