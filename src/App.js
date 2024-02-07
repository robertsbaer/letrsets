// src/App.js
import React from 'react';
import './App.css';
import GameBoard from './GameBoard';
import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <GameBoard />
      </header>
    </div>
  );
}

export default App;
