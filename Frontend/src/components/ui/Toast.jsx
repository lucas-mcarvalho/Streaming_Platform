import Icon from './Icon'

export default function Toast({ toast }) {
  if (!toast) return null

  return <div className={`toast ${toast.type}`}><span><Icon name={toast.type === 'error' ? 'close' : 'check'} size={17} /></span>{toast.message}</div>
}
