import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsFor2024 from "./words_for_2024.json";

function GameBoard({ setPoints: setPointsProp }) {
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
  const [points, setPoints] = useState(0); // Add this line to manage points

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    const savedPoints = localStorage.getItem("points"); // Load points

    if (savedState) {
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
      setIsInitialized(true); // Ensure we mark as initialized to prevent re-initialization
    } else {
      initializeGame();
    }

    if (savedPoints) {
      setPoints(Number(savedPoints)); // Initialize points from localStorage
    }

    // Clear localStorage after 5 minutes
    const now = new Date();
    const next12am = new Date(now);
    next12am.setHours(24, 0, 0, 0);
    if (now > next12am) {
      next12am.setDate(next12am.getDate() + 1);
    }
    const timeUntil12am = next12am - now;

    // Clear localStorage at the next 1pm, and every 24 hours thereafter
    const timeoutId = setTimeout(() => {
      localStorage.clear();
      setInterval(() => {
        localStorage.clear();
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }, timeUntil12am);

    // Clear the timeout when the component is unmounted
    return () => clearTimeout(timeoutId);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    // Only save the state if the game has been initialized to prevent overwriting saved state with initial values on first load
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

  const updatePoints = (additionalPoints) => {
    setPointsProp((prevPoints) => prevPoints + additionalPoints);
  };

  useEffect(() => {
    // Daily reset logic - adjust as per your application's logic
    const currentTime = new Date();
    const resetTime = new Date(); // Set this to your desired reset time
    if (currentTime > resetTime) {
      const keysToRemove = ["gameState", "userInput", "guessedWords"]; // Example keys
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      // Optionally, reset other parts of the state as needed, but preserve points
    }
  }, []);

  const initializeGame = () => {
    // Get today's date and format it to match the keys in the JSON file
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;

    // Get the words for today from the JSON file
    const wordsForToday = wordsFor2024[todayKey];

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
    return inputWord.toLowerCase() === currentWord.toLowerCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputWord = userInput.toLowerCase();
    const newLetterSetStatus = { ...letterSetStatus };

    // Get the current word
    const currentWord = selectedWords.find(
      (word) => word.length === selectedWordLength
    );

    if (selectedWordLength === null) {
      setMessage({
        text: "Please select the level you are trying to solve!",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      return;
    }

    // Check if the length of the input word matches the selected word length
    if (inputWord.length === selectedWordLength) {
      // Check each letter set in the user's input
      for (let i = 0; i < inputWord.length; i += 2) {
        const set = inputWord.substring(i, i + 2).toUpperCase();

        // If the letter set is part of the current word at the correct position and hasn't been used before, mark it as correct
        if (
          currentWord.toUpperCase().substring(i, i + 2) === set &&
          !usedSets[set]
        ) {
          newLetterSetStatus[set] = "correct";
          setUsedSets((prevUsedSets) => ({ ...prevUsedSets, [set]: true }));
        } else if (!usedSets[set]) {
          // Check if the set exists in the current word at any position
          if (currentWord.toUpperCase().includes(set)) {
            newLetterSetStatus[set] = "correct";
          } else {
            // Otherwise, mark it as incorrect
            newLetterSetStatus[set] = "incorrect";
          }
        }
      }
    } else {
      setMessage({
        text: "Selected the level you're trying to solve!",
        visible: true,
      });
      return;
    }

    setLetterSetStatus(newLetterSetStatus);

    if (isWordValid(inputWord)) {
      const wordLength = inputWord.length;
      if (!guessedWords.some(({ word }) => word.toLowerCase() === inputWord)) {
        const newGuessedWords = [
          ...guessedWords,
          { word: inputWord, length: wordLength },
        ];
        setGuessedWords(newGuessedWords);
        setMessage({ text: "Correct!", visible: true });
        updatePoints(1);

        // Hide the message after 10 seconds
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 5000); // 5000 milliseconds = 10 seconds

        if (!wonLevels.includes(wordLength)) {
          setWonLevels([...wonLevels, wordLength]);
        }

        if (newGuessedWords.length === selectedWords.length) {
          setMessage({
            text: "Congratulations! All words have been found.",
            visible: true,
          });
          setGameOver(true);
        }

        // Reset letterSetStatus after a correct guess
        setLetterSetStatus({});
      } else {
        setMessage({
          text: "You've already guessed this word!",
          visible: true,
        });

        // Hide the message after 10 seconds
        setTimeout(() => {
          setMessage({ text: "", visible: false });
        }, 5000); // 5000 milliseconds = 10 seconds
      }
    } else {
      setMessage({
        text: "Invalid word or not matching the letter sets!",
        visible: true,
      });

      // Hide the message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
    setUserInput("");
    setAttempts((prevAttempts) => prevAttempts + 1);
  };

  useEffect(() => {
    // Check if all levels have been won
    const allLevelsWon = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevels.includes(length)
    );

    if (allLevelsWon && selectedWords.length && !gameOver) {
      // Set game over state to true and display congratulations message
      setGameOver(true);
      setMessage({
        text: "Congratulations! Come back tomorrow for another round",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds
    }
  }, [wonLevels, selectedWords.length, gameOver]);

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
                  ? "#28a745"
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
              onClick={() => setUserInput((prevInput) => prevInput + set)}
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
              type="button" // Ensure this button does not submit the form
              onClick={() => setUserInput("")} // Clear the userInput state
              className="clearButton"
            >
              Clear
            </button>
          </div>
          <div className="buttonContainer">
            <button
              type="button"
              onClick={giveHint}
              class="buttonCommon hintButton"
            >
              Hint
            </button>
            <button
              type="submit"
              class="buttonCommon submitButton"
              disabled={gameOver}
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