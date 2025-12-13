# CS 260 Notes

[My startup - 8bitDND](https://8bitdnd.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 3.217.157.244


## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

Most complicated thing so far is keeping the code looking clean, convention is not enforced at all and it can get super confusing if you don't have your indentation correct

## Syntax/Structure 

# `<!DOCTYPE html>` → Declares the document is HTML5.
Basic tags:
- `<p>` → paragraph 
- `<ol>` → ordered list (numbered) 
- `<ul>` → unordered list (bulleted)  
- `<h1>, <h2>, <h3>` → headings (largest to smallest) 
- `<div>` → generic block-level container 
- `<span>` → inline container (no line breaks)  

# The `<link>` Element
- Used in the `<head>` section.  
- Connects external resources (like CSS files) to the HTML.  

`<link rel="stylesheet" href="styles.css">`

# Displaying Images
Image with hyperlink:
```html
<a href="https://example.com">
  <img src="image.jpg" alt="Example">
</a>
```
# The DOM (Document Object Model)
	•	Tree-like structure of all HTML elements.
	•	Can be modified with JavaScript.
	•	True statements:
        •	The DOM represents the page as objects.
        •	You can modify HTML and CSS through it.
        •	JavaScript interacts with the DOM.


## CSS

AI is great for creating a skeleton of the layout you want to use but struggles with the specifics. It is useful to be familiar with the minutiae so that you can tweak things once you have a rough draft. Definitely split the CSS up into different files and then import all of them into one stylesheet for ease of reference and modularity. None of this matters anyways though because react is going to make a lot of this obsolete. 

## FUNDAMENTALS

# Box Model 

Order from inside to outside:
	1.	Content
	2.	Padding (space between content & border)
	3.	Border
	4.	Margin (space outside the border)

# Padding vs Margin
- Padding: space inside the element's border.
- Margin: space outside the element's border.

# CSS Display Properties
- `div → display: block;` (takes up full width)
- `span → display: inline;` (stays on same line)

## Javascript 

# 🔁 Loops & Conditionals
**If / Else:**
```js
if (x > 0) {
  console.log("positive");
} else {
  console.log("negative");
}
```

**For Loop:**
```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// Output: 0, 1, 2
```
**While Loop:**
```js
while (i < 5) {
  i++;
}
```

**Switch:**
```js
switch(color) {
  case "red": console.log("stop"); break;
  default: console.log("go");
}
```

# 🧮 Arrays and Map
```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```

# 🧱 JavaScript Objects
**Create object:**
```js
const car = { make: "Honda", model: "Civic" };
```
**Add new property:**
```js
car.year = 2020; // ✅ You can add new properties dynamically
```

# 🔎 Selecting and Modifying Elements
**By ID:**
```js
document.getElementById("byu").style.color = "green";
```

**By Selector (#, .):**
```js
document.querySelector("#title");
```

**Event Listener:**
```js
document.getElementById("btn").addEventListener("click", () => {
  console.log("Button clicked");
});
```

# 🪶 JSON (JavaScript Object Notation)
- Lightweight data format for storing/transferring data.
- Example:
  ```json
  {
    "name": "Jack",
    "age": 25
  }
  ```
- Key-value pairs in quotes, similar to JS objects.

## Promises

A **Promise** in JavaScript represents a value that may be available now, later, or never. It’s used for handling **asynchronous operations** — like fetching data from a server.

# 🧠 Promise States
A Promise can be in one of three states:
1. **Pending** – the operation hasn’t completed yet.
2. **Fulfilled** – the operation completed successfully.
3. **Rejected** – the operation failed.

# ✅ Basic Example
```js
const myPromise = new Promise((resolve, reject) => {
  let success = true;
  if (success) {
    resolve("It worked!");
  } else {
    reject("Something went wrong.");
  }
});

myPromise
  .then(result => console.log(result))  // Runs if resolved
  .catch(error => console.error(error)) // Runs if rejected
  .finally(() => console.log("Promise finished"));
```

**Output (if success = true):**
```js
"It worked!"
"Promise finished"
```

# ⚙️ Using Promises with Asynchronous Functions
Example with `setTimeout`:
```js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

delay(1000)
  .then(() => console.log("1 second later..."));
```

# 🌐 Fetch Example
```js
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```

# 🧩 Async / Await Syntax
A cleaner way to work with Promises:
```js
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

# 🧾 Summary
- Promises handle async code more cleanly than nested callbacks.
- Use `.then()` for success, `.catch()` for errors, and `.finally()` for cleanup.
- Use `async`/`await` for more readable asynchronous code.




# 🧠 Changing Text
Given:
```html
<p id="animal">fish</p>
```
JavaScript:
```js
document.getElementById("animal").textContent = "crow";
```

# 🧱 Including JavaScript in HTML
```html
<script src="script.js"></script>
```







## React Part 1: Routing

In the future, if it is known that you will be using react as your framework, make sure to implement your css and html in such a way that it will make it simple to port over. Or, if possible, just start from the beginning using react to save the hassle. 

## Additional Midterm notes

# Ports
- Port 443 is for HTTPS (secure web traffic), port 80 is for HTTP (unsecure web traffic), and port 22 is for SSH (secure remote access). 

# Unix Command Cheat Sheet

# Navigation & Directories

| Command | Meaning | Example | Notes |
|----------|----------|----------|-------|
| `pwd` | Print Working Directory | `pwd` | Shows your current location. |
| `cd` | Change Directory | `cd Documents` | Use `cd ..` to go up one level, `cd ~` to go home. |
| `ls` | List Files | `ls -la` | `-l` = detailed list, `-a` = show hidden files. |
| `mkdir` | Make Directory | `mkdir new_folder` | `-p` creates nested directories. |

---

# File Management

| Command | Meaning | Example | Notes |
|----------|----------|----------|-------|
| `chmod` | Change File Permissions | `chmod +x script.sh` | Adds execute permission. Use numeric modes (e.g. `chmod 755 file`). |
| `mv` | Move or Rename | `mv file.txt newname.txt` | Moves or renames files/folders. |
| `rm` | Remove | `rm -rf folder/` | **Permanent delete!** `-r` for recursive, `-f` to skip confirmation. |

---

# Text Editors

| Command | Meaning | Example | Notes |
|----------|----------|----------|-------|
| `vim` | Open file in Vim | `vim file.txt` | `i` = insert, `Esc` = exit insert mode, `:wq` = save & quit. |
| `nano` | Open file in Nano | `nano file.txt` | `Ctrl+O` = save, `Ctrl+X` = exit. Easier than Vim. |

---

# System & Info

| Command | Meaning | Example | Notes |
|----------|----------|----------|-------|
| `man` | Manual Page | `man ls` | Press `q` to quit. |
| `ps` | Process Status | `ps aux` | Shows active processes. Use `grep` to filter (e.g. `ps aux | grep node`). |
| `sudo` | Superuser Do | `sudo apt update` | Run commands as admin (will ask for password). |

---

# Networking

| Command | Meaning | Example | Notes |
|----------|----------|----------|-------|
| `ssh` | Secure Shell | `ssh user@host` | Connects to a remote machine. |
| `wget` | Web Get | `wget https://example.com/file.zip` | Downloads a file from the web. |

## Other
- By default, the HTML `<span>` element has a CSS display property value of: inline
- A DNS A record can only point to an IP address, not another A record.
- `===` is strict equality, type and value

## React Part 2: Reactivity


## FINAL TOPICS

## 1. What is the default port for HTTP/HTTPS/SSH?  
- **HTTP:** `80`  
- **HTTPS:** `443`  
- **SSH:** `22`  

---

## 2. What does an HTTP status code in the range of 300/400/500 indicate?  
- **300–399 (Redirection):** Client must take additional action (e.g., `301 Moved Permanently`, `302 Found`).  
- **400–499 (Client Errors):** Request is invalid (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).  
- **500–599 (Server Errors):** Server failed to process request (e.g., `500 Internal Server Error`, `503 Service Unavailable`).  

---

## 3. What does the HTTP header content-type allow you to do?  
- Tells the client or server **how to interpret the body of the request/response**.  
- Examples:  
  - `application/json` → parse JSON  
  - `text/html` → render HTML  
  - `application/x-www-form-urlencoded` → parse form data  
  - `multipart/form-data` → file uploads  

---

## 4. What does a “Secure cookie”/”Http-only cookie”/”Same-site cookie” do?  
- **Secure cookie:** Sent only over HTTPS, prevents interception over HTTP.  
- **HttpOnly cookie:** Not accessible via JavaScript (`document.cookie`), protects against XSS.  
- **SameSite cookie:** Controls cross-site request behavior:  
  - `Strict` → only same-site requests  
  - `Lax` → top-level navigation allowed  
  - `None` → cross-site allowed (requires Secure)  

---

## 5. Assuming the following Express middleware, what would be the console.log output for an HTTP GET request with a URL path of /document?
- If the middleware is:
  ```js
  app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
  });
  ```
  The output for a GET request to `/document` would be:
  ```
  GET /document
  ```
  If there are multiple middleware, each can log different things (e.g., headers, query params, etc.).

---

## 6. Given the following Express service code: What does the following front end JavaScript that performs a fetch return?
- If the Express route is:
  ```js
  app.get('/api/hello', (req, res) => {
    res.json({msg: "hello"});
  });
  ```
  And the frontend code is:
  ```js
  fetch('/api/hello')
    .then(res => res.json())
    .then(data => console.log(data));
  ```
  The console will log:
  ```js
  { msg: "hello" }
  ```
  If the route returns a different status or content-type, the result will differ.

---

## 7. Given the following MongoDB query, select all of the matching documents {name:Mark}
- Query:
  ```js
  db.collection.find({ name: "Mark" })
  ```
  Example documents:
  ```json
  { "name": "Mark", "age": 25 }
  { "name": "Mark", "city": "NYC" }
  ```
  Only documents where the `name` field is exactly `"Mark"` will match. Documents with `name: "mark"` (lowercase) or without a `name` field will not match.

---

## 8. How should user passwords be stored?
- Passwords should **never** be stored in plain text. Instead, use a secure, salted hash:
  - Example with bcrypt:
    ```js
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 10); // 10 = salt rounds
    // Store 'hash' in the database
    ```
  - To verify:
    ```js
    const isMatch = await bcrypt.compare(enteredPassword, storedHash);
    ```
  - This protects users even if the database is compromised.

---

## 9. Assuming the following node.js websocket code in the back end, and the following front end websocket code, what will the front end log to the console?
- Backend:
  ```js
  ws.on('connection', socket => {
    socket.send('hello');
  });
  ```
- Frontend:
  ```js
  const ws = new WebSocket('ws://localhost:3000');
  ws.onmessage = event => console.log(event.data);
  ```
- The frontend will log:
  ```
  hello
  ```
  (Or whatever string/object the backend sends.)

---

## 10. What is the websocket protocol intended to provide?
- WebSocket provides **full-duplex, real-time communication** between client and server over a single, long-lived connection.
- Example: Live chat, multiplayer games, collaborative editing.
- Unlike HTTP, both client and server can send messages at any time.

---

## 11. What do the following acronyms stand for? JSX, JS, AWS, NPM, NVM
- **JSX:** JavaScript XML (syntax extension for React, allows writing HTML-like code in JS)
- **JS:** JavaScript (programming language)
- **AWS:** Amazon Web Services (cloud computing platform)
- **NPM:** Node Package Manager (manages JS packages)
- **NVM:** Node Version Manager (manages multiple Node.js versions)

---

## 12. Assuming an HTML document with a body element. What text content will the following React component generate?  The react component will use parameters.
- Example component:
  ```js
  function Hello(props) {
    return <div>Hello, {props.name}!</div>;
  }
  ```
  Usage:
  ```js
  <Hello name="World" />
  ```
  Output:
  ```
  Hello, World!
  ```
  The output is the rendered text content of the component, with parameters (props) filled in.

---

## 13. Given a set of React components that include each other, what will be generated
- The result is a **tree of HTML elements**. For example:
  ```js
  function A() { return <B />; }
  function B() { return <C />; }
  function C() { return <div>Hi</div>; }
  ```
  The final output is:
  ```html
  <div>Hi</div>
  ```
  (with the actual DOM tree reflecting the component hierarchy)

---

## 14. What does a React component with React.useState do?
- Example:
  ```js
  function Counter() {
    const [count, setCount] = React.useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  ```
- `useState` creates a state variable (`count`) that persists across renders. Updating it with `setCount` triggers a re-render.

---

## 15. What are React Hooks used for?
- Hooks let you **use state, lifecycle, and other React features** in function components.
- Example:
  ```js
  const [value, setValue] = React.useState('');
  React.useEffect(() => { /* side effect */ }, []);
  ```

---

## 16. What does the State Hook/Context Hook/Ref Hook/Effect Hook/Performance Hook do? https://react.dev/reference/react/hooks
- **State Hook (`useState`)**: Adds state to a function component.
  ```js
  const [count, setCount] = useState(0);
  ```
- **Context Hook (`useContext`)**: Accesses context values from a provider.
  ```js
  const theme = useContext(ThemeContext);
  ```
- **Ref Hook (`useRef`)**: Persists a mutable value across renders, often for DOM refs.
  ```js
  const inputRef = useRef();
  ```
- **Effect Hook (`useEffect`)**: Runs side effects after render (e.g., data fetching, subscriptions).
  ```js
  useEffect(() => { document.title = `Count: ${count}`; }, [count]);
  ```
- **Performance Hook (`useMemo`, `useCallback`)**: Memoizes values/functions to optimize performance.
  ```js
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

---

## 17. Given React Router code, select statements that are true.
- Example:
  ```js
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
  ```
- True statements:
  - React Router enables client-side routing.
  - Navigation does not reload the page.
  - The component rendered depends on the URL path.

---

## 18. What does the package.json file do?
- Describes your Node.js project, lists dependencies, scripts, and metadata.
- Example:
  ```json
  {
    "name": "my-app",
    "version": "1.0.0",
    "dependencies": { "react": "^18.0.0" },
    "scripts": { "start": "node index.js" }
  }
  ```

---

## 19. What does the fetch function do?
- Performs HTTP requests from JavaScript, returning a Promise that resolves to the response.
- Example:
  ```js
  fetch('/api/data')
    .then(res => res.json())
    .then(data => console.log(data));
  ```

---

## 20. What does node.js do?
- Node.js lets you run JavaScript on the server, outside the browser.
- Example: You can build web servers, APIs, CLI tools, etc., all in JS.

---

## 21. What does pm2 do?
- PM2 is a process manager for Node.js apps, used to keep them running, restart on failure, and manage logs.
- Example:
  ```sh
  pm2 start index.js --name my-app
  pm2 logs my-app
  pm2 restart my-app
  ```

---

## 22. What does Vite do?
- Vite is a modern frontend build tool that provides fast development server and optimized production builds for web projects.
- Example:
  - `npm run dev` starts a lightning-fast dev server with hot reload.
  - `npm run build` creates a production-ready `dist/` folder.

---


