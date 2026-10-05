import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../../state/store';
import { BUBO_CHARACTERS } from '../../data/characters/characters.config';
import { AgentConfig } from '../../types';

interface AgentVisualMeta {
  emoji: string;
  tag?: string;
  crown?: boolean;
  hairStyle: string;
  hairColor: string;
  shirtColor: string;
  collarColor: string;
  accentColor: string;
  deskItem: 'coffee' | 'plant' | 'tablet' | 'notes';
}

const VISUAL_METAS: Record<string, AgentVisualMeta> = {
  'bubo-manager': {
    emoji: '👑',
    tag: 'KETUA',
    crown: true,
    hairStyle: 'executive',
    hairColor: '#2b2118',
    shirtColor: '#ea580c',
    collarColor: '#b91c1c',
    accentColor: '#fbbf24',
    deskItem: 'coffee'
  },
  'bubo-admin-portal': {
    emoji: '🛡',
    hairStyle: 'neat',
    hairColor: '#1e293b',
    shirtColor: '#1e3a8a',
    collarColor: '#172554',
    accentColor: '#3b82f6',
    deskItem: 'tablet'
  },
  'bubo-n8n': {
    emoji: '⚡',
    hairStyle: 'spiky',
    hairColor: '#1f2937',
    shirtColor: '#0f766e',
    collarColor: '#134e4a',
    accentColor: '#14b8a6',
    deskItem: 'coffee'
  },
  'bubo-portal': {
    emoji: '🌐',
    hairStyle: 'wavy',
    hairColor: '#451a03',
    shirtColor: '#2563eb',
    collarColor: '#1d4ed8',
    accentColor: '#60a5fa',
    deskItem: 'plant'
  },
  'bubo-backend-portal': {
    emoji: '💻',
    hairStyle: 'short',
    hairColor: '#111827',
    shirtColor: '#312e81',
    collarColor: '#1e1b4b',
    accentColor: '#818cf8',
    deskItem: 'coffee'
  },
  'bubo-qc-portal': {
    emoji: '🔍',
    hairStyle: 'sidepart',
    hairColor: '#334155',
    shirtColor: '#0284c7',
    collarColor: '#0369a1',
    accentColor: '#38bdf8',
    deskItem: 'plant'
  },
  'bubo-ticketing': {
    emoji: '🎫',
    hairStyle: 'messy',
    hairColor: '#78350f',
    shirtColor: '#d97706',
    collarColor: '#b45309',
    accentColor: '#f59e0b',
    deskItem: 'notes'
  },
  'bubo-source-video': {
    emoji: '🎬',
    hairStyle: 'long',
    hairColor: '#3b0764',
    shirtColor: '#7e22ce',
    collarColor: '#581c87',
    accentColor: '#c084fc',
    deskItem: 'coffee'
  },
  'bubo-pdf': {
    emoji: '📄',
    hairStyle: 'clean',
    hairColor: '#1c1917',
    shirtColor: '#15803d',
    collarColor: '#166534',
    accentColor: '#4ade80',
    deskItem: 'notes'
  },
  'bubo-building': {
    emoji: '🏗',
    hairStyle: 'flat',
    hairColor: '#18181b',
    shirtColor: '#0891b2',
    collarColor: '#155e75',
    accentColor: '#06b6d4',
    deskItem: 'coffee'
  }
};

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
  const selectAgent = useStore((s) => s.selectAgent);
  const selectedAgentId = useStore((s) => s.selectedAgentId);
  const openAgent = useStore((s) => s.openAgent);

  const [clockTime, setClockTime] = useState({ hours: 10, minutes: 8, seconds: 0 });

  // Real-time clock update
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
      {/* ─── TOP HEADER BAR (Sesuai Referensi Pengguna) ────────────────────────── */}
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

          {/* Vitals: CPU, RAM, Agent Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8' }}>CPU</span>
              <div
                style={{
                  width: '54px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${cpuPercent}%`,
                    height: '100%',
                    background: cpuPercent > 60 ? '#ef4444' : '#10b981',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <span style={{ color: cpuPercent > 60 ? '#ef4444' : '#f8fafc', fontWeight: 700 }}>
                {cpuPercent}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8' }}>RAM</span>
              <div
                style={{
                  width: '54px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${ramPercent}%`,
                    height: '100%',
                    background: '#14b8a6'
                  }}
                />
              </div>
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>{ramPercent}%</span>
            </div>

            <div style={{ color: '#94a3b8' }}>
              <b style={{ color: '#f8fafc' }}>{totalAgents}</b> agent
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Format 3 Meja per Baris · Scroll ke bawah
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
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: '50%',
                          width: '3px',
                          transform: 'translateX(-50%)',
                          background: '#f8fafc'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: '50%',
                          height: '3px',
                          transform: 'translateY(-50%)',
                          background: '#f8fafc'
                        }}
                      />
                      {/* Cloud */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '8px',
                          width: '28px',
                          height: '10px',
                          background: '#ffffff',
                          borderRadius: '999px',
                          opacity: 0.9
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#38bdf8'
                      }}
                    >
                      {decor.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Kapasitas 3 Meja Kerja · SMLONE Active Fleet
                    </div>
                  </div>
                </div>

                {/* Center Wall Element: Post-It Yellow Sticky Note */}
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

                {/* Right Wall Elements: Analog Clock & Mini Server Rack */}
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
                      {/* Center Pivot */}
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
                  const meta = VISUAL_METAS[c.id] || {
                    emoji: '💼',
                    hairStyle: 'neat',
                    hairColor: '#1e293b',
                    shirtColor: '#2563eb',
                    collarColor: '#1d4ed8',
                    accentColor: '#60a5fa',
                    deskItem: 'coffee'
                  };

                  const isSelected = selectedAgentId === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        selectAgent(c.id);
                        openAgent();
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        filter: isSelected ? 'drop-shadow(0 0 14px rgba(56, 189, 248, 0.45))' : 'none',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      {/* 1. Name Tag Pill (e.g. 👑 Atlas KETUA, ⚡ Niko) */}
                      <div
                        style={{
                          background: meta.crown ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                          border: meta.crown
                            ? '2px solid #fbbf24'
                            : isWorking
                            ? '2px solid #38bdf8'
                            : '1.5px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '999px',
                          padding: '3px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '8px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span style={{ fontSize: '13px' }}>{meta.emoji}</span>
                        <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff' }}>
                          {c.displayName}
                        </span>
                        {meta.tag && (
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
                            {meta.tag}
                          </span>
                        )}
                      </div>

                      {/* 2. Floating Sleep 'z Z' Particles (if Idle) */}
                      {!isWorking && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '25%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            pointerEvents: 'none',
                            animation: 'buboFloatZ 2.2s infinite ease-in-out'
                          }}
                        >
                          <span style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Z</span>
                          <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginLeft: '6px' }}>z</span>
                        </div>
                      )}

                      {/* 3. Character + Chair + Desk Illustration */}
                      <div
                        style={{
                          position: 'relative',
                          width: '170px',
                          height: '136px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
                        {/* Ergonomic Office Chair Backrest */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '48px',
                            width: '60px',
                            height: '72px',
                            background: '#1e293b',
                            borderRadius: '14px 14px 4px 4px',
                            border: '3px solid #0f172a',
                            boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.1)'
                          }}
                        />

                        {/* Character Body (Sitting) */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2,
                            transform: isWorking ? 'none' : 'translateY(1px)'
                          }}
                        >
                          {/* Crown for Leader */}
                          {meta.crown && (
                            <div
                              style={{
                                fontSize: '17px',
                                marginBottom: '-8px',
                                zIndex: 5,
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                              }}
                            >
                              👑
                            </div>
                          )}

                          {/* Hair */}
                          <div
                            style={{
                              width: '40px',
                              height: '17px',
                              background: meta.hairColor,
                              borderRadius: '14px 14px 2px 2px',
                              marginBottom: '-8px',
                              zIndex: 3
                            }}
                          />

                          {/* Head (Lego Yellow Skin #ffcc00) */}
                          <div
                            style={{
                              width: '36px',
                              height: '32px',
                              background: '#ffcc00',
                              borderRadius: '8px',
                              border: '2px solid #eab308',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                              zIndex: 2
                            }}
                          >
                            {/* Face Expressions */}
                            {isWorking ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                <div style={{ display: 'flex', gap: '9px' }}>
                                  <div style={{ width: '4px', height: '5px', background: '#0f172a', borderRadius: '50%' }} />
                                  <div style={{ width: '4px', height: '5px', background: '#0f172a', borderRadius: '50%' }} />
                                </div>
                                <div
                                  style={{
                                    width: '8px',
                                    height: '4px',
                                    borderBottom: '2px solid #0f172a',
                                    borderRadius: '0 0 6px 6px'
                                  }}
                                />
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ display: 'flex', gap: '9px', marginTop: '2px' }}>
                                  <div
                                    style={{
                                      width: '6px',
                                      height: '3px',
                                      borderTop: '2px solid #0f172a',
                                      borderRadius: '4px 4px 0 0'
                                    }}
                                  />
                                  <div
                                    style={{
                                      width: '6px',
                                      height: '3px',
                                      borderTop: '2px solid #0f172a',
                                      borderRadius: '4px 4px 0 0'
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    width: '6px',
                                    height: '3px',
                                    borderBottom: '1.5px solid #0f172a',
                                    borderRadius: '0 0 4px 4px'
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Torso / Clothes */}
                          <div
                            style={{
                              width: '44px',
                              height: '30px',
                              background: meta.shirtColor,
                              borderRadius: '6px 6px 0 0',
                              border: `2px solid ${meta.collarColor}`,
                              position: 'relative',
                              display: 'flex',
                              justifyContent: 'center',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                              marginTop: '-2px',
                              zIndex: 1
                            }}
                          >
                            <div
                              style={{
                                width: '11px',
                                height: '9px',
                                background: meta.collarColor,
                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                              }}
                            />
                          </div>
                        </div>

                        {/* 4. Wooden Desk (Foreground) */}
                        <div
                          style={{
                            position: 'relative',
                            width: '168px',
                            height: '50px',
                            background: 'linear-gradient(180deg, #8b5a36 0%, #6f4426 100%)',
                            borderRadius: '6px 6px 4px 4px',
                            border: '2px solid #4a2b15',
                            boxShadow: '0 10px 22px rgba(0,0,0,0.65)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 10px',
                            zIndex: 4
                          }}
                        >
                          {/* Laptop on Desk */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '-25px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            {/* Laptop Screen */}
                            <div
                              style={{
                                width: '52px',
                                height: '30px',
                                background: isWorking ? '#0284c7' : '#1e293b',
                                border: '2px solid #0f172a',
                                borderRadius: '4px',
                                boxShadow: isWorking
                                  ? '0 0 16px rgba(56, 189, 248, 0.8), inset 0 0 8px rgba(255,255,255,0.4)'
                                  : '0 2px 6px rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <div
                                style={{
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '50%',
                                  background: isWorking ? '#ffffff' : 'rgba(255,255,255,0.2)',
                                  boxShadow: isWorking ? '0 0 6px #ffffff' : 'none'
                                }}
                              />
                            </div>
                            {/* Keyboard Base */}
                            <div
                              style={{
                                width: '60px',
                                height: '5px',
                                background: '#334155',
                                borderRadius: '1px 1px 3px 3px',
                                border: '1px solid #1e293b'
                              }}
                            />
                          </div>

                          {/* Left Desk Drawer */}
                          <div
                            style={{
                              width: '28px',
                              height: '22px',
                              background: '#5c381e',
                              borderRadius: '3px',
                              border: '1px solid #3d2210',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <div style={{ width: '4px', height: '2px', background: '#eab308' }} />
                          </div>

                          {/* Desk Accessory Item */}
                          {meta.deskItem === 'coffee' ? (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transform: 'translateY(-12px)'
                              }}
                              title="Kopi Panas SMLONE"
                            >
                              <div
                                style={{
                                  width: '3px',
                                  height: '5px',
                                  borderLeft: '1.5px solid rgba(255,255,255,0.6)',
                                  borderRadius: '2px',
                                  marginBottom: '2px'
                                }}
                              />
                              <div
                                style={{
                                  width: '13px',
                                  height: '13px',
                                  background: '#f8fafc',
                                  borderRadius: '2px 2px 4px 4px',
                                  border: '1px solid #cbd5e1',
                                  position: 'relative'
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    right: '-4px',
                                    top: '2px',
                                    width: '3.5px',
                                    height: '7px',
                                    border: '1.5px solid #f8fafc',
                                    borderRadius: '0 3px 3px 0'
                                  }}
                                />
                              </div>
                            </div>
                          ) : meta.deskItem === 'plant' ? (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transform: 'translateY(-9px)'
                              }}
                              title="Tanaman Meja"
                            >
                              <div style={{ fontSize: '11px' }}>🌱</div>
                              <div
                                style={{
                                  width: '11px',
                                  height: '7px',
                                  background: '#78350f',
                                  borderRadius: '1px 1px 3px 3px'
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                width: '15px',
                                height: '11px',
                                background: '#e2e8f0',
                                transform: 'translateY(-7px) rotate(-6deg)',
                                borderRadius: '1px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                              }}
                              title="Dokumen Kerja"
                            />
                          )}
                        </div>
                      </div>

                      {/* 5. Role & Status Footer (Sesuai Referensi Pengguna) */}
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
                        {/* Role Title */}
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

                        {/* Status Indicator */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '10.5px',
                            fontWeight: 600,
                            color: isWorking ? '#38bdf8' : '#94a3b8'
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: isWorking ? '#38bdf8' : '#64748b',
                              boxShadow: isWorking ? '0 0 6px #38bdf8' : 'none'
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

      {/* Global CSS for floating Z animation */}
      <style>{`
        @keyframes buboFloatZ {
          0% { transform: translateY(0px) scale(0.9); opacity: 0; }
          40% { opacity: 0.85; }
          80% { transform: translateY(-14px) scale(1.15); opacity: 0.5; }
          100% { transform: translateY(-22px) scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
