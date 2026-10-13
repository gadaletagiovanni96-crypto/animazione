import { WEEKDAYS, toYmd, todayYmd } from '../../utils/date.js';
export default function CalendarGrid({ year, month, events, onDayClick }) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7, days = new Date(year, month + 1, 0).getDate(), today = todayYmd();
  return <div className="cal">
    {WEEKDAYS.map(d => <div className="h" key={d}>{d}</div>)}
    {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} className="day empty" />)}
    {Array.from({ length: days }, (_, i) => {
      const date = toYmd(year, month, i + 1), list = events.filter(e => e.date === date);
      return <button type="button" key={date} className={'day' + (date === today ? ' today' : '')} onClick={() => onDayClick(date)} aria-label={`${i + 1}, ${list.length} impegni`}>
        <span>{i + 1}</span>
        {list.length > 0 && <span className="count">{list.length}</span>}
        {list.slice(0, 3).map(e => <span key={e._id} className="chip">{e.start} {e.title}</span>)}
        {list.length > 3 && <span className="chip">+{list.length - 3}</span>}
      </button>;
    })}
  </div>;
}
