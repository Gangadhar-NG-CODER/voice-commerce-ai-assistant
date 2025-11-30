"""Product catalog management for e-commerce agent."""

import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

CATALOG_FILE = Path(__file__).parent.parent / "data" / "products.json"


def load_catalog() -> list[dict[str, Any]]:
    """Load the product catalog from JSON file."""
    try:
        with open(CATALOG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("products", [])
    except FileNotFoundError:
        logger.error(f"Catalog file not found: {CATALOG_FILE}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing catalog JSON: {e}")
        return []


def list_products(filters: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """
    List products with optional filters.
    
    Supported filters:
    - category: str (e.g., "mug", "tshirt", "hoodie", "accessory")
    - max_price: int (maximum price in INR)
    - color: str (product color)
    - min_price: int (minimum price in INR)
    """
    products = load_catalog()
    
    if not filters:
        return products
    
    filtered = products
    
    # Filter by category (case-insensitive, handle variations and plurals)
    if "category" in filters and filters["category"]:
        category = filters["category"].lower().strip().replace("-", "").replace(" ", "").rstrip("s")
        filtered = [p for p in filtered if p.get("category", "").lower().strip().replace("-", "").replace(" ", "").rstrip("s") == category]
    
    # Filter by max price
    if "max_price" in filters and filters["max_price"] is not None:
        max_price = filters["max_price"]
        filtered = [p for p in filtered if p.get("price", 0) <= max_price]
    
    # Filter by min price
    if "min_price" in filters and filters["min_price"] is not None:
        min_price = filters["min_price"]
        filtered = [p for p in filtered if p.get("price", 0) >= min_price]
    
    # Filter by color
    if "color" in filters and filters["color"]:
        color = filters["color"].lower()
        filtered = [
            p for p in filtered
            if color in p.get("attributes", {}).get("color", "").lower()
        ]
    
    return filtered


def search_products(query: str) -> list[dict[str, Any]]:
    """
    Search products by name or description.
    
    Args:
        query: Search query string
        
    Returns:
        List of matching products
    """
    products = load_catalog()
    query_lower = query.lower()
    
    results = []
    for product in products:
        name = product.get("name", "").lower()
        description = product.get("description", "").lower()
        category = product.get("category", "").lower()
        
        if query_lower in name or query_lower in description or query_lower in category:
            results.append(product)
    
    return results


def get_product_by_id(product_id: str) -> dict[str, Any] | None:
    """
    Get a product by its ID.
    
    Args:
        product_id: Product ID
        
    Returns:
        Product dict or None if not found
    """
    products = load_catalog()
    
    for product in products:
        if product.get("id") == product_id:
            return product
    
    return None


def format_product_summary(product: dict[str, Any]) -> str:
    """Format a product for voice output."""
    product_id = product.get("id", "unknown")
    name = product.get("name", "Unknown")
    price = product.get("price", 0)
    currency = product.get("currency", "INR")
    description = product.get("description", "")
    
    return f"{name} (ID: {product_id}) - {price} {currency}. {description}"


def format_products_list(products: list[dict[str, Any]], max_items: int = 5) -> str:
    """Format a list of products for voice output."""
    if not products:
        return "No products found matching your criteria."
    
    count = len(products)
    items_to_show = products[:max_items]
    
    result = f"I found {count} product{'s' if count != 1 else ''}. "
    
    if count > max_items:
        result += f"Here are the first {max_items}:\n\n"
    else:
        result += "Here they are:\n\n"
    
    for i, product in enumerate(items_to_show, 1):
        result += f"{i}. {format_product_summary(product)}\n"
    
    if count > max_items:
        result += f"\nThere are {count - max_items} more products. Would you like to see more or filter further?"
    
    return result
