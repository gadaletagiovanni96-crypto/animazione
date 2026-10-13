import { isConfirmed } from '../../utils/event.js'; import Modal from '../ui/Modal.jsx'; import { formatDay } from '../../utils/date.js';
// Panoramica degli impegni di un giorno
export default function DaySheet({ date, events, onAdd, onEdit, onClose }) {
  return <Modal title={formatDay(date)} onClose={onClose} actions={<button className="y" onClick={onAdd}>+ Aggiungi impegno</button>}>
    {!events.length && <p className="mute">Nessun impegno per questo giorno.</p>}
    {events.map(e => <button key={e._id} className="card" style={{ width: '100%', textAlign: 'left', color: 'var(--ink)', display: 'block' }} onClick={() => onEdit(e)}>
      <b>{isConfirmed(e) && <span className="tick" title="Confermato">✅</span>}{e.start || 'Tutto il giorno'}{e.end && `–${e.end}`} · {e.title}</b>
      <div className="mute">📍 {e.location || 'Luogo da definire'}</div>
      <div className="mute">👥 {e.leader || e.animators.length || e.guests.length ? `${e.animators.length + e.guests.length + (e.leader ? 1 : 0)} in squadra` : 'Squadra non assegnata'}
        {e.materials.length > 0 && ` · 📦 ${e.materials.reduce((n, m) => n + m.qty, 0)} pezzi`}</div>
    </button>)}
  </Modal>;
}
