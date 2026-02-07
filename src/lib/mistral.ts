// Mistral LLM Client
// Integrates with Mistral AI API for intent interpretation

import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY || "",
});

// Clean response to extract JSON
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

export async function callMistral(prompt: string): Promise<string> {
    try {
        const response = await mistral.chat.complete({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
            maxTokens: 500,
        });

        const text = response.choices?.[0]?.message?.content || "";
        const cleaned = cleanResponse(typeof text === "string" ? text : JSON.stringify(text));
        console.log("Mistral cleaned response:", cleaned);

        return cleaned;
    } catch (error) {
        console.error("Mistral API error:", error);
        throw error;
    }
}

// Check if Mistral is configured
export function isMistralConfigured(): boolean {
    return !!process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY.length > 10;
}
