# quill-frontend

## Verificacion local

La configuracion de Vitest vive en `vitest.config.ts`. Usa `jsdom`, carga
`src/test/setup.ts` y fuerza `VITE_USE_STUBS=false` para que el resultado no
dependa del `.env` local.

```bash
npm ci
npm run test:run
npm run lint
npx tsc -b --noEmit
npm run build
```

## Monedas y ordenes

Los precios de mercado conservan la moneda indicada por `quote.currency`.
`src/shared/utils/currency.ts` centraliza conversiones CLP/USD y exige una tasa
USDCLP positiva cuando hay conversion. Las ordenes por monto reciben CLP y
calculan la cantidad usando el precio convertido a CLP, pero envian el precio
limite al backend en la moneda original de la cotizacion.

## Sesion y despliegue

El access token y el perfil autenticado se mantienen exclusivamente en memoria.
No se escriben en `sessionStorage` ni `localStorage`, y cualquier sesion legacy
en `sessionStorage` se elimina. La sesion se limpia ante respuestas `401` y el
contexto de autenticacion recibe el evento sin recargar la pagina.

Esta mitigacion reduce la ventana de exposicion del JWT frente a XSS, pero no
protege el token mientras la aplicacion esta abierta: JavaScript malicioso que
se ejecute en el mismo origen aun puede acceder al estado en memoria. Ademas,
recargar o cerrar la pestaña elimina la sesion y exige iniciar sesion otra vez.
Eliminar ese riesgo y conservar la sesion tras recarga requiere autenticacion
cross-stack mediante cookies `HttpOnly`, `Secure` y `SameSite`.

La ruta administrativa valida el rol mediante `GET /users/me`; el rol del
contexto local sirve solo para presentacion.

`vercel.json` aplica headers de seguridad y bloquea objetos embebidos, frames,
media y workers porque la aplicacion no usa esos tipos de recursos. La
configuracion local de `.env.example` usa `http://localhost:3000` para API y
Socket.IO; Vite no aplica los headers de `vercel.json` durante desarrollo local.

### CSP para produccion

El repositorio no contiene los origenes productivos de `VITE_API_URL` y
`VITE_SOCKET_URL`. Por compatibilidad con despliegues existentes desconocidos,
`connect-src` conserva temporalmente las fuentes genericas `https:` y `wss:`.
Esta configuracion no debe considerarse cerrada para produccion.

Antes de promover un despliegue productivo:

1. Obtener el origen de `VITE_API_URL`, eliminando cualquier ruta como `/api`.
2. Obtener el origen de `VITE_SOCKET_URL`.
3. Reemplazar literalmente `https:` y `wss:` en `connect-src` de `vercel.json`
   por esos origenes exactos. Mantener `'self'` solo si el frontend realiza
   conexiones al mismo origen.
4. No incluir comodines, esquemas genericos ni URLs de localhost en la CSP
   productiva.
5. Verificar en navegador que login, solicitudes HTTP y tiempo real funcionan
   sin violaciones de `connect-src`.

La configuracion objetivo debe tener esta forma, sustituyendo los marcadores
por valores reales verificados:

```text
connect-src 'self' <ORIGEN_HTTPS_API> <ORIGEN_WSS_SOCKET>;
```

Si API y Socket.IO comparten origen, debe declararse una sola vez. Los valores
de CSP son origenes (`esquema://host[:puerto]`), no URLs con rutas.
