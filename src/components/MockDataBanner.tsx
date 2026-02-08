"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Info } from "lucide-react";

export default function MockDataBanner() {
    const searchParams = useSearchParams();
    const isMockMode = searchParams?.get("mock") === "true" ||
        process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === "true";

    useEffect(() => {
        if (isMockMode) {
            console.log("📋 Mock Data Mode Enabled - Using sample emails for demonstration");
        }
    }, [isMockMode]);

    if (!isMockMode) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fef3c7',
            borderBottom: '2px solid #f59e0b',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
            <Info size={20} color="#f59e0b" />
            <div style={{ flex: 1 }}>
                <strong style={{ color: '#92400e', fontSize: '14px' }}>
                    📋 Mock Data Mode
                </strong>
                <span style={{ color: '#78350f', fontSize: '13px', marginLeft: '8px' }}>
                    Using sample emails for demonstration. No Google account required.
                </span>
            </div>
            <a
                href="/"
                style={{
                    padding: '6px 12px',
                    backgroundColor: '#f59e0b',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    textDecoration: 'none',
                    fontWeight: 500,
                }}
            >
                Exit Mock Mode
            </a>
        </div>
    );
}
