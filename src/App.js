import React from 'react';
import './App.css';

import Map from './components/Map'

function App() {

  const matrix = [
    [5, 4, 4],
    [4, 3, 4],
    [3, 2, 4],
    [2, 2, 2],
    [3, 3, 4],
    [1, 4, 4],
    [4, 1, 1]
  ]

  return (
    <div className="App">
      The map:
      <Map matrix={matrix} />
    </div>
  );
}

export default App;
