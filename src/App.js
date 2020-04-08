import React, { useState } from 'react';
import './App.css';

import Map from './components/Map';

function App() {
  const [matrix, setMatrix] = useState([
    [5, 4, 4],
    [4, 3, 4],
    [3, 2, 4],
    [2, 2, 2],
    [3, 3, 4],
    [1, 4, 4],
    [4, 1, 1],
  ]);

  return (
    <div className="App">
      The map:
      {
      console.log(matrix)
}
      <Map />
      {
      console.log(matrix)
}
    </div>
  );
}

export default App;
