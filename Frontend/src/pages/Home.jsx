import { useMemo, useState } from 'react'
import ContentRow from '../components/catalog/ContentRow'
import EmptyCatalog from '../components/catalog/EmptyCatalog'
import Hero from '../components/catalog/Hero'
import MovieCard from '../components/catalog/MovieCard'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import AuthModal from '../components/modals/AuthModal'
import CatalogModal from '../components/modals/CatalogModal'
import DetailModal from '../components/modals/DetailModal'
import PlayerModal from '../components/modals/PlayerModal'
import Toast from '../components/ui/Toast'
import { catalogRows } from '../data/catalogRows'
import { useCatalog } from '../hooks/useCatalog'

export default function Home() {
  const { titles, loading, failed, prependTitle } = useCatalog()
  const [search, setSearch] = useState('')
  const [details, setDetails] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [user, setUser] = useState(() => readStorage('cineflix_user', null))
  const [list, setList] = useState(() => readStorage('cineflix_list', []))

  const notify = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3600)
  }

  const toggleList = (movie) => {
    const next = list.includes(movie.id) ? list.filter((id) => id !== movie.id) : [...list, movie.id]
    setList(next)
    localStorage.setItem('cineflix_list', JSON.stringify(next))
    notify(list.includes(movie.id) ? 'Removido da sua lista.' : 'Adicionado à sua lista.')
  }

  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    return term ? titles.filter((movie) => `${movie.title} ${movie.genre}`.toLocaleLowerCase('pt-BR').includes(term)) : []
  }, [search, titles])

  const openCatalog = () => user
    ? setCatalogOpen(true)
    : (setAuthOpen(true), notify('Entre na sua conta para adicionar títulos.', 'info'))

  return (
    <div className="app-shell">
      <Header onAuth={() => setAuthOpen(true)} onCatalog={openCatalog} search={search} setSearch={setSearch} user={user} />
      {search ? (
        <main className="search-results">
          <div className="section-heading"><div><p className="eyebrow"><span /> RESULTADOS</p><h1>{results.length ? `Encontramos ${results.length} título${results.length > 1 ? 's' : ''}` : 'Nenhum título encontrado'}</h1><p>Resultados para “{search}”</p></div></div>
          <div className="card-grid">{results.map((movie) => <MovieCard key={movie.id} movie={movie} onPlay={setPlaying} onDetails={setDetails} inList={list.includes(movie.id)} onToggleList={toggleList} />)}</div>
        </main>
      ) : titles.length ? <>
        <Hero movie={titles[0]} onPlay={setPlaying} onDetails={setDetails} inList={list.includes(titles[0].id)} onToggleList={toggleList} />
        <main id="catalogo" className="catalog">
          {catalogRows.map((row) => <ContentRow key={row.title} row={row} movies={titles.filter((movie) => movie.categories?.includes(row.category))} onPlay={setPlaying} onDetails={setDetails} list={list} onToggleList={toggleList} />)}
          {list.length > 0 && <div id="minha-lista"><ContentRow row={{ title: 'Minha lista', subtitle: 'Salvos para assistir depois' }} movies={titles.filter((movie) => list.includes(movie.id))} onPlay={setPlaying} onDetails={setDetails} list={list} onToggleList={toggleList} /></div>}
        </main>
      </> : <EmptyCatalog loading={loading} failed={failed} onCatalog={openCatalog} />}
      <Footer />
      <DetailModal movie={details} onClose={() => setDetails(null)} onPlay={(movie) => { setDetails(null); setPlaying(movie) }} inList={details && list.includes(details.id)} onToggleList={toggleList} />
      <PlayerModal movie={playing} onClose={() => setPlaying(null)} />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={setUser} notify={notify} />}
      {catalogOpen && <CatalogModal onClose={() => setCatalogOpen(false)} onSuccess={prependTitle} token={user?.token} notify={notify} />}
      <Toast toast={toast} />
    </div>
  )
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
