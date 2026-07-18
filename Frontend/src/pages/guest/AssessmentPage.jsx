import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const questions = [
  {
    q: "A friend asks you to help with their birthday party invite. What's most fun?",
    options: [
      { text: "Picking colors, fonts, and layout to make it look great", track: "Graphic Design" },
      { text: "Making a short video invite with music and transitions", track: "Video Editing" },
      { text: "Writing a catchy caption/story to hype it up", track: "Content Creation" },
      { text: "Setting up an online RSVP page", track: "WebDev" }
    ]
  },
  {
    q: "You see an app with a confusing menu. Your first instinct?",
    options: [
      { text: "I could redesign this to be way easier to use", track: "UI/UX Design" },
      { text: "I bet I could fix this with some code", track: "Programming" },
      { text: "What if this leaks people's data? That's risky", track: "Cybersecurity" },
      { text: "I'd make a post explaining how to actually use it", track: "Content Creation" }
    ]
  },
  {
    q: "Your dream project is...",
    options: [
      { text: "Building a full website for a small business", track: "WebDev" },
      { text: "Writing a program that solves a daily problem", track: "Programming" },
      { text: "Automating boring tasks using AI tools", track: "AI Skills" },
      { text: "Creating AI-generated art, music, or video", track: "Generative AI" }
    ]
  },
  {
    q: "Which YouTube video would you click first?",
    options: [
      { text: "Photoshop tricks that changed my design career", track: "Graphic Design" },
      { text: "How hackers break into websites", track: "Cybersecurity" },
      { text: "I built a business using ChatGPT", track: "AI Skills" },
      { text: "Editing tricks that make videos go viral", track: "Video Editing" }
    ]
  },
  {
    q: "In a group project, you'd naturally take the role of...",
    options: [
      { text: "The one making eye-catching visuals/thumbnails", track: "Graphic Design" },
      { text: "The one filming and editing the final video", track: "Video Editing" },
      { text: "The one writing the script and hook", track: "Content Creation" },
      { text: "The one running the ad campaign to get views", track: "Digital Marketing" }
    ]
  },
  {
    q: "Which sounds most satisfying to master?",
    options: [
      { text: "Making an app feel intuitive to use", track: "UI/UX Design" },
      { text: "Getting a website to rank #1 on Google", track: "Digital Marketing" },
      { text: "Prompting AI to generate exactly what you imagine", track: "Generative AI" },
      { text: "Finding security holes before hackers do", track: "Cybersecurity" }
    ]
  },
  {
    q: "A weekend paid gig — you'd pick...",
    options: [
      { text: "Designing a logo and brand identity", track: "Graphic Design" },
      { text: "Building a landing page with code", track: "WebDev" },
      { text: "Editing a client's YouTube video", track: "Video Editing" },
      { text: "Running their Instagram ads", track: "Digital Marketing" }
    ]
  },
  {
    q: "What excites you most about AI?",
    options: [{ text: "Using it to automate business tasks", track: "AI Skills" },
    { text: "Using it to generate images, video, or music", track: "Generative AI" },
    { text: "Using it to write code faster", track: "Programming" },
    { text: "Making sure AI isn't hacked or misused", track: "Cybersecurity" }
    ]
  },
  {
    q: "Pick a 'superpower' for a day:",
    options: [
      { text: "Instantly know how to code any app", track: "Programming" },
      { text: "Instantly create any image you imagine", track: "Generative AI" },
      { text: "Instantly design any professional graphic", track: "Graphic Design" },
      { text: "Instantly know how any system could be attacked or protected", track: "Cybersecurity" }
    ]
  },
  {
    q: "You just learned something cool. You'd rather...",
    options: [
      { text: "Make a short-form video about it", track: "Content Creation" },
      { text: "Write a blog/newsletter about it", track: "Digital Marketing" },
      { text: "Make an infographic explaining it", track: "Graphic Design" },
      { text: "Build a mini webpage about it", track: "WebDev" }
    ]
  },
  {
    q: "What would bother you most while using an app?",
    options: [
      { text: "Ugly, hard-to-read layout", track: "UI/UX Design" },
      { text: "Broken buttons or links", track: "Programming" },
      { text: "Feeling like your data isn't safe", track: "Cybersecurity" },
      { text: "Boring content with no visuals", track: "Content Creation" }
    ]
  },
  {
    q: "Your ideal 'flow state' activity is...",
    options: [
      { text: "Editing clips until the pacing feels perfect", track: "Video Editing" },
      { text: "Solving a logic puzzle or debugging code", track: "Programming" },
      { text: "Sketching layouts and picking color palettes", track: "Graphic Design" },
      { text: "Brainstorming with AI to generate ideas", track: "AI Skills" }
    ]
  },
  {
    q: "Which job title interests you most?",
    options: [
      { text: "Freelance Web Developer", track: "WebDev" },
      { text: "Social Media Manager", track: "Digital Marketing" },
      { text: "Cybersecurity Analyst", track: "Cybersecurity" },
      { text: "Content Creator / YouTuber", track: "Content Creation" }
    ]
  },
  {
    q: "What would you build for a hackathon demo?",
    options: [
      { text: "A working prototype with a clean interface", track: "UI/UX Design" },
      { text: "An AI tool that auto-generates content", track: "Generative AI" },
      { text: "A short promo video for the product", track: "Video Editing" },
      { text: "A marketing plan to launch it", track: "Digital Marketing" }
    ]
  },
  {
    q: "Which compliment means the most to you?",
    options: [
      { text: "Your designs always look so professional", track: "Graphic Design" },
      { text: "You explain things so clearly, I love your content", track: "Content Creation" },
      { text: "Your code actually works flawlessly", track: "Programming" },
      { text: "I feel safe because you protect our data", track: "Cybersecurity" }
    ]
  }
];

