import { useState } from 'react'; import { useAuth } from '../context/AuthContext.jsx'; import ErrorText from '../components/ui/ErrorText.jsx';
export default function LoginPage() {
  const { login } = useAuth(); const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState('');
  const submit = async e => { e.preventDefault(); try { await login(form); } catch (x) { setError(x.message); } };
  return <main style={{ maxWidth: 380, marginTop: 60 }}><div className="card" style={{ borderTop: '8px solid var(--giallo)' }}>
    <h1>Accedi all'agenzia</h1>
    <form onSubmit={submit}>
      <label htmlFor="email">Email</label><input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <label htmlFor="pw">Password</label><input id="pw" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <ErrorText>{error}</ErrorText><p><button>Entra</button></p>
    </form></div></main>;
}
