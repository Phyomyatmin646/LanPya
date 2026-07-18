import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Terminal } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      {/* Navbar Minimal */}
      <nav className="h-16 flex items-center px-6 lg:px-12 border-b border-[#D0D7DE] bg-white">
        <div className="flex items-center gap-2">
          <img src="/LanPya_logo.png" alt="LanPya" className="w-10 h-10 object-contain" />
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <div className="mb-8 p-3 bg-white border border-[#D0D7DE] rounded-full shadow-sm inline-flex items-center gap-2 text-sm font-medium text-[#57606A]">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          AI-Powered Developer Roadmaps
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#24292F] mb-6">
          Build your <span className="text-accent">future</span>
          <br />one commit at a time.
        </h1>
        
        <p className="text-xl text-[#57606A] mb-10 max-w-2xl font-light">
          LanPya analyzes your goals, current skill level, and interests to generate a personalized learning roadmap. Stop guessing. Start coding.
        </p>
        
        <Link 
          to="/assessment" 
          className="btn btn-primary text-lg px-8 py-4 h-auto inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          Start your journey <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-[#57606A] mt-4">Free forever. No credit card required.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          <div className="gh-box p-6 bg-white hover:border-accent transition-colors">
            <Terminal className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-semibold text-[#24292F] mb-2">Personalized Paths</h3>
            <p className="text-sm text-[#57606A]">AI crafts a unique learning path based on your exact goals and current knowledge.</p>
          </div>
          <div className="gh-box p-6 bg-white hover:border-[#1A7F37] transition-colors">
            <Code className="w-8 h-8 text-[#1A7F37] mb-4" />
            <h3 className="font-semibold text-[#24292F] mb-2">Practical Lessons</h3>
            <p className="text-sm text-[#57606A]">Learn through structured modules, interactive markdown, and direct code examples.</p>
          </div>
          <div className="gh-box p-6 bg-white hover:border-[#0969DA] transition-colors">
            <BookOpen className="w-8 h-8 text-[#0969DA] mb-4" />
            <h3 className="font-semibold text-[#24292F] mb-2">Progress Tracking</h3>
            <p className="text-sm text-[#57606A]">Track your completions, earn streaks, and build your developer profile.</p>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-sm text-[#57606A] border-t border-[#D0D7DE]">
        © {new Date().getFullYear()} LanPya Platform. All rights reserved.
      </footer>
    </div>
  );
}
