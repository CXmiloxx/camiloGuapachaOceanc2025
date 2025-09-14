import { GoogleGenAI } from '@google/genai';
import { config } from '../config/config';
import { Weather } from '../generated/prisma';

export class AskGemini {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: config.GOOGLE_API_KEY || '',
    });
  }

  async ask(question: string, data: Weather[]): Promise<string> {
    // 1. Convertir los registros en texto enriquecido
    const context = data
      .map((w) => {
        return `
Sol ${w.sol}
- Temperatura: min=${w.temp_min ?? 'N/A'}, max=${w.temp_max ?? 'N/A'}, avg=${
          w.temp_avg ?? 'N/A'
        }
- Viento: min=${w.wind_min ?? 'N/A'}, max=${w.wind_max ?? 'N/A'}, avg=${
          w.wind_avg ?? 'N/A'
        }
- Presión: min=${w.pressure_min ?? 'N/A'}, max=${
          w.pressure_max ?? 'N/A'
        }, avg=${w.pressure_avg ?? 'N/A'}
- Estación marciana: ${w.season ?? 'N/A'} (Norte=${
          w.northern_season ?? 'N/A'
        }, Sur=${w.southern_season ?? 'N/A'})
- Mes marciano: ${w.month_ordinal ?? 'N/A'}
- Primer registro: ${w.firstUTC ? w.firstUTC.toISOString() : 'N/A'}
- Último registro: ${w.lastUTC ? w.lastUTC.toISOString() : 'N/A'}
        `;
      })
      .join('\n');

    // 2. Prompt final
    const prompt = `
Estos son los datos meteorológicos en Marte guardados en la base de datos:

${context}

Responde la siguiente pregunta del usuario SOLO usando estos datos.
Pregunta: ${question}
`;

    // 3. Llamada al modelo (texto)
    const response = await this.ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // 4. Extraer respuesta
    return (
      response.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta'
    );
  }
}
