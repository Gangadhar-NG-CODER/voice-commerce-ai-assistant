# Voice Commerce - Frontend (Next.js + React)

> 🛍️ **DAY 9 of the Murf AI Voice Agents Challenge**
>
> This frontend provides the user interface for the Voice Commerce shopping assistant - featuring a modern e-commerce themed welcome page, real-time conversation UI with shopping status, and order summary popup.
> See the [main README](../README.md) for complete project details.

## 🛒 What This Provides

This frontend delivers a complete voice shopping experience with:

### Welcome Page (`welcome-view.tsx`)
- **Modern E-commerce Design** - Clean, professional shopping interface
- **Emerald Green Theme** - Fresh, trustworthy color scheme
- **Shopping Cart Icon** - Animated floating cart
- **Product Categories** - Mugs, T-shirts, Hoodies, Accessories
- **Feature Cards** - Voice Shopping, Smart Search, Easy Orders, Fast Checkout
- **How It Works** - Clear 3-step shopping guide

### Conversation Page (`session-view.tsx` + `shopping-overlay.tsx`)
- **Status Indicator** - Real-time agent status (top right):
  - 🛍️ Assistant speaking... (emerald)
  - 👂 Listening... (blue)
  - 🤔 Processing... (yellow)
  - ⏸️ Ready (gray)
- **Shopping Info Badge** - Voice Commerce branding (bottom left)
- **Animated Visualizer** - Pulse bars when assistant speaks
- **Chat Transcript** - Full conversation history
- **Control Bar** - Microphone, chat, end call controls

### Order Summary Popup (`order-summary-popup.tsx`)
- **Dark Modern Design** - Sleek slate background with blue accents
- **Order Confirmation** - Blue checkmark with success message
- **Order Details** - Order ID, timestamp, items list
- **Item Breakdown** - Product name, quantity, price per item
- **Total Display** - Large, prominent total in blue
- **Download JSON** - Export order data
- **Auto-trigger** - Appears when you say "I'm done shopping"

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Voice SDK**: LiveKit Components React
- **Icons**: Heroicons

## ✨ Key Features

- **Responsive Design** - Works on desktop and mobile
- **Real-time Updates** - Status and order tracking update live
- **Voice-First** - Optimized for voice shopping interaction
- **Professional UI** - Modern e-commerce design
- **Order Persistence** - Orders tracked throughout session
- **Dark Mode Popup** - Beautiful order summary display

### Project Structure

```
frontend/
├── app/
│   ├── (app)/
│   │   ├── page.tsx              # Main app entry
│   │   └── session/
│   │       └── page.tsx          # Shopping session page
│   ├── api/
│   │   └── connection-details/   # LiveKit connection API
│   ├── fonts/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── app/
│   │   ├── welcome-view.tsx      # E-commerce landing page
│   │   ├── session-view.tsx      # Shopping conversation page
│   │   ├── shopping-overlay.tsx  # Status indicator
│   │   └── order-summary-popup.tsx # Order confirmation popup
│   ├── livekit/                  # LiveKit UI components
│   └── ui/                       # Shadcn UI components
├── hooks/
├── lib/
├── public/
├── app-config.ts                 # Branding configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
cd frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Configuration

Update `.env.local` with your LiveKit credentials:

```env
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-livekit-server-url
```

### Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

> **Note**: You'll need the backend agent running for the voice shopping to work.
> See the [backend README](../backend/README.md) for setup instructions.

## 🎨 Customization

### App Configuration (`app-config.ts`)

```ts
export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Voice Commerce',
  pageTitle: 'Voice Commerce - AI Shopping Assistant',
  pageDescription: 'Shop naturally using your voice',

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/lk-logo.svg',
  accent: '#10b981', // Emerald green
  startButtonText: '🛍️ Start Shopping',
};
```

### Theme Colors

The app uses an emerald green theme for shopping:
- Primary: `emerald-600` (#10b981)
- Accents: `emerald-500`, `emerald-700`
- Dark mode: Slate backgrounds with blue accents

### Components

- **Welcome View**: Customize categories, features, and branding
- **Shopping Overlay**: Adjust status messages and positioning
- **Order Popup**: Modify design, add payment options, etc.

## 📦 Build for Production

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

This project is part of the Murf AI Voice Agents Challenge. Feel free to fork and adapt for your own voice commerce applications!

## 👨‍💻 Author

**Gangadhar**
- GitHub: [@Gangadhar-NG-CODER](https://github.com/Gangadhar-NG-CODER)

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details

---

**Built with ❤️ for the Murf AI Voice Agents Challenge**
