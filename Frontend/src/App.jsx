import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from './api'
import { catalog, rows } from './data'

function mediaUrl(path) {
  if (!path) return null
  if (/^(https?:|blob:|data:)/.test(path) || path.startsWith('/')) return path
  if (path.startsWith('videos/') || path.startsWith('covers/')) return `/media/${path}`
  return `/${path}`
}

function normalizeApiMovie(item, index = 0) {
  const fallback = catalog[index % catalog.length]
  return {
    ...fallback,
    ...item,
    id: item.id || `api-${index}-${item.title}`,
    image: mediaUrl(item.coverUrl) || fallback.image,
    datapath: mediaUrl(item.datapath),
    categories: ['Novidades'],
    match: 'Novo no catálogo',
  }
}

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    play: <><path d="m8 5 11 7-11 7Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" /></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5" /><path d="M5 15v5h14v-5" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Header({ onAuth, onUpload, search, setSearch, user }) {
  const [openSearch, setOpenSearch] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="header">
      <a className="brand" href="#inicio" aria-label="Cineflix, início">
        <span className="brand-mark">C</span>
        <span>CINEFLIX</span>
      </a>
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Icon name="menu" /></button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        <a className="active" href="#inicio">Início</a>
        <a href="#catalogo">Filmes</a>
        <a href="#catalogo">Séries</a>
        <a href="#minha-lista">Minha lista</a>
      </nav>
      <div className="header-actions">
        <div className={openSearch ? 'search-box open' : 'search-box'}>
          <button className="icon-button" onClick={() => setOpenSearch(!openSearch)} aria-label="Pesquisar"><Icon name="search" /></button>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filmes e séries" aria-label="Pesquisar filmes e séries" />
        </div>
        <button className="upload-button" onClick={onUpload}><Icon name="upload" size={18} /> <span>Enviar filme</span></button>
        <button className="profile-button" onClick={onAuth} aria-label="Abrir perfil">
          <Icon name="user" size={19} />
          <span>{user?.username?.slice(0, 1).toUpperCase() || ''}</span>
        </button>
      </div>
    </header>
  )
}

function Hero({ movie, onPlay, onDetails, inList, onToggleList }) {
  return (
    <section id="inicio" className="hero" style={{ '--hero-image': `url(${movie.hero || movie.image})` }}>
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="eyebrow"><span /> ESCOLHA CINEFLIX</div>
        <h1>{movie.title}</h1>
        <div className="movie-meta">
          <strong>{movie.match}</strong><span>{movie.year}</span><span className="age">{movie.rating}</span><span>{movie.duration}</span><span>{movie.genre}</span>
        </div>
        <p>{movie.description}</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => onPlay(movie)}><Icon name="play" size={19} /> Assistir agora</button>
          <button className="button button-secondary" onClick={() => onDetails(movie)}><Icon name="info" size={19} /> Mais informações</button>
          <button className={inList ? 'round-button selected' : 'round-button'} onClick={() => onToggleList(movie)} aria-label="Adicionar à minha lista">
            <Icon name={inList ? 'check' : 'plus'} />
          </button>
        </div>
      </div>
      <div className="scroll-hint"><span /> EXPLORE</div>
    </section>
  )
}

function MovieCard({ movie, rank, onPlay, onDetails, inList, onToggleList }) {
  return (
    <article className={rank ? 'movie-card ranked' : 'movie-card'}>
      {rank && <span className="rank-number">{rank}</span>}
      <div className="poster" role="button" tabIndex="0" style={{ '--poster': `url(${movie.image})`, '--accent': movie.accent }} onClick={() => onDetails(movie)} onKeyDown={(event) => { if (event.key === 'Enter') onDetails(movie) }} aria-label={`Ver detalhes de ${movie.title}`}>
        <span className="poster-gradient" />
        <span className="card-badge">{movie.genre}</span>
        <span className="card-hover">
          <button className="mini-play" onClick={(event) => { event.stopPropagation(); onPlay(movie) }} aria-label={`Assistir ${movie.title}`}><Icon name="play" size={18} /></button>
          <button className="mini-action" onClick={(event) => { event.stopPropagation(); onToggleList(movie) }} aria-label="Adicionar à lista"><Icon name={inList ? 'check' : 'plus'} size={17} /></button>
        </span>
      </div>
      <div className="card-copy">
        <h3>{movie.title}</h3>
        <div><strong>{movie.match}</strong><span>{movie.year}</span><span>{movie.rating}</span></div>
      </div>
    </article>
  )
}

