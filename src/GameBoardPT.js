import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsForGame from "./words_for_game_pt.json";

function GameBoard() {
  const [userInputPT, setUserInput] = useState("");
  const [guessedWordsPT, setGuessedWords] = useState([]);
  const [letterSetsPT, setLetterSets] = useState([]);
  const [selectedWordsPT, setSelectedWords] = useState([]);
  const [attemptsPT, setAttempts] = useState(0);
  const [gameOverPT, setGameOver] = useState(false);
  const [messagePT, setMessage] = useState({ text: "", visible: false });
  const [showWordCheckPT, setShowWordCheck] = useState(false);
  const [letterSetStatusPT, setLetterSetStatus] = useState({});
  const [selectedWordLengthPT, setSelectedWordLength] = useState(null);
  const [wonLevelsPT, setWonLevels] = useState([]);
  const [hintIndexPT, setHintIndex] = useState(0);
  const [usedSetsPT, setUsedSets] = useState({});
  const [isInitializedPT, setIsInitialized] = useState(false);
  const [pointsUpdatedPT, setPointsUpdatedPT] = useState(false);
  const [gamePlayedPT, setGamePlayed] = useState(false);

  useEffect(() => {
    const savedStatePT = localStorage.getItem("gameStatePT");
    const lastPlayedDatePT = localStorage.getItem("lastPlayedDatePT");
    const today = new Date().toDateString();

    if (lastPlayedDatePT !== today) {
      const pointsPT = localStorage.getItem("pointsPT");
      localStorage.removeItem("gameStatePT");
      localStorage.removeItem("lastPlayedDatePT");
      if (pointsPT) {
        localStorage.setItem("pointsPT", pointsPT);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDatePT", today);
    } else if (savedStatePT) {
      const state = JSON.parse(savedStatePT);
      setUserInput(state.userInputPT);
      setGuessedWords(state.guessedWordsPT);
      setLetterSets(state.letterSetsPT);
      setSelectedWords(state.selectedWordsPT);
      setAttempts(state.attemptsPT);
      setGameOver(state.gameOverPT);
      setMessage(state.messagePT);
      setShowWordCheck(state.showWordCheckPT);
      setLetterSetStatus(state.letterSetStatusPT);
      setSelectedWordLength(state.selectedWordLengthPT);
      setWonLevels(state.wonLevelsPT);
      setHintIndex(state.hintIndexPT);
      setUsedSets(state.usedSetsPT);
      setIsInitialized(true);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (isInitializedPT) {
      const gameStatePT = {
        userInputPT,
        guessedWordsPT,
        letterSetsPT,
        selectedWordsPT,
        attemptsPT,
        gameOverPT,
        messagePT,
        showWordCheckPT,
        letterSetStatusPT,
        selectedWordLengthPT,
        wonLevelsPT,
        hintIndexPT,
        usedSetsPT,
      };
      localStorage.setItem("gameStatePT", JSON.stringify(gameStatePT));
    }
  }, [
    userInputPT,
    guessedWordsPT,
    letterSetsPT,
    selectedWordsPT,
    attemptsPT,
    gameOverPT,
    messagePT,
    showWordCheckPT,
    letterSetStatusPT,
    selectedWordLengthPT,
    wonLevelsPT,
    hintIndexPT,
    usedSetsPT,
    isInitializedPT,
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
        localStorage.removeItem("gameStatePT");
        localStorage.removeItem("lastPlayedDatePT");
        initializeGame();
      }
    }, 60000); // every min

    return () => {
      clearInterval(resetInterval); // clean-up on component unmount
    };
  }, []);

  useEffect(() => {
    const savedStatePT = localStorage.getItem("gameStatePT");
    const lastPlayedDatePT = localStorage.getItem("lastPlayedDatePT");
    const today = new Date().toDateString();

    if (lastPlayedDatePT !== today) {
      // Save points before clearing localStorage
      const pointsPT = localStorage.getItem("pointsPT");

      // Remove specific items instead of clearing everything
      localStorage.removeItem("gameStatePT");
      localStorage.removeItem("lastPlayedDatePT");

      // Calculate and save points
      const savedWonLevelsPT =
        JSON.parse(localStorage.getItem("wonLevelsPT")) || [];
      const allLevelsWonPT = [3, 4, 5, 6, 7, 8].every((length) =>
        savedWonLevelsPT.includes(length)
      );
      const existingPointsPT = localStorage.getItem("pointsPT") || "0";
      let newTotalPointsPT = existingPointsPT;

      if (allLevelsWonPT) {
        newTotalPointsPT += 1; // Add 1 point if all levels are won
      }

      localStorage.setItem("pointsPT", newTotalPointsPT);

      // Restore points after clearing
      if (pointsPT) {
        setTimeout(() => {
          localStorage.setItem("pointsPT", pointsPT);
        }, 0);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDatePT", today);
    } else if (savedStatePT) {
      // It's still the same day, restore saved state
      const state = JSON.parse(savedStatePT);
      // ... rest of your code here ...
    } else {
      // If there is no savedState also initialize the game
      initializeGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wonLevelsPT", JSON.stringify(wonLevelsPT));
  }, [wonLevelsPT]);

  const initializeGame = () => {
    // Get today's date and format it to match the keys in the JSON file
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;
    localStorage.setItem("pointsUpdatedPT", "false");

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
    const currentWordPT = selectedWordsPT.find(
      (word) => word.length === selectedWordLengthPT
    );

    // Check if the input word matches the current word
    return inputWord.toUpperCase() === currentWordPT.toUpperCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let inputWordPT = userInputPT.toUpperCase();

    // Reset error or success message
    setMessage({ text: "", visible: false });

    if (inputWordPT.length === selectedWordLengthPT) {
      const newLetterSetStatus = { ...letterSetStatusPT };
      const inputLetterSets = extractLetterSets(inputWordPT).map((set) =>
        set.toUpperCase()
      );

      // Get current letter sets of the selected word
      const currentWord = selectedWordsPT
        .find((word) => word.length === selectedWordLengthPT)
        .toUpperCase();
      const currentLetterSets = extractLetterSets(currentWord);

      // Mark each letter set as correct or incorrect
      inputLetterSets.forEach((set) => {
        if (currentLetterSets.includes(set) && !usedSetsPT[set]) {
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
      if (isWordValid(inputWordPT)) {
        // Update state of guessed words and the game overall
        handleCorrectGuess(inputWordPT);
      } else {
        // Show incorrect attempt message
        setMessage({
          text: "Falso. Tente de novo!",
          visible: true,
        });
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 1000); // Clear the message after 5 seconds
      }
    } else {
      // Show message if word length does not match
      setMessage({
        text: "O comprimento da palavra introduzida não coincide com o selecionado.",
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

  const handleCorrectGuess = (inputWordPT) => {
    const wordLengthPT = inputWordPT.length;
    if (
      !guessedWordsPT.some(
        ({ word }) => word.toLowerCase() === inputWordPT.toLowerCase()
      )
    ) {
      const newGuessedWordsPT = [
        ...guessedWordsPT,
        { word: inputWordPT, length: wordLengthPT },
      ];
      setGuessedWords(newGuessedWordsPT);
      setMessage({ text: "Correcto!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 2000); // Clear the message after 5 seconds

      // Add to won levels if not already included
      if (!wonLevelsPT.includes(wordLengthPT)) {
        setWonLevels([...wonLevelsPT, wordLengthPT]);
      }

      // Check if all words have been guessed
      checkGameCompletion(newGuessedWordsPT);
    } else {
      setMessage({
        text: "Você já tentou esta palavra.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }
  };

  const checkGameCompletion = (newGuessedWordsPT) => {
    if (newGuessedWordsPT.length === selectedWordsPT.length) {
      setMessage({
        text: "Parabéns! Você encontrou todas as palavras.",
        visible: true,
      });
      setGameOver(true);
    }
  };

  const handleLetterSetClick = (set) => {
    if (set.length === 1 && userInputPT.length === 0) {
      // If the set has a single letter and it is the user's first selection
      setMessage({
        text: "As letras individuais encontram-se no final da palavra.",
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
    const allLevelsWonPT = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevelsPT.includes(length)
    );

    if (allLevelsWonPT && selectedWordsPT.length && !gameOverPT) {
      setGameOver(true);
      setMessage({
        text: "Parabéns! Volte amanhã para outro jogo.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000);
    }

    if (gameOverPT && gamePlayedPT && !pointsUpdatedPT) {
      const existingPointsPT = Number(localStorage.getItem("pointsPT") || "0");
      let newTotalPointsPT;

      // Add 1 point whenever a game is completed
      newTotalPointsPT = existingPointsPT + 1;

      localStorage.setItem("pointsPT", newTotalPointsPT.toString());
      localStorage.setItem("pointsUpdatedPT", "true"); // Set pointsUpdated to true after updating the points
      setPointsUpdatedPT(true); // Set pointsUpdated to true after updating the points

      window.dispatchEvent(
        new CustomEvent("pointsUpdatedPT", {
          detail: { pointsPT: newTotalPointsPT },
        })
      );
    }
  }, [
    wonLevelsPT,
    selectedWordsPT.length,
    gameOverPT,
    pointsUpdatedPT,
    gamePlayedPT,
  ]);

  const giveHint = () => {
    // Filter for unguessed words of the selected length
    const unguessedWords = selectedWordsPT.filter(
      (word) =>
        !guessedWordsPT.some(
          (guessedWord) => guessedWord.word.toLowerCase() === word.toLowerCase()
        ) && word.length === selectedWordLengthPT
    );

    if (unguessedWords.length > 0) {
      // Cycle through the unguessed words
      const hintWord = unguessedWords[hintIndexPT % unguessedWords.length];
      const hintMessage = `Dica: a palavra começa por "${hintWord[0].toUpperCase()}"`;
      setMessage({ text: hintMessage, visible: true });

      // Hide the hint message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndexPT >= unguessedWords.length) {
        setHintIndex(0);
      }
    } else {
      setMessage({
        text: "Selecione um comprimento de palavra!",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
  };

  useEffect(() => {
    setGuessedWords([]);
  }, [selectedWordLengthPT]);

  useEffect(() => {
    setLetterSetStatus({});
    setUsedSets({});
  }, [selectedWordLengthPT]);

  const renderWordLengths = () => {
    const wordLengths = [3, 4, 5, 6, 7, 8];
    return wordLengths.map((length) => {
      const found = guessedWordsPT.some((wordObj) => wordObj.length === length);
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
      {showWordCheckPT && <Modal />}
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
                background: wonLevelsPT.includes(length)
                  ? "#2E8540"
                  : selectedWordLengthPT === length
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
        {messagePT.visible && (
          <div className="messageContainer">{messagePT.text}</div>
        )}
        <div className="letterSetContainer">
          {letterSetsPT.map((set, index) => (
            <button
              key={index}
              onClick={() => handleLetterSetClick(set)}
              className={`letterSet ${
                letterSetStatusPT[set] === "incorrect"
                  ? "incorrect"
                  : letterSetStatusPT[set] === "correct"
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
              value={userInputPT}
              onChange={(event) =>
                setUserInput(event.target.value.toUpperCase())
              }
              placeholder="Sua palavra a encontrar"
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
              apagar
            </button>
          </div>
          <div className="buttonContainer">
            <button
              type="button"
              onClick={giveHint}
              className="buttonCommon hintButton"
              aria-label="Get a hint for the current word length"
            >
              Dica
            </button>
            <button
              type="submit"
              class="buttonCommon submitButton"
              disabled={gameOverPT}
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
