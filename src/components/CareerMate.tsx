import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle2, FileText, Mail, ArrowRight, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import AuthPage from "./auth/AuthPage";
import WelcomeScreen from "./career/WelcomeScreen";
import UserInfoForm from "./career/UserInfoForm";
import ResumePreview from "./career/ResumePreview";
import CoverLetterPreview from "./career/CoverLetterPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

export interface UserData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  targetJob: {
    title: string;
    company: string;
    industry: string;
    description: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  summary: string;
}

const initialUserData: UserData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolio: "",
  },
  targetJob: {
    title: "",
    company: "",
    industry: "",
    description: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  summary: "",
};

type Step = "welcome" | "form" | "resume" | "cover-letter";

const CareerMate = () => {
  const { user, session, loading, signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<UserData | null>(null);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show auth page if user is not authenticated
  if (!user || !session) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  const handleGetStarted = (prompt: string) => {
    setInitialPrompt(prompt);
    setCurrentStep("form");
  };

  const handleFormComplete = (data: UserData) => {
    setPendingUserData(data);
    setShowSupportDialog(true);
  };

  const handleSupportAndContinue = () => {
    setShowSupportDialog(false);
    window.open('https://razorpay.me/@amansharma6045', '_blank');
    // Optionally, proceed to resume after payment
    if (pendingUserData) {
      setUserData(pendingUserData);
      setCurrentStep("resume");
      setPendingUserData(null);
    }
  };

  const handleJustContinue = () => {
    setShowSupportDialog(false);
    if (pendingUserData) {
      setUserData(pendingUserData);
      setCurrentStep("resume");
      setPendingUserData(null);
    }
  };

  const handleViewCoverLetter = () => {
    setCurrentStep("cover-letter");
  };

  const handleBackToResume = () => {
    setCurrentStep("resume");
  };

  const handleEditInfo = () => {
    setCurrentStep("form");
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentStep("welcome");
    setUserData(initialUserData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Top Navigation */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Fugaz One', cursive" }}
            >
              FastHire
            </a>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-medium">{user.email}</span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        {currentStep !== "welcome" && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
              <div className={`flex items-center ${currentStep === "form" ? "text-blue-400" : "text-green-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === "form" ? "bg-blue-500" : "bg-green-500"}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-white">Information</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className={`flex items-center ${currentStep === "resume" ? "text-blue-400" : currentStep === "cover-letter" ? "text-green-400" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === "resume" ? "bg-blue-500" : currentStep === "cover-letter" ? "bg-green-500" : "bg-gray-600"}`}>
                  <FileText className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium text-white">Resume</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className={`flex items-center ${currentStep === "cover-letter" ? "text-blue-400" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === "cover-letter" ? "bg-blue-500" : "bg-gray-600"}`}>
                  <Mail className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium text-white">Cover Letter</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === "welcome" && (
            <WelcomeScreen onGetStarted={handleGetStarted} />
          )}
          
          {currentStep === "form" && (
            <UserInfoForm 
              initialData={userData} 
              onComplete={handleFormComplete}
              initialPrompt={initialPrompt}
            />
          )}
          
          {currentStep === "resume" && (
            <ResumePreview 
              userData={userData} 
              onViewCoverLetter={handleViewCoverLetter}
              onEditInfo={handleEditInfo}
            />
          )}
          
          {currentStep === "cover-letter" && (
            <CoverLetterPreview 
              userData={userData} 
              onBackToResume={handleBackToResume}
              onEditInfo={handleEditInfo}
            />
          )}
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
    </div>
  );
};

export default CareerMate;
