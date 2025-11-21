# Coding Standards

## Core Standards

- **Languages & Runtimes:** JavaScript ES2022, modern browser APIs
- **Style & Linting:** ESLint with recommended rules, Prettier for formatting
- **Test Organization:** Tests in `src/**/*.test.js` files alongside source

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `GameEngine`, `Ball` |
| Functions/Methods | camelCase | `startLevel`, `calculateTrajectory` |
| Constants | UPPER_SNAKE_CASE | `MAX_KICKS`, `GOAL_REWARD` |
| Variables | camelCase | `currentLevel`, `ballPosition` |
| Files | PascalCase for classes, camelCase for utilities | `GameEngine.js`, `mathUtils.js` |

## Critical Rules

- **Three.js Resource Management:** Always dispose of geometries, materials, and textures when removing objects to prevent memory leaks
- **Game Loop Performance:** Keep update/render logic under 16ms per frame to maintain 60 FPS
- **localStorage Usage:** Always wrap localStorage operations in try-catch (may fail in private browsing)
- **Audio Loading:** Preload audio files on game start to prevent delays during gameplay
- **Event Cleanup:** Remove event listeners when components are destroyed to prevent memory leaks
- **No Console in Production:** Use conditional logging: `if (import.meta.env.DEV) console.log(...)`
