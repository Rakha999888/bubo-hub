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
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.35em', letterSpacing: '0.01em', color: '#f8fafc' }}>
          {cfg.displayName}
        </h3>
        <p style={{ margin: 0, fontWeight: 700, color: '#38bdf8', fontSize: '0.9em' }}>
          {cfg.role}
        </p>
        <p className="muted" style={{ margin: '4px 0 0 0', fontSize: '0.85em' }}>
          Divisi: <strong style={{ color: '#e2e8f0' }}>{cfg.department}</strong>
        </p>
      </div>

      <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            color: STATUS_COLOR[st.status] || '#38bdf8',
            fontWeight: 800,
            fontSize: '0.85em',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '3px 10px',
            borderRadius: '999px',
            border: `1px solid ${STATUS_COLOR[st.status] || '#38bdf8'}55`
          }}
        >
          ● {st.status === 'idle' ? 'SEATED (STANDBY)' : st.status.toUpperCase()}
        </span>
      </div>

      {cfg.personality && cfg.personality.length > 0 && (
        <div style={{ margin: '10px 0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {cfg.personality.map((p, idx) => (
            <span
              key={idx}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '0.76em',
                fontWeight: 600
              }}
            >
              #{p}
            </span>
          ))}
        </div>
      )}

      <dl style={{ marginTop: '12px' }}>
        <dt>Status Meja Kerja</dt>
        <dd style={{ color: '#10b981', fontWeight: 600 }}>Duduk di Kursi Kantor (Workstation)</dd>

        <dt>Tugas Saat Ini</dt>
        <dd>{st.task || 'Menunggu instruksi dari Discord'}</dd>

        <dt>Aktivitas Real-Time</dt>
        <dd>{st.activity || 'Siap bertugas'}</dd>

        <dt>Progres Eksekusi</dt>
        <dd>
          <div className="bar">
            <div style={{ width: st.progress + '%' }} />
          </div>{' '}
          {st.progress}%
        </dd>

        <dt>Lokasi Kantor</dt>
        <dd>
          Lantai {cfg.floor} · {cfg.workspace}
        </dd>

        <dt>Technical ID</dt>
        <dd style={{ fontFamily: 'monospace', opacity: 0.85, color: '#94a3b8' }}>{cfg.id}</dd>

        {st.recent.length > 0 && (
          <>
            <dt>Log Aktivitas Terkini</dt>
            <dd>
              {st.recent.map((r, i) => (
                <div key={i} style={{ fontSize: '0.85em', margin: '2px 0' }}>• {r}</div>
              ))}
            </dd>
          </>
        )}
      </dl>

      {!agentMode && (
        <button className="primary" onClick={openAgent} style={{ marginTop: '14px', width: '100%' }}>
          Buka Terminal & Detail Agen
        </button>
      )}

      {agentMode && (
        <>
          <h4 style={{ margin: '14px 0 6px 0', fontSize: '0.9em' }}>Terminal Live Stream</h4>
          <pre className="log">{st.log.length ? st.log.join('\n') : 'Menunggu stream log dari server...'}</pre>
          <button onClick={closeAgentMode} style={{ marginTop: '8px', width: '100%' }}>
            Tutup Mode Detail
          </button>
        </>
      )}
    </aside>
  );
}
