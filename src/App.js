import React, { useState } from "react";
import GameBoard from "./GameBoard";
import GameBoardES from "./GameBoardES"; // Import the Spanish GameBoard
import GameBoardFR from "./GameBoardFR";
import NavBar from "./NavBar";

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("gameLanguage") || "EN"
  );
  // Update the toggle function to cycle through 'EN', 'FR', and 'ES'
  const toggleGameBoardLanguage = () => {
    setLanguage((prevLanguage) => {
      if (prevLanguage === "EN") {
        localStorage.setItem("gameLanguage", "FR");
        return "FR";
      }
      if (prevLanguage === "FR") {
        localStorage.setItem("gameLanguage", "ES");
        return "ES";
      }
      localStorage.setItem("gameLanguage", "EN");
      return "EN";
    });
  };

  return (
    <div className="App">
      <NavBar toggleGameBoards={toggleGameBoardLanguage} />
      {language === "EN" && <GameBoard />}
      {language === "FR" && <GameBoardFR />}
      {language === "ES" && <GameBoardES />}
    </div>
  );
}

export default App;
