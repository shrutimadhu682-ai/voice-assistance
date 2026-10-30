import json
from database import get_connection, init_db

CATEGORIES = [
    {
        "id": "fruits",
        "name": "Fruits",
        "description": "Farm-fresh sweet and juicy seasonal fruits",
        "icon": "Apple",
        "display_order": 1
    },
    {
        "id": "vegetables",
        "name": "Vegetables",
        "description": "Crisp, organic and freshly harvested everyday vegetables",
        "icon": "Carrot",
        "display_order": 2
    },
    {
        "id": "dairy-eggs",
        "name": "Dairy and Eggs",
        "description": "Pasteurized milk, farm butter, fresh paneer, curd, and farm eggs",
        "icon": "Milk",
        "display_order": 3
    },
    {
        "id": "rice-grains",
        "name": "Rice and Grains",
        "description": "Aromatic Basmati rice, premium whole wheat chakki atta, and grains",
        "icon": "Wheat",
        "display_order": 4
    },
    {
        "id": "pulses-lentils",
        "name": "Pulses and Lentils",
        "description": "Unpolished nutritious Toor, Moong, Chana, and Rajma dals",
        "icon": "Boxes",
        "display_order": 5
    },
    {
        "id": "snacks",
        "name": "Snacks",
        "description": "Crispy bhujia, crunchy chips, roasted nuts, and tea-time snacks",
        "icon": "Cookie",
        "display_order": 6
    },
    {
        "id": "beverages",
        "name": "Beverages",
        "description": "Premium tea blends, aromatic filter coffee, and pure fruit juices",
        "icon": "Coffee",
        "display_order": 7
    },
    {
        "id": "bakery",
        "name": "Bakery",
        "description": "Freshly baked whole wheat breads, pavs, buns, and cookies",
        "icon": "Croissant",
        "display_order": 8
    },
    {
        "id": "personal-care",
        "name": "Personal Care",
        "description": "Soaps, gentle handwash, oral care, and skin essentials",
        "icon": "Sparkles",
        "display_order": 9
    },
    {
        "id": "household",
        "name": "Household Essentials",
        "description": "Detergents, dishwash liquids, surface cleaners, and kitchen foil",
        "icon": "Home",
        "display_order": 10
    }
]

