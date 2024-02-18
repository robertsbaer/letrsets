import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsForGame from "./words_for_game_en.json";


function GameBoard() {
  const [userInput, setUserInput] = useState("");
  const [guessedWords, setGuessedWords] = useState([]);
  const [letterSets, setLetterSets] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState({ text: "", visible: false });
  const [showWordCheck, setShowWordCheck] = useState(false);
  const [letterSetStatus, setLetterSetStatus] = useState({});
  const [selectedWordLength, setSelectedWordLength] = useState(null);
  const [wonLevels, setWonLevels] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [usedSets, setUsedSets] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");
    const today = new Date().toDateString();
  
    if (lastPlayedDate !== today) {
      const points = localStorage.getItem("points");
      localStorage.removeItem("gameState");
      localStorage.removeItem("lastPlayedDate");
      if (points) {
        localStorage.setItem("points", points);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDate", today);
    } else if (savedState) {
      const state = JSON.parse(savedState);
      setUserInput(state.userInput);
      setGuessedWords(state.guessedWords);
      setLetterSets(state.letterSets);
      setSelectedWords(state.selectedWords);
      setAttempts(state.attempts);
      setGameOver(state.gameOver);
      setMessage(state.message);
      setShowWordCheck(state.showWordCheck);
      setLetterSetStatus(state.letterSetStatus);
      setSelectedWordLength(state.selectedWordLength);
      setWonLevels(state.wonLevels);
      setHintIndex(state.hintIndex);
      setUsedSets(state.usedSets);
      setIsInitialized(true);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const gameState = {
        userInput,
        guessedWords,
        letterSets,
        selectedWords,
        attempts,
        gameOver,
        message,
        showWordCheck,
        letterSetStatus,
        selectedWordLength,
        wonLevels,
        hintIndex,
        usedSets,
      };
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [
    userInput,
    guessedWords,
    letterSets,
    selectedWords,
    attempts,
    gameOver,
    message,
    showWordCheck,
    letterSetStatus,
    selectedWordLength,
    wonLevels,
    hintIndex,
    usedSets,
    isInitialized,
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
        localStorage.removeItem("gameState");
        localStorage.removeItem("lastPlayedDate");
        initializeGame();
      }
    }, 60000); // every min

    return () => {
      clearInterval(resetInterval); // clean-up on component unmount
    };
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");
    const today = new Date().toDateString();

    if (lastPlayedDate !== today) {
      // Save points before clearing localStorage 
      const points = localStorage.getItem("points");

      // Remove specific items instead of clearing everything
      localStorage.removeItem("gameState");
      localStorage.removeItem("lastPlayedDate");

      // Calculate and save points
      const savedWonLevels =
        JSON.parse(localStorage.getItem("wonLevels")) || [];
      const allLevelsWon = [3, 4, 5, 6, 7, 8].every((length) =>
        savedWonLevels.includes(length)
      );
      const existingPoints = parseFloat(localStorage.getItem("points") || "0");
      let newTotalPoints = existingPoints;

      if (allLevelsWon) {
        newTotalPoints += 1; // Add 1 point if all levels are won
      }

      localStorage.setItem("points", newTotalPoints.toFixed(2));

      // Restore points after clearing
      if (points) {
        setTimeout(() => {
          localStorage.setItem("points", points);
        }, 0);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDate", today);
    } else if (savedState) {
      // It's still the same day, restore saved state
      const state = JSON.parse(savedState);
      // ... rest of your code here ...
    } else {
      // If there is no savedState also initialize the game
      initializeGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wonLevels", JSON.stringify(wonLevels));
  }, [wonLevels]);

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
    const currentWord = selectedWords.find(
      (word) => word.length === selectedWordLength
    );

    // Check if the input word matches the current word
    return inputWord.toUpperCase() === currentWord.toUpperCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let inputWord = userInput.toUpperCase();

    // Reset error or success message
    setMessage({ text: "", visible: false });

    if (inputWord.length === selectedWordLength) {
      const newLetterSetStatus = { ...letterSetStatus };
      const inputLetterSets = extractLetterSets(inputWord).map((set) =>
        set.toUpperCase()
      );

      // Get current letter sets of the selected word
      const currentWord = selectedWords
        .find((word) => word.length === selectedWordLength)
        .toUpperCase();
      const currentLetterSets = extractLetterSets(currentWord);

      // Mark each letter set as correct or incorrect
      inputLetterSets.forEach((set) => {
        if (currentLetterSets.includes(set) && !usedSets[set]) {
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
      if (isWordValid(inputWord)) {
        // Update state of guessed words and the game overall
        handleCorrectGuess(inputWord);
      } else {
        // Show incorrect attempt message
        setMessage({
          text: "Incorrect, try again!",
          visible: true,
        });
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 1000); // Clear the message after 5 seconds
      }
    } else {
      // Show message if word length does not match
      setMessage({
        text: "The length of the entered word does not match the selected one.",
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

  const handleCorrectGuess = (inputWord) => {
    const wordLength = inputWord.length;
    if (
      !guessedWords.some(
        ({ word }) => word.toLowerCase() === inputWord.toLowerCase()
      )
    ) {
      const newGuessedWords = [
        ...guessedWords,
        { word: inputWord, length: wordLength },
      ];
      setGuessedWords(newGuessedWords);
      setMessage({ text: "Correct!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 2000); // Clear the message after 5 seconds

      // Add to won levels if not already included
      if (!wonLevels.includes(wordLength)) {
        setWonLevels([...wonLevels, wordLength]);
      }

      // Check if all words have been guessed
      checkGameCompletion(newGuessedWords);
    } else {
      setMessage({
        text: "You have already guessed this word.",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 4000); // Clear the message after 5 seconds
    }
  };

  const checkGameCompletion = (newGuessedWords) => {
    if (newGuessedWords.length === selectedWords.length) {
      setMessage({
        text: "Congratulations! You have found all the words.",
        visible: true,
      });
      setGameOver(true);
    }
  };

  const handleLetterSetClick = (set) => {
    if (set.length === 1 && userInput.length === 0) {
      // If the set has a single letter and it is the user's first selection
      setMessage({
        text: "Individual letters are at the end of the word.",
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
    const allLevelsWon = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevels.includes(length)
    );
  
    if (allLevelsWon && selectedWords.length && !gameOver) {
      setGameOver(true);
      setMessage({
        text: "Congratulations! Come back tomorrow for another round",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000);
    }
  
    if (gameOver && gamePlayed) {
      const existingPoints = parseFloat(localStorage.getItem("points") || "0");
      let newTotalPoints;
    
      // Add 1 point whenever a game is completed
      newTotalPoints = existingPoints - existingPoints + 1;
    
      localStorage.setItem("points", newTotalPoints.toFixed(2));
      localStorage.setItem("pointsUpdated", "true"); // Set pointsUpdated to true after updating the points
      setPointsUpdated(true); // Set pointsUpdated to true after updating the points
    
      window.dispatchEvent(
        new CustomEvent("pointsUpdated", { detail: { points: newTotalPoints } })
      );
    }
  }, [wonLevels, selectedWords.length, gameOver, pointsUpdated, gamePlayed]);

  const giveHint = () => {
    // Filter for unguessed words of the selected length
    const unguessedWords = selectedWords.filter(
      (word) =>
        !guessedWords.some(
          (guessedWord) => guessedWord.word.toLowerCase() === word.toLowerCase()
        ) && word.length === selectedWordLength
    );

    if (unguessedWords.length > 0) {
      // Cycle through the unguessed words
      const hintWord = unguessedWords[hintIndex % unguessedWords.length];
      const hintMessage = `Hint: The word starts with "${hintWord[0].toUpperCase()}"`;
      setMessage({ text: hintMessage, visible: true });

      // Hide the hint message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndex >= unguessedWords.length) {
        setHintIndex(0);
      }
    } else {
      setMessage({ text: "Select a word length!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
  };

  useEffect(() => {
    setGuessedWords([]);
  }, [selectedWordLength]);

  useEffect(() => {
    setLetterSetStatus({});
    setUsedSets({});
  }, [selectedWordLength]);

  const renderWordLengths = () => {
    const wordLengths = [3, 4, 5, 6, 7, 8];
    return wordLengths.map((length) => {
      const found = guessedWords.some((wordObj) => wordObj.length === length);
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
      {showWordCheck && <Modal />}
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
                background: wonLevels.includes(length)
                  ? "#2E8540"
                  : selectedWordLength === length
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
        {message.visible && (
          <div className="messageContainer">{message.text}</div>
        )}
        <div className="letterSetContainer">
          {letterSets.map((set, index) => (
            <button
              key={index}
              onClick={() => handleLetterSetClick(set)}
              className={`letterSet ${
                letterSetStatus[set] === "incorrect"
                  ? "incorrect"
                  : letterSetStatus[set] === "correct"
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
              value={userInput}
              onChange={(event) =>
                setUserInput(event.target.value.toUpperCase())
              }
              placeholder="Your word"
              className="inputStyle"
            />
            {/* Clear button right next to the input field */}
            <button
              type="button"
              onClick={() => setUserInput("")}
              className="clearButton"
              aria-label="Clear text input"
            >
              Clear
            </button>
          </div>
          <div className="buttonContainer">
            <button
              type="button"
              onClick={giveHint}
              className="buttonCommon hintButton"
              aria-label="Get a hint for the current word length"
            >
              Hint
            </button>
            <button
              type="submit"
              class="buttonCommon submitButton"
              disabled={gameOver}
              aria-label="Submit your answer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameBoard;
