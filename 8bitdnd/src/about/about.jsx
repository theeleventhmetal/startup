import React from 'react';
import './about.css';

export function About(props) {
  const [imageUrl, setImageUrl] = React.useState('');

  React.useEffect(() => {
    setImageUrl(`image_about.webp`);
  }, []);

  return (
    <main className="about-container">
      <img 
        src={imageUrl} 
        alt="8-Bit DND Landscape" 
        className="landscape-image"
      />
      
      <div className="about-text">
        <h2>About 8-Bit DND</h2>
        <p>
          Welcome to 8-Bit DND, where classic tabletop gaming meets retro pixel art aesthetics! 
          Our platform brings the magic of Dungeons & Dragons to your digital screen with a 
          nostalgic 8-bit twist.
        </p>
      </div>
    </main>
  );
}