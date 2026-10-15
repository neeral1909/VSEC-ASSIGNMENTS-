
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Welcome to Home Page!</h2>
      <p>This is the home page of my website.</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About Us</h2>
      <p>This is the about page of my website.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <h1>My React Website</h1>

      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/about">About</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
