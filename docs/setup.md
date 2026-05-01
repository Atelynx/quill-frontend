# Configuración del proyecto

## Requisitos previos

- Node.js 18+ 
- npm o yarn

## Instalación

1. Clona el repositorio
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de configuración:
   ```bash
   cp .env.example .env.local
   ```

## Ejecutar la aplicación

### Desarrollo
```bash
npm run dev
```
Servidor disponible en [http://localhost:5173](http://localhost:5173)

### Producción
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test        # watch mode
npm run test:run    # una sola ejecución
```

## Variables de entorno

Configura `.env.local` con las variables del archivo `.env.example`:

- `VITE_API_URL` - URL del servidor backend
- `VITE_SOCKET_URL` - URL del servidor WebSocket
- `VITE_USE_STUBS` - Modo demo con datos ficticios (true/false)
- `VITE_STUB_EMAIL` - Email para login en modo demo
- `VITE_STUB_PASSWORD` - Contraseña para login en modo demo
