import { GoogleGenAI, Type } from "@google/genai";
import { BudgetItem } from "../types";
import { v4 as uuidv4 } from 'uuid'; // We will use a simple random string generator in the component instead of uuid lib to reduce deps, but defining structure here.

const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateBudgetSuggestions = async (
  description: string,
  attendees: number
): Promise<BudgetItem[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Lag et realistisk budsjettforslag for et arrangement i Norge.
  Type arrangement: "${description}".
  Antatt antall deltakere: ${attendees}.

  Returner en liste med budsjettposter.
  - Inkluder både inntekter (f.eks. deltakeravgift, støtte) og kostnader (mat, leie, utstyr).
  - Skill mellom faste kostnader (sum uavhengig av antall) og variable kostnader (avhenger av antall).
  - Bruk realistiske priser i NOK.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Navn på posten, f.eks. 'Middag dag 1'" },
              category: { type: Type.STRING, enum: ["income", "expense"], description: "income eller expense" },
              type: { type: Type.STRING, enum: ["fixed", "variable"], description: "fixed eller variable" },
              amount: { type: Type.NUMBER, description: "Totalbeløp for faste poster. 0 for variable." },
              unitPrice: { type: Type.NUMBER, description: "Pris per enhet for variable poster. 0 for faste." },
              quantity: { type: Type.NUMBER, description: "Antall enheter for variable poster. 0 for faste." }
            },
            required: ["name", "category", "type", "amount", "unitPrice"]
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) return [];

    const parsedData = JSON.parse(rawData);

    // Map to our internal type and add IDs
    return parsedData.map((item: any) => ({
      id: generateId(),
      name: item.name,
      category: item.category,
      type: item.type,
      amount: item.type === 'fixed' ? item.amount : (item.quantity || attendees) * item.unitPrice,
      quantity: item.type === 'variable' ? (item.quantity || attendees) : undefined,
      unitPrice: item.type === 'variable' ? item.unitPrice : undefined,
    }));

  } catch (error) {
    console.error("Feil ved generering av budsjett:", error);
    throw error;
  }
};
