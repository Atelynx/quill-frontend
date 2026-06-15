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

`vercel.json` aplica headers de seguridad y una CSP que permite conexiones HTTPS
y WSS para la API y tiempo real. `connect-src` no puede restringirse a una
allowlist productiva sin conocer los valores desplegados de `VITE_API_URL` y
`VITE_SOCKET_URL`; usar solo `'self'` romperia despliegues con backend separado.
Antes de produccion deben reemplazarse `https:` y `wss:` por los origenes
exactos de API y WebSocket. No deben agregarse origenes externos genericos.
