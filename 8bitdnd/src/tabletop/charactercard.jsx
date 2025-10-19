import React from 'react';


export function CharacterCard({ character, isEditable = false }) {
  if (!character) return <div>No character data</div>;

  return (
    <div className="character-card">
      <div className="character-header">
        <h2>{character.name}</h2>
        <div className="character-basic">
          <span>Level {character.level} {character.race} {character.class}</span>
        </div>
      </div>
      
      <div className="character-stats">
        <div className="vital-stats">
          <div className="stat-box">
            <label>AC</label>
            <span>{character.armorClass}</span>
          </div>
          <div className="stat-box">
            <label>HP</label>
            <span>{character.hitPoints}/{character.maxHitPoints}</span>
          </div>
          <div className="stat-box">
            <label>Speed</label>
            <span>{character.speed}</span>
          </div>
          <div className="stat-box">
            <label>Initiative</label>
            <span>{character.initiative >= 0 ? '+' : ''}{character.initiative}</span>
          </div>
        </div>
        
        <div className="ability-scores">
          {Object.entries(character.abilities).map(([ability, data]) => (
            <div key={ability} className="ability-mini">
              <label>{ability.substring(0, 3).toUpperCase()}</label>
              <span className="score">{data.score}</span>
              <span className="modifier">
                {data.modifier >= 0 ? '+' : ''}{data.modifier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}