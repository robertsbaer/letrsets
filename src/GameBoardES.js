import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsForGame from "./words_for_game_es.json";

function GameBoard() {
  const [userInputES, setUserInput] = useState("");
  const [guessedWordsES, setGuessedWords] = useState([]);
  const [letterSetsES, setLetterSets] = useState([]);
  const [selectedWordsES, setSelectedWords] = useState([]);
  const [attemptsES, setAttempts] = useState(0);
  const [gameOverES, setGameOver] = useState(false);
  const [messageES, setMessage] = useState({ text: "", visible: false });
  const [showWordCheckES, setShowWordCheck] = useState(false);
  const [letterSetStatusES, setLetterSetStatus] = useState({});
  const [selectedWordLengthES, setSelectedWordLength] = useState(null);
  const [wonLevelsES, setWonLevels] = useState([]);
  const [hintIndexES, setHintIndex] = useState(0);
  const [usedSetsES, setUsedSets] = useState({});
  const [isInitializedES, setIsInitialized] = useState(false);
  const [pointsUpdatedES, setPointsUpdated] = useState(false);
  const [gamePlayedES, setGamePlayed] = useState(false);

  useEffect(() => {
    const savedStateES = localStorage.getItem("gameStateES");
    const lastPlayedDateES = localStorage.getItem("lastPlayedDateES");
    const today = new Date().toDateString();

    if (lastPlayedDateES !== today) {
      const pointsES = localStorage.getItem("pointsES");
      localStorage.removeItem("gameStateES");
      localStorage.removeItem("lastPlayedDateES");
      if (pointsES) {
        localStorage.setItem("pointsES", pointsES);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateES", today);
    } else if (savedStateES) {
      const state = JSON.parse(savedStateES);
      setUserInput(state.userInputES);
      setGuessedWords(state.guessedWordsES);
      setLetterSets(state.letterSetsES);
      setSelectedWords(state.selectedWordsES);
      setAttempts(state.attemptsES);
      setGameOver(state.gameOverES);
      setMessage(state.messageES);
      setShowWordCheck(state.showWordCheckES);
      setLetterSetStatus(state.letterSetStatusES);
      setSelectedWordLength(state.selectedWordLengthES);
      setWonLevels(state.wonLevelsES);
      setHintIndex(state.hintIndexES);
      setUsedSets(state.usedSetsES);
      setIsInitialized(true);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (isInitializedES) {
      const gameStateES = {
        userInputES,
        guessedWordsES,
        letterSetsES,
        selectedWordsES,
        attemptsES,
        gameOverES,
        messageES,
        showWordCheckES,
        letterSetStatusES,
        selectedWordLengthES,
        wonLevelsES,
        hintIndexES,
        usedSetsES,
      };
      localStorage.setItem("gameStateES", JSON.stringify(gameStateES));
    }
  }, [
    userInputES,
    guessedWordsES,
    letterSetsES,
    selectedWordsES,
    attemptsES,
    gameOverES,
    messageES,
    showWordCheckES,
    letterSetStatusES,
    selectedWordLengthES,
    wonLevelsES,
    hintIndexES,
    usedSetsES,
    isInitializedES,
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
        localStorage.removeItem("gameStateES");
        localStorage.removeItem("lastPlayedDateES");
        initializeGame();
      }
    }, 60000); // every min

    return () => {
      clearInterval(resetInterval); // clean-up on component unmount
    };
  }, []);

  useEffect(() => {
    const savedStateES = localStorage.getItem("gameStateES");
    const lastPlayedDateES = localStorage.getItem("lastPlayedDateES");
    const today = new Date().toDateString();

    if (lastPlayedDateES !== today) {
      // Save points before clearing localStorage
      const pointsES = localStorage.getItem("pointsES");

      // Remove specific items instead of clearing everything
      localStorage.removeItem("gameStateES");
      localStorage.removeItem("lastPlayedDateES");

      // Calculate and save points
      const savedWonLevelsES =
        JSON.parse(localStorage.getItem("wonLevelsES")) || [];
      const allLevelsWonES = [3, 4, 5, 6, 7, 8].every((length) =>
        savedWonLevelsES.includes(length)
      );
      const existingPointsES = localStorage.getItem("pointsES") || "0";
      let newTotalPointsES = existingPointsES;

      if (allLevelsWonES) {
        newTotalPointsES += 1; // Add 1 point if all levels are won
      }

      localStorage.setItem("pointsES", newTotalPointsES);

      // Restore points after clearing
      if (pointsES) {
        setTimeout(() => {
          localStorage.setItem("pointsES", pointsES);
        }, 0);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateES", today);
    } else if (savedStateES) {
      // It's still the same day, restore saved state
      const state = JSON.parse(savedStateES);
      // ... rest of your code here ...
    } else {
      // If there is no savedState also initialize the game
      initializeGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wonLevelsES", JSON.stringify(wonLevelsES));
  }, [wonLevelsES]);

  const initializeGame = () => {
    // Get today's date and format it to match the keys in the JSON file
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;
    localStorage.setItem("pointsUpdatedES", "false");

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
    const currentWordES = selectedWordsES.find(
      (word) => word.length === selectedWordLengthES
    );

    // Check if the input word matches the current word
    return inputWord.toUpperCase() === currentWordES.toUpperCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let inputWordES = userInputES.toUpperCase();

    // Reset error or success message
    setMessage({ text: "", visible: false });

    if (inputWordES.length === selectedWordLengthES) {
      const newLetterSetStatus = { ...letterSetStatusES };
      const inputLetterSets = extractLetterSets(inputWordES).map((set) =>
        set.toUpperCase()
      );

      // Get current letter sets of the selected word
      const currentWord = selectedWordsES
        .find((word) => word.length === selectedWordLengthES)
        .toUpperCase();
      const currentLetterSets = extractLetterSets(currentWord);

      // Mark each letter set as correct or incorrect
      inputLetterSets.forEach((set) => {
        if (currentLetterSets.includes(set) && !usedSetsES[set]) {
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
      if (isWordValid(inputWordES)) {
        // Update state of guessed words and the game overall
        handleCorrectGuess(inputWordES);
      } else {
        // Show incorrect attempt message
        setMessage({
          text: "Falso. ¡Intente de nuevo!",
          visible: true,
        });
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 1000); // Clear the message after 5 seconds
      }
    } else {
      // Show message if word length does not match
      setMessage({
        text: "La longitud de la palabra introducida no coincide con la seleccionada.",
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

  const handleCorrectGuess = (inputWordES) => {
    const wordLengthES = inputWordES.length;
    if (
      !guessedWordsES.some(
        ({ word }) => word.toLowerCase() === inputWordES.toLowerCase()
      )
    ) {
      const newGuessedWordsES = [
        ...guessedWordsES,
        { word: inputWordES, length: wordLengthES },
      ];
      setGuessedWords(newGuessedWordsES);
      setMessage({ text: "Correcto!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 2000); // Clear the message after 5 seconds

      // Add to won levels if not already included
      if (!wonLevelsES.includes(wordLengthES)) {
        setWonLevels([...wonLevelsES, wordLengthES]);
      }

      // Check if all words have been guessed
      checkGameCompletion(newGuessedWordsES);
    } else {
      setMessage({
        text: "Ya has intentado esta palabra.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }
  };

  const checkGameCompletion = (newGuessedWordsES) => {
    if (newGuessedWordsES.length === selectedWordsES.length) {
      setMessage({
        text: "¡Felicidades! Has encontrado todas las palabras.",
        visible: true,
      });
      setGameOver(true);
    }
  };

  const handleLetterSetClick = (set) => {
    if (set.length === 1 && userInputES.length === 0) {
      // If the set has a single letter and it is the user's first selection
      setMessage({
        text: "Las letras individuales se encuentran al final de la palabra.",
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
    const allLevelsWonES = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevelsES.includes(length)
    );

    if (allLevelsWonES && selectedWordsES.length && !gameOverES) {
      setGameOver(true);
      setMessage({
        text: "¡Felicidades! Vuelve mañana para otro juego.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000);
    }

    if (gameOverES && gamePlayedES && !pointsUpdatedES) {
      const existingPointsES = Number(localStorage.getItem("pointsES") || "0");
      let newTotalPointsES;

      // Add 1 point whenever a game is completed
      newTotalPointsES = existingPointsES + 1;

      localStorage.setItem("pointsES", newTotalPointsES.toString());
      localStorage.setItem("pointsUpdatedES", "true"); // Set pointsUpdated to true after updating the points
      setPointsUpdated(true); // Set pointsUpdated to true after updating the points

      window.dispatchEvent(
        new CustomEvent("pointsUpdatedES", {
          detail: { pointsES: newTotalPointsES },
        })
      );
    }
  }, [
    wonLevelsES,
    selectedWordsES.length,
    gameOverES,
    pointsUpdatedES,
    gamePlayedES,
  ]);

  const giveHint = () => {
    // Filter for unguessed words of the selected length
    const unguessedWords = selectedWordsES.filter(
      (word) =>
        !guessedWordsES.some(
          (guessedWord) => guessedWord.word.toLowerCase() === word.toLowerCase()
        ) && word.length === selectedWordLengthES
    );

    if (unguessedWords.length > 0) {
      // Cycle through the unguessed words
      const hintWord = unguessedWords[hintIndexES % unguessedWords.length];
      const hintMessage = `Pista: la palabra comienza por "${hintWord[0].toUpperCase()}"`;
      setMessage({ text: hintMessage, visible: true });

      // Hide the hint message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndexES >= unguessedWords.length) {
        setHintIndex(0);
      }
    } else {
      setMessage({
        text: "¡Seleccione una longitud de palabra!",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
  };

  useEffect(() => {
    setGuessedWords([]);
  }, [selectedWordLengthES]);

  useEffect(() => {
    setLetterSetStatus({});
    setUsedSets({});
  }, [selectedWordLengthES]);

  const renderWordLengths = () => {
    const wordLengths = [3, 4, 5, 6, 7, 8];
    return wordLengths.map((length) => {
      const found = guessedWordsES.some((wordObj) => wordObj.length === length);
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
      {showWordCheckES && <Modal />}
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
                background: wonLevelsES.includes(length)
                  ? "#2E8540"
                  : selectedWordLengthES === length
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
        {messageES.visible && (
          <div className="messageContainer">{messageES.text}</div>
        )}
        <div className="letterSetContainer">
          {letterSetsES.map((set, index) => (
            <button
              key={index}
              onClick={() => handleLetterSetClick(set)}
              className={`letterSet ${
                letterSetStatusES[set] === "incorrect"
                  ? "incorrect"
                  : letterSetStatusES[set] === "correct"
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
              value={userInputES}
              onChange={(event) =>
                setUserInput(event.target.value.toUpperCase())
              }
              placeholder="Tu palabra a encontrar"
              className="inputStyle"
              readOnly
            />
            {/* Clear button right next to the input field */}
            <button
              type="button"
              onClick={() => setUserInput("")}
              className="clearButton"
              aria-label="Clear text input"
            >
              borrar
            </button>
          </div>
          <div className="buttonContainer">
            <button
              type="button"
              onClick={giveHint}
              className="buttonCommon hintButton"
              aria-label="Get a hint for the current word length"
            >
              Pista
            </button>
            <button
              type="submit"
              class="buttonCommon submitButton"
              disabled={gameOverES}
              aria-label="Submit your answer"
            >
              Validar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameBoard;
