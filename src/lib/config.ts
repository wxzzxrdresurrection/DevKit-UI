/** URL base de la API. Fallback a local para que el sitio nunca renderice `undefined/...`. */
export const API_URL: string = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000'

export const SITE = {
  name: 'DevKit',
  unit: 'DEVKIT',
  tagline: 'Toolkit HTTP para devs que van rapido',
  description:
    'Imagenes placeholder, lorem ipsum, datos ficticios y mock APIs servidos desde una URL. Sin instalacion, sin cuenta, sin auth.',
  rev: '0.1.0',
  repo: 'https://github.com/wxzzxrdresurrection/DevKit-API',
  repoUi: 'https://github.com/wxzzxrdresurrection/devkit-ui',
} as const

/** Host legible de la API para mostrar en la barra de telemetria. */
export function apiHost(): string {
  try {
    return new URL(API_URL).host
  } catch {
    return API_URL
  }
}
