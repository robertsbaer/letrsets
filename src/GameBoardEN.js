import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";
import wordsForGame from "./words_for_game_en.json";
import ReactGA from "react-ga4";

function GameBoard() {
  const [userInputEN, setUserInput] = useState("");
  const [guessedWordsEN, setGuessedWords] = useState([]);
  const [letterSetsEN, setLetterSets] = useState([]);
  const [selectedWordsEN, setSelectedWords] = useState([]);
  const [attemptsEN, setAttempts] = useState(0);
  const [gameOverEN, setGameOver] = useState(false);
  const [messageEN, setMessage] = useState({ text: "", visible: false });
  const [showWordCheckEN, setShowWordCheck] = useState(false);
  const [letterSetStatusEN, setLetterSetStatus] = useState({});
  const [selectedWordLengthEN, setSelectedWordLength] = useState(null);
  const [wonLevelsEN, setWonLevels] = useState([]);
  const [hintIndexEN, setHintIndex] = useState(0);
  const [usedSetsEN, setUsedSets] = useState({});
  const [isInitializedEN, setIsInitialized] = useState(false);
  const [pointsUpdatedEN, setPointsUpdated] = useState(false);
  const [gamePlayedEN, setGamePlayed] = useState(false);

  useEffect(() => {
    const savedStateEN = localStorage.getItem("gameStateEN");
    const lastPlayedDateEN = localStorage.getItem("lastPlayedDateEN");
    const today = new Date().toDateString();

    if (lastPlayedDateEN !== today) {
      const pointsEN = localStorage.getItem("pointsEN");
      localStorage.removeItem("gameStateEN");
      localStorage.removeItem("lastPlayedDateEN");
      if (pointsEN) {
        localStorage.setItem("pointsEN", pointsEN);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateEN", today);
    } else if (savedStateEN) {
      const state = JSON.parse(savedStateEN);
      setUserInput(state.userInputEN);
      setGuessedWords(state.guessedWordsEN);
      setLetterSets(state.letterSetsEN);
      setSelectedWords(state.selectedWordsEN);
      setAttempts(state.attemptsEN);
      setGameOver(state.gameOverEN);
      setMessage(state.messageEN);
      setShowWordCheck(state.showWordCheckEN);
      setLetterSetStatus(state.letterSetStatusEN);
      setSelectedWordLength(state.selectedWordLengthEN);
      setWonLevels(state.wonLevelsEN);
      setHintIndex(state.hintIndexEN);
      setUsedSets(state.usedSetsEN);
      setIsInitialized(true);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (isInitializedEN) {
      const gameStateEN = {
        userInputEN,
        guessedWordsEN,
        letterSetsEN,
        selectedWordsEN,
        attemptsEN,
        gameOverEN,
        messageEN,
        showWordCheckEN,
        letterSetStatusEN,
        selectedWordLengthEN,
        wonLevelsEN,
        hintIndexEN,
        usedSetsEN,
      };
      localStorage.setItem("gameStateEN", JSON.stringify(gameStateEN));
    }
  }, [
    userInputEN,
    guessedWordsEN,
    letterSetsEN,
    selectedWordsEN,
    attemptsEN,
    gameOverEN,
    messageEN,
    showWordCheckEN,
    letterSetStatusEN,
    selectedWordLengthEN,
    wonLevelsEN,
    hintIndexEN,
    usedSetsEN,
    isInitializedEN,
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
        localStorage.removeItem("gameStateEN");
        localStorage.removeItem("lastPlayedDateEN");
        initializeGame();
      }
    }, 60000); // every min

    return () => {
      clearInterval(resetInterval); // clean-up on component unmount
    };
  }, []);

  useEffect(() => {
    const savedStateEN = localStorage.getItem("gameStateEN");
    const lastPlayedDateEN = localStorage.getItem("lastPlayedDateEN");
    const today = new Date().toDateString();

    if (lastPlayedDateEN !== today) {
      // Save points before clearing localStorage
      const pointsEN = localStorage.getItem("pointsEN");

      // Remove specific items instead of clearing everything
      localStorage.removeItem("gameStateEN");
      localStorage.removeItem("lastPlayedDateEN");

      // Calculate and save points
      const savedWonLevelsEN =
        JSON.parse(localStorage.getItem("wonLevelsEN")) || [];
      const allLevelsWonEN = [3, 4, 5, 6, 7, 8].every((length) =>
        savedWonLevelsEN.includes(length)
      );
      const existingPointsEN = localStorage.getItem("pointsEN") || "0";
      let newTotalPointsEN = existingPointsEN;

      if (allLevelsWonEN) {
        newTotalPointsEN += 1; // Add 1 point if all levels are won
      }

      localStorage.setItem("pointsEN", newTotalPointsEN);

      // Restore points after clearing
      if (pointsEN) {
        setTimeout(() => {
          localStorage.setItem("pointsEN", pointsEN);
        }, 0);
      }
      initializeGame();
      localStorage.setItem("lastPlayedDateEN", today);
    } else if (savedStateEN) {
      // It's still the same day, restore saved state
      const state = JSON.parse(savedStateEN);
      // ... rest of your code here ...
    } else {
      // If there is no savedState also initialize the game
      initializeGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wonLevelsEN", JSON.stringify(wonLevelsEN));
  }, [wonLevelsEN]);

  const initializeGame = () => {
    // Get today's date and format it to match the keys in the JSON file
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;
    localStorage.setItem("pointsUpdatedEN", "false");

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
    const currentWordEN = selectedWordsEN.find(
      (word) => word.length === selectedWordLengthEN
    );

    // Check if the input word matches the current word
    return inputWord.toUpperCase() === currentWordEN.toUpperCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let inputWordEN = userInputEN.toUpperCase();

    // Reset error or success message
    setMessage({ text: "", visible: false });

    if (inputWordEN.length === selectedWordLengthEN) {
      const newLetterSetStatus = { ...letterSetStatusEN };
      const inputLetterSets = extractLetterSets(inputWordEN).map((set) =>
        set.toUpperCase()
      );

      // Get current letter sets of the selected word
      const currentWord = selectedWordsEN
        .find((word) => word.length === selectedWordLengthEN)
        .toUpperCase();
      const currentLetterSets = extractLetterSets(currentWord);

      // Mark each letter set as correct or incorrect
      inputLetterSets.forEach((set) => {
        if (currentLetterSets.includes(set) && !usedSetsEN[set]) {
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
      if (isWordValid(inputWordEN)) {
        // Update state of guessed words and the game overall
        handleCorrectGuess(inputWordEN);
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

  const handleCorrectGuess = (inputWordEN) => {
    const wordLengthEN = inputWordEN.length;
    if (
      !guessedWordsEN.some(
        ({ word }) => word.toLowerCase() === inputWordEN.toLowerCase()
      )
    ) {
      const newGuessedWordsEN = [
        ...guessedWordsEN,
        { word: inputWordEN, length: wordLengthEN },
      ];
      setGuessedWords(newGuessedWordsEN);
      setMessage({ text: "Correct!", visible: true });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 2000); // Clear the message after 5 seconds

      // Add to won levels if not already included
      if (!wonLevelsEN.includes(wordLengthEN)) {
        setWonLevels([...wonLevelsEN, wordLengthEN]);
      }

      // Check if all words have been guessed
      checkGameCompletion(newGuessedWordsEN);
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

  const checkGameCompletion = (newGuessedWordsEN) => {
    if (newGuessedWordsEN.length === selectedWordsEN.length) {
      setMessage({
        text: "Congratulations! You have found all the words.",
        visible: true,
      });
      setGameOver(true);
    }
  };

  const handleLetterSetClick = (set) => {
    if (set.length === 1 && userInputEN.length === 0) {
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
    ReactGA.event({
      category: "Game Interaction", // This can be a general category for similar actions
      action: "Letter Set Clicked", // This describes the action taken
      label: set, // Optionally, use the letter set as a label for more detailed tracking
    });
  };

  useEffect(() => {
    const allLevelsWonEN = [3, 4, 5, 6, 7, 8].every((length) =>
      wonLevelsEN.includes(length)
    );

    if (allLevelsWonEN && selectedWordsEN.length && !gameOverEN) {
      setGameOver(true);
      setMessage({
        text: "Congratulations! Come back tomorrow for another round",
        visible: true,
      });
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000);
    }

    if (gameOverEN && gamePlayedEN && !pointsUpdatedEN) {
      const existingPointsEN = Number(localStorage.getItem("pointsEN") || "0");
      let newTotalPointsEN;

      // Add 1 point whenever a game is completed
      newTotalPointsEN = existingPointsEN + 1;

      localStorage.setItem("pointsEN", newTotalPointsEN.toString());
      localStorage.setItem("pointsUpdatedEN", "true"); // Set pointsUpdated to true after updating the points
      setPointsUpdated(true); // Set pointsUpdated to true after updating the points

      window.dispatchEvent(
        new CustomEvent("pointsUpdatedEN", {
          detail: { pointsEN: newTotalPointsEN },
        })
      );
    }
  }, [
    wonLevelsEN,
    selectedWordsEN.length,
    gameOverEN,
    pointsUpdatedEN,
    gamePlayedEN,
  ]);

  const giveHint = () => {
    // Filter for unguessed words of the selected length
    const unguessedWords = selectedWordsEN.filter(
      (word) =>
        !guessedWordsEN.some(
          (guessedWord) => guessedWord.word.toLowerCase() === word.toLowerCase()
        ) && word.length === selectedWordLengthEN
    );

    if (unguessedWords.length > 0) {
      // Cycle through the unguessed words
      const hintWord = unguessedWords[hintIndexEN % unguessedWords.length];
      const hintMessage = `Hint: The word starts with "${hintWord[0].toUpperCase()}"`;
      setMessage({ text: hintMessage, visible: true });

      // Hide the hint message after 10 seconds
      setTimeout(() => {
        setMessage({ text: "", visible: false });
      }, 5000); // 5000 milliseconds = 10 seconds

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndexEN >= unguessedWords.length) {
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
  }, [selectedWordLengthEN]);

  useEffect(() => {
    setLetterSetStatus({});
    setUsedSets({});
  }, [selectedWordLengthEN]);

  const renderWordLengths = () => {
    const wordLengths = [3, 4, 5, 6, 7, 8];
    return wordLengths.map((length) => {
      const found = guessedWordsEN.some((wordObj) => wordObj.length === length);
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
      {showWordCheckEN && <Modal />}
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
                background: wonLevelsEN.includes(length)
                  ? "#2E8540"
                  : selectedWordLengthEN === length
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
        {messageEN.visible && (
          <div className="messageContainer">{messageEN.text}</div>
        )}
        <div className="letterSetContainer">
          {letterSetsEN.map((set, index) => (
            <button
              key={index}
              onClick={() => handleLetterSetClick(set)}
              className={`letterSet ${
                letterSetStatusEN[set] === "incorrect"
                  ? "incorrect"
                  : letterSetStatusEN[set] === "correct"
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
              value={userInputEN}
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
              disabled={gameOverEN}
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
