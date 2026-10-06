import { useStore } from '../../state/store';
import { AGENTS } from '../../config/agents';

const STATUS_THEME: Record<string, { label: string; color: string; border: string }> = {
  idle: { label: 'STANDBY', color: '#94a3b8', border: '#334155' },
  working: { label: 'WORKING', color: '#38bdf8', border: '#0284c7' },
  thinking: { label: 'THINKING', color: '#a78bfa', border: '#7c3aed' },
  break: { label: 'BREAK', color: '#fbbf24', border: '#d97706' },
  error: { label: 'ERROR', color: '#f87171', border: '#dc2626' },
  success: { label: 'DONE', color: '#34d399', border: '#059669' },
  offline: { label: 'OFFLINE', color: '#64748b', border: '#334155' }
};

export function AgentPanel() {
  const id = useStore((s) => s.selectedAgentId);
  const agentMode = useStore((s) => s.agentMode);
  const st = useStore((s) => (id ? s.agents[id] : null));
  const { selectAgent, openAgent, closeAgentMode } = useStore.getState();
  if (!id || !st) return null;
  const cfg = AGENTS.find((a) => a.id === id)!;
  const theme = STATUS_THEME[st.status] || STATUS_THEME.idle;

  return (
    <aside className={'panel' + (agentMode ? ' wide' : '')} style={{ border: '1px solid #1e293b', background: '#0f172a' }}>
      <button className="x" onClick={() => selectAgent(null)} style={{ color: '#94a3b8' }}>×</button>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1em', fontWeight: 600, color: '#f8fafc' }}>
            {cfg.displayName}
          </h3>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: theme.color,
              padding: '2px 6px',
              borderRadius: '4px',
              background: '#1e293b',
              border: `1px solid ${theme.border}`
            }}
          >
            {theme.label}
          </span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: '#94a3b8', fontSize: '0.85em' }}>
          {cfg.role}
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.8em', color: '#64748b' }}>
          Channel: <span style={{ color: '#38bdf8' }}>{cfg.department}</span>
        </p>
      </div>

      <dl style={{ marginTop: '12px', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
        <dt style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</dt>
        <dd style={{ color: '#e2e8f0', fontSize: '12px' }}>{st.status === 'working' ? 'Bekerja aktif' : 'Standby / Santai'}</dd>

        <dt style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tugas Saat Ini</dt>
        <dd style={{ color: '#cbd5e1', fontSize: '12px' }}>{st.task || 'Menunggu instruksi'}</dd>

        <dt style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Workstation</dt>
        <dd style={{ color: '#94a3b8', fontSize: '12px' }}>
          {cfg.workspace}
        </dd>
      </dl>

    </aside>
  );
}
