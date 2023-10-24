import React from 'react';
import Home from './components/Home';

function App() {
  console.log(import.meta.env.VITE_BASE_URL);
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;