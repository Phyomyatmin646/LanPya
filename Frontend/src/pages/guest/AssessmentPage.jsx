import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGuestStore } from '../../store/guestStore';
import { Share2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const questions = [
  {
    q: "သူငယ်ချင်းတစ်ယောက်က မွေးနေ့ပွဲဖိတ်စာလုပ်ဖို့ အကူအညီတောင်းရင် ဘယ်အရာက သင့်အတွက် အပျော်ဆုံးဖြစ်မလဲ။",
    options: [
      { text: "လှပအောင် အရောင်၊ ဖောင့်နဲ့ ပုံစံ (layout) ရွေးချယ်တာ", track: "Graphic Design" },
      { text: "သီချင်းနဲ့ animation ပါတဲ့ ဖိတ်စာဗီဒီယိုတိုလေး လုပ်တာ", track: "Video Editing" },
      { text: "လူစိတ်ဝင်စားအောင် စာသားဆွဲဆောင်မှုရှိရှိ ရေးတာ", track: "Content Creation" },
      { text: "Online ကနေ စာရင်းပေးလို့ရမယ့် page တစ်ခု ဖန်တီးတာ", track: "WebDev" }
    ]
  },
  {
    q: "အသုံးပြုရခက်ခဲပြီး ရှုပ်ထွေးနေတဲ့ App တစ်ခုကို တွေ့ရင် သင့်ရဲ့ ပထမဆုံးအတွေးက ဘာဖြစ်မလဲ။",
    options: [
      { text: "သုံးရပိုလွယ်အောင် ပုံစံအသစ် (redesign) ပြန်ဆွဲချင်တယ်", track: "UI/UX Design" },
      { text: "Code ရေးပြီး ဒါကို ပြင်လိုက်လို့ရတယ်လို့ တွေးမိတယ်", track: "Programming" },
      { text: "အချက်အလက်တွေ ပေါက်ကြားသွားမလားလို့ စိုးရိမ်မိတယ်", track: "Cybersecurity" },
      { text: "ဒါကို ဘယ်လိုသုံးရမလဲဆိုတာ ရှင်းပြတဲ့ content လုပ်ချင်တယ်", track: "Content Creation" }
    ]
  },
  {
    q: "သင် အလုပ်ချင်ဆုံး စိတ်ကူးယဉ် Project က ဘာလဲ။",
    options: [
      { text: "လုပ်ငန်းတစ်ခုအတွက် Website အပြည့်အစုံ ဆွဲပေးတာ", track: "WebDev" },
      { text: "နေ့စဉ်ပြဿနာတွေကို ဖြေရှင်းပေးမယ့် software/app ရေးတာ", track: "Programming" },
      { text: "ပျင်းစရာကောင်းတဲ့ အလုပ်တွေကို AI နဲ့ အလိုအလျောက်လုပ်ခိုင်းတာ", track: "AI Skills" },
      { text: "AI သုံးပြီး ပုံတွေ၊ သီချင်းတွေ၊ ဗီဒီယိုတွေ ဖန်တီးတာ", track: "Generative AI" }
    ]
  },
  {
    q: "YouTube ပေါ်မှာဆိုရင် ဘယ်ဗီဒီယိုကို အရင်ဆုံး နှိပ်ကြည့်မလဲ။",
    options: [
      { text: "ဒီဇိုင်းလောကကို ပြောင်းလဲစေမယ့် Photoshop နည်းလမ်းများ", track: "Graphic Design" },
      { text: "Hacker တွေ Website တွေကို ဘယ်လိုဖောက်ထွင်းလဲ", track: "Cybersecurity" },
      { text: "ChatGPT သုံးပြီး ကိုယ်ပိုင်လုပ်ငန်းတစ်ခု ဘယ်လိုထောင်မလဲ", track: "AI Skills" },
      { text: "ဗီဒီယိုတွေ လူကြည့်များစေမယ့် ဗီဒီယိုတည်းဖြတ်နည်းများ", track: "Video Editing" }
    ]
  },
  {
    q: "အဖွဲ့လိုက် အလုပ်တစ်ခုလုပ်ရင် သင်က ဘယ်အပိုင်းကို ပိုလုပ်ချင်လဲ။",
    options: [
      { text: "လှပတဲ့ ဓာတ်ပုံနဲ့ ပုံရိပ်တွေ ပြင်ဆင်ပေးတဲ့သူ", track: "Graphic Design" },
      { text: "ဗီဒီယိုရိုက်ကူးပြီး တည်းဖြတ်ပေးတဲ့သူ", track: "Video Editing" },
      { text: "စာသားတွေ၊ ဇာတ်ညွှန်းတွေ ရေးသားပေးတဲ့သူ", track: "Content Creation" },
      { text: "လူသိများအောင် ကြော်ငြာ (Ads) တွေ လုပ်ပေးတဲ့သူ", track: "Digital Marketing" }
    ]
  },
  {
    q: "ဘယ်ပညာရပ်ကို ကျွမ်းကျင်အောင် သင်ယူရတာက သင့်အတွက် အားရကျေနပ်မှုအရှိဆုံး ဖြစ်မလဲ။",
    options: [
      { text: "App တစ်ခုကို သုံးရတာ အလွန်လွယ်ကူပြီး စမတ်ကျအောင် လုပ်တာ", track: "UI/UX Design" },
      { text: "Website ကို Google ရှာဖွေမှုရဲ့ ထိပ်ဆုံးမှာ ရောက်အောင်လုပ်တာ (SEO)", track: "Digital Marketing" },
      { text: "မိမိစိတ်ကူးထဲကအတိုင်း ထွက်လာဖို့ AI ကို အမိန့်ပေးခိုင်းစေတာ", track: "Generative AI" },
      { text: "Hacker တွေထက် အရင် လုံခြုံရေးအားနည်းချက်ကို ရှာဖွေပြင်ဆင်တာ", track: "Cybersecurity" }
    ]
  },
  {
    q: "ပိတ်ရက်မှာ အခကြေးငွေရမယ့် Freelance အလုပ်တစ်ခု လုပ်မယ်ဆိုရင် ဘာကို ရွေးမလဲ။",
    options: [
      { text: "လုပ်ငန်းတစ်ခုအတွက် Logo နဲ့ Brand ဒီဇိုင်းဆွဲပေးတာ", track: "Graphic Design" },
      { text: "Code ရေးပြီး Website/Landing Page တစ်ခု ဖန်တီးပေးတာ", track: "WebDev" },
      { text: "Client ရဲ့ YouTube ဗီဒီယိုကို တည်းဖြတ်ပေးတာ", track: "Video Editing" },
      { text: "သူတို့ရဲ့ လူမှုကွန်ရက် ကြော်ငြာ (Ads) တွေကို ဦးစီးလုပ်ကိုင်ပေးတာ", track: "Digital Marketing" }
    ]
  },
  {
    q: "AI နဲ့ ပတ်သက်ပြီး သင့်ကို အစိတ်လှုပ်ရှားစေဆုံးအရာက ဘာလဲ။",
    options: [
      { text: "အလုပ်ကိစ္စတွေကို AI သုံးပြီး အလိုအလျောက် မြန်မြန်ဆန်ဆန်လုပ်တာ", track: "AI Skills" },
      { text: "ပုံတွေ၊ ဗီဒီယိုတွေ၊ သီချင်းတွေကို AI သုံးပြီး အလွယ်တကူ ထုတ်လုပ်တာ", track: "Generative AI" },
      { text: "Code ရေးရာမှာ မြန်ဆန်စေဖို့ AI ကို အကူအညီတောင်းတာ", track: "Programming" },
      { text: "AI ကို တလွဲအသုံးမပြုအောင်နဲ့ အဟက်မခံရအောင် ကာကွယ်တာ", track: "Cybersecurity" }
    ]
  },
  {
    q: "တစ်ရက်တာအတွက် အစွမ်းထက်စွမ်းရည် (superpower) တစ်ခု ရမယ်ဆိုရင် ဘာကို ရွေးမလဲ။",
    options: [
      { text: "ဘယ်လို App မျိုးမဆို ချက်ချင်း Code ရေးနိုင်တဲ့ စွမ်းရည်", track: "Programming" },
      { text: "စိတ်ကူးထဲရှိသမျှပုံတွေကို ချက်ချင်းဖန်တီးနိုင်တဲ့ စွမ်းရည်", track: "Generative AI" },
      { text: "ပရော်ဖက်ရှင်နယ်ကျတဲ့ ဒီဇိုင်းတွေကို ချက်ချင်းဆွဲနိုင်တဲ့ စွမ်းရည်", track: "Graphic Design" },
      { text: "စနစ်တစ်ခုရဲ့ လုံခြုံရေး အားနည်းချက်ကို ချက်ချင်းသိပြီး ကာကွယ်နိုင်တဲ့ စွမ်းရည်", track: "Cybersecurity" }
    ]
  },
  {
    q: "စိတ်ဝင်စားစရာ အသစ်တစ်ခုခု သိလာတဲ့အခါ ဘယ်လို မျှဝေချင်လဲ။",
    options: [
      { text: "အကြောင်းအရာနဲ့ ပတ်သက်ပြီး ဗီဒီယိုတိုလေး လုပ်ပြီး တင်ချင်တယ်", track: "Content Creation" },
      { text: "ဆောင်းပါး သို့မဟုတ် Newsletter ရေးပြီး မျှဝေချင်တယ်", track: "Digital Marketing" },
      { text: "နားလည်လွယ်တဲ့ ပုံလေးတွေ (infographic) ဆွဲပြီး ရှင်းပြချင်တယ်", track: "Graphic Design" },
      { text: "ဒီအကြောင်းအရာအတွက် သီးသန့် Web page လေးတစ်ခု လုပ်ချင်တယ်", track: "WebDev" }
    ]
  },
  {
    q: "App တစ်ခုကို သုံးနေရင်း ဘယ်အချက်က သင့်ကို အနှောင့်အယှက်အဖြစ်ဆုံးလဲ။",
    options: [
      { text: "ကြည့်ရဆိုးပြီး ဖတ်ရခက်တဲ့ ဒီဇိုင်းပုံစံ", track: "UI/UX Design" },
      { text: "နှိပ်လို့မရတဲ့ ခလုတ်တွေ သို့မဟုတ် ပျက်နေတဲ့ လင့်ခ်များ", track: "Programming" },
      { text: "ကိုယ့်ရဲ့ ကိုယ်ရေးကိုယ်တာ အချက်အလက်တွေ မလုံခြုံသလို ခံစားရတာ", track: "Cybersecurity" },
      { text: "ရုပ်ပုံတွေ မပါဘဲ ပျင်းစရာကောင်းတဲ့ စာသားသက်သက် content တွေ", track: "Content Creation" }
    ]
  },
  {
    q: "အချိန်ကုန်မှန်းမသိ စိတ်နှစ်ပြီး လုပ်ရတာ အနှစ်သက်ဆုံး အလုပ်က ဘာလဲ။",
    options: [
      { text: "ဗီဒီယိုအကွက်တွေကို စည်းချက်ကျကျ တည်းဖြတ်နေရတာ", track: "Video Editing" },
      { text: "Code ထဲက အမှား (Bug) တွေကို ရှာဖွေဖြေရှင်းနေရတာ", track: "Programming" },
      { text: "ဒီဇိုင်းပုံကြမ်းတွေဆွဲပြီး အရောင်စပ်နေရတာ", track: "Graphic Design" },
      { text: "စိတ်ကူးသစ်တွေရဖို့ AI နဲ့ တိုင်ပင်ဆွေးနွေးနေရတာ", track: "AI Skills" }
    ]
  },
  {
    q: "ဘယ်အလုပ်ရာထူးကို ပိုပြီး စိတ်ဝင်စားလဲ။",
    options: [
      { text: "Freelance Web Developer (Website ရေးဆွဲသူ)", track: "WebDev" },
      { text: "Social Media Manager (လူမှုကွန်ရက် စီမံခန့်ခွဲသူ)", track: "Digital Marketing" },
      { text: "Cybersecurity Analyst (စနစ်လုံခြုံရေးပညာရှင်)", track: "Cybersecurity" },
      { text: "Content Creator / YouTuber (ဗီဒီယိုဖန်တီးသူ)", track: "Content Creation" }
    ]
  },
  {
    q: "Hackathon ပြိုင်ပွဲတစ်ခုမှာဆိုရင် ဘယ်အပိုင်းကို အဓိက ဖန်တီးတင်ပြမလဲ။",
    options: [
      { text: "အသုံးပြုရ လွယ်ကူသပ်ရပ်တဲ့ သရုပ်ပြပုံစံ (prototype) တည်ဆောက်တာ", track: "UI/UX Design" },
      { text: "Content တွေကို အလိုအလျောက် ထုတ်လုပ်ပေးမယ့် AI ကိရိယာ ဖန်တီးတာ", track: "Generative AI" },
      { text: "ထုတ်ကုန်ကို မိတ်ဆက်ပေးမယ့် ကြော်ငြာဗီဒီယိုတို ဖန်တီးတာ", track: "Video Editing" },
      { text: "ဈေးကွက်ထဲကို စတင်မိတ်ဆက်ဖို့ ဈေးကွက်မြှင့်တင်ရေး (Marketing) အစီအစဉ်ဆွဲတာ", track: "Digital Marketing" }
    ]
  },
  {
    q: "ဘယ်လို ချီးကျူးစကားမျိုးက သင့်အတွက် တန်ဖိုးအရှိဆုံး ဖြစ်မလဲ။",
    options: [
      { text: "မင်းရဲ့ဒီဇိုင်းတွေက တကယ့်ကို professional ကျတာပဲ", track: "Graphic Design" },
      { text: "မင်းရှင်းပြတာ အရမ်းနားလည်လွယ်တယ်၊ မင်းရဲ့ content ကို ကြိုက်တယ်", track: "Content Creation" },
      { text: "မင်းရေးထားတဲ့ code က အမှားအယွင်းမရှိ အလုပ်လုပ်တာပဲ", track: "Programming" },
      { text: "မင်းက အချက်အလက်တွေကို ကာကွယ်ပေးလို့ ငါတို့လုံခြုံတယ်လို့ ခံစားရတယ်", track: "Cybersecurity" }
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
  const [step, setStep] = useState('quiz'); // 'quiz', 'loading', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [aiRoadmaps, setAiRoadmaps] = useState([]);
  
  const navigate = useNavigate();
  const setGuestData = useGuestStore(state => state.setGuestData);
  const { user } = useAuth();
  
  // Random sorting options for current question
  const [shuffledOptions, setShuffledOptions] = useState([]);

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
    setAiRoadmaps([]);
  };

  const fetchAiRoadmaps = async (topTracks) => {
    setStep('loading');
    try {
      // In a real app, you'd use your configured axios instance
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${apiUrl}/guest-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topTracks })
      });
      
      const data = await response.json();
      if (data.success && data.data && data.data.roadmaps) {
        setAiRoadmaps(data.data.roadmaps);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch AI roadmaps:", error);
      toast.error("Failed to generate AI roadmaps. Using fallback.");
      // Fallback
      setAiRoadmaps([{
        title: `${topTracks[0]} Master Path`,
        description: "Your personalized top recommendation.",
        modules: ["Basics", "Intermediate", "Advanced"],
        isTopMatch: true
      }]);
    }
    setStep('results');
  };

  const handleOptionSelect = (track) => {
    const newScores = { ...scores, [track]: (scores[track] || 0) + 1 };
    setScores(newScores);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const sortedTracks = Object.keys(newScores).sort((a, b) => newScores[b] - newScores[a]);
        const topTracks = sortedTracks.slice(0, 3); // Send top 3 tracks to AI
        fetchAiRoadmaps(topTracks);
      }
    }, 300);
  };

  const handleAlternativeClick = (index) => {
    // Swap the clicked alternative with the current top match
    const newRoadmaps = [...aiRoadmaps];
    const clicked = newRoadmaps[index];
    newRoadmaps[index] = newRoadmaps[0];
    newRoadmaps[0] = clicked;
    setAiRoadmaps(newRoadmaps);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveClick = () => {
    // Save current top roadmap before redirecting
    const topTracks = Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, 3);
    setGuestData({ interests: topTracks }, aiRoadmaps[0]);
    if (user) {
      toast.success('Roadmap saved to My Learning!');
      navigate('/mylearning');
    } else {
      navigate('/register');
    }
  };

  const shareResult = () => {
    const topMatch = aiRoadmaps[0]?.title || "Custom Path";
    const text = `I just took the AI Skill Path Finder! My top recommended track is ${topMatch}. Find your passion too!`;
    if (navigator.share) {
      navigator.share({
        title: 'My AI Skill Path',
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
            <div className="text-right text-[#8a8d9b] text-sm mb-2">Question {currentQuestion + 1} of {questions.length}</div>
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

      {/* Loading Screen */}
      {step === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <RefreshCw className="w-12 h-12 text-[#00f0ff] animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff]">
            AI is analyzing your profile...
          </h2>
          <p className="text-[#8a8d9b] mt-2">Generating personalized roadmaps from the database</p>
        </div>
      )}

      {/* Results Screen */}
      {step === 'results' && aiRoadmaps.length > 0 && (
        <div className="flex-1 flex flex-col items-center justify-between py-8 md:py-12 px-4 w-full animate-in fade-in duration-700">
          <div className="text-center w-full mt-2 md:mt-4">
            <h2 className="text-[#8a8d9b] uppercase tracking-widest text-xs mb-1">Your Top AI Recommendation</h2>
            <h1 className="text-4xl md:text-5xl font-bold m-0 text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              {aiRoadmaps[0].title}
            </h1>
            <p className="mt-4 text-[#8a8d9b] max-w-2xl mx-auto">{aiRoadmaps[0].description}</p>
          </div>

          {/* Top Roadmap Render */}
          <div className="w-full max-w-7xl flex-1 flex flex-col justify-center my-8">
            <div className="text-center mb-8">
              <div className="text-[#00f0ff] uppercase tracking-widest text-xs mb-1">Primary Milestones</div>
              <h3 className="text-2xl md:text-3xl font-bold">Project <span className="text-[#b026ff]">Roadmap</span></h3>
            </div>

            <div className="relative w-full py-8 md:py-20 flex flex-col md:flex-row md:justify-center md:items-center">
              {/* Desktop Horizontal Line */}
              <div className="hidden md:block absolute top-1/2 left-[3%] right-[3%] h-[3px] bg-gradient-to-r from-[#00f0ff] to-[#b026ff] -translate-y-1/2 shadow-[0_0_15px_rgba(0,240,255,0.4)] z-0"></div>

              {/* Mobile Vertical Line */}
              <div className="md:hidden absolute top-0 bottom-0 left-[34px] w-1 bg-gradient-to-b from-[#00f0ff] to-[#b026ff] z-0"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between w-full gap-6 md:gap-3 lg:gap-4 px-4 md:px-8">
                {(aiRoadmaps[0].modules || []).map((moduleData, idx) => {
                  // Fallback for older string-based formats if needed
                  const stepName = typeof moduleData === 'object' ? moduleData.name : moduleData;
                  const stepTech = typeof moduleData === 'object' ? moduleData.tech : "";

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
                        <div className="text-[14px] leading-snug font-bold">{stepName}</div>
                        {stepTech && <div className="text-[12px] text-[#8a8d9b] mt-1 break-words">{stepTech}</div>}
                      </div>

                      {/* Desktop Layout */}
                      <div className={`hidden md:flex absolute flex-col items-center w-full`} style={{ [isBottom ? 'top' : 'bottom']: '0px' }}>
                        {!isBottom ? (
                          <>
                            <div className={`w-full bg-[#15161c] rounded-xl p-3 shadow-xl border-t-2 border-l-[1px] border-r-[1px] border-b-[1px] border-b-white/5 border-l-white/10 border-r-white/5 ${colorClass} hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-shadow`}>
                              <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 text-[#00f0ff]`}>Step {idx + 1}</div>
                              <div className="text-[13px] leading-tight font-bold">{stepName}</div>
                              {stepTech && <div className="text-[11px] text-[#8a8d9b] mt-1 break-words">{stepTech}</div>}
                            </div>
                            <div className={`w-[2px] h-[30px] ${bgClass}`}></div>
                          </>
                        ) : (
                          <>
                            <div className={`w-[2px] h-[30px] ${bgClass}`}></div>
                            <div className={`w-full bg-[#15161c] rounded-xl p-3 shadow-xl border-b-2 border-l-[1px] border-r-[1px] border-t-[1px] border-t-white/5 border-l-white/10 border-r-white/5 ${colorClass} hover:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-shadow`}>
                              <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 text-[#b026ff]`}>Step {idx + 1}</div>
                              <div className="text-[13px] leading-tight font-bold">{stepName}</div>
                              {stepTech && <div className="text-[11px] text-[#8a8d9b] mt-1 break-words">{stepTech}</div>}
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

          {/* Optional Alternative Roadmaps (4 items) */}
          {aiRoadmaps.length > 1 && (
            <div className="w-full max-w-4xl mb-12">
              <h3 className="text-xl font-bold mb-6 text-center text-[#8a8d9b]">Optional Alternative Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRoadmaps.slice(1).map((roadmap, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleAlternativeClick(idx + 1)}
                    className="bg-[#15161c] border border-white/10 rounded-xl p-5 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <h4 className="text-lg font-bold text-[#00f0ff] mb-2">{roadmap.title}</h4>
                    <p className="text-sm text-[#8a8d9b] mb-4">{roadmap.description}</p>
                    <div className="text-xs text-white/70">
                      <strong>Key Topics:</strong> {roadmap.modules?.map(m => typeof m === 'object' ? m.name : m).join(" → ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <button
              onClick={handleSaveClick}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00f0ff] to-[#b026ff] text-white font-bold py-3 px-8 rounded-full hover:-translate-y-1 transition-all shadow-[0_4px_15px_rgba(176,38,255,0.3)]"
            >
              {user ? 'Save to My Learning' : 'Create an Account'}
            </button>
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
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#b026ff] text-[#b026ff] hover:bg-[#b026ff]/10 font-bold py-3 px-8 rounded-full hover:-translate-y-1 transition-all"
            >
              Continue as Guest
            </Link>
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

