"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";
import { X, Minimize2, Maximize2, Trash2, Send, Paperclip } from "lucide-react";

export default function ComposeModal() {
  const composeDraft = useUIStore((state) => state.composeDraft);
  const updateDraft = useUIStore((state) => state.updateDraft);
  const clearDraft = useUIStore((state) => state.clearDraft);
  const setView = useUIStore((state) => state.setView);
  const sendEmail = useMailStore((state) => state.sendEmail);

  const [to, setTo] = useState(composeDraft?.to || "");
  const [subject, setSubject] = useState(composeDraft?.subject || "");
  const [body, setBody] = useState(composeDraft?.body || "");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (composeDraft) {
      setTo(composeDraft.to || "");
      setSubject(composeDraft.subject || "");
      setBody(composeDraft.body || "");
    }
  }, [composeDraft]);

  // Save draft on change
  useEffect(() => {
    updateDraft({ to, subject, body });
  }, [to, subject, body, updateDraft]);

  const handleClose = () => {
    clearDraft();
    setView("inbox");
  };

  const handleSend = async () => {
    if (!to || !subject) return;

    setIsSending(true);
    const success = await sendEmail(to, subject, body);
    setIsSending(false);

    if (success) {
      clearDraft();
      setView("sent");
    }
  };

  const styles = {
    modal: {
      position: 'fixed' as const,
      bottom: '0',
      right: '380px',
      width: '580px',
      maxHeight: '80vh',
      backgroundColor: '#fff',
      borderRadius: '8px 8px 0 0',
      boxShadow: '0 -2px 20px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      backgroundColor: '#404040',
      color: '#fff',
    },
    headerTitle: {
      fontSize: '14px',
      fontWeight: 500,
    },
    headerButtons: {
      display: 'flex',
      gap: '4px',
    },
    headerBtn: {
      padding: '6px',
      background: 'transparent',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
    },
    form: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      borderBottom: '1px solid #e0e0e0',
    },
    inputLabel: {
      width: '60px',
      fontSize: '14px',
      color: '#666',
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      color: '#333',
    },
    textarea: {
      flex: 1,
      minHeight: '200px',
      padding: '16px',
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      resize: 'none' as const,
      fontFamily: 'inherit',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#f8f8f8',
    },
    sendBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 24px',
      backgroundColor: '#1a73e8',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
    },
    sendBtnDisabled: {
      backgroundColor: '#94a3b8',
      cursor: 'not-allowed',
    },
    iconBtn: {
      padding: '8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      color: '#666',
    },
  };

  if (isMinimized) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: 350,
        zIndex: 100,
        backgroundColor: '#404040',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        minWidth: '200px',
      }} onClick={() => setIsMinimized(false)}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>{subject || "New Message"}</span>
        <button
          style={{ ...styles.headerBtn, marginLeft: 'auto' }}
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={styles.modal}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>New Message</span>
        <div style={styles.headerButtons}>
          <button style={styles.headerBtn} onClick={() => setIsMinimized(true)}>
            <Minimize2 size={16} />
          </button>
          <button style={styles.headerBtn} onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={styles.form}>
        <div style={styles.inputRow}>
          <span style={styles.inputLabel}>To</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={styles.input}
            placeholder="Recipients"
          />
        </div>
        <div style={styles.inputRow}>
          <span style={styles.inputLabel}>Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={styles.input}
            placeholder=""
          />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={styles.textarea}
          placeholder=""
        />
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleSend}
          disabled={!to || !subject || isSending}
          style={{
            ...styles.sendBtn,
            ...((!to || !subject || isSending) ? styles.sendBtnDisabled : {}),
          }}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
        <button style={styles.iconBtn} title="Attach files">
          <Paperclip size={20} />
        </button>
        <button
          style={{ ...styles.iconBtn, marginLeft: 'auto' }}
          onClick={handleClose}
          title="Discard"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
