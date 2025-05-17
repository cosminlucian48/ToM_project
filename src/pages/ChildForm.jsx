import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChildForm = () => {
  const [child, setChild] = useState({ name: "", age: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const name = child.name.trim();
    const age = child.age.trim();

    if (!name || !age) {
      setError("Completați toate câmpurile!");
      return;
    }
    if (!/^\d+$/.test(age)) {
      setError("Vârsta trebuie să fie un număr!");
      return;
    }
    setError("");
    localStorage.setItem("childData", JSON.stringify({ name, age }));
    await window.electronAPI.createChildFolder({ name, age });
    navigate("/menu");
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
      <h2>Introduceți datele copilului</h2>
      <input
        placeholder="Nume și Prenume"
        value={child.name}
        onChange={(e) => setChild({ ...child, name: e.target.value })}
        className={`block border p-2 mb-2 ${error && !child.name.trim() ? "input-error" : ""}`}
      />
      <input
        placeholder="Vârstă"
        value={child.age}
        onChange={(e) => setChild({ ...child, age: e.target.value })}
        className={`block border p-2 mb-2 ${error && (!child.age.trim() || !/^\d+$/.test(child.age.trim())) ? "input-error" : ""}`}
        inputMode="numeric"
      />
      {error && (
        <div style={{ color: "#ef4444", marginBottom: 8, fontWeight: "bold" }}>
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-3 py-1"
      >
        Continuă
      </button>
    </div>
  );
};

export default ChildForm;