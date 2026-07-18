import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Import assets from your frontend/assets folder
import bgImg from '../../../assets/BG.png';
import mascotImg from '../../../assets/mascot.png';
import roadmapImg from '../../../assets/roadmap.png';
import ytImg from '../../../assets/yt.png';

const categories = [
  "Technology & Programming",
  "Design & Creativity",
  "Business & Entrepreneurship",
  "Health & Wellness",
  "Arts & Music",
  "Science & Engineering",
  "Education & Teaching",
  "Media & Communication",
  "Agriculture & Environment",
  "Sports & Fitness"
];

export default function LandingPage() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleMockSignup = (e) => {
    e.stopPropagation();
    alert('Sign up to unlock this video');
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="landing-page-container">
      {/* Background Grid */}
      <div
        className="bg-grid"
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#violet-grad)" stroke="url(#violet-grad)" strokeWidth="2" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="violet-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333ea" />
                    <stop offset="1" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="wordmark">လမ်းပြ</span>
          </div>

          <div className="nav-center">
            <a href="#">Home</a>
            <a href="#">Courses</a>
            <a href="#">Roadmaps</a>
            <a href="#">About</a>
          </div>

          <div className="nav-right">
            <Link to="/login" className="nav-login">Log in</Link>
            <Link to="/assessment" className="btn btn-primary">Start Learning</Link>
          </div>

          <button className="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>We're Here To Help</h1>
          <p className="subheading">AI-Powered Digital Learning</p>

          {/* Static Hero Image (Robot + Icons) */}
          <div className="hero-image-wrapper">
            <img src={mascotImg} alt="LanPya Robot Mascot" className="hero-static-img" />
            <img src={ytImg} alt="Youtube Icon" className="hero-icon-yt" />
            <img src={roadmapImg} alt="Roadmap Icon" className="hero-icon-roadmap" />
          </div>

          <div className="hero-ctas">
            <Link to="/assessment" className="btn btn-dark">
              ဝါသနာကို ရှာဖွေပါ
              <svg className="arrow lime-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link to="/assessment" className="btn btn-dark">
              စိတ်ဝင်စားတာလေ့လာမယ်
              <svg className="arrow amber-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
        <div className="divider"></div>
      </header>

      {/* Section 1: Feature Cards */}
      <section className="py-24 relative overflow-hidden bg-[#060608] px-4 sm:px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
              ✨ Discover Lan Pya
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              လမ်းပြ (Lan Pya) ဆိုတာ ဘာလဲ။
            </h2>
            <p className="text-base sm:text-lg text-[#a8a3c4] font-normal leading-relaxed">
              အခြေခံအဆင့်မှသည် ဝင်ငွေရ Freelancer တစ်ယောက်ဖြစ်လာဖို့ AI က တိုက်ရိုက်လမ်းပြပေးမယ့် သင်ယူမှုပလက်ဖောင်း။
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-[#13131a]/60 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all duration-300">
                  {/* Target / Sparkles Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  AI က ဆွဲပေးမယ့် သင့်အတွက် လမ်းကြောင်း
                </h3>
                <p className="text-[#a8a3c4] text-sm leading-relaxed font-normal">
                  ဘယ်ကစရမှန်းမသိ ဖြစ်နေလား? သင့်ရဲ့ ဝါသနာနဲ့ အလေ့အကျင့်တွေကို AI က ခွဲခြမ်းစိတ်ဖြာပြီး၊ သင်နဲ့ အကိုက်ညီဆုံး Digital Career လမ်းကြောင်း (Roadmap) ကို အလိုအလျောက် ရေးဆွဲပေးပါမယ်။
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-[#13131a]/60 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all duration-300">
                  {/* Curated list / Video play Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  အကောင်းဆုံး သင်ခန်းစာများ
                </h3>
                <p className="text-[#a8a3c4] text-sm leading-relaxed font-normal">
                  YouTube ပေါ်မှာ လိုက်ရှာနေစရာ မလိုတော့ပါဘူး။ UI/UX, Coding နဲ့ Video Editing အစရှိတဲ့ နယ်ပယ်တွေအတွက် ပြည်တွင်းက အကောင်းဆုံး သင်ခန်းစာ ဗီဒီယိုတွေကို အဆင့်လိုက် စနစ်တကျ စုစည်းပေးထားပါတယ်။
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-[#13131a]/60 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all duration-300">
                  {/* Robot / Handshake Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M12 2v2" />
                    <path d="M8 5h8" />
                    <circle cx="8" cy="15" r="1" />
                    <circle cx="16" cy="15" r="1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  AI Client နဲ့ လက်တွေ့လေ့ကျင့်မယ်
                </h3>
                <p className="text-[#a8a3c4] text-sm leading-relaxed font-normal">
                  စာတွေ့လေ့လာရုံတင်မဟုတ်ဘဲ လက်တွေ့လုပ်နိုင်ဖို့ Agentic AI က Client တစ်ယောက်လို ဟန်ဆောင်ပြီး အလုပ်တွေ (Mock Projects) ပေးပါမယ်။ သင့်ရဲ့ လုပ်ဆောင်ချက်တွေကို အမှတ်ပေးပြီး အကြံဉာဏ်တွေ ပြန်ပေးပါမယ်။
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="py-24 relative overflow-hidden bg-[#060608] px-4 sm:px-6 border-t border-white/5">
        <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 tracking-wider uppercase">
              🚀 Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              လမ်းပြ (Lan Pya) က သင့်ကို ဘယ်လိုကူညီပေးမလဲ။
            </h2>
          </div>

          {/* Timeline / Step Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-purple-500/30 -z-0" />

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center group z-10">
              {/* Step Badge & Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold border-4 border-[#060608] shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300 z-10">
                  <span className="text-xl">1</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a3e635] border-2 border-[#060608] animate-pulse" />
              </div>

              <div className="mt-6 p-6 bg-[#13131a]/40 border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all duration-300 w-full">
                <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase block mb-1">Step 01</span>
                <h3 className="text-lg font-bold text-white mb-3">
                  အမှန်ကန်ဆုံး လမ်းကြောင်းကို ရှာဖွေပါ <span className="block text-xs text-[#a8a3c4] font-normal mt-1">(Find Your True Path)</span>
                </h3>
                <p className="text-[#a8a3c4] text-sm leading-relaxed font-normal">
                  သင့်ရဲ့ တွေးခေါ်ပုံနဲ့ ဝါသနာပါတဲ့ အရာတွေကို "Vibe Check" မေးခွန်းလေးတွေဖြေပြီး ရှာဖွေလိုက်ပါ။ AI က သင်နဲ့ အလိုက်ဖက်ဆုံး Freelance လမ်းကြောင်းကို ရွေးချယ်ပေးပါမယ်။
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center group z-10">
              {/* Step Badge & Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold border-4 border-[#060608] shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300 z-10">
                  <span className="text-xl">2</span>
                </div>
              </div>

              <div className="mt-6 p-6 bg-[#13131a]/40 border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all duration-300 w-full">
                <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase block mb-1">Step 02</span>
                <h3 className="text-lg font-bold text-white mb-3">
                  အာရုံမလွင့်ဘဲ လေ့လာပါ <span className="block text-xs text-[#a8a3c4] font-normal mt-1">(Learn Without Distractions)</span>
                </h3>
                <p className="text-[#a8a3c4] text-sm leading-relaxed font-normal">
                  အလုပ်ရဖို့ တကယ်လိုအပ်တဲ့ ကျွမ်းကျင်မှုတွေကိုပဲ အာရုံစိုက်ပြီး၊ ကြော်ငြာတွေနဲ့ အခြားအာရုံနောက်စရာတွေ မပါဘဲ အဆင့်လိုက် စီစဉ်ထားတဲ့ ဗီဒီယို သင်ခန်းစာတွေနဲ့ အလွယ်တကူ လေ့လာနိုင်ပါတယ်။
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center group z-10">
              {/* Step Badge & Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold border-4 border-[#060608] shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300 z-10">
                  <span className="text-xl">3</span>
                </div>
              </div>

              <div className="mt-6 p-6 bg-[#13131a]/40 border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all duration-300 w-full">
                <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase block mb-1">Step 03</span>
                <h3 className="text-lg font-bold text-white mb-3">
                  လက်တွေ့စွမ်းရည်ကို သက်သေပြပါ <span className="block text-xs text-[#a8a3c4] font-normal mt-1">(Prove Your Skills)</span>
                </h3>
                <p className="text-[#a8a3c4] text-sm leading-relaxed font-normal">
                  AI Client ကပေးတဲ့ လက်တွေ့ Project လေးတွေကို လုပ်ဆောင်ပါ။ AI ရဲ့ စစ်ဆေးအမှတ်ပေးမှုနဲ့အတူ အပြင်က Client အစစ်တွေနဲ့ တကယ်အလုပ်လုပ်ဖို့ ယုံကြည်မှု တည်ဆောက်ပါ။
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="explore">
        <div className="explore-header">
          <div className="eyebrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#violet-grad-small)" stroke="url(#violet-grad-small)" />
              <defs>
                <linearGradient id="violet-grad-small" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9333ea" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <span>လမ်းပြ</span>
          </div>
          <h2>သင့်ဝါသနာနဲ့ ကိုက်ညီတဲ့ Career Roadmap ကို ရှာဖွေလိုက်ပါ</h2>
          <p className="explore-desc">
            လမ်းပြ ဟာ AI ကို အသုံးပြုပြီး လူတစ်ဦးချင်းစီရဲ့ ဝါသနာနှင့် စိတ်ဝင်စားမှုအပေါ် အခြေခံကာ သင့်လျော်တဲ့ Career Roadmap ကို ရှာဖွေပေးတဲ့ Digital Learning Platform တစ်ခု ဖြစ်ပါတယ်။ Category တစ်ခုစီအောက်မှာ လိုအပ်တဲ့ Essential Skills များနှင့် ၎င်းတို့ကို သင်ယူနိုင်မယ့် Curated Video များ ပါဝင်ပါတယ်။
          </p>
          <Link to="/assessment" className="btn btn-primary explore-cta">
            ဝါသနာကို ရှာဖွေပါ
            <svg className="arrow white-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0b10] border-t border-white/5 py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Col 1: About */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#violet-grad-footer)" stroke="url(#violet-grad-footer)" strokeWidth="2" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="violet-grad-footer" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9333ea" />
                        <stop offset="1" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-xl font-bold text-white tracking-wider">လမ်းပြ</span>
              </div>
              <p className="text-sm text-[#a8a3c4] leading-relaxed">
                သင်နဲ့ အကိုက်ညီဆုံး Digital Career လမ်းကြောင်း (Roadmap) ကို အလိုအလျောက် ရေးဆွဲပေးပြီး လက်တွေ့လေ့ကျင့်ပေးနိုင်မယ့် Agentic AI ပလက်ဖောင်း။
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#a8a3c4] hover:text-purple-400 transition-colors">Home</a></li>
                <li><a href="#" className="text-sm text-[#a8a3c4] hover:text-purple-400 transition-colors">Courses</a></li>
                <li><a href="#" className="text-sm text-[#a8a3c4] hover:text-purple-400 transition-colors">Roadmaps</a></li>
                <li><a href="#" className="text-sm text-[#a8a3c4] hover:text-purple-400 transition-colors">About</a></li>
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-[#a8a3c4]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>info@lanpya.ai</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-[#a8a3c4]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+95 9 123 456 789</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Created By */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Developed By</h3>
              <div className="p-4 rounded-xl bg-[#13131a]/60 border border-white/5 hover:border-purple-500/20 transition-colors">
                <p className="text-xs text-[#a8a3c4] mb-2">Created for the MVP hackathon by</p>
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-wide">
                  Smart Innovators
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Footer Info */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#a8a3c4]">&copy; 2026 Lan Pya. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-[#a8a3c4] hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-[#a8a3c4] hover:text-purple-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
