# MailMate Assessment Guide

**For Assessment Reviewers**

This guide will help you evaluate the MailMate AI-controlled email client application.

---

## Quick Start Options

You have **two ways** to test this application:

### Option A: Use Google Login (Recommended - Full Features)
### Option B: Use Mock Data Mode (No Google Account Required)

---

## Option A: Google Login (Full Experience)

### WARNING: Important: "Unverified App" Warning

When you click "Sign in with Google," you will see a warning screen that says:

> **"Google hasn't verified this app"**
> 
> This app hasn't been verified by Google yet. Only continue if you know and trust the developer.

**This is expected and safe.** The app is unverified because:
- It's a development/assessment project
- Google verification requires a formal review process
- The app only requests read/send email permissions

### How to Proceed Past the Warning:

1. Click **"Sign in with Google"**
2. You'll see the warning screen
3. Click **"Advanced"** (bottom left)
4. Click **"Go to MailMate (unsafe)"**
5. Review the permissions:
   - Read, compose, send emails
   - See your email address
6. Click **"Continue"**

**What the app can access:**
- - Read your emails
- - Send emails on your behalf
- - View your email address
- - Cannot access other Google services
- - Cannot modify account settings

### Testing with Google Login:

Once logged in, you can:
- - View your real inbox
- - Send actual emails
- - Use AI to manage emails with natural language
- - Search and filter your emails
- - View email threads/conversations

---

## Option B: Mock Data Mode (No Login Required)

If you prefer **not to use your Google account**, you can test with mock data.

### Enabling Mock Data Mode:

**Method 1: Environment Variable (Before Starting)**
```bash
# Add to .env.local
FORCE_MOCK_DATA=true
```

**Method 2: URL Parameter (While Running)**
```
http://localhost:3000?mock=true
```

The app will automatically use mock data and show a banner:
> ** Mock Data Mode** - Using sample emails for demonstration

### What You Can Test in Mock Mode:

- - UI/UX and Gmail-like interface
- - AI Assistant commands
- - Email filtering and search
- - Compose and draft emails (won't actually send)
- - Thread/conversation view
- - All UI interactions

**Limitations:**
- - Cannot send real emails
- - Cannot access real Gmail data
- - Mock data resets on page refresh

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm

### 2. Installation

```bash
# Clone repository
git clone https://github.com/Ranger222/MailMate.git
cd MailMate

# Install dependencies
npm install
```

### 3. Environment Setup

Create `.env.local` file:

```env
# Required: LLM API Key (choose one)
LLM_PROVIDER=mistral
MISTRAL_API_KEY=your_mistral_key_here

# OR use Gemini
# LLM_PROVIDER=gemini
# GEMINI_API_KEY=your_gemini_key_here

# Optional: For Google Login (Option A)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
AUTH_SECRET=your_random_secret
AUTH_URL=http://localhost:3000

# Optional: Force Mock Data (Option B)
FORCE_MOCK_DATA=true
```

**Getting API Keys:**
- **Mistral**: https://console.mistral.ai/ (Free tier available)
- **Gemini**: https://aistudio.google.com/apikey (Free tier available)

### 4. Run the Application

```bash
npm run dev
```

Open http://localhost:3000

---

## Testing the AI Assistant

Click the **AI Assistant** button (bottom-right blue icon) and try these commands:

| Command | Expected Result |
|---------|----------------|
| `Show me unread emails` | Filters to unread only |
| `Compose email to test@example.com about meeting` | Opens compose with prefilled fields |
| `Find emails from last week` | Searches emails from past 7 days |
| `View conversation` | Shows email thread |
| `Reply saying thanks` | Opens reply with prefilled message |
| `Go to sent` | Navigates to sent folder |
| `Clear filters` | Removes all filters |

---

## Features to Evaluate

### - Core Features
- [ ] Gmail OAuth integration (Option A) or Mock data (Option B)
- [ ] AI-controlled UI via natural language
- [ ] Email list with Gmail-like interface
- [ ] Email detail view
- [ ] Compose/send emails
- [ ] Search functionality
- [ ] Filter by unread/sender/date

### - Bonus Features
- [ ] Email threading/conversation view
- [ ] Unit tests (run `npm test`)
- [ ] Real-time sync (30-second polling)
- [ ] Professional UI design

---

## Running Tests

```bash
# Run all tests (40 tests)
npm test

# Run with coverage
npm run test:coverage
```

**Expected Output:**
```
Test Suites: 3 passed, 3 total
Tests:       40 passed, 40 total
```

---

## Architecture Overview

**AI-Controlled UI Pattern:**
```
User Input → LLM (Mistral/Gemini) → Structured Action → UI Update
```

**Tech Stack:**
- Next.js 16 (React 19)
- NextAuth.js (Google OAuth)
- Gmail API
- Mistral/Gemini LLM
- Zustand (State Management)
- Jest (Testing)

---

## Troubleshooting

**"Blank screen after login"**
- Wait 2-3 seconds for session initialization
- Refresh if needed

**"AI not responding"**
- Check `MISTRAL_API_KEY` or `GEMINI_API_KEY` is valid
- Verify `LLM_PROVIDER` matches your key

**"Google OAuth error"**
- Ensure you clicked "Advanced" → "Go to MailMate (unsafe)"
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**"Want to use mock data instead"**
- Add `?mock=true` to URL
- Or set `FORCE_MOCK_DATA=true` in `.env.local`

---

## Assessment Criteria

This project demonstrates:

1. **Full-Stack Development**
   - Next.js App Router
   - API routes
   - Server-side authentication

2. **AI Integration**
   - LLM prompt engineering
   - Structured output parsing
   - Action-based UI control

3. **External API Integration**
   - Gmail API
   - OAuth 2.0 flow
   - Real-time data sync

4. **State Management**
   - Zustand stores
   - Optimistic updates
   - Context awareness

5. **Testing**
   - Unit tests
   - Integration tests
   - 100% test pass rate

6. **UI/UX Design**
   - Gmail-inspired interface
   - Responsive design
   - Professional aesthetics

---

## Contact

For questions or issues during assessment:
- Check README.md for detailed documentation
- Review code comments for implementation details
- Run tests to verify functionality

**Thank you for reviewing MailMate!** 
