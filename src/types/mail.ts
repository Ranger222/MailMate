// Mail type definitions

export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    snippet: string;
    date: string;
    unread: boolean;
    threadId: string;
}

export interface ComposeDraft {
    to: string;
    subject: string;
    body: string;
}

export interface ActiveFilters {
    from?: string;
    unread?: boolean;
    days?: number;
}

export type ViewType = "inbox" | "sent" | "compose" | "detail" | "thread";

export interface UIState {
    currentView: ViewType;
    selectedEmailId?: string;
    composeDraft?: ComposeDraft;
    activeFilters: ActiveFilters;
    confirmationMessage?: string;
}

export interface MailState {
    inbox: Email[];
    sent: Email[];
    loading: boolean;
    error?: string;
}
