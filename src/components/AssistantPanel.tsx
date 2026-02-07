"use client";

import { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { useMailStore } from "@/store/mailStore";
import { dispatch } from "@/ai/dispatcher";
import { AIAction } from "@/types/actions";
import { describeAction } from "@/ai/actions";
import { MessageSquare, Send, X, Sparkles, Minus } from "lucide-react";

export default function AssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistantHistory = useUIStore((state) => state.assistantHistory);
  const addAssistantMessage = useUIStore((state) => state.addAssistantMessage);
  const getContext = useUIStore((state) => state.getContext);
  const inbox = useMailStore((state) => state.inbox);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addAssistantMessage("user", userMessage);
    setIsLoading(true);

    try {
      const context = {
        ...getContext(),
        inboxEmailIds: inbox.map((e) => e.id),
        selectedEmail: inbox.find((e) => e.id === getContext().selectedEmailId),
      };

      const response = await fetch("/api/ai/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, context }),
      });

      const data = await response.json();

      if (data.error) {
        addAssistantMessage("assistant", `Error: ${data.error}`);
      } else if (data.action) {
        const action = data.action as AIAction;
        const result = await dispatch(action);
        addAssistantMessage(
          "assistant",
          result.success
            ? `Done: ${describeAction(action)}`
            : `Error: ${result.message}`
        );
      }
    } catch (error) {
      addAssistantMessage("assistant", "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    fab: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      width: '56px',
      height: '56px',
      backgroundColor: '#1a73e8',
      borderRadius: '16px',
      border: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      zIndex: 100,
    },
    minimized: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      backgroundColor: '#1a73e8',
      padding: '12px 20px',
      borderRadius: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
      zIndex: 100,
    },
    panel: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      width: '360px',
      height: '480px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      zIndex: 100,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid #e8eaed',
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    headerIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1a73e8 0%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
    },
    headerText: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#202124',
    },
    headerSub: {
      fontSize: '11px',
      color: '#5f6368',
    },
    headerBtns: {
      display: 'flex',
      gap: '4px',
    },
    headerBtn: {
      padding: '6px',
      background: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      color: '#5f6368',
    },
    messages: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
    },
    emptyState: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
    },
    emptyIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#e8f0fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px',
    },
    emptyTitle: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#202124',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '12px',
      color: '#5f6368',
      marginBottom: '16px',
    },
    suggestions: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      width: '100%',
    },
    suggestion: {
      padding: '10px 12px',
      backgroundColor: '#f8f9fa',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#3c4043',
      cursor: 'pointer',
      textAlign: 'left' as const,
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '10px 14px',
      borderRadius: '18px',
      fontSize: '14px',
      marginBottom: '8px',
    },
    userBubble: {
      backgroundColor: '#1a73e8',
      color: '#fff',
      marginLeft: 'auto',
      borderBottomRightRadius: '4px',
    },
    assistantBubble: {
      backgroundColor: '#f1f3f4',
      color: '#202124',
      borderBottomLeftRadius: '4px',
    },
    loading: {
      display: 'flex',
      gap: '4px',
      padding: '10px 14px',
      backgroundColor: '#f1f3f4',
      borderRadius: '18px',
      borderBottomLeftRadius: '4px',
      width: 'fit-content',
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#5f6368',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out',
    },
    inputContainer: {
      padding: '12px 16px',
      borderTop: '1px solid #e8eaed',
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f1f3f4',
      borderRadius: '24px',
      padding: '8px 12px',
    },
    input: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: '14px',
      color: '#202124',
    },
    sendBtn: {
      width: '32px',
      height: '32px',
      backgroundColor: '#1a73e8',
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#fff',
    },
    sendBtnDisabled: {
      backgroundColor: '#c4c7c5',
      cursor: 'not-allowed',
    },
  };

  if (!isOpen) {
    return (
      <button
        style={styles.fab}
        onClick={() => setIsOpen(true)}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'}
      >
        <Sparkles size={24} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button style={styles.minimized} onClick={() => setIsMinimized(false)}>
        <Sparkles size={18} />
        AI Assistant
      </button>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <div style={styles.headerIcon}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={styles.headerText}>AI Assistant</div>
            <div style={styles.headerSub}>Powered by Mistral</div>
          </div>
        </div>
        <div style={styles.headerBtns}>
          <button
            style={styles.headerBtn}
            onClick={() => setIsMinimized(true)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Minus size={18} />
          </button>
          <button
            style={styles.headerBtn}
            onClick={() => setIsOpen(false)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={styles.messages}>
        {assistantHistory.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <MessageSquare size={24} color="#1a73e8" />
            </div>
            <div style={styles.emptyTitle}>How can I help?</div>
            <div style={styles.emptyText}>Try asking me to manage your emails</div>
            <div style={styles.suggestions}>
              {["Show me unread emails", "Compose a new email", "Find emails from last week"].map((s) => (
                <button
                  key={s}
                  style={styles.suggestion}
                  onClick={() => setInput(s)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8eaed'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          assistantHistory.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.messageBubble,
                ...(msg.role === "user" ? styles.userBubble : styles.assistantBubble),
              }}
            >
              {msg.content}
            </div>
          ))
        )}
        {isLoading && (
          <div style={styles.loading}>
            <div style={{ ...styles.dot, animationDelay: '0ms' }} />
            <div style={{ ...styles.dot, animationDelay: '160ms' }} />
            <div style={{ ...styles.dot, animationDelay: '320ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            style={styles.input}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              ...styles.sendBtn,
              ...(!input.trim() || isLoading ? styles.sendBtnDisabled : {}),
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      <style jsx global>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
    </div>
  );
}
