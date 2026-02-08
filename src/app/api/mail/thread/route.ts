import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gmailApi } from "@/lib/gmail-api";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const threadId = searchParams.get("threadId");

        if (!threadId) {
            return NextResponse.json(
                { error: "Missing threadId parameter" },
                { status: 400 }
            );
        }

        const session = await auth();

        if (session?.accessToken) {
            const emails = await gmailApi.getThread(session.accessToken, threadId);
            return NextResponse.json({ emails, threadId, source: "gmail" });
        } else {
            return NextResponse.json(
                { error: "Sign in to view threads", emails: [] },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Thread fetch error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch thread" },
            { status: 500 }
        );
    }
}
