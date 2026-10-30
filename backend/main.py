import os
import sys
import json
import uuid
import time
from typing import List, Optional, Dict, Any

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(__file__))
from database import get_connection, init_db

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VoiceCart API", description="Accessible Voice-Assisted Grocery Shopping Backend", version="1.0.0")

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# --- Pydantic Models ---
class CartItem(BaseModel):
    product_id: str
    quantity: int

class CartValidationRequest(BaseModel):
    items: List[CartItem]
    coupon_code: Optional[str] = None

class BudgetAssistantRequest(BaseModel):
    budget: float
    category_preference: Optional[List[str]] = None

class ShoppingListParseRequest(BaseModel):
    text: Optional[str] = None
    items: Optional[List[str]] = None

class OrderCreateRequest(BaseModel):
    customer_name: str
    phone: str
    address: str
    delivery_slot: str
    payment_method: str
    items: List[CartItem]
    coupon_code: Optional[str] = None

# --- Helper Functions ---
def row_to_dict(row):
    d = dict(row)
    if "tags" in d and isinstance(d["tags"], str):
        try:
            d["tags"] = json.loads(d["tags"])
        except:
            d["tags"] = []
    if "in_stock" in d:
        d["in_stock"] = bool(d["in_stock"])
    if "is_deal" in d:
        d["is_deal"] = bool(d["is_deal"])
    if "is_popular" in d:
        d["is_popular"] = bool(d["is_popular"])
    return d

# --- Endpoints ---

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "VoiceCart API", "version": "1.0.0"}

@app.get("/api/categories")
def get_categories():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.display_order ASC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/products")
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    is_deal: Optional[bool] = None,
    is_popular: Optional[bool] = None,
    sort_by: Optional[str] = None, # 'price_asc', 'price_desc', 'rating', 'name'
    max_price: Optional[float] = None
):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if search:
        search_terms = f"%{search.strip().lower()}%"
        query += " AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)"
        params.extend([search_terms, search_terms, search_terms, search_terms])

    if category and category != "all":
        query += " AND category_id = ?"
        params.append(category)

    if is_deal is not None:
        query += " AND is_deal = ?"
        params.append(1 if is_deal else 0)

    if is_popular is not None:
        query += " AND is_popular = ?"
        params.append(1 if is_popular else 0)

    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)

    if sort_by == "price_asc":
        query += " ORDER BY price ASC"
    elif sort_by == "price_desc":
        query += " ORDER BY price DESC"
    elif sort_by == "rating":
        query += " ORDER BY rating DESC"
    elif sort_by == "name":
        query += " ORDER BY name ASC"
    else:
        query += " ORDER BY is_popular DESC, rating DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return row_to_dict(row)

