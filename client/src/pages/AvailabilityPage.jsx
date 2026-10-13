import { useState } from 'react'; import { periodsApi } from '../api/index.js'; import { useAsync } from '../hooks/useAsync.js'; import { useAuth } from '../context/AuthContext.jsx';
import { rangeDays, formatDay } from '../utils/date.js'; import ErrorText from '../components/ui/ErrorText.jsx'; import Accordion from '../components/ui/Accordion.jsx';
import AvailabilityOverview from '../components/availability/AvailabilityOverview.jsx';
const BLANK = { title: '', from: '', to: '', deadline: '' }, DAY = { weekday: 'short', day: 'numeric', month: 'short' };

export default function AvailabilityPage() {
  const { isManager, isOwner } = useAuth();
  const { data: periods, reload: reloadPeriods } = useAsync(periodsApi.list, [], []);
  const [selected, setSelected] = useState(null); const [form, setForm] = useState(BLANK); const [range, setRange] = useState({ from: '', to: '', reason: '' }); const [error, setError] = useState(''); const [newDeadline, setNewDeadline] = useState('');
  const period = periods.find(p => p._id === selected) || periods[0]; const pid = period?._id;
  const { data: entries, reload } = useAsync(() => pid ? periodsApi.availability(pid) : Promise.resolve([]), [pid], []);
  const days = period ? rangeDays(period.from, period.to) : [];
  const mine = date => entries.find(a => a.date === date);
  const call = async body => { try { await periodsApi.setAvailability({ period: pid, ...body }); setError(''); reload(); return true; } catch (e) { setError(e.message); return false; } };
  const toggle = (date, status) => call({ from: date, status: mine(date)?.status === status ? '' : status });
  const addRange = async () => { if (await call({ from: range.from, to: range.to || range.from, status: 'indisponibile', reason: range.reason })) setRange({ from: '', to: '', reason: '' }); };
  const create = async () => { try { await periodsApi.create(form); setForm(BLANK); setError(''); reloadPeriods(); } catch (e) { setError(e.message); } };
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  return <><h2>Disponibilità</h2>
    {isManager && <Accordion title="➕ Nuovo periodo">
      <label htmlFor="pt">Titolo</label><input id="pt" placeholder="Es. Estate 2026" value={form.title} onChange={set('title')} />
      <div className="pair"><div><label htmlFor="pf">Dal</label><input id="pf" type="date" value={form.from} onChange={set('from')} /></div><div><label htmlFor="pto">Al</label><input id="pto" type="date" min={form.from} value={form.to} onChange={set('to')} /></div></div>
      <label htmlFor="pd">Termine per rispondere (ultimo giorno)</label><input id="pd" type="date" value={form.deadline} onChange={set('deadline')} />
      <p className="mute" style={{ margin: '6px 0' }}>Fino al termine ognuno può dare o togliere disponibilità e indisponibilità. Dopo si può solo aggiungere disponibilità; le altre modifiche le fa il titolare.</p>
      <button className="y" disabled={!form.title || !form.from || !form.to || !form.deadline} onClick={create}>Apri periodo</button>
    </Accordion>}
    <ErrorText>{error}</ErrorText>
    {!periods.length && <p>Nessun periodo aperto. Quando il responsabile ne apre uno, riceverai una notifica.</p>}
    <div className="chips" role="group" aria-label="Periodo">{periods.map(p => <button key={p._id} className={'fchip' + (p._id === pid ? ' on' : '')} onClick={() => { setSelected(p._id); setError(''); }}>{p.closed ? '🔒 ' : ''}{p.title}</button>)}</div>

    {period && <>
      <div className="row">
        <span className={'deadline ' + (!period.deadline ? 'closed' : period.closed ? 'closed' : 'open')}>{!period.deadline ? '⚠ Nessun termine impostato' : period.closed ? `🔒 Chiuso il ${formatDay(period.deadline, { day: 'numeric', month: 'long' })}` : `⏰ Rispondi entro il ${formatDay(period.deadline, { day: 'numeric', month: 'long' })}`}</span>
        <span className="mute grow">Hai risposto a {entries.length}/{days.length} giorni</span>
        {(isOwner || (isManager && !period.closed)) && <button className="del sm" onClick={async () => { if (confirm('Eliminare il periodo e tutte le risposte?')) { await periodsApi.remove(pid); setSelected(null); reloadPeriods(); } }}>Elimina</button>}</div>
      {period.closed && <p className="ask">Termine scaduto: puoi solo aggiungere disponibilità. Non puoi toglierla né segnare indisponibilità; per modifiche contatta il titolare.</p>}

      {!period.deadline && <p className="ask">Senza un termine non scatta nessun blocco: tutti possono ancora modificare tutto. {isManager ? 'Impostalo qui sotto.' : ''}</p>}
      {isManager && (!period.closed || isOwner) && <Accordion title="⏰ Imposta o modifica il termine">
        <label htmlFor="nd">Ultimo giorno per rispondere</label><input id="nd" type="date" value={newDeadline || period.deadline || ''} onChange={e => setNewDeadline(e.target.value)} />
        <div className="mt"><button className="y" disabled={!newDeadline} onClick={async () => { try { await periodsApi.setDeadline(pid, newDeadline); setNewDeadline(''); setError(''); reloadPeriods(); } catch (e) { setError(e.message); } }}>Salva termine</button></div>
      </Accordion>}

      {!period.closed && <Accordion title="⛔ Segna indisponibile un giorno o un periodo">
        <div className="pair"><div><label htmlFor="rf">Dal</label><input id="rf" type="date" min={period.from} max={period.to} value={range.from} onChange={e => setRange({ ...range, from: e.target.value })} /></div>
          <div><label htmlFor="rt">Al (vuoto = solo quel giorno)</label><input id="rt" type="date" min={range.from || period.from} max={period.to} value={range.to} onChange={e => setRange({ ...range, to: e.target.value })} /></div></div>
        <label htmlFor="rr">Motivo (facoltativo)</label><input id="rr" maxLength={100} value={range.reason} onChange={e => setRange({ ...range, reason: e.target.value })} placeholder="Es. esame, vacanza" />
        <div className="mt"><button className="y" disabled={!range.from} onClick={addRange}>Segna indisponibile</button></div>
      </Accordion>}

      <div className="avail-grid">{days.map(d => { const m = mine(d), locked = period.closed && m?.status === 'disponibile';
        return <div key={d} className={`st ${m?.status || ''}`}>
          <b>{formatDay(d, DAY)}</b>{m?.reason && <small className="mute" style={{ display: 'block' }}>{m.reason}</small>}
          <div className="row mt">
            <button className={'sm ' + (m?.status === 'disponibile' ? '' : 'ghost')} disabled={locked} onClick={() => toggle(d, 'disponibile')}>Disponibile</button>
            <button className={'sm ' + (m?.status === 'indisponibile' ? 'del' : 'ghost')} disabled={period.closed} onClick={() => toggle(d, 'indisponibile')}>No</button></div>
          {locked && <small className="good">🔒 Confermata</small>}
        </div>; })}</div>

      {isOwner && <div className="mt"><Accordion title="👁 Disponibilità di tutti (titolare)" defaultOpen><AvailabilityOverview key={pid + entries.length} period={period} /></Accordion></div>}
    </>}
  </>;
}
