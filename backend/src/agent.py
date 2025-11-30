import logging
from typing import Annotated

from dotenv import load_dotenv
from pydantic import Field
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool,
    RunContext
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation, assemblyai
from livekit.plugins.turn_detector.multilingual import MultilingualModel

from catalog import list_products, search_products, get_product_by_id, format_products_list, format_product_summary
from orders import create_order, get_last_order, format_order_summary

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful e-commerce shopping assistant. Your role is to help customers browse products, get product details, and place orders.

YOUR CAPABILITIES:
- Browse and search the product catalog
- Filter products by category, price, color
- Provide detailed product information
- Help customers place orders
- Show order history and details

PRODUCT CATEGORIES:
- Mugs (coffee mugs, travel mugs, glass mugs)
- T-shirts (various colors and sizes)
- Hoodies (comfortable fleece hoodies)
- Accessories (caps, bags, water bottles)

GUIDELINES FOR INTERACTION:
- Be friendly, helpful, and professional
- Keep responses concise for voice interaction (2-4 sentences)
- Always mention product names and prices clearly
- When listing products, limit to 3-5 items at a time
- Confirm order details before placing an order
- Use the tools available to browse, search, and create orders
- If a customer asks about a product, use the search or browse tools
- When placing an order, confirm the product, quantity, and any options (size, color)

IMPORTANT - AFTER PLACING AN ORDER:
- Always ask: "Would you like to order anything else, or are you done shopping?"
- If they say "I'm done", "that's all", "checkout", or similar:
  1. Use the get_order_summary tool to retrieve all their orders
  2. Read out the complete order summary to them
  3. The visual order summary popup will appear automatically on screen
- Make sure to speak the order details clearly so they can hear what they ordered

PRICING:
- All prices are in Indian Rupees (INR)
- Mention the currency when stating prices

TONE:
- Friendly and conversational
- Professional but not overly formal
- Helpful and patient
- Enthusiastic about products

