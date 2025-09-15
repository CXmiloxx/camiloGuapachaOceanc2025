import { NasaService } from '../services/nasa.services';
import { Request, Response } from 'express';
import { WeatherData } from '../types/weather.types';
import { PrismaClient } from '../generated/prisma';
import { AskGemini } from '../services/google.service';

const prisma = new PrismaClient();

export class NasaController {
  private nasaService: NasaService;
  private askGemini: AskGemini;
  constructor() {
    this.nasaService = new NasaService();
    this.askGemini = new AskGemini();
  }

  getAllNasaData = async (req: Request, res: Response) => {
    try {
      const raw = await this.nasaService.fetchAllData();

      // Sols = días marcianos
      const sols: string[] = raw.sol_keys ?? [];

      const records = sols.map((sol: string) => {
        const entry = raw[sol];
        return {
          sol,
          temp_min: entry?.AT?.mn ?? null,
          temp_max: entry?.AT?.mx ?? null,
          temp_avg: entry?.AT?.av ?? null,

          wind_min: entry?.HWS?.mn ?? null,
          wind_max: entry?.HWS?.mx ?? null,
          wind_avg: entry?.HWS?.av ?? null,

          pressure_min: entry?.PRE?.mn ?? null,
          pressure_max: entry?.PRE?.mx ?? null,
          pressure_avg: entry?.PRE?.av ?? null,

          firstUTC: entry?.First_UTC ? new Date(entry.First_UTC) : null,
          lastUTC: entry?.Last_UTC ? new Date(entry.Last_UTC) : null,

          season: entry?.Season ?? null,
          month_ordinal: entry?.Month_ordinal ?? null,
          northern_season: entry?.Northern_season ?? null,
          southern_season: entry?.Southern_season ?? null,
        };
      });

      for (const record of records) {
        const payload = {
          sol: record.sol,
          temp_min: record.temp_min,
          temp_max: record.temp_max,
          temp_avg: record.temp_avg,
          wind_min: record.wind_min,
          wind_max: record.wind_max,
          wind_avg: record.wind_avg,
          pressure_min: record.pressure_min,
          pressure_max: record.pressure_max,
          pressure_avg: record.pressure_avg,
          firstUTC: record.firstUTC,
          lastUTC: record.lastUTC,
          season: record.season,
          month_ordinal: record.month_ordinal,
          northern_season: record.northern_season,
          southern_season: record.southern_season,
        };

        await prisma.weather.upsert({
          where: { sol: record.sol },
          update: payload,
          create: payload,
        });
      }

      res.json({
        message: '✅ Datos guardados en la BD',
        count: records.length,
        sols,
      });
    } catch (error: any) {
      console.error('❌ Error al procesar datos de la NASA:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor',
      });
    }
  };

  askQuestion = async (req: Request, res: Response) => {
    try {
      const { question } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({
          error: 'Se requiere una pregunta válida en el campo "question".',
        });
      }

      // 1. Leer todos los registros de la BD
      const records = await prisma.weather.findMany({
        orderBy: { sol: 'asc' },
      });

      if (records.length === 0) {
        return res.status(404).json({
          question,
          answer: 'No hay datos en la base de datos.',
        });
      }

      // 2. Enviar a Gemini
      const answer = await this.askGemini.ask(question, records);

      return res.json({
        success: true,
        question,
        answer,
      });
    } catch (error: any) {
      console.error('Error en askQuestion:', error);

      return res.status(500).json({
        error: '❌ Error interno al procesar la pregunta con la IA',
        details: error.message || 'Unexpected error',
      });
    }
  };
}
