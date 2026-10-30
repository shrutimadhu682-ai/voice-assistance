import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Home, 
  Volume2, 
  X, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function OrderSuccessModal({
  isOpen,
  onClose,
  orderDetails,
  onSpeakTracking
}) {
  const { announce, playCue } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      playCue('order_placed');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (orderDetails && orderDetails.spoken_confirmation) {
        if (onSpeakTracking) {
          onSpeakTracking(orderDetails.spoken_confirmation);
        } else {
          announce(orderDetails.spoken_confirmation, 'assertive');
        }
      }
    }
  }, [isOpen, orderDetails, onSpeakTracking, announce, playCue]);

  if (!isOpen || !orderDetails) return null;

  const handleSpeakStatus = () => {
    const text = `Order ${orderDetails.order_id} is confirmed. Amount: ${Math.round(orderDetails.total)} rupees. Delivery scheduled for ${orderDetails.delivery_slot}. Your groceries are currently being packed at the dark store.`;
    if (onSpeakTracking) {
      onSpeakTracking(text);
    } else {
      announce(text, 'assertive');
    }
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Received & verified', active: true, icon: CheckCircle2 },
    { title: 'Packed at Store', desc: 'Fresh items quality checked', active: true, icon: Package },
    { title: 'Out for Delivery', desc: 'Partner on the way', active: false, icon: Truck },
    { title: 'Delivered', desc: 'Arriving at doorstep', active: false, icon: Home }
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
            Order Placed Successfully!
          </span>
          <h2 id="order-success-title" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Thank you, {orderDetails.customer_name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-mono">
            Order Reference ID: <strong className="text-slate-900 dark:text-white">{orderDetails.order_id}</strong>
          </p>
        </div>

        {/* Spoken Status readout banner */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left flex items-start gap-3">
          <div className="p-2 rounded-xl bg-green-100 text-green-800 flex-shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 uppercase font-semibold">Spoken Confirmation</p>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
              {orderDetails.spoken_confirmation}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSpeakStatus}
            className="text-xs font-bold text-green-700 underline flex-shrink-0"
            aria-label="Replay order tracking status aloud"
          >
            Replay
          </button>
        </div>

        {/* Live Order Tracking Timeline */}
        <div className="text-left space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Live Order Tracking Timeline
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center space-y-1.5 ${
                    s.active
                      ? 'bg-green-50 dark:bg-green-950/40 border-green-500 text-green-900 dark:text-green-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                  aria-label={`${s.title}: ${s.active ? 'Completed' : 'Pending'}`}
                >
                  <Icon className={`w-6 h-6 mx-auto ${s.active ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-extrabold">{s.title}</p>
                  <p className="text-[10px] text-slate-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 focus:ring-4 focus:ring-green-400"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
