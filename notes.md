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

### 🧠 Promise States
A Promise can be in one of three states:
1. **Pending** – the operation hasn’t completed yet.
2. **Fulfilled** – the operation completed successfully.
3. **Rejected** – the operation failed.

### ✅ Basic Example
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

### ⚙️ Using Promises with Asynchronous Functions
Example with `setTimeout`:
```js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

delay(1000)
  .then(() => console.log("1 second later..."));
```

### 🌐 Fetch Example
```js
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```

### 🧩 Async / Await Syntax
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


## React Part 2: Reactivity
