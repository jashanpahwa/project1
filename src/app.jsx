

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Wallet from "./pages/wallet";
import Promotions from "./pages/promotion";
import Contact from "./pages/contact";
import Profile from "./pages/profile";
import Aviator from "./pages/games/aviator";
import {DiceRoll} from "./pages/games/diceroll";
import { SpinAndWin } from "./pages/games/spinandwin";
import AppRoutes from "./routes/approutes";



function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/games/aviator" element={<Aviator />} />
        <Route path="/games/diceroll" element={<DiceRoll />} />
        <Route path="/games/spinandwin" element={<SpinAndWin />} />
        {/* Add more games here */}
      </Routes>
    </Router>
  );
}

export default App;
