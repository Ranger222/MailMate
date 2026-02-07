import { create } from "zustand";
import { Email, ActiveFilters } from "@/types/mail";

interface MailStore {
    // State
    inbox: Email[];
    sent: Email[];
    searchResults: Email[];
    searchQuery: string;
    loading: boolean;
    error?: string;
    lastFetch?: number;
    dataSource: "gmail" | "mock";

    // Actions
    setInbox: (emails: Email[]) => void;
    setSent: (emails: Email[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error?: string) => void;
    markAsRead: (emailId: string) => void;
    addToSent: (email: Email) => void;
    setSearchResults: (emails: Email[], query: string) => void;
    clearSearch: () => void;

    // Filtered getters
    getFilteredInbox: (filters: ActiveFilters) => Email[];
    getEmailById: (id: string) => Email | undefined;

    // API calls
    fetchInbox: () => Promise<void>;
    fetchSent: () => Promise<void>;
    sendEmail: (to: string, subject: string, body: string) => Promise<boolean>;
    searchEmails: (query: string) => Promise<void>;
}

export const useMailStore = create<MailStore>((set, get) => ({
    // Initial state
    inbox: [],
    sent: [],
    searchResults: [],
    searchQuery: "",
    loading: false,
    error: undefined,
    lastFetch: undefined,
    dataSource: "mock" as const,

    // Setters
    setInbox: (emails) => set({ inbox: emails, lastFetch: Date.now() }),
    setSent: (emails) => set({ sent: emails }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    markAsRead: (emailId) =>
        set((state) => ({
            inbox: state.inbox.map((email) =>
                email.id === emailId ? { ...email, unread: false } : email
            ),
        })),

    addToSent: (email) =>
        set((state) => ({
            sent: [email, ...state.sent],
        })),

    setSearchResults: (emails, query) =>
        set({ searchResults: emails, searchQuery: query }),

    clearSearch: () =>
        set({ searchResults: [], searchQuery: "" }),

    // Get filtered inbox based on active filters
    getFilteredInbox: (filters) => {
        const { inbox } = get();

        return inbox.filter((email) => {
            // Filter by sender
            if (filters.from && !email.from.toLowerCase().includes(filters.from.toLowerCase())) {
                return false;
            }

            // Filter by unread status
            if (filters.unread !== undefined && email.unread !== filters.unread) {
                return false;
            }

            // Filter by days (emails from last N days)
            if (filters.days) {
                const emailDate = new Date(email.date);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - filters.days);
                if (emailDate < cutoffDate) {
                    return false;
                }
            }

            return true;
        });
    },

    // Get single email by ID
    getEmailById: (id) => {
        const state = get();
        return state.inbox.find((e) => e.id === id) || state.sent.find((e) => e.id === id);
    },

    // Fetch inbox from API
    fetchInbox: async () => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch("/api/mail/inbox");
            if (!response.ok) throw new Error("Failed to fetch inbox");
            const data = await response.json();
            set({ inbox: data.emails, loading: false, lastFetch: Date.now() });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                loading: false,
            });
        }
    },

    // Fetch sent emails from API
    fetchSent: async () => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch("/api/mail/sent");
            if (!response.ok) throw new Error("Failed to fetch sent");
            const data = await response.json();
            set({ sent: data.emails, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                loading: false,
            });
        }
    },

    // Send email via API
    sendEmail: async (to, subject, body) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch("/api/mail/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to, subject, body }),
            });
            if (!response.ok) throw new Error("Failed to send email");

            const data = await response.json();

            // Add to sent folder optimistically
            set((state) => ({
                sent: [data.email, ...state.sent],
                loading: false,
            }));

            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to send",
                loading: false,
            });
            return false;
        }
    },

    // Search emails via API
    searchEmails: async (query) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`/api/mail/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Search failed");
            const data = await response.json();
            set({
                searchResults: data.emails,
                searchQuery: query,
                loading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Search failed",
                loading: false,
            });
        }
    },
}));
