// Tests for UI Store

import { useUIStore } from '@/store/uiStore';

describe('UI Store', () => {
    beforeEach(() => {
        // Reset store state before each test
        useUIStore.setState({
            currentView: 'inbox',
            selectedEmailId: undefined,
            composeDraft: undefined,
            activeFilters: {},
            confirmationMessage: undefined,
            assistantHistory: [],
        });
    });

    describe('setView', () => {
        it('should change current view to inbox', () => {
            useUIStore.getState().setView('inbox');
            expect(useUIStore.getState().currentView).toBe('inbox');
        });

        it('should change current view to sent', () => {
            useUIStore.getState().setView('sent');
            expect(useUIStore.getState().currentView).toBe('sent');
        });

        it('should change current view to compose', () => {
            useUIStore.getState().setView('compose');
            expect(useUIStore.getState().currentView).toBe('compose');
        });

        it('should change current view to thread', () => {
            useUIStore.getState().setView('thread');
            expect(useUIStore.getState().currentView).toBe('thread');
        });
    });

    describe('openEmail', () => {
        it('should set selected email ID and change view to detail', () => {
            useUIStore.getState().openEmail('email-123');
            expect(useUIStore.getState().selectedEmailId).toBe('email-123');
            expect(useUIStore.getState().currentView).toBe('detail');
        });
    });

    describe('openCompose', () => {
        it('should change view to compose and initialize empty draft', () => {
            useUIStore.getState().openCompose();
            expect(useUIStore.getState().currentView).toBe('compose');
            expect(useUIStore.getState().composeDraft).toEqual({
                to: '',
                subject: '',
                body: '',
            });
        });
    });

    describe('openComposeWithDraft', () => {
        it('should change view to compose with prefilled draft', () => {
            const draft = {
                to: 'test@example.com',
                subject: 'Test Subject',
                body: 'Test Body',
            };
            useUIStore.getState().openComposeWithDraft(draft);
            expect(useUIStore.getState().currentView).toBe('compose');
            expect(useUIStore.getState().composeDraft).toEqual(draft);
        });
    });

    describe('updateDraft', () => {
        it('should update draft with partial values', () => {
            useUIStore.getState().openCompose();
            useUIStore.getState().updateDraft({ to: 'new@example.com' });
            expect(useUIStore.getState().composeDraft?.to).toBe('new@example.com');
            expect(useUIStore.getState().composeDraft?.subject).toBe('');
        });

        it('should create draft if none exists', () => {
            useUIStore.getState().updateDraft({ subject: 'New Subject' });
            expect(useUIStore.getState().composeDraft?.subject).toBe('New Subject');
        });
    });

    describe('clearDraft', () => {
        it('should clear the compose draft', () => {
            useUIStore.getState().openComposeWithDraft({
                to: 'test@example.com',
                subject: 'Test',
                body: 'Body',
            });
            useUIStore.getState().clearDraft();
            expect(useUIStore.getState().composeDraft).toBeUndefined();
        });
    });

    describe('setFilters', () => {
        it('should set inbox filters', () => {
            useUIStore.getState().setFilters({ unread: true, from: 'john@example.com' });
            expect(useUIStore.getState().activeFilters).toEqual({
                unread: true,
                from: 'john@example.com',
            });
        });
    });

    describe('clearFilters', () => {
        it('should clear all filters', () => {
            useUIStore.getState().setFilters({ unread: true, days: 7 });
            useUIStore.getState().clearFilters();
            expect(useUIStore.getState().activeFilters).toEqual({});
        });
    });

    describe('addAssistantMessage', () => {
        it('should add user message to history', () => {
            useUIStore.getState().addAssistantMessage('user', 'Show me unread emails');
            expect(useUIStore.getState().assistantHistory).toHaveLength(1);
            expect(useUIStore.getState().assistantHistory[0]).toEqual({
                role: 'user',
                content: 'Show me unread emails',
            });
        });

        it('should add assistant message to history', () => {
            useUIStore.getState().addAssistantMessage('assistant', 'Filtering inbox');
            expect(useUIStore.getState().assistantHistory[0]).toEqual({
                role: 'assistant',
                content: 'Filtering inbox',
            });
        });
    });

    describe('getContext', () => {
        it('should return current UI context', () => {
            useUIStore.getState().setFilters({ unread: true });
            useUIStore.getState().openEmail('email-456');

            const context = useUIStore.getState().getContext();

            expect(context.currentView).toBe('detail');
            expect(context.selectedEmailId).toBe('email-456');
            expect(context.activeFilters).toEqual({ unread: true });
        });
    });
});
