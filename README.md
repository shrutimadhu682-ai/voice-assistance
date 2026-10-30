# VoiceCart – Shop Independently, Shop Confidently
### Accessible Voice-Assisted Grocery Shopping for Blind & Visually Impaired Shoppers

VoiceCart is a production-grade e-commerce grocery shopping platform engineered according to **WCAG 2.2 AA Accessibility Principles**. It empowers blind and visually impaired individuals to independently browse groceries, search products, add items to cart, manage quantities, and complete purchases using natural voice commands, keyboard shortcuts, or screen-readers.

---

## 🌟 Key Features

### 1. Built-in Voice Assistant (Web Speech API)
- **Speech Recognition (`webkitSpeechRecognition` / `SpeechRecognition`)**: Real-time listening with audio earcons (ascended tone for mic start, descending tone for mic stop).
- **Speech Synthesis (`SpeechSynthesisUtterance`)**: Indian English voice tuning for natural pronunciation of Indian rupee (`₹`) amounts and brand names.
- **Audio Feedback Earcons**: Synthesized Web Audio API earcons for start-listening, stop-listening, add-to-cart confirmation, and celebratory order placement chimes.
- **Voice Commands Supported**:
  - `Hello VoiceCart` / `Start shopping`
  - `Search for basmati rice` / `Find milk` / `Clear search`
  - `Show vegetables` / `Show dairy` / `Show fruits` / `Show all categories`
  - `Read product details` / `Read first product` / `Tell me about the second`
  - `Add the first one` / `Add two packets of milk` / `Add India Gate Basmati Rice`
  - `What is in my cart?` / `Read my cart` / `Tell me my total`
  - `Remove the first item` / `Clear cart`
  - `Budget 1000 rupees` / `Help me buy groceries under 500`
  - `Add milk, rice, potatoes and apples to my shopping list`
  - `Search for cheaper alternatives` / `Compare products`
  - `Checkout` / `Place order` / `Yes` / `Cancel`
  - `Repeat that` / `Stop speaking` / `Help`
- **Manual Voice Command Console**: For users without microphones or in quiet environments, any voice command can be typed and executed with the exact same speech response and state change.

### 2. WCAG 2.2 AA Accessibility Compliance
- **Skip Links**: Direct keyboard skip links (`Skip to main content`, `Skip to Voice Assistant`).
- **High Contrast Modes**:
  - *Standard Mode* (Clean, high-legibility fresh green and white palette inspired by Blinkit & Freshco).
  - *High Contrast Dark* (Pitch black background with high contrast white elements).
  - *Yellow on Black* (Specially designed for macular degeneration and severe low vision).
- **Font Size Scaler**: Normal (16px), Large (18px), Extra Large (20px).
- **Automatic Product Reading**: Tabbing onto any grocery card speaks pack size, price, and actions.
- **Keyboard Shortcuts**:
  - `Alt + V`: Toggle microphone on/off
  - `Alt + C`: Open cart and hear breakdown
  - `Alt + H`: Open voice and keyboard guide
  - `Escape`: Stop speech / Close dialogs
  - `Tab` / `Shift + Tab`: Navigate products with vocal readouts

### 3. 10 Grocery Categories & Authentic Indian Catalog
1. **Fruits**: Shimla Red Apples, Robusta Bananas, Nagpur Oranges, Ruby Pomegranates
2. **Vegetables**: Agra Potatoes, Hybrid Tomatoes, Nashik Red Onions, Baby Spinach (Palak)
3. **Dairy and Eggs**: Amul Gold Full Cream Milk, Amul Taaza Milk, Amul Butter, Mother Dairy Curd, Farm Fresh Eggs
4. **Rice and Grains**: India Gate Basmati Rice, Daawat Basmati Rice, Fortune Basmati Rice, Aashirvaad Chakki Atta, Tata Salt, Fortune Sunflower Oil
5. **Pulses and Lentils**: Tata Sampann Toor Dal, Organic Moong Dal, Kabuli Chana
6. **Snacks**: Haldiram's Aloo Bhujia, Lay's Magic Masala Chips
7. **Beverages**: Tata Tea Gold, Nescafe Classic Coffee, Real Orange Juice
8. **Bakery**: Britannia Whole Wheat Bread, English Oven Bombay Ladi Pav
9. **Personal Care**: Dettol Liquid Handwash, Colgate Total Toothpaste
10. **Household Essentials**: Surf Excel Easy Wash, Vim Dishwash Gel

### 4. Smart Shopping Features
- **Smart Budget Assistant**: Enter any budget (e.g. ₹500 or ₹1000); the assistant optimizes a balanced basket of daily essentials (grain, vegetable, dairy, fruit, pulse) within your budget and provides 1-click cart addition.
- **Voice Shopping List**: Dictate comma or 'and'-separated groceries; fuzzy catalog matching finds the exact products and estimates total cost.
- **Product Comparison & Cheaper Alternatives**: Compare prices per unit, brand ratings, and discover lower-cost alternatives.
- **Live Order Tracking**: Track orders through 4 audio-announced stages (Confirmed -> Packed at Store -> Out for Delivery -> Delivered).

---

## 🚀 Running the Application

### 1. Start the FastAPI Backend
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
API Documentation available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start the Vite React Frontend
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
VoiceCart Web Application available at: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🛠️ Architecture & Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Python FastAPI, Uvicorn, SQLite database (`voicecart.db`).
- **Audio & Speech**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`) + Web Audio API synthesizer for earcons.
