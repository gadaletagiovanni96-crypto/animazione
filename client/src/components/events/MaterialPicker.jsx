import { useState } from 'react'; import Accordion from '../ui/Accordion.jsx'; import Stepper from '../ui/Stepper.jsx';
// Materiale per categoria (sezioni a scomparsa) con ricerca rapida e contatore +/−
export default function MaterialPicker({ materials, quantities, onChange, usedByDay }) {
  const [query, setQuery] = useState(''); const q = query.trim().toLowerCase();
  if (!materials.length) return <p className="mute">Nessun materiale: aggiungilo dalla sezione Materiale.</p>;
  const visible = materials.filter(m => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  const categories = [...new Set(visible.map(m => m.category))];
  const qty = id => quantities[id] || 0, selectedCount = Object.values(quantities).filter(n => n > 0).length;
  return <>
    <input type="search" placeholder="🔍 Cerca materiale…" aria-label="Cerca materiale" value={query} onChange={e => setQuery(e.target.value)} />
    <p className="mute" style={{ margin: '6px 2px' }}>{selectedCount ? `${selectedCount} articoli selezionati` : 'Nessun articolo selezionato'}</p>
    {!categories.length && <p className="mute">Nessun risultato per “{query}”.</p>}
    {categories.map(cat => {
      const items = visible.filter(m => m.category === cat), picked = items.reduce((n, m) => n + qty(m._id), 0);
      return <Accordion key={cat} title={cat} badge={picked ? `${picked} sel.` : ''} forceOpen={Boolean(q)}>
        {items.map(m => { const used = usedByDay[m._id] || 0, left = Math.max(m.total - used, 0);
          return <div className="item" key={m._id}>
            <div className="grow"><b>{m.name}</b><small className={left === 0 ? 'warn' : ''}>{left} disponibili su {m.total}{used > 0 && ` · già usati quel giorno: ${used}`}</small></div>
            <Stepper value={qty(m._id)} max={left} label={m.name} onChange={n => onChange({ ...quantities, [m._id]: n })} />
          </div>; })}
      </Accordion>;
    })}
  </>;
}
