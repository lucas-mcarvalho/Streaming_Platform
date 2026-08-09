import { useRef } from 'react'
import Icon from '../ui/Icon'
import MovieCard from './MovieCard'

export default function ContentRow({ row, movies, onPlay, onDetails, list, onToggleList }) {
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
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onPlay={onPlay} onDetails={onDetails} inList={list.includes(movie.id)} onToggleList={onToggleList} />)}
      </div>
    </section>
  )
}
