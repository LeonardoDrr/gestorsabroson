# Gestor de Avance 🎯

Aplicación web para gestionar proyectos con tareas recursivas y seguimiento de progreso en tiempo real.

## Características

- ✅ **Tareas Recursivas**: Crea subtareas dentro de subtareas sin límite
- 📊 **Barra de Progreso**: Visualización del porcentaje de completitud
- 🔄 **Sincronización en Tiempo Real**: Usa Firebase Firestore
- 🌙 **Tema Oscuro**: Diseño moderno y agradable
- ⌨️ **Atajos de Teclado**: Presiona Enter para agregar tareas rápido

## Cómo Usar

1. Abre `index.html` en tu navegador
2. Escribe una tarea principal y presiona **Enter** o clic en **+ Agregar**
3. Haz clic en el botón **+** junto a cualquier tarea para agregar subtareas
4. Marca las tareas completadas con el checkbox verde
5. Edita cualquier texto haciendo clic sobre él

## Configuración de Firebase

Si necesitas usar tu propia base de datos:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Configura las reglas (ver `INSTRUCCIONES_FIREBASE.md`)
5. Reemplaza la configuración en `index.html` (línea ~326)

## Estructura

```
gestor-de-avance/
├── index.html              # Archivo principal (todo incluido)
├── README.md              # Este archivo
└── INSTRUCCIONES_FIREBASE.md  # Guía de configuración
```

## Tecnologías

- HTML5 + CSS3
- JavaScript Vanilla (ES6+)
- Firebase Firestore (CDN)
- Remix Icon

## Licencia

MIT
