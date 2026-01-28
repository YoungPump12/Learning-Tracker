import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const particlesRef = useRef(null);
  const glassRef = useRef(null);

  useEffect(() => {
    const particlesContainer = particlesRef.current;
    const colors = ["rgba(16, 185, 129, 0.3)", "rgba(52, 211, 153, 0.3)", "rgba(167, 243, 208, 0.3)"];

    const particles = [];
    if (particlesContainer) {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.width = `${Math.random() * 100 + 50}px`;
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        particlesContainer.appendChild(particle);
        particles.push(particle);
      }
    }

    const cards = Array.from(document.querySelectorAll(".feature"));
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
        }
      });
    }, observerOptions);
    cards.forEach((card) => observer.observe(card));

    let scrollTicking = false;
    const onScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const glass = glassRef.current;
          if (glass && scrollY < 500) {
            glass.style.transform = `translateY(${scrollY * 0.1}px)`;
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    let mouseTicking = false;
    const onMouseMove = (e) => {
      if (!mouseTicking) {
        window.requestAnimationFrame(() => {
          const cardsLocal = Array.from(document.querySelectorAll(".feature"));
          const mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
          const mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
          cardsLocal.forEach((card) => {
            card.style.transform = `translateY(${mouseY * 10}px) translateX(${mouseX * 10}px)`;
          });
          mouseTicking = false;
        });
        mouseTicking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div className="relative" style={{  background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", overflowX: "hidden", paddingBottom: "100px" }}>
      <div ref={particlesRef} id="particles-container" />

      <nav className="w-full bg-white/70 backdrop-blur-xl shadow-lg fixed top-0 left-0 z-50 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl pulse-slow">📘</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">Learning Tracker</span>
          </div>
          <div className="hidden sm:flex gap-8">
            <a href="#features" className="text-slate-600 hover:text-emerald-600 transition-all duration-300 font-medium hover:scale-105">Features</a>
            <a href="#start" className="text-slate-600 hover:text-emerald-600 transition-all duration-300 font-medium hover:scale-105">Get Started</a>
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-32 flex items-center justify-center p-6 relative">
        <div ref={glassRef} className="glass max-w-6xl w-full p-12 md:p-20 text-center">
          <div className="mb-12 floating-badge">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-full text-emerald-700 text-sm font-semibold shadow-lg">
              ✨ Your Journey to Mastery Starts Here
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Learning Tracker
          </h1>

          <p className="text-slate-600 text-xl md:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed font-light">
            Organize your learning. Track your progress. Stay consistent.
          </p>

          <p className="text-slate-500 text-base md:text-lg mb-16 max-w-2xl mx-auto">
            Transform the way you learn with intelligent tracking, beautiful analytics, and habit-building features that actually work.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-24" id="start">
            <Link to="/login" className="btn-glow px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-2xl relative text-center">
              Get Started Free
            </Link>
            <Link to="/register" className="btn-secondary px-10 py-4 border-2 border-slate-300 rounded-2xl text-lg font-bold hover:bg-slate-100 transition text-slate-700 text-center">
              Create Account
            </Link>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24">
            {[
              { icon: "📅", title: "Plan", text: "Schedule what you want to learn with intelligent daily planning and goal setting." },
              { icon: "📊", title: "Track", text: "See your progress with beautiful visuals, charts, and comprehensive analytics." },
              { icon: "🔥", title: "Stay Consistent", text: "Build daily learning habits with streaks, reminders, and motivation tools." },
              { icon: "🎯", title: "Set Goals", text: "Define clear objectives and milestones to keep your learning journey focused and purposeful." },
              { icon: "💡", title: "Get Insights", text: "Receive personalized recommendations and insights based on your learning patterns." },
              { icon: "🏆", title: "Earn Rewards", text: "Celebrate achievements with badges, certificates, and unlock new features as you progress." },
              { icon: "📚", title: "Resource Library", text: "Access curated learning materials, courses, and resources all in one organized place." },
              { icon: "⏰", title: "Smart Reminders", text: "Never miss a learning session with intelligent notifications tailored to your schedule." },
              { icon: "🤝", title: "Collaborate", text: "Connect with fellow learners, share progress, and stay motivated together on your journey." },
            ].map((item, idx) => (
              <div
                key={item.title}
                className={`feature bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200 slide-up stagger-${(idx % 3) + 1}`}
                style={{ opacity: 0, transform: "translateY(40px) scale(0.98)" }}
              >
                <div className="feature-icon text-6xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-2xl text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.6;
          animation: float-particle 20s infinite ease-in-out;
        }
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(100px, -100px) rotate(90deg); }
          50% { transform: translate(-50px, -200px) rotate(180deg); }
          75% { transform: translate(-150px, -100px) rotate(270deg); }
        }
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          animation: floatIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .glass::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
          animation: shimmer 4s infinite;
          transform: rotate(45deg);
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(60px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .feature {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .feature::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }
        .feature:hover::before { width: 300px; height: 300px; }
        .feature:hover { transform: translateY(-12px) scale(1.03); box-shadow: 0 25px 50px rgba(16,185,129,0.25); }
        .feature-icon { transition: all 0.4s ease; display: inline-block; }
        .feature:hover .feature-icon { transform: scale(1.2) rotate(5deg); }
        .btn-glow {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          z-index: 1;
          display: inline-block;
        }
        .btn-glow::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
          z-index: -1;
        }
        .btn-glow:hover::before { left: 100%; }
        .btn-glow:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 15px 40px rgba(16,185,129,0.5); }
        .btn-secondary { position: relative; overflow: hidden; transition: all 0.3s ease; display: inline-block; }
        .btn-secondary::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .btn-secondary:hover::after { opacity: 1; }
        .btn-secondary:hover { transform: translateY(-2px); border-color: rgba(16,185,129,0.5); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .pulse-slow { animation: pulse 3s ease-in-out infinite; }
        h1 {
          background: linear-gradient(135deg, #0f172a 0%, #334155 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          display: inline-block;
        }
        .text-gradient { background: linear-gradient(135deg, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes float-badge { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .floating-badge { animation: float-badge 3s ease-in-out infinite; }
        .stagger-1 { animation-delay: 0.2s; }
        .stagger-2 { animation-delay: 0.4s; }
        .stagger-3 { animation-delay: 0.6s; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; opacity: 0; }
      `}</style>
    </div>
  );
}