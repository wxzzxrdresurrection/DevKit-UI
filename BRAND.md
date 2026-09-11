# DevKit — Sistema de identidad

Guía de la identidad visual. Si vas a tocar la UI, lee esto primero: casi todo
está en tokens y el resto son tres reglas.

---

## 1. Concepto

DevKit es una API que se consume con `curl`. La identidad parte de ahí: no es
una landing de SaaS, es **instrumental**. Brutalismo industrial — retícula
rígida, tipografía como estructura, cero decoración gratuita.

El sistema usa dos arquetipos, uno por sustrato. **Nunca conviven en pantalla**:
el toggle cambia de uno al otro por completo.

| Tema | Arquetipo | Referencia |
|------|-----------|------------|
| `light` (por defecto en sistemas claros) | **Swiss Industrial Print** | Manual de maquinaria, papel sin blanquear, tinta carbón |
| `dark` | **Tactical Telemetry** | Terminal CRT, fósforo blanco, scanlines |

---

## 2. Color

Todo vive en `src/styles/global.css`. Los tokens se redefinen en `:root` y
`.dark`, y se exponen a Tailwind con `@theme inline`.

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--bg` | `#f4f4f0` | `#0a0a0a` | Sustrato. Nunca negro puro en dark |
| `--surface` | `#eae8e3` | `#121212` | Barras, cabeceras de bloque, campos |
| `--fg` | `#0a0a0a` | `#eaeaea` | Texto primario |
| `--fg-muted` | `#5d5c57` | `#8d8d87` | Prosa secundaria, labels |
| `--fg-faint` | `#706f68` | `#7b7b74` | Numerales grandes, números de línea, decoración |
| `--line` | `#c9c6bd` | `#2a2a2a` | Divisores de la retícula |
| `--brand` | `#e61919` | `#e61919` | **Constante.** Solo la marca (logo, favicon, OG) |
| `--accent` | `#d11212` | `#ff2a2a` | Acento de UI: se adapta al sustrato por contraste |
| `--signal` | `#1a7d10` | `#4af626` | **Una sola cosa:** el estado de la API |

**Reglas duras**

- Un solo acento. No hay paleta por herramienta — las cuatro unidades se
  distinguen por su numeral (`01`–`04`), no por color.
- Sin gradientes, sin sombras suaves, sin translucidez.
- El verde `--signal` es exclusivo del indicador de estado. Si lo usas para
  otra cosa, deja de significar algo.
- La marca no cambia con el tema; el acento de UI sí. Es deliberado: el logo es
  constante, el texto rojo necesita contraste distinto sobre papel y sobre CRT.

Todos los pares texto/fondo pasan WCAG AA (≥4.5:1). Si cambias un token,
vuelve a comprobarlo.

---

## 3. Tipografía

Dos familias, self-hosted vía `@fontsource-variable` (sin llamadas a un CDN).

**Macro — `Archivo Variable` 900** (`.t-display`)
Bloques arquitectónicos. Mayúsculas, `letter-spacing: -0.04em`,
`line-height: 0.86`, `word-spacing: 0.08em` (el tracking negativo pega las
palabras sin esto). Escala con `clamp()`: `.t-h1` / `.t-h2` / `.t-h3`.

**Micro — `JetBrains Mono Variable`**
Todo lo demás, en dos registros:

- `.t-meta` / `.t-label` — mayúsculas, tracking abierto. **Solo** metadata,
  navegación, IDs de unidad, estados.
- `.t-body` — caja normal, `line-height: 1.65`. **Prosa real.** Un párrafo de
  50 caracteres en mayúsculas no se lee; la caja alta es para etiquetas.

---

## 4. Geometría y retícula

- **`border-radius: 0` en todo**, forzado en `@layer base`. No es negociable.
- Divisores: `.grid-hairline` — `display:grid; gap:1px` sobre fondo `--line`,
  con los hijos en `--bg`. Da líneas de 1px exactas sin declarar bordes.
- Densidad bimodal: bloques de metadata muy apretados junto a espacio en blanco
  amplio alrededor de la macro-tipografía.
- Simbología: `///` como separador, `>>` como direccional, `[ ... ]` para
  enmarcar, `®` y `©` como elementos gráficos.

---

## 5. Textura

Dos capas fijas en `<body>`, `pointer-events: none`:

- `.fx-grain` — ruido SVG en ambos temas (`--grain`: 0.035 light / 0.05 dark).
- `.fx-scan` — scanlines CRT, **solo en dark** (`--scan` es 0 en light).

Son lo único "decorativo" del sistema y existen para que no parezca un render
plano. No añadas más efectos.

---

## 6. Activos

| Archivo | Qué es |
|---------|--------|
| `public/favicon.svg` | El glifo: prompt `>_` en blanco sobre cuadrado `--brand` |
| `public/og.png` | Tarjeta social 1200×630, sustrato CRT |
| `src/components/Logo.astro` | Marca completa (glifo + wordmark), `size` configurable |

El wordmark es `Devkit` en Archivo 900 con un punto en `--brand`. El punto es
parte de la marca, no puntuación.
