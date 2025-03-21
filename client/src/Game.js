
import React, { useState, useEffect } from 'react';

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [trumpSuit, setTrumpSuit] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentTrick, setCurrentTrick] = useState([]);
  const playerIndex = 0; // For simplicity, assume the user is Player 1 (P1)

  // Fetch initial game state from server
  useEffect(() => {
    fetch('http://localhost:3001/deal')
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error('Error fetching game state:', err));
  }, []);

  // Set trump suit
  const handleTrumpSelection = () => {
    if (!trumpSuit || !['♠', '♣', '♥', '♦'].includes(trumpSuit)) {
      alert('Please enter a valid suit (♠, ♣, ♥, ♦)');
      return;
    }
    fetch('http://localhost:3001/set-trump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suit: trumpSuit }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGameState({ ...gameState, trumpSuit: data.trumpSuit });
        }
      })
      .catch(err => console.error('Error setting trump:', err));
  };

  // Play a card (basic implementation)
  const playCard = (card) => {
    if (playerIndex !== currentTrick.length % 4) {
      alert('Not your turn!');
      return;
    }
    setSelectedCard(card);
    setCurrentTrick([...currentTrick, { player: playerIndex, card }]);
    // Remove card from hand (simulated locally for now)
    const newHand = gameState.players[playerIndex].hand.filter(c => c !== card);
    setGameState({
      ...gameState,
      players: gameState.players.map((p, i) =>
        i === playerIndex ? { ...p, hand: newHand } : p
      ),
    });
    // TODO: Send to server for validation and trick resolution
  };

  if (!gameState) return <div>Loading game...</div>;

  return (
    <div className="game-container">
      <h2>Koshur Turuf</h2>
      <div className="game-info">
        <p>Team 1 Tricks: {gameState.tricks.team1} | Team 2 Tricks: {gameState.tricks.team2}</p>
        {gameState.trumpSuit ? (
          <p>Trump Suit: {gameState.trumpSuit}</p>
        ) : (
          <p>Trump Suit: Not yet selected</p>
        )}
      </div>

      {/* Trump Selection for Trump Selector */}
      {playerIndex === gameState.trumpSelector && !gameState.trumpSuit && (
        <div className="trump-selection">
          <input
            value={trumpSuit}
            onChange={(e) => setTrumpSuit(e.target.value)}
            placeholder="Enter trump suit (♠, ♣, ♥, ♦)"
          />
          <button onClick={handleTrumpSelection}>Set Trump</button>
        </div>
      )}

      {/* Players' Hands */}
      {gameState.players.map((player, index) => (
        <div key={index} className="player-hand">
          <h3>Player {index + 1} {index === gameState.trumpSelector ? '(Trump Selector)' : ''}</h3>
          {index === playerIndex ? (
            <div className="cards">
              {player.hand.map((card, i) => (
                <button
                  key={i}
                  className="card"
                  onClick={() => playCard(card)}
                  disabled={playerIndex !== currentTrick.length % 4}
                >
                  {card}
                </button>
              ))}
            </div>
          ) : (
            <p>Cards: {player.hand.length} remaining</p>
          )}
        </div>
      ))}

      {/* Current Trick */}
      <div className="current-trick">
        <h3>Current Trick</h3>
        {currentTrick.map((play, i) => (
          <p key={i}>Player {play.player + 1}: {play.card}</p>
        ))}
      </div>
    </div>
  );
};

export default Game;
