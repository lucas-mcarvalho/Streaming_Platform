const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, options = {}) {
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
