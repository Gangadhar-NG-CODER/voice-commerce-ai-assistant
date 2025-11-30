"""Order management for e-commerce agent."""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from catalog import get_product_by_id

logger = logging.getLogger(__name__)

ORDERS_FILE = Path(__file__).parent.parent / "data" / "orders.json"


def load_orders() -> list[dict[str, Any]]:
    """Load orders from JSON file."""
    try:
        with open(ORDERS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("orders", [])
    except FileNotFoundError:
        logger.warning(f"Orders file not found: {ORDERS_FILE}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing orders JSON: {e}")
        return []


def save_orders(orders: list[dict[str, Any]]) -> bool:
    """Save orders to JSON file."""
    try:
        with open(ORDERS_FILE, "w", encoding="utf-8") as f:
            json.dump({"orders": orders}, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        logger.error(f"Error saving orders: {e}")
        return False


def generate_order_id() -> str:
    """Generate a unique order ID."""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"ORD-{timestamp}"


def create_order(line_items: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Create a new order.
    
    Args:
        line_items: List of items with structure:
            [
                {
                    "product_id": "mug-001",
                    "quantity": 2,
                    "size": "M",  # optional
                    "color": "black"  # optional
                }
            ]
    
    Returns:
        Order dict with structure:
        {
            "id": "ORD-20251130153000",
            "items": [...],
            "total": 598,
            "currency": "INR",
            "status": "CONFIRMED",
            "created_at": "2025-11-30T15:30:00Z"
        }
    """
    order_id = generate_order_id()
    order_items = []
    total = 0
    currency = "INR"
    
    for item in line_items:
        product_id = item.get("product_id")
        quantity = item.get("quantity", 1)
        
        # Get product details
        product = get_product_by_id(product_id)
        if not product:
            logger.warning(f"Product not found: {product_id}")
            continue
        
        unit_price = product.get("price", 0)
        item_total = unit_price * quantity
        total += item_total
        
        order_item = {
            "product_id": product_id,
            "product_name": product.get("name", "Unknown"),
            "quantity": quantity,
            "unit_price": unit_price,
            "currency": product.get("currency", "INR"),
        }
        
        # Add optional attributes
        if "size" in item:
            order_item["size"] = item["size"]
        if "color" in item:
            order_item["color"] = item["color"]
        
        order_items.append(order_item)
    
    # Create order object
    order = {
        "id": order_id,
        "items": order_items,
        "total": total,
        "currency": currency,
        "status": "CONFIRMED",
        "created_at": datetime.now().isoformat()
    }
    
    # Save to file
    orders = load_orders()
    orders.append(order)
    save_orders(orders)
    
    logger.info(f"Order created: {order_id}, Total: {total} {currency}")
    
    return order


def get_last_order() -> dict[str, Any] | None:
    """Get the most recent order."""
    orders = load_orders()
    
    if not orders:
        return None
    
    # Return the last order
    return orders[-1]


def get_order_by_id(order_id: str) -> dict[str, Any] | None:
    """Get an order by its ID."""
    orders = load_orders()
    
    for order in orders:
        if order.get("id") == order_id:
            return order
    
    return None


def list_orders() -> list[dict[str, Any]]:
    """List all orders."""
    return load_orders()


def format_order_summary(order: dict[str, Any]) -> str:
    """Format an order for voice output."""
    order_id = order.get("id", "Unknown")
    items = order.get("items", [])
    total = order.get("total", 0)
    currency = order.get("currency", "INR")
    status = order.get("status", "UNKNOWN")
    
    result = f"Order {order_id} - Status: {status}\n\n"
    result += "Items:\n"
    
    for item in items:
        name = item.get("product_name", "Unknown")
        quantity = item.get("quantity", 1)
        unit_price = item.get("unit_price", 0)
        
        result += f"- {name} x {quantity} = {unit_price * quantity} {currency}"
        
        # Add size/color if present
        if "size" in item:
            result += f" (Size: {item['size']})"
        if "color" in item:
            result += f" (Color: {item['color']})"
        
        result += "\n"
    
    result += f"\nTotal: {total} {currency}"
    
    return result
