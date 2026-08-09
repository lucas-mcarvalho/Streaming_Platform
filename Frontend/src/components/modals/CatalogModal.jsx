import { useEffect, useState } from 'react'
import { catalogApi } from '../../features/catalog/catalogApi'
import Icon from '../ui/Icon'

export default function CatalogModal({ onClose, onSuccess, token, notify }) {
  const [kind, setKind] = useState('movie')
  const [title, setTitle] = useState('')
  const [movie, setMovie] = useState(null)
  const [cover, setCover] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [description, setDescription] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    catalogApi.listCategories()
      .then((items) => setCategories(Array.isArray(items) ? items : []))
      .catch(() => notify('Não foi possível carregar as categorias.', 'error'))
  }, [])

  const toggleCategory = (categoryId) => {
    setCategoryIds((selected) => selected.includes(categoryId)
      ? selected.filter((id) => id !== categoryId)
      : [...selected, categoryId])
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', title)
      data.append('cover', cover)
      categoryIds.forEach((categoryId) => data.append('categoryIds', categoryId))

      let created
      if (kind === 'movie') {
        data.append('movie', movie)
        created = await catalogApi.uploadMovie(data, token)
      } else {
        data.append('description', description)
        data.append('releaseYear', releaseYear)
        episodes.forEach((episode) => data.append('episodes', episode))
        created = await catalogApi.createSeries(data, token)
      }

      onSuccess(created, kind)
      notify(kind === 'movie' ? 'Filme enviado com sucesso.' : 'Série cadastrada com sucesso.')
      onClose()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="auth-modal upload-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        <div className="upload-icon"><Icon name={kind === 'movie' ? 'upload' : 'plus'} size={28} /></div>
        <p className="auth-kicker">ADICIONAR AO CATÁLOGO</p><h2>{kind === 'movie' ? 'Envie um novo filme' : 'Cadastre uma nova série'}</h2>
        <div className="catalog-tabs" role="tablist" aria-label="Tipo de título">
          <button type="button" className={kind === 'movie' ? 'active' : ''} onClick={() => setKind('movie')}>Filme</button>
          <button type="button" className={kind === 'series' ? 'active' : ''} onClick={() => setKind('series')}>Série</button>
        </div>
        <form onSubmit={submit}>
          <label>Título<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={kind === 'movie' ? 'Nome do filme' : 'Nome da série'} /></label>
          {kind === 'movie' ? <>
            <label className="file-field"><span>Arquivo de vídeo</span><input required type="file" accept="video/*" onChange={(event) => setMovie(event.target.files[0])} /><small>{movie?.name || 'MP4, WebM ou MOV'}</small></label>
            <label className="file-field"><span>Imagem de capa</span><input required type="file" accept="image/*" onChange={(event) => setCover(event.target.files[0])} /><small>{cover?.name || 'JPG, PNG ou WebP'}</small></label>
          </> : <>
            <label>Descrição<textarea required rows="4" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Sinopse da série" /></label>
            <label>Ano de lançamento<input required type="number" min="1888" max={new Date().getFullYear() + 5} value={releaseYear} onChange={(event) => setReleaseYear(event.target.value)} placeholder="2017" /></label>
            <label className="file-field"><span>Imagem de capa</span><input required type="file" accept="image/*" onChange={(event) => setCover(event.target.files[0])} /><small>{cover?.name || 'JPG, PNG ou WebP'}</small></label>
            <label className="file-field"><span>Arquivos dos episódios</span><input required multiple type="file" accept="video/*" onChange={(event) => setEpisodes(Array.from(event.target.files || []))} /><small>{episodes.length ? `${episodes.length} episódio${episodes.length > 1 ? 's' : ''} selecionado${episodes.length > 1 ? 's' : ''}` : 'Selecione os vídeos na ordem dos episódios'}</small></label>
          </>}
          <fieldset className="category-fieldset">
            <legend>Categorias</legend>
            {categories.length ? <div className="category-options">
              {categories.map((category) => <label className="category-option" key={category.id}>
                <input type="checkbox" checked={categoryIds.includes(category.id)} onChange={() => toggleCategory(category.id)} />
                <span>{category.name}</span>
              </label>)}
            </div> : <small>Nenhuma categoria cadastrada. Você pode salvar o título sem categoria.</small>}
          </fieldset>
          <button className="button button-primary full-button" disabled={loading}>{loading ? 'Salvando...' : kind === 'movie' ? 'Enviar filme' : 'Cadastrar série'} <Icon name={kind === 'movie' ? 'upload' : 'plus'} /></button>
        </form>
      </section>
    </div>
  )
}
