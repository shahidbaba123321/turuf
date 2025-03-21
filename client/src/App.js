import React from 'react';
import Game from './Game'; // Import the Game component
import './App.css'; // Import the styling

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Koshur Turuf</h1>
      </header>
      <main>
        <Game /> {/* Render the Game component */}
      </main>
    </div>
  );
}

export default App;
