// Gmail Service - Isolated & Dumb
// No AI logic, No UI logic - Easy to mock

import { Email } from "@/types/mail";

// Mock emails for development (replace with real Gmail API integration)
const MOCK_INBOX: Email[] = [
    {
        id: "1",
        from: "alice@example.com",
        to: "me@example.com",
        subject: "Project Update - Q1 Review",
        body: "Hi,\n\nI wanted to share the Q1 project update with you. We've made significant progress on all key deliverables.\n\n- Feature A: Complete\n- Feature B: 80% done\n- Feature C: In progress\n\nLet me know if you have any questions.\n\nBest,\nAlice",
        snippet: "I wanted to share the Q1 project update with you...",
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        unread: true,
        threadId: "thread-1",
    },
    {
        id: "2",
        from: "bob@company.com",
        to: "me@example.com",
        subject: "Meeting Tomorrow at 3pm",
        body: "Hey,\n\nJust confirming our meeting tomorrow at 3pm. We'll be discussing the new product roadmap.\n\nAgenda:\n1. Review current status\n2. Discuss new features\n3. Timeline planning\n\nSee you then!\n\nBob",
        snippet: "Just confirming our meeting tomorrow at 3pm...",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        unread: true,
        threadId: "thread-2",
    },
    {
        id: "3",
        from: "newsletter@techdigest.com",
        to: "me@example.com",
        subject: "Weekly Tech Digest - AI Trends",
        body: "This week in tech:\n\n• AI assistants are revolutionizing productivity\n• New developments in natural language processing\n• The future of human-AI collaboration\n\nRead more at techdigest.com",
        snippet: "This week in tech: AI assistants are revolutionizing...",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        unread: false,
        threadId: "thread-3",
    },
    {
        id: "4",
        from: "sarah@startup.io",
        to: "me@example.com",
        subject: "Partnership Opportunity",
        body: "Hi there,\n\nI'm reaching out because I think there's a great opportunity for us to collaborate. Our companies have complementary strengths.\n\nWould you be open to a quick call next week?\n\nBest,\nSarah\nCEO, Startup.io",
        snippet: "I'm reaching out because I think there's a great opportunity...",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        unread: false,
        threadId: "thread-4",
    },
    {
        id: "5",
        from: "john@example.com",
        to: "me@example.com",
        subject: "Quick Question",
        body: "Hey,\n\nDo you have the slides from last week's presentation? I need to reference them for a follow-up meeting.\n\nThanks!\nJohn",
        snippet: "Do you have the slides from last week's presentation?",
        date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        unread: true,
        threadId: "thread-5",
    },
];

const MOCK_SENT: Email[] = [
    {
        id: "sent-1",
        from: "me@example.com",
        to: "alice@example.com",
        subject: "Re: Project Update - Q1 Review",
        body: "Thanks for the update, Alice! The progress looks great.\n\nI have a few questions about Feature B - can we schedule a quick sync?\n\nBest,\nMe",
        snippet: "Thanks for the update, Alice! The progress looks great...",
        date: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        unread: false,
        threadId: "thread-1",
    },
    {
        id: "sent-2",
        from: "me@example.com",
        to: "team@company.com",
        subject: "Weekly Status Report",
        body: "Hi team,\n\nHere's my weekly status update:\n\n- Completed code review for the new feature\n- Fixed 3 critical bugs\n- Started working on the API integration\n\nLet me know if you need anything else.\n\nBest,\nMe",
        snippet: "Here's my weekly status update...",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        unread: false,
        threadId: "thread-6",
    },
];

// Gmail Service Functions
export const gmailService = {
    // List inbox messages
    async listInbox(): Promise<Email[]> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        return [...MOCK_INBOX];
    },

    // List sent messages
    async listSent(): Promise<Email[]> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return [...MOCK_SENT];
    },

    // Get single message
    async getMessage(id: string): Promise<Email | null> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const email = MOCK_INBOX.find((e) => e.id === id) || MOCK_SENT.find((e) => e.id === id);
        return email || null;
    },

    // Send mail
    async sendMail(to: string, subject: string, body: string): Promise<Email> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newEmail: Email = {
            id: `sent-${Date.now()}`,
            from: "me@example.com",
            to,
            subject,
            body,
            snippet: body.slice(0, 50) + "...",
            date: new Date().toISOString(),
            unread: false,
            threadId: `thread-${Date.now()}`,
        };

        // Add to mock sent (for demo purposes)
        MOCK_SENT.unshift(newEmail);

        return newEmail;
    },

    // Mark as read
    async markAsRead(id: string): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const email = MOCK_INBOX.find((e) => e.id === id);
        if (email) {
            email.unread = false;
            return true;
        }
        return false;
    },
};
