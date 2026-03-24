import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Leaf, ShoppingCart, ChevronRight, ChevronLeft, Heart, Share2, Sparkles, CheckCircle2, Truck } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <div className="p-40 text-center font-bold text-2xl text-stone-400">Product not found</div>;

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="page-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-12">
          <Link to="/" className="hover:text-amber-600 transition">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-amber-600 transition">Collection</Link>
          <ChevronRight size={12} />
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-stone-50 rounded-[2.5rem] overflow-hidden group relative shadow-inner">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-6 left-6">
                <div className="bg-white/90 backdrop-blur-md font-black py-2 px-4 rounded-full text-[9px] shadow-sm uppercase tracking-widest text-emerald-600 flex items-center gap-2 border border-emerald-100">
                  <Leaf size={12} strokeWidth={3} />
                  100% Organic Sourcing
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${i === 1 ? 'border-amber-600' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <img src={product.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">{product.category}</span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                    </div>
                    <span className="text-[10px] font-black text-stone-400">4.9 (240 Reviews)</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-stone-900 leading-[1.1] tracking-tighter uppercase mb-8">{product.name}</h1>
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-5xl font-black text-stone-900 tracking-tighter">₹{product.price}</span>
                <span className="text-stone-400 text-xl line-through font-bold">₹{product.price + 100}</span>
                <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ml-2">Save 15%</div>
              </div>
              
              <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 relative mb-12">
                <div className="absolute -top-3 left-8 px-4 py-1 bg-white border border-stone-100 rounded-full text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] shadow-sm">Master Blender's Note</div>
                <p className="text-stone-600 leading-relaxed font-medium italic text-lg">
                  "{product.description}"
                </p>
              </div>
            </div>

            {/* Action Area */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between bg-stone-100 rounded-2xl p-2 w-full sm:w-48 border border-stone-200/50">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-stone-400 hover:text-stone-900 transition-all shadow-sm"><ChevronLeft size={20} strokeWidth={3}/></button>
                  <span className="font-black text-stone-900 text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-amber-600 hover:text-amber-500 transition-all shadow-sm"><ChevronRight size={20} strokeWidth={3}/></button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-stone-900 hover:bg-amber-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-xl transition-all duration-500 group"
                >
                  <ShoppingCart size={22} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform" />
                  Add to Collection
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-12 border-t border-stone-100 uppercase tracking-widest text-[9px] font-black text-stone-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-1"><CheckCircle2 size={24}/></div>
                  Lab Tested
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-1"><Sparkles size={24}/></div>
                  Small Batch
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-stone-100 text-stone-600 rounded-2xl flex items-center justify-center mb-1"><Truck size={24}/></div>
                  Express Ship
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-32">
          <div className="flex gap-12 border-b border-stone-100 mb-12">
            {['description', 'specifications'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-stone-900' : 'text-stone-400 hover:text-stone-900'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-full" />}
              </button>
            ))}
          </div>
          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="space-y-8 animate-fade-in">
                <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic">Experience Purity.</h3>
                <p className="text-stone-600 text-lg leading-relaxed font-medium">
                  Our spices are traditionally stone-ground to preserve volatile essential oils, ensuring the flavor and aroma remain as vibrant as the day they were harvested. No additives, no preservatives—just the essence of nature.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
