import { useStore } from '../../state/store';
import { BUBO_CHARACTERS } from '../../data/characters/characters.config';

// Map Technical ID to clean professional department tag
const DISCORD_META: Record<string, { channel: string; division: string; tag?: string }> = {
  'bubo-manager': { channel: '#general-chat', division: 'Coordinator', tag: 'COORDINATOR' },
  'bubo-n8n': { channel: '#bubo-n8n', division: 'n8n Automation', tag: 'N8N' },
  'bubo-portal': { channel: '#bubo-portal', division: 'Frontend Portal', tag: 'PORTAL' },
  'bubo-backend-portal': { channel: '#bubo-backend-portal', division: 'Backend Portal', tag: 'BACKEND' },
  'bubo-admin-portal': { channel: '#bubo-admin-portal', division: 'Admin Portal', tag: 'ADMIN' },
  'bubo-source-video': { channel: '#bubo-source-video', division: 'Source Video', tag: 'VIDEO' },
  'bubo-pdf': { channel: '#bubo-pdf', division: 'PDF Processing', tag: 'PDF' },
  'bubo-qc-portal': { channel: '#bubo-qc-portal', division: 'QC Portal', tag: 'QC' },
  'bubo-ticketing': { channel: '#bubo-ticketing', division: 'Ticketing Helpdesk', tag: 'TICKETING' },
  'bubo-building': { channel: '#bubo-building', division: 'Building & Infra', tag: 'BUILDING' }
};

export function AgentFocusHUD() {
  const selectedAgentId = useStore((s) => s.selectedAgentId) || 'bubo-manager';
  const selectAgent = useStore((s) => s.selectAgent);
  const agents = useStore((s) => s.agents);

  const currentIndex = BUBO_CHARACTERS.findIndex((c) => c.id === selectedAgentId);
  const activeChar = BUBO_CHARACTERS[currentIndex >= 0 ? currentIndex : 0];
  const activeState = agents[activeChar.id] || { status: 'idle', task: '', activity: 'Siap di meja kerja' };
  const meta = DISCORD_META[activeChar.id] || { emoji: '💼', channel: activeChar.department, division: activeChar.workspace };

  const isWorking = activeState.status === 'working';
  const isManager = activeChar.id === 'bubo-manager';

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + BUBO_CHARACTERS.length) % BUBO_CHARACTERS.length;
    selectAgent(BUBO_CHARACTERS[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % BUBO_CHARACTERS.length;
    selectAgent(BUBO_CHARACTERS[nextIdx].id);
  };

  return (
    <>
      {/* Top Floating Team Bar — Sesuai Desain Referensi Bos Rakha */}
      <div
        style={{
          position: 'absolute',
          top: '56px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          maxWidth: '92%',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <b style={{ fontSize: '13.5px', color: '#f8fafc' }}>Tim SMLONE AI Hub</b>
          <span
            style={{
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              padding: '1px 6px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 700
            }}
          >
            ● online
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', background: '#334155' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
          <span style={{ color: '#94a3b8' }}>CPU: <b style={{ color: '#38bdf8' }}>14%</b></span>
          <span style={{ color: '#94a3b8' }}>RAM: <b style={{ color: '#a78bfa' }}>48%</b></span>
          <span style={{ color: '#94a3b8' }}>Total: <b style={{ color: '#34d399' }}>8 agent</b></span>
        </div>
      </div>

      {/* Left Floating Agent Focus Card */}
      <div
        style={{
          position: 'absolute',
          top: '116px',
          left: '16px',
          zIndex: 6,
          width: '280px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          border: isManager ? '1.5px solid #e0b341' : '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '12px',
          padding: '14px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
          pointerEvents: 'auto'
        }}
      >
        {/* Header: Avatar Silhouette + Name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <b style={{ fontSize: '15px', color: '#f8fafc' }}>{activeChar.displayName}</b>
                {meta.tag && (
                  <span
                    style={{
                      background: activeChar.id === 'bubo-manager' ? '#fbbf24' : '#38bdf8',
                      color: '#0f172a',
                      fontSize: '8.5px',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    {meta.tag}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{activeChar.role}</div>
            </div>
          </div>

          {/* Status: Santai / Bekerja */}
          <span
            style={{
              background: isWorking ? 'rgba(56, 189, 248, 0.15)' : 'rgba(52, 211, 153, 0.12)',
              color: isWorking ? '#38bdf8' : '#34d399',
              border: `1px solid ${isWorking ? '#38bdf844' : '#34d39944'}`,
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: isWorking ? '#38bdf8' : '#34d399'
              }}
            />
            {isWorking ? 'Bekerja' : 'Santai'}
          </span>
        </div>

        {/* Role & Desk details */}
        <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4', margin: '6px 0 10px 0' }}>
          {activeChar.role}
        </div>

        <div style={{ background: '#0b1324', borderRadius: '8px', padding: '8px', border: '1px solid #1e293b', fontSize: '10.5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ color: '#64748b' }}>Workstation:</span>
            <b style={{ color: '#e2e8f0' }}>Lt {activeChar.floor} · {activeChar.workspace}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Real-time:</span>
            <span style={{ color: isWorking ? '#38bdf8' : '#34d399' }}>
              {isWorking ? 'Sedang mengetik di laptop' : 'Duduk santai di kursi'}
            </span>
          </div>
        </div>

        {/* Hint */}
        <div style={{ marginTop: '10px', fontSize: '9.5px', color: '#64748b', textAlign: 'center' }}>
          Drag layar untuk putar kamera 360° ke karakter
        </div>
      </div>

      {/* Bottom Floating Agent Selector Strip */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
          maxWidth: '96%',
          overflowX: 'auto',
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={handlePrev}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 0,
            color: '#f8fafc',
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700
          }}
          title="Agent Sebelumnya"
        >
          ◀
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {BUBO_CHARACTERS.map((c) => {
            const isSel = c.id === activeChar.id;
            const cMeta = DISCORD_META[c.id] || { emoji: '💼', channel: c.department, division: c.workspace };
            const cState = agents[c.id];
            const cWorking = cState?.status === 'working';

            return (
              <button
                key={c.id}
                onClick={() => selectAgent(c.id)}
                style={{
                  background: isSel
                    ? '#38bdf8'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSel ? '#0f172a' : '#cbd5e1',
                  border: isSel
                    ? '1px solid #7dd3fc'
                    : '1px solid rgba(148, 163, 184, 0.15)',
                  borderRadius: '10px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{c.displayName}</span>
                {cMeta.tag && (
                  <span
                    style={{
                      background: isSel ? '#0f172a' : '#e0b341',
                      color: isSel ? '#facc15' : '#0f172a',
                      fontSize: '8px',
                      padding: '1px 3px',
                      borderRadius: '3px',
                      fontWeight: 900
                    }}
                  >
                    {cMeta.tag}
                  </span>
                )}
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: cWorking ? (isSel ? '#0f172a' : '#38bdf8') : (isSel ? '#15803d' : '#34d399')
                  }}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 0,
            color: '#f8fafc',
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700
          }}
          title="Agent Berikutnya"
        >
          ▶
        </button>
      </div>
    </>
  );
}
