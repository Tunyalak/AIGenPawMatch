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

## � Screenshots

<div align="center">
  <img src="docs/screenshots/welcome-screen.png" width="200" alt="Welcome Screen"/>
  <img src="docs/screenshots/sign-in.png" width="200" alt="Sign In"/>
  <img src="docs/screenshots/register-dog.png" width="200" alt="Register Dog"/>
  <img src="docs/screenshots/match-swipe.png" width="200" alt="Match & Swipe"/>
  <img src="docs/screenshots/match-preferences.png" width="200" alt="Preferences"/>
  <img src="docs/screenshots/profile.png" width="200" alt="Profile"/>
</div>

> **Note:** Screenshots to be added. Please capture the app screens and save them to `docs/screenshots/`

## 🎥 Demo

- **Live Demo:** https://pawmatch.azurewebsites.net
- **Demo Video:** [Coming soon - Record and add to `docs/demo-video.mp4`]
- **Demo Credentials:**
  ```
  Email: demo@pawmatch.com
  Password: password123
  ```

## �🚀 Quick Start

### Prerequisites

- Node.js 22+ and npm
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

## 🤖 AI-Assisted Development

This project was built using AI-assisted development with **GitHub Copilot** and **Claude**, achieving approximately **55% faster development time** while maintaining high code quality.

**Key AI Contributions:**

- Component scaffolding and boilerplate (90% time saved)
- Mock data generation (30 diverse dog profiles)
- Service architecture and implementation
- Animation and gesture logic
- Bug fixing and optimization

**Documentation:**

- 📖 [AI Workflow](./AI-WORKFLOW.md) - Detailed AI-assisted development process
- 📚 [Lessons Learned](./LESSONS-LEARNED.md) - Insights on Angular 20 + AI development
- 📊 [Challenge Validation](./CHALLENGE-VALIDATION.md) - Project compliance checklist

**Tech Stack Innovation:**

- ✅ Angular 20 with Zoneless change detection
- ✅ Signal-based state management (no RxJS for state)
- ✅ Standalone components (no NgModules)
- ✅ Custom Material Design theme
- ✅ Mobile-first responsive design

## 📝 Challenge Submission

**Part of the AI-Assisted Development Challenge**

- **Submission Date:** November 2025
- **Framework:** Angular 20.3.0
- **AI Tools Used:** GitHub Copilot, Claude, ChatGPT
- **Key Features:** Signals, Zoneless, Standalone Components, Material Design
- **Time Saved:** ~55% compared to traditional development
- **Lines of Code:** 9,400+ (TypeScript, HTML, SCSS)

**Compliance Checklist:** See [CHALLENGE-VALIDATION.md](./CHALLENGE-VALIDATION.md) for full compliance report.

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

- Angular 20 (Zoneless + Signals)
- TypeScript 5.9
- Angular Material 20
- SCSS with Design Tokens
- GitHub Copilot (AI assistance)

## 🙏 Acknowledgments

- **GitHub Copilot** - AI development partner
- **Angular Team** - Amazing framework evolution
- **Material Design Team** - Excellent component library
- **Community** - Support and inspiration

## 📚 Additional Resources

- [AI Workflow Documentation](./AI-WORKFLOW.md)
- [Development Lessons Learned](./LESSONS-LEARNED.md)
- [Challenge Validation Report](./CHALLENGE-VALIDATION.md)
- [GitHub Repository](https://github.com/Tunyalak/AIGenPawMatch)
- [Live Demo](https://pawmatch.azurewebsites.net)

---

Made with ❤️ and 🤖 AI for dog lovers everywhere! 🐕
