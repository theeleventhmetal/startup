import React from 'react';

export function CharacterCard({ character, isEditable = false }) {
  if (!character) return (
    <div className="character-card">
      <div className="stats-section" style={{ textAlign: 'center', padding: '20px' }}>
        <p>No character data available.</p>
        <p>Go to "Character Sheet" to create or update your character.</p>
      </div>
    </div>
  );

  return (
    <div className="character-card">
      <div className="character-header">
        <h2>{character.name}</h2>
        <div className="character-basic">
          <span>Level {character.level} {character.race} {character.class}</span>
        </div>
      </div>
      
      {/* Combat Stats Table */}
      <div className="stats-section">
        <h3>Combat Stats</h3>
        <table className="combat-stats-table">
          <thead>
            <tr>
              <th>AC</th>
              <th>HP</th>
              <th>Speed</th>
              <th>Initiative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{character.armorClass}</td>
              <td>{character.hitPoints}/{character.maxHitPoints}</td>
              <td>{character.speed}</td>
              <td>{character.initiative >= 0 ? '+' : ''}{character.initiative}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ability Scores Table */}
      <div className="stats-section">
        <h3>Ability Scores</h3>
        <table className="abilities-table">
          <thead>
            <tr>
              {Object.entries(character.abilities).map(([ability]) => (
                <th key={ability}>{ability.substring(0, 3).toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Ability Scores Row */}
            <tr className="scores-row">
              {Object.entries(character.abilities).map(([ability, data]) => (
                <td key={ability}>{data.score}</td>
              ))}
            </tr>
            {/* Modifiers Row */}
            <tr className="modifiers-row">
              {Object.entries(character.abilities).map(([ability, data]) => (
                <td key={ability}>
                  {data.modifier >= 0 ? '+' : ''}{data.modifier}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}