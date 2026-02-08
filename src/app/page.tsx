"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MailLayout from "@/components/MailLayout";
import MockDataBanner from "@/components/MockDataBanner";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Home() {
  const { data: session, status } = useSession();
  const [mockMode, setMockMode] = useState(false);

  // Check URL parameter for mock mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mock') === 'true') {
      setMockMode(true);
    }
  }, []);

  // Show welcome screen if not authenticated and not in mock mode
  if (status === "loading") {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session && !mockMode) {
    return <WelcomeScreen onMockMode={() => setMockMode(true)} />;
  }

  return (
    <>
      <Suspense fallback={null}>
        {mockMode && <MockDataBanner />}
      </Suspense>
      <MailLayout mockMode={mockMode} />
    </>
  );
}
