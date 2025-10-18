import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './csheet.css';

export function Csheet() {
  const navigate = useNavigate();
  const [character, setCharacter] = useState({
    name: "",
    race: "",
    class: "",
    strength: 10,
    dexterity: 10,
    intelligence: 10
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save data to localStorage (or context)
    localStorage.setItem("character", JSON.stringify(character));
    navigate("/display");
  };

  return (
    <div className="editor">
      <h1>Edit Character Sheet</h1>
      <form id="csheet-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={character.name} onChange={handleChange} />
        <label>Race</label>
        <input name="race" value={character.race} onChange={handleChange} />
        <label>Class</label>
        <input name="class" value={character.class} onChange={handleChange} />

        <button type="submit">Save & View</button>
      </form>
    </div>
  );
}