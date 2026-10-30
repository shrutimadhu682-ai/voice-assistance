import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCart } from '../context/CartContext';

export function useVoiceAssistant({
  products = [],
  activeCategory = 'all',
  setActiveCategory,
  searchQuery = '',
  setSearchQuery,
  openCartDrawer,
  closeCartDrawer,
  openCheckoutModal,
  openBudgetModal,
  openShoppingListModal,
  openCompareModal,
  openHelpModal,
  onPlaceOrderConfirm
}) {
  const {
    voiceEnabled,
    speechSpeed,
    voiceVolume,
    playCue,
    announce
  } = useAccessibility();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSpokenSummary,
    total
  } = useCart();

  // Assistant states: 'idle' | 'listening' | 'processing' | 'speaking'
  const [assistantState, setAssistantState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [lastSpeech, setLastSpeech] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [continuousListening, setContinuousListening] = useState(false);
  const [confirmationContext, setConfirmationContext] = useState(null); 
  // confirmationContext: { type: 'checkout' | 'add_product' | 'clear_cart', payload: any }

  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const isSpeakingRef = useRef(false);

  // Stop current speech
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    isSpeakingRef.current = false;
    setAssistantState('idle');
  }, []);

  // Speak text using SpeechSynthesis
  const speak = useCallback((text, onEndCallback = null) => {
    if (!voiceEnabled || !text) return;

    if (!synthRef.current) {
      console.warn("SpeechSynthesis not supported.");
      return;
    }

    // Cancel ongoing speech
    synthRef.current.cancel();

    // Clean text for speech
    const cleanText = text
      .replace(/₹/g, ' rupees ')
      .replace(/\//g, ' per ')
      .replace(/&/g, ' and ');

    setLastSpeech(cleanText);
    setAssistantState('speaking');
    isSpeakingRef.current = true;
    announce(cleanText, 'polite');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechSpeed;
    utterance.volume = voiceVolume;
    utterance.lang = 'en-IN'; // Indian English preference for natural INR pronunciation

    // Get available voices and pick English India or English US
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN')) ||
                           voices.find(v => v.lang.includes('en-GB')) ||
                           voices.find(v => v.lang.includes('en-US')) ||
                           voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAssistantState('idle');
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      isSpeakingRef.current = false;
      setAssistantState('idle');
    };

    synthRef.current.speak(utterance);
  }, [voiceEnabled, speechSpeed, voiceVolume, announce]);

  // Repeat last spoken message
  const repeatLastSpeech = useCallback(() => {
    if (lastSpeech) {
      speak(`Repeating: ${lastSpeech}`);
    } else {
      speak("There is no previous message to repeat.");
    }
  }, [lastSpeech, speak]);

  // Command parser & executor
  const processVoiceCommand = useCallback((cmdRaw) => {
    const cmd = cmdRaw.toLowerCase().trim();
    setAssistantState('processing');

    // 1. Pending Confirmation Handling (Checkout, Clear Cart, etc.)
    if (confirmationContext) {
      if (cmd.includes('yes') || cmd.includes('confirm') || cmd.includes('continue') || cmd.includes('place order') || cmd.includes('do it') || cmd.includes('okay') || cmd.includes('ok')) {
        if (confirmationContext.type === 'checkout') {
          setConfirmationContext(null);
          if (onPlaceOrderConfirm) {
            onPlaceOrderConfirm();
          } else {
            speak("Order confirmed! Your groceries are being processed.");
          }
          return;
        } else if (confirmationContext.type === 'clear_cart') {
          clearCart();
          setConfirmationContext(null);
          speak("Your shopping cart has been cleared.");
          return;
        } else if (confirmationContext.type === 'add_product') {
          const prod = confirmationContext.payload;
          addToCart(prod, 1);
          setConfirmationContext(null);
          speak(`${prod.name} has been added to your cart.`);
          return;
        }
      } else if (cmd.includes('no') || cmd.includes('cancel') || cmd.includes('stop') || cmd.includes('dont') || cmd.includes("don't")) {
        setConfirmationContext(null);
        speak("Action canceled. What would you like to do next?");
        return;
      }
    }

    // 2. Assistant Control Commands
    if (cmd.includes('stop speaking') || cmd.includes('be quiet') || cmd.includes('shut up') || cmd === 'stop') {
      stopSpeaking();
      return;
    }

    if (cmd.includes('repeat') || cmd.includes('say that again') || cmd.includes('what did you say')) {
      repeatLastSpeech();
      return;
    }

    if (cmd.includes('help') || cmd.includes('what can i say') || cmd.includes('how to use')) {
      if (openHelpModal) openHelpModal();
      speak("You can say: search for basmati rice, show vegetables, read product details, add first product, what is in my cart, budget 1000 rupees, or checkout. What would you like?");
      return;
    }

    // 3. Navigation Commands
    if (cmd.includes('go home') || cmd.includes('homepage') || cmd.includes('start shopping')) {
      if (closeCartDrawer) closeCartDrawer();
      if (setActiveCategory) setActiveCategory('all');
      if (setSearchQuery) setSearchQuery('');
      speak("Welcome to VoiceCart homepage. You can explore categories or search for any grocery product.");
      return;
    }

    // Category navigation
    const categoryMatches = [
      { trigger: ['vegetable', 'vegetables', 'veggies', 'sabzi'], id: 'vegetables', name: 'Vegetables' },
      { trigger: ['fruit', 'fruits', 'fal'], id: 'fruits', name: 'Fruits' },
      { trigger: ['dairy', 'milk', 'egg', 'eggs', 'paneer', 'butter', 'curd', 'dahi'], id: 'dairy-eggs', name: 'Dairy and Eggs' },
      { trigger: ['rice', 'grain', 'grains', 'atta', 'flour', 'wheat'], id: 'rice-grains', name: 'Rice and Grains' },
      { trigger: ['pulse', 'pulses', 'lentil', 'lentils', 'dal', 'chana'], id: 'pulses-lentils', name: 'Pulses and Lentils' },
      { trigger: ['snack', 'snacks', 'namkeen', 'chips', 'bhujia'], id: 'snacks', name: 'Snacks' },
      { trigger: ['beverage', 'beverages', 'tea', 'coffee', 'juice', 'drink'], id: 'beverages', name: 'Beverages' },
      { trigger: ['bakery', 'bread', 'pav', 'bun'], id: 'bakery', name: 'Bakery' },
      { trigger: ['personal care', 'soap', 'toothpaste', 'handwash'], id: 'personal-care', name: 'Personal Care' },
      { trigger: ['household', 'detergent', 'cleaning', 'dishwash'], id: 'household', name: 'Household Essentials' },
    ];

    if (cmd.startsWith('show ') || cmd.startsWith('open ') || cmd.startsWith('browse ') || cmd.includes('category')) {
      for (const cat of categoryMatches) {
        if (cat.trigger.some(t => cmd.includes(t))) {
          if (setActiveCategory) setActiveCategory(cat.id);
          if (setSearchQuery) setSearchQuery('');
          const catProducts = products.filter(p => p.category_id === cat.id);
          const topNames = catProducts.slice(0, 3).map(p => `${p.name} for ${Math.round(p.price)} rupees`).join(', ');
          speak(`Showing ${cat.name}. I found ${catProducts.length} items, including ${topNames}. Which one would you like?`);
          return;
        }
      }
      if (cmd.includes('all') || cmd.includes('categories')) {
        if (setActiveCategory) setActiveCategory('all');
        speak("Showing all categories. We have fruits, vegetables, dairy, rice, pulses, snacks, beverages, and bakery.");
        return;
      }
    }

    // 4. Product Search Commands
    if (cmd.startsWith('search for ') || cmd.startsWith('find ') || cmd.startsWith('look for ') || cmd.startsWith('search ')) {
      let query = cmd
        .replace('search for ', '')
        .replace('find ', '')
        .replace('look for ', '')
        .replace('search ', '')
        .trim();

      if (query) {
        if (setSearchQuery) setSearchQuery(query);
        if (setActiveCategory) setActiveCategory('all');

        const results = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category_id.toLowerCase().includes(query)
        );

        if (results.length === 0) {
          speak(`I searched for ${query}, but could not find matching products. You can try searching for milk, atta, rice, or apples.`);
        } else if (results.length === 1) {
          const item = results[0];
          speak(`I found 1 product: ${item.name} by ${item.brand}, ${item.unit} for ${Math.round(item.price)} rupees. Would you like me to add it to your cart?`);
          setConfirmationContext({ type: 'add_product', payload: item });
        } else {
          const top3 = results.slice(0, 3).map((p, idx) => {
            const ordinals = ['first', 'second', 'third'];
            return `${ordinals[idx] || (idx + 1)}, ${p.name} for ${Math.round(p.price)} rupees`;
          }).join('. ');
          speak(`I found ${results.length} options for ${query}. ${top3}. Which one would you like?`);
        }
        return;
      }
    }

    if (cmd.includes('clear search') || cmd.includes('reset search')) {
      if (setSearchQuery) setSearchQuery('');
      speak("Search cleared. Displaying all products.");
      return;
    }

    // 5. Product Reading Commands
    if (cmd.includes('read first product') || cmd.includes('read product details') || cmd.includes('read first') || cmd.includes('tell me about the first')) {
      const activeList = products.filter(p => {
        if (activeCategory !== 'all' && p.category_id !== activeCategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });

      if (activeList.length > 0) {
        const p = activeList[0];
        speak(`${p.name} by ${p.brand}. Pack size: ${p.unit}. Price: ${Math.round(p.price)} rupees. Status: ${p.in_stock ? 'In stock' : 'Out of stock'}. Description: ${p.description}. Say Add first product to put this in your cart.`);
      } else {
        speak("There are no products currently listed to read.");
      }
      return;
    }

    if (cmd.includes('read second') || cmd.includes('tell me about the second')) {
      const activeList = products.filter(p => {
        if (activeCategory !== 'all' && p.category_id !== activeCategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });

      if (activeList.length > 1) {
        const p = activeList[1];
        speak(`${p.name} by ${p.brand}. Pack size: ${p.unit}. Price: ${Math.round(p.price)} rupees. ${p.description}. Say Add second product to add to cart.`);
      } else {
        speak("A second product is not available in the current view.");
      }
      return;
    }

    // 6. Adding Items to Cart
    if (cmd.includes('add the first') || cmd.includes('add first') || cmd.includes('add 1st')) {
      const activeList = products.filter(p => {
        if (activeCategory !== 'all' && p.category_id !== activeCategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });

      if (activeList.length > 0) {
        const p = activeList[0];
        addToCart(p, 1);
        speak(`${p.name}, one packet, has been added to your cart. Cart total is ${Math.round(total + p.price)} rupees.`);
      } else {
        speak("No products found to add.");
      }
      return;
    }

    if (cmd.includes('add the second') || cmd.includes('add second') || cmd.includes('add 2nd')) {
      const activeList = products.filter(p => {
        if (activeCategory !== 'all' && p.category_id !== activeCategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });

      if (activeList.length > 1) {
        const p = activeList[1];
        addToCart(p, 1);
        speak(`${p.name} has been added to your cart.`);
      } else {
        speak("A second product is not available.");
      }
      return;
    }

    // Multi-quantity voice commands: "add two packets", "add 3 milk"
    const qtyRegex = /(?:add|put)\s+(\d+|two|three|four|five)\s+(?:packets?|bottles?|units?|items?|kg)?\s*(?:of\s+)?(.*)/;
    const qtyMatch = cmd.match(qtyRegex);
    if (qtyMatch) {
      const numMap = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
      let qty = parseInt(qtyMatch[1]) || numMap[qtyMatch[1]] || 1;
      let targetName = qtyMatch[2].trim();

      let targetProduct = null;
      if (targetName.includes('first') || targetName === '') {
        targetProduct = products[0];
      } else {
        targetProduct = products.find(p => p.name.toLowerCase().includes(targetName));
      }

      if (targetProduct) {
        addToCart(targetProduct, qty);
        speak(`${qty} units of ${targetProduct.name} added to your cart.`);
        return;
      }
    }

    // Check direct name match for adding: "add amul butter"
    if (cmd.startsWith('add ') || cmd.startsWith('buy ')) {
      const itemQuery = cmd.replace('add ', '').replace('buy ', '').replace('to my cart', '').replace('to cart', '').trim();
      const match = products.find(p => p.name.toLowerCase().includes(itemQuery) || p.brand.toLowerCase().includes(itemQuery));
      if (match) {
        addToCart(match, 1);
        speak(`${match.name} added to your cart.`);
        return;
      }
    }

    // 7. Cart Inspection & Management
    if (cmd.includes('open cart') || cmd.includes('show cart') || cmd.includes('view cart') || cmd.includes('open my cart')) {
      if (openCartDrawer) openCartDrawer();
      speak(getCartSpokenSummary());
      return;
    }

    if (cmd.includes('what is in my cart') || cmd.includes('read my cart') || cmd.includes('read cart') || cmd.includes('tell me what is in my cart')) {
      speak(getCartSpokenSummary());
      return;
    }

    if (cmd.includes('total') || cmd.includes('how much') || cmd.includes('bill')) {
      if (cartItems.length === 0) {
        speak("Your cart is empty. Total is zero rupees.");
      } else {
        speak(`Your current cart total is ${Math.round(total)} rupees for ${cartItems.length} different items. Say checkout whenever you are ready.`);
      }
      return;
    }

    if (cmd.includes('remove') || cmd.includes('delete')) {
      if (cartItems.length === 0) {
        speak("Your cart is already empty.");
        return;
      }
      // Check if user says "remove first item" or "remove milk"
      if (cmd.includes('first')) {
        const item = cartItems[0];
        removeFromCart(item.product.id);
        speak(`Removed ${item.product.name} from your cart.`);
        return;
      }
      const match = cartItems.find(i => cmd.includes(i.product.name.toLowerCase()));
      if (match) {
        removeFromCart(match.product.id);
        speak(`Removed ${match.product.name} from your cart.`);
        return;
      }
      speak("Which item would you like to remove? You can say remove first item, or say the product name.");
      return;
    }

    if (cmd.includes('clear cart') || cmd.includes('empty cart')) {
      if (cartItems.length === 0) {
        speak("Your cart is already empty.");
      } else {
        setConfirmationContext({ type: 'clear_cart' });
        speak("Are you sure you want to clear your entire cart? Say Yes to confirm or No to keep it.");
      }
      return;
    }

    // 8. Smart Feature: Cheaper Alternatives
    if (cmd.includes('cheaper alternative') || cmd.includes('cheaper option') || cmd.includes('cheaper rice') || cmd.includes('cheaper')) {
      // Find Basmati Rice or current item
      const riceItems = products.filter(p => p.category_id === 'rice-grains').sort((a, b) => a.price - b.price);
      if (riceItems.length > 1) {
        const cheapest = riceItems[0];
        speak(`For rice, the most affordable option is ${cheapest.name} at ${Math.round(cheapest.price)} rupees. Say add ${cheapest.brand} to purchase it.`);
      } else {
        speak("I found cheaper alternatives in pulses and grains. Would you like me to show them?");
      }
      return;
    }

    // 9. Smart Feature: Budget Assistant
    if (cmd.includes('budget') || cmd.includes('under') || cmd.includes('spend')) {
      const match = cmd.match(/(\d+)/);
      const budgetAmount = match ? parseInt(match[1]) : 1000;
      if (openBudgetModal) {
        openBudgetModal(budgetAmount);
      }
      speak(`Opening Budget Assistant for ${budgetAmount} rupees. I will prepare an optimal basket of fresh groceries within your budget.`);
      return;
    }

    // 10. Smart Feature: Shopping List
    if (cmd.includes('shopping list') || cmd.includes('grocery list') || (cmd.includes('list') && cmd.includes('add'))) {
      if (openShoppingListModal) {
        openShoppingListModal(cmd);
      }
      speak("Opening your Shopping List. Let's find matches for your requested groceries.");
      return;
    }

    // 11. Smart Feature: Product Comparison
    if (cmd.includes('compare')) {
      if (openCompareModal) openCompareModal();
      speak("Opening product comparison. You can compare prices, brands, and ratings of two items.");
      return;
    }

    // 12. Checkout & Order Flow
    if (cmd.includes('checkout') || cmd.includes('proceed to pay') || cmd.includes('buy now') || cmd.includes('order')) {
      if (cartItems.length === 0) {
        speak("Your cart is empty. Please add items before checking out. You can say show vegetables to start.");
        return;
      }
      if (openCheckoutModal) openCheckoutModal();
      setConfirmationContext({ type: 'checkout' });
      speak(`Your cart contains ${cartItems.length} items. Your total is ${Math.round(total)} rupees. Would you like to confirm and place your order? Say Yes or Place Order.`);
      return;
    }

    // Fallback: didn't recognize
    playCue('error');
    speak(`I heard "${cmdRaw}". You can say search for rice, show vegetables, open my cart, or say help for commands.`);
  }, [
    confirmationContext,
    stopSpeaking,
    repeatLastSpeech,
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    getCartSpokenSummary,
    openCartDrawer,
    closeCartDrawer,
    openCheckoutModal,
    openBudgetModal,
    openShoppingListModal,
    openCompareModal,
    openHelpModal,
    onPlaceOrderConfirm,
    speak,
    playCue
  ]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("Web Speech API SpeechRecognition is not supported in this browser.");
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.continuous = false; // set to false for clean turn-taking
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // English (India)

    recognition.onstart = () => {
      setAssistantState('listening');
      playCue('listen_start');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);

      if (event.results[0].isFinal) {
        playCue('listen_stop');
        processVoiceCommand(currentTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setAssistantState('idle');
      if (event.error !== 'no-speech') {
        playCue('error');
      }
    };

    recognition.onend = () => {
      if (continuousListening && assistantState === 'listening') {
        try {
          recognition.start();
        } catch {}
      } else if (assistantState === 'listening') {
        setAssistantState('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuousListening, playCue, processVoiceCommand, assistantState]);

  // Start Voice Listening
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      speak("Speech recognition is not supported in this browser. You can use keyboard controls or the voice test box.");
      return;
    }

    // Stop speaking if currently speaking
    stopSpeaking();

    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      // If already started, restart
      console.warn("SpeechRec start error:", err);
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 150);
      } catch {}
    }
  }, [isSupported, stopSpeaking, speak]);

  const toggleListening = useCallback(() => {
    if (assistantState === 'listening') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      playCue('listen_stop');
      setAssistantState('idle');
    } else {
      startListening();
    }
  }, [assistantState, startListening, playCue]);

  // Global Keyboard Shortcuts (Alt+V for voice, Space in certain contexts)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+V toggles voice assistant mic
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        toggleListening();
      }
      // Alt+C opens cart
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        if (openCartDrawer) openCartDrawer();
        speak(getCartSpokenSummary());
      }
      // Alt+H opens help
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        if (openHelpModal) openHelpModal();
      }
      // Escape stops speech
      if (e.key === 'Escape' && isSpeakingRef.current) {
        e.preventDefault();
        stopSpeaking();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening, openCartDrawer, openHelpModal, stopSpeaking, speak, getCartSpokenSummary]);

  return {
    assistantState,
    transcript,
    lastSpeech,
    isSupported,
    startListening,
    stopSpeaking,
    toggleListening,
    processVoiceCommand,
    repeatLastSpeech,
    speak
  };
}
