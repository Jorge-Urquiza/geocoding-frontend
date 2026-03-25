# Geocoding Frontend

Aplicacion frontend para buscar ubicaciones en US por texto (ciudad, estado o ZIP), ver sugerencias en tiempo real y mostrar el resultado en un mapa interactivo.  
Tambien permite hacer reverse geocoding con un clic en el mapa.

## Demo (Vercel)

https://geocoding-frontend-fhnw0z71t-jorgestudio2017-5141s-projects.vercel.app/

## Stack:

- React 19 + TypeScript + Vite
- Tailwind CSS
- Leaflet + React Leaflet

## Features:

- Busqueda de ubicaciones con sugerencias.
- Debounce en la busqueda para reducir llamadas al backend.
- Seleccion de sugerencia y centrado automatico del mapa.
- Marker y popup con la ubicacion seleccionada.
- Reverse geocoding al hacer clic en el mapa.

## Requisitos

- Node.js 18+ (recomendado Node 20 LTS)
- npm 9+

## Variables de entorno

El proyecto usa una variable de entorno:

```env
API_BASE_URL=http://localhost:3000
```

Notas:

- Se define en `.env` para desarrollo local.
- En produccion debes configurar `API_BASE_URL` en el entorno de build/deploy.

## Como ejecutarlo

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

- Usa `.env` como base local.
- Si necesitas empezar desde plantilla, usa `.env.example`.

3. Levantar modo desarrollo:

```bash
npm run dev
```

4. Abrir en navegador la URL que imprima Vite (por defecto suele ser `http://localhost:5173`).


## Decisiones tecnicas

- Arquitectura por capas: UI en componentes, flujo en `GeocodingPage`, API en `services/geocodingApi.ts`.
- Busqueda eficiente: debounce de `400ms`, minimo de 2 caracteres y cancelacion con `AbortController`.
- Estado simple: centro/zoom/marker del mapa se derivan de la ubicacion seleccionada.
- Errores separados: mensajes independientes para busqueda y reverse geocoding.
- Configuracion de entorno: `API_BASE_URL` se inyecta en build desde `vite.config.ts`.

## Recomendaciones/mejoras futuras

- Pruebas: unitarias para los `services` y logica de busqueda y al menos un E2E del flujo completo con `Playwright`.
- Estado global: considerar `Zustand` solo si aparece estado compartido entre varias pantallas (filtros globales, preferencias, historial, auth etc.). Para el alcance actual no aplica.
- Calidad automatizada: se usa Vercel para deploy automatico por integracion con el repositorio (cada push dispara build y deploy) complementar con CI para validaciones de tests.
- SonarQube: Vale la pena si el proyecto tiene equipo grande, reglas de calidad estrictas o compliance; para un proyecto pequeno puede no ser necesario al inicio.
