import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../../lib/supabaseClient'

const READER_ID = 'qr-reader'

function extractToken(scannedValue) {
  try {
    const url = new URL(scannedValue)
    const token = url.searchParams.get('token')
    if (token) return token
  } catch {
    // La valeur scannée n'est pas une URL : on la traite comme un token brut.
  }
  return scannedValue
}

export default function ScanQr() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token')

  const [status, setStatus] = useState(tokenFromUrl ? 'processing' : 'idle')
  const [message, setMessage] = useState('')
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef(null)

  const submitToken = async (token) => {
    setStatus('processing')
    const { data, error } = await supabase.rpc('mark_attendance', { p_token: token })

    if (error) {
      setStatus('error')
      setMessage(error.message)
      return
    }

    const result = data?.[0]
    if (result?.status === 'ok') {
      setStatus('success')
      setMessage(result.message)
    } else {
      setStatus('error')
      setMessage(result?.message || 'Erreur inconnue')
    }
  }

  useEffect(() => {
    if (tokenFromUrl) {
      submitToken(tokenFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl])

  const startScanner = async () => {
    setStatus('idle')
    setMessage('')
    setScanning(true)

    const html5Qrcode = new Html5Qrcode(READER_ID)
    scannerRef.current = html5Qrcode

    try {
      await html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        async (decodedText) => {
          await html5Qrcode.stop()
          setScanning(false)
          await submitToken(extractToken(decodedText))
        },
        () => {} // ignore les erreurs de lecture image par image
      )
    } catch (err) {
      setScanning(false)
      setStatus('error')
      setMessage("Impossible d'accéder à la caméra : " + err.message)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch {
        // le scanner était déjà arrêté
      }
    }
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Scanner ma présence</h2>
        <p className="text-sm text-slate-500">Scannez le QR code affiché par votre enseignant</p>
      </div>

      {status === 'processing' && <p className="text-slate-500">Vérification en cours...</p>}

      {status === 'success' && (
        <div className="card bg-green-50 border-green-200">
          <p className="text-green-700 font-medium">✔ {message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-700 font-medium">{message}</p>
        </div>
      )}

      {!tokenFromUrl && (
        <div className="card">
          <div id={READER_ID} className="mx-auto max-w-sm" />
          <div className="mt-4 flex justify-center gap-3">
            {!scanning ? (
              <button className="btn-primary" onClick={startScanner}>
                Ouvrir la caméra
              </button>
            ) : (
              <button className="btn-secondary" onClick={stopScanner}>
                Arrêter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
