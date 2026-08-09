import Icon from '../ui/Icon'

export default function DetailModal({ movie, onClose, onPlay, inList, onToggleList }) {
  if (!movie) return null
  const isSeries = movie.episodes?.length > 0
  const seasonNumber = movie.seasonNumber || 1

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="detail-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button>
        <div className="detail-image" style={{ '--detail': `url(${movie.hero || movie.image})` }} />
        <div className="detail-body">
          <div className="eyebrow"><span /> DESTAQUE CINEFLIX</div>
          <h2>{movie.title}</h2>
          <div className="movie-meta"><strong>{movie.match}</strong>{movie.year && <span>{movie.year}</span>}{movie.rating && <span className="age">{movie.rating}</span>}<span>{movie.duration}</span></div>
          <div className="detail-description"><h3>Sinopse</h3><p>{movie.description}</p></div>
          {isSeries && <div className="episode-list">
            <div className="season-heading">
              <div><small>Temporada atual</small><h3>Temporada {seasonNumber}</h3></div>
              <span>{movie.episodes.length} episódio{movie.episodes.length > 1 ? 's' : ''}</span>
            </div>
            {movie.episodes.map((episode) => <button key={episode.id || episode.episodeNumber} onClick={() => onPlay({ ...movie, selectedEpisodeNumber: episode.episodeNumber })}>
              <span><Icon name="play" size={15} /></span>
              <span className="episode-copy"><small>T{seasonNumber}:E{episode.episodeNumber}</small><strong>{episode.title}</strong></span>
            </button>)}
          </div>}
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => onPlay(movie)}><Icon name="play" /> {isSeries ? 'Assistir episódio 1' : 'Assistir'}</button>
            <button className="round-button" onClick={() => onToggleList(movie)}><Icon name={inList ? 'check' : 'plus'} /></button>
          </div>
        </div>
      </section>
    </div>
  )
}
