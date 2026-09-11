<div align="center">

<img src="public/favicon.svg" width="56" alt="" />

# DevKit UI

**Toolkit HTTP que corre en tu máquina.**

Playground web de [DevKit API](https://github.com/wxzzxrdresurrection/devkit-api).
Imágenes placeholder, lorem ipsum, datos ficticios y mock APIs — servidos desde tu
propio equipo, sin cuenta y sin cuotas.

[API](https://github.com/wxzzxrdresurrection/devkit-api) ·
[Demo hospedada](https://devkit-api-production-0fa6.up.railway.app/) ·
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

## Arrancar

### Todo el stack con Docker (recomendado)

Levanta UI, API y PostgreSQL cableados entre sí. No necesitas Node ni Postgres
instalados:

```bash
git clone https://github.com/wxzzxrdresurrection/devkit-ui.git
cd devkit-ui
docker compose up
```

| Servicio | URL |
|----------|-----|
| UI | http://localhost:4321 |
| API | http://localhost:3200 |
| Docs | http://localhost:3200/docs |

`docker-compose.yml` construye la API directamente desde su repo, así que no hace
falta clonarla aparte. Si prefieres tenerla en local, cambia esa línea a
`build: ../devkit-api`.

### Solo la UI, en modo desarrollo

```bash
pnpm install
cp .env.example .env       # ajusta PUBLIC_API_URL si tu API no está en 3200
pnpm dev                   # http://localhost:4321
```

Necesita la [API](https://github.com/wxzzxrdresurrection/devkit-api) corriendo.
Tres de sus cuatro herramientas (`/img`, `/text`, `/fake`) **no necesitan base de
datos**, así que para eso te basta con `pnpm dev` en el repo de la API. Solo los
mocks requieren PostgreSQL.

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
