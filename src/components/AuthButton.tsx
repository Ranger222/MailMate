"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, Check } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  const styles = {
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      fontSize: '12px',
      color: '#5f6368',
    },
    spinner: {
      width: '12px',
      height: '12px',
      border: '2px solid #e8eaed',
      borderTop: '2px solid #1a73e8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    container: {
      padding: '8px 0',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#1a73e8',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 500,
    },
    nameContainer: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontSize: '13px',
      fontWeight: 500,
      color: '#202124',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    status: {
      fontSize: '11px',
      color: '#137333',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    signOutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
      padding: '6px 8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      color: '#5f6368',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left' as const,
    },
    signInBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      background: '#fff',
      border: '1px solid #dadce0',
      borderRadius: '8px',
      fontSize: '13px',
      color: '#3c4043',
      cursor: 'pointer',
      width: '100%',
      fontWeight: 500,
    },
  };

  if (status === "loading") {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div style={styles.container}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {session.user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={styles.nameContainer}>
            <div style={styles.name}>
              {session.user?.name || session.user?.email?.split('@')[0]}
            </div>
            <div style={styles.status}>
              <Check size={12} />
              Gmail Connected
            </div>
          </div>
        </div>
        <button
          style={styles.signOutBtn}
          onClick={() => signOut()}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      style={styles.signInBtn}
      onClick={() => signIn("google")}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Sign in with Google
    </button>
  );
}
