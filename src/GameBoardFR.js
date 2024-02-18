import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsForGame from "./words_for_game_fr.json";


function GameBoard() {
  const [userInputFR, setUserInput] = useState("");
  const [guessedWordsFR, setGuessedWords] = useState([]);
  const [letterSetsFR, setLetterSets] = useState([]);
  const [selectedWordsFR, setSelectedWords] = useState([]);
  const [attemptsFR, setAttempts] = useState(0);
  const [gameOverFR, setGameOver] = useState(false);
  const [messageFR, setMessage] = useState({ text: "", visible: false });
  const [showWordCheckFR, setShowWordCheck] = useState(false);
  const [letterSetStatusFR, setLetterSetStatus] = useState({});
  const [selectedWordLengthFR, setSelectedWordLength] = useState(null);
  const [wonLevelsFR, setWonLevels] = useState([]);
  const [hintIndexFR, setHintIndex] = useState(0);
  const [usedSetsFR, setUsedSets] = useState({});
  const [isInitializedFR, setIsInitialized] = useState(false);
  const [pointsUpdatedFR, setPointsUpdated] = useState(false);
  const [gamePlayedFR, setGamePlayed] = useState(false);

  useEffect(() => {
    const savedStateFR = localStorage.getItem("gameStateFR");
    const lastPlayedDateFR = localStorage.getItem("lastPlayedDateFR");
    const today = new Date().toDateString();
  
    if (lastPlayedDateFR !== today) {
      const pointsFR = localStorage.getItem("pointsFR");
      localStorage.removeItem("gameStateFR");
      localStorage.removeItem("lastPlayedDateFR");
      if (pointsFR) {
        localStorage.setItem("pointsFR", pointsFR);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateFR", today);
    } else if (savedStateFR) {
      const state = JSON.parse(savedStateFR);
      setUserInput(state.userInputFR);
      setGuessedWords(state.guessedWordsFR);
      setLetterSets(state.letterSetsFR);
      setSelectedWords(state.selectedWordsFR);
      setAttempts(state.attemptsFR);
      setGameOver(state.gameOverFR);
      setMessage(state.messageFR);
      setShowWordCheck(state.showWordCheckFR);
      setLetterSetStatus(state.letterSetStatusFR);
      setSelectedWordLength(state.selectedWordLengthFR);
      setWonLevels(state.wonLevelsFR);
      setHintIndex(state.hintIndexFR);
      setUsedSets(state.usedSetsFR);
      setIsInitialized(true);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (isInitializedFR) {
      const gameStateFR = {
        userInputFR,
        guessedWordsFR,
        letterSetsFR,
        selectedWordsFR,
        attemptsFR,
        gameOverFR,
        messageFR,
        showWordCheckFR,
        letterSetStatusFR,
        selectedWordLengthFR,
        wonLevelsFR,
        hintIndexFR,
        usedSetsFR,
      };
      localStorage.setItem("gameStateFR", JSON.stringify(gameStateFR));
    }
  }, [
    userInputFR,
    guessedWordsFR,
    letterSetsFR,
    selectedWordsFR,
    attemptsFR,
    gameOverFR,
    messageFR,
    showWordCheckFR,
    letterSetStatusFR,
    selectedWordLengthFR,
    wonLevelsFR,
    hintIndexFR,
    usedSetsFR,
    isInitializedFR,
  ]);

  useEffect(() => {
    const checkResetTime = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const timeToNextMidnight = nextMidnight - now;
      return timeToNextMidnight;
    };

    let resetInterval = setInterval(() => {
      const timeToNextMidnight = checkResetTime();
      if (timeToNextMidnight <= 60000) {
        // Remove specific items instead of clearing everything
        localStorage.removeItem("gameStateFR");
        localStorage.removeItem("lastPlayedDateFR");
        initializeGame();
      }
    }, 60000); // every min

    return () => {
      clearInterval(resetInterval); // clean-up on component unmount
    };
  }, []);

  useEffect(() => {
    const savedStateFR = localStorage.getItem("gameStateFR");
    const lastPlayedDateFR = localStorage.getItem("lastPlayedDateFR");
    const today = new Date().toDateString();

    if (lastPlayedDateFR !== today) {
      // Save points before clearing localStorage
      const pointsFR = localStorage.getItem("pointsFR");

      // Remove specific items instead of clearing everything 
      localStorage.removeItem("gameStateFR");
      localStorage.removeItem("lastPlayedDateFR");

      // Calculate and save points
      const savedWonLevelsFR =
        JSON.parse(localStorage.getItem("wonLevelsFR")) || [];
      const allLevelsWonFR = [3, 4, 5, 6, 7, 8].every((length) =>
        savedWonLevelsFR.includes(length)
      );
      const existingPointsFR = parseFloat(localStorage.getItem("pointsFR") || "0");
      let newTotalPointsFR = existingPointsFR;

      if (allLevelsWonFR) {
        newTotalPointsFR += 1; // Add 1 point if all levels are won
      }

      localStorage.setItem("pointsFR", newTotalPointsFR.toFixed(2));

      // Restore points after clearing
      if (pointsFR) {
        setTimeout(() => {
          localStorage.setItem("pointsFR", pointsFR);
        }, 0);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateFR", today);
    } else if (savedStateFR) {
      // It's still the same day, restore saved state
      const state = JSON.parse(savedStateFR);
      // ... rest of your code here ...
    } else {
      // If there is no savedState also initialize the game
      initializeGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wonLevelsFR", JSON.stringify(wonLevelsFR));
  }, [wonLevelsFR]);

  const initializeGame = () => {
    // Get today's date and format it to match the keys in the JSON file
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;
    localStorage.setItem("pointsUpdated", "false");


    // Get the words for today from the JSON file
    const wordsForToday = wordsForGame[todayKey];

    // If there are no words for today, you might want to handle this case differently
    if (!wordsForToday) {
      console.error(`No words found for today's date (${todayKey})`);
      return;
    }

    // Map the words for today into the format expected by the rest of the code
    const wordsByLength = [3, 4, 5, 6, 7, 8].map((length) => {
      const key = `${length}_letter_words`;
      return wordsForToday[key][0]; // Assuming there's always at least one word of each length
    });

    setSelectedWords(wordsByLength);
    let allSets = wordsByLength.flatMap((word) => extractLetterSets(word));
    allSets = Array.from(new Set(allSets)); // Remove duplicates

    // Ensure there are always 20 unique sets of letters
    while (allSets.length < 20) {
      const randomWord =
        wordsList[Math.floor(Math.random() * wordsList.length)];
      const newSets = extractLetterSets(randomWord);
      for (const set of newSets) {
        if (!allSets.includes(set)) {
          allSets.push(set);
          if (allSets.length === 20) {
            break;
          }
        }
      }
    }
    allSets = shuffleArray(allSets);
    setLetterSets(allSets);
    setIsInitialized(true);
    setGamePlayed(true);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const extractLetterSets = (word) => {
    let sets = [];
    for (let i = 0; i < word.length; i += 2) {
      sets.push(word.substring(i, i + 2).toUpperCase());
    }
    return sets;
  };

  const isWordValid = (inputWord) => {
    // Get the current word
    const currentWordFR = selectedWordsFR.find(
      (word) => word.length === selectedWordLengthFR
    );

    // Check if the input word matches the current word
    return inputWord.toUpperCase() === currentWordFR.toUpperCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let inputWordFR = userInputFR.toUpperCase();

    // Reset error or success message
    setMessage({ text: "", visible: false });

    if (inputWordFR.length === selectedWordLengthFR) {
      const newLetterSetStatus = { ...letterSetStatusFR };
      const inputLetterSets = extractLetterSets(inputWordFR).map((set) =>
        set.toUpperCase()
      );

      // Get current letter sets of the selected word
      const currentWord = selectedWordsFR
        .find((word) => word.length === selectedWordLengthFR)
        .toUpperCase();
      const currentLetterSets = extractLetterSets(currentWord);

      // Mark each letter set as correct or incorrect
      inputLetterSets.forEach((set) => {
        if (currentLetterSets.includes(set) && !usedSetsFR[set]) {
          setTimeout(() => {
            newLetterSetStatus[set] = "correct";
            setUsedSets((prevUsedSets) => ({ ...prevUsedSets, [set]: true }));
          }, 500); // Halfway through the animation
        } else {
          if (!newLetterSetStatus[set]) {
            setTimeout(() => {
              newLetterSetStatus[set] = "incorrect";
            }, 500); // Halfway through the animation
          }
        }
      });

      setLetterSetStatus(newLetterSetStatus);

      // Check if the entered word is correct
      if (isWordValid(inputWordFR)) {
        // Update state of guessed words and the game overall
        handleCorrectGuess(inputWordFR);
      } else {
        // Show incorrect attempt message
        setMessage({
          text: "Faux. Essayez à nouveau!",
          visible: true,
        });
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 1000); // Clear the message after 5 seconds
      }
    } else {
      // Show message if word length does not match
      setMessage({
        text: "La longueur du mot saisi ne correspond pas à celle sélectionnée.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }

    // Clear user input for the next attempt
    setUserInput("");
    setAttempts((prevAttempts) => prevAttempts + 1);
  };

  useEffect(() => {
    return () => {
      setGamePlayed(false);
    };
  }, []);

  const handleCorrectGuess = (inputWordFR) => {
    const wordLengthFR = inputWordFR.length;
    if (
      !guessedWordsFR.some(
        ({ word }) => word.toLowerCase() === inputWordFR.toLowerCase()
      )
    ) {
      const newGuessedWordsFR = [
        ...guessedWordsFR,
        { word: inputWordFR, length: wordLengthFR },
      ];
      setGuessedWords(newGuessedWordsFR);
      setMessage({ text: "Correct!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 2000); // Clear the message after 5 seconds

      // Add to won levels if not already included
      if (!wonLevelsFR.includes(wordLengthFR)) {
        setWonLevels([...wonLevelsFR, wordLengthFR]);
      }

      // Check if all words have been guessed
      checkGameCompletion(newGuessedWordsFR);
    } else {
      setMessage({
        text: "Vous avez déjà essayé ce mot.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }
  };

  const checkGameCompletion = (newGuessedWordsFR) => {
    if (newGuessedWordsFR.length === selectedWordsFR.length) {
      setMessage({
        text: "Félicitations! Vous avez trouvé tous les mots.",
        visible: true,
      });
      setGameOver(true);
    }
  };

  const handleLetterSetClick = (set) => {
    if (set.length === 1 && userInputFR.length === 0) {
      // If the set has a single letter and it is the user's first selection
      setMessage({
        text: "Les lettres individuelles se trouvent à la fin du mot.",
        visible: true,
      });
      // Optionally, you can decide if you want to clear this message after some time
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // Clear the message after 5 seconds
    } else {
      // If it's not a single letter at the beginning, proceed as normal
      setUserInput((prevInput) => prevInput + set);
      // Make sure to clear any previous message that might have been visible
      setMessage({ text: "", visible: false });
    }
  };

  useEffect(() => {
    const allLevelsWonFR = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevelsFR.includes(length)
    );
  
    if (allLevelsWonFR && selectedWordsFR.length && !gameOverFR) {
      setGameOver(true);
      setMessage({
        text: "Félicitations! Revenez demain pour un autre jeu",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000);
    }
  
    if (gameOverFR && gamePlayedFR) {
      const existingPointsFR = parseFloat(localStorage.getItem("pointsFR") || "0");
      let newTotalPointsFR;
    
      // Add 1 point whenever a game is completed
      newTotalPointsFR = existingPointsFR - existingPointsFR + 1;
    
      localStorage.setItem("pointsFR", newTotalPointsFR.toFixed(2));
      localStorage.setItem("pointsUpdatedFR", "true"); // Set pointsUpdated to true after updating the points
      setPointsUpdated(true); // Set pointsUpdated to true after updating the points
    
      window.dispatchEvent(
        new CustomEvent("pointsUpdatedFR", { detail: { pointsFR: newTotalPointsFR } })
      );
    }
  }, [wonLevelsFR, selectedWordsFR.length, gameOverFR, pointsUpdatedFR, gamePlayedFR]);

  const giveHint = () => {
    // Filter for unguessed words of the selected length
    const unguessedWords = selectedWordsFR.filter(
      (word) =>
        !guessedWordsFR.some(
          (guessedWord) => guessedWord.word.toLowerCase() === word.toLowerCase()
        ) && word.length === selectedWordLengthFR
    );

    if (unguessedWords.length > 0) {
      // Cycle through the unguessed words
      const hintWord = unguessedWords[hintIndexFR % unguessedWords.length];
      const hintMessage = `Indice : le mot commence par "${hintWord[0].toUpperCase()}"`;
      setMessage({ text: hintMessage, visible: true });

      // Hide the hint message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndexFR >= unguessedWords.length) {
        setHintIndex(0);
      }
    } else {
      setMessage({ text: "Sélectionnez une longueur de mot !", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
  };

  useEffect(() => {
    setGuessedWords([]);
  }, [selectedWordLengthFR]);

  useEffect(() => {
    setLetterSetStatus({});
    setUsedSets({});
  }, [selectedWordLengthFR]);

  const renderWordLengths = () => {
    const wordLengths = [3, 4, 5, 6, 7, 8];
    return wordLengths.map((length) => {
      const found = guessedWordsFR.some((wordObj) => wordObj.length === length);
      return (
        <div key={length} style={{ marginRight: "10px" }}>
          {length}-letter word: {found ? "Found" : "Not Found"}
        </div>
      );
    });
  };

  const Modal = () => (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="modalHeader">
          <h5>Words to Find</h5>
          <button
            onClick={() => setShowWordCheck(false)}
            className="closeButton"
          >
            &times;
          </button>
        </div>
        <div className="modalContent">{renderWordLengths()}</div>
        <div className="modalFooter">
          <button
            onClick={() => setShowWordCheck(false)}
            className="modalCloseButton"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const handleWordLengthSelection = (length) => {
    setSelectedWordLength(length);
    setGuessedWords([]);
    setLetterSetStatus({});
    setUsedSets({});
  };

  return (
    <div className="gameBoardContainer">
      {showWordCheckFR && <Modal />}
      <div className="gameBoard">
        <div className="wordLengthSelection mobile-spacing">
          {[3, 4, 5, 6, 7, 8].map((length) => (
            <button
              key={length}
              onClick={() => handleWordLengthSelection(length)}
              style={{
                margin: "0 5px",
                fontSize: "14px",
                padding: "10px", // Uniform padding
                width: "40px", // Set a fixed width
                height: "40px", // Set a fixed height to match the width, adjust as needed
                borderRadius: "50%", // This will make it a perfect circle
                background: wonLevelsFR.includes(length)
                  ? "#2E8540"
                  : selectedWordLengthFR === length
                  ? "#ff8c00"
                  : "#fff",
                border: "1px solid #000",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                cursor: "pointer",
                textDecoration: "none",
                color: "#000", // Set the color to black
                outline: "none", // Remove the outline
              }}
              aria-label={`Select word of length ${length}`}
            >
              {length}
            </button>
          ))}
        </div>
        {messageFR.visible && (
          <div className="messageContainer">{messageFR.text}</div>
        )}
        <div className="letterSetContainer">
          {letterSetsFR.map((set, index) => (
            <button
              key={index}
              onClick={() => handleLetterSetClick(set)}
              className={`letterSet ${
                letterSetStatusFR[set] === "incorrect"
                  ? "incorrect"
                  : letterSetStatusFR[set] === "correct"
                  ? "correct"
                  : ""
              }`}
            >
              {set}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <input
              type="text"
              value={userInputFR}
              onChange={(event) =>
                setUserInput(event.target.value.toUpperCase())
              }
              placeholder="Votre mot à trouver"
              className="inputStyle"
            />
            {/* Clear button right next to the input field */}
            <button
              type="button"
              onClick={() => setUserInput("")}
              className="clearButton"
              aria-label="Clear text input"
            >
              effacer
            </button>
          </div>
          <div className="buttonContainer">
            <button
              type="button"
              onClick={giveHint}
              className="buttonCommon hintButton"
              aria-label="Get a hint for the current word length"
            >
              Indice
            </button>
            <button
              type="submit"
              class="buttonCommon submitButton"
              disabled={gameOverFR}
              aria-label="Submit your answer"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameBoard;
