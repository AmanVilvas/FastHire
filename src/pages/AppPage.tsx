import FastHireApp from "@/components/app/FastHireApp";
import { useNavigate } from "react-router-dom";

const AppPage = () => {
  const navigate = useNavigate();

  const handlePromptSubmit = (prompt: string) => {
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

