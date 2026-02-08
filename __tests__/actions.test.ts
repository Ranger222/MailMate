// Tests for AI Action types and validation

import { isValidAction, VALID_ACTIONS, AIAction } from '@/types/actions';

describe('Action Types', () => {
    describe('VALID_ACTIONS', () => {
        it('should contain all required action types', () => {
            expect(VALID_ACTIONS).toContain('OPEN_COMPOSE');
            expect(VALID_ACTIONS).toContain('FILL_COMPOSE');
            expect(VALID_ACTIONS).toContain('SEND_EMAIL');
            expect(VALID_ACTIONS).toContain('FILTER_INBOX');
            expect(VALID_ACTIONS).toContain('OPEN_EMAIL');
            expect(VALID_ACTIONS).toContain('REPLY_CURRENT');
            expect(VALID_ACTIONS).toContain('ASK_CONFIRMATION');
            expect(VALID_ACTIONS).toContain('VIEW_INBOX');
            expect(VALID_ACTIONS).toContain('VIEW_SENT');
            expect(VALID_ACTIONS).toContain('CLEAR_FILTERS');
            expect(VALID_ACTIONS).toContain('SEARCH_EMAILS');
            expect(VALID_ACTIONS).toContain('VIEW_THREAD');
        });

        it('should have 12 action types', () => {
            expect(VALID_ACTIONS.length).toBe(12);
        });
    });

    describe('isValidAction', () => {
        it('should return true for valid OPEN_COMPOSE action', () => {
            const action: AIAction = { action: 'OPEN_COMPOSE' };
            expect(isValidAction(action)).toBe(true);
        });

        it('should return true for valid FILL_COMPOSE action with args', () => {
            const action: AIAction = {
                action: 'FILL_COMPOSE',
                args: { to: 'test@example.com', subject: 'Test', body: 'Hello' }
            };
            expect(isValidAction(action)).toBe(true);
        });

        it('should return true for valid FILTER_INBOX action', () => {
            const action: AIAction = {
                action: 'FILTER_INBOX',
                args: { unread: true, days: 7 }
            };
            expect(isValidAction(action)).toBe(true);
        });

        it('should return true for valid SEARCH_EMAILS action', () => {
            const action: AIAction = {
                action: 'SEARCH_EMAILS',
                args: { query: 'from:test@example.com' }
            };
            expect(isValidAction(action)).toBe(true);
        });

        it('should return true for valid VIEW_THREAD action', () => {
            const action: AIAction = {
                action: 'VIEW_THREAD',
                args: { emailId: '12345' }
            };
            expect(isValidAction(action)).toBe(true);
        });

        it('should return false for invalid action type', () => {
            const action = { action: 'INVALID_ACTION' };
            expect(isValidAction(action)).toBe(false);
        });

        it('should return false for null', () => {
            expect(isValidAction(null)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isValidAction(undefined)).toBe(false);
        });

        it('should return false for string', () => {
            expect(isValidAction('OPEN_COMPOSE')).toBe(false);
        });

        it('should return false for object without action property', () => {
            expect(isValidAction({ type: 'OPEN_COMPOSE' })).toBe(false);
        });
    });
});
