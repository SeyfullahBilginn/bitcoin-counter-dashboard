import React from 'react';
import './App.css';
import Bitcoin from './components/Bitcoin';
import Counter from './components/Counter';

function App() {
  return (
    <>
      <div>
        <Counter />
        <Bitcoin />
      </div>
    </>
  );
}

export default App;
