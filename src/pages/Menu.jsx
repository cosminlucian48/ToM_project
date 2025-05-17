import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Choose a Game</h2>
      <button onClick={() => navigate('/game1')} className="block mt-2 bg-green-500 text-white px-3 py-1">Game 1</button>
      <button onClick={() => navigate('/game2')} className="block mt-2 bg-yellow-500 text-white px-3 py-1">Game 2</button>
      <button onClick={() => navigate('/game3')} className="block mt-2 bg-red-500 text-white px-3 py-1">Game 3</button>
    </div>
  );
};

export default Menu;
