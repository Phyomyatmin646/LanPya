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

        {/* Accordion Container */}
        <div className="accordion-container">
          {categories.map((cat, index) => {
            const isActive = activeAccordion === index;
            return (
              <div key={index} className={`accordion-item ${isActive ? 'active' : ''}`}>
                <button
                  className="accordion-header"
                  aria-expanded={isActive}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="accordion-header-left">
                    <div className="accordion-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <span className="accordion-title">{index + 1}. {cat}</span>
                  </div>
                  <svg className="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <div
                  className="accordion-content"
                  style={{ maxHeight: isActive ? '1000px' : '0' }}
                >
                  <div className="accordion-inner">
                    <div className="skills-section">
                      <h3>မရှိမဖြစ်လိုအပ်သော Skills ၅ ခု</h3>
                      <div className="skills-list">
                        <span className="skill-tag">Skill One</span>
                        <span className="skill-tag">Skill Two</span>
                        <span className="skill-tag">Skill Three</span>
                        <span className="skill-tag">Skill Four</span>
                        <span className="skill-tag">Skill Five</span>
                      </div>
                    </div>
                    <div className="videos-section">
                      <h3>ဆက်စပ် Videos</h3>
                      <div className="video-grid">
                        {[1, 2, 3].map((v) => (
                          <div key={v} className="video-card">
                            <div className="video-thumb"></div>
                            <div className="video-content">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              <p>ကြည့်ရန် Account လိုအပ်ပါသည်</p>
                              <button className="btn-unlock" onClick={handleMockSignup}>အကောင့်ဖွင့်ရန်</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
