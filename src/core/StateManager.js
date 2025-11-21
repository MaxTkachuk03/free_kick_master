/**
 * State Manager
 * Manages game state, player progress, and localStorage persistence
 */
export class StateManager {
  constructor() {
    this.storageKey = 'freeKickMaster_save';
    this.defaultState = {
      coins: 0,
      unlockedLevels: [1], // Level 1 is unlocked by default
      completedLevels: [],
      purchasedUniforms: [],
      purchasedBalls: [],
      selectedUniform: null,
      selectedBall: null,
      levelStats: {} // { levelId: { coins: 0, bestScore: 0, completed: false } }
    };
    this.state = this.loadState();
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default to ensure all fields exist
        return { ...this.defaultState, ...parsed };
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return { ...this.defaultState };
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    return {
      coins: this.state.coins,
      unlockedLevels: [...this.state.unlockedLevels],
      completedLevels: [...this.state.completedLevels],
      purchasedUniforms: [...this.state.purchasedUniforms],
      purchasedBalls: [...this.state.purchasedBalls],
      selectedUniform: this.state.selectedUniform,
      selectedBall: this.state.selectedBall,
      levelStats: { ...this.state.levelStats }
    };
  }

  /**
   * Update coin balance
   */
  updateCoins(amount) {
    this.state.coins = Math.max(0, this.state.coins + amount);
    this.saveState();
    return this.state.coins;
  }

  /**
   * Get current coin balance
   */
  getCoins() {
    return this.state.coins;
  }

  /**
   * Unlock a level
   */
  unlockLevel(levelId) {
    if (!this.state.unlockedLevels.includes(levelId)) {
      this.state.unlockedLevels.push(levelId);
      this.state.unlockedLevels.sort((a, b) => a - b);
      this.saveState();
    }
  }

  /**
   * Check if level is unlocked
   */
  isLevelUnlocked(levelId) {
    return this.state.unlockedLevels.includes(levelId);
  }

  /**
   * Mark level as completed
   */
  completeLevel(levelId, coinsEarned = 0) {
    if (!this.state.completedLevels.includes(levelId)) {
      this.state.completedLevels.push(levelId);
    }
    
    // Update level stats
    if (!this.state.levelStats[levelId]) {
      this.state.levelStats[levelId] = {
        coins: 0,
        bestScore: 0,
        completed: false
      };
    }
    
    this.state.levelStats[levelId].coins = Math.max(
      this.state.levelStats[levelId].coins,
      coinsEarned
    );
    this.state.levelStats[levelId].completed = true;
    
    // Unlock next level if exists
    const nextLevel = levelId + 1;
    if (nextLevel <= 5) {
      this.unlockLevel(nextLevel);
    }
    
    this.saveState();
  }

  /**
   * Get level stats
   */
  getLevelStats(levelId) {
    return this.state.levelStats[levelId] || {
      coins: 0,
      bestScore: 0,
      completed: false
    };
  }

  /**
   * Purchase item (uniform or ball)
   */
  purchaseItem(type, itemId, cost) {
    if (this.state.coins < cost) {
      return { success: false, error: 'Недостатньо монет' };
    }

    const purchasedKey = type === 'uniform' ? 'purchasedUniforms' : 'purchasedBalls';
    
    if (this.state[purchasedKey].includes(itemId)) {
      return { success: false, error: 'Предмет вже куплено' };
    }

    this.state.coins -= cost;
    this.state[purchasedKey].push(itemId);
    this.saveState();

    return { success: true, remainingCoins: this.state.coins };
  }

  /**
   * Check if item is purchased
   */
  isItemPurchased(type, itemId) {
    const purchasedKey = type === 'uniform' ? 'purchasedUniforms' : 'purchasedBalls';
    return this.state[purchasedKey].includes(itemId);
  }

  /**
   * Select uniform
   */
  selectUniform(uniformId) {
    if (this.isItemPurchased('uniform', uniformId)) {
      this.state.selectedUniform = uniformId;
      this.saveState();
      return true;
    }
    return false;
  }

  /**
   * Select ball
   */
  selectBall(ballId) {
    if (this.isItemPurchased('ball', ballId)) {
      this.state.selectedBall = ballId;
      this.saveState();
      return true;
    }
    return false;
  }

  /**
   * Get selected uniform
   */
  getSelectedUniform() {
    return this.state.selectedUniform;
  }

  /**
   * Get selected ball
   */
  getSelectedBall() {
    return this.state.selectedBall;
  }

  /**
   * Reset all progress (for testing/debugging)
   */
  resetProgress() {
    this.state = { ...this.defaultState };
    this.saveState();
  }

  /**
   * Get game state for current session
   */
  getGameState() {
    return {
      currentLevel: this.state.currentLevel || null,
      currentKick: this.state.currentKick || 0,
      score: {
        goals: this.state.currentGoals || 0,
        misses: this.state.currentMisses || 0,
        coins: this.state.currentCoins || 0
      }
    };
  }

  /**
   * Set game state for current session
   */
  setGameState(gameState) {
    this.state.currentLevel = gameState.currentLevel;
    this.state.currentKick = gameState.currentKick;
    this.state.currentGoals = gameState.score?.goals || 0;
    this.state.currentMisses = gameState.score?.misses || 0;
    this.state.currentCoins = gameState.score?.coins || 0;
    // Don't save session state to localStorage
  }
}

