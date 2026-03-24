import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const shipping = subtotal > 1000 ? 0 : 40;
  const savings = Math.round(subtotal * 0.15); // 15% Artisanal Discount
  const total = subtotal + shipping - (subtotal > 0 ? 0 : 0); // Logic for display

  const handleWhatsAppOrder = () => {
    const message = `Namaste Rajasuvai! 🙏\n\nI would like to order:\n${cart.map(item => `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}\n\n*Subtotal:* ₹${subtotal}\n*Shipping:* ₹${shipping}\n*Total:* ₹${subtotal + shipping}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/919000000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-stone-950 pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Immersive Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-40 h-40 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(255,191,0,0.1)] animate-fade-in group hover:border-amber-600/50 transition-all duration-700">
            <ShoppingBag size={56} className="text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic">Your <br /><span className="text-amber-600 not-italic lowercase tracking-normal">journey awaits.</span></h1>
          <p className="text-stone-400 mb-14 text-xl md:text-2xl font-medium leading-relaxed max-w-lg mx-auto italic">True flavor is just a grain away. Elevate your daily rituals today.</p>
          <Link to="/products" className="inline-flex items-center gap-4 bg-amber-600 text-white px-16 py-6 rounded-full font-black text-xl hover:bg-amber-500 transition-all transform hover:scale-110 shadow-2xl shadow-amber-600/40 group active:scale-95">
            Start Your Collection
            <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-4xl font-black text-stone-900 tracking-tight">Shopping Bag <span className="text-stone-400 font-medium text-2xl ml-2">({cart.length})</span></h1>
              <Link to="/products" className="text-amber-600 font-bold hover:underline flex items-center gap-2">
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-8 group hover:shadow-md transition-all">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 shadow-inner">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Premium Collection</p>
                        <h3 className="text-xl font-black text-stone-900 tracking-tight">{item.name}</h3>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-stone-50 rounded-xl p-1 border border-stone-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-stone-600">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-stone-600">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-xl font-black text-stone-900 tracking-tighter">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "100% Pure", desc: "No adulteration guaranteed" },
                { icon: Truck, title: "Free Delivery", desc: "For orders above ₹1000" },
                { icon: Clock, title: "Fast Shipping", desc: "Dispatched in 24 hours" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-stone-100/50 rounded-2xl">
                  <badge.icon size={24} className="text-amber-600" />
                  <div>
                    <h4 className="font-black text-stone-900 text-sm">{badge.title}</h4>
                    <p className="text-xs text-stone-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary / Payment Column */}
          <div className="lg:w-[450px] flex-shrink-0">
            <div className="bg-stone-900 p-10 md:p-14 rounded-[3.5rem] text-white shadow-[0_30px_100px_rgba(0,0,0,0.4)] sticky top-40 border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 blur-[90px] rounded-full -mr-24 -mt-24 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-900/10 blur-[70px] rounded-full -ml-20 -mb-20 pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black tracking-tight uppercase italic">Payment <span className="text-amber-600 not-italic lowercase tracking-normal">& review.</span></h2>
                <ShieldCheck size={28} className="text-amber-500/50" />
              </div>
              
              <div className="space-y-5 mb-10 relative z-10">
                <div className="flex justify-between text-stone-400 font-bold uppercase tracking-widest text-xs">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-400 font-bold uppercase tracking-widest text-xs">
                  <span>Standard Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 font-black' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-amber-500 font-black uppercase tracking-widest text-xs">
                  <span>Artisanal Savings (15%)</span>
                  <span>- ₹{savings}</span>
                </div>
                
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-stone-400 font-black uppercase tracking-widest text-[10px] mb-1">Total Payable</span>
                  <span className="text-5xl font-black text-white tracking-tighter">₹{subtotal + shipping - savings}</span>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="mb-10 p-6 bg-white/5 rounded-3xl border border-white/5 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4 text-center">Accepted Methods</p>
                <div className="flex justify-center gap-6 opacity-60">
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[8px]">UPI</div>
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[8px]">VISA</div>
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[8px]">CASH</div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-amber-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-amber-500 transition-all transform hover:scale-[1.03] shadow-2xl shadow-amber-600/20 flex items-center justify-center gap-4 active:scale-95 group"
                >
                  Pay Securely Now
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-stone-800 text-stone-400 py-6 rounded-2xl font-black text-lg hover:bg-white hover:text-stone-900 transition-all transform hover:scale-[1.03] flex items-center justify-center gap-3 border border-white/5"
                >
                  Order via WhatsApp
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 text-[9px] text-stone-600 font-black uppercase tracking-widest opacity-80">
                <Lock size={12} />
                256-Bit SSL Encrypted Payment
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
