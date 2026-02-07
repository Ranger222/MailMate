import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gmailApi } from "@/lib/gmail-api";
import { gmailService } from "@/services/gmail.service";

export async function GET() {
    try {
        // Try to get authenticated session
        const session = await auth();

        if (session?.accessToken) {
            // Use real Gmail API
            const emails = await gmailApi.listInbox(session.accessToken);
            return NextResponse.json({ emails, source: "gmail" });
        } else {
            // Fall back to mock data for demo
            const emails = await gmailService.listInbox();
            return NextResponse.json({ emails, source: "mock" });
        }
    } catch (error) {
        console.error("Inbox fetch error:", error);
        // Fall back to mock data on error
        const emails = await gmailService.listInbox();
        return NextResponse.json({ emails, source: "mock", error: "Gmail API failed, using mock data" });
    }
}
