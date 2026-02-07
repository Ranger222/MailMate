import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gmailApi } from "@/lib/gmail-api";
import { gmailService } from "@/services/gmail.service";

export async function GET() {
    try {
        const session = await auth();

        if (session?.accessToken) {
            const emails = await gmailApi.listSent(session.accessToken);
            return NextResponse.json({ emails, source: "gmail" });
        } else {
            const emails = await gmailService.listSent();
            return NextResponse.json({ emails, source: "mock" });
        }
    } catch (error) {
        console.error("Sent fetch error:", error);
        const emails = await gmailService.listSent();
        return NextResponse.json({ emails, source: "mock", error: "Gmail API failed" });
    }
}
