// Gemini LLM Client
// Integrates with Google's Gemini API for intent interpretation

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ],
    generationConfig: {
        temperature: 0.2, // Low temperature for consistent JSON output
        topP: 0.8,
        maxOutputTokens: 500,
    },
});

// Clean Gemini response to extract JSON
function cleanResponse(text: string): string {
    let cleaned = text.trim();

    // Remove markdown code blocks
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
    }

    // Remove any text before the first {
    const jsonStart = cleaned.indexOf("{");
    if (jsonStart > 0) {
        cleaned = cleaned.slice(jsonStart);
    }

    // Remove any text after the last }
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonEnd !== -1 && jsonEnd < cleaned.length - 1) {
        cleaned = cleaned.slice(0, jsonEnd + 1);
    }

    return cleaned.trim();
}

export async function callGemini(prompt: string): Promise<string> {
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean and return the response
        const cleaned = cleanResponse(text);
        console.log("Gemini cleaned response:", cleaned);

        return cleaned;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
}

// Check if Gemini is configured
export function isGeminiConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10;
}