const roadmaps = {
  "Graphic Design": ["Beginner Photoshop", "Typography", "Color Theory", "Adobe Illustrator", "Logo & Branding", "Goal: Build your own Portfolio"],
  "UI/UX Design": ["Design Principles (Color Theory & Layout)", "Figma Mastery", "User Interface (UI) Design", "User Experience (UX) Architecture", "Prototyping & Handoff"],
  "WebDev": ["Foundation: HTML, CSS, JS", "Node/Express", "PHP / Laravel", "Databases", "Web Hosting"],
  "Programming": ["Python (Syntax, logic, scripting)", "Java (OOP, strict typing)", "Databases & SQL", "Algorithms & Data Structures", "Git/GitHub & Basic Cloud Hosting"],
  "Video Editing": ["CapCut (Short-form & speed)", "Premiere Pro (Industry standard)", "DaVinci Resolve (Color grading)", "After Effects (Motion & VFX)", "AI Generation: Kling, Luma Dream Machine"],
  "Digital Marketing": ["Content Marketing", "SEO", "Social Media Marketing", "Email Marketing", "Performance Marketing (Meta/Google Ads)"],
  "AI Skills": ["ChatGPT & Applied LLMs", "Prompt Engineering", "Generative AI", "AI Automation", "Agentic AI"],
  "Generative AI": ["Image & Art Generation", "Video & Motion Generation", "Audio & Voice Synthesis", "3D & Asset Generation", "UI & Frontend Generation"],
  "Cybersecurity": ["Networking Basics", "Cybersecurity Fundamentals", "Ethical Hacking Basics", "Web App Security & OWASP Top 10", "Systems Security & Incident Response"],
  "Content Creation": ["Scriptwriting & Storytelling", "Graphic Design Fundamentals (Thumbnails)", "Mobile Videography & Audio", "Mobile Video Editing (CapCut Basics)", "Platform Algorithms & Analytics"]
};

