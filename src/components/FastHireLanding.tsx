/**
 * FastHireLanding.tsx
 * A responsive landing page component for the AI Resume Builder 'Fast Hire'.
 * Features a hero section with animated resume score gauge and feature badges.
 */

import React, { useState, useEffect, useRef } from 'react';

// --- Types ---
interface HeaderProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

interface ResumeGaugeProps {
  percentage: number;
}

export interface GuestInfo {
  name: string;
  email: string;
}

interface FastHireLandingProps {
  onGuestEntry?: (guestInfo: GuestInfo) => void;
  onSignIn?: () => void;
}

interface FeatureBadgeProps {
  label: string;
  positionClasses: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  z: number;
}

// --- Utility Components and Functions ---

// Inline SVG for the 'L' Logo (simplified placeholder)
const LogoSVG = () => (
  <svg className="w-6 h-6 text-[#2B6EF6]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
    <path d="M12 7l-5 5h3v4h4v-4h3l-5-5z" fill="#2B6EF6"/>
  </svg>
);

// Inline Check Icon for feature badges
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#10B981"/>
    <path d="M8 12.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Component: Header ---
const Header = ({ onGetStarted, onSignIn }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'AI Agent', href: '#ai-agent' },
    { name: 'Resume AI', href: '#resume-ai' },
    { name: 'About Us', href: '#about-us' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <LogoSVG />
            <a href="#" className="text-xl font-bold tracking-tight text-[#0F1724]" aria-label="Fast Hire Home">
              Fast Hire
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-sm font-medium text-[#6B7280] hover:text-[#0F1724] transition duration-150 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B6EF6]"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={onSignIn}
              className="text-sm font-medium text-[#0F1724] hover:text-[#2B6EF6] transition duration-150 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B6EF6]"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2B6EF6] rounded-full hover:bg-blue-700 transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-[#2B6EF6] focus:ring-offset-2"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#0F1724] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B6EF6]"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#0F1724] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2B6EF6]"
              role="menuitem"
            >
              {item.name}
            </a>
          ))}
          <button 
            onClick={() => { onSignIn(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#0F1724] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2B6EF6]"
            role="menuitem"
          >
            Sign In
          </button>
          <button 
            onClick={() => { onGetStarted(); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-[#2B6EF6] hover:bg-blue-700 transition duration-150 mt-2 focus:outline-none focus:ring-2 focus:ring-[#2B6EF6]"
            role="menuitem"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

// --- Component: Resume Gauge SVG ---
const ResumeGauge = ({ percentage }: ResumeGaugeProps) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const [strokeOffset, setStrokeOffset] = useState(circumference);
  const targetOffset = circumference - (percentage / 100) * circumference;
  const gaugeRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setStrokeOffset(targetOffset);
  }, [percentage, targetOffset]);

  return (
    <div className="relative w-[150px] h-[150px] flex flex-col items-center justify-center">
      <svg 
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 140 140"
        role="img" 
        aria-labelledby="gaugeTitle gaugeDesc"
      >
        <title id="gaugeTitle">Resume Score Gauge</title>
        <desc id="gaugeDesc">Shows a resume optimization score of 96 percent, rated as Excellent.</desc>
        
        {/* Background circle */}
        <circle
          cx="70" cy="70" r={radius}
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="transparent"
        />
        
        {/* Foreground circle (Animated) */}
        <circle
          ref={gaugeRef}
          cx="70" cy="70" r={radius}
          stroke="#10B981"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{ transition: 'stroke-dashoffset 2s ease-out' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-[#0F1724]">{percentage}%</span>
        <span className="text-sm font-semibold text-[#10B981]">Excellent</span>
      </div>
    </div>
  );
};

// --- Component: Resume Mockup ---
const ResumeMockup = () => {
    const Card = ({ children, className, z }: CardProps) => (
        <div 
            className={`absolute w-full max-w-sm lg:max-w-md bg-white p-4 rounded-xl shadow-2xl transition-transform duration-500 hover:scale-[1.02] ${className}`}
            style={{ zIndex: z, transform: `translate(0px, 0px)` }}
        >
            {children}
        </div>
    );

    const FeatureBadge = ({ label, positionClasses }: FeatureBadgeProps) => (
        <div 
            className={`absolute p-2 pl-3 flex items-center space-x-2 bg-white rounded-full shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105 group ${positionClasses}`}
            aria-label={`Feature: ${label}`}
        >
            <CheckIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-semibold text-[#0F1724] whitespace-nowrap">{label}</span>
        </div>
    );

    // Mockup content for the front card
    const frontCardContent = (
        <>
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500 flex-shrink-0" aria-label="Profile Photo Placeholder">
                    AS
                </div>
                <div>
                    <p className="text-sm font-bold text-[#0F1724]">Aman Sharma</p>
                    <p className="text-xs text-gray-500">Haryana, India | +91 9876543210</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
                <div className="h-2 bg-gray-200 rounded w-4/6"></div>
            </div>
        </>
    );

    // Mockup content for the second card (behind)
    const middleCardContent = (
        <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-1">
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-11/12"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-2/4 mt-4"></div>
            <div className="space-y-1">
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
        </div>
    );

    return (
        <div className="relative flex justify-center items-center w-full h-[500px] lg:h-full py-12">
            {/* Resume Cards Stack */}
            <div className="relative w-full max-w-md mx-auto h-full flex justify-center items-center lg:scale-110 xl:scale-125 transition-transform duration-500">
                
                {/* Third Card (Deepest) */}
                <Card className="rotate-3 -translate-y-10 translate-x-12 opacity-50 shadow-lg" z={1}>
                    <div className="h-32 bg-gray-100 rounded-lg"></div>
                </Card>
                
                {/* Second Card (Middle) */}
                <Card className="-rotate-3 translate-y-2 translate-x-0 opacity-80 shadow-xl" z={2}>
                    {middleCardContent}
                </Card>
                
                {/* First Card (Front) */}
                <Card className="rotate-0 translate-y-0 translate-x-0 !p-6" z={3}>
                    {frontCardContent}
                </Card>

                {/* Gauge Positioned */}
                <div className="absolute -left-16 top-16 z-10 p-2 bg-white rounded-full shadow-2xl border-4 border-white">
                    <ResumeGauge percentage={96} />
                </div>
            </div>
            
            {/* Floating Feature Badges */}
            <FeatureBadge label="Smart Resume Optimization" positionClasses="top-5 left-1/4 translate-x-full lg:left-full lg:-translate-x-1/2" />
            <FeatureBadge label="Keyword Optimization" positionClasses="bottom-5 right-1/4 -translate-x-full lg:right-full lg:translate-x-1/2" />
            <FeatureBadge label="Professional Templates" positionClasses="top-1/2 -left-4 -translate-y-1/2 lg:-left-20" />
        </div>
    );
};

// --- Component: Hero Section ---
const Hero = ({ onGetStarted, onSignIn }: HeaderProps) => (
  <section className="pt-24 lg:pt-36 relative overflow-hidden bg-gradient-to-b from-[#EAF2FF] to-[#F8FBFF] min-h-[85vh]">
    {/* Subtle Background Shapes */}
    <svg 
      className="absolute top-0 w-full h-full opacity-50 z-0 hidden lg:block"
      viewBox="0 0 1440 800"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M-60 180c400-100 800-100 1200 0s800 100 1200 0V0H-60v180z" fill="url(#paint0_linear_fast_hire)"/>
      <path d="M-60 600c400-100 800-100 1200 0s800 100 1200 0V400H-60v200z" fill="url(#paint1_linear_fast_hire)"/>
      <defs>
        <linearGradient id="paint0_linear_fast_hire" x1="1200" y1="0" x2="1200" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDEEFF"/>
          <stop offset="1" stopColor="#EAF2FF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_fast_hire" x1="1200" y1="400" x2="1200" y2="600" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDEEFF"/>
          <stop offset="1" stopColor="#F8FBFF" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
        {/* Text Content and CTAs */}
        <div className="lg:col-span-6 text-center lg:text-left py-12 lg:py-0">
          <div className="flex justify-center lg:justify-start mb-6">
            <LogoSVG />
          </div>

          <h1 
            className="font-serif text-5xl sm:text-6xl lg:text-[70px] leading-tight font-extrabold text-[#0F1724] mb-6 animate-fadeInUp"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Land More Offers With AI Resume Builder
          </h1>

          <p className="text-xl text-[#6B7280] mb-10 max-w-lg mx-auto lg:mx-0 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Instantly refine your resume and stand out for any role with our AI-assisted resume editor.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={onGetStarted}
              className="px-8 py-3 w-full sm:w-auto text-lg font-semibold text-white bg-[#2B6EF6] rounded-full hover:bg-blue-700 transition duration-300 shadow-xl shadow-[#2B6EF6]/30 focus:outline-none focus:ring-4 focus:ring-[#2B6EF6]/50"
              aria-label="Start Building Your Resume Now"
            >
              Get Started Free
            </button>
            <button
              onClick={onSignIn}
              className="px-8 py-3 w-full sm:w-auto text-lg font-semibold text-[#2B6EF6] bg-transparent border-2 border-[#2B6EF6] rounded-full hover:bg-[#2B6EF6]/10 transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#2B6EF6]/50"
            >
              Sign In
            </button>
          </div>
        </div>
        
        {/* Resume Mockup Section */}
        <div className="lg:col-span-6 flex justify-center items-center py-12 lg:py-0">
          <ResumeMockup />
        </div>
      </div>
    </div>
  </section>
);

// --- Component: Simple Footer ---
const Footer = () => (
    <footer className="bg-white border-t border-gray-100 mt-16 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-[#6B7280]">
                &copy; {new Date().getFullYear()} Fast Hire. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
                <a href="#" className="text-xs text-[#6B7280] hover:text-[#2B6EF6]">Privacy</a>
                <span className="text-xs text-[#6B7280]">|</span>
                <a href="#" className="text-xs text-[#6B7280] hover:text-[#2B6EF6]">Terms</a>
            </div>
        </div>
    </footer>
);

// --- Component: Modal/Signup Section ---
interface SignupSectionProps {
    onGuestEntry: (guestInfo: GuestInfo) => void;
    onSignIn: () => void;
}

const SignupSection = ({ onGuestEntry, onSignIn }: SignupSectionProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim()) {
            onGuestEntry({ name: name.trim(), email: email.trim() });
        }
    };

    return (
        <section id="signup-section" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-gray-100 text-center">
                    <h2 className="text-3xl font-bold text-[#0F1724] mb-4">Start Your Job Search Today</h2>
                    <p className="text-[#6B7280] mb-8">
                        Enter your details to instantly access our AI Resume Builder — no account required!
                    </p>
                    
                    {/* Guest Entry Form */}
                    <form onSubmit={handleGuestSubmit} className="space-y-4 mb-6">
                        <input 
                            type="text" 
                            placeholder="Your Full Name"
                            aria-label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6EF6] focus:border-transparent transition"
                        />
                        <input 
                            type="email" 
                            placeholder="Your Email Address"
                            aria-label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B6EF6] focus:border-transparent transition"
                        />
                        <button
                            type="submit"
                            className="w-full px-6 py-3 text-lg font-semibold text-white bg-[#2B6EF6] rounded-full hover:bg-blue-700 transition duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-[#2B6EF6]/50"
                        >
                            Enter as Guest
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Sign In Option */}
                    <button
                        onClick={onSignIn}
                        className="w-full px-6 py-3 text-lg font-semibold text-[#2B6EF6] bg-transparent border-2 border-[#2B6EF6] rounded-full hover:bg-[#2B6EF6]/10 transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#2B6EF6]/50"
                    >
                        Sign In with Account
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        Have an account? Sign in to save your progress and access premium features.
                    </p>
                </div>
            </div>
        </section>
    );
};


// --- Main Component: FastHireLanding ---
const FastHireLanding = ({ onGuestEntry, onSignIn }: FastHireLandingProps) => {
    // Default handlers
    const scrollToSignup = () => {
        document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleGuestEntry = onGuestEntry || ((info: GuestInfo) => console.log('Guest entry:', info));
    const handleSignIn = onSignIn || (() => console.log('Sign in clicked'));

    return (
        <div className="antialiased min-h-screen pt-16" style={{ fontFamily: 'Inter, sans-serif' }}>
            <style>{`
                /* Subtle CSS for the fade-in animation */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
            
            <Header onGetStarted={scrollToSignup} onSignIn={handleSignIn} />
            <main>
                <Hero onGetStarted={scrollToSignup} onSignIn={handleSignIn} />
                <SignupSection onGuestEntry={handleGuestEntry} onSignIn={handleSignIn} />
            </main>
            <Footer />
        </div>
    );
};

export default FastHireLanding;
