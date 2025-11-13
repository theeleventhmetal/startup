import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './csheet.css';

export function Csheet() {
  const navigate = useNavigate();
  
  // Calculate ability modifier from ability score
  const getModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  React.useEffect(() => {
    console.log('🔍 Making API request...');
    
    fetch('/api/charactercard', {
      credentials: 'include'
    })
      .then((response) => {
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers));
        
        if (response.ok) {
          return response.json();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      })
      .then((character) => {
        console.log('✅ Character loaded from API:', character);
        if (character) {
          setCharacter(character);
        }
      })
      .catch((error) => {
        console.log('❌ API Error:', error.message);
        console.log('📱 Using localStorage fallback');
        
        const savedCharacter = localStorage.getItem('character');
        if (savedCharacter) {
          setCharacter(JSON.parse(savedCharacter));
        }
      });
  }, []);
  
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [character, setCharacter] = useState({
    name: "",
    race: "",
    class: "",
    level: 1,
    background: "",
    alignment: "",
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    hitPoints: 10,
    maxHitPoints: 10,
    armorClass: 10,
    speed: 30,
    proficiencyBonus: 2,
    initiative: 0,
    backstory: "",
    personalityTraits: "",
    ideals: "",
    bonds: "",
    flaws: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const getTabletopData = (character) => {
    return {
      // Basic Info
      name: character.name,
      class: character.class,
      level: character.level,
      race: character.race,
      
      // Combat Stats
      armorClass: character.armorClass,
      hitPoints: character.hitPoints,
      maxHitPoints: character.maxHitPoints,
      speed: character.speed,
      initiative: character.initiative,
      
      // Ability Scores & Modifiers
      abilities: {
        strength: { score: character.strength, modifier: getModifier(character.strength) },
        dexterity: { score: character.dexterity, modifier: getModifier(character.dexterity) },
        constitution: { score: character.constitution, modifier: getModifier(character.constitution) },
        intelligence: { score: character.intelligence, modifier: getModifier(character.intelligence) },
        wisdom: { score: character.wisdom, modifier: getModifier(character.wisdom) },
        charisma: { score: character.charisma, modifier: getModifier(character.charisma) }
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save full character data
    localStorage.setItem("character", JSON.stringify(character));
    
    // Save tabletop-specific data
    const tabletopData = getTabletopData(character);
    localStorage.setItem("tabletopCharacter", JSON.stringify(tabletopData));
    
    navigate("/tabletop");
  };

  const generateName = async () => {
    setClickCount(prev => prev + 1);

    if (clickTimer) {
      clearTimeout(clickTimer); // Fixed: was missing (clickTimer)
    }

    if (clickCount + 1 >= 5) {
      triggerEasterEgg();
      setClickCount(0); // Reset counter
      return; // Don't generate name
    }
    
    // Reset counter after 3 seconds of no clicks
    const newTimer = setTimeout(() => {
      setClickCount(0);
    }, 3000);
    setClickTimer(newTimer);

    try {
      const response = await fetch("https://fantasyname.lukewh.com/");
      
      if (response.ok) {
        console.log("Successfully retrieved from fantasyname API");
        const name = await response.text();
        setCharacter(prev => ({
          ...prev,
          name: name.trim()
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Name generation failed:', error);
      // Fallback to local name generation
      const fallbackNames = ["Aelar", "Aramil", "Berris", "Dayereth", "Enna"];
      const randomName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
      setCharacter(prev => ({ ...prev, name: randomName }));
    }
  };

  const triggerEasterEgg = () => {
    setShowEasterEgg(true);

    setTimeout(() => {
    setShowEasterEgg(false);}, 1500);
  };

  return (
    <>
      <div className="landscape-warning">
        For best experience, please rotate your device to landscape mode.
      </div>

      <div className="csheet-container">
        <form id="csheet-form" onSubmit={handleSubmit}>
          <h1 className="main-header">Character Sheet Editor</h1>

          <div className ="top-row">

            <div className="form-group">
              <label>Character Name</label>
              <div className="input-with-icon">
                <input 
                  name="name" 
                  value={character.name} 
                  onChange={handleChange}
                  placeholder="Enter character name..."
                />
                <button 
                  type="button" 
                  className="generate-icon-button"
                  onClick={generateName}
                  title="Generate random name"
                >
                  Random
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Class</label>
              <input name="class" value={character.class} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Level</label>
              <input type="number" name="level" min="1" max="20" value={character.level} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Alignment</label>
              <input name="alignment" value={character.alignment} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Race</label>
              <input name="race" value={character.race} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Background</label>
              <input name="background" value={character.background} onChange={handleChange} />
            </div>

          </div>

          <div className="form-sections-wrapper">
            {/* Left Column - Ability Scores */}
            <div className="left-column">
              {/* Ability Scores Section */}
              <div className="section ability-scores">
                <div className="abilities-grid">
                  <div className="ability-group">
                    <label>Strength</label>
                    <input type="number" name="strength" min="1" max="20" value={character.strength} onChange={handleChange} />
                    <div className="modifier">Mod: {getModifier(character.strength) >= 0 ? '+' : ''}{getModifier(character.strength)}</div>
                  </div>
                  <div className="ability-group">
                    <label>Dexterity</label>
                    <input type="number" name="dexterity" min="1" max="20" value={character.dexterity} onChange={handleChange} />
                    <div className="modifier">Mod: {getModifier(character.dexterity) >= 0 ? '+' : ''}{getModifier(character.dexterity)}  </div>
                  </div>
                  <div className="ability-group">
                    <label>Constitution</label>
                    <input type="number" name="constitution" min="1" max="20" value={character.constitution} onChange={handleChange} />
                    <div className="modifier">Mod: {getModifier(character.constitution) >= 0 ? '+' : ''}{getModifier(character.constitution)}</div>
                  </div>
                  <div className="ability-group">
                    <label>Intelligence</label>
                    <input type="number" name="intelligence" min="1" max="20" value={character.intelligence} onChange={handleChange} />
                    <div className="modifier">Mod: {getModifier(character.intelligence) >= 0 ? '+' : ''}{getModifier(character.intelligence)}</div>
                  </div>
                  <div className="ability-group">
                    <label>Wisdom</label>
                    <input type="number" name="wisdom" min="1" max="20" value={character.wisdom} onChange={handleChange} />
                    <div className="modifier">Mod: {getModifier(character.wisdom) >= 0 ? '+' : ''}{getModifier(character.wisdom)}</div>
                  </div>
                  <div className="ability-group">
                    <label>Charisma</label>
                    <input type="number" name="charisma" min="1" max="20" value={character.charisma} onChange={handleChange} />
                    <div className="modifier">Mod: {getModifier(character.charisma) >= 0 ? '+' : ''}{getModifier(character.charisma)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Character Info and Combat Stats */}
            <div className="right-column">
              {/* Character Info Section */}
            
            {/* Combat Stats Section - Small Boxes */}
              <div className="section combat-stats">
                <h2>Core Stats</h2>
                <div className="combat-stats-grid">
                  <div className="combat-stat-box">
                    <label>Armor Class</label>
                    <input type="number" name="armorClass" min="1" value={character.armorClass} onChange={handleChange} />
                  </div>
                  <div className="combat-stat-box">
                    <label>Initiative</label>
                    <input type="number" name="initiative" value={character.initiative} onChange={handleChange} />
                  </div>
                  <div className="combat-stat-box">
                    <label>Speed</label>
                    <input type="number" name="speed" min="0" value={character.speed} onChange={handleChange} />
                  </div>
                  <div className="combat-stat-box">
                    <label>Proficiency Bonus</label>
                    <input type="number" name="proficiencyBonus" min="0" value={character.proficiencyBonus} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Character Details Section - NEW */}
              <div className="section character-details">
                <h2>Character Details</h2>
                <div className="character-details-grid">
                  <div className="detail-group">
                    <label>Backstory</label>
                    <textarea 
                      name="backstory" 
                      value={character.backstory} 
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your character's history..."
                    />
                  </div>
                  <div className="detail-group">
                    <label>Personality Traits</label>
                    <textarea 
                      name="personalityTraits" 
                      value={character.personalityTraits} 
                      onChange={handleChange}
                      rows="3"
                      placeholder="How does your character act and think?"
                    />
                  </div>
                  <div className="detail-group">
                    <label>Physical Traits</label>
                    <textarea 
                      name="ideals" 
                      value={character.ideals} 
                      onChange={handleChange}
                      rows="2"
                      placeholder="What does your character look like?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="save-button">Save to Tabletop</button> 
        </form>
      </div>

      {/* Easter Egg Modal - Add this */}
      {showEasterEgg && (
        <div className="easter-egg-overlay" onClick={() => setShowEasterEgg(false)}>
          <div className="easter-egg-modal">
            <img 
              src="/tim_robinson.jpeg" 
              alt="Easter Egg!" 
              className="easter-egg-image"
            />
          </div>
        </div>
      )}
    </>
  );
}