"use client";
import { useState, useEffect } from "react";
import MoneyRain from "@/components/MoneyRain";

export default function HeroEffects() {
  const [showMoneyRain, setShowMoneyRain] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowMoneyRain(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showMoneyRain && <MoneyRain duration={4000} />}

      {/* Animated Orbs Background */}
      <div className="animated-bg-orbs">
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(22,163,74,0.35)", top: "-10%", left: "-5%", "--orb-duration": "28s", "--orb-delay": "0s" }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(34,197,94,0.25)", top: "20%", right: "-8%", "--orb-duration": "32s", "--orb-delay": "3s" }} />
        <div className="orb" style={{ width: 350, height: 350, background: "rgba(22,163,74,0.20)", bottom: "10%", left: "15%", "--orb-duration": "25s", "--orb-delay": "5s" }} />
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(74,222,128,0.25)", top: "50%", left: "50%", "--orb-duration": "35s", "--orb-delay": "2s" }} />
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(22,163,74,0.15)", bottom: "-15%", right: "10%", "--orb-duration": "22s", "--orb-delay": "7s" }} />
      </div>
    </>
  );
}
