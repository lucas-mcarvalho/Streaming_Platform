const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.detail || data?.message
    throw new Error(message || 'Não foi possível concluir a solicitação.')
  }
  return data
}

export const api = {
  listMovies: () => request('/movies'),
  listSeries: () => request('/series'),
  listCategories: () => request('/categories'),
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }),
  register: (account) => request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  }),
  uploadMovie: (formData, token) => request('/movies', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  }),
  createSeries: (formData, token) => request('/series', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  }),
}
