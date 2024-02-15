import React, { useState } from 'react';
import GameBoard from './GameBoard';
import GameBoardES from './GameBoardES'; // Import the Spanish GameBoard
import GameBoardFR from './GameBoardFR';
import NavBar from './NavBar';

function App() {
  const [language, setLanguage] = useState('EN'); // Initialize with 'EN' for English

  // Update the toggle function to cycle through 'EN', 'FR', and 'ES'
  const toggleGameBoardLanguage = () => {
    setLanguage((prevLanguage) => {
      if (prevLanguage === 'EN') return 'FR';
      if (prevLanguage === 'FR') return 'ES';
      return 'EN'; // Default back to English if it's not 'EN' or 'FR'
    });
  };

  return (
    <div className="App">
      <NavBar toggleGameBoards={toggleGameBoardLanguage} />
      {language === 'EN' && <GameBoard />}
      {language === 'FR' && <GameBoardFR />}
      {language === 'ES' && <GameBoardES />}
    </div>
  );
}

export default App;

