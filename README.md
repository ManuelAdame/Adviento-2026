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
│   ├── index.html    # Página y contenido
│   ├── styles.css    # Diseño y estilos adaptables
│   └── script.js     # Casillas y diálogo interactivo
└── README.md
```

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
