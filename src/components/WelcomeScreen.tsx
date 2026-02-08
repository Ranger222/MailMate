"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";

interface WelcomeScreenProps {
    onMockMode: () => void;
}

export default function WelcomeScreen({ onMockMode }: WelcomeScreenProps) {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/" });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                padding: '40px 20px',
            }}>
                {/* Logo and Title */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#1a73e8',
                        borderRadius: '16px',
                        marginBottom: '24px',
                    }}>
                        <Mail size={32} color="#fff" />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 400,
                        color: '#202124',
                        margin: '0 0 8px 0',
                        letterSpacing: '-0.5px',
                    }}>
                        Welcome to MailMate
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#5f6368',
                        margin: 0,
                        fontWeight: 400,
                    }}>
                        AI-powered email management
                    </p>
                </div>

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px 24px',
                        backgroundColor: '#1a73e8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'background-color 0.2s',
                        opacity: loading ? 0.7 : 1,
                        marginBottom: '16px',
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#1765cc';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1a73e8';
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                        <path fill="#fff" d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" />
                        <path fill="#fff" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                        <path fill="#fff" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" />
                    </svg>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '32px 0',
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#dadce0' }} />
                    <span style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#5f6368',
                    }}>
                        or
                    </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#dadce0' }} />
                </div>

                {/* Mock Data Button */}
                <button
                    onClick={onMockMode}
                    style={{
                        width: '100%',
                        padding: '14px 24px',
                        backgroundColor: '#fff',
                        color: '#1a73e8',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '24px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#1a73e8';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.borderColor = '#dadce0';
                    }}
                >
                    Try with demo data
                </button>

                {/* Info Text */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#5f6368',
                    lineHeight: 1.6,
                }}>
                    <p style={{ margin: '0 0 12px 0' }}>
                        Demo mode uses sample emails with real AI functionality
                    </p>
                    <p style={{ margin: 0 }}>
                        <a
                            href="https://github.com/Ranger222/MailMate/blob/main/ASSESSMENT_GUIDE.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#1a73e8',
                                textDecoration: 'none',
                            }}
                        >
                            Assessment Guide
                        </a>
                        {' • '}
                        <a
                            href="https://github.com/Ranger222/MailMate"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#1a73e8',
                                textDecoration: 'none',
                            }}
                        >
                            View on GitHub
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
