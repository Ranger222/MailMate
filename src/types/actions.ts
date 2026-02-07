// Strict AI Action Contract
// The LLM may ONLY return one of these action types

export type AIAction =
    | { action: "OPEN_COMPOSE" }
    | { action: "FILL_COMPOSE"; args: { to: string; subject: string; body: string } }
    | { action: "SEND_EMAIL" }
    | { action: "FILTER_INBOX"; args: { from?: string; unread?: boolean; days?: number } }
    | { action: "OPEN_EMAIL"; args: { emailId: string } }
    | { action: "REPLY_CURRENT"; args: { body: string } }
    | { action: "ASK_CONFIRMATION"; args: { message: string } }
    | { action: "VIEW_INBOX" }
    | { action: "VIEW_SENT" }
    | { action: "CLEAR_FILTERS" }
    | { action: "SEARCH_EMAILS"; args: { query: string } };

// Action names for validation
export const VALID_ACTIONS = [
    "OPEN_COMPOSE",
    "FILL_COMPOSE",
    "SEND_EMAIL",
    "FILTER_INBOX",
    "OPEN_EMAIL",
    "REPLY_CURRENT",
    "ASK_CONFIRMATION",
    "VIEW_INBOX",
    "VIEW_SENT",
    "CLEAR_FILTERS",
    "SEARCH_EMAILS",
] as const;

export type ActionName = (typeof VALID_ACTIONS)[number];

// Type guard to validate action
export function isValidAction(action: unknown): action is AIAction {
    if (typeof action !== "object" || action === null) return false;
    const a = action as { action?: string };
    return typeof a.action === "string" && VALID_ACTIONS.includes(a.action as ActionName);
}
