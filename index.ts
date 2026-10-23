import express from "express";
import type { Request, Response } from "express";
import data from "./edlp-2026.json";

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Información general del club, torneo y estadio
app.get("/api", (req: Request, res: Response) => {
  res.json({
    club: data.club,
    torneo: data.torneo,
    estadio: data.estadio,
    datos_al: data.datos_al,
    estado_torneo: data.estado_torneo
  });
});

// 2. Información del Presidente y comisión directiva
app.get("/api/president", (req: Request, res: Response) => {
  res.json(data.presidente);
});

// 3. Cuerpo técnico y director deportivo
app.get("/api/staff", (req: Request, res: Response) => {
  res.json({
    director_deportivo: data.director_deportivo,
    cuerpo_tecnico: data.cuerpo_tecnico
  });
});

// 4. Obtener todo el plantel actual
app.get("/api/players", (req: Request, res: Response) => {
  res.json(data.plantel_actual);
});

// 5. Buscar jugador por número de dorsal (ej: /api/players/dorsal/9)
app.get("/api/players/dorsal/:dorsal", (req: Request, res: Response) => {
  const dorsalNum = Number(req.params.dorsal);
  // Usamos filter porque en el JSON hay casos especiales con dorsales repetidos (ej: dorsal 34)
  const players = data.plantel_actual.filter((p: any) => p.dorsal === dorsalNum);

  if (players.length === 0) {
    return res.status(404).json({ error: "No se encontró ningún jugador con ese número de dorsal" });
  }
  res.json(players);
});

// 6. Filtrar jugadores por posición (ej: /api/players/position/delantero) 
app.get("/api/players/position/:pos", (req: Request, res: Response) => {
  const positionQuery = (req.params.pos as string).toLowerCase();
  const players = data.plantel_actual.filter(
    (p: any) => p.posicion && p.posicion.toLowerCase() === positionQuery
  );
  
  if (players.length === 0) {
    return res.status(404).json({ error: "No se encontraron jugadores para esa posición" });
  }
  res.json(players);
});

// 7. Buscar jugadores por nombre (ej: /api/players/search?q=carrillo)
app.get("/api/players/search", (req: Request, res: Response) => {
  const query = String(req.query.q || "").toLowerCase();
  
  const results = data.plantel_actual.filter((p: any) => 
    p.nombre && p.nombre.toLowerCase().includes(query)
  );
  
  res.json(results);
});

// 8. Estado detallado del torneo y partidos disputados
app.get("/api/tournament-status", (req: Request, res: Response) => {
  res.json(data.estado_torneo);
});

// Iniciar servidor con Bun
app.listen(PORT, () => {
  console.log(`Pincha el servidor EDLP en http://localhost:${PORT}`);
});