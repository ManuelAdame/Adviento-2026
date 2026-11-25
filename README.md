# Adviento 2026

Un calendario de Adviento web para compartir un detalle navideño con tu pareja. Incluye 24 casillas interactivas y un diseño adaptable a móvil y escritorio. Por ahora, cada casilla abre un mensaje provisional; las sorpresas se podrán añadir más adelante.

## Contenido

- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Abrir en local](#abrir-en-local)
- [Publicar en Render](#publicar-en-render)
- [Tecnologías](#tecnologías)

## Características

- Calendario con 24 días que se pueden abrir.
- Mensaje provisional al seleccionar una casilla.
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

## Tecnologías

HTML, CSS y JavaScript sin frameworks ni dependencias. Las tipografías se cargan desde Google Fonts; sin conexión, se utilizan fuentes alternativas disponibles en el dispositivo.
