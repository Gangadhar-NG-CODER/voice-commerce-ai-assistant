# DAY9 Voice Commerce - Final Video Script

## 🎬 Total Time: 2-3 minutes

---

## INTRO (15 seconds)

**You Say:**
"Hey everyone! Day 9 of the Murf AI Voice Agents Challenge. Today I built a Voice Commerce agent - an AI shopping assistant inspired by the Agentic Commerce Protocol. You can browse products, search, and place orders using just your voice. Let me show you!"

---

## SHOW UI (10 seconds)

**On Screen:** Welcome screen with shopping bag icon

**You Say:**
"Here's the interface - clean, e-commerce themed. Let's start shopping!"

**[Click "Start Shopping"]**

---

## SHOPPING SESSION (90 seconds)

### Order 1: Browse & Buy Mug (25s)

**You:** "Show me all mugs"

**Agent:** "I found 3 products. Here they are: 1. Ceramic Coffee Mug - 299 INR, 2. Stainless Steel Travel Mug - 599 INR, 3. Glass Coffee Mug - 399 INR"

**You:** "I'll buy the Ceramic Coffee Mug"

**Agent:** "Order placed successfully! Order ORD-XXX... Would you like to order anything else, or are you done shopping?"

**[No popup - order tracked silently]**

---

### Order 2: Browse & Buy T-Shirt (25s)

**You:** "Yes, show me t-shirts"

**Agent:** "I found 3 products. Here they are: 1. Cotton T-Shirt Black - 499 INR, 2. Cotton T-Shirt White - 499 INR, 3. Graphic T-Shirt - 699 INR"

**You:** "I'll buy the black t-shirt in size medium"

**Agent:** "Order placed successfully! Order ORD-YYY... Would you like to order anything else, or are you done shopping?"

**[Still no popup - both orders tracked]**

---

### Order 3: Search & Buy Hoodie (25s)

**You:** "Find me a black hoodie"

**Agent:** "I found 1 product: Black Hoodie - 1299 INR. Comfortable fleece hoodie in black."

**You:** "I'll buy it in size large"

**Agent:** "Order placed successfully! Order ORD-ZZZ... Would you like to order anything else, or are you done shopping?"

**[Still no popup - all 3 orders tracked]**

---

### Finish & Show Summary (15s)

**You:** "I'm done shopping"

**Agent:** "Great! Let me show you your order summary."

**[🎉 ORDER SUMMARY POPUP APPEARS!]**

**On Screen:** Beautiful popup showing:
- Ceramic Coffee Mug - ₹299
- Black T-Shirt (Size: M) - ₹499
- Black Hoodie (Size: L) - ₹1299
- Subtotal: ₹2097
- Shipping: ₹0.00
- Total due today: ₹2097

**You Say (voiceover):**
"And here's the order summary popup showing all three orders together - clean, professional, just like a real e-commerce checkout."

---

## SHOW ORDERS.JSON (15 seconds)

**[Close popup, open orders.json in editor]**

**On Screen:** Show `DAY9/backend/data/orders.json` with all 3 orders

**You Say:**
"And here are all the orders persisted to JSON - complete with order IDs, items, sizes, totals, and timestamps following the Agentic Commerce Protocol."

---

## FEATURES (15 seconds)

**On Screen:** Quick text overlay:
- ✅ Voice browsing & search
- ✅ Smart filtering
- ✅ Multiple orders in one session
- ✅ Order summary popup
- ✅ JSON persistence
- ✅ Murf Falcon TTS

**You Say:**
"The agent uses 5 function tools powered by Murf Falcon - the fastest TTS API - for ultra-responsive voice shopping. Orders are tracked silently and shown together at checkout."

---

## OUTRO (15 seconds)

**On Screen:**
- GitHub link
- LinkedIn profile
- Hashtags: #MurfAI #VoiceAgents #VoiceCommerce

**You Say:**
"That's Day 9! A voice-powered e-commerce agent with natural shopping flow and professional order summary. Check out the code on GitHub. One more day to go! See you tomorrow!"

---

## 🎥 RECORDING TIPS

### Before Recording:
- [ ] Empty orders.json
- [ ] All 3 services running
- [ ] Browser at http://localhost:3000
- [ ] Test the flow 2-3 times
- [ ] Check audio levels

### Your Complete Dialogue:
1. "Show me all mugs"
2. "I'll buy the Ceramic Coffee Mug"
3. "Yes, show me t-shirts"
4. "I'll buy the black t-shirt in size medium"
5. "Find me a black hoodie"
6. "I'll buy it in size large"
7. **"I'm done shopping"** ← Triggers popup!

### Key Points:
- ✅ Wait for agent to finish before speaking
- ✅ Let the UI show everything
- ✅ Orders tracked silently (no popup spam)
- ✅ Say "I'm done" to trigger summary
- ✅ Popup shows all orders together
- ❌ Don't interrupt the agent
- ❌ Don't narrate the UI

### What Viewers Will See:
1. Natural shopping conversation
2. Multiple orders placed smoothly
3. Agent asks "Would you like more?" after each order
4. User says "I'm done"
5. Beautiful order summary popup appears
6. All orders shown together
7. Professional e-commerce experience

---

## 📝 ALTERNATIVE SHORTER VERSION (1.5 minutes)

If you want a shorter demo:

### Quick Flow:
1. **Intro** (10s)
2. **Order 1** - Mug (15s)
3. **Order 2** - Hoodie (15s)
4. **Say "I'm done"** - Popup appears (10s)
5. **Show orders.json** (10s)
6. **Features** (10s)
7. **Outro** (10s)

---

## 🎯 KEY MESSAGES

1. **Natural Shopping Flow** - No popup interruptions
2. **Multiple Orders** - Shop freely, see summary at end
3. **Professional UI** - Clean order summary popup
4. **Voice-First** - Natural conversation
5. **ACP-Inspired** - Following e-commerce best practices
6. **Complete Solution** - Browse, search, order, persist

---

## ✅ CHECKLIST

### Pre-Recording:
- [ ] orders.json is empty
- [ ] All services running
- [ ] Frontend loads correctly
- [ ] Test conversation flow works
- [ ] Popup appears when saying "I'm done"

### During Recording:
- [ ] Clear audio
- [ ] Natural conversation
- [ ] Wait for agent responses
- [ ] Show popup clearly
- [ ] Show orders.json file

### Post-Recording:
- [ ] Trim dead air
- [ ] Add feature overlay
- [ ] Export 1080p
- [ ] Keep under 3 minutes
- [ ] Add captions if needed

---

**Good luck with your recording!** 🎬🛍️✨
