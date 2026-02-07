import { create } from "zustand";
import { ViewType, ComposeDraft, ActiveFilters } from "@/types/mail";

interface UIStore {
    // State
    currentView: ViewType;
    selectedEmailId?: string;
    composeDraft?: ComposeDraft;
    activeFilters: ActiveFilters;
    confirmationMessage?: string;
    assistantHistory: { role: "user" | "assistant"; content: string }[];

    // Actions
    setView: (view: ViewType) => void;
    openEmail: (emailId: string) => void;
    openCompose: () => void;
    openComposeWithDraft: (draft: ComposeDraft) => void;
    updateDraft: (draft: Partial<ComposeDraft>) => void;
    clearDraft: () => void;
    setFilters: (filters: ActiveFilters) => void;
    clearFilters: () => void;
    prefillReply: (body: string) => void;
    setConfirmation: (message?: string) => void;
    addAssistantMessage: (role: "user" | "assistant", content: string) => void;
    clearAssistantHistory: () => void;

    // Context getter for AI
    getContext: () => {
        currentView: ViewType;
        selectedEmailId?: string;
        composeDraft?: ComposeDraft;
        activeFilters: ActiveFilters;
    };
}

export const useUIStore = create<UIStore>((set, get) => ({
    // Initial state
    currentView: "inbox",
    selectedEmailId: undefined,
    composeDraft: undefined,
    activeFilters: {},
    confirmationMessage: undefined,
    assistantHistory: [],

    // View management
    setView: (view) =>
        set({
            currentView: view,
            selectedEmailId: view !== "detail" ? undefined : get().selectedEmailId,
        }),

    openEmail: (emailId) =>
        set({
            currentView: "detail",
            selectedEmailId: emailId,
        }),

    openCompose: () =>
        set({
            currentView: "compose",
            composeDraft: { to: "", subject: "", body: "" },
        }),

    openComposeWithDraft: (draft) =>
        set({
            currentView: "compose",
            composeDraft: draft,
        }),

    updateDraft: (draft) =>
        set((state) => ({
            composeDraft: state.composeDraft
                ? { ...state.composeDraft, ...draft }
                : { to: "", subject: "", body: "", ...draft },
        })),

    clearDraft: () =>
        set({
            composeDraft: undefined,
        }),

    // Filter management
    setFilters: (filters) =>
        set({
            activeFilters: filters,
            currentView: "inbox",
        }),

    clearFilters: () =>
        set({
            activeFilters: {},
        }),

    // Reply prefill
    prefillReply: (body) =>
        set((state) => ({
            currentView: "compose",
            composeDraft: {
                to: "", // Will be filled from selected email context
                subject: "",
                body: body,
            },
        })),

    // Confirmation modal
    setConfirmation: (message) =>
        set({
            confirmationMessage: message,
        }),

    // Assistant chat
    addAssistantMessage: (role, content) =>
        set((state) => ({
            assistantHistory: [...state.assistantHistory, { role, content }],
        })),

    clearAssistantHistory: () =>
        set({
            assistantHistory: [],
        }),

    // Get current UI context for AI
    getContext: () => {
        const state = get();
        return {
            currentView: state.currentView,
            selectedEmailId: state.selectedEmailId,
            composeDraft: state.composeDraft,
            activeFilters: state.activeFilters,
        };
    },
}));
