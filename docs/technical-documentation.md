# Technical Documentation – Assignment 3

## Overview

A responsive personal portfolio website built with HTML5, CSS3, and Vanilla JavaScript.  
Assignment 3 adds two external API integrations, advanced project filtering/sorting, live weather data, a time-on-site counter, improved form validation, and performance optimizations.

---

## Technologies Used

| Technology | Version / Notes | Purpose |
|---|---|---|
| HTML5 | Standard | Page structure and semantics |
| CSS3 | Flexbox + Media Queries | Layout and responsive design |
| JavaScript | ES6 (Vanilla, no frameworks) | All interactivity and API calls |
| Open-Meteo API | Free, no key required | Live weather data |
| Advice Slip API | Free, no key required | Random quote/advice |

---

## Folder Structure

```
id-name-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── KFUPM_seal.png
│       ├── download.png
│       └── doto.png
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

---

## HTML Structure

| Section | ID | Key Elements |
|---|---|---|
| Header | — | `#greeting`, `#themeToggle`, nav links |
| About | `about` | `#timerDisplay`, profile image |
| Projects | `projects-section` | `#projectControls`, `#projects`, `#noResults` |
| Skills | `skills` | `.skill-bar-fill[data-level]` elements |
| Quote | `quote` | `#quoteText`, `#quoteAuthor`, `#newQuoteBtn` |
| Weather | `weather` | `#weatherStatus`, `#weatherInfo`, `#refreshWeatherBtn` |
| Contact | `contactForm` | `<form id="contactFormEl">` |
| Hobbies | `hobbies` | Static paragraph |
| Learning Goals | `learning-goals` | Static paragraph |

**Critical id decisions:**
- `<section id="contactForm">` — used for the nav anchor `href="#contactForm"`
- `<form id="contactFormEl">` — targeted by `getElementById("contactFormEl")` in JS; only `<form>` elements fire `submit` events
- `id="learning-goals"` — corrected from `id="Learning Goals"`; spaces are invalid in HTML id values

---

## CSS Implementation

### Layout Strategy
```css
/* Project controls sit ABOVE the flex grid, never beside cards */
#projectControls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  max-width: 700px;
}

/* Override global "input { width: 100% }" using higher specificity */
#projectControls input,
#projectControls select {
  flex: 1 1 160px;
  width: auto;   /* critical: prevents controls from overflowing */
  margin: 0;
}
```

### Dark Mode
```css
body.dark { background-color: #111; color: white; }
body.dark header { background-color: #000; }
body.dark .skill-bar-fill { background-color: white; }
body.dark #quote { background-color: #222; border-left-color: white; }
```
Applied by toggling the `.dark` class on `<body>` via JavaScript.

### Skill Bar Animation
```css
.skill-bar-fill {
  width: 0%;                        /* starts hidden */
  transition: width 1s ease-in-out; /* JS sets width → CSS animates it */
}
```

### Responsive Breakpoint (768px)
```css
@media (max-width: 768px) {
  header { flex-direction: column; align-items: flex-start; }
  #projects { flex-direction: column; }
  #projects article { width: 100%; }
  #projectControls { flex-direction: column; }
}
```

---

## JavaScript Functionality

All code runs inside `document.addEventListener("DOMContentLoaded", function() { ... })`.

### 1. Dynamic Footer Year
```js
document.getElementById("year").textContent = new Date().getFullYear();
```

### 2. Time-Based Greeting
```js
const hour = new Date().getHours();
if (hour < 12) greetingEl.textContent = "Good morning!";
else if (hour < 18) greetingEl.textContent = "Good afternoon!";
else greetingEl.textContent = "Good evening!";
```

### 3. Contact Form Validation
Three-step validation chain:
```js
// Step 1: empty field check
if (name === "" || email === "" || message === "") {
  showFormMessage(contactForm, "Please fill in all fields.", "error");
  return;
}
// Step 2: email format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  showFormMessage(contactForm, "Please enter a valid email address.", "error");
  return;
}
// Step 3: success
contactForm.reset();
showFormMessage(contactForm, `Thanks, ${name}! ...`, "success");
```

`showFormMessage(formEl, text, type)` inserts a `<p>` after the form and auto-removes it after 6 seconds.

### 4. Dark Mode Toggle
```js
document.body.classList.toggle("dark");
const isDark = document.body.classList.contains("dark");
localStorage.setItem("theme", isDark ? "dark" : "light");
```
On load: `if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");`

### 5. Quote API – adviceslip.com
```
GET https://api.adviceslip.com/advice
Response: { slip: { id: 1, advice: "..." } }
```
- Shows "Loading..." while fetching
- On success: displays `data.slip.advice`
- On failure: picks a random quote from 5 hardcoded fallbacks

