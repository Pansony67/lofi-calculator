# 🎵 Lofi Calculator

A calculator that doesn't feel like a calculator. Built with a chill lofi aesthetic — animated dusk background, ambient music, soft neon buttons, and a set of genuinely useful financial tools underneath the vibe.

**Live demo → [lofi-calculator.vercel.app](https://lofi-calculator.vercel.app)**

<!-- SCREENSHOT: add a screenshot of the app here later -->
<!-- ![Lofi Calculator screenshot](./screenshot.png) -->

---

## ✨ Features

- **Basic mode** — standard arithmetic plus scientific functions (√, x², 1/x, π)
- **Financial mode** — Time Value of Money solver: enter any four of N, I/Y, PV, PMT, FV and compute the fifth
- **Cash Flow mode** — NPV and IRR calculation from an editable list of cash flows
- **Lofi music player** — built-in ambient tracks with play/pause, next/previous, and volume control
- **Click sounds** — tactile button feedback, with a global mute toggle
- **Light / Dark mode** — switch between a soft daytime palette and a neon night theme
- **Animated background** — a living dusk-to-night scene with moon, hills, and stars
- **Keyboard support** — type numbers and operators directly

---

## 🛠️ Tech Stack

- **React** — UI library
- **TypeScript** — type-safe components and calculation logic
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations

Deployed on **Vercel**.

---

## 🚀 Running Locally

```bash
# clone the repository
git clone https://github.com/Pansony67/lofi-calculator.git
cd lofi-calculator

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open the local URL shown in your terminal (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── component/calculator/   # Calculator UI, keypad, display, music player, contact links
├── hooks/                  # useCalculator, useFinancial, useClickSound
├── utils/                  # calculation logic (basic, financial, sound settings)
└── assets/pages/           # animated lofi background
```

---

## 🎧 Credits

- Music and sound effects sourced from [Pixabay](https://pixabay.com) (royalty-free)

---

## 👤 Author

**Pannadhorn Rugseree**

- GitHub — [@Pansony67](https://github.com/Pansony67)
- LinkedIn — [Pannadhorn Rugseree](https://www.linkedin.com/in/pannadhorn-rugseree-90a8b6403/)
- Email — Pansony67@gmail.com
