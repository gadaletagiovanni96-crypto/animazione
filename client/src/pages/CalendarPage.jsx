import { useState } from 'react'; import { eventsApi } from '../api/index.js'; import { useAsync } from '../hooks/useAsync.js'; import { MONTHS, toYmd } from '../utils/date.js';
import CalendarGrid from '../components/events/CalendarGrid.jsx'; import DaySheet from '../components/events/DaySheet.jsx'; import EventForm from '../components/events/EventForm.jsx';
export default function CalendarPage() {
  const now = new Date(); const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [day, setDay] = useState(null); const [editing, setEditing] = useState(null);
  const { data: events, reload } = useAsync(() => eventsApi.list({ from: toYmd(cursor.y, cursor.m, 1), to: toYmd(cursor.y, cursor.m, 31) }), [cursor], []);
  const move = delta => { const d = new Date(cursor.y, cursor.m + delta, 1); setCursor({ y: d.getFullYear(), m: d.getMonth() }); };
  return <>
    <div className="row"><button className="ghost" aria-label="Mese precedente" onClick={() => move(-1)}>‹</button>
      <h2 className="grow" style={{ textAlign: 'center' }}>{MONTHS[cursor.m]} {cursor.y}</h2><button className="ghost" aria-label="Mese successivo" onClick={() => move(1)}>›</button></div>
    <CalendarGrid year={cursor.y} month={cursor.m} events={events} onDayClick={setDay} />
    {day && !editing && <DaySheet date={day} events={events.filter(e => e.date === day)} onClose={() => setDay(null)} onAdd={() => setEditing({ date: day })} onEdit={setEditing} />}
    {editing && <EventForm event={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
  </>;
}
