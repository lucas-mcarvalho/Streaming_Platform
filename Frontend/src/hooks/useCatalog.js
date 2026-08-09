import { useEffect, useState } from 'react'
import { catalogApi } from '../features/catalog/catalogApi'
import { normalizeApiMovie, normalizeApiSeries } from '../utils/media'

export function useCatalog() {
  const [titles, setTitles] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    Promise.allSettled([catalogApi.listMovies(), catalogApi.listSeries()])
      .then(([movieResult, seriesResult]) => {
        const movies = movieResult.status === 'fulfilled' && Array.isArray(movieResult.value)
          ? movieResult.value.map(normalizeApiMovie)
          : []
        const series = seriesResult.status === 'fulfilled' && Array.isArray(seriesResult.value)
          ? seriesResult.value.map(normalizeApiSeries)
          : []

        setTitles([...movies, ...series])
        setFailed(movieResult.status === 'rejected' && seriesResult.status === 'rejected')
      })
      .finally(() => setLoading(false))
  }, [])

  const prependTitle = (title, kind) => {
    const normalized = kind === 'series' ? normalizeApiSeries(title) : normalizeApiMovie(title)
    setTitles((current) => [normalized, ...current])
  }

  return { titles, loading, failed, prependTitle }
}
