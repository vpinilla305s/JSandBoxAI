# JSandBoxIA

Una plataforma web interactiva diseñada para practicar desarrollo web mediante ejercicios generados automáticamente. El usuario puede escribir y probar código HTML, CSS y JavaScript en tiempo real mientras un sistema de inteligencia artificial genera enunciados, evalúa las soluciones y ofrece retroalimentación para guiar el aprendizaje.

---

## Estructura del Proyecto

```
├── backend/
│   ├── api/
│   │   └── main.py         # API REST con FastAPI
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── css/
│   │   └── styles.css      # Todos los estilos de la aplicación
│   ├── img/
│   │   └── logo.svg        # Logo de la aplicación
│   ├── js/
│   │   └── main.js         # Toda la lógica de la aplicación
│   ├── templates/
│   │   ├── default.html    # Plantilla HTML por defecto del editor
│   │   ├── default.css     # Plantilla CSS por defecto del editor
│   │   └── default.js      # Plantilla JS por defecto del editor
│   ├── nginx.conf
│   ├── Dockerfile
│   └── index.html          # Punto de entrada
└── docker-compose.yml
```

---

## Funcionalidades

- **Vista previa en tiempo real** — el resultado del código se actualiza automáticamente mientras el usuario escribe
- **Editores independientes** — áreas separadas para escribir y probar HTML, CSS y JavaScript
- **Generación automática de ejercicios** — creación de enunciados prácticos adaptados al tema y nivel de dificultad seleccionados
- **Validación de soluciones** — comprobación automática de la propuesta del usuario mediante un sistema de evaluación asistido por IA
- **Feedback personalizado** — generación de observaciones, correcciones y recomendaciones de mejora según la solución entregada
- **Pistas progresivas** — ayuda escalonada para guiar al usuario cuando no resuelve correctamente el ejercicio
- **Panel de enunciado** — espacio dedicado para mostrar las instrucciones del ejercicio generado
- **Paneles redimensionables** — posibilidad de ajustar el tamaño relativo entre el editor y la vista previa

---

## Dependencias

### Frontend

| Librería | Versión | Propósito |
|---|---|---|
| [Ace Editor](https://ace.c9.io/) | 1.4.12 | Editor de código con resaltado de sintaxis |
| [Font Awesome](https://fontawesome.com/) | 6.5.1 | Iconos de interfaz |
