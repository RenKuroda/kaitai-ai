
export interface FileWithPreview {
  id: string;
  file: File;
  preview: string; // base64 data URL
}

export interface EstimationResult {
  text: string;
  // If structured data is expected, add more fields here
  // e.g., totalCost?: number; breakdown?: Array<{ item: string; cost: number }>;
}

// Gemini API related types (simplified for this context)
export interface GeminiImagePart {
  inlineData: {
    mimeType: string;
    data: string; // base64 encoded string
  };
}

export interface GeminiTextPart {
  text: string;
}

export type GeminiPart = GeminiImagePart | GeminiTextPart;
