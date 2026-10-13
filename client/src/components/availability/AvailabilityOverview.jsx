import { useState, useMemo } from 'react'; import { periodsApi, usersApi } from '../../api/index.js'; import { useAsync } from '../../hooks/useAsync.js';
import { rangeDays, formatDay } from '../../utils/date.js'; import Modal from '../ui/Modal.jsx'; import ErrorText from '../ui/ErrorText.jsx';
const LETTER = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
const key = (u, d) => `${u}|${d}`;

// Solo titolare: tutte le risposte di un periodo in una tabella, con possibilità di rimuoverle
export default function AvailabilityOverview({ period }) {
  const { data: users } = useAsync(usersApi.list, [], []);
  const { data: entries, reload } = useAsync(() => periodsApi.availability(period._id, true), [period._id], []);
  const [cell, setCell] = useState(null); const [error, setError] = useState('');
  const days = rangeDays(period.from, period.to);
  const map = useMemo(() => new Map(entries.map(e => [key(e.user._id, e.date), e])), [entries]);
  const yes = d => users.filter(u => map.get(key(u._id, d))?.status === 'disponibile').length;

  const remove = async () => {
    try { await periodsApi.setAvailability({ period: period._id, from: cell.date, status: '', user: cell.user._id }); setCell(null); setError(''); reload(); }
    catch (e) { setError(e.message); }
  };
  return <>
    <div className="legend"><span>✔ disponibile</span><span>✖ non disponibile</span><span>· nessuna risposta</span></div>
    <div className="matrix" tabIndex={0} aria-label="Disponibilità di tutti"><table>
      <thead><tr><th className="sticky">Persona</th>
        {days.map(d => { const dt = new Date(d + 'T12:00:00'); return <th key={d}><div>{dt.getDate()}</div><small>{LETTER[dt.getDay()]}</small></th>; })}<th>Risposte</th></tr></thead>
      <tbody>{users.map(u => <tr key={u._id}>
        <th className="sticky" scope="row">{u.name}</th>
        {days.map(d => { const e = map.get(key(u._id, d));
          return <td key={d}><button className={'cell ' + (e?.status || '')} aria-label={`${u.name}, ${formatDay(d, { day: 'numeric', month: 'short' })}: ${e?.status || 'nessuna risposta'}`} onClick={() => { setError(''); setCell({ user: u, date: d, entry: e }); }}>
            {e ? (e.status === 'disponibile' ? '✔' : '✖') : '·'}</button></td>; })}
        <td>{days.filter(d => map.has(key(u._id, d))).length}/{days.length}</td></tr>)}</tbody>
      <tfoot><tr><th className="sticky" scope="row">Disponibili</th>{days.map(d => <td key={d}>{yes(d)}</td>)}<td /></tr></tfoot>
    </table></div>
    {cell && <Modal title={cell.user.name} onClose={() => setCell(null)}
      actions={cell.entry ? <button className="del grow" onClick={remove}>Rimuovi {cell.entry.status === 'disponibile' ? 'disponibilità' : 'indisponibilità'}</button> : null}>
      <p><b>{formatDay(cell.date)}</b></p>
      <p>{cell.entry ? <>Risposta: <b className={cell.entry.status === 'disponibile' ? 'good' : 'warn'}>{cell.entry.status}</b>{cell.entry.reason && <> · {cell.entry.reason}</>}</> : 'Nessuna risposta per questo giorno.'}</p>
      {cell.entry && <p className="mute">Rimuovendo la risposta, la persona risulterà "da chiedere" e verrà avvisata.</p>}
      <ErrorText>{error}</ErrorText></Modal>}
  </>;
}
