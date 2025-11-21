import * as THREE from 'three';

/**
 * Physics Engine
 * Handles ball trajectory calculations, gravity, and collision detection
 */
export class PhysicsEngine {
  constructor() {
    this.gravity = -9.81; // Gravity acceleration (standard)
    this.airResistance = 0.995; // Air resistance factor (reduced for longer flight)
  }

  /**
   * Calculate ball trajectory from start position with given velocity
   */
  calculateTrajectory(startPos, velocity, deltaTime) {
    // Update velocity with gravity
    velocity.y += this.gravity * deltaTime;
    
    // Apply air resistance (simplified)
    velocity.multiplyScalar(this.airResistance);
    
    // Calculate new position
    const newPos = startPos.clone();
    newPos.add(velocity.clone().multiplyScalar(deltaTime));
    
    return {
      position: newPos,
      velocity: velocity
    };
  }

  /**
   * Check if ball hit the ground
   */
  checkGroundCollision(ballPosition, ballRadius) {
    return ballPosition.y <= ballRadius;
  }

  /**
   * Check if ball is inside goal bounds
   * Takes into account ball radius for more accurate collision detection
   */
  checkGoalCollision(ballPosition, goalBounds, ballRadius = 0.11) {
    // Check if ball center is within goal bounds (with tolerance for ball radius)
    const isInBounds = (
      ballPosition.x >= goalBounds.minX &&
      ballPosition.x <= goalBounds.maxX &&
      ballPosition.y >= goalBounds.minY &&
      ballPosition.y <= goalBounds.maxY &&
      ballPosition.z >= goalBounds.minZ &&
      ballPosition.z <= goalBounds.maxZ
    );
    
    // Also check if ball is crossing goal line (z position) even if slightly outside bounds
    // This handles cases where ball is entering goal
    const isCrossingGoalLine = (
      ballPosition.z >= goalBounds.minZ &&
      ballPosition.z <= goalBounds.maxZ &&
      ballPosition.x >= goalBounds.minX - ballRadius &&
      ballPosition.x <= goalBounds.maxX + ballRadius &&
      ballPosition.y >= goalBounds.minY - ballRadius &&
      ballPosition.y <= goalBounds.maxY + ballRadius
    );
    
    const result = isInBounds || isCrossingGoalLine;
    
    // Debug logging when ball is near goal
    if (ballPosition.z > goalBounds.minZ - 1 && ballPosition.z < goalBounds.maxZ + 1) {
      console.log('Goal collision check:', {
        ballPosition: ballPosition.clone(),
        goalBounds: goalBounds,
        ballRadius: ballRadius,
        isInBounds: isInBounds,
        isCrossingGoalLine: isCrossingGoalLine,
        result: result,
        xCheck: `${ballPosition.x} >= ${goalBounds.minX} && ${ballPosition.x} <= ${goalBounds.maxX}`,
        yCheck: `${ballPosition.y} >= ${goalBounds.minY} && ${ballPosition.y} <= ${goalBounds.maxY}`,
        zCheck: `${ballPosition.z} >= ${goalBounds.minZ} && ${ballPosition.z} <= ${goalBounds.maxZ}`
      });
    }
    
    return result;
  }

  /**
   * Handle ground collision - bounce or stop
   */
  handleGroundCollision(velocity, bounceFactor = 0.3) {
    // Simple bounce with energy loss
    velocity.y = Math.abs(velocity.y) * bounceFactor;
    velocity.x *= 0.8; // Friction
    velocity.z *= 0.8; // Friction
  }
}

