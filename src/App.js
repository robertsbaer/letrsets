import React, { useState } from 'react';
import GameBoard from './GameBoard';
import GameBoardFR from './GameBoardFR';
import NavBar from './NavBar';

function App() {
  const [language, setLanguage] = useState('EN'); // 'EN' for English, 'FR' for French

  const toggleGameBoardLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'EN' ? 'FR' : 'EN'));
  };

  return (
    <div className="App">
      <NavBar toggleGameBoards={toggleGameBoardLanguage} />
      {language === 'EN' ? <GameBoard /> : <GameBoardFR />}
    </div>
  );
}

export default App;
