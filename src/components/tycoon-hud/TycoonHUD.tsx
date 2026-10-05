import { useEffect, useState } from 'react';
import { useStore } from '../../state/store';

export function TycoonHUD() {
  const agents = useStore((s) => s.agents);
  const activeCount = Object.values(agents).filter((a) => a.status === 'working').length;

  const [stats, setStats] = useState({ design: 248, tech: 680, research: 340, bugsFixed: 42 });
  const [time, setTime] = useState({ year: 10, month: 10, week: 1 });

  // Dynamic simulation tick for Tycoon stats & time cycle
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeCount > 0) {
        setStats((prev) => ({
          design: prev.design + Math.floor(Math.random() * activeCount + 1),
          tech: prev.tech + Math.floor(Math.random() * activeCount * 2 + 1),
          research: prev.research + Math.floor(Math.random() * 2),
          bugsFixed: prev.bugsFixed + (Math.random() > 0.6 ? 1 : 0)
        }));
      }
      setTime((t) => {
        let w = t.week + 1;
        let m = t.month;
        let y = t.year;
        if (w > 4) { w = 1; m += 1; }
        if (m > 12) { m = 1; y += 1; }
        return { year: y, month: m, week: w };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCount]);

  return (
    <div className="tycoon-hud-container">
      {/* Top Center: Active Game/Project Development Banner */}
      <div className="tycoon-project-banner">
        <div className="project-header">
          <span className="project-type">GAME DEV TYCOON MODE</span>
          <h4 className="project-name">SMLONE Enterprise AI Hub</h4>
          <span className="project-hype">HYPE 🔥 99</span>
        </div>

        {/* Live Stat Badges */}
        <div className="tycoon-badges">
          <div className="badge badge-bugs">
            <span className="badge-label">BUGS FIXED</span>
            <span className="badge-value">{stats.bugsFixed}</span>
          </div>
          <div className="badge badge-design">
            <span className="badge-label">DESIGN</span>
            <span className="badge-value">+{stats.design}</span>
          </div>
          <div className="badge badge-tech">
            <span className="badge-label">TECHNOLOGY</span>
            <span className="badge-value">+{stats.tech}</span>
          </div>
          <div className="badge badge-research">
            <span className="badge-label">RESEARCH</span>
            <span className="badge-value">+{stats.research}</span>
          </div>
        </div>
      </div>

      {/* Top Right: Tycoon Stats Panel */}
      <div className="tycoon-stats-panel">
        <div className="stat-row">
          <span className="stat-icon">👥</span>
          <span className="stat-label">Users / Fans</span>
          <span className="stat-val">98.5K</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">📅</span>
          <span className="stat-label">Date</span>
          <span className="stat-val">Y{time.year} M{time.month} W{time.week}</span>
        </div>
        <div className="stat-row">
          <span className="stat-icon">💵</span>
          <span className="stat-label">Capital</span>
          <span className="stat-val text-green">$4,500,000</span>
        </div>
      </div>
    </div>
  );
}
