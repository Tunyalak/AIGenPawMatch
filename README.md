# 🐾 PawMatch

A mobile-first Tinder-like app for connecting dogs and their owners for playdates! Built with Angular 20, standalone components, signals, and Angular Material.

## ✨ Features

- **5 Main Screens**:

  - 🔐 Sign In - Email/password and social authentication
  - 👋 Welcome - Onboarding with feature highlights
  - 📝 Register Dog - Multi-step reactive form with validations
  - 👤 Profile - User and dog profile management
  - ❤️ Match & Swipe - Tinder-style dog matching with smooth animations

- **Swipe Mechanics**:

  - Swipe **left** = Pass ❌
  - Swipe **right** = Like ❤️
  - Swipe **up** = Favorite ⭐
  - Smooth animations with rotation and overlay labels
  - Undo last swipe functionality

- **Advanced Filtering**:

  - Location radius (km)
  - Breed selection
  - Age range
  - Size (small, medium, large, extra-large)
  - Energy level (low, moderate, high, very-high)
  - Activities (multi-select)

- **Technical Highlights**:
  - Angular 20 with standalone components
  - Signals for reactive state management
  - Angular Material with custom PawMatch theme (#F6A51F / #FF8A00)
  - Mock API with 20 seed dogs
  - LocalStorage persistence
  - Responsive mobile-first design
  - Route guards for authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 20+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200/`

### Demo Credentials

```
Email: demo@pawmatch.com
Password: password123
```

## 📦 Available Scripts

```bash
# Development server
npm start          # Runs ng serve

# Build for production
npm run build      # Creates optimized production build

# Run tests
npm test           # Executes unit tests

# Lint code
npm run lint       # Checks code quality
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts          # Route protection
│   ├── models/
│   │   ├── auth.model.ts          # Auth interfaces
│   │   └── dog.model.ts           # Dog & filter interfaces
│   ├── pages/
│   │   ├── sign-in/               # Login page
│   │   ├── welcome/               # Onboarding page
│   │   ├── register-dog/          # Multi-step dog registration
│   │   ├── profile-home/          # User profile & settings
│   │   └── match-swipe/           # Main swipe interface
│   ├── services/
│   │   ├── auth.ts                # Authentication logic
│   │   ├── mock-dog.ts            # Dog data & matching
│   │   ├── storage.ts             # LocalStorage wrapper
│   │   └── swipe-engine.ts        # Swipe mechanics
│   ├── app.config.ts              # App configuration
│   └── app.routes.ts              # Route definitions
├── styles/
│   └── tokens.scss                # Design tokens
└── styles.scss                    # Global styles & theme
```

## 🎨 Design System

**Primary Colors**:

- Orange: `#F6A51F`
- Dark Orange: `#FF8A00`
- Light Background: `#FFF5E6`

**Typography**: Roboto, system fonts

**Component Library**: Angular Material 20

## 🧪 Testing

Unit tests are included for:

- Swipe logic (threshold, rotation, direction detection)
- Form validation (RegisterDog multi-step form)
- Service methods (auth, mock data, storage)

Run tests with:

```bash
npm test
```

## 🔧 Configuration

### Environment

The app uses localStorage for persistence. No backend configuration needed for local development.

### Customization

- **Theme colors**: Edit `src/styles.scss`
- **Design tokens**: Edit `src/styles/tokens.scss`
- **Mock data**: Edit `src/app/services/mock-dog.ts`

## 📱 Responsive Design

The app is optimized for mobile devices (320px+) and scales beautifully on tablets and desktops.

## 🐛 Known Issues

- SSR is enabled but some features (localStorage) are client-only
- Swipe gestures work best on touch devices
- Image URLs use placeholder services (Unsplash)

## 🛣️ Roadmap

- [ ] Real-time chat between matches
- [ ] Push notifications
- [ ] Advanced filter UI (bottom sheet)
- [ ] Photo upload for dog profiles
- [ ] Location-based distance calculation
- [ ] Integration with real backend API

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Built With

- Angular 20
- TypeScript
- Angular Material
- RxJS (via signals)
- SCSS

---

Made with ❤️ for dog lovers everywhere! 🐕

Email: demo@pawmatch.com
Password: password123
