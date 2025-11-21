import * as THREE from 'three';
import { Target } from './Target.js';

/**
 * Target Manager
 * Manages targets in the goal for different levels
 */
export class TargetManager {
  constructor(goal, scene) {
    this.goal = goal;
    this.scene = scene;
    this.targets = [];
    this.currentLevel = 1;
  }

  /**
   * Create targets for a specific level
   */
  createTargetsForLevel(levelId) {
    // Clear existing targets
    this.clearTargets();
    
    this.currentLevel = levelId;
    const goalBounds = this.goal.getBounds();
    const goalWidth = goalBounds.maxX - goalBounds.minX;
    const goalHeight = goalBounds.maxY - goalBounds.minY;
    const goalZ = goalBounds.maxZ - 0.5; // Slightly in front of goal line
    
    // Level-specific target configuration
    switch (levelId) {
      case 1:
        // Level 1: 2-3 simple coin targets
        this.createRandomTargets(goalBounds, goalZ, 2, 3, ['coin']);
        break;
        
      case 2:
        // Level 2: 3-4 targets (coins and lightning)
        this.createRandomTargets(goalBounds, goalZ, 3, 4, ['coin', 'lightning']);
        break;
        
      case 3:
        // Level 3: 4-5 targets (all types)
        this.createRandomTargets(goalBounds, goalZ, 4, 5, ['coin', 'lightning', 'fire']);
        break;
        
      case 4:
        // Level 4: 5-6 targets (more variety)
        this.createRandomTargets(goalBounds, goalZ, 5, 6, ['coin', 'lightning', 'fire']);
        break;
        
      case 5:
        // Level 5: 6-8 targets (maximum challenge)
        this.createRandomTargets(goalBounds, goalZ, 6, 8, ['coin', 'lightning', 'fire']);
        break;
        
      default:
        // Default: 2-3 coin targets
        this.createRandomTargets(goalBounds, goalZ, 2, 3, ['coin']);
    }
  }

  /**
   * Create random targets within goal bounds
   */
  createRandomTargets(goalBounds, goalZ, minCount, maxCount, types) {
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const goalWidth = goalBounds.maxX - goalBounds.minX;
    const goalHeight = goalBounds.maxY - goalBounds.minY;
    
    // Create grid positions to avoid overlapping
    const gridSize = 3; // 3x3 grid
    const cellWidth = goalWidth / gridSize;
    const cellHeight = goalHeight / gridSize;
    const usedCells = new Set();
    
    for (let i = 0; i < count; i++) {
      // Find an unused cell
      let cellX, cellY, cellKey;
      let attempts = 0;
      do {
        cellX = Math.floor(Math.random() * gridSize);
        cellY = Math.floor(Math.random() * gridSize);
        cellKey = `${cellX},${cellY}`;
        attempts++;
      } while (usedCells.has(cellKey) && attempts < 50);
      
      if (attempts >= 50) continue; // Skip if can't find free cell
      
      usedCells.add(cellKey);
      
      // Random position within cell
      const x = goalBounds.minX + (cellX + 0.5) * cellWidth + (Math.random() - 0.5) * cellWidth * 0.6;
      const y = goalBounds.minY + (cellY + 0.5) * cellHeight + (Math.random() - 0.5) * cellHeight * 0.6;
      
      // Ensure position is within bounds
      const clampedX = Math.max(goalBounds.minX + 0.5, Math.min(goalBounds.maxX - 0.5, x));
      const clampedY = Math.max(goalBounds.minY + 0.5, Math.min(goalBounds.maxY - 0.5, y));
      
      // Random type
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Create target
      const target = new Target(type, new THREE.Vector3(clampedX, clampedY, goalZ), 5);
      this.targets.push(target);
      this.scene.add(target.getMesh());
    }
  }

  /**
   * Check if ball hit any target
   */
  checkTargetHits(ballPosition) {
    const hitTargets = [];
    
    for (const target of this.targets) {
      if (target.checkCollision(ballPosition)) {
        target.hit();
        hitTargets.push(target);
      }
    }
    
    return hitTargets;
  }

  /**
   * Get total reward from hit targets
   */
  getRewardFromHits(hitTargets) {
    return hitTargets.reduce((total, target) => total + target.reward, 0);
  }

  /**
   * Update all targets (animation)
   */
  update(deltaTime) {
    for (const target of this.targets) {
      target.update(deltaTime);
    }
  }

  /**
   * Clear all targets
   */
  clearTargets() {
    for (const target of this.targets) {
      if (target.mesh && this.scene) {
        this.scene.remove(target.mesh);
      }
    }
    this.targets = [];
  }

  /**
   * Reset all targets (for new kick)
   */
  resetTargets() {
    for (const target of this.targets) {
      target.reset();
    }
  }
}

