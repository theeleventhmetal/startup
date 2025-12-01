# Virtual Tabletop

Making the world's most famous TTRPG more accessible

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Dungeons and Dragons has been rising steadily in popularity for at least the last decade. It appeals to a variety of demographics for a variety of different reasons, but many are too overwhelmed by the seemingly complicated nature of the game to give it a try. My virtual tabletop will simplify the classic D&D character sheet as well as provide several additional tools to make the game more accessible both for beginning players and Game Masters. The minimal, retro-themed styling is designed to appeal to those who love the 8-bit graphics of 80s and 90s video games without being too overwhelming at first glance. It will highlight the essentials in order to actually start playing, while still providing more advanced mechanics for those who wish to use them. 

### Design

![mock-up-2](https://github.com/user-attachments/assets/faee518d-58c8-4ec4-b7f6-6412d40c6e94)

## Key Features ### 
- Simplified Character Sheet with essential stats highlighted and easily accessible
- Toggleable privacy settings for character information
- Virtual game mat with moveable, customizable icons for both player characters and enemies to enable virtual sessions
- Advanced access for Game Master with view of all player character sheets + story notes

## Utilization of Technology ###

**HTML** will be used to structure the basic layout of the website  

**CSS** will be used to implement the retro-themed styling as well as the battle animations on the game mat  

**React** and **Javascript** will be the framework through which the different components are routed  

**Web service** will be used to retrieve user information as well as previous positioning on game mat  

**Databases** will be used to store authentication and user data such as character stats   

**WebSockets** will be used for realtime updates for both player chat and virtual game mat


## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://8bitdnd.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - I created html pages for all the basic function of the app
- [x] **Proper HTML element usage** - I used a variety of element types
- [x] **Links** - I created a menu page with links to other pages in the app
- [x] **Text** - I included text in the header, footer, and placeholders
- [x] **3rd party API placeholder** - see **Images**
- [x] **Images** - I included a placeholder image for the eventual API call for new images every page refresh
- [x] **Login placeholder** - I placed a login placeholder on the front page
- [x] **DB data placeholder** - I mocked up the character sheet which will use a database to store user data in tabletop.html
- [x] **WebSocket placeholder** - I mocked up the game mat which will use websockets in tabletop.html

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Header, footer, and main content body** - I added styling for all headers, footers, and main content
- [x] **Navigation elements** - I added a main menu page as well as nav tags in the header on every page
- [x] **Responsive to window resizing** - I used flex boxes and added a landscape warning to ensure that the app is used in landscape mode on any device
- [x] **Application elements** - I fleshed out the tabletop page - the main part of the application
- [x] **Application text content** - There is text on every page, mostly placeholder right now
- [x] **Application images** - There is an image that automatically resizes on the tabletop page

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - downloaded vite to directory and tested using npm run dev
- [x] **Components** - ported previous html files to jsx components
- [x] **Router** - used router to speed up loading times

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **All functionality implemented or mocked out** - I implemented a rough draft of the essential features for the site, including a chracter card that updates from local storage based on the character sheet page, login authentication, a fleshed out about page, and tokens that can be dragged and dropped
- [x] **Hooks** - I used useState and useEffect hooks on the tabletop and csheet pages for storing object states. The useState hooks on tabletop will eventually be used to integrate websockets for live token position updates

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Node.js/Express HTTP service** 
- [x] **Static middleware for frontend** - Character Sheet is now saved to individual user profile
- [x] **Calls to third party endpoints** - character name field uses third party fantasy name generator for random name generation
- [x] **Backend service endpoints** - copied/modified simon endpoints for use in app
- [x] **Frontend calls service endpoints** - frontend jsx files call backend 
- [x] **Supports registration, login, logout, and restricted endpoint** - Complete


## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Stores data in MongoDB** - does indeed store data in MongoDB, specifically character sheet data
- [x] **Stores credentials in MongoDB** - able to add and retrieve user credentials

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Backend listens for WebSocket connection**  
- [x] **Frontend makes WebSocket connection**  
- [x] **Data sent over WebSocket connection** - Host can create game rooms for players to join. Host can then upload a map over the websocket connection for use by the room. Each player can customize and move their own tokens and position is updated live for all members of the room. Host can move all tokens as well as create additional ones to stand in for enemies in a combat scenario. 
- [x] **WebSocket data displayed** - live token, map, and room participant updates for all users in a room. 
- [x] **Application is fully functional** - Basic functionality is all there. 
