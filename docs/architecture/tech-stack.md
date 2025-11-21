# Tech Stack

## Cloud Infrastructure

- **Provider:** Static Hosting (GitHub Pages, Vercel, or Netlify)
- **Key Services:** Static file hosting, CDN for asset delivery
- **Deployment Regions:** Global CDN (provider-dependent)

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Language** | JavaScript | ES2022 | Primary development language | Native browser support, no compilation needed |
| **Build Tool** | Vite | 5.x | Development server and build tool | Fast HMR, optimized production builds, excellent DX |
| **3D Framework** | Three.js | r160+ | 3D rendering engine | Industry standard, excellent docs, WebGL abstraction |
| **Physics** | Custom | - | Ball physics and collision detection | Lightweight, game-specific physics sufficient |
| **State Management** | Custom | - | Game state and player progress | Simple state needs, no need for Redux/MobX overhead |
| **Storage** | localStorage API | Native | Player progress persistence | Built-in browser API, no backend needed |
| **Audio** | Web Audio API / HTML5 Audio | Native | Sound effects and music | Native browser support, no external dependencies |
| **Styling** | CSS3 | - | UI styling | Native, no framework overhead needed |
| **Testing** | Vitest | Latest | Unit testing | Fast, Vite-native, good TypeScript support |
| **Package Manager** | npm | 10.x | Dependency management | Standard Node.js tooling |
