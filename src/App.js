import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import NavBar from './NavBar';

function App() {
  const [points, setPoints] = useState(() => {
    // Retrieve points from local storage or set to 0 if not found
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  // Save points to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);

  return (
    <div className="App">
      <NavBar points={points} />
      <GameBoard points={points} setPoints={setPoints} />
    </div>
  );
}

export default App;