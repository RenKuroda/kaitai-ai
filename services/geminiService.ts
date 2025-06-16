
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { GeminiImagePart, GeminiTextPart } from "../types";


const getApiKey = (): string => {
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // This is a placeholder for development.
    // In a real application, the API key must be securely managed and present.
    // Throwing an error or handling this case appropriately is crucial.
    console.warn("API_KEY environment variable is not set. Using a dummy key for UI testing. API calls will likely fail.");
    return "DUMMY_API_KEY_FOR_UI_TESTING_ONLY"; // Replace with actual key or ensure env var is set
  }
  return apiKey;
};


const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateDemolitionEstimate = async (prompt: string, imageParts: GeminiImagePart[]): Promise<string> => {
  try {
    const textPart: GeminiTextPart = { text: prompt };
    const contents: Part[] = [textPart, ...imageParts];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: contents },
      // Optional: Add config like temperature, topK, etc. if needed
      // config: {
      //   temperature: 0.7,
      //   topK: 40,
      // }
    });
    
    // Directly access the text property
    const resultText = response.text;
    if (typeof resultText !== 'string') {
        // This case should ideally not happen if the API call is successful and returns text.
        // It's a fallback for unexpected response structures.
        console.error("Gemini API response.text is not a string:", response);
        throw new Error("AIからの応答形式が正しくありません。テキストデータが見つかりませんでした。");
    }

    return resultText;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Check for specific Gemini API error messages if available
        if (error.message.includes("API key not valid")) {
             throw new Error("APIキーが無効です。正しいAPIキーを設定してください。");
        }
        throw new Error(`Gemini APIとの通信に失敗しました: ${error.message}`);
    }
    throw new Error("Gemini APIとの通信中に不明なエラーが発生しました。");
  }
};
