import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'; import { useAuth } from '../context/AuthContext.jsx'; import NotificationBell from '../components/layout/NotificationBell.jsx';
// Due aree: "Gestione" (funzioni e informazioni per tutti) e "Il mio spazio" (cosa riguarda me come animatore)
const MANAGE = [{ to: '/calendario', ico: '📅', label: 'Calendario' }, { to: '/squadre', ico: '🎯', label: 'Squadre' }, { to: '/materiale', ico: '📦', label: 'Materiale' }, { to: '/animatori', ico: '🙋', label: 'Staff' }];
const ME = [{ to: '/programma', ico: '📋', label: 'Programma' }, { to: '/disponibilita', ico: '✅', label: 'Disponibilità' }];
export default function MainLayout() {
  const { user, isManager, logout } = useAuth(); const { pathname } = useLocation();
  const inMe = ME.some(l => pathname.startsWith(l.to)); const links = isManager && !inMe ? MANAGE : ME;
  return <>
    <header>
      <div className="top"><b>🎈 Animazione</b><span className="spacer" /><span className="who">{user.name}</span><NotificationBell />
        <button className="y sm" onClick={logout}>Esci</button></div>
      {isManager && <div className="groups" role="group" aria-label="Area">
        <Link to="/calendario" className={!inMe ? 'on' : ''} aria-current={!inMe}>🏢 Gestione</Link>
        <Link to="/programma" className={inMe ? 'on' : ''} aria-current={inMe}>🙋 Il mio spazio</Link></div>}
      <nav className="nav" aria-label="Sezioni">{links.map(l => <NavLink key={l.to} to={l.to}><span className="ico">{l.ico}</span><span>{l.label}</span></NavLink>)}</nav>
    </header>
    <main><Outlet /></main></>;
}
