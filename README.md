# Adviento 2026

Un calendario de Adviento web para compartir un detalle navideño con tu pareja. La experiencia comienza en una portada con una ventana invernal y un muérdago; al abrirla se muestra el calendario de 24 casillas, con desbloqueo progresivo y diseño adaptable a móvil y escritorio. El día 1 incluye un cuento y un espacio reservado para un juego.

## Contenido

- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Abrir en local](#abrir-en-local)
- [Publicar en Render](#publicar-en-render)
- [Tecnologías](#tecnologías)

## Características

- Calendario de 24 días con desbloqueo progresivo.
- Casillas en disposición de mosaico, con orden y tamaños variados.
- Desbloqueo diario automático y modo de prueba para preparar contenido.
- Progreso y casillas abiertas guardados en el navegador.
- Cuento ilustrado de tres dobles páginas alternas para el día 1, con espacio reservado para el juego.
- Diseño adaptable a pantallas pequeñas y grandes.
- No necesita backend, dependencias ni proceso de compilación.

## Estructura del proyecto

```text
.
├── public/
│   ├── content/
│   │   └── days/
│   │       └── day-01.json  # Cuento y datos del juego del día 1
│   ├── index.html            # Estructura de las pantallas
│   ├── script.js             # Calendario, desbloqueo y navegación
│   └── styles.css            # Diseño y estilos adaptables
└── README.md
```

## Dónde editar los días

Cada día se añade solo cuando esté preparado; no hay que crear de antemano archivos vacíos para los 24 días.

- **Cuento y datos del juego:** edita `public/content/days/day-XX.json`. El día 1 ya está en `day-01.json`; para el siguiente, crea `day-02.json` siguiendo su estructura. Cada elemento de `pages` representa una doble página del libro: escribe el texto en `paragraphs` y elige una escena (`window`, `lantern` o `stars`) y su `caption`. También puedes crear `public/images/days/`, guardar allí una imagen y poner su ruta relativa en el campo `image` de esa página.
- **Nombre y descripción del juego:** están en el objeto `game` del mismo JSON. De momento todos los juegos están marcados como `coming-soon`.
- **Mecánica del juego:** cuando vayamos a implementar un juego, su código irá separado en `public/games/` (por ejemplo, `public/games/day-01.js`). Crearemos esa carpeta al añadir el primer juego; `public/script.js` se mantiene para la lógica común del calendario.
- **Diseño compartido del libro o del calendario:** edita `public/styles.css`; el HTML común está en `public/index.html`.

El JSON del día 1 sirve de plantilla para los siguientes. Los días sin archivo de contenido siguen mostrando el aviso de “próximamente” y no suman progreso al abrirlos.

## Abrir en local

Necesitas Python 3 y un navegador web.

1. Clona el repositorio y entra en su carpeta:

   ```powershell
   git clone <URL_DEL_REPOSITORIO>
   cd <CARPETA_DEL_REPOSITORIO>
   ```

2. Desde la raíz del proyecto, inicia un servidor web local:

   ```powershell
   python -m http.server 8000 --directory public
   ```

3. Abre [http://localhost:8000](http://localhost:8000).
4. Para detener el servidor, vuelve a la terminal y pulsa `Ctrl+C`.

También puedes abrir `public/index.html` directamente, aunque el servidor local ofrece una experiencia más parecida al sitio desplegado.

## Desbloqueo, progreso y datos guardados

En `public/script.js`, `testMode` está temporalmente en `true`, por lo que el día 1 se puede probar antes de diciembre. Antes de publicar el calendario, cambia ese valor a `false`. A partir de entonces se desbloquearán los días automáticamente del 1 al 24 de diciembre de 2026, según la fecha local del dispositivo. Puedes cambiar `calendarYear` si preparas el calendario para otro año.

Al abrir un día por primera vez, queda marcado y suma una sola vez a la barra de progreso. Se puede volver a abrir. El estado se guarda en `localStorage` del navegador y dispositivo actuales; borrar sus datos del sitio lo reinicia.

Para este detalle personal no hace falta iniciar sesión: Render puede servir la web como sitio estático y `localStorage` mantiene el progreso en ese navegador. No sincroniza entre dispositivos ni impide que una persona técnica altere la fecha o el código en su navegador. Si más adelante necesitas progreso compartido, cuentas o desbloqueo realmente controlado por servidor, hará falta un backend con base de datos y autenticación.

## Publicar en Render

La aplicación es un sitio estático, sin backend ni compilación. En Render, crea un **Static Site** conectado a tu repositorio y configura:

- **Root Directory**: vacío.
- **Build Command**: `echo "No build required"` (no hay proceso de compilación).
- **Publish Directory**: `public`.

Render publicará el sitio y te proporcionará una URL. Puedes activar los despliegues automáticos para que se actualice al subir cambios a GitHub.

## Tecnologías

HTML, CSS y JavaScript sin frameworks ni dependencias. Las tipografías se cargan desde Google Fonts; sin conexión, se utilizan fuentes alternativas disponibles en el dispositivo.
