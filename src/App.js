import React, { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import GameBoardES from "./GameBoardES";
import GameBoardFR from "./GameBoardFR";
import GameBoardPT from "./GameBoardPT";
import NavBar from "./NavBar";

function App() {
  const [language, setLanguage] = useState("EN"); // Default to EN initially

  useEffect(() => {
    // Directly reset language to English on every reload
    setLanguage("EN");
    localStorage.setItem("gameLanguage", "EN");
    // Optionally, reset other game settings as needed
    // For example, resetting game progress, scores, etc.
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
        newLanguage = "EN";
      }
      
      localStorage.setItem("gameLanguage", newLanguage);
      return newLanguage;
    });
  };

  return (
    <div className="App">
      <NavBar toggleGameBoards={toggleGameBoardLanguage} />
      {language === "EN" && <GameBoard />}
      {language === "FR" && <GameBoardFR />}
      {language === "ES" && <GameBoardES />}
      {language === "PT" && <GameBoardPT />}
    </div>
  );
}

export default App;
