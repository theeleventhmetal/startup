import React from 'react';
import './app.css';

export default function App() {
  return (
    <div>
      <header> 
        <h1 className="main-header">About 8-Bit DND</h1> 
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1em' }}>
            <li><a href="tabletop.html">Tabletop</a></li>
            <li><a href="csheet.html">Character Sheet</a></li>
            <li><a href="gmtools.html">GM Tools</a></li>
            <li><a>About</a></li>
            <li className="nav-right"><a href="index.html">Sign Out</a></li>
          </ul>
        </nav>
        <hr />
      </header>

      <main>App compnents go here</main>

    <footer>
      <hr />
      <span class="text-reset">Created by Jack Hillman</span>
      <br />
      <a href="https://github.com/theeleventhmetal/startup.git">GitHub Repository</a>
    </footer>
    
    </div>
  );
}