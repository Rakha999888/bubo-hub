import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../../state/store';
import { BUBO_CHARACTERS } from '../../data/characters/characters.config';
import { AgentConfig } from '../../types';
import { Agent3DPortrait } from './Agent3DPortrait';

// Wall decor presets for each room row (3 desks per row)
const ROW_DECOR = [
  {
    title: 'Ruang 1 · Eksekutif & Otomasi',
    noteText: '☕ KOPI DULU BARU PROMPT',
    noteIcon: '☕',
    noteRotate: '-2deg',
    showWindow: true,
    showClock: true,
    showServer: true
  },
  {
    title: 'Ruang 2 · Rekayasa Web & Quality Control',
    noteText: '🤖 KERJA 24/7 TANPA NGELUH',
    noteIcon: '🤖',
    noteRotate: '2.5deg',
    showWindow: false,
    showClock: true,
    showServer: true
  },
  {
    title: 'Ruang 3 · Operasional Tiket & Media Kreatif',
    noteText: '⚡ CUAN BERSAMA SMLONE',
    noteIcon: '🔥',
    noteRotate: '-1.5deg',
    showWindow: true,
    showClock: false,
    showServer: true
  },
  {
    title: 'Ruang 4 · Infrastruktur & DevOps Hub',
    noteText: '🏗 SISTEM AMAN DAN SOLID',
    noteIcon: '🛡',
    noteRotate: '2deg',
    showWindow: false,
    showClock: true,
    showServer: true
  }
];

