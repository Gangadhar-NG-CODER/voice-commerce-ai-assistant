# DAY 9: Voice Commerce - E-commerce Shopping Assistant 🛍️

[![Murf AI](https://img.shields.io/badge/Powered%20by-Murf%20Falcon%20TTS-10b981?style=for-the-badge)](https://murf.ai)
[![LiveKit](https://img.shields.io/badge/Built%20with-LiveKit%20Agents-blue?style=for-the-badge)](https://livekit.io)
[![Challenge](https://img.shields.io/badge/Challenge-Day%209%2F10-success?style=for-the-badge)](https://github.com/Gangadhar-NG-CODER)

> **Part of the Murf AI Voice Agents Challenge** - Building 10 AI Voice Agents in 10 Days

## 🛒 About This Project

An **AI-powered voice shopping assistant** inspired by the Agentic Commerce Protocol (ACP). Shop naturally using your voice - browse products, get details, and place orders through conversational AI.

### The Experience

Simply speak to browse our catalog of mugs, t-shirts, hoodies, and accessories. The AI assistant understands your preferences, helps you find products, and completes your order - all through natural voice conversation.

## ✨ Features

- 🎙️ **Voice-First Shopping** - Browse and order using natural speech
- 🔍 **Smart Search** - Find products by category, price, color, or keywords
- 📦 **Product Catalog** - 13+ products across multiple categories
- 🛍️ **Easy Ordering** - Place orders with quantity and options (size, color)
- 📋 **Order History** - View your last order details
- ⚡ **Ultra-Fast TTS** - Powered by Murf Falcon (fastest TTS API)
- 🤖 **AI-Powered** - Natural language understanding with Google Gemini

## 🎯 Challenge Requirements Met

✅ Voice-driven product browsing with filters  
✅ ACP-inspired merchant layer (catalog + orders)  
✅ Natural language product search  
✅ Voice-based order placement  
✅ Order persistence to JSON file  
✅ View last order functionality  
✅ Structured product and order data models

## 🏗️ Tech Stack

- **TTS**: Murf Falcon (fastest TTS API in the world)
- **STT**: AssemblyAI
- **LLM**: Google Gemini 2.5 Flash
- **Framework**: LiveKit Agents (Python)
- **Frontend**: Next.js 15 + React 19
- **Backend**: Python 3.12 with uv package manager
- **Data Storage**: JSON files

## 📁 Project Structure

```
DAY9/
├── backend/
│   ├── src/
│   │   ├── agent.py          # Main agent with 5 function tools
│   │   ├── catalog.py        # Product catalog management
│   │   └── orders.py         # Order management
│   ├── data/
│   │   ├── products.json     # Product catalog (13 products)
│   │   └── orders.json       # Persisted orders
│   ├── .env.local            # API keys
│   └── pyproject.toml        # Python dependencies
├── frontend/
│   ├── app/                  # Next.js app
│   ├── components/
│   │   └── app/
│   │       ├── welcome-view.tsx      # E-commerce themed landing page
│   │       ├── session-view.tsx      # Shopping conversation page
│   │       └── shopping-overlay.tsx  # Status & interaction counter
│   ├── app-config.ts         # Branding configuration
│   └── package.json
└── README.md
```

## 🎮 How It Works

### The Shopping System

The agent uses 5 function tools to handle e-commerce operations:

1. **browse_products** - Filter by category, price range, color
2. **search_products** - Search by keywords or description
3. **get_product_details** - Get detailed product information
4. **place_order** - Create orders with quantity and options
5. **view_last_order** - Retrieve most recent order

### Product Catalog

**Categories:**
- **Mugs** (3 items) - Ceramic, stainless steel, glass
- **T-Shirts** (3 items) - Various colors and sizes
- **Hoodies** (3 items) - Comfortable fleece options
- **Accessories** (4 items) - Caps, bags, water bottles

**Price Range:** ₹299 - ₹1,499 INR

### Order Management

Orders are persisted to `backend/data/orders.json` with:
- Unique order ID (ORD-YYYYMMDDHHMMSS)
- Line items with product details
- Total amount and currency
- Order status (CONFIRMED)
- Timestamp

## 🚀 Quick Start

### Prerequisites

- Python 3.12+ with [uv](https://docs.astral.sh/uv/) package manager
- Node.js 18+ with pnpm
- LiveKit Server (included in project)

### Setup & Run

**1. Backend Setup**

```bash
cd DAY9/backend

# Install dependencies
uv sync

# Download required models
uv run python src/agent.py download-files
```

**2. Frontend Setup**

```bash
cd DAY9/frontend

# Install dependencies
pnpm install
```

**3. Run All Services**

Open 3 terminals:

```bash
# Terminal 1 - LiveKit Server (Windows)
cd DAY9/livekit_1.9.4_windows_amd64
.\livekit-server.exe --dev

# Terminal 2 - Backend Agent
cd DAY9/backend
uv run python src/agent.py dev

# Terminal 3 - Frontend
cd DAY9/frontend
pnpm dev
```

**4. Start Shopping**

1. Open http://localhost:3000 in your browser
2. Click "🛍️ Start Shopping"
3. Allow microphone access
4. Start browsing and ordering!

## 🎮 Example Conversations

**Browse Products:**
- "Show me all mugs"
- "Do you have t-shirts under 500 rupees?"
- "I'm looking for a black hoodie"
- "Show me accessories"

**Search Products:**
- "Find me a travel mug"
- "Do you have water bottles?"
- "Show me cotton t-shirts"

**Get Details:**
- "Tell me more about the first mug"
- "What sizes does the hoodie come in?"
- "Does this come in blue?"

**Place Order:**
- "I'll buy the ceramic mug"
- "Order 2 black t-shirts in size L"
- "I want the grey hoodie in medium"

**View Order:**
- "What did I just buy?"
- "Show me my last order"

## 📊 Data Models

### Product Schema
```json
{
  "id": "mug-001",
  "name": "Ceramic Coffee Mug",
  "description": "Classic white ceramic mug",
  "price": 299,
  "currency": "INR",
  "category": "mug",
  "attributes": {
    "color": "white",
    "material": "ceramic",
    "capacity": "350ml"
  }
}
```

### Order Schema
```json
{
  "id": "ORD-20251130153000",
  "items": [
    {
      "product_id": "mug-001",
      "product_name": "Ceramic Coffee Mug",
      "quantity": 2,
      "unit_price": 299,
      "currency": "INR"
    }
  ],
  "total": 598,
  "currency": "INR",
  "status": "CONFIRMED",
  "created_at": "2025-11-30T15:30:00Z"
}
```

## 🎬 Demo Video

[🎥 Watch the Demo](#) *(Coming Soon)*

See the Voice Commerce agent in action!

### Demo Highlights:
- Voice-driven product browsing
- Natural language search
- Order placement with confirmation
- Order persistence to JSON
- Complete shopping experience

## 📝 What I Learned

- Implementing ACP-inspired commerce architecture
- Separating conversation logic from commerce logic
- Building structured product and order data models
- Creating natural voice shopping experiences
- Managing state and persistence in voice applications
- Designing function tools for e-commerce operations

## 👨‍💻 Author

**Gangadhar**
- GitHub: [@Gangadhar-NG-CODER](https://github.com/Gangadhar-NG-CODER)
- LinkedIn: [Connect with me](https://linkedin.com/in/gangadhar)

## 🔗 Links

- **Challenge**: [Murf AI Voice Agents Challenge](https://murf.ai)
- **Project Repository**: [Voice Commerce Agent](https://github.com/Gangadhar-NG-CODER/voice-commerce)

## 🏆 Challenge Progress

- ✅ DAY 4: Teach-the-Tutor Active Recall Coach
- ✅ DAY 6: ICICI Bank Fraud Alert Agent
- ✅ DAY 7: Zepto Voice Shopping Agent
- ✅ DAY 8: Voice Game Master (D&D Adventure)
- ✅ **DAY 9: Voice Commerce (E-commerce Assistant)** ← You are here
- ⏳ DAY 10: Coming soon...

## 📚 Resources

- [Murf Falcon TTS](https://murf.ai/api/docs/text-to-speech/streaming)
- [LiveKit Agents](https://docs.livekit.io/agents)
- [AssemblyAI STT](https://www.assemblyai.com/)
- [Google Gemini](https://ai.google.dev/)
- [Agentic Commerce Protocol](https://agentic-commerce.org/)

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for the Murf AI Voice Agents Challenge**

*#MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents*
