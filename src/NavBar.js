import React, { useState } from "react";
import { IoMdShare } from "react-icons/io";
import "./NavBar.css";
import ShareOptions from "./ShareOptions.js";

function NavBar() {
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  return (
    <div className="NavBar">
      <h1 className="game-title">LetRSets</h1>
      <div className="points-and-instructions">
        <button onClick={handleOpenShareModal} className="instruction-button">
          <IoMdShare />
        </button>
        <button onClick={handleOpenModal} className="instruction-button">
          ?
        </button>
      </div>
      {showModal && (
        <div className="modal">
          <button onClick={handleCloseModal} className="instruction-button">
            X
          </button>
          <h2>How To Play</h2>
          <h3>Guess the word in each word length</h3>
          <p>- Select a word length first</p>
          <p>- Guess the word</p>
          <h3>
            Only <span className="emphasize">1</span> correct answer per word
            length
          </h3>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h3>Hint: </h3>
            <p style={{ margin: "0 5px" }}> </p>
            <p>Single letter sets are at the end of your word</p>
          </div>
          <h3>Examples</h3>
          <p>- The 3 letter word to find is CAT</p>
          <p>- Tap "CA" then "T"</p>
          <p>- Press submit</p>
          <h3>Wrong answers</h3>
          <p>- Correct sets will be Green</p>
          <p>- Incorrect sets will be red</p>
          <h4>A new puzzle is available at midnight</h4>
          <a
            href="https://www.buymeacoffee.com/robertbaer"
            rel="noreferrer"
            target={"_blank"}
          >
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=robertbaer&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
              alt="Buy me a coffee button"
            />
          </a>
        </div>
      )}
      {showShareModal && (
        <div className="modal">
          <button
            onClick={handleCloseShareModal}
            className="instruction-button"
          >
            X
          </button>
          <ShareOptions url="https://letrsets.com" />
        </div>
      )}
    </div>
  );
}

export default NavBar;
