import { Routes, Route, useNavigate } from "react-router-dom";

export default function ChooseCharacter() {
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
                <h1 className="text-8xl font-bold font-title mb-3">
                 Invincibot
                </h1>
                <p className="font-title text-3xl mb-90 font-light">Choose Your Character</p>
                <button
                  onClick={() => navigate("/choosecharacter")}
                  className="cursor-pointer bg-blue-500 text-yellow-200 text-xl px-6 py-2 rounded hover:bg-blue-600 hover:shadow-[0_0_30px_10px_#3b82f6] transition-shadow duration-300"
                >
                  Let's Get Started
                </button>
              </div>
            </div>
            }
          />
          <Route path="/choosecharacter" element={<ChooseCharacter />} />
        </Routes>

    </>
  );
}