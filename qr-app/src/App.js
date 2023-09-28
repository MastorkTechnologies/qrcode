import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login/Login";
import Scanner from "./pages/Scanner/Scanner";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/scanner" element={<Scanner />} />
    </Routes>
  );
}

export default App;
