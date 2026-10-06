import { useState } from 'react';
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

export function AgentGridView() {
  const agents = useStore((s) => s.agents);
  const setView = useStore((s) => s.setView);
  const selectAgent = useStore((s) => s.selectAgent);
  const setFloor = useStore((s) => s.setFloor);
  const setCameraLevel = useStore((s) => s.setCameraLevel);

  const [filterFloor, setFilterFloor] = useState<number | 'all'>('all');

  const filtered = BUBO_CHARACTERS.filter((c) => {
    if (filterFloor === 'all') return true;
    return c.floor === filterFloor;
  });

  const handleFocusAgent = (c: typeof BUBO_CHARACTERS[0]) => {
    selectAgent(c.id);
    setFloor(c.floor as any);
    setCameraLevel('floor');
    setView('office');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '48px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: '#090d16',
        overflowY: 'auto',
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header Card — Matches User Reference Layout */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 20px auto',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                Tim AI Hub
              </h2>
              <span
                style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                Aktif
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Divisi Operasional & Rekayasa · 8 Agent Aktif
            </div>
          </div>
        </div>

        {/* Server & Team Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#0b1324', padding: '6px 12px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '12px' }}>
            <span style={{ color: '#64748b' }}>CPU:</span> <b style={{ color: '#38bdf8' }}>14%</b>
          </div>
          <div style={{ background: '#0b1324', padding: '6px 12px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '12px' }}>
            <span style={{ color: '#64748b' }}>RAM:</span> <b style={{ color: '#a78bfa' }}>48%</b>
          </div>
          <div style={{ background: '#0b1324', padding: '6px 12px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '12px' }}>
            <span style={{ color: '#64748b' }}>Total:</span> <b style={{ color: '#34d399' }}>8 Agent</b>
          </div>

          {/* Floor Filters */}
          <div style={{ display: 'flex', background: '#0b1324', padding: '2px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            {(['all', 3, 2, 1] as const).map((fl) => (
              <button
                key={fl}
                onClick={() => setFilterFloor(fl)}
                style={{
                  background: filterFloor === fl ? '#38bdf8' : 'transparent',
                  color: filterFloor === fl ? '#0f172a' : '#94a3b8',
                  border: 0,
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {fl === 'all' ? 'Semua' : `Lt ${fl}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Agents at Workstations */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '16px'
        }}
      >
        {filtered.map((c) => {
          const st = agents[c.id] || { status: 'idle', task: '', activity: 'Siap di meja kerja' };
          const meta = DISCORD_META[c.id] || { emoji: '💼', channel: c.department, division: c.workspace };
          const isWorking = st.status === 'working';
          const isManager = c.id === 'bubo-manager';

          return (
            <div
              key={c.id}
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: isManager
                  ? '1.5px solid rgba(224, 179, 65, 0.6)'
                  : isWorking
                  ? '1.5px solid rgba(56, 189, 248, 0.6)'
                  : '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isManager
                  ? '0 8px 24px rgba(224, 179, 65, 0.1)'
                  : '0 8px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Header: Avatar Silhouette / Desk Icon & Status */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: c.avatar.topColor || '#1e293b',
                        border: `2px solid ${c.avatar.accentColor || '#38bdf8'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#f8fafc'
                      }}
                    >
                      {c.displayName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                          {c.displayName}
                        </span>
                        {meta.tag && (
                          <span
                            style={{
                              background: '#e0b341',
                              color: '#0f172a',
                              fontSize: '9px',
                              fontWeight: 900,
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}
                          >
                            {meta.tag}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>
                        <span style={{ color: '#38bdf8' }}>{meta.channel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge: Santai / Bekerja */}
                  <span
                    style={{
                      background: isWorking ? 'rgba(56, 189, 248, 0.15)' : 'rgba(52, 211, 153, 0.12)',
                      color: isWorking ? '#38bdf8' : '#34d399',
                      border: `1px solid ${isWorking ? '#38bdf844' : '#34d39944'}`,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
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

                {/* Role Description */}
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '10px' }}>
                  {c.role}
                </div>

                {/* Desk & Workstation Info */}
                <div
                  style={{
                    background: '#0a101f',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    border: '1px solid #1e293b',
                    fontSize: '11px',
                    color: '#94a3b8',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Workstation:</span>
                    <b style={{ color: '#e2e8f0' }}>Lt {c.floor} · {c.workspace}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Kondisi:</span>
                    <span style={{ color: isWorking ? '#38bdf8' : '#94a3b8' }}>
                      {isWorking ? 'Sedang mengetik di laptop' : 'Duduk santai di kursi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Fokus Kamera 3D */}
              <button
                onClick={() => handleFocusAgent(c)}
                style={{
                  width: '100%',
                  background: isManager ? 'rgba(224, 179, 65, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                  border: isManager ? '1px solid rgba(224, 179, 65, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                  color: isManager ? '#facc15' : '#38bdf8',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Lihat Meja di Kantor 3D
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
