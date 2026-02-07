import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gmailApi } from "@/lib/gmail-api";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json(
                { error: "Missing search query" },
                { status: 400 }
            );
        }

        const session = await auth();

        if (session?.accessToken) {
            const emails = await gmailApi.searchEmails(session.accessToken, query);
            return NextResponse.json({ emails, query, source: "gmail" });
        } else {
            // Mock search - not authenticated
            return NextResponse.json(
                { error: "Sign in to search emails", emails: [] },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Search failed" },
            { status: 500 }
        );
    }
}
