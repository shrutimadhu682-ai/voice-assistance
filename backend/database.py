import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "voicecart.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Categories table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        display_order INTEGER DEFAULT 0
    )
    """)

    # Products table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category_id TEXT NOT NULL,
        price REAL NOT NULL,
        mrp REAL,
        unit TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        in_stock BOOLEAN DEFAULT 1,
        stock_count INTEGER DEFAULT 100,
        rating REAL DEFAULT 4.5,
        rating_count INTEGER DEFAULT 120,
        tags TEXT, -- JSON string array
        is_deal BOOLEAN DEFAULT 0,
        is_popular BOOLEAN DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )
    """)

    # Orders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        delivery_slot TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        subtotal REAL NOT NULL,
        delivery_fee REAL NOT NULL,
        discount REAL NOT NULL,
        total REAL NOT NULL,
        coupon_code TEXT,
        status TEXT DEFAULT 'Confirmed',
        items_json TEXT NOT NULL
    )
    """)

    # Shopping lists table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shopping_lists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        items_json TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()
