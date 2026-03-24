import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ArrowRight, ShieldCheck, Truck, Sparkles, MapPin, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 1000 ? 0 : 40;
  const savings = Math.round(subtotal * 0.15);
  const total = subtotal + shipping - savings;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center text-emerald-500 relative z-10 animate-fade-up shadow-2xl border border-emerald-50">
            <CheckCircle2 size={72} strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 bg-emerald-100 rounded-[3rem] blur-3xl -z-0 scale-125 opacity-30 animate-pulse" />
        </div>
        <h2 className="text-5xl font-black text-stone-900 mb-4 animate-fade-up tracking-tighter uppercase italic">Order <span className="text-emerald-500 not-italic lowercase tracking-normal">Confirmed.</span></h2>
        <p className="text-stone-500 mb-12 max-w-sm font-medium animate-fade-up px-4 text-lg" style={{ animationDelay: '0.1s' }}>
          Your artisanal spices are on their way. We've sent a confirmation to your phone. Get ready to experience true flavor.
        </p>
        <Link to="/" className="bg-stone-900 text-white px-16 py-6 rounded-full font-black text-lg hover:bg-amber-600 transition-all shadow-2xl animate-fade-up transform hover:scale-105 active:scale-95" style={{ animationDelay: '0.2s' }}>
          Back to Kitchen
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-3">
            Pure Connection
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-stone-900 tracking-tighter uppercase italic leading-none">Complete your <br /><span className="text-amber-600 not-italic lowercase tracking-normal">journey.</span></h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-14 rounded-[3rem] border border-stone-100 shadow-xl">
              <h2 className="text-2xl font-black text-stone-900 mb-12 flex items-center gap-4 tracking-tight uppercase">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-amber-600">
                  <MapPin size={20} />
                </div>
                Shipping Details
              </h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input required type="text" placeholder="Your Name" className="w-full pl-16 pr-8 py-5 bg-stone-50 border border-stone-100 rounded-2xl focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-600/5 focus:outline-none transition-all font-bold text-stone-900" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input required type="tel" placeholder="+91 00000 00000" className="w-full pl-16 pr-8 py-5 bg-stone-50 border border-stone-100 rounded-2xl focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-600/5 focus:outline-none transition-all font-bold text-stone-900" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Delivery Address</label>
                  <textarea required rows="4" placeholder="Enter your full apartment or house address" className="w-full px-8 py-5 bg-stone-50 border border-stone-100 rounded-2xl focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-600/5 focus:outline-none transition-all font-bold text-stone-900 resize-none"></textarea>
                </div>
                
                <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 blur-3xl rounded-full -mr-16 -mt-16" />
                  <div className="flex items-center gap-5 text-amber-900 font-black mb-3 uppercase tracking-tight text-base relative z-10">
                    <div className="w-14 h-14 bg-amber-200/50 rounded-2xl flex items-center justify-center text-amber-700 shadow-inner">
                      <Truck size={28} strokeWidth={2.5} />
                    </div>
                    Cash on Delivery (COD)
                  </div>
                  <p className="text-xs text-amber-900/60 font-bold pl-20 leading-relaxed uppercase tracking-wider relative z-10">
                    Pay securely at your doorstep. We accept Cash, UPI, and all common digital payments.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-stone-900 hover:bg-amber-600 text-white py-7 rounded-[1.5rem] font-black text-xl uppercase tracking-[0.25em] flex items-center justify-center gap-5 shadow-2xl transition-all duration-700 group transform hover:scale-[1.01] active:scale-95"
                >
                  Pay ₹{total} & Confirm
                  <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-3 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Summary Recap */}
          <div className="lg:col-span-5">
            <div className="bg-stone-50 p-10 md:p-14 rounded-[3rem] border border-stone-100 shadow-inner h-fit lg:sticky lg:top-40 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/5 blur-[80px] rounded-full -mr-20 -mt-20 opacity-50" />
              
              <h2 className="text-2xl font-black text-stone-900 mb-10 flex items-center gap-4 uppercase tracking-tight">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                  <Sparkles size={20} />
                </div>
                Final Summary
              </h2>
              
              <div className="space-y-5 mb-10">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-5 rounded-[1.5rem] border border-stone-200/50 shadow-sm group hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-inner" />
                      <div className="flex flex-col">
                        <span className="text-stone-900 font-black text-sm tracking-tight">{item.name}</span>
                        <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest mt-1">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-black text-stone-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200/50 pt-10 space-y-4">
                <div className="flex justify-between text-stone-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-amber-500 font-black uppercase tracking-[0.2em] text-[10px]">
                  <span>15% Artisanal Discount</span>
                  <span>- ₹{savings}</span>
                </div>
                <div className="h-px bg-stone-200/50 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-stone-400 font-black uppercase tracking-widest text-xs mb-1">Total Payable</span>
                  <span className="text-5xl font-black text-stone-900 tracking-tighter">₹{total}</span>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-30">
                 <ShieldCheck size={48} className="text-stone-400" />
                 <div className="h-12 w-px bg-stone-200" />
                 <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] leading-loose">
                   Ethically Sourced <br /> Lab Tested Purity
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
