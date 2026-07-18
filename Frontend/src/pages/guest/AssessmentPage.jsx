import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { miscService } from '../../services/miscService';
import { useGuestStore } from '../../store/guestStore';
import { ArrowRight, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setGuestData = useGuestStore((state) => state.setGuestData);
  
  const [answers, setAnswers] = useState({
    goal: '',
    currentLevel: '',
    interests: []
  });

  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleInterestToggle = (interest) => {
    setAnswers(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateRoadmap = async () => {
    if (!answers.goal || !answers.currentLevel || answers.interests.length === 0) {
      toast.error("Please answer all questions");
      return;
    }
    
    console.log("Generating roadmap...");
    setLoading(true);
    try {
      const response = await miscService.guestAssessment(answers);
      const roadmapData = response.data?.data?.roadmap;
      setGeneratedRoadmap(roadmapData);
      setStep(4); // Results step
    } catch (error) {
      toast.error("Failed to generate roadmap. Using fallback.");
      // Fallback for demo if backend fails
      setGeneratedRoadmap({
        title: "Your Custom Tech Path",
        description: "A tailored roadmap based on your selected interests and goals.",
        modules: [
          { title: "Foundations of " + answers.goal, description: "Getting started with core concepts." },
          { title: "Building Projects", description: "Applying your knowledge practically." }
        ]
      });
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const finishAssessment = () => {
    setGuestData(answers, generatedRoadmap);
    navigate('/dashboard');
  };

  if (step === 4 && generatedRoadmap) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white py-16 px-4 relative overflow-hidden font-sans w-full">
        
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center mb-20 relative z-10 mt-8">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            Your AI Roadmap is Ready
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
            {generatedRoadmap.title}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {generatedRoadmap.description}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" onClick={finishAssessment} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              Create Free Account
            </Link>
            <button onClick={finishAssessment} className="bg-transparent border border-gray-600 hover:border-gray-400 hover:text-white text-gray-300 font-medium py-3 px-8 rounded-full transition-colors">
              Continue as Guest
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 pb-20">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/80 via-blue-900/40 to-transparent transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

          {generatedRoadmap.modules?.map((m, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className={`relative flex items-center justify-between md:justify-normal w-full mb-16 ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                
                {/* Empty side for desktop */}
                <div className="hidden md:block w-1/2"></div>
                
                {/* Glowing Node */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 w-12 h-12 rounded-full border-2 border-blue-500 bg-[#0B1120] shadow-[0_0_20px_rgba(59,130,246,0.8)] text-blue-400 font-bold text-sm">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                
                {/* Content Card */}
                <div className={`w-full ml-20 md:ml-0 md:w-5/12 ${isLeft ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 shadow-xl flex flex-col sm:flex-row gap-6 group">
                     
                     {/* Thumbnail */}
                     <div className="w-24 h-28 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex-shrink-0 flex flex-col items-center justify-center border border-gray-700/50 group-hover:border-blue-500/30 transition-colors relative overflow-hidden">
                       <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                       <span className="text-3xl mb-1 font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600">
                         {m.title.substring(0, 2).toUpperCase()}
                       </span>
                       <span className="text-[10px] text-gray-500 font-medium tracking-wider">MODULE</span>
                     </div>
                     
                     <div className="flex-1 flex flex-col">
                       <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{m.title}</h3>
                       <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-1">{m.description}</p>
                       
                       <div>
                         <button onClick={finishAssessment} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-6 rounded-full transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_15px_rgba(37,99,235,0.6)]">
                           Enroll Now
                         </button>
                       </div>
                     </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl gh-box bg-white overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-[#E5E7EB]">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#24292F] mb-6">What is your primary goal?</h2>
              <div className="space-y-3">
                {['Become a Frontend Developer', 'Become a Backend Developer', 'Learn AI & Machine Learning', 'Improve existing skills'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => { setAnswers({ ...answers, goal }); handleNext(); }}
                    className={`w-full text-left p-4 rounded-md border transition-all ${answers.goal === goal ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-[#D0D7DE] hover:border-[#8C959F] bg-white'}`}
                  >
                    <span className="font-medium text-[#24292F]">{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={handlePrev} className="text-[#57606A] hover:text-[#24292F] mb-4 flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4"/> Back</button>
              <h2 className="text-2xl font-bold text-[#24292F] mb-6">What is your current level?</h2>
              <div className="space-y-3">
                {[
                  { level: 'Beginner', desc: 'I have little to no programming experience.' },
                  { level: 'Intermediate', desc: 'I can write code but want to build real projects.' },
                  { level: 'Advanced', desc: 'I want to master complex architectural concepts.' }
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => { setAnswers({ ...answers, currentLevel: item.level }); handleNext(); }}
                    className={`w-full text-left p-4 rounded-md border transition-all ${answers.currentLevel === item.level ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-[#D0D7DE] hover:border-[#8C959F] bg-white'}`}
                  >
                    <span className="font-medium text-[#24292F] block mb-1">{item.level}</span>
                    <span className="text-sm text-[#57606A] block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={handlePrev} className="text-[#57606A] hover:text-[#24292F] mb-4 flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4"/> Back</button>
              <h2 className="text-2xl font-bold text-[#24292F] mb-2">Select your interests</h2>
              <p className="text-[#57606A] mb-6 text-sm">Choose at least one topic to help AI generate your roadmap.</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {['React', 'Node.js', 'Python', 'Machine Learning', 'DevOps', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker'].map((interest) => {
                  const isSelected = answers.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                        ${isSelected ? 'bg-[#24292F] text-white border-[#24292F]' : 'bg-white text-[#24292F] border-[#D0D7DE] hover:border-[#8C959F]'}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={generateRoadmap}
                disabled={loading || answers.interests.length === 0}
                className="btn btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Roadmap...</> : 'Generate My Roadmap'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
