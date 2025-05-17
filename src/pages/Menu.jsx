import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  const handleNewChild = () => {
    localStorage.removeItem('childData');
    navigate('/');
  };

  return (
    <div className="container">
      <button
        onClick={() => window.electronAPI.closeApp()}
        className="close-btn"
        title="Închide"
      >
        ×
      </button>
      <h2>Alege un joc</h2>
      <button onClick={() => navigate('/gamearchived')} style={{ display: 'none' }} className="block mt-2 bg-green-500 text-white px-3 py-1">Joc arhivat</button>
<button onClick={() => navigate('/game1')} className="block mt-2 bg-green-500 text-white px-3 py-1">Aplicația 1 - Jocul formelor și al culorilor</button>
<button onClick={() => navigate('/game2')} className="block mt-2 bg-yellow-500 text-white px-3 py-1">Aplicația 2 - Ziua și Noaptea</button>
<button onClick={() => navigate('/game3')} className="block mt-2 bg-red-500 text-white px-3 py-1">Aplicația 3 - Sarcinile ToM</button>
      <hr className="menu-separator" />

      <button
        onClick={handleNewChild}
        className="copil-nou-btn"
      >
        Analiză nouă
      </button>
    </div>
  );
};

export default Menu;