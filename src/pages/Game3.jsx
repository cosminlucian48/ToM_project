import React from 'react';
import { useNavigate } from 'react-router-dom';

const Game3 = () => {
   const navigate = useNavigate();

   return(
  <div className="container">
    <h2>Game 3 coming soon</h2>
    <button
      onClick={() => navigate("/menu")}
      className="block mt-2 bg-green-500 text-white px-3 py-2">
      Back to the menu
    </button>
  </div>)
};
export default Game3;
