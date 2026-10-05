import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../../state/store';
import { BUBO_CHARACTERS } from '../../data/characters/characters.config';
import { AgentConfig } from '../../types';

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
  const selectAgent = useStore((s) => s.selectAgent);
  const selectedAgentId = useStore((s) => s.selectedAgentId);
  const openAgent = useStore((s) => s.openAgent);

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
          Format 3 Meja per Baris · Karakter SMLONE
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
                  const isSelected = selectedAgentId === c.id;

                  // EXACT character avatar data matching 3D office BuboCharacter!
                  const skin = c.avatar.skinColor || '#f7d5a3';
                  const hair = c.avatar.hairColor || '#2b2118';
                  const top = c.avatar.topColor || '#0e2439';
                  const accent = c.avatar.accentColor || '#38bdf8';
                  const isLeader = c.id === 'bubo-manager';
                  const hasHeadphones = (c.avatar.props || []).includes('headphones');
                  const hasHeadset = (c.avatar.props || []).includes('headset');
                  const hasGlasses = c.id === 'bubo-backend-portal' || c.id === 'bubo-pdf';

                  // Screen color matching Workstation in BuboBuilding.tsx
                  const screenColor = isWorking ? '#10b981' : '#38bdf8';

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
                      {/* 1. Name Tag Pill (Exact office badge style) */}
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
                          whiteSpace: 'nowrap'
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

                      {/* 3. Workstation: SMLONE Office Character + Ergonomic Chair + Modern Desk */}
                      <div
                        style={{
                          position: 'relative',
                          width: '180px',
                          height: '142px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
                        {/* Navy Ergonomic Office Chair (Exact from BuboBuilding.tsx Workstation) */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '50px',
                            width: '64px',
                            height: '76px',
                            background: 'linear-gradient(180deg, #1b2838 0%, #101c33 100%)',
                            borderRadius: '16px 16px 4px 4px',
                            border: '3px solid #0b1426',
                            boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.12), 0 8px 16px rgba(0,0,0,0.5)'
                          }}
                        >
                          {/* Contoured Headrest */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '38px',
                              height: '12px',
                              background: '#1b2838',
                              border: '2.5px solid #0b1426',
                              borderRadius: '6px'
                            }}
                          />
                        </div>

                        {/* Character Body (Sitting, Exact 3D Office Model Proportions) */}
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
                          {/* Hair (Exact style from c.avatar.hair) */}
                          <div
                            style={{
                              width: c.avatar.hair === 'creative-long' ? '46px' : '42px',
                              height: c.avatar.hair === 'creative-long' ? '24px' : '18px',
                              background: hair,
                              borderRadius: c.avatar.hair === 'creative-wavy' ? '18px 18px 8px 8px' : '14px 14px 2px 2px',
                              marginBottom: '-8px',
                              zIndex: 4,
                              position: 'relative',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.4)'
                            }}
                          >
                            {/* Hair highlight */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '2px',
                                left: '10px',
                                width: '16px',
                                height: '3px',
                                background: 'rgba(255,255,255,0.22)',
                                borderRadius: '999px'
                              }}
                            />
                          </div>

                          {/* Head (Natural Human Skin Tone from c.avatar.skinColor) */}
                          <div
                            style={{
                              width: '38px',
                              height: '34px',
                              background: skin,
                              borderRadius: '10px',
                              border: '1.5px solid rgba(0,0,0,0.18)',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                              zIndex: 3
                            }}
                          >
                            {/* Eyebrows */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '2px' }}>
                              <div style={{ width: '6px', height: '2px', background: hair, borderRadius: '1px' }} />
                              <div style={{ width: '6px', height: '2px', background: hair, borderRadius: '1px' }} />
                            </div>

                            {/* Eyes (Realistic Human Eyes with Highlights) */}
                            {isWorking ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <div style={{ width: '5px', height: '6px', background: '#0f172a', borderRadius: '50%', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '1px', left: '1px', width: '2px', height: '2px', background: '#ffffff', borderRadius: '50%' }} />
                                  </div>
                                  <div style={{ width: '5px', height: '6px', background: '#0f172a', borderRadius: '50%', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '1px', left: '1px', width: '2px', height: '2px', background: '#ffffff', borderRadius: '50%' }} />
                                  </div>
                                </div>
                                <div style={{ width: '8px', height: '3px', borderBottom: '1.5px solid #78350f', borderRadius: '0 0 6px 6px' }} />
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '1px' }}>
                                  <div style={{ width: '6px', height: '3px', borderTop: '2px solid #522b14', borderRadius: '4px 4px 0 0' }} />
                                  <div style={{ width: '6px', height: '3px', borderTop: '2px solid #522b14', borderRadius: '4px 4px 0 0' }} />
                                </div>
                                <div style={{ width: '6px', height: '2.5px', borderBottom: '1.5px solid #78350f', borderRadius: '0 0 4px 4px' }} />
                              </div>
                            )}

                            {/* Glasses (if Darren or Milo) */}
                            {hasGlasses && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '11px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                <div style={{ width: '9px', height: '9px', border: '1.5px solid #0f172a', borderRadius: '50%' }} />
                                <div style={{ width: '4px', height: '1.5px', background: '#0f172a' }} />
                                <div style={{ width: '9px', height: '9px', border: '1.5px solid #0f172a', borderRadius: '50%' }} />
                              </div>
                            )}

                            {/* Headphones (if Luna, Niko, Kiro) */}
                            {hasHeadphones && (
                              <>
                                <div style={{ position: 'absolute', left: '-5px', width: '6px', height: '14px', background: '#ffffff', borderRadius: '3px', border: '1.5px solid #0f172a' }} />
                                <div style={{ position: 'absolute', right: '-5px', width: '6px', height: '14px', background: '#ffffff', borderRadius: '3px', border: '1.5px solid #0f172a' }} />
                              </>
                            )}

                            {/* Operator Headset (if Theo) */}
                            {hasHeadset && (
                              <div style={{ position: 'absolute', right: '-4px', width: '6px', height: '12px', background: '#1e293b', borderRadius: '2px' }}>
                                <div style={{ position: 'absolute', bottom: '2px', right: '4px', width: '12px', height: '2px', background: '#1e293b', transform: 'rotate(25deg)' }} />
                              </div>
                            )}
                          </div>

                          {/* Torso & Human Outfit (Exact topColor from c.avatar.topColor) */}
                          <div
                            style={{
                              width: '46px',
                              height: '32px',
                              background: top,
                              borderRadius: '7px 7px 0 0',
                              border: '1.5px solid rgba(0,0,0,0.3)',
                              position: 'relative',
                              display: 'flex',
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
                              marginTop: '-2px',
                              zIndex: 2
                            }}
                          >
                            {/* Shirt Collar / Tie / Accent */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: '12px', height: '6px', background: '#ffffff', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                              {isLeader ? (
                                <div style={{ width: '5px', height: '14px', background: '#ea580c', clipPath: 'polygon(0 0, 100% 0, 70% 100%, 30% 100%)' }} />
                              ) : (
                                <div style={{ width: '4px', height: '12px', background: accent }} />
                              )}
                            </div>

                            {/* Gold Badge on Chest (if Leader or Admin) */}
                            {isLeader && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '6px',
                                  left: '6px',
                                  width: '5px',
                                  height: '7px',
                                  background: '#fbbf24',
                                  borderRadius: '1px',
                                  boxShadow: '0 0 4px #fbbf24'
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Modern SMLONE Workstation Desk (Matching Workstation in BuboBuilding.tsx) */}
                        <div
                          style={{
                            position: 'relative',
                            width: '176px',
                            height: '52px',
                            background: 'linear-gradient(180deg, #784c28 0%, #5a361a 100%)',
                            borderRadius: '6px 6px 4px 4px',
                            border: '2px solid #3d2210',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.65)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 10px',
                            zIndex: 4
                          }}
                        >
                          {/* Slim-Bezel Workstation PC Monitor (Centered) */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '-28px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            {/* Monitor Screen Frame */}
                            <div
                              style={{
                                width: '58px',
                                height: '34px',
                                background: '#1a1d25',
                                border: '2px solid #0b1426',
                                borderRadius: '4px',
                                boxShadow: isWorking
                                  ? '0 0 16px rgba(16, 185, 129, 0.75), inset 0 0 8px rgba(255,255,255,0.35)'
                                  : '0 2px 8px rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              {/* Display Glow / Active Status */}
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  background: isWorking
                                    ? 'linear-gradient(135deg, #064e3b 0%, #047857 100%)'
                                    : 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <div
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: screenColor,
                                    boxShadow: '0 0 8px ' + screenColor
                                  }}
                                />
                              </div>
                            </div>
                            {/* Monitor Stand Base */}
                            <div
                              style={{
                                width: '18px',
                                height: '5px',
                                background: '#2d3748',
                                borderRadius: '1px'
                              }}
                            />
                          </div>

                          {/* Low-Profile Mechanical Keyboard */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '6px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '48px',
                              height: '10px',
                              background: '#2d323e',
                              borderRadius: '2px',
                              border: '1px solid #1a1d25',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '2px'
                            }}
                          >
                            {[0, 1, 2, 3].map((k) => (
                              <div key={k} style={{ width: '7px', height: '4px', background: '#475569', borderRadius: '1px' }} />
                            ))}
                          </div>

                          {/* Left Desk Drawer */}
                          <div
                            style={{
                              width: '28px',
                              height: '24px',
                              background: '#4a2c16',
                              borderRadius: '3px',
                              border: '1px solid #2e1a0c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <div style={{ width: '5px', height: '2px', background: '#d97706' }} />
                          </div>

                          {/* Right Work Accessory (Coffee / Succulent / Notes) */}
                          {c.id.includes('portal') && !c.id.includes('backend') ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-6px)' }} title="Design Tablet & Stylus">
                              <div style={{ fontSize: '11px' }}>📱</div>
                            </div>
                          ) : c.id.includes('qc') ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-6px)' }} title="Mini Succulent Plant">
                              <div style={{ fontSize: '11px' }}>🌱</div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-10px)' }} title="Kopi Panas SMLONE">
                              <div style={{ width: '3px', height: '5px', borderLeft: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '2px', marginBottom: '2px' }} />
                              <div style={{ width: '13px', height: '13px', background: '#f8fafc', borderRadius: '2px 2px 4px 4px', border: '1px solid #cbd5e1', position: 'relative' }}>
                                <div style={{ position: 'absolute', right: '-4px', top: '2px', width: '3.5px', height: '7px', border: '1.5px solid #f8fafc', borderRadius: '0 3px 3px 0' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. Desk Label & Status Footers */}
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
