import { useState } from 'react'
import { authApi } from '../../features/auth/authApi'
import Icon from '../ui/Icon'

export default function AuthModal({ onClose, onSuccess, notify }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await authApi.login({ email: form.email, password: form.password })
        const user = { username: data.username || form.email.split('@')[0], email: data.email, token: data.accesToken }
        localStorage.setItem('cineflix_user', JSON.stringify(user))
        onSuccess(user)
        notify(`Bem-vindo, ${user.username}!`)
        onClose()
      } else {
        await authApi.register(form)
        notify('Conta criada. Agora faça seu login.')
        setMode('login')
      }
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        <div className="auth-brand"><span className="brand-mark">C</span><span>CINEFLIX</span></div>
        <p className="auth-kicker">{mode === 'login' ? 'Que bom ter você de volta' : 'Sua próxima história começa aqui'}</p>
        <h2>{mode === 'login' ? 'Entrar na sua conta' : 'Criar uma conta'}</h2>
        <form onSubmit={submit}>
          {mode === 'register' && <label>Username<input required autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="seu username" /></label>}
          <label>E-mail<input required autoComplete="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="voce@email.com" /></label>
          <label>Senha<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" /></label>
          <button className="button button-primary full-button" disabled={loading}>{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'} <Icon name="arrow" /></button>
        </form>
        <p className="switch-auth">{mode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p>
      </section>
    </div>
  )
}
