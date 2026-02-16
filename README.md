# Gestor de Avance - Pro

Sistema avanzado de gestión de tareas con prioridades, múltiples proyectos y búsqueda inteligente.

## ✨ Características

### 🎯 Gestión de Tareas
- **Tareas jerárquicas ilimitadas**: Crea tareas y subtareas sin límite de profundidad
- **Sistema de prioridades**: 🔴 Alta, 🔵 Media (por defecto), 🟡 Baja
- **Completado automático**: Las tareas padre se completan cuando todas sus subtareas están listas
- **Notas descriptivas**: Agrega descripciones detalladas a cada tarea

### 📁 Múltiples Proyectos
- **Gestión de proyectos**: Crea, edita y elimina proyectos independientes
- **Cambio rápido**: Selector dropdown para cambiar entre proyectos
- **Persistencia**: El proyecto activo se mantiene al recargar

### 🔍 Búsqueda y Filtros
- **Búsqueda en tiempo real**: Encuentra tareas por nombre o notas
- **Ordenar por prioridad**: Organiza tareas automáticamente (Alta → Media → Baja)
- **Búsqueda recursiva**: Busca en toda la jerarquía de tareas

### 💾 Guardado Inteligente
- **Manual**: Botón "Guardar" para sincronizar cuando desees
- **Auto-guardado**: Guardado automático después de 60s sin cambios
- **Indicador visual**: Punto de color que muestra el estado (🟡 sin guardar, 🟢 guardado)
- **Prevención de pérdida**: Alerta si intentas cerrar con cambios sin guardar

### 📊 Interfaz Moderna
- **Diseño oscuro**: Tema oscuro optimizado para largas sesiones
- **Progreso visual**: Barra de progreso total del proyecto
- **Animaciones suaves**: Transiciones fluidas y micro-interacciones
- **Estado expandido**: Las tareas mantienen su estado expandido/colapsado

## 🚀 Uso

1. **Abre** `index.html` en tu navegador
2. **Crea proyectos** desde el selector en la esquina superior izquierda
3. **Agrega tareas** escribiendo en el campo inferior y presionando Enter
4. **Cambia prioridades** haciendo clic en el badge de color
5. **Agrega notas** desde el menú de opciones (3 puntos)
6. **Busca** usando la barra de búsqueda
7. **Ordena** con el botón "Prioridad"
8. **Guarda** manualmente o espera el auto-guardado

## 🔧 Configuración de Firebase

El proyecto utiliza Firebase Firestore para persistencia en tiempo real:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Actualiza las credenciales en `index.html` (líneas 336-342)
4. Configura las reglas de seguridad según tus necesidades

## 📂 Estructura de Archivos

```
gestor-de-avance/
├── index.html              # Aplicación principal (todo-en-uno)
├── README.md               # Este archivo
├── COMO_PUBLICAR.md       # Guía de publicación en GitHub Pages
├── FUNCIONALIDADES_SUGERIDAS.md  # Ideas para futuras mejoras
└── .gitignore             # Archivos ignorados por Git
```

## 🌐 Publicar en GitHub Pages

Sigue las instrucciones en `COMO_PUBLICAR.md` para desplegar tu aplicación.

## 📝 Licencia

MIT License - Siéntete libre de usar y modificar.
