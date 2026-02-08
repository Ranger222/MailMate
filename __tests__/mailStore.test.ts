// Tests for Mail Store

import { useMailStore } from '@/store/mailStore';
import { Email } from '@/types/mail';

// Mock fetch globally
global.fetch = jest.fn();

describe('Mail Store', () => {
    const mockEmails: Email[] = [
        {
            id: '1',
            threadId: 'thread-1',
            from: 'sender1@example.com',
            to: 'me@example.com',
            subject: 'Test Email 1',
            body: 'Body 1',
            snippet: 'Snippet 1',
            date: '2024-01-15T10:00:00Z',
            unread: true,
        },
        {
            id: '2',
            threadId: 'thread-2',
            from: 'sender2@example.com',
            to: 'me@example.com',
            subject: 'Test Email 2',
            body: 'Body 2',
            snippet: 'Snippet 2',
            date: '2024-01-14T10:00:00Z',
            unread: false,
        },
        {
            id: '3',
            threadId: 'thread-1',
            from: 'sender1@example.com',
            to: 'me@example.com',
            subject: 'Re: Test Email 1',
            body: 'Reply body',
            snippet: 'Reply snippet',
            date: '2024-01-15T11:00:00Z',
            unread: true,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        useMailStore.setState({
            inbox: [],
            sent: [],
            loading: false,
            error: undefined,
            searchResults: [],
            searchQuery: '',
        });
    });

    describe('getEmailById', () => {
        it('should return email by ID from inbox', () => {
            useMailStore.setState({ inbox: mockEmails });
            const email = useMailStore.getState().getEmailById('1');
            expect(email?.id).toBe('1');
            expect(email?.from).toBe('sender1@example.com');
        });

        it('should return email by ID from sent', () => {
            useMailStore.setState({ sent: mockEmails });
            const email = useMailStore.getState().getEmailById('2');
            expect(email?.id).toBe('2');
        });

        it('should return undefined for non-existent email', () => {
            useMailStore.setState({ inbox: mockEmails });
            const email = useMailStore.getState().getEmailById('999');
            expect(email).toBeUndefined();
        });
    });

    describe('getFilteredInbox', () => {
        beforeEach(() => {
            useMailStore.setState({ inbox: mockEmails });
        });

        it('should return all emails with no filters', () => {
            const filtered = useMailStore.getState().getFilteredInbox({});
            expect(filtered).toHaveLength(3);
        });

        it('should filter by unread status', () => {
            const filtered = useMailStore.getState().getFilteredInbox({ unread: true });
            expect(filtered).toHaveLength(2);
            expect(filtered.every(e => e.unread)).toBe(true);
        });

        it('should filter by sender', () => {
            const filtered = useMailStore.getState().getFilteredInbox({ from: 'sender2' });
            expect(filtered).toHaveLength(1);
            expect(filtered[0].from).toContain('sender2');
        });

        it('should combine multiple filters', () => {
            const filtered = useMailStore.getState().getFilteredInbox({
                unread: true,
                from: 'sender1'
            });
            expect(filtered).toHaveLength(2);
        });
    });

    describe('markAsRead', () => {
        it('should mark email as read in inbox', () => {
            useMailStore.setState({ inbox: [...mockEmails] });
            useMailStore.getState().markAsRead('1');
            const email = useMailStore.getState().inbox.find(e => e.id === '1');
            expect(email?.unread).toBe(false);
        });
    });

    describe('fetchInbox', () => {
        it('should fetch and update inbox', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ emails: mockEmails }),
            });

            await useMailStore.getState().fetchInbox();

            expect(useMailStore.getState().inbox).toHaveLength(3);
            expect(useMailStore.getState().loading).toBe(false);
        });

        it('should set loading state during fetch', async () => {
            (global.fetch as jest.Mock).mockImplementation(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => Promise.resolve({ emails: [] })
                    }), 100)
                )
            );

            const fetchPromise = useMailStore.getState().fetchInbox();
            expect(useMailStore.getState().loading).toBe(true);

            await fetchPromise;
            expect(useMailStore.getState().loading).toBe(false);
        });
    });

    describe('searchEmails', () => {
        it('should search and store results', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ emails: [mockEmails[0]] }),
            });

            await useMailStore.getState().searchEmails('test query');

            expect(useMailStore.getState().searchResults).toHaveLength(1);
            expect(useMailStore.getState().searchQuery).toBe('test query');
        });
    });

    describe('sendEmail', () => {
        it('should send email and return success', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });

            const result = await useMailStore.getState().sendEmail(
                'recipient@example.com',
                'Test Subject',
                'Test Body'
            );

            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith('/api/mail/send', expect.objectContaining({
                method: 'POST',
            }));
        });

        it('should return false on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
            });

            const result = await useMailStore.getState().sendEmail(
                'recipient@example.com',
                'Test Subject',
                'Test Body'
            );

            expect(result).toBe(false);
        });
    });
});
