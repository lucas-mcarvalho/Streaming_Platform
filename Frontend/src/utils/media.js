export function mediaUrl(path) {
  if (!path) return null
  if (/^(https?:|blob:|data:)/.test(path) || path.startsWith('/')) return path
  if (path.startsWith('videos/') || path.startsWith('covers/')) return `/media/${path}`
  return `/${path}`
}

export function normalizeApiMovie(item, index = 0) {
  const categoryNames = getCategoryNames(item.categories)
  const cover = mediaUrl(item.coverUrl)

  return {
    ...item,
    id: `movie-${item.id || `${index}-${item.title}`}`,
    image: cover,
    hero: cover,
    datapath: mediaUrl(item.datapath),
    categories: [...new Set(['Filmes', 'Novidades', ...categoryNames])],
    match: 'Disponível',
    year: item.releaseYear || '',
    rating: item.rating || '',
    duration: item.duration || 'Filme',
    genre: categoryNames.join(' • ') || 'Filme',
    description: item.description || 'Filme disponível no catálogo da Cineflix.',
    accent: '#725b3d',
  }
}

export function normalizeApiSeries(item, index = 0) {
  const categoryNames = getCategoryNames(item.categories)
  const episodes = Array.isArray(item.episodes)
    ? item.episodes.map((episode) => ({ ...episode, datapath: mediaUrl(episode.datapath) }))
    : []
  const cover = mediaUrl(item.coverUrl)

  return {
    ...item,
    id: `series-${item.id || `${index}-${item.title}`}`,
    image: cover,
    hero: cover,
    year: item.releaseYear || '',
    rating: item.rating || '',
    genre: categoryNames.join(' • ') || 'Série',
    categories: [...new Set(['Séries', 'Novidades', ...categoryNames])],
    match: 'Disponível',
    duration: episodes.length ? `${episodes.length} episódio${episodes.length > 1 ? 's' : ''}` : 'Série',
    description: item.description || 'Série disponível no catálogo da Cineflix.',
    accent: '#4e6048',
    seasonNumber: item.seasonNumber || 1,
    episodes,
    datapath: episodes[0]?.datapath || null,
  }
}

function getCategoryNames(categories) {
  return Array.isArray(categories)
    ? categories.map((category) => category.name || category).filter(Boolean)
    : []
}