function ContentRow({ row, movies, onPlay, onDetails, list, onToggleList }) {
  const track = useRef(null)
  const scroll = (direction) => track.current?.scrollBy({ left: direction * track.current.clientWidth * .85, behavior: 'smooth' })

  if (!movies.length) return null

  return (
    <section className="content-row">
      <div className="section-heading">
        <div><h2>{row.title}</h2><p>{row.subtitle}</p></div>
        <div className="carousel-controls">
          <button className="previous" onClick={() => scroll(-1)} aria-label={`Voltar em ${row.title}`}><Icon name="chevron" size={18} /></button>
          <button onClick={() => scroll(1)} aria-label={`Avançar em ${row.title}`}><Icon name="chevron" size={18} /></button>
        </div>
      </div>
      <div className="carousel-track" ref={track}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onPlay={onPlay} onDetails={onDetails} inList={list.includes(movie.id)} onToggleList={onToggleList} />
        ))}
      </div>
    </section>
  )
}

function DetailModal({ movie, onClose, onPlay, inList, onToggleList }) {
  if (!movie) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="detail-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button>
        <div className="detail-image" style={{ '--detail': `url(${movie.hero || movie.image})` }} />
        <div className="detail-body">
          <div className="eyebrow"><span /> DESTAQUE CINEFLIX</div>
          <h2>{movie.title}</h2>
          <div className="movie-meta"><strong>{movie.match}</strong><span>{movie.year}</span><span className="age">{movie.rating}</span><span>{movie.duration}</span></div>
          <p>{movie.description}</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => onPlay(movie)}><Icon name="play" /> Assistir</button>
            <button className="round-button" onClick={() => onToggleList(movie)}><Icon name={inList ? 'check' : 'plus'} /></button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PlayerModal({ movie, onClose }) {
  if (!movie) return null
  const source = mediaUrl(movie.datapath)
  return (
    <div className="player-modal">
      <button className="modal-close player-close" onClick={onClose} aria-label="Fechar player"><Icon name="close" /></button>
      {source ? <video src={source} controls autoPlay /> : (
        <div className="player-placeholder" style={{ '--detail': `url(${movie.hero || movie.image})` }}>
          <div className="big-play"><Icon name="play" size={42} /></div>
          <h2>{movie.title}</h2>
          <p>Prévia indisponível. Envie ou conecte o arquivo de vídeo no backend para iniciar a reprodução.</p>
        </div>
      )}
    </div>
  )
}

function AuthModal({ onClose, onSuccess, notify }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await api.login({ username: form.username, email: form.email, password: form.password })
        const user = { username: data.username || form.username, email: data.email, token: data.accesToken }
        localStorage.setItem('cineflix_user', JSON.stringify(user))
        onSuccess(user)
        notify(`Bem-vindo, ${user.username}!`)
        onClose()
      } else {
        await api.register(form)
        notify('Conta criada. Agora faça seu login.')
        setMode('login')
      }
    } catch (error) {
      notify(error.message, 'error')
    } finally { setLoading(false) }
  }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        <div className="auth-brand"><span className="brand-mark">C</span><span>CINEFLIX</span></div>
        <p className="auth-kicker">{mode === 'login' ? 'Que bom ter você de volta' : 'Sua próxima história começa aqui'}</p>
        <h2>{mode === 'login' ? 'Entrar na sua conta' : 'Criar uma conta'}</h2>
        <form onSubmit={submit}>
          <label>Username<input required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="seu username" /></label>
          <label>E-mail<input required autoComplete="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" /></label>
          <label>Senha<input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>
          <button className="button button-primary full-button" disabled={loading}>{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'} <Icon name="arrow" /></button>
        </form>
        <p className="switch-auth">{mode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p>
      </section>
    </div>
  )
}

function UploadModal({ onClose, onSuccess, token, notify }) {
  const [title, setTitle] = useState('')
  const [movie, setMovie] = useState(null)
  const [cover, setCover] = useState(null)
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData()
    data.append('title', title); data.append('movie', movie); data.append('cover', cover)
    setLoading(true)
    try {
      const created = await api.uploadMovie(data, token)
      onSuccess(created); notify('Filme enviado com sucesso.'); onClose()
    } catch (error) { notify(error.message, 'error') } finally { setLoading(false) }
  }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="auth-modal upload-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        <div className="upload-icon"><Icon name="upload" size={28} /></div>
        <p className="auth-kicker">ADICIONAR AO CATÁLOGO</p><h2>Envie um novo filme</h2>
        <form onSubmit={submit}>
          <label>Título<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome do filme" /></label>
          <label className="file-field"><span>Arquivo de vídeo</span><input required type="file" accept="video/*" onChange={(e) => setMovie(e.target.files[0])} /><small>{movie?.name || 'MP4, WebM ou MOV — até 5 GB'}</small></label>
          <label className="file-field"><span>Imagem de capa</span><input required type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} /><small>{cover?.name || 'JPG, PNG ou WebP'}</small></label>
          <button className="button button-primary full-button" disabled={loading}>{loading ? 'Enviando...' : 'Enviar filme'} <Icon name="upload" /></button>
        </form>
      </section>
    </div>
  )
}

