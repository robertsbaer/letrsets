import React, { useState } from 'react';
import './NavBar.css';

function NavBar() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="NavBar">
      <h1 className="game-title">LetRSets</h1>
      <button onClick={handleOpenModal} className="instruction-button">?</button>
      {showModal && (
        <div className="modal">
          <button onClick={handleCloseModal} className="instruction-button">X</button>
          <h2>How To Play</h2>
          <h3>Guess the word in each word length</h3>
          <p>- Select a word length first</p>
          <p>- Guess the word</p>
          <h3>Only <span className="emphasize">1</span> correct answer per word length</h3>
          <h3>Examples</h3>
          <p>- The 3 letter word to find is CAT</p>
          <p>- Tap "CA" then "T"</p>
          <p>- Press submit</p>
          <h3>Wrong answers</h3>
          <p>- Correct sets will be Green</p>
          <p>- Incorrect sets will be red</p>
          <h4>A new puzzle is available at midnight</h4>
        </div>
      )}
    </div>
  );
}

export default NavBar;