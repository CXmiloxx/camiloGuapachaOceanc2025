// src/services/google.service.ts
import { GoogleGenAI } from '@google/genai';
import { config } from '../config/config';
import { Weather } from '../generated/prisma';

export class AskGemini {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: config.GOOGLE_API_KEY,
    });
  }

  private buildPrompt(question: string, data: Weather[]): string {
    if (!data.length) {
      return `
No hay datos meteorológicos disponibles en la base de datos en este momento.  
Pregunta del usuario: ${question}
    `;
    }

    const context = data
      .map(
        (w) => `
Sol ${w.sol}
- Temperatura: min=${w.temp_min ?? 'N/A'}, max=${w.temp_max ?? 'N/A'}, avg=${w.temp_avg ?? 'N/A'}
- Viento: min=${w.wind_min ?? 'N/A'}, max=${w.wind_max ?? 'N/A'}, avg=${w.wind_avg ?? 'N/A'}
- Presión: min=${w.pressure_min ?? 'N/A'}, max=${w.pressure_max ?? 'N/A'}, avg=${w.pressure_avg ?? 'N/A'}
- Estación: ${w.season ?? 'N/A'} (Norte=${w.northern_season ?? 'N/A'}, Sur=${w.southern_season ?? 'N/A'})
- Mes marciano: ${w.month_ordinal ?? 'N/A'}
- Periodo: ${w.firstUTC ? w.firstUTC.toISOString() : 'N/A'} → ${w.lastUTC ? w.lastUTC.toISOString() : 'N/A'}
      `,
      )
      .join('\n');

    return `
- Eres un asistente especializado en meteorología marciana con acceso a datos reales de la NASA.
- SOLO puedes responder basándote en los datos listados a continuación.  
- Si la pregunta no puede responderse con estos datos, responde claramente: "No se puede responder con los datos disponibles."  
- Explica de manera breve, clara y en español.  
- Si mencionas valores, incluye las unidades correctas (ej. °C para temperatura, Pa para presión, m/s para viento).  
- No inventes información ni uses conocimiento externo.  

DATOS DISPONIBLES:
${context}

PREGUNTA DEL USUARIO:
${question}

RESPUESTA:
  `;
  }

  async ask(question: string, data: Weather[]): Promise<string> {
    try {
      const prompt = this.buildPrompt(question, data);

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });

      const answer =
        response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!answer) {
        return 'No se pudo generar una respuesta con los datos disponibles.';
      }

      return answer;
    } catch (error: any) {
      console.error(
        '❌ Error en AskGemini.ask:',
        error.response?.data || error.message,
      );
      throw new Error('Error al comunicarse con el modelo de IA');
    }
  }
}
