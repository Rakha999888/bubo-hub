import { useStore } from '../../state/store';
import { FLOOR_NAMES } from '../../config/rooms';
import { FloorId } from '../../types';

export function FloorSelector() {
  const floor = useStore((s) => s.floor); const setFloor = useStore((s) => s.setFloor);
  return (
    <div className="floors">
      {([4, 3, 2, 1] as FloorId[]).map((f) => (
        <button key={f} className={floor === f ? 'on' : ''} onClick={() => setFloor(f)}>
          <b>Floor {f}</b><small>{FLOOR_NAMES[f]}</small>
        </button>
      ))}
    </div>
  );
}
