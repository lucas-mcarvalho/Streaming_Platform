import { useEffect, useState } from 'react'
import { mediaUrl } from '../../utils/media'
import HlsVideo from '../player/HlsVideo'
import Icon from '../ui/Icon'

export default function PlayerModal({ movie, onClose }) {
  const [activeEpisodeNumber, setActiveEpisodeNumber] = useState(null)

  useEffect(() => {
    setActiveEpisodeNumber(movie?.selectedEpisodeNumber || movie?.episodes?.[0]?.episodeNumber || null)
  }, [movie])

  if (!movie) return null

  const episodes = movie.episodes || []
  const isSeries = episodes.length > 0
  const seasonNumber = movie.seasonNumber || 1
  const activeEpisode = isSeries
    ? episodes.find((episode) => episode.episodeNumber === activeEpisodeNumber) || episodes[0]
    : null
  const source = mediaUrl(activeEpisode?.datapath || movie.datapath)

  return (
    <div className={isSeries ? 'player-modal series-player' : 'player-modal'}>
      <button className="modal-close player-close" onClick={onClose} aria-label="Fechar player"><Icon name="close" /></button>
      {isSeries && <aside className="player-series-panel">
        <div className="eyebrow"><span /> AGORA ASSISTINDO</div>
        <h2>{movie.title}</h2>
        <p>{movie.description}</p>
        <div className="player-season-heading">
          <div><small>Temporada atual</small><strong>Temporada {seasonNumber}</strong></div>
          <span>{episodes.length} episódio{episodes.length > 1 ? 's' : ''}</span>
        </div>
        <div className="player-episode-list">
          {episodes.map((episode) => (
            <button
              key={episode.id || episode.episodeNumber}
              className={episode.episodeNumber === activeEpisode?.episodeNumber ? 'active' : ''}
              onClick={() => setActiveEpisodeNumber(episode.episodeNumber)}
            >
              <span><Icon name={episode.episodeNumber === activeEpisode?.episodeNumber ? 'check' : 'play'} size={15} /></span>
              <span><small>T{seasonNumber}:E{episode.episodeNumber}</small><strong>{episode.title}</strong></span>
            </button>
          ))}
        </div>
      </aside>}
      <div className="player-stage">
        {source ? <HlsVideo source={source} /> : (
          <div className="player-placeholder" style={{ '--detail': `url(${movie.hero || movie.image})` }}>
            <div className="big-play"><Icon name="play" size={42} /></div>
            <h2>{movie.title}</h2>
            <p>Prévia indisponível. Envie ou conecte o arquivo de vídeo no backend para iniciar a reprodução.</p>
          </div>
        )}
        {activeEpisode && <div className="playing-episode-label"><span>Temporada {seasonNumber} • Episódio {activeEpisode.episodeNumber}</span><strong>{activeEpisode.title}</strong></div>}
      </div>
    </div>
  )
}