@app.get("/api/products/{product_id}/alternatives")
def get_product_alternatives(product_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    base_prod = cursor.fetchone()
    if not base_prod:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
    
    base = row_to_dict(base_prod)
    # Find products in the same category or with matching tags, preferably cheaper
    cursor.execute("""
        SELECT * FROM products 
        WHERE category_id = ? AND id != ?
        ORDER BY price ASC
        LIMIT 4
    """, (base["category_id"], base["id"]))
    rows = cursor.fetchall()
    conn.close()

    alternatives = [row_to_dict(r) for r in rows]
    cheaper = [p for p in alternatives if p["price"] < base["price"]]
    
    speech_summary = ""
    if cheaper:
        cheapest = cheaper[0]
        savings = base["price"] - cheapest["price"]
        speech_summary = f"I found a cheaper alternative: {cheapest['name']} by {cheapest['brand']} for {int(cheapest['price'])} rupees, saving you {int(savings)} rupees."
    else:
        speech_summary = f"No cheaper alternative found in this category, but here are similar {base['category_id']} options."

    return {
        "base_product": base,
        "alternatives": alternatives,
        "cheaper_options": cheaper,
        "spoken_summary": speech_summary
    }

@app.get("/api/compare")
def compare_products(id1: str = Query(...), id2: str = Query(...)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id IN (?, ?)", (id1, id2))
    rows = cursor.fetchall()
    conn.close()

    if len(rows) < 2:
        raise HTTPException(status_code=400, detail="One or both products were not found")
    
    products = [row_to_dict(r) for r in rows]
    p1 = products[0] if products[0]["id"] == id1 else products[1]
    p2 = products[1] if products[1]["id"] == id2 else products[0]

    price_diff = abs(p1["price"] - p2["price"])
    cheaper_name = p1["name"] if p1["price"] < p2["price"] else p2["name"]
    cheaper_price = min(p1["price"], p2["price"])

    speech = (
        f"Comparing {p1['name']} at {int(p1['price'])} rupees against {p2['name']} at {int(p2['price'])} rupees. "
        f"{cheaper_name} is cheaper by {int(price_diff)} rupees. "
        f"{p1['name']} is rated {p1['rating']} stars, and {p2['name']} is rated {p2['rating']} stars."
    )

    return {
        "product1": p1,
        "product2": p2,
        "price_difference": price_diff,
        "cheaper_product_id": p1["id"] if p1["price"] < p2["price"] else p2["id"],
        "spoken_summary": speech
    }

@app.post("/api/budget-assistant")
def budget_assistant(req: BudgetAssistantRequest):
    budget = req.budget
    if budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than zero")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE in_stock = 1 ORDER BY price ASC")
    all_products = [row_to_dict(r) for r in cursor.fetchall()]
    conn.close()

    # Prioritize balanced essentials: Grain, Veg, Dairy, Fruit, Pulse
    priority_categories = ["rice-grains", "vegetables", "dairy-eggs", "fruits", "pulses-lentils", "bakery"]
    selected = []
    current_cost = 0.0

    # Pick 1 representative item from each priority category first
    for cat in priority_categories:
        candidates = [p for p in all_products if p["category_id"] == cat and (p["price"] + current_cost) <= budget]
        if candidates:
            # pick popular or best rated affordable
            best = min(candidates, key=lambda x: (x["price"]))
            selected.append({"product": best, "quantity": 1})
            current_cost += best["price"]

    # Fill in with more staple essentials if budget remains
    for p in all_products:
        if any(item["product"]["id"] == p["id"] for item in selected):
            continue
        if current_cost + p["price"] <= budget:
            selected.append({"product": p, "quantity": 1})
            current_cost += p["price"]

    remaining = budget - current_cost

    item_names = [f"{item['product']['name']} for {int(item['product']['price'])} rupees" for item in selected[:4]]
    spoken_summary = (
        f"With your budget of {int(budget)} rupees, I have put together a balanced basket of {len(selected)} essential items "
        f"totalling {int(current_cost)} rupees, leaving {int(remaining)} rupees balance. "
        f"Items include {', '.join(item_names)}. Would you like me to add all these to your cart?"
    )

    return {
        "budget": budget,
        "total_cost": current_cost,
        "remaining_balance": remaining,
        "items": selected,
        "spoken_summary": spoken_summary
    }

@app.post("/api/shopping-list/parse")
def parse_shopping_list(req: ShoppingListParseRequest):
    items_to_match = []
    if req.text:
        # e.g., "Add milk, rice, potatoes, and apples to my shopping list"
        raw = req.text.lower()
        for prefix in ["add", "to my shopping list", "to the shopping list", "to my list", "my list is", "i need", "please add"]:
            raw = raw.replace(prefix, "")
        raw = raw.replace("and", ",")
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        items_to_match.extend(parts)
    elif req.items:
        items_to_match.extend(req.items)

    if not items_to_match:
        return {"matched_items": [], "unmatched": [], "spoken_summary": "I could not find any items in your request."}

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE in_stock = 1")
    catalog = [row_to_dict(r) for r in cursor.fetchall()]
    conn.close()

    matched = []
    unmatched = []

    for query in items_to_match:
        q = query.strip().lower()
        if not q:
            continue
        # Find best match
        best_match = None
        for p in catalog:
            p_name = p["name"].lower()
            p_cat = p["category_id"].lower()
            p_desc = p["description"].lower()
            if q in p_name or any(q in tag.lower() for tag in p["tags"]) or q in p_cat:
                best_match = p
                break
        
        if best_match:
            # avoid duplicates
            if not any(m["product"]["id"] == best_match["id"] for m in matched):
                matched.append({
                    "query": query,
                    "product": best_match,
                    "quantity": 1
                })
        else:
            unmatched.append(query)

    total_est = sum(m["product"]["price"] for m in matched)
    names = [m["product"]["name"] for m in matched]

    if matched:
        spoken_summary = (
            f"I found {len(matched)} matching items: {', '.join(names[:4])}. "
            f"The estimated subtotal is {int(total_est)} rupees. Say 'Add list to cart' to proceed."
        )
    else:
        spoken_summary = "I couldn't find matches for the requested items in our grocery catalog."

    return {
        "matched_items": matched,
        "unmatched": unmatched,
        "estimated_total": total_est,
        "spoken_summary": spoken_summary
    }

@app.post("/api/cart/validate")
def validate_cart(req: CartValidationRequest):
    if not req.items:
        return {
            "subtotal": 0.0,
            "delivery_fee": 0.0,
            "discount": 0.0,
            "total": 0.0,
            "items": [],
            "item_count": 0,
            "free_delivery_threshold": 499.0
        }

    conn = get_connection()
    cursor = conn.cursor()
    
    validated_items = []
    subtotal = 0.0

    for item in req.items:
        cursor.execute("SELECT * FROM products WHERE id = ?", (item.product_id,))
        row = cursor.fetchone()
        if row:
            p = row_to_dict(row)
            qty = max(1, item.quantity)
            line_total = p["price"] * qty
            subtotal += line_total
            validated_items.append({
                "product": p,
                "quantity": qty,
                "line_total": line_total
            })
    
    conn.close()

    delivery_fee = 0.0 if subtotal >= 499.0 or subtotal == 0 else 30.0
    discount = 0.0

    if req.coupon_code:
        code = req.coupon_code.strip().upper()
        if code == "WELCOME50":
            discount = min(50.0, subtotal)
        elif code == "FRESH10":
            discount = round(subtotal * 0.10, 2)
        elif code == "FREESHIP":
            delivery_fee = 0.0

    total = max(0.0, subtotal + delivery_fee - discount)

    return {
        "subtotal": round(subtotal, 2),
        "delivery_fee": round(delivery_fee, 2),
        "discount": round(discount, 2),
        "coupon_applied": req.coupon_code.upper() if req.coupon_code and discount > 0 else None,
        "total": round(total, 2),
        "items": validated_items,
        "item_count": sum(i["quantity"] for i in validated_items),
        "free_delivery_threshold": 499.0
    }

@app.post("/api/orders")
def create_order(req: OrderCreateRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    cart_res = validate_cart(CartValidationRequest(items=req.items, coupon_code=req.coupon_code))
    
    order_id = f"VC-{uuid.uuid4().hex[:6].upper()}"
    conn = get_connection()
    cursor = conn.cursor()

    items_stored = [
        {
            "id": i["product"]["id"],
            "name": i["product"]["name"],
            "brand": i["product"]["brand"],
            "price": i["product"]["price"],
            "unit": i["product"]["unit"],
            "quantity": i["quantity"],
            "line_total": i["line_total"]
        }
        for i in cart_res["items"]
    ]

    cursor.execute("""
        INSERT INTO orders (
            id, customer_name, phone, address, delivery_slot, payment_method,
            subtotal, delivery_fee, discount, total, coupon_code, status, items_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_id,
        req.customer_name,
        req.phone,
        req.address,
        req.delivery_slot,
        req.payment_method,
        cart_res["subtotal"],
        cart_res["delivery_fee"],
        cart_res["discount"],
        cart_res["total"],
        req.coupon_code,
        "Confirmed",
        json.dumps(items_stored)
    ))

    conn.commit()
    conn.close()

    spoken_confirmation = (
        f"Order {order_id} placed successfully! Total amount of {int(cart_res['total'])} rupees "
        f"with {req.payment_method}. Your groceries will be delivered to {req.address} during {req.delivery_slot}."
    )

    return {
        "order_id": order_id,
        "customer_name": req.customer_name,
        "total": cart_res["total"],
        "status": "Confirmed",
        "delivery_slot": req.delivery_slot,
        "payment_method": req.payment_method,
        "spoken_confirmation": spoken_confirmation
    }

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Order not found")

    order = dict(row)
    order["items"] = json.loads(order["items_json"])

    # Simulate realistic timeline based on created_at or status
    tracking_steps = [
        {"step": "Order Confirmed", "completed": True, "description": "Order received and verified."},
        {"step": "Packed at Dark Store", "completed": True, "description": "Fresh items packed carefully with quality check."},
        {"step": "Out for Delivery", "completed": False, "description": "Delivery partner is on their way to your address."},
        {"step": "Delivered", "completed": False, "description": "Arrived at your doorstep."}
    ]

    order["tracking"] = tracking_steps
    order["spoken_status"] = f"Order {order_id} is currently packed at the store and scheduled for delivery in {order['delivery_slot']}."

    return order

@app.post("/api/voice/nlp")
def parse_voice_nlp(payload: Dict[str, Any]):
    prompt = payload.get("text", "").lower().strip()
    
    # Simple rule-based intelligent fallback for tricky voice inputs
    intent = "unknown"
    data = {}

    if any(w in prompt for w in ["budget", "under", "spend", "help me buy"]):
        intent = "budget"
        import re
        match = re.search(r"(\d+)", prompt)
        if match:
            data["budget"] = float(match.group(1))
        else:
            data["budget"] = 500.0

    elif any(w in prompt for w in ["compare", "vs", "versus", "difference"]):
        intent = "compare"

    elif any(w in prompt for w in ["cheaper", "alternative", "less price"]):
        intent = "cheaper_alternative"

    elif any(w in prompt for w in ["list", "add to shopping list", "grocery list"]):
        intent = "shopping_list"

    elif any(w in prompt for w in ["cart", "basket", "my items"]):
        intent = "view_cart"

    elif any(w in prompt for w in ["checkout", "pay", "order now"]):
        intent = "checkout"

    return {"intent": intent, "data": data, "original_text": prompt}
