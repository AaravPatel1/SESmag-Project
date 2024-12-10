// App.js
import React from 'react';
import './App.css';
import Chat from './Chat';  // Import Chat component

function App() {
  return (
    <div className="App">
      <h1>Welcome to my website</h1>
      <Chat />  {/* Use Chat component here */}
    </div>
  );
}

export default App;
