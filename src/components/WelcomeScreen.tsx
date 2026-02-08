"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Sparkles, Database, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
    onMockMode: () => void;
}

export default function WelcomeScreen({ onMockMode }: WelcomeScreenProps) {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/" });
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
        },
        card: {
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '40px',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px',
        },
        title: {
            fontSize: '32px',
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
        },
        subtitle: {
            fontSize: '16px',
            color: '#6b7280',
            marginTop: '8px',
        },
        optionsContainer: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '16px',
            marginBottom: '32px',
        },
        optionCard: {
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: '#fff',
        },
        optionCardHover: {
            borderColor: '#667eea',
            backgroundColor: '#f9fafb',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
        },
        optionHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
        },
        optionIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        optionTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#1f2937',
            margin: 0,
        },
        optionDescription: {
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: '12px',
        },
        optionFeatures: {
            fontSize: '13px',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        button: {
            width: '100%',
            padding: '14px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
        },
        primaryButton: {
            backgroundColor: '#667eea',
            color: '#fff',
        },
        secondaryButton: {
            backgroundColor: '#f3f4f6',
            color: '#374151',
        },
        footer: {
            textAlign: 'center' as const,
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
        },
        footerText: {
            fontSize: '13px',
            color: '#9ca3af',
        },
    };

    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logo}>
                        <Mail size={40} color="#667eea" />
                        <h1 style={styles.title}>MailMate</h1>
                    </div>
                    <p style={styles.subtitle}>
                        AI-Controlled Email Client
                    </p>
                </div>

                <div style={styles.optionsContainer}>
                    {/* Google Login Option */}
                    <div
                        style={{
                            ...styles.optionCard,
                            ...(hoveredOption === 'google' ? styles.optionCardHover : {}),
                        }}
                        onMouseEnter={() => setHoveredOption('google')}
                        onMouseLeave={() => setHoveredOption(null)}
                        onClick={handleGoogleLogin}
                    >
                        <div style={styles.optionHeader}>
                            <div style={{ ...styles.optionIcon, backgroundColor: '#fef3c7' }}>
                                <Mail size={24} color="#f59e0b" />
                            </div>
                            <h3 style={styles.optionTitle}>Sign in with Google</h3>
                        </div>
                        <p style={styles.optionDescription}>
                            Connect your Gmail account to access your real emails and use AI to manage them with natural language commands.
                        </p>
                        <div style={styles.optionFeatures}>
                            <Sparkles size={16} />
                            <span>Full features • Real emails • AI assistant</span>
                        </div>
                    </div>

                    {/* Mock Data Option */}
                    <div
                        style={{
                            ...styles.optionCard,
                            ...(hoveredOption === 'mock' ? styles.optionCardHover : {}),
                        }}
                        onMouseEnter={() => setHoveredOption('mock')}
                        onMouseLeave={() => setHoveredOption(null)}
                        onClick={onMockMode}
                    >
                        <div style={styles.optionHeader}>
                            <div style={{ ...styles.optionIcon, backgroundColor: '#dbeafe' }}>
                                <Database size={24} color="#3b82f6" />
                            </div>
                            <h3 style={styles.optionTitle}>Try with Mock Data</h3>
                        </div>
                        <p style={styles.optionDescription}>
                            Explore the app with sample emails. No Google account required. AI assistant works with real LLM.
                        </p>
                        <div style={styles.optionFeatures}>
                            <Sparkles size={16} />
                            <span>Demo mode • Sample emails • Real AI</span>
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Your data is secure. We only access what you authorize.
                    </p>
                </div>
            </div>
        </div>
    );
}
