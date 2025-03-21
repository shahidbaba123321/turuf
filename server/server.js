
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Deck setup
const suits = ['♠', '♣', '♥', '♦'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const deck = suits.flatMap(suit => ranks.map(rank => `${rank}${suit}`));

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Game state
let gameState = {
  players: [{ hand: [] }, { hand: [] }, { hand: [] }, { hand: [] }],
  trumpSuit: null,
  trumpSelector: null,
  tricks: { team1: 0, team2: 0 },
};

// Deal cards
app.get('/deal', (req, res) => {
  const shuffledDeck = shuffle([...deck]);
  const dealingCard = '7♥';
  let selectorIndex = -1;

  // Round 1: Deal 5 cards each
  for (let i = 0; i < 4; i++) {
    gameState.players[i].hand = shuffledDeck.slice(i * 5, (i + 1) * 5);
    if (gameState.players[i].hand.includes(dealingCard)) {
      selectorIndex = i;
    }
  }

  gameState.trumpSelector = selectorIndex;
  res.json(gameState);
});

// Set trump suit
app.post('/set-trump', (req, res) => {
  const { suit } = req.body;
  if (suits.includes(suit) && gameState.trumpSelector !== null) {
    gameState.trumpSuit = suit;
    res.json({ success: true, trumpSuit: suit });
  } else {
    res.status(400).json({ error: 'Invalid trump selection' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
