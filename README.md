# DevKit UI

Interfaz web para [DevKit API](https://github.com/wxzzxrdresurrection/devkit-api) — un playground interactivo donde cualquier desarrollador puede probar las herramientas desde el navegador sin instalar nada.

**API:** [devkit-api](https://github.com/wxzzxrdresurrection/devkit-api) · **Demo:** [devkit-demo](https://devkit-api-production-0fa6.up.railway.app/)

---

## Stack

- **Framework:** Astro 5
- **Componentes interactivos:** React (islas)
- **Estilos:** Tailwind CSS
- **Deploy:** Vercel
---

## Estructura

```
src/
├── layouts/
│   └── Layout.astro        # Layout base con nav y footer
├── pages/
│   ├── index.astro         # Landing con las 4 herramientas
│   └── playground.astro    # Playground con tabs por herramienta
└── components/
    ├── ApiTester.tsx        # Isla React — ejecuta requests y muestra respuesta
    └── CodeBlock.tsx        # Muestra URLs copiables
```

---

## Páginas

### Landing (`/`)

Presenta las cuatro herramientas con descripción, endpoint de ejemplo y link al playground. Página completamente estática — sin JavaScript en el cliente.

### Playground (`/playground`)

Interfaz interactiva con una tab por herramienta. Cada tab tiene controles para configurar los parámetros y un `ApiTester` que ejecuta el request y muestra la respuesta en tiempo real.

Soporta navegación directa por hash:
- `/playground#img` → tab de imagen placeholder
- `/playground#text` → tab de texto Lorem
- `/playground#fake` → tab de datos ficticios
- `/playground#mock` → tab de Mock API
---

## Correr en local

```bash
# 1. Clonar el repo
git clone https://github.com/wxzzxrdresurrection/devkit-ui.git
cd devkit-ui

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar PUBLIC_API_URL si la API no corre en localhost:3000

# 4. Iniciar servidor de desarrollo
pnpm dev
```

La UI corre en `http://localhost:4321`. Requiere que [devkit-api](https://github.com/wxzzxrdresurrection/devkit-api) esté corriendo en local o apuntar `PUBLIC_API_URL` a la instancia en producción.

---

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PUBLIC_API_URL` | URL base de la API | `http://localhost:3000` |
