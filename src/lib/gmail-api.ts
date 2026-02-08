// Gmail API Client - Real Gmail Integration
// Uses Google APIs with OAuth access token

import { google, gmail_v1 } from "googleapis";
import { Email } from "@/types/mail";

// Create Gmail client with access token
function getGmailClient(accessToken: string): gmail_v1.Gmail {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.gmail({ version: "v1", auth });
}

// Parse email headers to get value
function getHeader(headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string {
    if (!headers) return "";
    const header = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
    return header?.value || "";
}

// Decode base64url encoded content
function decodeBase64Url(data: string): string {
    try {
        const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
        return Buffer.from(base64, "base64").toString("utf-8");
    } catch {
        return "";
    }
}

// Extract email body from message parts
function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
    if (!payload) return "";

    // Direct body data
    if (payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }

    // Multipart - look for text/plain or text/html
    if (payload.parts) {
        // First try text/plain
        for (const part of payload.parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
                return decodeBase64Url(part.body.data);
            }
        }
        // Fall back to text/html
        for (const part of payload.parts) {
            if (part.mimeType === "text/html" && part.body?.data) {
                // Strip HTML tags for display
                const html = decodeBase64Url(part.body.data);
                return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
            }
        }
        // Recursively check nested parts
        for (const part of payload.parts) {
            const body = extractBody(part);
            if (body) return body;
        }
    }

    return "";
}

// Convert Gmail message to our Email type
function parseMessage(message: gmail_v1.Schema$Message): Email {
    const headers = message.payload?.headers || [];
    const body = extractBody(message.payload);

    return {
        id: message.id || "",
        threadId: message.threadId || "",
        from: getHeader(headers, "From"),
        to: getHeader(headers, "To"),
        subject: getHeader(headers, "Subject"),
        body: body,
        snippet: message.snippet || "",
        date: getHeader(headers, "Date") || new Date().toISOString(),
        unread: message.labelIds?.includes("UNREAD") || false,
    };
}

// Gmail API Service
export const gmailApi = {
    // List inbox messages
    async listInbox(accessToken: string, maxResults = 20): Promise<Email[]> {
        const gmail = getGmailClient(accessToken);

        const response = await gmail.users.messages.list({
            userId: "me",
            labelIds: ["INBOX"],
            maxResults,
        });

        const messages = response.data.messages || [];
        const emails: Email[] = [];

        // Fetch full message details for each
        for (const msg of messages.slice(0, maxResults)) {
            if (!msg.id) continue;

            const fullMessage = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full",
            });

            emails.push(parseMessage(fullMessage.data));
        }

        return emails;
    },

    // List sent messages
    async listSent(accessToken: string, maxResults = 20): Promise<Email[]> {
        const gmail = getGmailClient(accessToken);

        const response = await gmail.users.messages.list({
            userId: "me",
            labelIds: ["SENT"],
            maxResults,
        });

        const messages = response.data.messages || [];
        const emails: Email[] = [];

        for (const msg of messages.slice(0, maxResults)) {
            if (!msg.id) continue;

            const fullMessage = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full",
            });

            emails.push(parseMessage(fullMessage.data));
        }

        return emails;
    },

    // Get single message by ID
    async getMessage(accessToken: string, messageId: string): Promise<Email | null> {
        const gmail = getGmailClient(accessToken);

        try {
            const response = await gmail.users.messages.get({
                userId: "me",
                id: messageId,
                format: "full",
            });

            return parseMessage(response.data);
        } catch {
            return null;
        }
    },

    // Send email
    async sendEmail(
        accessToken: string,
        to: string,
        subject: string,
        body: string
    ): Promise<Email | null> {
        const gmail = getGmailClient(accessToken);

        // Get user's email for From header
        const profile = await gmail.users.getProfile({ userId: "me" });
        const fromEmail = profile.data.emailAddress || "me";

        // Create RFC 2822 formatted email
        const emailLines = [
            `From: ${fromEmail}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            "Content-Type: text/plain; charset=utf-8",
            "",
            body,
        ];

        const email = emailLines.join("\r\n");
        const encodedEmail = Buffer.from(email).toString("base64url");

        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedEmail,
            },
        });

        if (response.data.id) {
            return this.getMessage(accessToken, response.data.id);
        }

        return null;
    },

    // Mark as read
    async markAsRead(accessToken: string, messageId: string): Promise<boolean> {
        const gmail = getGmailClient(accessToken);

        try {
            await gmail.users.messages.modify({
                userId: "me",
                id: messageId,
                requestBody: {
                    removeLabelIds: ["UNREAD"],
                },
            });
            return true;
        } catch {
            return false;
        }
    },

    // Search emails
    async searchEmails(accessToken: string, query: string, maxResults = 20): Promise<Email[]> {
        const gmail = getGmailClient(accessToken);

        const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults,
        });

        const messages = response.data.messages || [];
        const emails: Email[] = [];

        for (const msg of messages.slice(0, maxResults)) {
            if (!msg.id) continue;

            const fullMessage = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full",
            });

            emails.push(parseMessage(fullMessage.data));
        }

        return emails;
    },

    // Get thread (conversation) by threadId
    async getThread(accessToken: string, threadId: string): Promise<Email[]> {
        const gmail = getGmailClient(accessToken);

        try {
            const response = await gmail.users.threads.get({
                userId: "me",
                id: threadId,
                format: "full",
            });

            const messages = response.data.messages || [];
            return messages.map(parseMessage);
        } catch {
            return [];
        }
    },
};
