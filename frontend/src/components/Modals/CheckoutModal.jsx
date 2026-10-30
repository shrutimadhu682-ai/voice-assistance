import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CreditCard, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  Volume2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmitOrder,
  onSpeakSummary
}) {
  const { cartItems, subtotal, deliveryFee, discount, total, couponCode } = useCart();
  const { announce, playCue } = useAccessibility();

  // Form states
  const [customerName, setCustomerName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Flat 402, Green Valley Apartments, MG Road, Bengaluru');
  const [deliverySlot, setDeliverySlot] = useState('Express (Under 30 mins)');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  // Demo payment details
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  const [hasAnnounced, setHasAnnounced] = useState(false);

  // Verbal summary announcement on open
  useEffect(() => {
    if (isOpen && cartItems.length > 0 && !hasAnnounced) {
      const summary = `Checkout ready. Your order contains ${cartItems.length} items. Your final total is ${Math.round(total)} rupees. Delivery scheduled for ${deliverySlot} to ${address}. Say 'Place order' or 'Yes' to confirm, or click Confirm and Place Order.`;
      if (onSpeakSummary) {
        onSpeakSummary(summary);
      } else {
        announce(summary, 'assertive');
      }
      setHasAnnounced(true);
    }
    if (!isOpen) {
      setHasAnnounced(false);
    }
  }, [isOpen, cartItems.length, total, deliverySlot, address, onSpeakSummary, announce, hasAnnounced]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      announce("Please complete your name, phone number, and delivery address.", 'assertive');
      return;
    }

    onSubmitOrder({
      customer_name: customerName,
      phone: phone,
      address: address,
      delivery_slot: deliverySlot,
      payment_method: paymentMethod,
      items: cartItems.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      coupon_code: couponCode || null
    });
  };

  const handleReadDetailsAloud = () => {
    const text = `Order Summary: ${cartItems.length} items. Subtotal is ${Math.round(subtotal)} rupees. Delivery charge is ${deliveryFee} rupees. Final amount is ${Math.round(total)} rupees. Delivering to ${customerName} at ${address} during ${deliverySlot}. Payment via ${paymentMethod}. Say Yes to confirm.`;
    if (onSpeakSummary) {
      onSpeakSummary(text);
    } else {
      announce(text, 'assertive');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="checkout-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Accessible Checkout
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review your details and confirm purchase
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadDetailsAloud}
              className="p-2 rounded-xl bg-green-50 dark:bg-green-950 border border-green-300 text-green-700 dark:text-green-300"
              aria-label="Read full checkout details aloud"
              title="Read order summary aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              aria-label="Close checkout"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 dark:text-green-400">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="customer-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-name-input"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customer-phone-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="customer-address-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  id="customer-address-input"
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Slot */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 dark:text-green-400">
              2. Choose Delivery Slot
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'Express (Under 30 mins)', label: '⚡ Express', time: 'Under 30 mins' },
                { id: 'Evening Slot (6 PM - 8 PM)', label: '🌇 Evening', time: '6:00 PM – 8:00 PM' },
                { id: 'Tomorrow Morning (8 AM - 10 AM)', label: '🌅 Tomorrow', time: '8:00 AM – 10:00 AM' }
              ].map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setDeliverySlot(slot.id)}
                  className={`p-3 rounded-xl border-2 text-left text-xs ${
                    deliverySlot === slot.id
                      ? 'border-green-600 bg-green-50 dark:bg-green-950/60 font-bold text-green-900 dark:text-green-100 ring-2 ring-green-600/30'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                  aria-pressed={deliverySlot === slot.id}
                >
                  <p className="font-bold text-sm">{slot.label}</p>
                  <p className="text-[11px] text-slate-500">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 dark:text-green-400">
              3. Payment Options (Demo Safe)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, note: 'Pay with cash at door' },
                { id: 'UPI (Instant)', label: 'UPI / QR', icon: Wallet, note: 'GPay, PhonePe, Paytm' },
                { id: 'Card Payment', label: 'Card (Demo)', icon: CreditCard, note: 'Simulated Visa/Mastercard' },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border-2 text-left text-xs ${
                      paymentMethod === method.id
                        ? 'border-green-600 bg-green-50 dark:bg-green-950/60 font-bold text-green-900 dark:text-green-100 ring-2 ring-green-600/30'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                    aria-pressed={paymentMethod === method.id}
                  >
                    <Icon className="w-4 h-4 mb-1 text-green-700 dark:text-green-400" />
                    <p className="font-bold text-sm">{method.label}</p>
                    <p className="text-[10px] text-slate-500">{method.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Final Summary & Spoken Prompt */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Voice Confirmation Required</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200">
              "Your order contains <strong>{cartItems.length} items</strong>. Your total is <strong>₹{Math.round(total)}</strong>. Do you want to place your order?"
            </p>
            <p className="text-[11px] text-slate-500 italic">
              You can confirm either by speaking "Yes" / "Place order" aloud, or clicking the button below.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full flex-1 bg-green-700 hover:bg-green-800 text-white font-black text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 focus:ring-4 focus:ring-green-400"
              aria-label={`Confirm and Place Order for ${Math.round(total)} rupees`}
            >
              <Check className="w-6 h-6" />
              <span>Confirm & Place Order (₹{Math.round(total)})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-slate-300 text-slate-700 dark:text-slate-300 font-bold"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
