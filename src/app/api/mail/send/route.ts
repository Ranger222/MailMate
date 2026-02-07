import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gmailApi } from "@/lib/gmail-api";
import { gmailService } from "@/services/gmail.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, subject, body: emailBody } = body;

        if (!to || !subject) {
            return NextResponse.json(
                { error: "Missing required fields: to, subject" },
                { status: 400 }
            );
        }

        const session = await auth();

        if (session?.accessToken) {
            // Send via Gmail API
            const email = await gmailApi.sendEmail(
                session.accessToken,
                to,
                subject,
                emailBody || ""
            );

            if (email) {
                return NextResponse.json({ email, success: true, source: "gmail" });
            } else {
                return NextResponse.json(
                    { error: "Failed to send email via Gmail" },
                    { status: 500 }
                );
            }
        } else {
            // Mock send for demo
            const email = await gmailService.sendMail(to, subject, emailBody || "");
            return NextResponse.json({ email, success: true, source: "mock" });
        }
    } catch (error) {
        console.error("Send error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to send email" },
            { status: 500 }
        );
    }
}
