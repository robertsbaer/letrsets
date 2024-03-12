import React, { useEffect, useState } from "react";
import GameBoardEN from "./GameBoardEN";
import GameBoardES from "./GameBoardES";
import GameBoardFR from "./GameBoardFR";
import GameBoardPT from "./GameBoardPT";
import GameBoardTR from "./GameBoardTR";
import NavBar from "./NavBar";

import ReactGA from "react-ga4";

const TRACKING_ID = "G-CHSVPT0K7L";
ReactGA.initialize(TRACKING_ID);

function App() {
  const [language, setLanguage] = useState("EN"); // Default to EN initially

  useEffect(() => {
    // Directly reset language to English on every reload
    setLanguage("EN");
    localStorage.setItem("gameLanguage", "EN");
    // Optionally, reset other game settings as needed
    // For example, resetting game progress, scores, etc.
  }, []);

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
  }, []);

  const toggleGameBoardLanguage = () => {
    setLanguage((prevLanguage) => {
      let newLanguage = "EN"; // Default to English if no match found
      if (prevLanguage === "EN") {
        newLanguage = "FR";
      } else if (prevLanguage === "FR") {
        newLanguage = "ES";
      } else if (prevLanguage === "ES") {
        newLanguage = "PT";
      } else if (prevLanguage === "PT") {
        newLanguage = "TR";
      } else if (prevLanguage === "TR") {
        newLanguage = "EN";
      }

      localStorage.setItem("gameLanguage", newLanguage);
      return newLanguage;
    });
  };

  return (
    <div className="App">
      <NavBar toggleGameBoards={toggleGameBoardLanguage} />
      {language === "EN" && <GameBoardEN />}
      {language === "FR" && <GameBoardFR />}
      {language === "ES" && <GameBoardES />}
      {language === "PT" && <GameBoardPT />}
      {language === "TR" && <GameBoardTR />}
    </div>
  );
}

export default App;
