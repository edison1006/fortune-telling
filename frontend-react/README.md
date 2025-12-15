# FutureAlgo - React Frontend

A clean and nature-inspired fortune-telling portal frontend built with **React + Vite**.

## Features

- ✨ Clean, calming UI design
- 🌍 Multi-language support (Chinese, English, Māori)
- 🎯 5 main divination features:
  - Western astrology (zodiac)
  - Chinese Bazi
  - Tarot
  - Palm / face reading
  - Numerology
- 📱 Responsive design, mobile-friendly

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project structure

```
src/
  ├── components/      # React components
  │   ├── Header.jsx
  │   ├── HomePage.jsx
  │   ├── ZodiacPage.jsx
  │   ├── NumerologyPage.jsx
  │   ├── TarotPage.jsx
  │   ├── BaziPage.jsx
  │   └── PalmFacePage.jsx
  ├── utils/           # Utility functions
  │   ├── translations.js
  │   ├── constants.js
  │   └── helpers.js
  ├── App.jsx          # Root app component
  ├── App.css          # Main styles
  └── main.jsx         # Entry file
```

## Design style

The UI uses a fresh, nature-inspired palette:
- Primary: green tones (`#7fb069`)
- Secondary: blue tones (`#6b9bd1`)
- Accent: coral (`#f4a261`)
- Background: light (`#fafbf9`)
