# syntax=docker/dockerfile:1

# PUBLIC_API_URL se inlinea en tiempo de build (Astro genera un sitio estatico),
# asi que la URL de la API se fija aqui, no al arrancar el contenedor.
# El fetch lo hace el navegador, por eso el default apunta al host y no al
# nombre del servicio de compose.
ARG PUBLIC_API_URL=http://localhost:3200

FROM node:22-bookworm-slim AS build
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
RUN pnpm build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
