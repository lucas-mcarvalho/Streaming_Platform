import { useState } from 'react'
import Icon from '../ui/Icon'

export default function Header({ onAuth, onCatalog, search, setSearch, user }) {
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
        <button className="nav-add-button" onClick={() => { onCatalog(); setMenuOpen(false) }}><Icon name="plus" size={17} /> Adicionar título</button>
      </nav>
      <div className="header-actions">
        <div className={openSearch ? 'search-box open' : 'search-box'}>
          <button className="icon-button" onClick={() => setOpenSearch(!openSearch)} aria-label="Pesquisar"><Icon name="search" /></button>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filmes e séries" aria-label="Pesquisar filmes e séries" />
        </div>
        <button className="upload-button" onClick={onCatalog}><Icon name="plus" size={18} /> <span>Adicionar título</span></button>
        <button className="profile-button" onClick={onAuth} aria-label="Abrir perfil">
          <Icon name="user" size={19} />
          <span>{user?.username?.slice(0, 1).toUpperCase() || ''}</span>
        </button>
      </div>
    </header>
  )
}
