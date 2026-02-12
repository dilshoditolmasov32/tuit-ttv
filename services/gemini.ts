
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getAiResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Siz Televizion texnologiyalari fakultetining aqlli yordamchisiz. Talabalarga VR, AR, 3D modellashtirish va telekommunikatsiya sohasida yordam berasiz. Javoblarni qisqa va tushunarli qilib bering.",
      },
    });
    // Fix: Ensure we access the text property directly without calling it as a method
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Kechirasiz, hozirda ulanishda muammo yuz berdi.";
  }
};
