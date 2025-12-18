import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowRight, User, Home } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FastHireApp from "./app/FastHireApp";
import UserInfoForm from "./career/UserInfoForm";
import ResumePreview from "./career/ResumePreview";
import CoverLetterPreview from "./career/CoverLetterPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { GuestInfo } from "./FastHireLanding";
import type { UserData } from "@/types/userData";
import { initialUserData } from "@/types/userData";
import { mergeUserData } from "@/utils/resume/mergeUserData";
import { extractResumeText } from "@/utils/resume/extractResumeText";
import { parseResumeToUserData } from "@/utils/resume/parseResumeToUserData";
import { toast } from "sonner";
import { geminiExtractUserData } from "@/utils/resume/geminiExtractUserData";

type Step = "welcome" | "form" | "resume" | "cover-letter";

interface GuestCareerMateProps {
  guestInfo: GuestInfo;
  onBackToLanding: () => void;
  initialPrompt?: string;
  skipWelcome?: boolean;
  resumePrefill?: Partial<UserData>;
}

const GuestCareerMate = ({ guestInfo, onBackToLanding, initialPrompt: propInitialPrompt, skipWelcome, resumePrefill }: GuestCareerMateProps) => {
  // Start at form if skipWelcome is true (coming from FastHireApp)
  const [currentStep, setCurrentStep] = useState<Step>(skipWelcome ? "form" : "welcome");
  const [userData, setUserData] = useState<UserData>(() => {
    // Pre-fill with guest info
    const nameParts = guestInfo.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const base: UserData = {
      ...initialUserData,
      personalInfo: {
        ...initialUserData.personalInfo,
        firstName,
        lastName,
        email: guestInfo.email,
      },
    };

    return mergeUserData(base, resumePrefill);
  });
  const [initialPrompt, setInitialPrompt] = useState(propInitialPrompt || "");
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<UserData | null>(null);

  const handleGetStarted = async (prompt: string, file?: File) => {
    setInitialPrompt(prompt);

    if (file) {
      try {
        toast.message("Reading your resume…");
        const text = await extractResumeText(file);
        let parsed;
        try {
          toast.message("Extracting details with AI…");
          parsed = await geminiExtractUserData(text);
        } catch (e) {
          parsed = parseResumeToUserData(text);
        }
        setUserData((prev) => mergeUserData(prev, parsed));
        toast.success("Personal info filled from resume. You can edit anything.");
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Could not read that resume file.");
      }
    }

    setCurrentStep("form");
  };

  const handleFormComplete = (data: UserData) => {
    setPendingUserData(data);
    setShowSupportDialog(true);
  };

  const handleSupportAndContinue = () => {
    setShowSupportDialog(false);
    window.open('https://razorpay.me/@amansharma6045', '_blank');
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

  // Show the new FastHireApp for the welcome screen
  if (currentStep === "welcome") {
    return (
      <FastHireApp
        guestName={guestInfo.name}
        onPromptSubmit={handleGetStarted}
        onBackToLanding={onBackToLanding}
      />
    );
  }

  // For other steps, show the form/resume/cover-letter flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Top Navigation */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={skipWelcome ? onBackToLanding : () => setCurrentStep("welcome")}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-800">Fast Hire</span>
            </button>
          </div>
          
          {/* Show the prompt that was submitted */}
          {initialPrompt && currentStep === "form" && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <span className="text-sm text-blue-600 font-medium">📝 {initialPrompt}</span>
            </div>
          )}

          {/* User Profile (Guest) */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-gray-800 text-sm font-medium">{guestInfo.name}</span>
              <span className="text-gray-500 text-xs">Guest</span>
            </div>
            <Button
              onClick={onBackToLanding}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100"
              title="Back to Home"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg shadow-blue-100/20">
            <div className={`flex items-center ${currentStep === "form" ? "text-blue-500" : "text-green-500"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === "form" ? "bg-blue-500" : "bg-green-500"}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Information</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === "resume" ? "text-blue-500" : currentStep === "cover-letter" ? "text-green-500" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === "resume" ? "bg-blue-500" : currentStep === "cover-letter" ? "bg-green-500" : "bg-gray-300"}`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Resume</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === "cover-letter" ? "text-blue-500" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === "cover-letter" ? "bg-blue-500" : "bg-gray-300"}`}>
                <Mail className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Cover Letter</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
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

export default GuestCareerMate;
