# JSandBoxAI
Una plataforma web interactiva diseñada para practicar desarrollo web mediante ejercicios generados automáticamente. El usuario puede escribir y probar código HTML, CSS y JavaScript en tiempo real mientras un sistema de inteligencia artificial genera enunciados, evalúa las soluciones y ofrece retroalimentación para guiar el aprendizaje.


## Estructura del Proyecto

```
├── backend/
│   ├── api/
│   │   ├── llm/
│   │   │   ├── prompts/
│   │   │   │   ├── system/
│   │   │   │   │   ├── create_exercise.md   # Prompt de sistema para generar ejercicios
│   │   │   │   │   └── correct_exercise.md  # Prompt de sistema para corregir soluciones
│   │   │   │   └── user/
│   │   │   │       ├── create_exercise.md   # Prompt de usuario para generar ejercicios
│   │   │   │       └── correct_exercise.md  # Prompt de usuario para corregir soluciones
│   │   │   └── client.py    # Cliente LLM genérico basado en LiteLLM
│   │   ├── main.py          # API REST con FastAPI (endpoints)
│   │   │   schemas.py       # Modelos Pydantic de entrada/salida de la API
│   │   └── utils.py
│   └── Dockerfile
├── frontend/
│   ├── css/
│   │   └── styles.css       # Todos los estilos de la aplicación
│   ├── img/
│   │   └── logo.svg         # Logo de la aplicación
│   ├── js/
│   │   └── main.js          # Toda la lógica de la aplicación
│   ├── templates/
│   │   ├── default.html     # Plantilla HTML por defecto del editor
│   │   ├── default.css      # Plantilla CSS por defecto del editor
│   │   └── default.js       # Plantilla JS por defecto del editor
│   ├── nginx.conf           # Configuración de Nginx (sirve estáticos y proxifica /api/)
│   ├── Dockerfile
│   └── index.html           # Punto de entrada
├── .env.example             # Ejemplo de las variables de entorno a declarar en producción
└── docker-compose.yml
```


## Funcionalidades

- **Vista previa en tiempo real** — el resultado del código se actualiza automáticamente mientras el usuario escribe
- **Editores independientes** — áreas separadas para escribir y probar HTML, CSS y JavaScript
- **Generación automática de ejercicios** — creación de enunciados prácticos adaptados al tema y nivel de dificultad seleccionados (fácil, medio, difícil)
- **Validación de soluciones** — comprobación automática de la solución del usuario mediante un sistema de evaluación asistido por IA
- **Feedback personalizado** — generación de observaciones, correcciones y recomendaciones de mejora según la solución entregada
- **Pistas progresivas** — ayuda de 3 pistas progresivas para guiar al usuario cuando no resuelva correctamente el ejercicio
- **Panel de enunciado** — espacio dedicado para mostrar las instrucciones del ejercicio generado
- **Paneles redimensionables** — posibilidad de ajustar el tamaño relativo entre el editor y la vista previa
- **Regeneración de ejercicios** — opción de generar una nueva variante del ejercicio descrito sin salir del modal




## API

El backend expone dos siguientes endpoints:

### `POST /api/create-exercise`

Genera un nuevo ejercicio a partir de una descripción y nivel de dificultad.

**Cuerpo de la petición:**
```json
{
  "description": "eventos del DOM",
  "level": "easy"
}
```

**Respuesta:**
```json
{
  "title": "Título del ejercicio",
  "statement": "Enunciado completo...",
  "hints": ["Pista 1", "Pista 2", "Pista 3"],
  "requirements": ["Requisito verificable 1", "Requisito verificable 2"]
}
```


### `POST /api/correct-exercise`

Evalúa la solución entregada por el usuario comparándola con los requisitos que debe cumplir el ejercicio para que sea considerado como resuelto.

**Cuerpo de la petición:**
```json
{
  "html": "...",
  "css": "...",
  "js": "...",
  "statement": "Enunciado del ejercicio",
  "requirements": ["Requisito 1", "Requisito 2"]
}
```

**Respuesta:**
```json
{
  "passed": true,
  "summary": "¡Buen trabajo! Has superado correctamente el ejercicio.",
  "unmet_requirements": [],
  "feedback": "Explicación breve y orientativa..."
}
```


## Dependencias

### Backend

| Paquete | Propósito |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | Framework para la API REST |
| [Uvicorn](https://www.uvicorn.org/) | Servidor ASGI para ejecutar FastAPI |
| [LiteLLM](https://docs.litellm.ai/) | Cliente unificado para llamadas a LLMs (OpenAI, vLLM, etc.) |
| [Pydantic](https://docs.pydantic.dev/) | Validación de esquemas de entrada y salida |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | Carga de variables de entorno desde `.env` |

### Frontend

| Librería | Versión | Propósito |
|---|---|---|
| [Ace Editor](https://ace.c9.io/) | 1.4.12 | Editor de código con resaltado de sintaxis |
| [Font Awesome](https://fontawesome.com/) | 6.5.1 | Iconos de interfaz |

---

## Variables de entorno

El backend se configura a través de un fichero `.env` en la raíz del proyecto:

```env
LLM_MODEL=         # Nombre del modelo a usar (ej: openai/Qwen/Qwen3-4B-Instruct-2507, gpt-5.1-codex-mini)
LLM_API_KEY=       # Clave de API del proveedor LLM
API_BASE_URL=      # (Opcional) URL base de la API, necesaria para proveedores alternativos como vLLM
```

> El campo `API_BASE_URL` es opcional. Si se omite, LiteLLM usará el endpoint por defecto del proveedor (por ejemplo, la API oficial de OpenAI). Es necesario cuando se usa un servidor LLM propio o compatible con la API de OpenAI, como vLLM.

---

## Puesta en marcha

### Requisitos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

### Pasos

1. Clonar el repositorio
2. Crear el fichero `.env` en la raíz con las variables indicadas arriba
3. Ejecutar:

```bash
docker-compose up --build
```

La aplicación estará disponible en [http://localhost](http://localhost).

El backend queda expuesto internamente en el puerto `8000` y el frontend en el puerto `80`. Nginx actúa como proxy inverso, redirigiendo las peticiones a `/api/` hacia el servicio de backend.
