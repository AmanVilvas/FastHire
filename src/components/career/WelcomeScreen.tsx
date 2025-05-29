import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Target, Shield, Sparkles, Send, User, Code, Smartphone, Briefcase, Palette } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface WelcomeScreenProps {
  onGetStarted: (prompt: string) => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const [prompt, setPrompt] = useState("");
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  const recommendations = [
    { icon: Code, label: "Software Developer", prompt: "I want to create a resume for a Software Developer position" },
    { icon: Smartphone, label: "App Developer", prompt: "I want to create a resume for a Mobile App Developer role" },
    { icon: Briefcase, label: "Product Manager", prompt: "I want to create a resume for a Product Manager position" },
    { icon: Palette, label: "UI/UX Designer", prompt: "I want to create a resume for a UI/UX Designer role" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGetStarted(prompt);
    }
  };

  const handleRecommendationClick = (recommendationPrompt: string) => {
    setPrompt(recommendationPrompt);
  };

  const handleSupportAndContinue = () => {
    // Implementation of handleSupportAndContinue
  };

  const handleJustContinue = () => {
    // Implementation of handleJustContinue
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-16">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Build something <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">career&#8209;winning</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
          Resume to job offer in seconds, with FastHire
        </p>
        
        {/* Recommendation Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {recommendations.map((rec, index) => (
            <Button
              key={index}
              onClick={() => handleRecommendationClick(rec.prompt)}
              variant="outline"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 hover:border-blue-400/50 transition-all duration-200"
            >
              <rec.icon className="h-4 w-4 mr-2" />
              {rec.label}
            </Button>
          ))}
        </div>

        {/* Type Bar */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-8">
          <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:border-blue-400/50 transition-all duration-200">
            <div className="flex items-center gap-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask FastHire to create a resume for specific role..."
                className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  Attach
                </Button>
                <Button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feature Tags */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">ATS-Optimized</span>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">AI-Powered</span>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">Professional</span>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">Instant Results</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg inline-block mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Questions</h3>
            <p className="text-gray-300 text-sm">
              Targeted questions to understand your experience and career goals
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg inline-block mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Resume</h3>
            <p className="text-gray-300 text-sm">
              Generate professional, ATS-friendly resumes in seconds
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg inline-block mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom Cover Letter</h3>
            <p className="text-gray-300 text-sm">
              Personalized cover letters that connect with your target role
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="text-center bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-auto">
          <DialogHeader>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">💸</span>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Support FastHire?
              </DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-gray-600 text-base mb-6">
            If you'd like to support us, you can gift a small amount.<br />
            Otherwise, just continue for free.
          </p>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleSupportAndContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              <span className="mr-2">💸</span> Gift & Continue
            </Button>
            <Button
              variant="outline"
              onClick={handleJustContinue}
              className="w-full border-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Just Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomeScreen;
