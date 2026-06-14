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

La sesion se limpia ante respuestas `401` y el contexto de autenticacion recibe
el evento sin recargar la pagina. La ruta administrativa valida el rol mediante
`GET /users/me`; el rol almacenado localmente sirve solo para presentacion.

`vercel.json` aplica headers de seguridad y una CSP que permite conexiones HTTPS
y WSS para la API y tiempo real. Cualquier nuevo origen externo debe agregarse
de forma explicita antes del despliegue.
