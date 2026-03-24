import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const CONTACT_INFO = [
    { icon: Phone, title: 'Call Us', value: '+91 99999 00000', sub: 'Mon-Sat, 9am - 7pm', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Mail, title: 'Email', value: 'hello@rajasuvai.com', sub: 'Expect a reply in 24h', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: MapPin, title: 'Visit', value: 'Coimbatore, TN', sub: 'Artisan Spice Estate', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative bg-stone-950 overflow-hidden pt-0">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_background_new.png"
            alt="Contact"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/55 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent" />
        </div>

        {/* Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-700/12 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-10" />

        <div className="relative z-20 page-container pt-52 pb-36">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 bg-amber-600/15 border border-amber-600/30 rounded-xl flex items-center justify-center">
                <MessageCircle size={15} className="text-amber-400" strokeWidth={2.5} />
              </span>
              <span className="text-amber-400 text-[11px] font-black uppercase tracking-[0.6em]">Get in Touch</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white leading-[0.85] tracking-tighter uppercase mb-8">
              Let's
              <span className="block italic lowercase text-amber-500 tracking-normal">connect.</span>
            </h1>

            <p className="text-stone-300 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed">
              Have a question about our spices? Interested in bulk orders for your restaurant? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="relative z-20 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 64L1440 64L1440 20C1200 60 840 0 720 10C600 20 240 70 0 20L0 64Z" fill="#faf9f7"/>
          </svg>
        </div>
      </section>

      {/* ── Contact Content ────────────────────────────── */}
      <section className="page-container py-28 relative z-30 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left: Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-4 italic">Reach out <span className="text-amber-600 not-italic">anytime.</span></h2>
              <p className="text-stone-500 font-medium leading-relaxed">Whether you're a home cook or a professional chef, we're here to help you find the perfect spice profile.</p>
            </div>

            <div className="grid gap-6">
              {CONTACT_INFO.map(({ icon: Icon, title, value, sub, color, bg }) => (
                <div key={title} className="flex items-start gap-6 p-8 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-amber-500/20 transition-all duration-500 group">
                  <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={24} className={color} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">{title}</p>
                    <p className="text-xl font-black text-stone-900 tracking-tight mb-1">{value}</p>
                    <p className="text-sm font-medium text-stone-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability Note */}
            <div className="p-8 rounded-3xl bg-stone-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-4 mb-4">
                <Clock className="text-amber-400" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Response Time</span>
              </div>
              <p className="text-2xl font-black tracking-tighter italic mb-2">Typically under 2 hours</p>
              <p className="text-stone-400 text-sm font-medium">During business hours (IST). We value your time as much as our quality.</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-premium border border-stone-100 relative overflow-hidden">
              {submitted ? (
                <div className="py-20 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Send size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-stone-900 mb-4 italic">Message received!</h3>
                  <p className="text-stone-500 text-lg font-medium max-w-xs mx-auto">Thank you for reaching out. A spice specialist will contact you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-10 text-amber-600 font-black text-xs uppercase tracking-widest hover:text-amber-700"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Inquiry Form</span>
                    </div>
                    <h3 className="text-3xl font-black text-stone-900 tracking-tighter italic mb-2">Send us a <span className="text-amber-600 not-italic">note.</span></h3>
                    <p className="text-stone-500 font-medium">Use the form below to ask about products, shipping, or partnerships.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Full Name</label>
                        <input
                          required
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                          value={formState.name}
                          onChange={e => setFormState({...formState, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Email Address</label>
                        <input
                          required
                          type="email"
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                          value={formState.email}
                          onChange={e => setFormState({...formState, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Your Message</label>
                      <textarea
                        required
                        rows="6"
                        placeholder="Tell us what you're looking for..."
                        className="w-full px-6 py-4 rounded-3xl bg-stone-50 border border-stone-100 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all resize-none"
                        value={formState.message}
                        onChange={e => setFormState({...formState, message: e.target.value})}
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl
                        ${isSubmitting 
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
                          : 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-[1.02] active:scale-95 shadow-amber-600/30'}`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      {!isSubmitting && <Send size={18} />}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Newsletter ────────────────────────────── */}
      <section className="page-container pb-28">
        <div className="bg-stone-100 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center">
           <p className="text-amber-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4 text-center">Join the Community</p>
           <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter italic mb-8 mx-auto">Follow our organic <span className="text-amber-600 not-italic">journey.</span></h2>
           <div className="flex gap-4">
              {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
                <button key={social} className="px-8 py-3 bg-white border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-widest text-stone-600 hover:border-amber-500 hover:text-amber-600 transition-all">
                  {social}
                </button>
              ))}
           </div>
        </div>
      </section>

    </div>
  );
}
