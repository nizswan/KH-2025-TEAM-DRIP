import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import invincibleImg from "../assets/img/Invincible.png";
import SamanthaImg from "../assets/img/Samantha.png";
import OmniManImg from "../assets/img/OmniMan.png";

export default function ChooseCharacter() {
  const navigate = useNavigate();

  const characters = [
    { name: "Invincible", image: invincibleImg },
    { name: "Samantha", image: SamanthaImg },
    { name: "OmniMan", image: OmniManImg },
  ];

  const [currentIndex, setCurrentIndex] = useState(1); 

  const nextCharacter = () =>
    setCurrentIndex((i) => (i + 1) % characters.length);
  const prevCharacter = () =>
    setCurrentIndex((i) => (i - 1 + characters.length) % characters.length);

  const currentCharacter = characters[currentIndex];
  const prev = characters[(currentIndex - 1 + characters.length) % characters.length];
  const next = characters[(currentIndex + 1) % characters.length];

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative h-screen w-full bg-[url('assets/img/Choose-Your-Character.jpg')] bg-cover bg-center">
              {/* Black overlay */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Content above overlay */}
              <div className="relative flex flex-col items-center justify-start h-full pt-6 text-center text-white">
                <h1 className="text-8xl font-bold font-title mb-3">Invincibot</h1>
                <p className="font-title text-3xl mb-10 font-light text-white ">
                  Choose Your Character
                </p>

                <div className="carousel flex items-center justify-center gap-6">
                  <button className="nav-btn text-4xl" onClick={prevCharacter}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="107" height="107" viewBox="0 0 107 107" fill="none">
                      <path d="M84.7084 53.5H22.2917M22.2917 53.5L53.5001 84.7083M22.2917 53.5L53.5001 22.2917" stroke="white" stroke-opacity="0.8" stroke-width="8.91667" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>

                  {/* Left Character */}
          <div className="opacity-60 scale-75 transition-all duration-300">
            <img
              src={prev.image}
              alt={prev.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* Center Character */}
          <div className="flex flex-col items-center transition-all duration-300">
            <img
              src={currentCharacter.image}
              alt={currentCharacter.name}
              className="w-48 h-48 rounded-full border-4 border-white shadow-2xl object-cover "
                    />
                    <h2 className="character mt-4">{currentCharacter.name}</h2>
                  </div>

                  {/* Right Character */}
                  <div className="opacity-60 scale-75 transition-all duration-300">
                    <img
                      src={next.image}
                      alt={next.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>

                  <button className="nav-btn text-4xl" onClick={nextCharacter}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="106" height="106" viewBox="0 0 106 106" fill="none">
                      <path d="M22.0833 53H83.9166M83.9166 53L52.9999 22.0833M83.9166 53L52.9999 83.9167" stroke="#F5F5F5" stroke-width="8.83333" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => navigate("/Character/" + currentCharacter.name)}
                  className="mt-10 cursor-pointer bg-blue-500 text-yellow-200 text-xl px-6 py-2 rounded hover:bg-blue-600 hover:shadow-[0_0_30px_10px_#3b82f6] transition-shadow duration-300"
                >
                  Let&apos;s Get Started
                </button>
              </div>
            </div>
          }
        />
        <Route path="/Character/:name" element={<div>Character</div>} />
      </Routes>
    </>
  );
}
