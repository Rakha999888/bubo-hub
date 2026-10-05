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

export function PixelOfficeRoom() {
  const agents = useStore((s) => s.agents);
  const selectAgent = useStore((s) => s.selectAgent);
  const selectedAgentId = useStore((s) => s.selectedAgentId);
  const openAgent = useStore((s) => s.openAgent);

  const [activeFloor, setActiveFloor] = useState<number | 'all'>('all');
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

  const filteredCharacters = useMemo(() => {
    if (activeFloor === 'all') return BUBO_CHARACTERS;
    return BUBO_CHARACTERS.filter((c) => c.floor === activeFloor);
  }, [activeFloor]);

  // Overall counts
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
        background: '#161d27',
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
          background: 'rgba(22, 29, 39, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 20
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

        {/* Room / Floor Filter Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['all', 3, 2, 1] as const).map((fl) => (
            <button
              key={fl}
              onClick={() => setActiveFloor(fl)}
              style={{
                background: activeFloor === fl ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                color: activeFloor === fl ? '#0f172a' : '#94a3b8',
                border: activeFloor === fl ? '1px solid #7dd3fc' : '1px solid rgba(255,255,255,0.1)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {fl === 'all' ? 'Semua Ruang' : `Lantai ${fl}`}
            </button>
          ))}
        </div>
      </div>

      {/* ─── VIRTUAL OFFICE MAIN STAGE (WALL + FLOOR + DESKS) ──────────────────── */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'auto',
          overflowY: 'hidden'
        }}
      >
        {/* UPPER WALL (Dark Slate Blue #232b38) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '56%',
            minWidth: `${Math.max(1100, filteredCharacters.length * 280 + 120)}px`,
            background: 'linear-gradient(180deg, #1c2330 0%, #222b39 100%)',
            borderBottom: '14px solid #161c26',
            boxShadow: 'inset 0 -12px 24px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Wall Grid Panels */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.12,
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}
          />

          {/* 1. Office Window on Wall */}
          <div
            style={{
              position: 'absolute',
              top: '28px',
              left: '60px',
              width: '130px',
              height: '95px',
              background: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 65%, #0284c7 100%)',
              border: '6px solid #f8fafc',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.4)',
              overflow: 'hidden'
            }}
          >
            {/* Window Glass Pane Frames */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '4px',
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
                height: '4px',
                transform: 'translateY(-50%)',
                background: '#f8fafc'
              }}
            />
            {/* Fluffy Clouds */}
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '12px',
                width: '40px',
                height: '14px',
                background: '#ffffff',
                borderRadius: '999px',
                opacity: 0.9,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '36px',
                right: '10px',
                width: '50px',
                height: '16px',
                background: '#ffffff',
                borderRadius: '999px',
                opacity: 0.9
              }}
            />
          </div>

          {/* 2. Analog Wall Clock */}
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '230px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#f8fafc',
              border: '5px solid #0f172a',
              boxShadow: '0 6px 16px rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Clock Ticks */}
            <div style={{ position: 'absolute', top: '2px', width: '2px', height: '4px', background: '#0f172a' }} />
            <div style={{ position: 'absolute', bottom: '2px', width: '2px', height: '4px', background: '#0f172a' }} />
            <div style={{ position: 'absolute', left: '2px', width: '4px', height: '2px', background: '#0f172a' }} />
            <div style={{ position: 'absolute', right: '2px', width: '4px', height: '2px', background: '#0f172a' }} />

            {/* Hour Hand */}
            <div
              style={{
                position: 'absolute',
                width: '3px',
                height: '14px',
                background: '#0f172a',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                transform: `translateY(-7px) rotate(${(clockTime.hours % 12) * 30 + clockTime.minutes * 0.5}deg)`
              }}
            />
            {/* Minute Hand */}
            <div
              style={{
                position: 'absolute',
                width: '2px',
                height: '19px',
                background: '#334155',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                transform: `translateY(-9px) rotate(${clockTime.minutes * 6}deg)`
              }}
            />
            {/* Center Pivot */}
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', zIndex: 2 }} />
          </div>

          {/* 3. Yellow Sticky Notes (Sesuai Referensi Gambar) */}
          <div
            style={{
              position: 'absolute',
              top: '26px',
              left: '320px',
              background: '#ffd84d',
              color: '#422006',
              padding: '10px 14px',
              borderRadius: '2px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
              transform: 'rotate(-2deg)',
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.02em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              borderTop: '3px solid #facc15'
            }}
          >
            <div style={{ fontSize: '14px' }}>☕</div>
            <div>KOPI DULU BARU PROMPT</div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '520px',
              background: '#ffd84d',
              color: '#422006',
              padding: '10px 14px',
              borderRadius: '2px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
              transform: 'rotate(2.5deg)',
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.02em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              borderTop: '3px solid #facc15'
            }}
          >
            <div style={{ fontSize: '14px' }}>🤖</div>
            <div>KERJA 24/7 TANPA NGELUH</div>
          </div>

          {/* 4. Server Blade Rack on Wall (Right Side) */}
          <div
            style={{
              position: 'absolute',
              top: '22px',
              right: '60px',
              width: '130px',
              height: '88px',
              background: '#1e293b',
              border: '3px solid #0f172a',
              borderRadius: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6px'
            }}
          >
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                style={{
                  height: '14px',
                  background: '#0f172a',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 6px'
                }}
              >
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: '12px', height: '3px', background: '#334155', borderRadius: '1px' }} />
                  <div style={{ width: '12px', height: '3px', background: '#334155', borderRadius: '1px' }} />
                </div>
                {/* Blinking LEDs */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: slot % 2 === 0 ? '#10b981' : '#38bdf8',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOWER FLOOR (Warm Wood Checkerboard / Parquet #523e2b / #443322) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '47%',
            minWidth: `${Math.max(1100, filteredCharacters.length * 280 + 120)}px`,
            background: 'repeating-linear-gradient(90deg, #4d3826 0px, #4d3826 60px, #433020 60px, #433020 120px)',
            boxShadow: 'inset 0 16px 32px rgba(0,0,0,0.6)'
          }}
        >
          {/* Subtle Horizontal Wood Floor Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)',
              backgroundSize: '100% 28px'
            }}
          />
        </div>

        {/* ─── DESKS & CHARACTERS CONTAINER (Scrollable Horizontal Row) ───────── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            gap: '32px',
            padding: '0 60px 42px 60px',
            minHeight: '100%',
            minWidth: `${Math.max(1100, filteredCharacters.length * 280 + 120)}px`
          }}
        >
          {filteredCharacters.map((c) => {
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
                  width: '230px',
                  cursor: 'pointer',
                  position: 'relative',
                  filter: isSelected ? 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.45))' : 'none',
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
                    padding: '4px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{meta.emoji}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                    {c.displayName}
                  </span>
                  {meta.tag && (
                    <span
                      style={{
                        background: '#fbbf24',
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

                {/* 2. Floating Sleep 'z Z' Particles (if Idle) */}
                {!isWorking && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '30px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      animation: 'buboFloatZ 2.2s infinite ease-in-out'
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Z</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginLeft: '8px' }}>z</span>
                  </div>
                )}

                {/* 3. Character + Chair + Desk Illustration */}
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}
                >
                  {/* Ergonomic Office Chair Backrest (Behind Character) */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '50px',
                      width: '64px',
                      height: '76px',
                      background: '#1e293b',
                      borderRadius: '16px 16px 4px 4px',
                      border: '3px solid #0f172a',
                      boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.1)'
                    }}
                  />

                  {/* Character Body (Sitting) */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '42px',
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
                          fontSize: '18px',
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
                        width: '42px',
                        height: '18px',
                        background: meta.hairColor,
                        borderRadius: '14px 14px 2px 2px',
                        marginBottom: '-8px',
                        zIndex: 3
                      }}
                    />

                    {/* Head (Lego Yellow Skin #ffcc00) */}
                    <div
                      style={{
                        width: '38px',
                        height: '34px',
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
                        // Focused Active Face: Eyes open, smile
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
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
                        // Sleeping / Relaxed Face: Curved sleepy eyes ^_^
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
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
                        width: '46px',
                        height: '32px',
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
                      {/* Collar / Tie */}
                      <div
                        style={{
                          width: '12px',
                          height: '10px',
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
                      width: '180px',
                      height: '52px',
                      background: 'linear-gradient(180deg, #8b5a36 0%, #6f4426 100%)',
                      borderRadius: '6px 6px 4px 4px',
                      border: '2px solid #4a2b15',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 12px',
                      zIndex: 4
                    }}
                  >
                    {/* Laptop on Desk */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-26px',
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
                          width: '54px',
                          height: '32px',
                          background: isWorking ? '#0284c7' : '#1e293b',
                          border: '2.5px solid #0f172a',
                          borderRadius: '4px',
                          boxShadow: isWorking
                            ? '0 0 16px rgba(56, 189, 248, 0.8), inset 0 0 8px rgba(255,255,255,0.4)'
                            : '0 2px 6px rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {/* Apple / Terminal Glow Logo */}
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: isWorking ? '#ffffff' : 'rgba(255,255,255,0.2)',
                            boxShadow: isWorking ? '0 0 6px #ffffff' : 'none'
                          }}
                        />
                      </div>
                      {/* Laptop Base Keyboard */}
                      <div
                        style={{
                          width: '62px',
                          height: '5px',
                          background: '#334155',
                          borderRadius: '1px 1px 3px 3px',
                          border: '1px solid #1e293b'
                        }}
                      />
                    </div>

                    {/* Left Desk Drawer Keyhole */}
                    <div
                      style={{
                        width: '32px',
                        height: '24px',
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

                    {/* Desk Accessory Item (Coffee Mug or Mini Succulent) */}
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
                        {/* Steam Animation */}
                        <div
                          style={{
                            width: '4px',
                            height: '6px',
                            borderLeft: '1.5px solid rgba(255,255,255,0.6)',
                            borderRadius: '2px',
                            marginBottom: '2px'
                          }}
                        />
                        {/* Mug */}
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            background: '#f8fafc',
                            borderRadius: '2px 2px 4px 4px',
                            border: '1px solid #cbd5e1',
                            position: 'relative'
                          }}
                        >
                          {/* Handle */}
                          <div
                            style={{
                              position: 'absolute',
                              right: '-4px',
                              top: '2px',
                              width: '4px',
                              height: '8px',
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
                          transform: 'translateY(-10px)'
                        }}
                        title="Tanaman Meja"
                      >
                        <div style={{ fontSize: '12px' }}>🌱</div>
                        <div
                          style={{
                            width: '12px',
                            height: '8px',
                            background: '#78350f',
                            borderRadius: '1px 1px 3px 3px'
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '16px',
                          height: '12px',
                          background: '#e2e8f0',
                          transform: 'translateY(-8px) rotate(-6deg)',
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
                    marginTop: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    width: '100%'
                  }}
                >
                  {/* Role Title */}
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#cbd5e1',
                      maxWidth: '210px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {c.role}
                  </div>

                  {/* Status Indicator (Santai · 1 jam lalu / Bekerja · sedang coding) */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: isWorking ? '#38bdf8' : '#94a3b8'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isWorking ? '#38bdf8' : '#64748b',
                        boxShadow: isWorking ? '0 0 8px #38bdf8' : 'none'
                      }}
                    />
                    <span>
                      {isWorking ? 'Bekerja · sedang aktif' : 'Santai · siap bertugas'}
                    </span>
                  </div>

                  {/* Channel Tag */}
                  <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                    {c.department}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global CSS for floating Z animation */}
      <style>{`
        @keyframes buboFloatZ {
          0% { transform: translateY(0px) scale(0.9); opacity: 0; }
          40% { opacity: 0.85; }
          80% { transform: translateY(-16px) scale(1.15); opacity: 0.5; }
          100% { transform: translateY(-24px) scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
