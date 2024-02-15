import React, { useEffect, useState } from "react";
import Flag from "react-flagkit";
import { FaMedal } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import translations from "./translations"; // Import the translations

import "./NavBar.css";
import ShareOptions from "./ShareOptions.js";

function NavBar({ toggleGameBoards }) {
  const [modalType, setModalType] = useState(null); // Handles which modal is currently open: null, 'share', 'sharePoints', 'help'
  const [flagCountry, setFlagCountry] = useState("GB");
  const [points, setPoints] = useState(() =>
    Math.floor(localStorage.getItem("points") || 0)
  );
  const [pointsFR, setPointsFR] = useState(() =>
    Math.floor(localStorage.getItem("pointsFR") || 0)
  );
  const [language, setLanguage] = useState("en"); // Initial language set to English

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPoints = Math.floor(localStorage.getItem("points") || 0);
      setPoints(updatedPoints);
    };

    const handleStorageChangeFR = () => {
      const updatedPointsFR = Math.floor(localStorage.getItem("pointsFR") || 0);
      setPointsFR(updatedPointsFR);
    };

    const handlePointsUpdated = (event) => {
      setPoints(Math.floor(event.detail.points));
    };

    const handlePointsUpdatedFR = (event) => {
      setPointsFR(Math.floor(event.detail.pointsFR));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("pointsUpdated", handlePointsUpdated);

    window.addEventListener("storageFR", handleStorageChangeFR);
    window.addEventListener("pointsUpdatedFr", handlePointsUpdatedFR);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pointsUpdated", handlePointsUpdated);
    };
  }, []);

  const toggleModal = (type) => () => {
    setModalType(modalType === type ? null : type);
  };

  const handleToggleGameBoards = () => {
    setFlagCountry((prevCountry) => (prevCountry === "GB" ? "FR" : "GB"));
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "fr" : "en")); // Toggle language

    toggleGameBoards();
  };

  return (
    <div className="NavBar">
      <h3 className="game-title">LetRSets</h3>
      <div className="points-and-instructions">
        <button
          onClick={handleToggleGameBoards}
          className="instruction-button"
          aria-label="Toggle Game Boards"
        >
          <Flag
            key={flagCountry}
            country={flagCountry}
            size="30"
            style={{ borderRadius: 50 }}
          />
        </button>
        <button
          onClick={toggleModal("sharePoints")}
          className="instruction-button"
          aria-label="Open share modal for points"
        >
          <FaMedal />
        </button>
        <button
          onClick={toggleModal("share")}
          className="instruction-button"
          aria-label="Open share modal"
        >
          <IoMdShare />
        </button>
        <button
          onClick={toggleModal("help")}
          className="instruction-button"
          aria-label="Open help modal"
        >
          ?
        </button>
      </div>
      {modalType === "help" && (
        <div className="modal">
          <button onClick={toggleModal(null)} className="instruction-button">
            X
          </button>
          <h2>{translations[language].howToPlay}</h2>
          <p>{translations[language].tapLanguage}</p>
          <h3>{translations[language].guessWord}</h3>
          <p>{translations[language].selectWordLength}</p>
          <p>{translations[language].guessTheWord}</p>
          <h3>{translations[language].oneCorrectAnswer}</h3>
          <h3>{translations[language].hint}</h3>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ margin: "0 5px" }}> </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{translations[language].singleLetterSets}</p>
              <p>{translations[language].useSetOnce}</p>
            </div>
          </div>
          <h3>{translations[language].examples}</h3>
          <p>{translations[language].theWordIs}</p>
          <p>{translations[language].tapThen}</p>
          <p>{translations[language].pressSubmit}</p>
          <h3>{translations[language].wrongAnswers}</h3>
          <p>{translations[language].correctGreen}</p>
          <p>{translations[language].incorrectRed}</p>
          <h4>{translations[language].newPuzzle}</h4>

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
      {modalType === "share" && (
        <div className="modal">
          <button onClick={toggleModal(null)} className="instruction-button">
            X
          </button>
          <ShareOptions url="https://letrsets.com" language={language} />
        </div>
      )}
      {modalType === "sharePoints" && (
        <div className="modal">
          <button onClick={toggleModal(null)} className="close-button">
            X
          </button>
          <div className="points-container">
            <FaMedal className="medal-icon" />
            <p className="points">
              In English{translations["en"].youveWon}{" "}
              <span className="emphasize">{points}</span>{" "}
              {translations["en"].game}
            </p>
          </div>
          <div className="points-container">
            <FaMedal className="medal-icon" />
            <p className="points">
              En Français{translations["fr"].youveWon}{" "}
              <span className="emphasize">{pointsFR}</span>{" "}
              {translations["fr"].game}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
