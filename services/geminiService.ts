
import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";
import { UserProfile, WeeklyPlan, WeeklyDiet } from "../types";
import { MASTER_EXERCISES } from "../data/exercises";

const actualizarProtocoloNutricionalDeclaration: FunctionDeclaration = {
  name: 'actualizarProtocoloNutricional',
  parameters: {
    type: Type.OBJECT,
    description: 'Actualiza el plan nutricional con pesajes exactos y ajustes de ingredientes.',
    properties: {
      nuevoPlan: {
        type: Type.OBJECT,
        properties: {
          planName: { type: Type.STRING },
          dailyKcal: { type: Type.NUMBER },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayName: { type: Type.STRING },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING, description: 'Peso exacto en gramos (g), mililitros (ml) o unidades claras.' },
                      description: { type: Type.STRING },
                      kcal: { type: Type.NUMBER },
                    },
                    required: ['time', 'name', 'quantity', 'description', 'kcal']
                  }
                }
              },
              required: ['dayName', 'meals']
            }
          }
        },
        required: ['planName', 'dailyKcal', 'days']
      }
    },
    required: ['nuevoPlan'],
  },
};

const TRAINER_PERSONA = `Usted es el Director de Bio-Rendimiento de Rottweider Chile. 
Su comunicación debe ser estrictamente formal, técnica y basada en evidencia científica. 
Trate al usuario de "Usted".

REGLA DE ORO NUTRICIONAL: Todos los planes deben incluir PESAJES EXACTOS. 
No use términos vagos como "una porción" o "un plato". Use siempre gramos (g), mililitros (ml) o unidades precisas.

CONTEXTO DE OBJETIVOS:
- Si el objetivo es 'Déficit Calórico (Pérdida de Grasa)', asegure un balance energético negativo, priorizando saciedad con alimentos económicos de alta densidad nutricional.
- Si el usuario solicita ajustes por presupuesto, mantenga la precisión de los pesajes pero use ingredientes de feria libre chilena.`;

export const getGeminiChatResponse = async (message: string, history: any[]) => {
  const currentDiet = localStorage.getItem('rottweider_diet_plan');
  const userProfile = localStorage.getItem('rottweider_profile');
  const profileContext = userProfile ? `Perfil del Usuario: ${userProfile}` : '';
  const chatContext = currentDiet ? `Protocolo Nutricional Vigente: ${currentDiet}` : 'El usuario aún no tiene un plan generado.';
  
  // Instancia local para asegurar el uso de la API Key más reciente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: { 
      systemInstruction: `${TRAINER_PERSONA}\n\n${profileContext}\n\nCONTEXTO ACTUAL DEL USUARIO:\n${chatContext}\n\nREQUERIMIENTO: Si el usuario pide cambios o informa falta de dinero, use la herramienta para modificar la dieta manteniendo los PESOS EXACTOS.`,
      tools: [{ functionDeclarations: [actualizarProtocoloNutricionalDeclaration] }]
    },
  });

  return response;
};

export const generateAIWeeklyDiet = async (profile: UserProfile, medicalContext: string): Promise<WeeklyDiet> => {
  const prompt = `Como Especialista en Nutrición Deportiva, genere un PLAN NUTRICIONAL SEMANAL formal para Chile:
    DATOS: ${JSON.stringify(profile)}
    MÉDICO: ${medicalContext}
    OBJETIVO ESTRATÉGICO: ${profile.goal}
    
    REQUISITOS TÉCNICOS OBLIGATORIOS:
    1. PESAJES EXACTOS: Cantidades en gramos (g) o ml obligatorias.
    2. ACCESIBILIDAD ECONÓMICA: Ingredientes de bajo costo (ej. avena, huevos, legumbres, jurel, pollo, frutas de feria).
    3. BALANCE CALÓRICO: Si el objetivo es 'Déficit Calórico (Pérdida de Grasa)', ajuste los gramos para cumplir con el déficit necesario según su peso y altura.
    4. ESTRUCTURA JSON: { "planName": "string", "dailyKcal": number, "days": [ { "dayName": "string", "meals": [ { "time": "string", "name": "string", "quantity": "string", "description": "string", "kcal": number } ] } ] }`;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeMedicalExam = async (base64Data: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ inlineData: { mimeType, data: base64Data } }, { text: "Análisis técnico de biomarcadores para optimización nutricional." }] },
    config: { systemInstruction: TRAINER_PERSONA }
  });
  return response.text;
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ inlineData: { mimeType, data: base64Data } }, { text: prompt }] },
    config: { systemInstruction: TRAINER_PERSONA }
  });
  return response.text;
};

export const analyzeEvolutionPhoto = async (base64Data: string, mimeType: string, previousData: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ inlineData: { mimeType, data: base64Data } }, { text: `Evaluación antropométrica formal. Comparativa: ${previousData}.` }] },
    config: { systemInstruction: TRAINER_PERSONA }
  });
  return response.text;
};

export const generateAIWeeklyPlan = async (profile: UserProfile, bioContext?: string): Promise<WeeklyPlan> => {
  const prompt = `Protocolo de Entrenamiento Semanal. Objetivo: ${profile.goal}. JSON: { "days": [ { "dayName": "string", "plannedExercises": [ { "name": "string", "sets": number, "rir": "string", "tempo": "string" } ] } ] }`;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  const raw = JSON.parse(response.text || '{"days":[]}');
  return {
    days: raw.days.map((d: any) => ({
      dayName: d.dayName,
      exercises: d.plannedExercises.map((pe: any) => {
        const base = MASTER_EXERCISES.find(ex => ex.name === pe.name) || MASTER_EXERCISES[0];
        return { ...base, ...pe };
      })
    }))
  };
};
