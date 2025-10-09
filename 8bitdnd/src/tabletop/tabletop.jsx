import React from 'react';
import './tabletop.css'; 

export function Tabletop() {
  return (
    <>
      <div className="landscape-warning">
          For best experience, please rotate your device to landscape mode.
      </div>
      <main className="tabletop">
        <div className="map">
          <div className="token pc" style={{ top: '50px', left: '50px' }}>PC</div>
          <div className="token enemy" style={{ top: '100px', left: '100px' }}>E</div>
        </div>
        <div className="character-sheet">
          <table>
            <thead>
            <tr>
              <th colSpan={2} style={{ textAlign: 'center' }}>Character Sheet</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>HP</td>
              <td style={{ textAlign: 'center' }}>12</td>
            </tr>
            <tr>
              <td>Armor Class</td>
              <td style={{ textAlign: 'center' }}>15</td>
            </tr>
            <tr>
              <td>Strength</td>
              <td style={{ textAlign: 'center' }}>10</td>
            </tr>
            <tr>
              <td>Dexterity</td>
              <td style={{ textAlign: 'center' }}>14</td>
            </tr>
            <tr>
              <td>Constitution</td>
              <td style={{ textAlign: 'center' }}>13</td>
            </tr>
            <tr>
              <td>Intelligence</td>
              <td style={{ textAlign: 'center' }}>12</td>
            </tr>
            <tr>
              <td>Wisdom</td>
              <td style={{ textAlign: 'center' }}>11</td>
            </tr>
            <tr>
              <td>Charisma</td>
              <td style={{ textAlign: 'center' }}>16</td>
            </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}