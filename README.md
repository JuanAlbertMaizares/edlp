# 🔴⚪ EDLP API

API REST con información de **Estudiantes de La Plata** en la **Copa Libertadores 2026**: datos del club, el torneo, el estadio, la dirigencia, el cuerpo técnico y el plantel.

Es un proyecto simple de solo lectura: los datos se sirven desde un archivo JSON (`edlp-2026.json`) incluido en el repositorio.

**🌐 API en producción:** https://edlp-latest.onrender.com

> ⏱️ Si el servicio está en un plan gratuito de Render, puede "dormirse" por inactividad. La primera request después de un rato puede tardar unos segundos en responder.

---

## Stack

- [Bun](https://bun.sh) como runtime
- [Express](https://expressjs.com) 5
- TypeScript
- Docker (imagen publicada en Docker Hub)
- Desplegado en [Render](https://render.com)

---

## Endpoints

Base URL: `https://edlp-latest.onrender.com`

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/api` | Información general: club, torneo, estadio, fecha de los datos y estado del torneo |
| GET | `/api/president` | Presidente y comisión directiva |
| GET | `/api/staff` | Director deportivo y cuerpo técnico |
| GET | `/api/players` | Plantel actual completo |
| GET | `/api/players/dorsal/:dorsal` | Jugadores por número de dorsal |
| GET | `/api/players/position/:pos` | Jugadores por posición |
| GET | `/api/players/search?q=texto` | Búsqueda de jugadores por nombre |
| GET | `/api/tournament-status` | Estado detallado del torneo y partidos disputados |


## Ejemplos de uso

### cURL

```bash
# Información general del club, torneo y estadio
curl https://edlp-latest.onrender.com/api

# Presidente y comisión directiva
curl https://edlp-latest.onrender.com/api/president

# Cuerpo técnico y director deportivo
curl https://edlp-latest.onrender.com/api/staff

# Todo el plantel
curl https://edlp-latest.onrender.com/api/players

# Jugadores con dorsal 9
curl https://edlp-latest.onrender.com/api/players/dorsal/9

# Todos los delanteros
curl https://edlp-latest.onrender.com/api/players/position/delantero

# Buscar jugadores por nombre
curl "https://edlp-latest.onrender.com/api/players/search?q=carrillo"

# Estado del torneo
curl https://edlp-latest.onrender.com/api/tournament-status
```

> 💡 Si tenés [`jq`](https://jqlang.github.io/jq/) instalado, podés ver las respuestas formateadas:
>
> ```bash
> curl -s https://edlp-latest.onrender.com/api/players | jq
> ```


### TypeScript (Bun / Node 18+)

```ts
const BASE_URL = "https://edlp-latest.onrender.com";

async function getPlayersByPosition(position: string) {
  const res = await fetch(`${BASE_URL}/api/players/position/${position}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: no se encontraron jugadores`);
  }
  return res.json();
}

const delanteros = await getPlayersByPosition("delantero");
console.log(delanteros);
```
 

---

## Formato de las respuestas

Todas las respuestas son JSON. A modo de referencia, estas son las formas generales (los campos concretos dependen del archivo `edlp-2026.json`):

**`GET /api`**

```json
{
  "club": { "...": "..." },
  "torneo": { "...": "..." },
  "estadio": { "...": "..." },
  "datos_al": "...",
  "estado_torneo": { "...": "..." }
}
```

**`GET /api/staff`**

```json
{
  "director_deportivo": { "...": "..." },
  "cuerpo_tecnico": { "...": "..." }
}
```

**`GET /api/players`** y las búsquedas de jugadores devuelven una lista:

```json
[
  { "nombre": "...", "dorsal": 0, "posicion": "..." }
]
```

**Error (`404`)**

```json
{ "error": "No se encontró ningún jugador con ese número de dorsal" }
```

---

## Correr el proyecto en local

Requisitos: [Bun](https://bun.sh) instalado.

```bash
# Clonar el repositorio
git clone https://github.com/JuanAlbertMaizares/edlp.git
cd edlp

# Instalar dependencias
bun install

# Iniciar el servidor
bun run index.ts
```

El servidor queda disponible en `http://localhost:3000`.

```bash
curl http://localhost:3000/api
```

---

## Correr con Docker

```bash
# Construir la imagen
docker build -t edlp .

# Ejecutar el contenedor
docker run --rm -p 3000:3000 edlp
```

Después probá `http://localhost:3000/api`.

---

## Estructura del proyecto

```
edlp/
├── index.ts          # Servidor Express y rutas
├── edlp-2026.json    # Datos del club, torneo y plantel
├── package.json
└── Dockerfile
```

---

## Notas

- Los datos corresponden a la fecha indicada en el campo `datos_al` de `/api`.
- Proyecto personal con fines educativos, sin relación oficial con el club.