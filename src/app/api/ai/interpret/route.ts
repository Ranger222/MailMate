import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/ai/prompt";
import { parseAIResponse } from "@/ai/actions";
import { callGemini, isGeminiConfigured } from "@/lib/gemini";
import { callMistral, isMistralConfigured } from "@/lib/mistral";

// Get configured LLM provider
function getLLMProvider(): "gemini" | "mistral" | null {
    const provider = process.env.LLM_PROVIDER?.toLowerCase();

    if (provider === "gemini" && isGeminiConfigured()) {
        return "gemini";
    }
    if (provider === "mistral" && isMistralConfigured()) {
        return "mistral";
    }

    // Auto-detect: prefer Mistral if configured, then Gemini
    if (isMistralConfigured()) return "mistral";
    if (isGeminiConfigured()) return "gemini";

    return null;
}

// Call the configured LLM
async function callLLM(prompt: string): Promise<{ response: string; source: string }> {
    const provider = getLLMProvider();

    if (provider === "mistral") {
        const response = await callMistral(prompt);
        return { response, source: "mistral" };
    }

    if (provider === "gemini") {
        const response = await callGemini(prompt);
        return { response, source: "gemini" };
    }

    throw new Error("No LLM provider configured. Set MISTRAL_API_KEY or GEMINI_API_KEY in .env.local");
}

// Simple fallback for complete failures
function getFallbackResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    if (lower.includes("compose") || lower.includes("write") || lower.includes("new email")) {
        return JSON.stringify({ action: "OPEN_COMPOSE" });
    }
    if (lower.includes("inbox")) {
        return JSON.stringify({ action: "VIEW_INBOX" });
    }
    if (lower.includes("sent")) {
        return JSON.stringify({ action: "VIEW_SENT" });
    }

    return JSON.stringify({
        action: "ASK_CONFIRMATION",
        args: { message: "I'm sorry, the AI service encountered an error. Please try again." },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { message, context } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Build prompt with context
        const prompt = buildPrompt(message, context || {});

        let llmResponse: string;
        let llmSource: string;

        try {
            const result = await callLLM(prompt);
            llmResponse = result.response;
            llmSource = result.source;
            console.log(`LLM (${llmSource}) response:`, llmResponse);
        } catch (error) {
            console.error("LLM error:", error);
            llmResponse = getFallbackResponse(message);
            llmSource = "fallback";
        }

        // Parse and validate response
        const parsed = parseAIResponse(llmResponse);

        if ("error" in parsed) {
            console.error("Parse error:", parsed.error, "Raw:", llmResponse);

            return NextResponse.json({
                action: {
                    action: "ASK_CONFIRMATION",
                    args: {
                        message: "I had trouble processing that request. Could you try rephrasing it?"
                    }
                },
                source: llmSource,
                parseError: parsed.error
            });
        }

        return NextResponse.json({
            action: parsed,
            source: llmSource
        });
    } catch (error) {
        console.error("Interpret error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to interpret" },
            { status: 500 }
        );
    }
}
