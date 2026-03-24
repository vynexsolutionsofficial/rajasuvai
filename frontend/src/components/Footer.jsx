import React from 'react';
import { 
  Share2,
  Heart,
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-amber-700 via-stone-950 to-stone-950 text-white overflow-hidden relative border-t border-amber-900/20">
      {/* Decorative Spice Aura */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-white/5">
        <div className="page-container py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-amber-600/20 text-amber-500">
                <Sparkles size={12} />
                Artisanal Updates
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter italic leading-tight">Join the <span className="text-amber-500 not-italic">legacy.</span></h2>
              <p className="text-stone-400 font-medium text-base leading-relaxed">Early access to seasonal harvests and artisanal recipes.</p>
            </div>
            <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS"
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-600 focus:bg-white/5 transition-all font-black text-[10px] tracking-widest text-white min-w-[320px] uppercase"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-amber-600/20 active:scale-95 uppercase text-[12px] tracking-widest">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 page-container py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-600/20 group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase leading-none">RAJASUVAI</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 mt-1.5">Authentic Spices</span>
              </div>
            </Link>
            <p className="text-stone-400 leading-relaxed font-semibold text-sm">
              Capturing the raw essence of South Indian heritage. Pure, organic, and relentlessly traditional.
            </p>
            <div className="flex gap-3">
              {[Share2, Heart, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:bg-amber-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-3">
              <span className="w-4 h-[1px] bg-amber-600" />
              Navigation
            </h4>
            <ul className="space-y-4 text-stone-400 font-bold text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-3">
              <span className="w-4 h-[1px] bg-amber-600" />
              Support
            </h4>
            <ul className="space-y-4 text-stone-400 font-bold text-sm">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-3">
              <span className="w-4 h-[1px] bg-amber-600" />
              Contact
            </h4>
            <ul className="space-y-5 text-stone-400 font-semibold text-sm">
              <li className="flex gap-4">
                <MapPin size={18} className="text-amber-600 shrink-0" />
                <span className="leading-tight">Coimbatore, <br />Tamil Nadu, India</span>
              </li>
              <li className="flex gap-4">
                <Mail size={18} className="text-amber-600 shrink-0" />
                <span>hello@rajasuvai.com</span>
              </li>
            </ul>
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
              <ShieldCheck className="text-amber-500" size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest text-stone-300">Certified Organic</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-[9px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 Rajasuvai Artisans. Crafted for the purist.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Sitemap</span>
            <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

