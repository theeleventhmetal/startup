import React from 'react';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Gmtools } from './gmtools/gmtools';
// import { Menu } from './menu/menu';
import { About } from './about/about';
import { Tabletop } from './tabletop/tabletop';
import { Csheet } from './csheet/csheet';

export default function App() {
  return (
    <BrowserRouter>
    <div>
      <header> 
        <h1 className="main-header">8-Bit DND</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1em' }}>
            <li><NavLink className='nav-link' to='/tabletop'>Tabletop</NavLink></li>
            <li><NavLink className='nav-link' to='/csheet'>Character Sheet</NavLink></li>
            <li><NavLink className='nav-link' to='/gmtools'>GM Tools</NavLink></li>
            <li><NavLink className='nav-link' to='/about'>About</NavLink></li>
            <li className='nav-right'><NavLink className='nav-link' to='/'>Sign Out</NavLink></li>
          </ul>
        </nav>
        <hr />
      </header>

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/tabletop' element={<Tabletop />} />
        <Route path='/csheet' element={<Csheet />} />
        <Route path='/gmtools' element={<Gmtools />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    <footer>
      <hr />
      <span className="text-reset">Created by Jack Hillman</span>
      <br />
      <a href="https://github.com/theeleventhmetal/startup.git">GitHub Repository</a>
    </footer>

    </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Page not found.</main>;
}