import * as THREE from 'three';

/**
 * Game Engine
 * Main game loop coordinator
 */
export class GameEngine {
  constructor(renderer, gameLogic, cameraController, sceneManager = null, inputHandler = null) {
    this.renderer = renderer;
    this.gameLogic = gameLogic;
    this.cameraController = cameraController;
    this.sceneManager = sceneManager;
    this.inputHandler = inputHandler;
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
  }

  /**
   * Initialize game engine
   */
  init() {
    // Game engine is ready
    console.log('Game Engine initialized');
  }

  /**
   * Start game loop
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now() / 1000;
    
    const gameLoop = (currentTime) => {
      if (!this.isRunning || this.isPaused) {
        if (this.isRunning) {
          // Continue loop even when paused (to check for resume)
          this.animationId = requestAnimationFrame(gameLoop);
        }
        return;
      }
      
      // Calculate delta time
      const currentTimeSeconds = currentTime / 1000;
      let deltaTime = currentTimeSeconds - this.lastTime;
      this.lastTime = currentTimeSeconds;
      
      // Clamp delta time to prevent large jumps
      deltaTime = Math.min(deltaTime, 0.1);
      
      // Update game logic
      this.gameLogic.update(deltaTime);
      
      // Update camera (static - no movement needed, but call for consistency)
      if (this.cameraController) {
        this.cameraController.update();
      }
      
      // Update player animation if exists
      try {
        if (this.sceneManager && typeof this.sceneManager.getPlayer === 'function') {
          const player = this.sceneManager.getPlayer();
          if (player && player.isAnimating && typeof player.updateAnimation === 'function') {
            player.updateAnimation(deltaTime);
          }
        }
      } catch (error) {
        console.error('Error updating player animation:', error);
      }
      
      // Check if kick animation is complete and execute pending kick
      if (this.inputHandler) {
        this.inputHandler.checkAndExecuteKick();
      }
      
      // Render frame
      this.renderer.render();
      
      // Continue loop
      this.animationId = requestAnimationFrame(gameLoop);
    };
    
    this.animationId = requestAnimationFrame(gameLoop);
  }

  /**
   * Stop game loop
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  /**
   * Pause game loop
   */
  pause() {
    this.isPaused = true;
  }
  
  /**
   * Resume game loop
   */
  resume() {
    this.isPaused = false;
    // Update lastTime to prevent large delta jump
    this.lastTime = performance.now() / 1000;
  }

  /**
   * Update game (called from render loop)
   */
  update(deltaTime) {
    this.gameLogic.update(deltaTime);
  }
}

