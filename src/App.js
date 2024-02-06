// src/App.js
import React from 'react';
import './App.css';
import GameBoard from './GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Word Sets Game
        </p>
        <GameBoard />
      </header>
    </div>
  );
}

export default App;
