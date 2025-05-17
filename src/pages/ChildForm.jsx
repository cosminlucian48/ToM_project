import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChildForm = () => {
  const [child, setChild] = useState({ name: '', age: '' });
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem('childData', JSON.stringify(child));
    navigate('/menu');
  };

  return (
    <div className="container">
      <h2>Enter Child Info</h2>
      <input
        placeholder="Name"
        value={child.name}
        onChange={(e) => setChild({ ...child, name: e.target.value })}
        className="block border p-2 mb-2"
      />
      <input
        placeholder="Age"
        value={child.age}
        onChange={(e) => setChild({ ...child, age: e.target.value })}
        className="block border p-2 mb-2"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1">Continue</button>
    </div>
  );
};

export default ChildForm;
