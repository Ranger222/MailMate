"use client";

import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";
import { ArrowLeft, Reply, Forward, Star, Trash2, Archive } from "lucide-react";

export default function EmailDetail() {
  const selectedEmailId = useUIStore((state) => state.selectedEmailId);
  const setView = useUIStore((state) => state.setView);
  const openComposeWithDraft = useUIStore((state) => state.openComposeWithDraft);
  const getEmailById = useMailStore((state) => state.getEmailById);
  const markAsRead = useMailStore((state) => state.markAsRead);

  const email = selectedEmailId ? getEmailById(selectedEmailId) : null;

  if (email && email.unread) {
    markAsRead(email.id);
  }

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
      gap: '4px',
      padding: '8px 16px',
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
      padding: '24px',
    },
    subject: {
      fontSize: '22px',
      fontWeight: 400,
      color: '#202124',
      marginBottom: '24px',
      lineHeight: 1.3,
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '24px',
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
    senderEmail: {
      fontSize: '12px',
      color: '#5f6368',
    },
    toLine: {
      fontSize: '12px',
      color: '#5f6368',
      marginTop: '2px',
    },
    date: {
      fontSize: '12px',
      color: '#5f6368',
      flexShrink: 0,
    },
    body: {
      fontSize: '14px',
      lineHeight: 1.6,
      color: '#3c4043',
      whiteSpace: 'pre-wrap' as const,
    },
    replyBar: {
      display: 'flex',
      gap: '8px',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e8eaed',
    },
    replyBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: 'transparent',
      border: '1px solid #dadce0',
      borderRadius: '20px',
      fontSize: '14px',
      color: '#3c4043',
      cursor: 'pointer',
    },
    empty: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      color: '#5f6368',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#f1f3f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
    },
  };

  if (!email) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span style={{ fontSize: '14px' }}>Select an email to read</span>
        </div>
      </div>
    );
  }

  const handleReply = () => {
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
      year: "numeric",
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

  // Simple email body renderer
  const renderEmailBody = () => {
    const body = email.body || email.snippet || '';

    // If looks like HTML, just show snippet instead
    if (body.includes('<!DOCTYPE') || body.includes('<html')) {
      return email.snippet || "This email contains HTML content that cannot be displayed.";
    }

    return body;
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button
          style={styles.iconBtn}
          onClick={() => setView("inbox")}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          style={styles.iconBtn}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Archive"
        >
          <Archive size={20} />
        </button>
        <button
          style={styles.iconBtn}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Delete"
        >
          <Trash2 size={20} />
        </button>
        <button
          style={styles.iconBtn}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Star"
        >
          <Star size={20} />
        </button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.subject}>{email.subject}</h1>

        <div style={styles.header}>
          <div style={styles.avatar}>
            {getInitial(email.from)}
          </div>
          <div style={styles.senderInfo}>
            <div style={styles.senderName}>{getSenderName(email.from)}</div>
            <div style={styles.senderEmail}>&lt;{email.from}&gt;</div>
            <div style={styles.toLine}>to me</div>
          </div>
          <div style={styles.date}>{formatDate(email.date)}</div>
        </div>

        <div style={styles.body}>
          {renderEmailBody()}
        </div>

        <div style={styles.replyBar}>
          <button
            style={styles.replyBtn}
            onClick={handleReply}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Reply size={18} />
            Reply
          </button>
          <button
            style={styles.replyBtn}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Forward size={18} />
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}
