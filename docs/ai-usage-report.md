# AI Usage Report – Assignment 3

## Tools Used & Use Cases

| Tool | How It Was Used |
|---|---|
| **Claude (Anthropic)** | Primary tool. Debugging, code review, fixing grader-flagged bugs, weather API integration, documentation writing |
| **ChatGPT** | Explaining JavaScript concepts (closures, IntersectionObserver, regex), understanding API response structures |
| **GitHub Copilot** | Code completion for repetitive HTML structures (skill bars, project articles, form fields) |

### Specific Tasks Where AI Was Used

**Bug Fixes**
- Identified that `getElementById("contactFormEl")` was targeting the `<section>` instead of the `<form>` — a `<section>` never fires a `submit` event, so validation was silently broken
- Caught `id="Learning Goals"` which contains a space — invalid in HTML, causes `getElementById` to return `null`
- Fixed the search bar appearing beside project cards by moving `#projectControls` outside the flex `#projects` container and adding `width: auto` to override the global `input { width: 100% }` rule

**Code Quality**
- Refactored `showFormMessage()` to accept `formEl` as a parameter instead of capturing an outer variable, making the function self-contained and reusable
- Suggested `loading="lazy"` on all images for performance

**API Integration**
- Recommended Open-Meteo as a free, no-API-key weather service
- Explained the WMO weather code system and helped build the lookup table mapping numeric codes to readable descriptions with emojis
- Structured both API calls with loading state → success state → error/fallback state pattern

**New Features Guided by AI**
- Combined filter + sort + search logic operating simultaneously on project articles
- Time-on-site timer with minute/second formatting

---

## Benefits

- **Speed**: Bugs that could take hours to find manually (wrong element targeted, invalid id) were caught immediately with a clear explanation of why they were wrong
- **Learning**: AI explained the *reason* behind each fix — not just what to change but why `<section>` can't fire `submit`, why spaces break ids, and how CSS specificity caused the layout bug
- **API discovery**: Open-Meteo was suggested as a zero-friction option — no signup, no key, free forever — which was ideal for a student project with no backend
- **Code structure**: AI helped identify that `showFormMessage` depending on an outer variable is a code smell, and explained what a cleaner function signature looks like
- **Documentation**: Helped organize technical documentation into clear sections with code snippets and tables, which improved the score in previous submissions

---

## Challenges

- AI sometimes suggested solutions using `async/await` syntax; I had to convert these to `.then()/.catch()` chains to stay consistent with the rest of my code style
- Some early suggestions were more complex than necessary — I had to ask for simpler versions that matched my current skill level
- AI described the Open-Meteo response structure but I still had to test it manually in the browser to confirm the exact field names (`current.temperature_2m`, `current.weather_code`, etc.)
- Occasionally AI would suggest adding features beyond the assignment scope; I had to stay focused on what the rubric actually required

---

## Risks of Using AI

- **Over-reliance**: If code is copied without understanding it, bugs become very hard to debug later because the developer does not know how the code works. I mitigated this by reading every suggestion carefully and testing it manually.
- **Hallucination**: AI can confidently suggest APIs or methods that do not exist or have changed. The first API suggested in a previous assignment (quotable.io) was shut down and no longer worked. Always test AI-suggested APIs before committing to them.
- **Academic integrity**: Using AI to complete work entirely and submitting it as your own violates academic honesty policies. I used AI as a debugging and learning tool, not as a replacement for my own understanding and effort.
- **Incorrect logic**: AI-generated code can contain subtle logical errors that look correct at first glance. For example, early versions of the filter function did not properly reset hidden articles when the search was cleared — I caught this through manual testing.
- **Outdated information**: AI models have a training cutoff and may suggest deprecated methods, outdated APIs, or old best practices. Always verify against current documentation (MDN, official API docs).

---

## Learning Outcomes

| Concept | What I Learned |
|---|---|
| HTML validity | id attributes must not contain spaces; invalid ids cause `getElementById` to silently return `null` |
| Event types | Only `<form>` elements fire `submit` events — attaching the listener to a `<section>` does nothing |
| CSS specificity | `#projectControls input` overrides `input, textarea, select` because it is more specific |
| API patterns | How to structure fetch calls: loading state → parse response → success state → catch → fallback |
| Function design | Passing dependencies as parameters instead of using closures makes functions reusable and testable |
| IntersectionObserver | How to trigger animations when elements enter the viewport, and why `unobserve()` prevents repeat triggers |
| Regex | How `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` validates email format and what each part means |
| Lazy loading | How `loading="lazy"` defers image downloads until they are near the viewport, improving initial load time |

---

## Responsible Use & Modifications

- All AI suggestions were read and understood before being used — no blind copy-paste
- AI-generated code was adapted to match my existing file structure, variable names, and code style
- Every feature was tested manually in the browser to verify correct behavior
- Documentation was written with AI assistance but reviewed and edited to accurately reflect what was actually built
- AI acted as a tutor and debugger throughout — the understanding, decisions, and final code are my own
