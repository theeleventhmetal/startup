import React from 'react';
import './about.css';

export function About(props) {
  const [imageUrl, setImageUrl] = React.useState('');

  React.useEffect(() => {
    setImageUrl(`image_about.jpg`);
  }, []);

  return (
    <main className="about-container">
      <img 
        src={imageUrl} 
        alt="8-Bit DND Landscape" 
        className="landscape-image"
      />
      
      <div className="about-text">
        <p>
          8-Bit DND is all about making the world's most popular tabletop 
          roll playing game more accessible.
          With a simple interface, and styling reminiscent of the 
          golden age of video games, our goal is to limit complexity
          and get you immersed in a game of your creation as soon as possible.
        </p>
      </div>
    </main>
  );
}