export function PixelOfficeRoom() {
  const agents = useStore((s) => s.agents);
  const [modalAgentId, setModalAgentId] = useState<string | null>(null);
  const [clockTime, setClockTime] = useState({ hours: 10, minutes: 8, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClockTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      });
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  // Split characters into chunks of 3 (3 - 3 - 3 - 1)
  const agentRows = useMemo(() => {
    const chunks: AgentConfig[][] = [];
    for (let i = 0; i < BUBO_CHARACTERS.length; i += 3) {
      chunks.push(BUBO_CHARACTERS.slice(i, i + 3));
    }
    return chunks;
  }, []);

  const totalAgents = BUBO_CHARACTERS.length;
  const workingCount = Object.values(agents).filter((a) => a.status === 'working').length;
  const cpuPercent = workingCount > 0 ? Math.min(100, 18 + workingCount * 22) : 8;
  const ramPercent = 52;

  // Active agent selected for modal card
  const activeAgent = useMemo(() => {
    if (!modalAgentId) return null;
    return BUBO_CHARACTERS.find((c) => c.id === modalAgentId) || null;
  }, [modalAgentId]);

  const activeStatus = activeAgent ? agents[activeAgent.id] || { status: 'idle', task: '', activity: 'Siap di meja kerja', recent: [] } : null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '48px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: '#121822',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        userSelect: 'none'
      }}
    >
      {/* ─── RETRO HEADER (CPU, RAM, FLEET STATUS) ────────────────────────── */}
      <div
        style={{
          height: '52px',
          background: 'rgba(18, 24, 34, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 30,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>
              OFFICE SMLONE
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }} />
              online
            </span>
          </div>

          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Metric Bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8' }}>CPU</span>
              <div style={{ width: '54px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: String(cpuPercent) + '%', height: '100%', background: cpuPercent > 60 ? '#ef4444' : '#10b981', transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ color: cpuPercent > 60 ? '#ef4444' : '#f8fafc', fontWeight: 700 }}>{cpuPercent}%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8' }}>RAM</span>
              <div style={{ width: '54px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: String(ramPercent) + '%', height: '100%', background: '#14b8a6' }} />
              </div>
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>{ramPercent}%</span>
            </div>

            <div style={{ color: '#94a3b8' }}>
              <b style={{ color: '#f8fafc' }}>{totalAgents}</b> agent
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Klik meja agent untuk buka Profile Card
        </div>
      </div>

      {/* ─── VERTICAL SCROLLING OFFICE STAGE (3 - 3 - 3 PER ROW) ──────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 16px 60px 16px',
          gap: '36px'
        }}
      >
        {agentRows.map((rowChars, rowIdx) => {
          const decor = ROW_DECOR[rowIdx] || ROW_DECOR[0];

          return (
            <div
              key={rowIdx}
              style={{
                width: '100%',
                maxWidth: '960px',
                flexShrink: 0,
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#1a222e',
                border: '1.5px solid rgba(148, 163, 184, 0.15)',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                position: 'relative'
              }}
            >
              {/* UPPER WALL SECTION OF THIS ROOM ROW */}
              <div
                style={{
                  height: '135px',
                  background: 'linear-gradient(180deg, #1c2330 0%, #222b39 100%)',
                  borderBottom: '12px solid #161c26',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* Wall Panel Grid Lines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage:
                      'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                  }}
                />

                {/* Left Wall Elements: Room Label & Window */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
                  {decor.showWindow && (
                    <div
                      style={{
                        width: '74px',
                        height: '62px',
                        background: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 65%, #0284c7 100%)',
                        border: '4px solid #f8fafc',
                        borderRadius: '6px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '3px', transform: 'translateX(-50%)', background: '#f8fafc' }} />
                      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '3px', transform: 'translateY(-50%)', background: '#f8fafc' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '8px', width: '28px', height: '10px', background: '#ffffff', borderRadius: '999px', opacity: 0.9 }} />
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8' }}>
                      {decor.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Kapasitas 3 Meja Kerja · SMLONE Active Fleet
                    </div>
                  </div>
                </div>

                {/* Center Wall Element: Angled Yellow Post-It Sticky Note */}
                <div
                  style={{
                    background: '#ffd84d',
                    color: '#422006',
                    padding: '8px 14px',
                    borderRadius: '2px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                    transform: `rotate(${decor.noteRotate})`,
                    fontWeight: 800,
                    fontSize: '11px',
                    letterSpacing: '0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderTop: '3px solid #facc15',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{decor.noteIcon}</span>
                  <span>{decor.noteText}</span>
                </div>

                {/* Right Wall Elements: Analog Clock & Server Blade */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
                  {decor.showClock && (
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#f8fafc',
                        border: '4px solid #0f172a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {/* Hour Hand */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '2px',
                          height: '11px',
                          background: '#0f172a',
                          borderRadius: '2px',
                          transformOrigin: 'bottom center',
                          transform: `translateY(-5.5px) rotate(${(clockTime.hours % 12) * 30 + clockTime.minutes * 0.5}deg)`
                        }}
                      />
                      {/* Minute Hand */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '1.5px',
                          height: '14px',
                          background: '#334155',
                          borderRadius: '2px',
                          transformOrigin: 'bottom center',
                          transform: `translateY(-7px) rotate(${clockTime.minutes * 6}deg)`
                        }}
                      />
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', zIndex: 2 }} />
                    </div>
                  )}

                  {decor.showServer && (
                    <div
                      style={{
                        width: '84px',
                        height: '56px',
                        background: '#1e293b',
                        border: '2px solid #0f172a',
                        borderRadius: '5px',
                        padding: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {[0, 1, 2].map((slot) => (
                        <div
                          key={slot}
                          style={{
                            height: '11px',
                            background: '#0f172a',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 4px'
                          }}
                        >
                          <div style={{ width: '12px', height: '2px', background: '#334155', borderRadius: '1px' }} />
                          <div
                            style={{
                              width: '3.5px',
                              height: '3.5px',
                              borderRadius: '50%',
                              background: slot === 1 ? '#38bdf8' : '#10b981',
                              boxShadow: '0 0 5px #10b981'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* LOWER FLOOR SECTION WITH 3 DESKS (Side by Side in 3 Columns) */}
              <div
                style={{
                  background: 'repeating-linear-gradient(90deg, #4d3826 0px, #4d3826 50px, #433020 50px, #433020 100px)',
                  boxShadow: 'inset 0 12px 24px rgba(0,0,0,0.5)',
                  padding: '24px 20px 28px 20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  position: 'relative'
                }}
              >
                {/* Horizontal Wood Floor Plank Lines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 1px, transparent 1px)',
                    backgroundSize: '100% 24px',
                    pointerEvents: 'none'
                  }}
                />

                {rowChars.map((c) => {
                  const st = agents[c.id] || { status: 'idle', task: '', activity: 'Siap di meja kerja' };
                  const isWorking = st.status === 'working';
                  const isSelected = modalAgentId === c.id;
                  const isLeader = c.id === 'bubo-manager';

                  return (
                    <div
                      key={c.id}
                      onClick={() => setModalAgentId(c.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        filter: isSelected ? 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.6))' : 'none',
                        transform: isSelected ? 'scale(1.02)' : 'none',
                        transition: 'transform 0.15s ease, filter 0.15s ease'
                      }}
                    >
                      {/* 1. Name Tag Pill (Header Badge) */}
                      <div
                        style={{
                          background: isLeader ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                          border: isLeader
                            ? '2px solid #fbbf24'
                            : isWorking
                            ? '2px solid #10b981'
                            : '1.5px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '999px',
                          padding: '3px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '8px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                          whiteSpace: 'nowrap',
                          zIndex: 2
                        }}
                      >
                        <span style={{ fontSize: '13px' }}>
                          {isLeader ? '👑' : c.id.includes('admin') ? '🛡' : c.id.includes('n8n') ? '⚡' : c.id.includes('portal') && !c.id.includes('backend') ? '🌐' : c.id.includes('backend') ? '💻' : c.id.includes('qc') ? '🔍' : c.id.includes('ticketing') ? '🎫' : c.id.includes('video') ? '🎬' : c.id.includes('pdf') ? '📄' : '🏗'}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff' }}>
                          {c.displayName}
                        </span>
                        {isLeader && (
                          <span
                            style={{
                              background: '#fbbf24',
                              color: '#0f172a',
                              fontSize: '8.5px',
                              fontWeight: 900,
                              padding: '1px 4px',
                              borderRadius: '4px'
                            }}
                          >
                            KETUA
                          </span>
                        )}
                      </div>

                      {/* 2. REAL 3D WORKSTATION (Exact 3D Three.js Character & Desk from the Office!) */}
                      <div style={{ width: '100%', maxWidth: '240px' }}>
                        <Agent3DPortrait cfg={c} interactive={false} />
                      </div>

                      {/* 3. Desk Label & Status Footers */}
                      <div
                        style={{
                          marginTop: '10px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '3px',
                          width: '100%'
                        }}
                      >
                        {/* Role Description */}
                        <div
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: '#cbd5e1',
                            maxWidth: '190px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {c.role}
                        </div>

                        {/* Status Badge */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '10.5px',
                            fontWeight: 600,
                            color: isWorking ? '#10b981' : '#94a3b8'
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: isWorking ? '#10b981' : '#64748b',
                              boxShadow: isWorking ? '0 0 6px #10b981' : 'none'
                            }}
                          />
                          <span>
                            {isWorking ? 'Bekerja · sedang aktif' : 'Santai · siap bertugas'}
                          </span>
                        </div>

                        {/* Channel Tag */}
                        <div style={{ fontSize: '9.5px', color: '#64748b', fontFamily: 'monospace' }}>
                          {c.department}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── DEDICATED AGENT PROFILE CARD MODAL (Pops up on character click!) ─── */}
      {activeAgent && activeStatus && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10, 15, 24, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setModalAgentId(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              background: '#151d2a',
              borderRadius: '20px',
              border: activeAgent.id === 'bubo-manager'
                ? '2px solid #fbbf24'
                : '1.5px solid rgba(148, 163, 184, 0.3)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>
                  {activeAgent.id === 'bubo-manager' ? '👑' : activeAgent.id.includes('admin') ? '🛡' : activeAgent.id.includes('n8n') ? '⚡' : activeAgent.id.includes('portal') && !activeAgent.id.includes('backend') ? '🌐' : activeAgent.id.includes('backend') ? '💻' : activeAgent.id.includes('qc') ? '🔍' : activeAgent.id.includes('ticketing') ? '🎫' : activeAgent.id.includes('video') ? '🎬' : activeAgent.id.includes('pdf') ? '📄' : '🏗'}
                </span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
                  {activeAgent.displayName}
                </span>
                {activeAgent.id === 'bubo-manager' && (
                  <span
                    style={{
                      background: '#fbbf24',
                      color: '#0f172a',
                      fontSize: '10px',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    KETUA
                  </span>
                )}
              </div>

              <button
                onClick={() => setModalAgentId(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
              >
                ✕
              </button>
            </div>

            {/* 3D Character Workstation Preview in Modal (Interactive 360 preview!) */}
            <div style={{ padding: '16px 20px 8px 20px' }}>
              <div
                style={{
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle at 50% 35%, #2a3444 0%, #151d28 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.6)'
                }}
              >
                <Agent3DPortrait cfg={activeAgent} interactive={true} />
              </div>
            </div>

            {/* Agent Info & Real-Time Status */}
            <div style={{ padding: '14px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Role & Channel */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                  {activeAgent.role}
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {activeAgent.department} · {activeAgent.workspace}
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeStatus.status === 'working' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.12)',
                  border: activeStatus.status === 'working' ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.25)',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  width: 'fit-content'
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: activeStatus.status === 'working' ? '#10b981' : '#94a3b8',
                    boxShadow: activeStatus.status === 'working' ? '0 0 8px #10b981' : 'none'
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 700, color: activeStatus.status === 'working' ? '#10b981' : '#cbd5e1' }}>
                  {activeStatus.status === 'working' ? 'Bekerja · Sedang Aktif' : 'Santai · Siap Bertugas'}
                </span>
              </div>

              {/* Task Details */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '12px'
                }}
              >
                <div style={{ color: '#64748b', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  Aktivitas Saat Ini
                </div>
                <div style={{ color: '#e2e8f0', marginTop: '4px', fontWeight: 500 }}>
                  {activeStatus.activity || 'Siap di meja kerja'}
                </div>

                {activeStatus.task && (
                  <>
                    <div style={{ color: '#64748b', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginTop: '8px' }}>
                      Tugas Berjalan
                    </div>
                    <div style={{ color: '#38bdf8', marginTop: '2px', fontWeight: 600 }}>
                      {activeStatus.task}
                    </div>
                  </>
                )}
              </div>

              {/* Action Close Button */}
              <button
                onClick={() => setModalAgentId(null)}
                style={{
                  marginTop: '4px',
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tutup Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
