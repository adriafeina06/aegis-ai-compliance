'use client';
import { FormEvent, useEffect, useState } from 'react';

type Tool = { id: string; name: string; description: string; department: string };
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function call(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('aegis_token') : null;
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) };
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || 'No se pudo completar la operación');
  return body;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null); const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [companyName, setCompanyName] = useState('');
  const [tools, setTools] = useState<Tool[]>([]); const [form, setForm] = useState({ name: '', description: '', department: '' });
  const [editing, setEditing] = useState<string | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  useEffect(() => setToken(sessionStorage.getItem('aegis_token')), []);
  const load = async () => { try { setTools(await call('/tools')); } catch (e) { setError((e as Error).message); } };
  useEffect(() => { if (token) load(); }, [token]);
  async function submitAuth(e: FormEvent) { e.preventDefault(); setLoading(true); setError(''); try { const data = await call(`/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify({ email, password, ...(mode === 'register' ? { companyName } : {}) }) }); sessionStorage.setItem('aegis_token', data.token); setToken(data.token); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } }
  async function submitTool(e: FormEvent) { e.preventDefault(); setLoading(true); setError(''); try { if (editing) await call(`/tools/${editing}`, { method: 'PATCH', body: JSON.stringify(form) }); else await call('/tools', { method: 'POST', body: JSON.stringify(form) }); setForm({ name: '', description: '', department: '' }); setEditing(null); await load(); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } }
  function logout() { sessionStorage.removeItem('aegis_token'); setToken(null); setTools([]); }
  if (!token) return <main className="shell"><h1>Aegis AI Compliance</h1><p>Inventario y clasificación de riesgos del EU AI Act para tu empresa.</p><section className="card"><h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta empresarial'}</h2><form onSubmit={submitAuth}><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Contraseña (mínimo 12 caracteres)<input type="password" minLength={12} required value={password} onChange={e => setPassword(e.target.value)} /></label>{mode === 'register' && <label>Empresa<input required value={companyName} onChange={e => setCompanyName(e.target.value)} /></label>}<button disabled={loading}>{loading ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Registrarme'}</button></form><button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}</button></section>{error && <p className="error">{error}</p>}</main>;
  return <main className="shell"><header><div><h1>Inventario IA</h1><p>Gestiona las herramientas usadas por tu empresa.</p></div><button onClick={logout}>Cerrar sesión</button></header><section className="card"><h2>{editing ? 'Editar herramienta' : 'Añadir herramienta'}</h2><form onSubmit={submitTool}><label>Nombre<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Descripción<textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><label>Departamento<input required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></label><button disabled={loading}>{editing ? 'Guardar cambios' : 'Añadir'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm({ name: '', description: '', department: '' }); }}>Cancelar</button>}</form></section><section><h2>Herramientas registradas ({tools.length})</h2>{tools.length === 0 && <p>No hay herramientas todavía.</p>}{tools.map(tool => <article className="tool" key={tool.id}><div><h3>{tool.name}</h3><p>{tool.description}</p><small>{tool.department}</small></div><div><button onClick={() => { setEditing(tool.id); setForm({ name: tool.name, description: tool.description, department: tool.department }); }}>Editar</button><button className="danger" onClick={async () => { if (!confirm('¿Eliminar esta herramienta?')) return; try { await call(`/tools/${tool.id}`, { method: 'DELETE' }); await load(); } catch (e) { setError((e as Error).message); } }}>Borrar</button></div></article>)}{error && <p className="error">{error}</p>}</section></main>;
}
