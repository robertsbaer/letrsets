import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsForGame from "./words_for_game_tr.json";

function GameBoard() {
  const [userInputTR, setUserInput] = useState("");
  const [guessedWordsTR, setGuessedWords] = useState([]);
  const [letterSetsTR, setLetterSets] = useState([]);
  const [selectedWordsTR, setSelectedWords] = useState([]);
  const [attemTRsTR, setAttemTRs] = useState(0);
  const [gameOverTR, setGameOver] = useState(false);
  const [messageTR, setMessage] = useState({ text: "", visible: false });
  const [showWordCheckTR, setShowWordCheck] = useState(false);
  const [letterSetStatusTR, setLetterSetStatus] = useState({});
  const [selectedWordLengthTR, setSelectedWordLength] = useState(null);
  const [wonLevelsTR, setWonLevels] = useState([]);
  const [hintIndexTR, setHintIndex] = useState(0);
  const [usedSetsTR, setUsedSets] = useState({});
  const [isInitializedTR, setIsInitialized] = useState(false);
  const [pointsUpdatedTR, setPointsUpdatedTR] = useState(false);
  const [gamePlayedTR, setGamePlayed] = useState(false);

  useEffect(() => {
    const savedStateTR = localStorage.getItem("gameStateTR");
    const lastPlayedDateTR = localStorage.getItem("lastPlayedDateTR");
    const today = new Date().toDateString();

    if (lastPlayedDateTR !== today) {
      const pointsTR = localStorage.getItem("pointsTR");
      localStorage.removeItem("gameStateTR");
      localStorage.removeItem("lastPlayedDateTR");
      if (pointsTR) {
        localStorage.setItem("pointsTR", pointsTR);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateTR", today);
    } else if (savedStateTR) {
      const state = JSON.parse(savedStateTR);
      setUserInput(state.userInputTR);
      setGuessedWords(state.guessedWordsTR);
      setLetterSets(state.letterSetsTR);
      setSelectedWords(state.selectedWordsTR);
      setAttemTRs(state.attemTRsTR);
      setGameOver(state.gameOverTR);
      setMessage(state.messageTR);
      setShowWordCheck(state.showWordCheckTR);
      setLetterSetStatus(state.letterSetStatusTR);
      setSelectedWordLength(state.selectedWordLengthTR);
      setWonLevels(state.wonLevelsTR);
      setHintIndex(state.hintIndexTR);
      setUsedSets(state.usedSetsTR);
      setIsInitialized(true);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (isInitializedTR) {
      const gameStateTR = {
        userInputTR,
        guessedWordsTR,
        letterSetsTR,
        selectedWordsTR,
        attemTRsTR,
        gameOverTR,
        messageTR,
        showWordCheckTR,
        letterSetStatusTR,
        selectedWordLengthTR,
        wonLevelsTR,
        hintIndexTR,
        usedSetsTR,
      };
      localStorage.setItem("gameStateTR", JSON.stringify(gameStateTR));
    }
  }, [
    userInputTR,
    guessedWordsTR,
    letterSetsTR,
    selectedWordsTR,
    attemTRsTR,
    gameOverTR,
    messageTR,
    showWordCheckTR,
    letterSetStatusTR,
    selectedWordLengthTR,
    wonLevelsTR,
    hintIndexTR,
    usedSetsTR,
    isInitializedTR,
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
        localStorage.removeItem("gameStateTR");
        localStorage.removeItem("lastPlayedDateTR");
        initializeGame();
      }
    }, 60000); // every min

    return () => {
      clearInterval(resetInterval); // clean-up on component unmount
    };
  }, []);

  useEffect(() => {
    const savedStateTR = localStorage.getItem("gameStateTR");
    const lastPlayedDateTR = localStorage.getItem("lastPlayedDateTR");
    const today = new Date().toDateString();

    if (lastPlayedDateTR !== today) {
      // Save points before clearing localStorage
      const pointsTR = localStorage.getItem("pointsTR");

      // Remove specific items instead of clearing everything
      localStorage.removeItem("gameStateTR");
      localStorage.removeItem("lastPlayedDateTR");

      // Calculate and save points
      const savedWonLevelsTR =
        JSON.parse(localStorage.getItem("wonLevelsTR")) || [];
      const allLevelsWonTR = [3, 4, 5, 6, 7, 8].every((length) =>
        savedWonLevelsTR.includes(length)
      );
      const existingPointsTR = localStorage.getItem("pointsTR") || "0";
      let newTotalPointsTR = existingPointsTR;

      if (allLevelsWonTR) {
        newTotalPointsTR += 1; // Add 1 point if all levels are won
      }

      localStorage.setItem("pointsTR", newTotalPointsTR);

      // Restore points after clearing
      if (pointsTR) {
        setTimeout(() => {
          localStorage.setItem("pointsTR", pointsTR);
        }, 0);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateTR", today);
    } else if (savedStateTR) {
      // It's still the same day, restore saved state
      const state = JSON.parse(savedStateTR);
      // ... rest of your code here ...
    } else {
      // If there is no savedState also initialize the game
      initializeGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wonLevelsTR", JSON.stringify(wonLevelsTR));
  }, [wonLevelsTR]);

  const initializeGame = () => {
    // Get today's date and format it to match the keys in the JSON file
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;
    localStorage.setItem("pointsUpdatedTR", "false");

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
    const currentWordTR = selectedWordsTR.find(
      (word) => word.length === selectedWordLengthTR
    );

    // Check if the input word matches the current word
    return inputWord.toUpperCase() === currentWordTR.toUpperCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let inputWordTR = userInputTR.toUpperCase();

    // Reset error or success message
    setMessage({ text: "", visible: false });

    if (inputWordTR.length === selectedWordLengthTR) {
      const newLetterSetStatus = { ...letterSetStatusTR };
      const inputLetterSets = extractLetterSets(inputWordTR).map((set) =>
        set.toUpperCase()
      );

      // Get current letter sets of the selected word
      const currentWord = selectedWordsTR
        .find((word) => word.length === selectedWordLengthTR)
        .toUpperCase();
      const currentLetterSets = extractLetterSets(currentWord);

      // Mark each letter set as correct or incorrect
      inputLetterSets.forEach((set) => {
        if (currentLetterSets.includes(set) && !usedSetsTR[set]) {
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
      if (isWordValid(inputWordTR)) {
        // Update state of guessed words and the game overall
        handleCorrectGuess(inputWordTR);
      } else {
        // Show incorrect attemTR message
        setMessage({
          text: "Yanlış. Tekrar deneyin!",
          visible: true,
        });
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 1000); // Clear the message after 5 seconds
      }
    } else {
      // Show message if word length does not match
      setMessage({
        text: "Girilen kelimenin uzunluğu seçilenle uyuşmuyor.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }

    // Clear user input for the next attemTR
    setUserInput("");
    setAttemTRs((prevAttemTRs) => prevAttemTRs + 1);
  };

  useEffect(() => {
    return () => {
      setGamePlayed(false);
    };
  }, []);

  const handleCorrectGuess = (inputWordTR) => {
    const wordLengthTR = inputWordTR.length;
    if (
      !guessedWordsTR.some(
        ({ word }) => word.toLowerCase() === inputWordTR.toLowerCase()
      )
    ) {
      const newGuessedWordsTR = [
        ...guessedWordsTR,
        { word: inputWordTR, length: wordLengthTR },
      ];
      setGuessedWords(newGuessedWordsTR);
      setMessage({ text: "Doğru!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 2000); // Clear the message after 5 seconds

      // Add to won levels if not already included
      if (!wonLevelsTR.includes(wordLengthTR)) {
        setWonLevels([...wonLevelsTR, wordLengthTR]);
      }

      // Check if all words have been guessed
      checkGameCompletion(newGuessedWordsTR);
    } else {
      setMessage({
        text: "Bu kelimeyi zaten denediniz.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }
  };

  const checkGameCompletion = (newGuessedWordsTR) => {
    if (newGuessedWordsTR.length === selectedWordsTR.length) {
      setMessage({
        text: "Tebrikler! Tüm kelimeleri buldunuz.",
        visible: true,
      });
      setGameOver(true);
    }
  };

  const handleLetterSetClick = (set) => {
    if (set.length === 1 && userInputTR.length === 0) {
      // If the set has a single letter and it is the user's first selection
      setMessage({
        text: "Tek harfler kelimenin sonunda bulunur.",
        visible: true,
      });
      // OTRionally, you can decide if you want to clear this message after some time
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
    const allLevelsWonTR = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevelsTR.includes(length)
    );

    if (allLevelsWonTR && selectedWordsTR.length && !gameOverTR) {
      setGameOver(true);
      setMessage({
        text: "Tebrikler! Yarın başka bir oyun için geri dönün.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000);
    }

    if (gameOverTR && gamePlayedTR && !pointsUpdatedTR) {
      const existingPointsTR = Number(localStorage.getItem("pointsTR") || "0");
      let newTotalPointsTR;

      // Add 1 point whenever a game is completed
      newTotalPointsTR = existingPointsTR + 1;

      localStorage.setItem("pointsTR", newTotalPointsTR.toString());
      localStorage.setItem("pointsUpdatedTR", "true"); // Set pointsUpdated to true after updating the points
      setPointsUpdatedTR(true); // Set pointsUpdated to true after updating the points

      window.dispatchEvent(
        new CustomEvent("pointsUpdatedTR", {
          detail: { pointsTR: newTotalPointsTR },
        })
      );
    }
  }, [
    wonLevelsTR,
    selectedWordsTR.length,
    gameOverTR,
    pointsUpdatedTR,
    gamePlayedTR,
  ]);

  const giveHint = () => {
    // Filter for unguessed words of the selected length
    const unguessedWords = selectedWordsTR.filter(
      (word) =>
        !guessedWordsTR.some(
          (guessedWord) => guessedWord.word.toLowerCase() === word.toLowerCase()
        ) && word.length === selectedWordLengthTR
    );

    if (unguessedWords.length > 0) {
      // Cycle through the unguessed words
      const hintWord = unguessedWords[hintIndexTR % unguessedWords.length];
      const hintMessage = `İpucu: kelime şununla başlar "${hintWord[0].toUpperCase()}"`;
      setMessage({ text: hintMessage, visible: true });

      // Hide the hint message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndexTR >= unguessedWords.length) {
        setHintIndex(0);
      }
    } else {
      setMessage({ text: "Bir kelime uzunluğu seçin!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
  };

  useEffect(() => {
    setGuessedWords([]);
  }, [selectedWordLengthTR]);

  useEffect(() => {
    setLetterSetStatus({});
    setUsedSets({});
  }, [selectedWordLengthTR]);

  const renderWordLengths = () => {
    const wordLengths = [3, 4, 5, 6, 7, 8];
    return wordLengths.map((length) => {
      const found = guessedWordsTR.some((wordObj) => wordObj.length === length);
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
      {showWordCheckTR && <Modal />}
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
                background: wonLevelsTR.includes(length)
                  ? "#2E8540"
                  : selectedWordLengthTR === length
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
        {messageTR.visible && (
          <div className="messageContainer">{messageTR.text}</div>
        )}
        <div className="letterSetContainer">
          {letterSetsTR.map((set, index) => (
            <button
              key={index}
              onClick={() => handleLetterSetClick(set)}
              className={`letterSet ${
                letterSetStatusTR[set] === "incorrect"
                  ? "incorrect"
                  : letterSetStatusTR[set] === "correct"
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
              value={userInputTR}
              onChange={(event) =>
                setUserInput(event.target.value.toUpperCase())
              }
              placeholder="Bulmanız gereken kelime"
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
              sil
            </button>
          </div>
          <div className="buttonContainer">
            <button
              type="button"
              onClick={giveHint}
              className="buttonCommon hintButton"
              aria-label="Get a hint for the current word length"
            >
              İpucu
            </button>
            <button
              type="submit"
              class="buttonCommon submitButton"
              disabled={gameOverTR}
              aria-label="Submit your answer"
            >
              Doğrula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameBoard;