PRODUCTS = [
    # 1. Fruits
    {
        "id": "prod-apple-shimla",
        "name": "Fresh Shimla Red Apples",
        "brand": "Fresh Farms",
        "category_id": "fruits",
        "price": 140.0,
        "mrp": 160.0,
        "unit": "1 kg",
        "description": "Crisp, sweet, and juicy red apples sourced directly from Himachal orchards. Rich in dietary fiber and vitamins.",
        "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 45,
        "rating": 4.8,
        "rating_count": 230,
        "tags": ["organic", "fresh", "popular"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-banana-robusta",
        "name": "Fresh Robusta Bananas",
        "brand": "Fresh Farms",
        "category_id": "fruits",
        "price": 45.0,
        "mrp": 55.0,
        "unit": "1 dozen (12 pcs)",
        "description": "Naturally ripened yellow robusta bananas with rich potassium content and instant energy.",
        "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 80,
        "rating": 4.7,
        "rating_count": 310,
        "tags": ["fresh", "energy"],
        "is_deal": True,
        "is_popular": True
    },
    {
        "id": "prod-orange-nagpur",
        "name": "Nagpur Sweet Oranges (Santra)",
        "brand": "Daily Fresh",
        "category_id": "fruits",
        "price": 75.0,
        "mrp": 90.0,
        "unit": "1 kg",
        "description": "Zesty and juicy Nagpur oranges packed with Vitamin C and natural electrolytes.",
        "image_url": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 35,
        "rating": 4.6,
        "rating_count": 140,
        "tags": ["citrus", "vitamin-c"],
        "is_deal": False,
        "is_popular": False
    },
    {
        "id": "prod-pomegranate",
        "name": "Fresh Ruby Pomegranate (Anar)",
        "brand": "Daily Fresh",
        "category_id": "fruits",
        "price": 180.0,
        "mrp": 210.0,
        "unit": "1 kg",
        "description": "Deep red sweet pomegranate pearls rich in antioxidants and iron.",
        "image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 25,
        "rating": 4.9,
        "rating_count": 88,
        "tags": ["antioxidant", "superfood"],
        "is_deal": False,
        "is_popular": False
    },

    # 2. Vegetables
    {
        "id": "prod-potato-agra",
        "name": "Agra Fresh Potatoes (Aloo)",
        "brand": "Farm Fresh",
        "category_id": "vegetables",
        "price": 30.0,
        "mrp": 38.0,
        "unit": "1 kg",
        "description": "Firm, earthy Agra potatoes ideal for curries, boiling, roasting, and making aloo paratha.",
        "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 120,
        "rating": 4.7,
        "rating_count": 520,
        "tags": ["staple", "fresh"],
        "is_deal": True,
        "is_popular": True
    },
    {
        "id": "prod-tomato-hybrid",
        "name": "Fresh Hybrid Tomatoes (Tamatar)",
        "brand": "Farm Fresh",
        "category_id": "vegetables",
        "price": 40.0,
        "mrp": 50.0,
        "unit": "1 kg",
        "description": "Firm and juicy plump red tomatoes with balanced sweetness and acidity for Indian gravies.",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 95,
        "rating": 4.6,
        "rating_count": 480,
        "tags": ["staple", "fresh"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-onion-red",
        "name": "Fresh Nashik Red Onions (Pyaaz)",
        "brand": "Farm Fresh",
        "category_id": "vegetables",
        "price": 35.0,
        "mrp": 45.0,
        "unit": "1 kg",
        "description": "Pungent, crunchy red onions from Nashik farms. Essential kitchen staple for base masalas.",
        "image_url": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 110,
        "rating": 4.8,
        "rating_count": 410,
        "tags": ["staple", "fresh"],
        "is_deal": True,
        "is_popular": True
    },
    {
        "id": "prod-spinach-palak",
        "name": "Fresh Green Spinach (Palak)",
        "brand": "Farm Fresh",
        "category_id": "vegetables",
        "price": 25.0,
        "mrp": 32.0,
        "unit": "250 g bunch",
        "description": "Tender young green spinach leaves, washed and freshly plucked. Rich in iron and folate.",
        "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 40,
        "rating": 4.5,
        "rating_count": 190,
        "tags": ["greens", "iron-rich"],
        "is_deal": False,
        "is_popular": False
    },

    # 3. Dairy and Eggs
    {
        "id": "prod-amul-gold-milk",
        "name": "Amul Gold Full Cream Fresh Milk",
        "brand": "Amul",
        "category_id": "dairy-eggs",
        "price": 35.0,
        "mrp": 35.0,
        "unit": "500 ml pouch",
        "description": "Amul Gold homogenized full cream cow and buffalo milk with 6.0% fat and 9.0% SNF. Excellent for tea, coffee, and sweets.",
        "image_url": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 150,
        "rating": 4.9,
        "rating_count": 890,
        "tags": ["dairy", "fresh", "popular"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-amul-taaza-milk",
        "name": "Amul Taaza Toned Fresh Milk",
        "brand": "Amul",
        "category_id": "dairy-eggs",
        "price": 29.0,
        "mrp": 29.0,
        "unit": "500 ml pouch",
        "description": "Amul Taaza toned milk with 3.0% fat and 8.5% SNF. Light, wholesome everyday milk.",
        "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 130,
        "rating": 4.8,
        "rating_count": 620,
        "tags": ["dairy", "toned"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-amul-milk-1l",
        "name": "Amul Taaza Homogenised Milk (1 Litre)",
        "brand": "Amul",
        "category_id": "dairy-eggs",
        "price": 68.0,
        "mrp": 72.0,
        "unit": "1 Litre carton",
        "description": "Long shelf-life UHT treated pure milk, untouched by hands and fortified with Vitamins A and D.",
        "image_url": "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 60,
        "rating": 4.8,
        "rating_count": 450,
        "tags": ["dairy", "carton"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-mother-dairy-curd",
        "name": "Mother Dairy Classic Curd (Dahi)",
        "brand": "Mother Dairy",
        "category_id": "dairy-eggs",
        "price": 40.0,
        "mrp": 42.0,
        "unit": "400 g tub",
        "description": "Thick, creamy, naturally set curd made from pasteurized milk. Great for raita, lassi, or eating with parathas.",
        "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 75,
        "rating": 4.7,
        "rating_count": 310,
        "tags": ["dairy", "probiotic"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-amul-butter",
        "name": "Amul Pasteurised Butter",
        "brand": "Amul",
        "category_id": "dairy-eggs",
        "price": 58.0,
        "mrp": 60.0,
        "unit": "100 g pack",
        "description": "The taste of India! Pure delicious salted cream butter, perfect for breakfast toasts and hot parathas.",
        "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 90,
        "rating": 4.9,
        "rating_count": 780,
        "tags": ["dairy", "butter", "popular"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-farm-eggs-6",
        "name": "Farm Fresh White Eggs (Pack of 6)",
        "brand": "Eggoz",
        "category_id": "dairy-eggs",
        "price": 52.0,
        "mrp": 60.0,
        "unit": "Pack of 6",
        "description": "Clean, sanitized, high-protein farm-fresh eggs from healthy, grain-fed hens.",
        "image_url": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 85,
        "rating": 4.8,
        "rating_count": 390,
        "tags": ["eggs", "protein"],
        "is_deal": True,
        "is_popular": True
    },

    # 4. Rice and Grains
    {
        "id": "prod-india-gate-basmati",
        "name": "India Gate Basmati Rice Feast Rozzana",
        "brand": "India Gate",
        "category_id": "rice-grains",
        "price": 145.0,
        "mrp": 170.0,
        "unit": "1 kg bag",
        "description": "Aged slender long-grain Basmati rice with tempting aroma and non-sticky fluffy texture. Ideal for daily pulao and biryani.",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 70,
        "rating": 4.8,
        "rating_count": 410,
        "tags": ["basmati", "staple", "premium"],
        "is_deal": True,
        "is_popular": True
    },
    {
        "id": "prod-daawat-basmati",
        "name": "Daawat Super Basmati Rice",
        "brand": "Daawat",
        "category_id": "rice-grains",
        "price": 130.0,
        "mrp": 150.0,
        "unit": "1 kg bag",
        "description": "Richly aged basmati grains that elongate twice their size upon cooking. Delightful aroma and great taste.",
        "image_url": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 65,
        "rating": 4.7,
        "rating_count": 310,
        "tags": ["basmati", "budget-choice"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-fortune-basmati",
        "name": "Fortune Everyday Basmati Rice",
        "brand": "Fortune",
        "category_id": "rice-grains",
        "price": 115.0,
        "mrp": 135.0,
        "unit": "1 kg bag",
        "description": "Economical long aromatic basmati grains for everyday home-cooked meals.",
        "image_url": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 80,
        "rating": 4.6,
        "rating_count": 180,
        "tags": ["basmati", "affordable"],
        "is_deal": True,
        "is_popular": False
    },
    {
        "id": "prod-aashirvaad-atta-5kg",
        "name": "Aashirvaad Shudh Chakki Atta (Whole Wheat)",
        "brand": "Aashirvaad",
        "category_id": "rice-grains",
        "price": 280.0,
        "mrp": 310.0,
        "unit": "5 kg bag",
        "description": "100% pure whole wheat flour processed with traditional 4-step advantage. Yields soft, fluffy rotis that stay soft longer.",
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 90,
        "rating": 4.9,
        "rating_count": 920,
        "tags": ["atta", "wheat", "staple", "popular"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-tata-salt",
        "name": "Tata Vacuum Evaporated Iodised Salt",
        "brand": "Tata",
        "category_id": "rice-grains",
        "price": 28.0,
        "mrp": 30.0,
        "unit": "1 kg packet",
        "description": "Desh Ka Namak. Pure vacuum evaporated iodised salt ensuring mental development and daily health balance.",
        "image_url": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 200,
        "rating": 4.9,
        "rating_count": 1100,
        "tags": ["salt", "essential"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-fortune-oil",
        "name": "Fortune Sunlite Refined Sunflower Oil",
        "brand": "Fortune",
        "category_id": "rice-grains",
        "price": 145.0,
        "mrp": 165.0,
        "unit": "1 Litre pouch",
        "description": "Light, healthy cooking oil enriched with Vitamin A and Vitamin D. Low absorb technology keeps food crisp and light.",
        "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 65,
        "rating": 4.7,
        "rating_count": 340,
        "tags": ["oil", "cooking", "staple"],
        "is_deal": True,
        "is_popular": True
    },

    # 5. Pulses and Lentils
    {
        "id": "prod-tata-toor-dal",
        "name": "Tata Sampann Unpolished Toor Dal (Arhar)",
        "brand": "Tata Sampann",
        "category_id": "pulses-lentils",
        "price": 165.0,
        "mrp": 190.0,
        "unit": "1 kg bag",
        "description": "Unpolished Toor Dal retaining its wholesome natural goodness and natural dietary fiber. Sourced from best Indian farms.",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 55,
        "rating": 4.8,
        "rating_count": 370,
        "tags": ["dal", "protein", "unpolished"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-moong-dal",
        "name": "Organic Moong Dal Yellow Split (Dhuli)",
        "brand": "Organic Tattva",
        "category_id": "pulses-lentils",
        "price": 140.0,
        "mrp": 160.0,
        "unit": "1 kg bag",
        "description": "Easily digestible yellow moong dal for comforting khichdi, dal tadka, and moong halwa.",
        "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 45,
        "rating": 4.7,
        "rating_count": 210,
        "tags": ["dal", "organic", "digestive"],
        "is_deal": True,
        "is_popular": False
    },
    {
        "id": "prod-kabuli-chana",
        "name": "Tata Sampann Premium Kabuli Chana",
        "brand": "Tata Sampann",
        "category_id": "pulses-lentils",
        "price": 130.0,
        "mrp": 150.0,
        "unit": "1 kg bag",
        "description": "Large bold chickpeas with even boiling texture. Perfect for Punjabi Chole and hummus.",
        "image_url": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 40,
        "rating": 4.8,
        "rating_count": 160,
        "tags": ["chana", "protein"],
        "is_deal": False,
        "is_popular": False
    },

    # 6. Snacks
    {
        "id": "prod-haldirams-bhujia",
        "name": "Haldiram's Nagpur Aloo Bhujia",
        "brand": "Haldiram's",
        "category_id": "snacks",
        "price": 55.0,
        "mrp": 60.0,
        "unit": "200 g pouch",
        "description": "Crispy and spicy potato mint noodles seasoned with authentic Indian spices. The ultimate tea-time snack.",
        "image_url": "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 95,
        "rating": 4.9,
        "rating_count": 650,
        "tags": ["snack", "crispy", "popular"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-lays-chips",
        "name": "Lay's India's Magic Masala Potato Chips",
        "brand": "Lay's",
        "category_id": "snacks",
        "price": 20.0,
        "mrp": 20.0,
        "unit": "50 g pack",
        "description": "Thin-cut crispy potato chips dusted with exotic Indian spices.",
        "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 140,
        "rating": 4.7,
        "rating_count": 410,
        "tags": ["chips", "snack"],
        "is_deal": False,
        "is_popular": True
    },

    # 7. Beverages
    {
        "id": "prod-tata-tea-gold",
        "name": "Tata Tea Gold Leaf & Gentle Long Leaf Tea",
        "brand": "Tata Tea",
        "category_id": "beverages",
        "price": 160.0,
        "mrp": 180.0,
        "unit": "250 g pack",
        "description": "Exquisite blend of strong CTC granules combined with long aromatic tea leaves for an irresistible aroma and taste.",
        "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 80,
        "rating": 4.8,
        "rating_count": 510,
        "tags": ["tea", "chai", "popular"],
        "is_deal": True,
        "is_popular": True
    },
    {
        "id": "prod-nescafe-coffee",
        "name": "Nescafé Classic 100% Pure Instant Coffee",
        "brand": "Nescafé",
        "category_id": "beverages",
        "price": 185.0,
        "mrp": 200.0,
        "unit": "100 g glass jar",
        "description": "Pure roasted robusta coffee beans finely processed for a bold signature aroma and deep rich taste.",
        "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 50,
        "rating": 4.8,
        "rating_count": 380,
        "tags": ["coffee", "instant"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-real-orange-juice",
        "name": "Real Fruit Power 100% Orange Juice",
        "brand": "Real",
        "category_id": "beverages",
        "price": 115.0,
        "mrp": 130.0,
        "unit": "1 Litre carton",
        "description": "Pure fruit goodness with no added preservatives or artificial colours. Savor refreshing natural citrus taste.",
        "image_url": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 45,
        "rating": 4.6,
        "rating_count": 190,
        "tags": ["juice", "fruit"],
        "is_deal": True,
        "is_popular": False
    },

    # 8. Bakery
    {
        "id": "prod-britannia-brown-bread",
        "name": "Britannia 100% Whole Wheat Brown Bread",
        "brand": "Britannia",
        "category_id": "bakery",
        "price": 45.0,
        "mrp": 50.0,
        "unit": "400 g loaf",
        "description": "Soft and freshly baked whole wheat bread loaf enriched with goodness of dietary fiber and malt.",
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 60,
        "rating": 4.7,
        "rating_count": 390,
        "tags": ["bread", "whole-wheat", "bakery"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-english-oven-pav",
        "name": "English Oven Fresh Bombay Ladi Pav",
        "brand": "English Oven",
        "category_id": "bakery",
        "price": 35.0,
        "mrp": 40.0,
        "unit": "Pack of 6 (300 g)",
        "description": "Ultra soft, pillow-fluffy bakery pavs made fresh daily. Perfect for Pav Bhaji, Vada Pav, and toast.",
        "image_url": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 40,
        "rating": 4.6,
        "rating_count": 160,
        "tags": ["pav", "bakery"],
        "is_deal": False,
        "is_popular": False
    },

    # 9. Personal Care
    {
        "id": "prod-dettol-handwash",
        "name": "Dettol Original Germ Protection Liquid Handwash",
        "brand": "Dettol",
        "category_id": "personal-care",
        "price": 99.0,
        "mrp": 115.0,
        "unit": "200 ml pump bottle",
        "description": "Trusted Dettol formula protecting against 100 illness-causing germs with moisturising pine fragrance.",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 75,
        "rating": 4.8,
        "rating_count": 420,
        "tags": ["hygiene", "handwash"],
        "is_deal": True,
        "is_popular": True
    },
    {
        "id": "prod-colgate-total",
        "name": "Colgate Total 12-Hour Protection Toothpaste",
        "brand": "Colgate",
        "category_id": "personal-care",
        "price": 110.0,
        "mrp": 125.0,
        "unit": "120 g tube",
        "description": "Pro-active antibacterial fluoride formula for whole mouth health: teeth, tongue, cheeks, and gums.",
        "image_url": "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 80,
        "rating": 4.8,
        "rating_count": 310,
        "tags": ["dental", "essential"],
        "is_deal": False,
        "is_popular": True
    },

    # 10. Household Essentials
    {
        "id": "prod-surf-excel",
        "name": "Surf Excel Easy Wash Detergent Powder",
        "brand": "Surf Excel",
        "category_id": "household",
        "price": 140.0,
        "mrp": 155.0,
        "unit": "1 kg bag",
        "description": "Removes tough stains easily like oil, curry, mud with superior engineered cleaning particles.",
        "image_url": "https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 70,
        "rating": 4.8,
        "rating_count": 540,
        "tags": ["cleaning", "laundry"],
        "is_deal": False,
        "is_popular": True
    },
    {
        "id": "prod-vim-gel",
        "name": "Vim Lemon Dishwash Gel Liquid",
        "brand": "Vim",
        "category_id": "household",
        "price": 55.0,
        "mrp": 60.0,
        "unit": "250 ml bottle",
        "description": "Powered with real lemon juice. One spoon cleans an entire sink full of utensils without white residue.",
        "image_url": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
        "in_stock": True,
        "stock_count": 90,
        "rating": 4.8,
        "rating_count": 620,
        "tags": ["dishwash", "kitchen"],
        "is_deal": True,
        "is_popular": True
    }
]

def seed_database():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # Clear old data
    cursor.execute("DELETE FROM categories")
    cursor.execute("DELETE FROM products")

    for cat in CATEGORIES:
        cursor.execute("""
            INSERT INTO categories (id, name, description, icon, display_order)
            VALUES (?, ?, ?, ?, ?)
        """, (cat["id"], cat["name"], cat["description"], cat["icon"], cat["display_order"]))

    for p in PRODUCTS:
        cursor.execute("""
            INSERT INTO products (
                id, name, brand, category_id, price, mrp, unit, description,
                image_url, in_stock, stock_count, rating, rating_count, tags, is_deal, is_popular
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["id"], p["name"], p["brand"], p["category_id"], p["price"], p["mrp"],
            p["unit"], p["description"], p["image_url"], 1 if p["in_stock"] else 0,
            p["stock_count"], p["rating"], p["rating_count"], json.dumps(p["tags"]),
            1 if p["is_deal"] else 0, 1 if p["is_popular"] else 0
        ))

    conn.commit()
    conn.close()
    print("Database seeded successfully with realistic grocery data!")

if __name__ == "__main__":
    seed_database()
