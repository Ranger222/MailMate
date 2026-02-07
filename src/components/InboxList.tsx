"use client";

import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";
import { Star, RefreshCw } from "lucide-react";

interface InboxListProps {
  viewType: "inbox" | "sent";
}

export default function InboxList({ viewType }: InboxListProps) {
  const openEmail = useUIStore((state) => state.openEmail);
  const activeFilters = useUIStore((state) => state.activeFilters);
  const inbox = useMailStore((state) => state.inbox);
  const sent = useMailStore((state) => state.sent);
  const loading = useMailStore((state) => state.loading);
  const getFilteredInbox = useMailStore((state) => state.getFilteredInbox);
  const searchResults = useMailStore((state) => state.searchResults);
  const searchQuery = useMailStore((state) => state.searchQuery);
  const fetchInbox = useMailStore((state) => state.fetchInbox);
  const fetchSent = useMailStore((state) => state.fetchSent);

  const emails = viewType === "inbox"
    ? (searchQuery ? searchResults : getFilteredInbox(activeFilters))
    : sent;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    if (isThisYear) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
  };

  const getSenderName = (from: string) => {
    const match = from.match(/^([^<]+)/);
    const name = match ? match[1].trim() : from.split('@')[0];
    return name.length > 20 ? name.slice(0, 20) + '...' : name;
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
      padding: '8px 16px',
      borderBottom: '1px solid #e8eaed',
    },
    checkboxWrapper: {
      padding: '8px',
      cursor: 'pointer',
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    emailCount: {
      marginLeft: 'auto',
      fontSize: '12px',
      color: '#5f6368',
    },
    filterBar: {
      padding: '8px 16px',
      backgroundColor: '#e8f0fe',
      borderBottom: '1px solid #c2e0ff',
      fontSize: '12px',
      color: '#1a73e8',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap' as const,
    },
    filterTag: {
      backgroundColor: '#d2e3fc',
      padding: '4px 8px',
      borderRadius: '4px',
    },
    list: {
      flex: 1,
      overflowY: 'auto' as const,
    },
    emailRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      borderBottom: '1px solid #f1f3f4',
      cursor: 'pointer',
      transition: 'box-shadow 0.15s',
    },
    emailRowUnread: {
      backgroundColor: '#fff',
    },
    emailRowRead: {
      backgroundColor: '#f8f9fa',
    },
    emailCheckbox: {
      width: '60px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      flexShrink: 0,
    },
    starBtn: {
      background: 'transparent',
      border: 'none',
      padding: '2px',
      cursor: 'pointer',
      color: '#c6c6c6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sender: {
      width: '200px',
      fontSize: '14px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    senderUnread: {
      fontWeight: 700,
      color: '#202124',
    },
    senderRead: {
      fontWeight: 400,
      color: '#5f6368',
    },
    content: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      overflow: 'hidden',
      minWidth: 0,
    },
    subject: {
      fontSize: '14px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    subjectUnread: {
      fontWeight: 700,
      color: '#202124',
    },
    subjectRead: {
      fontWeight: 400,
      color: '#5f6368',
    },
    separator: {
      color: '#c6c6c6',
      margin: '0 4px',
    },
    snippet: {
      fontSize: '14px',
      color: '#5f6368',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    date: {
      width: '80px',
      textAlign: 'right' as const,
      fontSize: '12px',
    },
    dateUnread: {
      fontWeight: 700,
      color: '#202124',
    },
    dateRead: {
      fontWeight: 400,
      color: '#5f6368',
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

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.checkboxWrapper}>
          <input type="checkbox" />
        </div>
        <button
          style={styles.refreshBtn}
          onClick={() => viewType === "inbox" ? fetchInbox() : fetchSent()}
          title="Refresh"
        >
          <RefreshCw size={18} color="#5f6368" className={loading ? 'animate-spin' : ''} />
        </button>
        <span style={styles.emailCount}>
          {emails.length} {viewType === "inbox" ? "messages" : "sent"}
        </span>
      </div>

      {(activeFilters.unread || activeFilters.from || activeFilters.days) && (
        <div style={styles.filterBar}>
          <span>Filtered by:</span>
          {activeFilters.unread && <span style={styles.filterTag}>Unread</span>}
          {activeFilters.from && <span style={styles.filterTag}>From: {activeFilters.from}</span>}
          {activeFilters.days && <span style={styles.filterTag}>Last {activeFilters.days} days</span>}
        </div>
      )}

      <div style={styles.list}>
        {loading && emails.length === 0 ? (
          <div style={styles.empty}>
            <RefreshCw size={24} color="#5f6368" className="animate-spin" />
          </div>
        ) : emails.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span>No messages</span>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              onClick={() => openEmail(email.id)}
              style={{
                ...styles.emailRow,
                ...(email.unread ? styles.emailRowUnread : styles.emailRowRead),
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = 'inset 0 -1px 0 #dadce0, inset 0 1px 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={styles.emailCheckbox}>
                <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                <button style={styles.starBtn} onClick={(e) => e.stopPropagation()}>
                  <Star size={18} />
                </button>
              </div>

              <div style={{
                ...styles.sender,
                ...(email.unread ? styles.senderUnread : styles.senderRead),
              }}>
                {viewType === "inbox" ? getSenderName(email.from) : `To: ${getSenderName(email.to)}`}
              </div>

              <div style={styles.content}>
                <span style={{
                  ...styles.subject,
                  ...(email.unread ? styles.subjectUnread : styles.subjectRead),
                }}>
                  {email.subject || "(no subject)"}
                </span>
                <span style={styles.separator}>-</span>
                <span style={styles.snippet}>
                  {email.snippet || email.body?.slice(0, 80) || ""}
                </span>
              </div>

              <div style={{
                ...styles.date,
                ...(email.unread ? styles.dateUnread : styles.dateRead),
              }}>
                {formatDate(email.date)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
