import { useStore } from '../../state/store';

export function ViewSwitcher() {
  const view = useStore((s) => s.view); const setView = useStore((s) => s.setView);
  return (
    <div className="seg">
      <button className={view === 'office' ? 'on' : ''} onClick={() => setView('office')}>Lihat Kantor</button>
      <button className={view === 'agent' ? 'on' : ''} onClick={() => setView('agent')}>Lihat Agent</button>
    </div>
  );
}
