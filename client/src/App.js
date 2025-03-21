
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(null);
  const [trumpSuit, setTrumpSuit] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/deal')
      .then(res => res.json())
      .then(data => setGameState(data));
  }, []);

  const handleTrumpSelection = () => {
    fetch('http://localhost:3001/set-trump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suit: trumpSuit }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setGameState({ ...gameState, trumpSuit: data.trumpSuit });
      });
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Koshur Turuf</h1>
      {gameState.players.map((player, index) => (
        <div key={index}>
          <h3>Player {index + 1} {index === gameState.trumpSelector ? '(Trump Selector)' : ''}</h3>
          <p>{player.hand.join(', ')}</p>
        </div>
      ))}
      {gameState.trumpSelector === 0 && !gameState.trumpSuit && (
        <div>
          <input
            value={trumpSuit}
            onChange={e => setTrumpSuit(e.target.value)}
            placeholder="Enter trump suit (♠, ♣, ♥, ♦)"
          />
          <button onClick={handleTrumpSelection}>Set Trump</button>
        </div>
      )}
      {gameState.trumpSuit && <p>Trump Suit: {gameState.trumpSuit}</p>}
    </div>
  );
}

export default App;
