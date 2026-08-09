import Icon from '../ui/Icon'

export default function Hero({ movie, onPlay, onDetails, inList, onToggleList }) {
  return (
    <section id="inicio" className="hero" style={{ '--hero-image': `url(${movie.hero || movie.image})` }}>
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="eyebrow"><span /> ESCOLHA CINEFLIX</div>
        <h1>{movie.title}</h1>
        <div className="movie-meta">
          <strong>{movie.match}</strong>{movie.year && <span>{movie.year}</span>}{movie.rating && <span className="age">{movie.rating}</span>}<span>{movie.duration}</span><span>{movie.genre}</span>
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
