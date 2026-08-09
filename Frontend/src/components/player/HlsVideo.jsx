import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export default function HlsVideo({ source }) {
  const videoRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const video = videoRef.current
    if (!video || !source) return undefined

    setError('')
    const isHlsSource = /\.m3u8(?:$|[?#])/i.test(source)

    if (!isHlsSource || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source
      return () => {
        video.removeAttribute('src')
        video.load()
      }
    }

    if (!Hls.isSupported()) {
      setError('Este navegador não oferece suporte à reprodução HLS.')
      return undefined
    }

    const hls = new Hls({ enableWorker: true, startLevel: -1 })
    hls.loadSource(source)
    hls.attachMedia(video)
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) return
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) return hls.startLoad()
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) return hls.recoverMediaError()
      setError('Não foi possível carregar o vídeo HLS. Verifique a URL pública e o CORS do R2.')
      hls.destroy()
    })

    return () => {
      hls.destroy()
      video.removeAttribute('src')
      video.load()
    }
  }, [source])

  return (
    <div className="hls-player">
      <video ref={videoRef} controls autoPlay playsInline crossOrigin="anonymous" />
      {error && <div className="player-error"><strong>Erro ao reproduzir</strong><span>{error}</span></div>}
    </div>
  )
}