Remember: You are speaking to customers via voice. Keep it natural and conversational.""",
        )

    @function_tool
    async def browse_products(
        self,
        context: RunContext,
        category: Annotated[str, Field(default="")] = "",
        max_price: Annotated[int, Field(default=0)] = 0,
        min_price: Annotated[int, Field(default=0)] = 0,
        color: Annotated[str, Field(default="")] = ""
    ) -> str:
        """Browse the product catalog with optional filters.
        
        Use this tool when customers want to see products or filter by specific criteria.
        All parameters are optional - you can provide any combination of filters.
        
        Args:
            category: Product category (mug, tshirt, hoodie, accessory). Optional.
            max_price: Maximum price in INR. Optional.
            min_price: Minimum price in INR. Optional.
            color: Product color (black, white, grey, blue, etc.). Optional.
        
        Returns:
            Formatted list of products matching the filters
        """
        logger.info(f"Browsing products: category={category}, max_price={max_price}, min_price={min_price}, color={color}")
        
        filters = {}
        if category and category.strip():
            filters["category"] = category.strip()
        if max_price and max_price > 0:
            filters["max_price"] = max_price
        if min_price and min_price > 0:
            filters["min_price"] = min_price
        if color and color.strip():
            filters["color"] = color.strip()
        
        products = list_products(filters if filters else None)
        return format_products_list(products)
    
    @function_tool
    async def search_products(
        self,
        context: RunContext,
        query: str
    ) -> str:
        """Search for products by name, description, or keywords.
        
        Use this tool when customers describe what they're looking for.
        
        Args:
            query: Search query (e.g., "coffee mug", "black hoodie", "water bottle")
        
        Returns:
            Formatted list of matching products
        """
        logger.info(f"Searching products: query={query}")
        
        products = search_products(query)
        return format_products_list(products)
    
    @function_tool
    async def get_product_details(
        self,
        context: RunContext,
        product_id: str
    ) -> str:
        """Get detailed information about a specific product.
        
        Use this tool when customers ask about a specific product.
        
        Args:
            product_id: Product ID (e.g., "mug-001", "tshirt-002")
        
        Returns:
            Detailed product information
        """
        logger.info(f"Getting product details: product_id={product_id}")
        
        product = get_product_by_id(product_id)
        
        if not product:
            return f"Sorry, I couldn't find a product with ID {product_id}."
        
        name = product.get("name", "Unknown")
        price = product.get("price", 0)
        currency = product.get("currency", "INR")
        description = product.get("description", "")
        attributes = product.get("attributes", {})
        
        result = f"{name} - {price} {currency}\n\n{description}\n\n"
        
        if attributes:
            result += "Details:\n"
            for key, value in attributes.items():
                result += f"- {key.capitalize()}: {value}\n"
        
        return result
    
    @function_tool
    async def place_order(
        self,
        context: RunContext,
        product_id: str,
        quantity: int = 1,
        size: Annotated[str, Field(default="")] = "",
        color: Annotated[str, Field(default="")] = ""
    ) -> str:
        """Place an order for a product.
        
        CRITICAL: You MUST use the exact product ID from the browse_products or search_products results.
        The product ID format is: "mug-001", "mug-002", "mug-003", "tshirt-001", etc.
        
        NEVER make up or guess a product ID. Always use the ID from the search/browse results.
        
        Example: If search returns "Glass Coffee Mug" with id "mug-003", use "mug-003" as product_id.
        
        Args:
            product_id: EXACT product ID from search results (e.g., "mug-003", "tshirt-001")
            quantity: Number of items (default: 1)
            size: Size option if applicable (S, M, L, XL)
            color: Color option if applicable
        
        Returns:
            Order confirmation with order ID and details
        """
        logger.info(f"Placing order: product_id={product_id}, quantity={quantity}, size={size}, color={color}")
        
        # Try to find product by ID first
        product = get_product_by_id(product_id)
        
        # If not found by ID, try to search by name
        if not product:
            # Try searching for the product by name
            from catalog import search_products
            search_results = search_products(product_id)
            if search_results and len(search_results) > 0:
                product = search_results[0]
                product_id = product.get("id")
                logger.info(f"Found product by name search: {product_id}")
            else:
                return f"Sorry, I couldn't find that product. Please try browsing or searching first to see available products."
        
        # Create line item
        line_item = {
            "product_id": product_id,
            "quantity": quantity
        }
        
        if size and size.strip():
            line_item["size"] = size.strip()
        if color and color.strip():
            line_item["color"] = color.strip()
        
        # Create order
        order = create_order([line_item])
        
        return f"Order placed successfully!\n\n{format_order_summary(order)}\n\nWould you like to order anything else, or are you done shopping?"
    
    @function_tool
    async def view_last_order(
        self,
        context: RunContext
    ) -> str:
        """View the most recent order details.
        
        Use this tool when customers ask about their last order or what they just bought.
        
        Returns:
            Details of the most recent order
        """
        logger.info("Viewing last order")
        
        order = get_last_order()
        
        if not order:
            return "You haven't placed any orders yet. Would you like to browse our products?"
        
        return format_order_summary(order)
    
    @function_tool
    async def get_order_summary(
        self,
        context: RunContext
    ) -> str:
        """Get a complete summary of all orders placed in this session.
        
        Use this tool when the customer says they're done shopping and wants to see their order summary.
        This will retrieve all orders and format them for voice output.
        
        Returns:
            Complete order summary with all items and total
        """
        logger.info("Getting complete order summary")
        
        from orders import list_orders
        orders = list_orders()
        
        if not orders:
            return "You haven't placed any orders yet. Would you like to browse our products?"
        
        # Format all orders for voice
        summary = f"Here's your complete order summary. You placed {len(orders)} order{'s' if len(orders) > 1 else ''}.\n\n"
        
        grand_total = 0
        all_items = []
        
        for order in orders:
            items = order.get("items", [])
            for item in items:
                all_items.append(item)
                grand_total += item.get("unit_price", 0) * item.get("quantity", 1)
        
        # List all items
        for item in all_items:
            name = item.get("product_name", "Unknown")
            quantity = item.get("quantity", 1)
            unit_price = item.get("unit_price", 0)
            total_price = unit_price * quantity
            
            summary += f"{quantity} {name}"
            if quantity > 1:
                summary += f" at {unit_price} rupees each"
            summary += f" for {total_price} rupees"
            
            # Add size/color if present
            if "size" in item:
                summary += f", size {item['size']}"
            if "color" in item:
                summary += f", {item['color']} color"
            
            summary += ". "
        
        summary += f"\n\nYour grand total is {grand_total} rupees. Thank you for shopping with us!"
        
        return summary


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=assemblyai.STT(),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
                model="gemini-2.5-flash",
            ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
                voice="en-US-matthew", 
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead.
    # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    # 1. Install livekit-agents[openai]
    # 2. Set OPENAI_API_KEY in .env.local
    # 3. Add `from livekit.plugins import openai` to the top of this file
    # 4. Use the following session setup instead of the version above
    # session = AgentSession(
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # Metrics collection, to measure pipeline performance
    # For more information, see https://docs.livekit.io/agents/build/metrics/
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()
    
    # Send initial greeting
    await session.say(
        "Welcome to Voice Commerce! I'm your AI shopping assistant. I can help you browse our products, find what you're looking for, and place orders. We have mugs, t-shirts, hoodies, and accessories. What would you like to shop for today?",
        allow_interruptions=True
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
