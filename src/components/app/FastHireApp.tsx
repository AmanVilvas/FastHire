import { useState, useRef } from "react";
import { FileText, Upload, Sparkles, Send, Paperclip, X, Home } from "lucide-react";
import DonateModal from "./DonateModal";

interface FastHireAppProps {
  guestName?: string;
  onPromptSubmit: (prompt: string, file?: File) => void;
  onBackToLanding?: () => void;
}

// Quick tabs / job profiles - short 5-10 word prompts
const quickTabs = [
  { label: "SDE", prompt: "Create a Software Developer resume" },
  { label: "QA Tester", prompt: "Build a QA Tester resume" },
  { label: "Teacher", prompt: "Make a Teacher resume" },
  { label: "Data Scientist", prompt: "Generate a Data Scientist resume" },
  { label: "Product Manager", prompt: "Create a Product Manager resume" },
  { label: "UX Designer", prompt: "Design a UX Designer resume" },
  { label: "DevOps", prompt: "Build a DevOps Engineer resume" },
  { label: "Marketing", prompt: "Create a Marketing Manager resume" },
];

const FastHireApp = ({ guestName, onPromptSubmit, onBackToLanding }: FastHireAppProps) => {
  const [prompt, setPrompt] = useState("");
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim(), uploadedFile || undefined);
      setPrompt("");
      setUploadedFile(null);
      setActiveTab(null);
    }
  };

  const handleTabClick = (tab: typeof quickTabs[0]) => {
    setPrompt(tab.prompt);
    setActiveTab(tab.label);
    // Focus on input after selecting a tab
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!prompt.trim()) {
        setPrompt("Improve and update my resume");
      }
      // Focus on input after uploading
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <Home className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Fast Hire
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {guestName && (
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-medium text-gray-800">{guestName}</span>
              </span>
            )}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border-2 border-blue-500 text-blue-600 font-medium hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-lg">💝</span>
              Donate
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 pb-40">
        {/* Hero Section */}
        <div className="text-center mb-10">
          {/* Glowing star icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-400/40 blur-2xl rounded-full scale-150" />
            <div className="relative">
              <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
          </div>
          
          <p className="text-gray-500 text-lg mb-2">Welcome to Fast Hire</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
            How can I help?
          </h1>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full mb-8">
          {/* Generate Resume Card */}
          <button
            onClick={() => {
              setPrompt("Create a professional resume for ");
              setTimeout(() => textInputRef.current?.focus(), 100);
            }}
            className="group relative p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 hover:border-blue-200 shadow-lg shadow-blue-100/20 hover:shadow-xl hover:shadow-blue-100/30 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Generate Resume</h3>
                <p className="text-sm text-gray-500">Describe the resume you want</p>
              </div>
            </div>
          </button>

          {/* Upload Resume Card */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 hover:border-blue-200 shadow-lg shadow-blue-100/20 hover:shadow-xl hover:shadow-blue-100/30 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Upload Resume</h3>
                <p className="text-sm text-gray-500">PDF or DOCX format</p>
              </div>
            </div>
          </button>

          {/* Quick Templates Card */}
          <button
            onClick={() => {
              setPrompt("Create a professional ATS-friendly resume");
              setTimeout(() => textInputRef.current?.focus(), 100);
            }}
            className="group relative p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 hover:border-blue-200 shadow-lg shadow-blue-100/20 hover:shadow-xl hover:shadow-blue-100/30 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Quick Templates</h3>
                <p className="text-sm text-gray-500">Tap to auto-fill a prompt</p>
              </div>
            </div>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Quick Tabs */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mb-4">
          {quickTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab)}
              className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all duration-300 ${
                activeTab === tab.label
                  ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/60 backdrop-blur-sm border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </main>

      {/* Fixed Bottom Prompt Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          {/* Uploaded File Badge */}
          {uploadedFile && (
            <div className="flex items-center gap-2 mb-3 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">{uploadedFile.name}</span>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-xl shadow-blue-100/30 overflow-hidden focus-within:border-blue-400 transition-colors">
              <div className="flex items-center gap-3 p-3 sm:p-4">
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all duration-200"
                  title="Upload your previous resume"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <input
                  ref={textInputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your prompt here... (e.g., Create a Software Developer resume)"
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base sm:text-lg outline-none min-w-0"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    prompt.trim()
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
          
          {/* Subtle hint */}
          <p className="text-center text-xs text-gray-400 mt-3">
            Press Enter to send • Click 📎 to upload your existing resume
          </p>
        </div>
      </div>

      {/* Donate Modal */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
};

export default FastHireApp;
