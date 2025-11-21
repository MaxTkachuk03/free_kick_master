# Source Tree

```
free_kick_master/
├── src/
│   ├── core/
│   │   ├── GameEngine.js          # Main game loop
│   │   ├── GameLogic.js           # Core game mechanics
│   │   └── StateManager.js        # State and persistence
│   ├── rendering/
│   │   ├── ThreeJSRenderer.js     # Three.js wrapper
│   │   ├── SceneManager.js        # Scene setup
│   │   └── CameraController.js    # Camera management
│   ├── physics/
│   │   ├── PhysicsEngine.js       # Ball physics
│   │   └── CollisionDetector.js   # Collision detection
│   ├── game/
│   │   ├── Ball.js                # Ball component
│   │   ├── Goal.js                # Goal component
│   │   ├── Goalkeeper.js          # Goalkeeper AI
│   │   ├── Wall.js                # Wall obstacle
│   │   └── Target.js              # Moving targets
│   ├── levels/
│   │   ├── LevelManager.js        # Level loading
│   │   ├── Level1.js              # Level 1 config
│   │   ├── Level2.js              # Level 2 config
│   │   ├── Level3.js              # Level 3 config
│   │   ├── Level4.js              # Level 4 config
│   │   └── Level5.js              # Level 5 config
│   ├── ui/
│   │   ├── UIManager.js           # UI controller
│   │   ├── screens/
│   │   │   ├── MainMenu.js        # Main menu screen
│   │   │   ├── LevelSelect.js     # Level selection
│   │   │   ├── GameHUD.js         # In-game HUD
│   │   │   ├── ResultsScreen.js   # Level results
│   │   │   ├── Shop.js            # Shop screen
│   │   │   └── Profile.js         # Player profile
│   │   └── components/
│   │       ├── Button.js          # Reusable button
│   │       └── CoinDisplay.js     # Coin counter
│   ├── audio/
│   │   ├── AudioManager.js        # Audio controller
│   │   └── sounds/                # Audio files
│   │       ├── kick.mp3
│   │       ├── goal.mp3
│   │       ├── miss.mp3
│   │       └── menu-music.mp3
│   ├── input/
│   │   └── InputHandler.js        # Mouse input handling
│   ├── shop/
│   │   ├── ShopManager.js         # Shop logic
│   │   ├── uniforms.js            # Uniform catalog
│   │   └── balls.js               # Ball catalog
│   ├── utils/
│   │   ├── math.js                # Math utilities
│   │   └── storage.js             # localStorage helpers
│   └── main.js                    # Application entry point
├── public/
│   ├── index.html                 # HTML entry point
│   ├── assets/
│   │   ├── models/                # 3D models (if any)
│   │   ├── textures/              # Textures
│   │   └── sounds/                # Audio files
│   └── favicon.ico
├── docs/
│   ├── prd.md                     # Product Requirements
│   └── architecture.md            # This document
├── .gitignore
├── package.json
├── vite.config.js                 # Vite configuration
├── README.md                       # Project documentation
└── LICENSE
```
