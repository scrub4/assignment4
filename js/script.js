// Run after page loads
document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     1. Dynamic Footer Year
  ========================== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================
     2. Time-Based Greeting
  ========================== */
  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    const hour = new Date().getHours();

    if (hour < 12) {
      greetingEl.textContent = "Good morning!";
    } else if (hour < 18) {
      greetingEl.textContent = "Good afternoon!";
    } else {
      greetingEl.textContent = "Good evening!";
    }
  }

  /* =========================
     3. Contact Form Validation
  ========================== */
  function showFormMessage(formEl, text, type) {
    const existing = document.getElementById("formMessage");
    if (existing) existing.remove();
 
    const msg = document.createElement("p");
    msg.id = "formMessage";
    msg.textContent = text;
    msg.style.marginTop = "12px";
    msg.style.padding = "10px 14px";
    msg.style.borderRadius = "4px";
    msg.style.fontWeight = "bold";
 
    if (type === "success") {
      msg.style.backgroundColor = "#d4edda";
      msg.style.color = "#155724";
      msg.style.border = "1px solid #c3e6cb";
    } else {
      msg.style.backgroundColor = "#f8d7da";
      msg.style.color = "#721c24";
      msg.style.border = "1px solid #f5c6cb";
    }
 
    formEl.insertAdjacentElement("afterend", msg);
    setTimeout(() => msg.remove(), 6000);
  }
 
  const contactForm = document.getElementById("contactFormEl");
 
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
 
      const name    = document.getElementById("name").value.trim();
      const email   = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
 
      // Check empty fields
      if (name === "" || email === "" || message === "") {
        showFormMessage(contactForm, "Please fill in all fields.", "error");
        return;
      }
 
      // Advanced email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage(contactForm, "Please enter a valid email address.", "error");
        return;
      }
 
      // All fields valid — show confirmation
      contactForm.reset();
      showFormMessage(
        contactForm,
        `Thanks, ${name}! Your message has been sent. I'll get back to you soon.`,
        "success"
      );
    });
  }

  /* =========================
     4. Dark Mode Toggle
  ========================== */
  const themeToggle = document.getElementById("themeToggle");

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {

      document.body.classList.toggle("dark");

      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

    /* =========================
     5. Fetch Quote from Public API
  ========================== */
const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const newQuoteBtn = document.getElementById("newQuoteBtn");
 
  // Fallback quotes in case the API is unavailable
  const fallbackQuotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  ];
 
  function showFallbackQuote() {
    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    if (quoteText) quoteText.textContent = `"${random.quote}"`;
    if (quoteAuthor) quoteAuthor.textContent = `— ${random.author}`;
  }
 
  function fetchQuote() {
    if (!quoteText) return;
 
    quoteText.textContent = "Loading...";
    if (quoteAuthor) quoteAuthor.textContent = "";
 
    fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then(function (data) {
        // adviceslip returns { slip: { id, advice } }
        quoteText.textContent = `"${data.slip.advice}"`;
        if (quoteAuthor) quoteAuthor.textContent = "— Advice Slip";
      })
      .catch(function () {
        // API failed — show a hardcoded fallback instead
        showFallbackQuote();
      });
  }
 
  fetchQuote();
 
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", fetchQuote);
  }
 
 
  /* =========================
     6. Project Search Filter
  ========================== */
  const searchInput  = document.getElementById("projectSearch");
  const filterSelect = document.getElementById("projectFilter");
  const sortSelect   = document.getElementById("projectSort");
  const projectsContainer = document.getElementById("projects");
  const noResults    = document.getElementById("noResults");
 
  function applyProjectControls() {
    const query    = searchInput  ? searchInput.value.trim().toLowerCase()  : "";
    const category = filterSelect ? filterSelect.value                       : "all";
    const sortVal  = sortSelect   ? sortSelect.value                         : "default";
 
    // Get fresh list of articles each time
    const articles = Array.from(projectsContainer
      ? projectsContainer.querySelectorAll("article")
      : []);
 
    // 1. Filter by search text AND category
    articles.forEach(function (article) {
      const text     = article.textContent.toLowerCase();
      const cat      = article.getAttribute("data-category") || "";
      const matchSearch   = text.includes(query);
      const matchCategory = category === "all" || cat === category;
      article.style.display = (matchSearch && matchCategory) ? "block" : "none";
    });
 
    // 2. Sort visible articles
    const visible = articles.filter(a => a.style.display !== "none");
 
    visible.sort(function (a, b) {
      const titleA = (a.getAttribute("data-title") || "").toLowerCase();
      const titleB = (b.getAttribute("data-title") || "").toLowerCase();
      if (sortVal === "az") return titleA.localeCompare(titleB);
      if (sortVal === "za") return titleB.localeCompare(titleA);
      return 0; // default order
    });
 
    // Re-append in sorted order
    visible.forEach(article => projectsContainer.appendChild(article));
 
    // 3. No-results message
    if (noResults) {
      const allHidden = articles.every(a => a.style.display === "none");
      noResults.style.display = allHidden ? "block" : "none";
    }
  }
 
  if (searchInput)  searchInput.addEventListener("input",  applyProjectControls);
  if (filterSelect) filterSelect.addEventListener("change", applyProjectControls);
  if (sortSelect)   sortSelect.addEventListener("change",   applyProjectControls);

 
  /* 
     7. Skills Progress Bar Animation
        (triggers when section scrolls into view)
  */
  const skillBars = document.querySelectorAll(".skill-bar-fill");
 
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute("data-level");
          bar.style.width = level + "%";
          observer.unobserve(bar); // animate only once
        }
      });
    },
    { threshold: 0.3 }
  );
 
  skillBars.forEach(function (bar) {
    observer.observe(bar);
  });

  /* =========================
     8. Time-on-Site Timer
  ========================== */
  const timerDisplay = document.getElementById("timerDisplay");
 
  if (timerDisplay) {
    let seconds = 0;
    setInterval(function () {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerDisplay.textContent = mins > 0
        ? `⏱ Time on site: ${mins}m ${secs}s`
        : `⏱ Time on site: ${secs}s`;
    }, 1000);
  }

    /* =========================
     9. Weather API – Open-Meteo (no API key required)
        Location: KFUPM, Dhahran, Saudi Arabia
        Lat: 26.3044, Lon: 50.1535
  ========================== */
  const weatherStatus    = document.getElementById("weatherStatus");
  const weatherInfo      = document.getElementById("weatherInfo");
  const weatherTemp      = document.getElementById("weatherTemp");
  const weatherDesc      = document.getElementById("weatherDesc");
  const weatherWind      = document.getElementById("weatherWind");
  const weatherHumidity  = document.getElementById("weatherHumidity");
  const refreshWeatherBtn = document.getElementById("refreshWeatherBtn");

  // Maps Open-Meteo WMO weather codes to readable descriptions
  function getWeatherDescription(code) {
    const descriptions = {
      0: "Clear sky ☀️",
      1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
      45: "Foggy 🌫️", 48: "Foggy 🌫️",
      51: "Light drizzle 🌦️", 53: "Drizzle 🌦️", 55: "Heavy drizzle 🌧️",
      61: "Slight rain 🌧️", 63: "Rain 🌧️", 65: "Heavy rain 🌧️",
      80: "Slight showers 🌦️", 81: "Showers 🌦️", 82: "Heavy showers 🌧️",
      95: "Thunderstorm ⛈️", 99: "Thunderstorm with hail ⛈️"
    };
    return descriptions[code] || "Unknown conditions";
  }

  function fetchWeather() {
    if (!weatherStatus) return;

    weatherStatus.textContent = "Loading weather...";
    weatherStatus.style.display = "block";
    if (weatherInfo) weatherInfo.style.display = "none";

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=26.3044&longitude=50.1535" +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&temperature_unit=celsius&wind_speed_unit=kmh&timezone=Asia%2FRiyadh";

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("Weather fetch failed");
        return response.json();
      })
      .then(function (data) {
        const current = data.current;
        const temp    = current.temperature_2m;
        const code    = current.weather_code;
        const wind    = current.wind_speed_10m;
        const humidity = current.relative_humidity_2m;

        if (weatherTemp)     weatherTemp.textContent     = `${temp}°C`;
        if (weatherDesc)     weatherDesc.textContent     = getWeatherDescription(code);
        if (weatherWind)     weatherWind.textContent     = `💨 Wind: ${wind} km/h`;
        if (weatherHumidity) weatherHumidity.textContent = `💧 Humidity: ${humidity}%`;

        weatherStatus.style.display = "none";
        if (weatherInfo) weatherInfo.style.display = "block";
      })
      .catch(function () {
        weatherStatus.textContent = "⚠️ Could not load weather data. Please try again.";
        weatherStatus.style.display = "block";
        if (weatherInfo) weatherInfo.style.display = "none";
      });
  }

  fetchWeather();

  if (refreshWeatherBtn) {
    refreshWeatherBtn.addEventListener("click", fetchWeather);
  }
});

 