import FastHireLanding, { type GuestInfo } from "@/components/FastHireLanding";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGuestEntry = (guestInfo: GuestInfo) => {
    const params = new URLSearchParams({
      name: guestInfo.name,
      email: guestInfo.email,
    });
    navigate(`/guest?${params.toString()}`);
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return <FastHireLanding onGuestEntry={handleGuestEntry} onSignIn={handleSignIn} />;
};

export default Home;

