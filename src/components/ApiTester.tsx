import { useState } from 'react'

interface Props {
  id: string
  defaultUrl: string
  method?: 'GET' | 'POST' | 'DELETE'
  body?: Record<string, unknown>
}

export default function ApiTester({ defaultUrl, method = 'GET', body }: Props) {
  const [url, setUrl] = useState(defaultUrl)
  const [response, setResponse] = useState<unknown>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  async function run() {
    setLoading(true)
    setResponse(null)
    setStatus(null)
    const start = Date.now()

    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      setTime(Date.now() - start)
      setStatus(res.status)

      const contentType = res.headers.get('content-type') ?? ''

      if (contentType.includes('image')) {
        setResponse({ _type: 'image', url })
      } else if (contentType.includes('json')) {
        setResponse(await res.json())
      } else {
        setResponse({ _type: 'text', content: await res.text() })
      }
    } catch (e) {
      console.log('Error al conectar con la API:', e)
      setResponse({ error: 'No se pudo conectar con la API', detail: String(e) })
      setTime(Date.now() - start)
    } finally {
      setLoading(false)
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusColor =
    status && status < 300 ? 'text-emerald-400' :
    status && status < 500 ? 'text-amber-400' :
    'text-red-400'

  return (
    <div className="space-y-3">
      {/* URL bar */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
          <span className="text-xs font-mono text-blue-400 shrink-0">{method}</span>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-transparent text-sm font-mono text-gray-200 outline-none"
            spellCheck={false}
          />
          <button
            onClick={copyUrl}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors shrink-0"
          >
            {copied ? '✓' : 'copiar'}
          </button>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          {loading ? '...' : 'Enviar'}
        </button>
      </div>

      {/* Response */}
      {response !== null && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 text-xs">
            <span className={`font-mono font-medium ${statusColor}`}>{status}</span>
            {time && <span className="text-gray-500">{time}ms</span>}
          </div>
          <div className="p-4 max-h-72 overflow-auto">
            {(response as any)?._type === 'image' ? (
              <img src={url} alt="preview" className="max-w-full rounded" />
            ) : (response as any)?._type === 'text' ? (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {(response as any).content}
              </pre>
            ) : (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}