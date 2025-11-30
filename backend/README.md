# Voice Commerce - Backend (Python)

> 🛍️ **DAY 9 of the Murf AI Voice Agents Challenge**
>
> This backend powers the Voice Commerce shopping assistant - an AI-powered e-commerce agent that handles product browsing, search, and order placement through natural voice conversation.
> Built with **Murf Falcon TTS** (fastest TTS API), **Google Gemini 2.5 Flash**, and **AssemblyAI STT**.
> See the [main README](../README.md) for complete project details.

## 🛒 What This Does

This backend implements a **Shopping Assistant AI** that:

- **Browses** products with filters (category, price, color)
- **Searches** products by keywords and descriptions
- **Provides** detailed product information
- **Places** orders with quantity and options (size, color)
- **Persists** orders to JSON file storage
- **Retrieves** order history and summaries

## 🏗️ Tech Stack

- **LLM**: Google Gemini 2.5 Flash (conversation & product recommendations)
- **TTS**: Murf Falcon (fastest TTS API - 20 seconds of audio in <1 second)
- **STT**: AssemblyAI (speech-to-text)
- **Framework**: LiveKit Agents Python SDK
- **Turn Detection**: Multilingual Model (contextual speaker detection)
- **Data Storage**: JSON files (products.json, orders.json)

## ✨ Key Features

- **5 Function Tools** - Complete e-commerce operations
- **Product Catalog** - 13 products across 4 categories
- **Smart Search** - Natural language product search
- **Order Management** - Create and retrieve orders
- **Data Persistence** - Orders saved to JSON
- **Voice-Optimized** - Concise responses perfect for voice
- **Auto-Greeting** - Welcomes customers and explains catalog

## 📁 Project Structure

```
backend/
├── src/
│   ├── agent.py          # Main agent with 5 function tools
│   ├── catalog.py        # Product catalog management
│   └── orders.py         # Order management & persistence
├── data/
│   ├── products.json     # Product catalog (13 products)
│   └── orders.json       # Persisted orders
├── .env.local            # API keys (not in git)
├── .env.example          # Example environment variables
├── pyproject.toml        # Python dependencies
└── README.md
```

## 🛠️ Function Tools

### 1. `browse_products`
Filter products by category, price range, and color.

```python
browse_products(
    category="mug",      # Optional: mug, tshirt, hoodie, accessory
    max_price=500,       # Optional: maximum price in INR
    min_price=200,       # Optional: minimum price in INR
    color="black"        # Optional: product color
)
```

### 2. `search_products`
Search products by keywords or description.

```python
search_products(query="travel mug")
```

### 3. `get_product_details`
Get detailed information about a specific product.

```python
get_product_details(product_id="mug-003")
```

### 4. `place_order`
Create an order for a product.

```python
place_order(
    product_id="mug-003",  # Required: exact product ID
    quantity=2,            # Optional: default 1
    size="M",              # Optional: for clothing
    color="black"          # Optional: if available
)
```

### 5. `get_order_summary`
Get complete summary of all orders in the session.

```python
get_order_summary()
```

## 📦 Product Catalog

### Categories & Products

**Mugs** (3 items)
- Ceramic Coffee Mug - ₹299
- Stainless Steel Travel Mug - ₹599
- Glass Coffee Mug - ₹399

**T-Shirts** (3 items)
- Cotton T-Shirt Black - ₹499
- Cotton T-Shirt White - ₹499
- Cotton T-Shirt Grey - ₹499

**Hoodies** (3 items)
- Black Logo Hoodie - ₹1,499
- Grey Logo Hoodie - ₹1,499
- Navy Logo Hoodie - ₹1,499

**Accessories** (4 items)
- Baseball Cap - ₹399
- Tote Bag - ₹599
- Water Bottle - ₹349
- Laptop Sticker Pack - ₹199

## 🚀 Dev Setup

### Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) package manager

### Installation

```bash
cd backend

# Install dependencies
uv sync
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
# LiveKit
LIVEKIT_URL=wss://your-livekit-server-url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Murf AI (TTS)
MURF_API_KEY=your_murf_api_key

# AssemblyAI (STT)
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# Google Gemini (LLM)
GOOGLE_API_KEY=your_google_api_key
```

### Download Required Models

Before first run, download VAD and turn detection models:

```bash
uv run python src/agent.py download-files
```

## 🎮 Run the Agent

### Development Mode

For use with frontend:

```bash
uv run python src/agent.py dev
```

### Production Mode

```bash
uv run python src/agent.py start
```

### Console Mode (Testing)

Speak to the agent directly in your terminal:

```bash
uv run python src/agent.py console
```

## 📊 Data Models

### Product Schema

```json
{
  "id": "mug-003",
  "name": "Glass Coffee Mug",
  "description": "Elegant double-wall glass mug",
  "price": 399,
  "currency": "INR",
  "category": "mug",
  "attributes": {
    "color": "transparent",
    "material": "glass",
    "capacity": "300ml"
  }
}
```

### Order Schema

```json
{
  "id": "ORD-20251130153000",
  "items": [
    {
      "product_id": "mug-003",
      "product_name": "Glass Coffee Mug",
      "quantity": 2,
      "unit_price": 399,
      "currency": "INR"
    }
  ],
  "total": 798,
  "currency": "INR",
  "status": "CONFIRMED",
  "created_at": "2025-11-30T15:30:00Z"
}
```

## 🧪 Testing

Run the test suite:

```bash
uv run pytest
```

## 🎯 Agent Instructions

The agent is configured with comprehensive instructions for:
- E-commerce product assistance
- Natural voice conversation
- Product browsing and search
- Order placement and confirmation
- Handling customer questions
- Providing pricing information

See `src/agent.py` for the complete system prompt.

## 📝 Customization

### Adding Products

Edit `data/products.json` to add new products:

```json
{
  "id": "new-product-001",
  "name": "New Product",
  "description": "Product description",
  "price": 999,
  "currency": "INR",
  "category": "category_name",
  "attributes": {
    "key": "value"
  }
}
```

### Modifying Agent Behavior

Update the system prompt in `src/agent.py` under the `Assistant` class `instructions` parameter.

### Changing TTS Voice

Modify the TTS configuration in `src/agent.py`:

```python
tts=murf.TTS(
    voice="en-US-matthew",  # Change voice
    style="Conversation",    # Change style
    text_pacing=True
)
```

Available Murf voices: matthew, sarah, emma, etc.

## 🚀 Deployment

This project is production-ready and includes a working `Dockerfile`. Deploy to:
- LiveKit Cloud
- AWS/GCP/Azure
- Self-hosted servers

See the [LiveKit deployment guide](https://docs.livekit.io/agents/ops/deployment/) for details.

## 🤝 Contributing

This project is part of the Murf AI Voice Agents Challenge. Feel free to fork and adapt for your own voice commerce applications!

## 👨‍💻 Author

**Gangadhar**
- GitHub: [@Gangadhar-NG-CODER](https://github.com/Gangadhar-NG-CODER)

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details

---

**Built with ❤️ for the Murf AI Voice Agents Challenge**
