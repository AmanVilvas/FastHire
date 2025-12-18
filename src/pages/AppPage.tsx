import FastHireApp from "@/components/app/FastHireApp";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { extractResumeText } from "@/utils/resume/extractResumeText";
import { parseResumeToUserData } from "@/utils/resume/parseResumeToUserData";
import { geminiExtractUserData } from "@/utils/resume/geminiExtractUserData";

const AppPage = () => {
  const navigate = useNavigate();

  const handlePromptSubmit = async (prompt: string, file?: File) => {
    if (file) {
      try {
        toast.message("Reading your resume…");
        const text = await extractResumeText(file);
        let parsed;
        try {
          toast.message("Extracting details with AI…");
          parsed = await geminiExtractUserData(text);
        } catch (e) {
          // Fallback to local heuristics if AI function isn't available
          parsed = parseResumeToUserData(text);
        }
        sessionStorage.setItem("fh_resume_prefill_v1", JSON.stringify(parsed));
        toast.success("Resume details extracted. You can edit anything.");
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Could not read that resume file.");
        sessionStorage.removeItem("fh_resume_prefill_v1");
      }
    } else {
      sessionStorage.removeItem("fh_resume_prefill_v1");
    }

    const params = new URLSearchParams({
      name: "Guest User",
      email: "guest@fasthire.com",
      prompt,
      skipWelcome: "1",
    });
    navigate(`/guest?${params.toString()}`);
  };

  return (
    <FastHireApp
      guestName="Guest"
      onPromptSubmit={handlePromptSubmit}
      onBackToLanding={() => navigate("/")}
    />
  );
};

export default AppPage;

