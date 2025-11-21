# Data Models

## PlayerProgress

**Purpose:** Stores player's game progress, coins, unlocked levels, and purchased equipment.

**Key Attributes:**
- `coins`: number - Current coin balance
- `unlockedLevels`: number[] - Array of unlocked level IDs (1-5)
- `purchasedUniforms`: string[] - Array of purchased uniform IDs
- `purchasedBalls`: string[] - Array of purchased ball IDs
- `currentUniform`: string - Currently selected uniform ID
- `currentBall`: string - Currently selected ball ID
- `levelStats`: object - Statistics per level (coins earned, goals scored, etc.)

**Relationships:**
- Used by StateManager for persistence
- Updated by GameLogic when player progresses

## LevelConfig

**Purpose:** Configuration data for each game level (obstacles, difficulty, rewards).

**Key Attributes:**
- `id`: number - Level identifier (1-5)
- `name`: string - Level display name
- `obstacles`: object[] - Array of obstacle configurations
- `targetReward`: number - Coins for hitting target (if applicable)
- `goalReward`: number - Coins for scoring goal (10)
- `completionBonus`: number - Bonus coins for completing level (5)

**Relationships:**
- Loaded by LevelManager
- Used by GameLogic to configure level behavior

## GameState

**Purpose:** Current game session state (active level, current kick, ball position, etc.).

**Key Attributes:**
- `currentLevel`: number - Currently active level ID
- `currentKick`: number - Current kick number (1-5)
- `kicksRemaining`: number - Remaining kicks in current level
- `ballPosition`: Vector3 - Current ball position in 3D space
- `ballVelocity`: Vector3 - Current ball velocity
- `isKicking`: boolean - Whether player is currently aiming/kicking
- `score`: object - Current level score (goals, targets hit, coins earned)

**Relationships:**
- Managed by GameLogic
- Updated in real-time during gameplay
- Reset when level starts/completes
