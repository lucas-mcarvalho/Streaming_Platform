import Icon from '../ui/Icon'

export default function MovieCard({ movie, rank, onPlay, onDetails, inList, onToggleList }) {
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
        <div><strong>{movie.match}</strong>{movie.year && <span>{movie.year}</span>}{movie.rating && <span>{movie.rating}</span>}</div>
      </div>
    </article>
  )
}
