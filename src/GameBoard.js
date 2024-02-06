import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import wordsList from "./words.json";

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

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
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

    // Clear localStorage after 5 minutes
    const now = new Date();
    const next12am = new Date(now);
    next12am.setHours(24, 0, 0, 0); // Set the time to 1pm today
    if (now > next12am) {
      // If it's already past 1pm, schedule for 1pm tomorrow
      next12am.setDate(next12am.getDate() + 1);
    }
    const timeUntil1pm = next12am - now;

    // Clear localStorage at the next 1pm, and every 24 hours thereafter
    const timeoutId = setTimeout(() => {
      localStorage.clear();
      setInterval(() => {
        localStorage.clear();
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }, timeUntil1pm);

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

  const initializeGame = () => {
    const wordsByLength = [3, 4, 5, 6, 7, 8].map((length) => {
      const wordsOfLength = wordsList.filter((word) => word.length === length);
      return wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
    });

    setSelectedWords(wordsByLength);
    let allSets = wordsByLength.flatMap((word) => extractLetterSets(word));
    allSets = Array.from(new Set(allSets)); // Remove duplicates
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
    return (
      wordsList.includes(inputWord.toLowerCase()) &&
      selectedWords.some(
        (word) => word.toLowerCase() === inputWord.toLowerCase()
      )
    );
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
          // Otherwise, mark it as incorrect
          newLetterSetStatus[set] = "incorrect";
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
      }
    } else {
      setMessage({
        text: "Invalid word or not matching the letter sets!",
        visible: true,
      });
    }
    setUserInput("");
    setAttempts((prevAttempts) => prevAttempts + 1);
  };

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
      const hintMessage = `Hint: One of the words starts with "${hintWord[0].toUpperCase()}" and is ${
        hintWord.length
      } letters long.`;
      setMessage({ text: hintMessage, visible: true });

      // Move to the next word for the next hint
      setHintIndex((prevHintIndex) => prevHintIndex + 1);

      // Reset hintIndex if it exceeds the length of unguessedWords
      if (hintIndex >= unguessedWords.length) {
        setHintIndex(0);
      }
    } else {
      setMessage({ text: "Select a word length!", visible: true });
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
        <div className="wordLengthSelection">
          {[3, 4, 5, 6, 7, 8].map((length) => (
            <button
              key={length}
              onClick={() => handleWordLengthSelection(length)}
              style={{
                margin: "0 5px",
                padding: "15px 30px",
                background: wonLevels.includes(length)
                  ? "green"
                  : selectedWordLength === length
                  ? "#ccc"
                  : "#fff",
                border: "1px solid #000",
                cursor: "pointer",
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
          <input
            type="text"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value.toUpperCase())}
            placeholder="Enter a word"
            className="inputStyle"
          />
          <button type="submit" className="submitButton" disabled={gameOver}>
            Submit
          </button>
        </form>
        <div className="guessedWordsStyle">
          Word hint:
          {guessedWords.map((wordObj, index) => (
            <span key={index} style={{ marginLeft: "10px" }}>
              {wordObj.word.toUpperCase()} ({wordObj.length} letters)
            </span>
          ))}
        </div>
        {/* <button onClick={() => setShowWordCheck(true)} className="hintButton">
          Check Words to Find
        </button> */}
        <button onClick={giveHint} className="hintButton">
          Give Me a Hint
        </button>
      </div>
    </div>
  );
}

export default GameBoard;