export default function AssessmentPage() {
  const [step, setStep] = useState('quiz'); // 'quiz', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [primaryMatch, setPrimaryMatch] = useState('');
  const [secondaryMatch, setSecondaryMatch] = useState('');
  const [hasSavedResult, setHasSavedResult] = useState(false);

  // Random sorting options for current question
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('skillPathResult');
    if (saved) {
      setHasSavedResult(true);
    }
  }, []);

  useEffect(() => {
    if (step === 'quiz') {
      const opts = [...questions[currentQuestion].options].sort(() => Math.random() - 0.5);
      setShuffledOptions(opts);
    }
  }, [currentQuestion, step]);

  const handleStart = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setScores({});
  };

  const handleResume = () => {
    const savedStr = localStorage.getItem('skillPathResult');
    if (savedStr) {
      try {
        const saved = JSON.parse(savedStr);
        setPrimaryMatch(saved.primary);
        setSecondaryMatch(saved.secondary);
        setStep('results');
      } catch (e) {
        handleStart();
      }
    } else {
      handleStart();
    }
  };

  const handleOptionSelect = (track) => {
    const newScores = { ...scores, [track]: (scores[track] || 0) + 1 };
    setScores(newScores);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const sortedTracks = Object.keys(newScores).sort((a, b) => newScores[b] - newScores[a]);
        const primary = sortedTracks[0] || "Programming";
        const secondary = sortedTracks.length > 1 ? sortedTracks[1] : null;

        setPrimaryMatch(primary);
        setSecondaryMatch(secondary);
        localStorage.setItem('skillPathResult', JSON.stringify({ primary, secondary }));
        setStep('results');
      }
    }, 300);
  };

  const shareResult = () => {
    const text = `I just took the Hackathon 2026 Skill Path Finder! My top track is ${primaryMatch}. Find your passion too!`;
    if (navigator.share) {
      navigator.share({
        title: 'My Skill Path',
        text: text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Result copied to clipboard!');
      });
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col bg-[#0b0c10] text-white font-sans overflow-x-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    >
      {/* Quiz Screen */}
      {step === 'quiz' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-2xl mb-12">
            <div className="text-right text-[#8a8d9b] text-sm mb-2">Question {currentQuestion + 1} of 15</div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00f0ff] to-[#b026ff] transition-all duration-300"
                style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl text-center mb-10 max-w-2xl leading-relaxed">
            {questions[currentQuestion].q}
          </h2>

          <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
            {shuffledOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(opt.track)}
                className="bg-[#15161c] border border-white/5 p-5 rounded-xl text-left text-lg hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 hover:translate-x-2 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-200"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {step === 'results' && (
        <div className="flex-1 flex flex-col items-center justify-between py-8 md:py-12 px-4 w-full animate-in fade-in duration-700">
          <div className="text-center w-full mt-2 md:mt-4">
            <h2 className="text-[#8a8d9b] uppercase tracking-widest text-xs mb-1">Your Top Skill Track</h2>
            <h1 className="text-4xl md:text-5xl font-bold m-0 text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              {primaryMatch}
            </h1>
            {secondaryMatch && (
              <div className="mt-2 text-[#8a8d9b] text-sm">
                Runner up: <span className="text-white font-bold">{secondaryMatch}</span>
              </div>
            )}
          </div>

          <div className="w-full max-w-7xl flex-1 flex flex-col justify-center my-8">
            <div className="text-center mb-8">
              <div className="text-[#00f0ff] uppercase tracking-widest text-xs mb-1">Future Milestones</div>
              <h3 className="text-2xl md:text-3xl font-bold">Project <span className="text-[#b026ff]">Roadmap</span></h3>
            </div>

            <div className="relative w-full py-8 md:py-20 flex flex-col md:flex-row md:justify-center md:items-center">
              {/* Desktop Horizontal Line */}
              <div className="hidden md:block absolute top-1/2 left-[3%] right-[3%] h-[3px] bg-gradient-to-r from-[#00f0ff] to-[#b026ff] -translate-y-1/2 shadow-[0_0_15px_rgba(0,240,255,0.4)] z-0"></div>

              {/* Mobile Vertical Line */}
              <div className="md:hidden absolute top-0 bottom-0 left-[34px] w-1 bg-gradient-to-b from-[#00f0ff] to-[#b026ff] z-0"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between w-full gap-6 md:gap-3 lg:gap-4 px-4 md:px-8">
                {(roadmaps[primaryMatch] || []).map((stepDesc, idx) => {
                  const isBottom = idx % 2 !== 0;
                  const colorClass = isBottom ? 'text-[#b026ff] border-[#b026ff]' : 'text-[#00f0ff] border-[#00f0ff]';
                  const bgClass = isBottom ? 'bg-[#b026ff]' : 'bg-[#00f0ff]';
                  const shadowClass = isBottom ? 'shadow-[0_0_10px_#b026ff]' : 'shadow-[0_0_10px_#00f0ff]';

                  return (
                    <div key={idx} className="relative flex flex-row md:flex-col items-center md:justify-center w-full md:flex-1 md:max-w-[170px] md:h-0">

                      {/* Mobile dot wrapper */}
                      <div className="md:hidden relative z-10 flex-shrink-0 w-[40px] flex justify-center mr-4">
                        <div className={`w-4 h-4 rounded-full bg-[#0b0c10] border-[3px] ${colorClass} ${shadowClass}`}></div>
                      </div>

                      {/* Desktop dot */}
                      <div className={`hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0b0c10] border-[3px] z-20 ${colorClass} ${shadowClass}`}></div>

                      {/* Card Mobile */}
                      <div className={`md:hidden w-full bg-[#15161c] rounded-xl p-4 shadow-xl border-l-4 ${colorClass}`}>
                        <div className={`text-[10px] uppercase font-bold mb-1 ${isBottom ? 'text-[#b026ff]' : 'text-[#00f0ff]'}`}>Step {idx + 1}</div>
                        <div className="text-[14px] leading-snug">{stepDesc}</div>
                      </div>

                      {/* Desktop Layout */}
                      <div className={`hidden md:flex absolute flex-col items-center w-full`} style={{ [isBottom ? 'top' : 'bottom']: '0px' }}>
                        {!isBottom ? (
                          <>
                            <div className={`w-full bg-[#15161c] rounded-xl p-3 shadow-xl border-t-2 border-l-[1px] border-r-[1px] border-b-[1px] border-b-white/5 border-l-white/10 border-r-white/5 ${colorClass} hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-shadow`}>
                              <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 text-[#00f0ff]`}>Step {idx + 1}</div>
                              <div className="text-[13px] leading-tight">{stepDesc}</div>
                            </div>
                            <div className={`w-[2px] h-[30px] ${bgClass}`}></div>
                          </>
                        ) : (
                          <>
                            <div className={`w-[2px] h-[30px] ${bgClass}`}></div>
                            <div className={`w-full bg-[#15161c] rounded-xl p-3 shadow-xl border-b-2 border-l-[1px] border-r-[1px] border-t-[1px] border-t-white/5 border-l-white/10 border-r-white/5 ${colorClass} hover:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-shadow`}>
                              <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 text-[#b026ff]`}>Step {idx + 1}</div>
                              <div className="text-[13px] leading-tight">{stepDesc}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00f0ff] to-[#b026ff] text-white font-bold py-3 px-8 rounded-full hover:-translate-y-1 transition-all shadow-[0_4px_15px_rgba(176,38,255,0.3)]"
            >
              Create an Account
            </Link>
            <button
              onClick={shareResult}
              className="flex items-center gap-2 bg-transparent border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-bold py-3 px-8 rounded-full transition-all"
            >
              <Share2 className="w-5 h-5" /> Share
            </button>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-transparent border-2 border-white/20 text-white hover:border-white hover:text-white font-bold py-3 px-8 rounded-full transition-all"
            >
              <RefreshCw className="w-5 h-5" /> Retake
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full mt-auto bg-gradient-to-r from-[#b026ff] to-[#6d28d9] shadow-[0_-5px_20px_rgba(176,38,255,0.2)] text-white text-center py-4 relative z-50">
        <p className="text-sm tracking-widest font-semibold">&copy; 2026 Smart Innovators</p>
      </footer>
    </div>
  );
}
