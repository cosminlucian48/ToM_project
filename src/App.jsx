import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChildForm from './pages/ChildForm';
import Menu from './pages/Menu';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Game3 from './pages/Game3';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ChildForm />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/game1" element={<Game1 />} />
      <Route path="/game2" element={<Game2 />} />
      <Route path="/game3" element={<Game3 />} />
    </Routes>
  </Router>
);

export default App;
