import { useState } from "react";
import FastHireLanding, { GuestInfo } from "@/components/FastHireLanding";
import CareerMate from "@/components/CareerMate";
import GuestCareerMate from "@/components/GuestCareerMate";
import FastHireApp from "@/components/app/FastHireApp";

type AppMode = "landing" | "guest" | "auth" | "app" | "form";

const Index = () => {
  // Start directly with the new app UI
  const [mode, setMode] = useState<AppMode>("app");
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [initialPrompt, setInitialPrompt] = useState("");

  // Handle guest entry - just take name/email and go to app
  const handleGuestEntry = (info: GuestInfo) => {
    setGuestInfo(info);
    setMode("guest");
  };

  // Handle sign in - redirect to auth flow
  const handleSignIn = () => {
    setMode("auth");
  };

  // Back to landing page
  const handleBackToLanding = () => {
    setMode("landing");
    setGuestInfo(null);
    setInitialPrompt("");
  };

  // Handle prompt submission - redirect to form with prompt
  const handlePromptSubmit = (prompt: string, file?: File) => {
    console.log("Prompt submitted:", prompt);
    if (file) {
      console.log("File uploaded:", file.name);
    }
    setInitialPrompt(prompt);
    // Create a default guest info and go to form
    setGuestInfo({ name: "Guest User", email: "guest@fasthire.com" });
    setMode("form");
  };

  // Show the new Leonardo-style app UI
  if (mode === "app") {
    return (
      <FastHireApp
        guestName="Guest"
        onPromptSubmit={handlePromptSubmit}
        onBackToLanding={() => setMode("landing")}
      />
    );
  }

  // Show form flow (after prompt submission)
  if (mode === "form" && guestInfo) {
    return (
      <GuestCareerMate 
        guestInfo={guestInfo} 
        onBackToLanding={handleBackToLanding}
        initialPrompt={initialPrompt}
        skipWelcome={true}
      />
    );
  }

  // Show guest app (no auth required)
  if (mode === "guest" && guestInfo) {
    return <GuestCareerMate guestInfo={guestInfo} onBackToLanding={handleBackToLanding} />;
  }

  // Show authenticated app (with auth)
  if (mode === "auth") {
    return <CareerMate />;
  }

  // Show landing page
  return (
    <FastHireLanding 
      onGuestEntry={handleGuestEntry} 
      onSignIn={handleSignIn} 
    />
  );
};

export default Index;
