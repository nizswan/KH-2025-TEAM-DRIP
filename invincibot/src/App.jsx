import { useState } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import ChooseCharacter from "./pages/ChooseCharacter.jsx";
import viteLogo from '/vite.svg'


function App() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center h-screen text-center">
              <h1 className="text-3xl font-bold mb-6">Welcome to Invincibot</h1>
              <button
                onClick={() => navigate("/choose")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Choose Your Character
              </button>
            </div>
          }
        />
        <Route path="/Choose" element={<ChooseCharacter />} />
      </Routes>
    </>
  );
}
export default App;