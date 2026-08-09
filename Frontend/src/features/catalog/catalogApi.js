import { apiRequest } from '../apiClient'

export const catalogApi = {
  listMovies: () => apiRequest('/movies'),
  listSeries: () => apiRequest('/series'),
  listCategories: () => apiRequest('/categories'),
  uploadMovie: (formData, token) => apiRequest('/movies', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  }),
  createSeries: (formData, token) => apiRequest('/series', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  }),
}
