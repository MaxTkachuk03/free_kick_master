# Test Strategy and Standards

## Testing Philosophy

- **Approach:** Unit tests for critical game logic (physics, scoring, state management)
- **Coverage Goals:** 70%+ for core game logic, minimal coverage for UI/rendering
- **Test Pyramid:** Heavy on unit tests, light on integration tests, no E2E tests for MVP

## Test Types and Organization

### Unit Tests

- **Framework:** Vitest (Vite-native, fast)
- **File Convention:** `*.test.js` alongside source files
- **Location:** Same directory as source files
- **Mocking Library:** Vitest built-in mocks
- **Coverage Requirement:** 70% for `core/`, `physics/`, `game/` directories

**AI Agent Requirements:**
- Generate tests for all public methods in GameLogic, PhysicsEngine, StateManager
- Cover edge cases (boundary conditions, invalid inputs)
- Follow AAA pattern (Arrange, Act, Assert)
- Mock Three.js and localStorage dependencies

### Integration Tests

- **Scope:** Level loading, state persistence, shop purchases
- **Location:** `src/**/*.integration.test.js`
- **Test Infrastructure:**
  - **localStorage:** Mock localStorage API
  - **Three.js:** Use jsdom for DOM, mock Three.js objects

### End-to-End Tests

- **Framework:** N/A for MVP
- **Scope:** N/A
- **Environment:** N/A
- **Test Data:** N/A

## Test Data Management

- **Strategy:** Factory functions for creating test game states
- **Fixtures:** `src/__fixtures__/` directory
- **Factories:** `src/__factories__/` directory
- **Cleanup:** Automatic cleanup in test teardown

## Continuous Testing

- **CI Integration:** Run tests on every commit
- **Performance Tests:** Manual testing for 60 FPS target
- **Security Tests:** N/A (no user data, no backend)
