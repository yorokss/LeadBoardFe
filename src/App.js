import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthFourm";
import Leaderboard from "./components/LeaderBoard";
import SubmitScore from "./components/SubmitScore";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthForm isSignup={false} />} />
        <Route path="/signup" element={<AuthForm isSignup={true} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/submit" element={<SubmitScore />} />
      </Routes>
    </Router>
  );
}

export default App;
