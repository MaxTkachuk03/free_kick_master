import { UNIFORMS, getAllUniforms } from './uniforms.js';
import { BALLS, getAllBalls } from './balls.js';

/**
 * Shop Manager
 * Manages shop logic and item catalogs
 */
export class ShopManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  /**
   * Get available uniforms
   */
  getAvailableUniforms() {
    return getAllUniforms();
  }

  /**
   * Get available balls
   */
  getAvailableBalls() {
    return getAllBalls();
  }

  /**
   * Purchase uniform
   */
  purchaseUniform(uniformId) {
    const uniform = UNIFORMS.find(u => u.id === uniformId);
    if (!uniform) {
      return { success: false, error: 'Форма не знайдена' };
    }

    return this.stateManager.purchaseItem('uniform', uniformId, uniform.price);
  }

  /**
   * Purchase ball
   */
  purchaseBall(ballId) {
    const ball = BALLS.find(b => b.id === ballId);
    if (!ball) {
      return { success: false, error: 'М\'яч не знайдено' };
    }

    return this.stateManager.purchaseItem('ball', ballId, ball.price);
  }

  /**
   * Check if uniform is purchased
   */
  isUniformPurchased(uniformId) {
    return this.stateManager.isItemPurchased('uniform', uniformId);
  }

  /**
   * Check if ball is purchased
   */
  isBallPurchased(ballId) {
    return this.stateManager.isItemPurchased('ball', ballId);
  }

  /**
   * Select uniform
   */
  selectUniform(uniformId) {
    return this.stateManager.selectUniform(uniformId);
  }

  /**
   * Select ball
   */
  selectBall(ballId) {
    return this.stateManager.selectBall(ballId);
  }

  /**
   * Get selected uniform
   */
  getSelectedUniform() {
    const uniformId = this.stateManager.getSelectedUniform();
    return uniformId ? UNIFORMS.find(u => u.id === uniformId) : UNIFORMS[0];
  }

  /**
   * Get selected ball
   */
  getSelectedBall() {
    const ballId = this.stateManager.getSelectedBall();
    return ballId ? BALLS.find(b => b.id === ballId) : BALLS[0];
  }
}

