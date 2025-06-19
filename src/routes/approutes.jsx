import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/dashboard";
import Wallet from "../pages/wallet";
//import Promotions from "../pages/promotion";
import Profile from "../pages/profile";
import Aviator from "../pages/games/aviator";
import Promotion from "../pages/promotion";
import Contact from "../pages/contact";
import {DiceRoll} from "../pages/games/diceroll";
import { SpinAndWin } from "../pages/games/spinandwin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/promotion" element={<Promotion />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />

      {/* Game Routes */}
      <Route path="/games/aviator" element={<Aviator />} />
      <Route path="/games/diceroll" element={<DiceRoll />} />
      <Route path="/games/spinandwin" element={<SpinAndWin />} />
     
      {/* You can add a 404 page here if needed */}
    </Routes>
  );
}