function Footer() {
  return <footer><a className="brand" href="#inicio"><span className="brand-mark">C</span><span>CINEFLIX</span></a><p>Grandes histórias. Uma só tela.</p><div><a href="#catalogo">Filmes</a><a href="#catalogo">Séries</a><a href="#">Ajuda</a><a href="#">Privacidade</a></div><small>© 2026 Cineflix. Projeto demonstrativo.</small></footer>
}

export default function App() {
  const [movies, setMovies] = useState(catalog)
  const [search, setSearch] = useState('')
  const [details, setDetails] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('cineflix_user')) } catch { return null } })
  const [list, setList] = useState(() => { try { return JSON.parse(localStorage.getItem('cineflix_list')) || [] } catch { return [] } })

  const notify = (message, type = 'success') => {
    setToast({ message, type }); window.setTimeout(() => setToast(null), 3600)
  }
  useEffect(() => {
    api.listMovies().then((items) => {
      if (!Array.isArray(items) || !items.length) return
      const mapped = items.map(normalizeApiMovie)
      setMovies([...mapped, ...catalog])
    }).catch(() => {})
  }, [])
  const toggleList = (movie) => {
    const next = list.includes(movie.id) ? list.filter((id) => id !== movie.id) : [...list, movie.id]
    setList(next); localStorage.setItem('cineflix_list', JSON.stringify(next))
    notify(list.includes(movie.id) ? 'Removido da sua lista.' : 'Adicionado à sua lista.')
  }
  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    return term ? movies.filter((movie) => `${movie.title} ${movie.genre}`.toLocaleLowerCase('pt-BR').includes(term)) : []
  }, [search, movies])
  const openUpload = () => user ? setUploadOpen(true) : (setAuthOpen(true), notify('Entre na sua conta para enviar um filme.', 'info'))

  return (
    <div className="app-shell">
      <Header onAuth={() => setAuthOpen(true)} onUpload={openUpload} search={search} setSearch={setSearch} user={user} />
      {search ? (
        <main className="search-results"><div className="section-heading"><div><p className="eyebrow"><span /> RESULTADOS</p><h1>{results.length ? `Encontramos ${results.length} título${results.length > 1 ? 's' : ''}` : 'Nenhum título encontrado'}</h1><p>Resultados para “{search}”</p></div></div><div className="card-grid">{results.map((movie) => <MovieCard key={movie.id} movie={movie} onPlay={setPlaying} onDetails={setDetails} inList={list.includes(movie.id)} onToggleList={toggleList} />)}</div></main>
      ) : <>
        <Hero movie={movies[0]} onPlay={setPlaying} onDetails={setDetails} inList={list.includes(movies[0].id)} onToggleList={toggleList} />
        <main id="catalogo" className="catalog">
          {rows.map((row) => <ContentRow key={row.title} row={row} movies={movies.filter((movie) => movie.categories?.includes(row.category))} onPlay={setPlaying} onDetails={setDetails} list={list} onToggleList={toggleList} />)}
          {list.length > 0 && <div id="minha-lista"><ContentRow row={{ title: 'Minha lista', subtitle: 'Salvos para assistir depois' }} movies={movies.filter((movie) => list.includes(movie.id))} onPlay={setPlaying} onDetails={setDetails} list={list} onToggleList={toggleList} /></div>}
        </main>
      </>}
      <Footer />
      <DetailModal movie={details} onClose={() => setDetails(null)} onPlay={(movie) => { setDetails(null); setPlaying(movie) }} inList={details && list.includes(details.id)} onToggleList={toggleList} />
      <PlayerModal movie={playing} onClose={() => setPlaying(null)} />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={setUser} notify={notify} />}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onSuccess={(movie) => setMovies([normalizeApiMovie(movie), ...movies])} token={user?.token} notify={notify} />}
      {toast && <div className={`toast ${toast.type}`}><span><Icon name={toast.type === 'error' ? 'close' : 'check'} size={17} /></span>{toast.message}</div>}
    </div>
  )
}
