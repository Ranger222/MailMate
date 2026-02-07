// Action Dispatcher - The brain that executes AI actions
// This is where visible UI changes happen

import { AIAction } from "@/types/actions";
import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";

export type DispatchResult = {
    success: boolean;
    message: string;
    requiresConfirmation?: boolean;
};

// Dispatcher function - executes AI actions deterministically
export async function dispatch(action: AIAction): Promise<DispatchResult> {
    const uiStore = useUIStore.getState();
    const mailStore = useMailStore.getState();

    switch (action.action) {
        case "OPEN_COMPOSE":
            uiStore.openCompose();
            return { success: true, message: "Compose modal opened" };

        case "FILL_COMPOSE":
            uiStore.openComposeWithDraft({
                to: action.args.to,
                subject: action.args.subject,
                body: action.args.body,
            });
            return {
                success: true,
                message: `Compose opened with draft to ${action.args.to}`,
            };

        case "SEND_EMAIL": {
            const draft = uiStore.composeDraft;
            if (!draft || !draft.to || !draft.subject) {
                return {
                    success: false,
                    message: "No email draft to send. Please compose an email first.",
                };
            }

            const sent = await mailStore.sendEmail(draft.to, draft.subject, draft.body);
            if (sent) {
                uiStore.clearDraft();
                uiStore.setView("sent");
                return { success: true, message: `Email sent to ${draft.to}` };
            } else {
                return { success: false, message: "Failed to send email" };
            }
        }

        case "FILTER_INBOX":
            uiStore.setFilters(action.args);
            return {
                success: true,
                message: `Inbox filtered${action.args.unread ? " (unread only)" : ""}${action.args.from ? ` from ${action.args.from}` : ""}${action.args.days ? ` (last ${action.args.days} days)` : ""}`,
            };

        case "CLEAR_FILTERS":
            uiStore.clearFilters();
            return { success: true, message: "All filters cleared" };

        case "OPEN_EMAIL": {
            const email = mailStore.getEmailById(action.args.emailId);
            if (!email) {
                return { success: false, message: "Email not found" };
            }
            uiStore.openEmail(action.args.emailId);
            mailStore.markAsRead(action.args.emailId);
            return { success: true, message: `Opened: ${email.subject}` };
        }

        case "REPLY_CURRENT": {
            const selectedId = uiStore.selectedEmailId;
            if (!selectedId) {
                return { success: false, message: "No email selected to reply to" };
            }

            const selectedEmail = mailStore.getEmailById(selectedId);
            if (!selectedEmail) {
                return { success: false, message: "Selected email not found" };
            }

            uiStore.openComposeWithDraft({
                to: selectedEmail.from,
                subject: `Re: ${selectedEmail.subject}`,
                body: action.args.body,
            });
            return { success: true, message: `Replying to ${selectedEmail.from}` };
        }

        case "VIEW_INBOX":
            await mailStore.fetchInbox();
            uiStore.setView("inbox");
            return { success: true, message: "Viewing inbox" };

        case "VIEW_SENT":
            await mailStore.fetchSent();
            uiStore.setView("sent");
            return { success: true, message: "Viewing sent mail" };

        case "ASK_CONFIRMATION":
            uiStore.setConfirmation(action.args.message);
            return {
                success: true,
                message: action.args.message,
                requiresConfirmation: true,
            };

        case "SEARCH_EMAILS":
            await mailStore.searchEmails(action.args.query);
            uiStore.setView("inbox");
            return {
                success: true,
                message: `Searching for: "${action.args.query}"`,
            };

        default:
            return { success: false, message: "Unknown action" };
    }
}
