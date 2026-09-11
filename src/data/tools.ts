export interface Tool {
  /** Identificador de unidad — tambien el hash del playground. */
  id: 'img' | 'text' | 'fake' | 'mock'
  index: string
  name: string
  description: string
  endpoint: string
  /** Que devuelve, para la ficha tecnica. */
  returns: string
}

export const TOOLS: Tool[] = [
  {
    id: 'img',
    index: '01',
    name: 'Imagen Placeholder',
    description:
      'Genera imagenes de cualquier tamano on-the-fly. Color de fondo, texto y formato configurables.',
    endpoint: 'GET /img/400x300',
    returns: 'jpeg · png · webp',
  },
  {
    id: 'text',
    index: '02',
    name: 'Generador de Texto',
    description:
      'Lorem ipsum en palabras, oraciones o parrafos, con la cantidad exacta que pidas.',
    endpoint: 'GET /text?type=sentences&count=5',
    returns: 'plain · json · html',
  },
  {
    id: 'fake',
    index: '03',
    name: 'Datos Ficticios',
    description:
      'Usuarios, productos, posts y empresas con datos coherentes. Locale y seed reproducible.',
    endpoint: 'GET /fake/user?count=10',
    returns: 'json',
  },
  {
    id: 'mock',
    index: '04',
    name: 'Mock API REST',
    description:
      'Registra endpoints propios y consumelos como una API real. Delay, headers y cualquier metodo HTTP.',
    endpoint: 'POST /mock/create',
    returns: 'json',
  },
]