### 6. Weather API – Open-Meteo
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=26.3044
  &longitude=50.1535
  &current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code
  &temperature_unit=celsius
  &wind_speed_unit=kmh
  &timezone=Asia/Riyadh

Response: {
  current: {
    temperature_2m: 34.5,
    weather_code: 0,
    wind_speed_10m: 12.3,
    relative_humidity_2m: 45
  }
}
```
Weather codes are mapped to descriptions:
```js
function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅",
    3: "Overcast ☁️", 61: "Slight rain 🌧️", 95: "Thunderstorm ⛈️"
    // ... full table in script.js
  };
  return descriptions[code] || "Unknown conditions";
}
```
On failure: displays `"⚠️ Could not load weather data. Please try again."`

### 7. Project Search + Filter + Sort
```js
function applyProjectControls() {
  const query    = searchInput.value.trim().toLowerCase();
  const category = filterSelect.value;   // "all" | "web" | "javascript"
  const sortVal  = sortSelect.value;     // "default" | "az" | "za"

  articles.forEach(function(article) {
    const matchSearch   = article.textContent.toLowerCase().includes(query);
    const matchCategory = category === "all" || article.dataset.category === category;
    article.style.display = (matchSearch && matchCategory) ? "block" : "none";
  });

  // Sort and re-append visible articles
  const visible = articles.filter(a => a.style.display !== "none");
  visible.sort((a, b) => {
    if (sortVal === "az") return a.dataset.title.localeCompare(b.dataset.title);
    if (sortVal === "za") return b.dataset.title.localeCompare(a.dataset.title);
    return 0;
  });
  visible.forEach(article => projectsContainer.appendChild(article));
}
```
All three controls share one listener-triggered function.

### 8. Skills Progress Bar Animation
```js
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.getAttribute("data-level") + "%";
      observer.unobserve(entry.target); // fires only once
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => observer.observe(bar));
```

### 9. Time-on-Site Timer
```js
let seconds = 0;
setInterval(function() {
  seconds++;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = mins > 0
    ? `⏱ Time on site: ${mins}m ${secs}s`
    : `⏱ Time on site: ${secs}s`;
}, 1000);
```

---

## Testing

All features were tested manually in the browser. No automated test framework was used.

### Contact Form
| Test Case | Input | Expected Result | Pass |
|---|---|---|---|
| Empty submission | All fields blank | Red "Please fill in all fields" message | ✅ |
| Invalid email | `name=test, email=notanemail, message=hi` | Red "Please enter a valid email address" message | ✅ |
| Valid submission | All fields correctly filled | Green success message, form resets | ✅ |
| Message auto-removal | Wait 6 seconds after message appears | Message disappears automatically | ✅ |

### Project Controls
| Test Case | Action | Expected Result | Pass |
|---|---|---|---|
| Search match | Type "portfolio" | Only Portfolio Website card shown | ✅ |
| Search no match | Type "xyzxyz" | Red "No projects match" message shown | ✅ |
| Category filter | Select "JavaScript" | Only To-Do List card shown | ✅ |
| Sort A–Z | Select "Sort: A–Z" | Portfolio Website appears before To-Do List | ✅ |
| Combined | Filter "Web" + Sort Z–A | Web projects sorted correctly | ✅ |

### Dark Mode
| Test Case | Action | Expected Result | Pass |
|---|---|---|---|
| Toggle on | Click "Toggle Theme" | Page switches to dark mode | ✅ |
| Toggle off | Click "Toggle Theme" again | Page switches back to light mode | ✅ |
| Persistence | Reload page after enabling dark mode | Dark mode remains active | ✅ |

### APIs
| Test Case | Expected Result | Pass |
|---|---|---|
| Quote loads on page open | A quote appears within 2 seconds | ✅ |
| New Quote button | Different quote fetched and displayed | ✅ |
| Weather loads on page open | Temperature and conditions shown | ✅ |
| Refresh Weather button | Updated data fetched | ✅ |

### Responsive Design
| Test Case | Expected Result | Pass |
|---|---|---|
| Viewport 375px (mobile) | Header stacks vertically, cards go full-width | ✅ |
| Viewport 768px (tablet) | Transition between layouts works correctly | ✅ |
| Viewport 1280px (desktop) | Full side-by-side layout | ✅ |

---

## Limitations

- Contact form is front-end only — no email is actually sent
- Weather refreshes only on page load or button click, not on a timer
- No automated tests — all testing done manually in the browser
- No IE11 support (uses ES6: arrow functions, template literals, `const`/`let`)
- Tested in Chrome and Firefox only

---

## Conclusion

This project demonstrates core front-end skills: semantic HTML, responsive CSS, Vanilla JavaScript, two external API integrations with proper error handling, multi-condition filtering and sorting logic, and persistent state management. The testing table above confirms all major features work as expected across different scenarios and screen sizes.
