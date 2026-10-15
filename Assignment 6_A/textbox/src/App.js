
import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");

  return (
    <div className="container">
      <h1>Text Display Application</h1>

      <input
        type="text"
        placeholder="Enter your text here..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <h2>{text || "Your text will appear here"}</h2>
    </div>
  );
}

export default App;
