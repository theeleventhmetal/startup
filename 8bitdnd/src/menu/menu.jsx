import React from 'react';
import './menu.css'

export function Menu() {
  return (
    <main>

        <h1 className="big-title"> Main Menu </h1>

        <nav>
            <ul className = "menu-list">
            <li><a className = "menu-button" href="tabletop.html">Tabletop</a></li>
            <li><a className = "menu-button" href="csheet.html">Character Sheet</a></li>
            <li><a className = "menu-button" href="gmtools.html">GM Tools</a></li>
            <li><a className = "menu-button" href="about.html">About</a></li>
            <li><a className = "menu-button" href="index.html">Sign Out</a></li>

            </ul>
        </nav>

    </main>
  );
}