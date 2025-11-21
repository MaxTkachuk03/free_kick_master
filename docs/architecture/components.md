# Components

## GameEngine

**Responsibility:** Main game loop coordinator, initializes all systems, manages frame updates and rendering.

**Key Interfaces:**
- `init()` - Initialize game engine and all systems
- `start()` - Start game loop
- `stop()` - Stop game loop
- `update(deltaTime)` - Update game logic
- `render()` - Render frame

**Dependencies:** Three.js Renderer, GameLogic, StateManager, AudioManager

**Technology Stack:** JavaScript, Three.js

## ThreeJSRenderer

**Responsibility:** Manages Three.js scene, camera, lighting, and all 3D object rendering.

**Key Interfaces:**
- `createScene()` - Initialize Three.js scene
- `addObject(object)` - Add 3D object to scene
- `removeObject(object)` - Remove 3D object from scene
- `updateCamera(position, target)` - Update camera position
- `render()` - Render current frame
- `resize(width, height)` - Handle window resize

**Dependencies:** Three.js library

**Technology Stack:** Three.js r160+, WebGL

## GameLogic

**Responsibility:** Core game mechanics - ball physics, collision detection, scoring, level progression.

**Key Interfaces:**
- `startLevel(levelId)` - Initialize and start a level
- `processKick(direction, power)` - Process player kick input
- `updateBall(deltaTime)` - Update ball physics
- `checkCollisions()` - Detect collisions (goal, obstacles, ground)
- `calculateScore(result)` - Calculate coins earned
- `completeLevel()` - Handle level completion

**Dependencies:** StateManager, LevelManager, PhysicsEngine

**Technology Stack:** JavaScript, Custom physics

## PhysicsEngine

**Responsibility:** Handles ball trajectory calculations, gravity, and collision detection.

**Key Interfaces:**
- `calculateTrajectory(startPos, direction, power)` - Calculate ball path
- `updatePosition(currentPos, velocity, deltaTime)` - Update position based on physics
- `checkGoalCollision(ballPos, goalBounds)` - Check if ball entered goal
- `checkObstacleCollision(ballPos, obstacles)` - Check obstacle collisions

**Dependencies:** None (pure calculations)

**Technology Stack:** JavaScript, Vector math

## StateManager

**Responsibility:** Manages game state, player progress, and localStorage persistence.

**Key Interfaces:**
- `getProgress()` - Get player progress from storage
- `saveProgress(progress)` - Save player progress
- `updateCoins(amount)` - Update coin balance
- `unlockLevel(levelId)` - Unlock a level
- `purchaseItem(type, itemId, cost)` - Handle shop purchases
- `getGameState()` - Get current game session state
- `setGameState(state)` - Update game session state

**Dependencies:** localStorage API

**Technology Stack:** JavaScript, localStorage

## LevelManager

**Responsibility:** Loads and manages level configurations, creates level objects.

**Key Interfaces:**
- `loadLevel(levelId)` - Load level configuration
- `createLevelObjects(levelConfig)` - Create 3D objects for level
- `getLevelConfig(levelId)` - Get level configuration data

**Dependencies:** ThreeJSRenderer, LevelConfig data

**Technology Stack:** JavaScript, Three.js

## UIManager

**Responsibility:** Manages all UI screens (menus, HUD, shop, results), handles user input.

**Key Interfaces:**
- `showScreen(screenName)` - Display a UI screen
- `updateHUD(data)` - Update in-game HUD
- `showRewardNotification(amount, reason)` - Show coin reward notification
- `handleMenuNavigation(action)` - Handle menu button clicks

**Dependencies:** StateManager, GameEngine

**Technology Stack:** HTML5, CSS3, JavaScript

## AudioManager

**Responsibility:** Manages sound effects and background music playback.

**Key Interfaces:**
- `playSound(soundId)` - Play sound effect
- `playMusic(musicId, loop)` - Play background music
- `setVolume(volume)` - Set audio volume
- `stopMusic()` - Stop background music

**Dependencies:** Web Audio API / HTML5 Audio

**Technology Stack:** Web Audio API, HTML5 Audio

## InputHandler

**Responsibility:** Handles mouse input for kick direction/power, UI interactions.

**Key Interfaces:**
- `onMouseMove(callback)` - Register mouse move handler
- `onMouseClick(callback)` - Register mouse click handler
- `getMouseWorldPosition()` - Convert screen coordinates to 3D world position
- `calculateKickParameters(mousePos, ballPos)` - Calculate kick direction and power

**Dependencies:** Three.js (for coordinate conversion)

**Technology Stack:** JavaScript, DOM Events
