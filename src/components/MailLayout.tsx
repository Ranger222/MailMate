"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";
import InboxList from "./InboxList";
import EmailDetail from "./EmailDetail";
import ComposeModal from "./ComposeModal";
import AssistantPanel from "./AssistantPanel";
import { AuthButton } from "./AuthButton";
import { Inbox, Send, Edit, RefreshCw } from "lucide-react";

const POLL_INTERVAL = 30000;

export default function MailLayout() {
  const currentView = useUIStore((state) => state.currentView);
  const setView = useUIStore((state) => state.setView);
  const openCompose = useUIStore((state) => state.openCompose);
  const fetchInbox = useMailStore((state) => state.fetchInbox);
  const fetchSent = useMailStore((state) => state.fetchSent);
  const inbox = useMailStore((state) => state.inbox);
  const loading = useMailStore((state) => state.loading);

  useEffect(() => {
    fetchInbox();
    fetchSent();

    const interval = setInterval(() => {
      fetchInbox();
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchInbox, fetchSent]);

  const unreadCount = inbox.filter(e => e.unread).length;

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f6f8fc',
      fontFamily: "'Google Sans', 'Roboto', sans-serif",
    },
    sidebar: {
      width: '256px',
      backgroundColor: '#f6f8fc',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '8px 0',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      marginBottom: '8px',
    },
    logoText: {
      fontSize: '22px',
      color: '#5f6368',
      fontWeight: 400,
    },
    composeBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '0 16px 16px 16px',
      padding: '16px 24px',
      backgroundColor: '#fff',
      border: 'none',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      color: '#3c4043',
      transition: 'box-shadow 0.2s',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '8px 24px',
      margin: '0 8px',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '0 20px 20px 0',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      color: '#3c4043',
      textAlign: 'left' as const,
      transition: 'backgroundColor 0.15s',
    },
    navItemActive: {
      backgroundColor: '#d3e3fd',
      color: '#001d35',
    },
    navItemHover: {
      backgroundColor: '#e8eaed',
    },
    navCount: {
      marginLeft: 'auto',
      fontSize: '12px',
      fontWeight: 600,
    },
    footer: {
      marginTop: 'auto',
      padding: '16px',
      borderTop: '1px solid #e8eaed',
    },
    syncStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
      fontSize: '11px',
      color: '#5f6368',
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#fff',
      borderRadius: '16px 0 0 16px',
      overflow: 'hidden',
      marginTop: '8px',
      marginBottom: '8px',
    },
    content: {
      flex: 1,
      overflow: 'hidden',
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <svg width="40" height="30" viewBox="0 0 40 30">
            <path d="M2 6L20 18L38 6" stroke="#EA4335" strokeWidth="2.5" fill="none" />
            <rect x="2" y="4" width="36" height="22" rx="3" stroke="#4285F4" strokeWidth="2" fill="none" />
          </svg>
          <span style={styles.logoText}>Mail</span>
        </div>

        <button
          onClick={openCompose}
          style={styles.composeBtn}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'}
        >
          <Edit size={20} color="#3c4043" />
          Compose
        </button>

        <nav>
          <button
            onClick={() => setView("inbox")}
            style={{
              ...styles.navItem,
              ...(currentView === "inbox" || currentView === "detail" ? styles.navItemActive : {}),
            }}
          >
            <Inbox size={20} />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span style={styles.navCount}>{unreadCount}</span>
            )}
          </button>

          <button
            onClick={() => setView("sent")}
            style={{
              ...styles.navItem,
              ...(currentView === "sent" ? styles.navItemActive : {}),
            }}
          >
            <Send size={20} />
            <span>Sent</span>
          </button>
        </nav>

        <div style={styles.footer}>
          <AuthButton />
          <div style={styles.syncStatus}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Auto-sync every 30s
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          {(currentView === "inbox" || currentView === "compose") && <InboxList viewType="inbox" />}
          {currentView === "sent" && <InboxList viewType="sent" />}
          {currentView === "detail" && <EmailDetail />}
        </div>
      </main>

      {currentView === "compose" && <ComposeModal />}
      <AssistantPanel />
    </div>
  );
}
