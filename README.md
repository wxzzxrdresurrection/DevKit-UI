<div align="center">

<img src="public/favicon.svg" width="56" alt="" />

# DevKit UI

**Toolkit HTTP para devs que van rápido.**

Interfaz web de [DevKit API](https://github.com/wxzzxrdresurrection/devkit-api) — un
playground donde pruebas las herramientas desde el navegador, sin instalar nada.

[API](https://github.com/wxzzxrdresurrection/devkit-api) ·
[Demo](https://devkit-api-production-0fa6.up.railway.app/) ·
[Identidad visual](BRAND.md)

</div>

---

## Stack

| Capa | Qué |
|------|-----|
| Framework | Astro 6 (salida estática) |
| Islas interactivas | React 19 |
| Estilos | Tailwind CSS 4 (`@theme inline`, sin `tailwind.config`) |
| Tipografía | Archivo + JetBrains Mono, self-hosted vía `@fontsource-variable` |
| Deploy | Vercel |

Sin CDNs de terceros: las fuentes se sirven desde el propio bundle.

---

## Estructura

```
src/
├── layouts/
│   └── Layout.astro        # Shell: banda de peligro, header, telemetría, footer
├── pages/
│   ├── index.astro         # Landing con las 4 unidades
│   ├── playground.astro    # Playground con una pestaña por herramienta
│   └── 404.astro
├── components/
│   ├── ApiTester.tsx       # Isla React — ejecuta el request y muestra la respuesta
│   ├── ApiStatus.astro     # Sonda real contra la API (no es un adorno)
│   ├── ThemeToggle.astro   # Papel <-> CRT, persistido en localStorage
│   └── Logo.astro          # Marca: glifo + wordmark
├── data/tools.ts           # Las 4 herramientas, compartidas entre páginas
├── lib/config.ts           # API_URL con fallback + metadatos del sitio
└── styles/global.css       # Tokens de diseño y capa de componentes
```

---

## Páginas

### Landing (`/`)

Las cuatro herramientas con su endpoint, qué devuelven y un enlace directo a su
pestaña del playground.

### Playground (`/playground`)

Una pestaña por herramienta. Los controles ajustan los parámetros y reescriben
la URL del tester en vivo; la URL resultante es copiable y funciona igual en tu
terminal.

Los controles viven fuera de la isla de React, así que se comunican con ella por
un evento `devkit:url` en vez de escribir el `value` del input (React ignoraría
ese cambio y revertiría al siguiente render).

Navegación directa por hash:

| Hash | Pestaña |
|------|---------|
| `/playground#img` | Imagen placeholder |
| `/playground#text` | Texto Lorem |
| `/playground#fake` | Datos ficticios |
| `/playground#mock` | Mock API |

---

## Correr en local

```bash
git clone https://github.com/wxzzxrdresurrection/devkit-ui.git
cd devkit-ui

pnpm install

cp .env.example .env      # ajusta PUBLIC_API_URL si hace falta

pnpm dev                  # http://localhost:4321
```

Necesita [devkit-api](https://github.com/wxzzxrdresurrection/devkit-api) corriendo
en local, o apunta `PUBLIC_API_URL` a la instancia de producción.

El indicador de la barra superior sondea la API de verdad: si marca
`SIN RESPUESTA`, o está caída o el CORS no deja pasar al navegador.

---

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PUBLIC_API_URL` | URL base de la API | `http://localhost:3000` |

Hay fallback en `src/lib/config.ts`, así que si falta la variable el sitio sigue
renderizando contra `localhost:3000` en vez de mostrar `undefined/...`.

---

## Diseño

La identidad (color, tipografía, retícula, reglas) está documentada en
**[BRAND.md](BRAND.md)**. Resumen de una línea: brutalismo industrial, un solo
acento rojo, cero `border-radius`, y dos sustratos — papel industrial en claro,
terminal CRT en oscuro.
