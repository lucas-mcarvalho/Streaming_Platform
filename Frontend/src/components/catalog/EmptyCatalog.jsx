import Icon from '../ui/Icon'

export default function EmptyCatalog({ loading, failed, onCatalog }) {
  return (
    <main id="inicio" className="empty-catalog">
      <div className="eyebrow"><span /> CATÁLOGO CINEFLIX</div>
      <h1>{loading ? 'Carregando catálogo...' : failed ? 'Não foi possível carregar o catálogo' : 'Nenhum título cadastrado'}</h1>
      <p>{failed ? 'Verifique se o backend está disponível e tente novamente.' : 'Cadastre um filme ou uma série para começar.'}</p>
      {!loading && <button className="button button-primary" onClick={onCatalog}><Icon name="plus" size={18} /> Adicionar título</button>}
    </main>
  )
}
