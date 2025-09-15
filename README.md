````markdown
# 🌌 Camilo Guapacha Oceanic 2025

Este proyecto es una **API en Node.js y TypeScript** que integra datos de la **NASA (InSight Weather API)** y un agente de **Google Gemini** para responder preguntas sobre Marte.  
Se construyó con **Express** para la gestión de rutas HTTP y **Prisma ORM** para manejar una base de datos SQLite.

El objetivo principal es:

- Obtener datos meteorológicos de Marte desde la API de NASA.
- Guardar esa información en una base de datos local.
- Permitir que un agente de IA (Google Gemini) responda preguntas basadas en dichos datos.

---

## ✨ Características

- 🔭 **Integración con NASA InSight API** → consumo de datos meteorológicos en Marte.
- 🧠 **Agente IA con Google Gemini** → responde preguntas sobre los datos almacenados.
- 🗄️ **Base de datos SQLite con Prisma ORM** → migraciones, tipado y consultas eficientes.
- ⚙️ **Configuración flexible** → variables de entorno para claves, puerto y conexión.
- 🛠️ **TypeScript + Express** → desarrollo robusto y mantenible.
- 🚀 **Scripts de desarrollo** con nodemon y ts-node.

---

## 🛠️ Requisitos previos

Antes de instalar, asegúrate de tener:

- [Node.js v22+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (o npm/yarn)
- Claves de API:
  - [NASA API Key](https://api.nasa.gov/)
  - [Google AI Studio (Gemini API Key)](https://aistudio.google.com/)

---

## ⚙️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/CXmiloxx/camiloGuapachaOceanc2025.git
   cd camiloGuapachaOceanc2025
   ```
````

2. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo `.env.example` a `.env` y añade tus claves:

   ```env
   PORT=3000
   NODE_ENV=development
   NASA_API_KEY=tu_clave_nasa
   GOOGLE_API_KEY=tu_clave_google
   DATABASE_URL="file:./dev.db"
   ```

4. **Ejecutar migraciones de Prisma:**

   ```bash
   pnpm run prisma:migrate
   pnpm run prisma:generate
   ```

5. **Iniciar el servidor:**

   ```bash
   pnpm dev
   ```

   El servidor se levantará en `http://localhost:3000`.

---

## 📂 Estructura del Proyecto

```
camiloGuapachaOceanc2025/
├── .env.example         # Variables de entorno de ejemplo
├── package.json         # Dependencias y scripts
├── prisma/              # Esquema y migraciones de Prisma
│   └── schema.prisma
├── src/
│   ├── config/          # Configuración global
│   ├── controllers/     # Controladores (ej: nasa.controller.ts)
│   ├── generated/       # Prisma Client generado
│   ├── routes/          # Rutas HTTP
│   ├── services/        # Integraciones externas (NASA, Google, Axios)
│   ├── types/           # Tipos TypeScript
│   └── index.ts         # Punto de entrada
└── tsconfig.json        # Configuración de TypeScript
```

---

## 🔌 Endpoints principales

### 🌍 NASA

- **`GET /api/nasa`** → Consume la API de NASA y guarda datos meteorológicos en la BD.
  **Response:**

  ```json
  {
    "message": "✅ Datos guardados/actualizados en la BD",
    "count": 7,
    "sols": ["675", "676", "677"]
  }
  ```

### 🤖 Preguntas con IA

- **`POST /api/ask`** → Envía una pregunta a Gemini basada en los datos guardados.
  **Request:**

  ```json
  {
    "question": "¿Cuál fue el sol más frío en los datos registrados?"
  }
  ```

  **Response:**

  ```json
  {
    "question": "¿Cuál fue el sol más frío en los datos registrados?",
    "answer": "El sol 677 fue el más frío con una temperatura mínima de -97.2 °C."
  }
  ```