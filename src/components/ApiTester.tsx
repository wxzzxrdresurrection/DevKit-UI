import { useEffect, useRef, useState } from 'react'

interface Props {
  /** Identificador de la unidad. Los controles del playground emiten
   *  `devkit:url` con este id para reescribir la URL. */
  id: string
  defaultUrl: string
  method?: 'GET' | 'POST' | 'DELETE'
  body?: Record<string, unknown>
}

type Result =
  | { kind: 'image'; url: string }
  | { kind: 'text'; content: string }
  | { kind: 'json'; data: unknown }
  | { kind: 'error'; message: string; detail: string }

export default function ApiTester({ id, defaultUrl, method = 'GET', body }: Props) {
  const [url, setUrl] = useState(defaultUrl)
  const [draftBody, setDraftBody] = useState(() =>
    body ? JSON.stringify(body, null, 2) : '',
  )
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Los controles viven fuera de la isla: escuchamos su evento en vez de
  // dejar que escriban `input.value` (React ignoraria ese cambio).
  useEffect(() => {
    function onUrl(event: Event) {
      const detail = (event as CustomEvent<{ id: string; url: string }>).detail
      if (detail?.id === id) setUrl(detail.url)
    }
    window.addEventListener('devkit:url', onUrl)
    return () => window.removeEventListener('devkit:url', onUrl)
  }, [id])

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current)
  }, [])

  async function run() {
    setLoading(true)
    setResult(null)
    setStatus(null)
    const start = performance.now()

    let payload: string | undefined
    if (method !== 'GET' && draftBody.trim()) {
      try {
        payload = JSON.stringify(JSON.parse(draftBody))
      } catch (e) {
        setLoading(false)
        setTime(null)
        setResult({
          kind: 'error',
          message: 'JSON del body invalido',
          detail: String(e),
        })
        return
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: payload ? { 'Content-Type': 'application/json' } : undefined,
        body: payload,
      })

      setTime(Math.round(performance.now() - start))
      setStatus(res.status)

      const contentType = res.headers.get('content-type') ?? ''
      if (contentType.includes('image')) {
        setResult({ kind: 'image', url })
      } else if (contentType.includes('json')) {
        setResult({ kind: 'json', data: await res.json() })
      } else {
        setResult({ kind: 'text', content: await res.text() })
      }
    } catch (e) {
      setTime(Math.round(performance.now() - start))
      setResult({
        kind: 'error',
        message: 'Sin conexion con la API',
        detail: String(e),
      })
    } finally {
      setLoading(false)
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard bloqueado: el usuario puede copiar a mano */
    }
  }

  const statusTone =
    result?.kind === 'error' || (status !== null && status >= 500)
      ? 'text-accent'
      : status !== null && status >= 400
        ? 'text-fg'
        : 'text-signal'

  return (
    <div className="border border-line">
      {/* ---- Barra de request ---- */}
      <div className="flex flex-wrap items-stretch gap-px bg-line md:flex-nowrap">
        <span className="t-meta flex items-center bg-surface px-3 py-2.5 text-accent">
          {method}
        </span>

        <label className="sr-only" htmlFor={`${id}-url`}>
          URL del request
        </label>
        <input
          id={`${id}-url`}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') run()
          }}
          spellCheck={false}
          className="min-w-0 flex-1 bg-bg px-3 py-2.5 text-[0.75rem] tracking-normal text-fg outline-none focus:bg-surface"
        />

        <button
          type="button"
          onClick={copyUrl}
          className="t-meta bg-surface px-3 py-2.5 text-fg-muted transition-colors hover:text-fg"
        >
          {copied ? 'OK' : 'COPIAR'}
        </button>

        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="btn btn-primary border-0 px-5"
        >
          {loading ? 'ENVIANDO' : 'ENVIAR'}
        </button>
      </div>

      {/* ---- Body editable (solo escrituras) ---- */}
      {method !== 'GET' && (
        <div className="border-t border-line">
          <label
            className="t-label block border-b border-line bg-surface px-3 py-1.5"
            htmlFor={`${id}-body`}
          >
            Body · JSON
          </label>
          <textarea
            id={`${id}-body`}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            spellCheck={false}
            rows={Math.min(12, Math.max(3, draftBody.split('\n').length))}
            className="w-full resize-y bg-bg px-3 py-2.5 text-[0.75rem] leading-5 tracking-normal text-fg outline-none focus:bg-surface"
          />
        </div>
      )}

      {/* ---- Telemetria de respuesta ---- */}
      {result !== null && (
        <div className="border-t border-line">
          <div className="flex items-center gap-4 border-b border-line bg-surface px-3 py-1.5">
            <span className={`t-label ${statusTone}`}>
              {result.kind === 'error' ? 'ERR' : `HTTP ${status}`}
            </span>
            {time !== null && <span className="t-label text-fg-faint">{time} MS</span>}
            <span className="t-label ml-auto text-fg-faint">
              {result.kind.toUpperCase()}
            </span>
          </div>

          <div className="max-h-80 overflow-auto p-3">
            {result.kind === 'image' ? (
              <img
                src={result.url}
                alt="Respuesta de la API"
                className="max-w-full border border-line"
              />
            ) : result.kind === 'error' ? (
              <div>
                <p className="t-meta text-accent">{result.message}</p>
                <pre className="mt-2 whitespace-pre-wrap text-[0.75rem] tracking-normal text-fg-muted">
                  {result.detail}
                </pre>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-[0.75rem] leading-5 tracking-normal text-fg">
                {result.kind === 'json'
                  ? JSON.stringify(result.data, null, 2)
                  : result.content}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
