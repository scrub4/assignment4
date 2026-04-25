Hassan Alshabanh – Portfolio Website (Assignment 3)
 
## Project Description
 
A responsive personal portfolio website built with HTML, CSS, and JavaScript.  
Assignment 3 adds two external API integrations, advanced filtering and sorting logic, live weather data, a time-on-site counter, improved form validation, and performance optimizations.
 
---
 
## Features
 
### Core
- Semantic HTML5 structure
- Flexbox layout with responsive design (media queries at 768px)
- Dark mode toggle with `localStorage` persistence
### API Integration
- **Advice/Quote API** – Fetches a random quote from [adviceslip.com](https://api.adviceslip.com) with 5 hardcoded fallback quotes if the API fails
- **Weather API** – Fetches live weather for Dhahran, Saudi Arabia (KFUPM) from [Open-Meteo](https://open-meteo.com) — free, no API key required
### Complex Logic
- Project search + category filter + sort — all three work simultaneously
- Contact form with multi-step validation (empty fields → email format → success)
- Time-on-site counter updating every second
- Time-based greeting (morning / afternoon / evening)
### Performance
- `loading="lazy"` on all images
- Scroll-triggered skill bar animation (fires once using `IntersectionObserver`)
- No unused CSS or JavaScript
---
 
## Folder Structure
 
```
202261640-HassanAlshabanh-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```
 
---
 
## Setup Instructions
 
1. Clone the repository:
   ```bash
   git clone https://github.com/scrub4/202261640-HassanAlshabanh-assignment3
   ```
2. Open the project folder.
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge).
4. No installation, build tools, or backend required.
5. Both APIs (Open-Meteo and Advice Slip) are public and require no API keys.
---
 
## How to Use the Website — Step-by-Step Guide
 
### Dark Mode
1. Click the **"Toggle Theme"** button in the top-right corner of the header.
2. The page switches between light and dark mode instantly.
3. Your preference is saved automatically — if you close and reopen the page, the theme is remembered.
### Projects — Search, Filter, and Sort
1. Scroll to the **Projects** section or click "Projects" in the navigation bar.
2. Type any keyword in the **search box** (e.g., "CSS", "DOM") to filter projects by text.
3. Use the **Category dropdown** to show only Web or JavaScript projects.
4. Use the **Sort dropdown** to order projects A–Z or Z–A by title.
5. All three controls work together — for example: filter by "JavaScript" and sort A–Z at the same time.
6. If no projects match, a red **"No projects match your search"** message appears.
### Contact Form
1. Scroll to the **Contact** section or click "Contact" in the nav.
2. Fill in your **Name**, **Email**, and **Message**.
3. Click **"Send"**.
4. If any field is empty, a red error message appears below the form.
5. If the email address format is invalid (e.g., missing `@`), a specific error message appears.
6. If all fields are valid, the form resets and a green success message appears with your name.
7. The message disappears automatically after 6 seconds.
### Quote of the Moment
1. Scroll to the **Quote** section.
2. A random piece of advice loads automatically when the page opens.
3. Click **"New Quote"** to fetch a different one.
4. If the API is unavailable, a fallback quote from a hardcoded list is shown instead.
### Weather at KFUPM
1. Scroll to the **Weather** section.
2. Current weather for Dhahran loads automatically — temperature, condition, wind speed, and humidity.
3. Click **"Refresh Weather"** to fetch the latest data.
4. If the API fails, an error message is shown instead of blank content.
### Skills Section
1. Scroll down to the **Skills** section.
2. As the section enters the viewport, the progress bars animate from 0% to their target level.
3. The animation plays once per page load.
---
 
## AI Usage Summary
 
AI tools (Claude, ChatGPT, GitHub Copilot) were used for debugging, API integration, code review, and documentation.  
Key contributions: identifying a wrong element targeted by `getElementById`, fixing an invalid HTML id with a space, resolving the search bar layout bug, and recommending Open-Meteo as a no-key weather API.
 
Full details: `docs/ai-usage-report.md`
 
---
 
## Author
 
Hassan Alshabanh  
KFUPM Student — ICS Department
