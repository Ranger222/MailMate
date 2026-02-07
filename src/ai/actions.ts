// Action schema and validation
// Defines the contract between AI output and UI updates

import { AIAction, isValidAction, VALID_ACTIONS } from "@/types/actions";

// Action argument schemas for validation
export const ACTION_SCHEMAS = {
    OPEN_COMPOSE: { args: false },
    FILL_COMPOSE: {
        args: true,
        required: ["to", "subject", "body"],
        types: { to: "string", subject: "string", body: "string" },
    },
    SEND_EMAIL: { args: false },
    FILTER_INBOX: {
        args: true,
        required: [],
        optional: ["from", "unread", "days"],
        types: { from: "string", unread: "boolean", days: "number" },
    },
    OPEN_EMAIL: {
        args: true,
        required: ["emailId"],
        types: { emailId: "string" },
    },
    REPLY_CURRENT: {
        args: true,
        required: ["body"],
        types: { body: "string" },
    },
    ASK_CONFIRMATION: {
        args: true,
        required: ["message"],
        types: { message: "string" },
    },
    VIEW_INBOX: { args: false },
    VIEW_SENT: { args: false },
    CLEAR_FILTERS: { args: false },
    SEARCH_EMAILS: {
        args: true,
        required: ["query"],
        types: { query: "string" },
    },
} as const;

// Parse and validate AI response
export function parseAIResponse(response: string): AIAction | { error: string } {
    try {
        // Clean the response (remove markdown code blocks if present)
        let cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.slice(7);
        }
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.slice(0, -3);
        }
        cleaned = cleaned.trim();

        const parsed = JSON.parse(cleaned);

        if (!isValidAction(parsed)) {
            return {
                error: `Invalid action: ${parsed.action}. Valid actions are: ${VALID_ACTIONS.join(", ")}`,
            };
        }

        return parsed;
    } catch (e) {
        return {
            error: `Failed to parse AI response as JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
        };
    }
}

// Generate action description for chat display
export function describeAction(action: AIAction): string {
    switch (action.action) {
        case "OPEN_COMPOSE":
            return "Opening compose email...";
        case "FILL_COMPOSE":
            return `Composing email to ${action.args.to}: "${action.args.subject}"`;
        case "SEND_EMAIL":
            return "Sending email...";
        case "FILTER_INBOX": {
            const parts: string[] = [];
            if (action.args.from) parts.push(`from: ${action.args.from}`);
            if (action.args.unread) parts.push("unread only");
            if (action.args.days) parts.push(`last ${action.args.days} days`);
            return `Filtering inbox (${parts.join(", ") || "all"})`;
        }
        case "OPEN_EMAIL":
            return "Opening email...";
        case "REPLY_CURRENT":
            return "Preparing reply...";
        case "ASK_CONFIRMATION":
            return action.args.message;
        case "VIEW_INBOX":
            return "Navigating to inbox...";
        case "VIEW_SENT":
            return "Navigating to sent mail...";
        case "CLEAR_FILTERS":
            return "Clearing all filters...";
        case "SEARCH_EMAILS":
            return `Searching: "${action.args.query}"`;
        default:
            return "Processing...";
    }
}
