
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function extractPdfContent(base64Data: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Data,
              },
            },
            {
              text: "Please extract the key professional information from this teacher's proof document. Summarize the event, dates, participants, and any certifications mentioned in a concise professional summary.",
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
        systemInstruction: "You are an AI document analysis assistant for a teacher portfolio system. Provide accurate, professional summaries based strictly on the provided PDF content.",
      }
    });

    return response.text || "No content extracted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error extracting PDF content. Please check if the file is a valid PDF.";
  }
}
