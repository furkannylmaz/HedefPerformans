"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Error objesinde Date olamayabilir, güvenli loglama
  }, [])

  return (
    <html lang="tr" className="dark">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#eaffea',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            background: '#d1ffd1',
            border: '1px solid #94e294',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#111111', marginBottom: '1rem' }}>
              Beklenmeyen Bir Hata Oluştu
            </h2>
            <p style={{ color: '#111111', marginBottom: '1.5rem' }}>
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            <button
              onClick={reset}
              style={{
                background: '#00ff88',
                color: '#111111',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

