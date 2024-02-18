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
  const [pointsES, setPointsES] = useState(() =>
    Math.floor(localStorage.getItem("pointsES") || 0)
  );
  const [pointsPT, setPointsPT] = useState(() =>
    Math.floor(localStorage.getItem("pointsPT") || 0)
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("translationLanguage") || "en"
  ); // Initial language set to English

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedPoints = Math.floor(localStorage.getItem("points") || 0);
      setPoints(updatedPoints);
    };

    const handleStorageChangeFR = () => {
      const updatedPointsFR = Math.floor(localStorage.getItem("pointsFR") || 0);
      setPointsFR(updatedPointsFR);
    };

    const handleStorageChangeES = () => {
      const updatedPointsES = Math.floor(localStorage.getItem("pointsES") || 0);
      setPointsES(updatedPointsES);
    };

    const handleStorageChangePT = () => {
      const updatedPointsPT = Math.floor(localStorage.getItem("pointsPT") || 0);
      setPointsPT(updatedPointsPT);
    };

    const handlePointsUpdated = (event) => {
      setPoints(Math.floor(event.detail.points));
    };

    const handlePointsUpdatedFR = (event) => {
      setPointsFR(Math.floor(event.detail.pointsFR));
    };

    const handlePointsUpdatedES = (event) => {
      setPointsES(Math.floor(event.detail.pointsES));
    };

    const handlePointsUpdatedPT = (event) => {
      setPointsPT(Math.floor(event.detail.pointsPT));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("pointsUpdated", handlePointsUpdated);

    window.addEventListener("storageFR", handleStorageChangeFR);
    window.addEventListener("pointsUpdatedFR", handlePointsUpdatedFR);

    window.addEventListener("storageES", handleStorageChangeES);
    window.addEventListener("pointsUpdatedES", handlePointsUpdatedES);

    window.addEventListener("storagePT", handleStorageChangePT);
    window.addEventListener("pointsUpdatedPT", handlePointsUpdatedPT);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pointsUpdated", handlePointsUpdated);
      window.removeEventListener("storageFR", handleStorageChangeFR);
      window.removeEventListener("pointsUpdatedFR", handlePointsUpdatedFR);
      window.removeEventListener("storageES", handleStorageChangeES);
      window.removeEventListener("pointsUpdatedES", handlePointsUpdatedES);
      window.removeEventListener("storagePT", handleStorageChangePT);
      window.removeEventListener("pointsUpdatedPT", handlePointsUpdatedPT);
    };
  }, []);

  useEffect(() => {
    const points = Math.floor(localStorage.getItem("points") || 0);
    const pointsFR = Math.floor(localStorage.getItem("pointsFR") || 0);
    const pointsES = Math.floor(localStorage.getItem("pointsES") || 0);
    const pointsPT = Math.floor(localStorage.getItem("pointsPT") || 0);

    setPoints(points);
    setPointsFR(pointsFR);
    setPointsES(pointsES);
    setPointsPT(pointsPT);
  }, []);

  const toggleModal = (type) => () => {
    setModalType(modalType === type ? null : type);
  };

  const handleToggleGameBoards = () => {
    setFlagCountry(prevCountry => {
        // Toggle country flag among Great Britain, France, Spain, and Portugal
        const newCountry = prevCountry === "GB" ? "FR" : 
                           prevCountry === "FR" ? "ES" : 
                           prevCountry === "ES" ? "PT" : "GB";
        localStorage.setItem("flagCountry", newCountry);
        return newCountry;
    });

    setLanguage(prevLanguage => {
        // Toggle language among English, French, Spanish, and Portuguese
        if (prevLanguage === "en") return "fr";
        if (prevLanguage === "fr") return "es";
        if (prevLanguage === "es") return "pt";
        return "en"; // Default back to English if it's Portuguese
    });

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
              In English {translations["en"].youveWon}{" "}
              <span className="emphasize">{points}</span>{" "}
              {translations["en"].game}
            </p>
          </div>
          <div className="points-container">
            <FaMedal className="medal-icon" />
            <p className="points">
              En Français {translations["fr"].youveWon}{" "}
              <span className="emphasize">{pointsFR}</span>{" "}
              {translations["fr"].game}
            </p>
          </div>
          <div className="points-container">
            <FaMedal className="medal-icon" />
            <p className="points">
              En español {translations["es"].youveWon}{" "}
              <span className="emphasize">{pointsES}</span>{" "}
              {translations["es"].game}
            </p>
          </div>
          <div className="points-container">
            <FaMedal className="medal-icon" />
            <p className="points">
              En Potuguese {translations["pt"].youveWon}{" "}
              <span className="emphasize">{pointsPT}</span>{" "}
              {translations["pt"].game}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
