# Restauracion visual de paginas principales

## Objetivo

Recuperar la presentacion visual de las pantallas principales que existia en la version antigua del frontend, adaptandola a la arquitectura actual sin tocar logica, flujos, contratos, `slices` ni la estrategia de tema vigente.

## Paginas afectadas

- Autenticacion: `src/app/auth/pages/AuthPage.tsx`
- Dashboard principal: `src/app/dashboard/DashboardPage.tsx`
- Shell del area autenticada: `src/shared/layout/AppShell.tsx`
- Tablas, cards y estados visuales usados por portafolio, ordenes y trades dentro del dashboard

## Criterio de adaptacion

La version antigua ya tenia el marcado principal y las clases visuales que daban forma a estas pantallas. En la version actual ese marcado seguia existiendo, pero el CSS que lo sostenia ya no estaba cargado.

La adaptacion se hizo en cuatro capas:

1. `src/app/main-page-primitives.css`
   Define tokens visuales locales, botones compartidos, `ThemeToggle`, estados base y animaciones.

2. `src/app/main-page-forms.css`
   Reaplica la presentacion de formularios, campos, mensajes y `PasswordField` sin mover la logica de auth u ordenes.

3. `src/app/auth/auth-page.css`
   Recupera el layout de la pantalla de autenticacion: topbar, hero, card principal, tabs y responsive.

4. `src/shared/layout/app-shell.css`
   Recupera la estructura del shell autenticado: sidebar, header, espaciados y disposicion general.

5. `src/app/dashboard/dashboard-page.css`
   Restaura el layout del dashboard: hero panel, summary cards, section cards y grids principales.

6. `src/app/dashboard/dashboard-data-display.css`
   Restaura la presentacion de tablas, chart container, market pulse, empty states y comportamiento responsive de datos.

## Archivos nuevos

- `docs/visual-restoration-main-pages.md`
- `src/app/main-page-primitives.css`
- `src/app/main-page-forms.css`
- `src/app/auth/auth-page.css`
- `src/shared/layout/app-shell.css`
- `src/app/dashboard/dashboard-page.css`
- `src/app/dashboard/dashboard-data-display.css`

## Archivos modificados

- `src/App.tsx`
- `src/app/auth/pages/AuthPage.tsx`
- `src/app/dashboard/DashboardPage.tsx`
- `src/shared/layout/AppShell.tsx`

## Por que se separo asi

- `AuthPage`, `DashboardPage` y `AppShell` ya concentran la estructura visual real del flujo principal.
- El CSS antiguo estaba en un archivo unico muy grande. En la version actual se repartio por responsabilidad para evitar volver a un `index.css` monolitico.
- Se mantuvieron archivos pequenos y enfocados para que otra persona pueda ubicar rapido donde vive cada parte del layout.

## Relacion con el sistema actual de theme y variables

- No se modifico `src/store/slices`.
- No se cambio Redux ni el mecanismo actual que aplica `--color-background`, `--color-primary`, `--color-secondary`, `--color-accent` y `--color-text`.
- Los estilos nuevos no reemplazan esas variables; las consumen.
- Los tokens locales definidos en `main-page-primitives.css` derivan de las variables actuales mediante `color-mix`, para conservar compatibilidad con los temas existentes sin rehacer la estrategia visual del proyecto.

## Que se recupero conceptualmente desde la version antigua

- Layout de dos columnas para auth con hero + card
- Shell autenticado con sidebar y header
- Jerarquia visual del dashboard
- Summary cards
- Section cards
- Grids balanceados para paneles principales
- Presentacion de tablas y estados vacios
- Responsive de tablas en mobile

## Limites respetados

- No se cambio logica de negocio.
- No se tocaron llamadas API, contratos ni WebSocket.
- No se tocaron `slices`.
- No se modifico la carpeta `styles`.
- No se intervinieron paginas sandbox como parte de esta restauracion.
- No se aplicaron arreglos ajenos al alcance, aunque sigan existiendo inconsistencias fuera del flujo principal.

## Punto de entrada de estilos

- `src/App.tsx` carga la base visual compartida.
- `src/app/auth/pages/AuthPage.tsx` carga el CSS propio de auth.
- `src/app/dashboard/DashboardPage.tsx` carga el CSS de dashboard y de visualizacion de datos.
- `src/shared/layout/AppShell.tsx` carga el CSS del shell autenticado.

## Resultado esperado

Las pantallas principales vuelven a tener estructura, espaciado, cards, tablas y jerarquia visual coherentes con la version antigua, pero apoyadas sobre la arquitectura actual y sobre el sistema vigente de variables y tema.
