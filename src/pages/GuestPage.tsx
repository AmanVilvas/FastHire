import GuestCareerMate from "@/components/GuestCareerMate";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { UserData } from "@/types/userData";

const GuestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const guestInfo = useMemo(() => {
    const name = searchParams.get("name") || "Guest User";
    const email = searchParams.get("email") || "guest@fasthire.com";
    return { name, email };
  }, [searchParams]);

  const initialPrompt = searchParams.get("prompt") || "";
  const skipWelcomeParam = (searchParams.get("skipWelcome") || "").toLowerCase();
  const skipWelcome = skipWelcomeParam === "1" || skipWelcomeParam === "true" || skipWelcomeParam === "yes";

  const resumePrefill = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("fh_resume_prefill_v1");
      if (!raw) return undefined;
      return JSON.parse(raw) as Partial<UserData>;
    } catch {
      return undefined;
    }
  }, []);

  return (
    <GuestCareerMate
      guestInfo={guestInfo}
      onBackToLanding={() => navigate("/")}
      initialPrompt={initialPrompt}
      skipWelcome={skipWelcome}
      resumePrefill={resumePrefill}
    />
  );
};

export default GuestPage;

