"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";
import { Email } from "@/types/mail";
import { ArrowLeft, Reply, Forward, ChevronDown, ChevronUp } from "lucide-react";

export default function ThreadView() {
    const selectedEmailId = useUIStore((state) => state.selectedEmailId);
    const setView = useUIStore((state) => state.setView);
    const openComposeWithDraft = useUIStore((state) => state.openComposeWithDraft);
    const getEmailById = useMailStore((state) => state.getEmailById);

    const [threadEmails, setThreadEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const selectedEmail = selectedEmailId ? getEmailById(selectedEmailId) : null;

    useEffect(() => {
        if (selectedEmail?.threadId) {
            fetchThread(selectedEmail.threadId);
        }
    }, [selectedEmail?.threadId]);

    const fetchThread = async (threadId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/mail/thread?threadId=${threadId}`);
            const data = await res.json();
            if (data.emails) {
                setThreadEmails(data.emails);
                // Expand the latest email by default
                if (data.emails.length > 0) {
                    setExpandedIds(new Set([data.emails[data.emails.length - 1].id]));
                }
            }
        } catch (error) {
            console.error("Failed to fetch thread:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (emailId: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(emailId)) {
                next.delete(emailId);
            } else {
                next.add(emailId);
            }
            return next;
        });
    };

    const handleReply = (email: Email) => {
        openComposeWithDraft({
            to: email.from,
            subject: `Re: ${email.subject}`,
            body: `\n\n---\nOn ${new Date(email.date).toLocaleString()}, ${email.from} wrote:\n> ${email.snippet || ''}`,
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getInitial = (email: string) => {
        const name = email.split('<')[0].trim() || email.split('@')[0];
        return name.charAt(0).toUpperCase();
    };

    const getSenderName = (from: string) => {
        const match = from.match(/^([^<]+)/);
        return match ? match[1].trim() : from.split('@')[0];
    };

    const styles = {
        container: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column' as const,
            backgroundColor: '#fff',
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: '1px solid #e8eaed',
        },
        iconBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#5f6368',
        },
        content: {
            flex: 1,
            overflowY: 'auto' as const,
            padding: '16px 24px',
        },
        subject: {
            fontSize: '22px',
            fontWeight: 400,
            color: '#202124',
            marginBottom: '16px',
        },
        threadCount: {
            fontSize: '14px',
            color: '#5f6368',
            marginBottom: '16px',
        },
        emailCard: {
            border: '1px solid #e8eaed',
            borderRadius: '8px',
            marginBottom: '8px',
            overflow: 'hidden',
        },
        emailHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            cursor: 'pointer',
            backgroundColor: '#fff',
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#1a73e8',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 500,
            flexShrink: 0,
        },
        senderInfo: {
            flex: 1,
            minWidth: 0,
        },
        senderName: {
            fontSize: '14px',
            fontWeight: 500,
            color: '#202124',
        },
        snippet: {
            fontSize: '13px',
            color: '#5f6368',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
        },
        date: {
            fontSize: '12px',
            color: '#5f6368',
        },
        emailBody: {
            padding: '16px',
            borderTop: '1px solid #e8eaed',
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#3c4043',
            whiteSpace: 'pre-wrap' as const,
        },
        replyBar: {
            display: 'flex',
            gap: '8px',
            padding: '12px 16px',
            borderTop: '1px solid #e8eaed',
            backgroundColor: '#f8f9fa',
        },
        replyBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #dadce0',
            borderRadius: '18px',
            fontSize: '13px',
            color: '#3c4043',
            cursor: 'pointer',
        },
    };

    if (!selectedEmail) {
        return (
            <div style={styles.container}>
                <div style={{ ...styles.content, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#5f6368' }}>Select an email to view conversation</span>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.toolbar}>
                <button
                    style={styles.iconBtn}
                    onClick={() => setView("inbox")}
                    title="Back"
                >
                    <ArrowLeft size={20} />
                </button>
                <span style={{ fontSize: '14px', color: '#5f6368' }}>
                    Conversation
                </span>
            </div>

            <div style={styles.content}>
                <h1 style={styles.subject}>{selectedEmail.subject}</h1>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#5f6368' }}>
                        Loading conversation...
                    </div>
                ) : (
                    <>
                        <div style={styles.threadCount}>
                            {threadEmails.length} message{threadEmails.length !== 1 ? 's' : ''} in this conversation
                        </div>

                        {threadEmails.map((email, index) => {
                            const isExpanded = expandedIds.has(email.id);
                            const isLast = index === threadEmails.length - 1;

                            return (
                                <div key={email.id} style={styles.emailCard}>
                                    <div
                                        style={styles.emailHeader}
                                        onClick={() => toggleExpand(email.id)}
                                    >
                                        <div style={styles.avatar}>
                                            {getInitial(email.from)}
                                        </div>
                                        <div style={styles.senderInfo}>
                                            <div style={styles.senderName}>
                                                {getSenderName(email.from)}
                                            </div>
                                            {!isExpanded && (
                                                <div style={styles.snippet}>
                                                    {email.snippet}
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.date}>
                                            {formatDate(email.date)}
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp size={20} color="#5f6368" />
                                        ) : (
                                            <ChevronDown size={20} color="#5f6368" />
                                        )}
                                    </div>

                                    {isExpanded && (
                                        <>
                                            <div style={styles.emailBody}>
                                                {email.body || email.snippet}
                                            </div>
                                            {isLast && (
                                                <div style={styles.replyBar}>
                                                    <button
                                                        style={styles.replyBtn}
                                                        onClick={() => handleReply(email)}
                                                    >
                                                        <Reply size={16} />
                                                        Reply
                                                    </button>
                                                    <button style={styles.replyBtn}>
                                                        <Forward size={16} />
                                                        Forward
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
