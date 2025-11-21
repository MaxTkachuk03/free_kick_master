import * as THREE from 'three';
import { PhysicsEngine } from '../physics/PhysicsEngine.js';

/**
 * Game Logic
 * Core game mechanics - ball physics, collision detection, scoring, level progression
 */
export class GameLogic {
  constructor(ball, goal, sceneManager, stateManager = null, targetManager = null) {
    this.ball = ball;
    this.goal = goal;
    this.sceneManager = sceneManager;
    this.stateManager = stateManager;
    this.targetManager = targetManager;
    this.physics = new PhysicsEngine();
    
    // Ball state
    this.isBallMoving = false;
    this.ballVelocity = new THREE.Vector3(0, 0, 0);
    this.lastTime = 0;
    this.goalScored = false; // Track if goal was scored to prevent double counting
    this.missRegistered = false; // Track if miss was registered to prevent double counting
    this.isCompletingKick = false; // Track if kick completion is in progress to prevent double calls
    
    // Game state
    this.currentKick = 0;
    this.totalKicks = 5;
    this.kicksRemaining = 5;
    this.initialCoins = 0; // Coins at level start
    this.score = {
      goals: 0,
      misses: 0,
      coins: 0
    };
    
    // Callbacks
    this.onKickStartCallback = null; // Called when kick starts (after swipe)
    this.onKickCompleteCallback = null;
    this.onGoalCallback = null;
    this.onMissCallback = null;
    this.onLevelCompleteCallback = null;
    this.onTargetHitCallback = null;
  }

  /**
   * Process player kick input
   * @param {Object} kickParams - Kick parameters with direction, power, and swipeSpeed
   */
  processKick(direction, power, swipeSpeed = 0) {
    if (this.isBallMoving) {
      console.log('Cannot kick: ball is already moving');
      return; // Can't kick while ball is moving
    }
    
    // Check if level is already complete or max kicks reached
    if (this.kicksRemaining <= 0 || this.currentKick >= this.totalKicks) {
      console.log('No kicks remaining or max kicks reached, level already complete!', {
        currentKick: this.currentKick,
        totalKicks: this.totalKicks,
        kicksRemaining: this.kicksRemaining
      });
      return; // Don't allow more kicks
    }
    
    // Reset flags for new kick (goal/miss from previous kick)
    this.goalScored = false;
    this.missRegistered = false;
    
    // Increment current kick counter
    this.currentKick++;
    
    // Decrease kicks remaining immediately (1 swipe = 1 attempt)
    this.kicksRemaining--;
    
    console.log(`Kick ${this.currentKick}/${this.totalKicks} started, ${this.kicksRemaining} attempts remaining`, {
      currentScore: { ...this.score }
    });
    
    // Direction is already normalized and points in the swipe direction
    // Power determines the overall speed (0.3 to 1.0)
    // SwipeSpeed determines the vertical component (0-2.0)
    
    // Calculate base speed from power
    // Power 0.3 = 70 m/s, Power 1.0 = 120 m/s
    const minSpeed = 70.0;
    const maxSpeed = 120.0;
    const speed = minSpeed + (maxSpeed - minSpeed) * power;
    
    // Use direction vector from swipe (preserves X and Z components)
    // This maintains the exact horizontal angle of the swipe
    const velocityDirection = direction.clone();
    
    // Calculate vertical component based on swipe speed
    // Faster swipe = higher flight (swipeSpeed is normalized 0-2.0)
    // Also use Y component from direction if swipe goes up/down
    const baseUpward = 6.0; // Base upward velocity
    const swipeUpward = swipeSpeed * 4.0; // Additional height from fast swipe (0-8.0)
    const directionUpward = Math.max(direction.y, 0) * 3.0; // Use Y component if positive (upward swipe)
    const upwardComponent = baseUpward + swipeUpward + directionUpward;
    
    // Set velocity: use direction's X and Z components, add calculated Y component
    // Scale by speed to get final velocity
    // Direction points from ball to mouse, so use it directly
    this.ballVelocity = new THREE.Vector3(
      velocityDirection.x * speed,  // X: horizontal direction from swipe
      upwardComponent,               // Y: upward component (base + swipe speed + direction Y)
      velocityDirection.z * speed   // Z: forward direction from swipe
    );
    
    // Ensure minimum forward speed (always towards goal)
    // Ball starts at z=2, goal is at z=25, so need to travel 23 meters
    // Minimum speed should be at least 70 m/s to reliably reach goal
    if (this.ballVelocity.z < 70.0) {
      this.ballVelocity.z = 70.0;
    }
    
    // Start ball movement
    this.isBallMoving = true;
    this.lastTime = performance.now() / 1000; // Convert to seconds
    
    const ballPos = this.ball.getPosition();
    console.log('Kick executed:', { 
      direction: direction.clone(), 
      power, 
      swipeSpeed, 
      speed,
      velocity: this.ballVelocity.clone(), 
      ballPos: ballPos.clone(),
      kicksRemaining: this.kicksRemaining,
      currentKick: this.currentKick
    });
    
    // Notify that kick started (update HUD with current kick number)
    if (this.onKickStartCallback) {
      this.onKickStartCallback({
        kick: this.currentKick,
        total: this.totalKicks,
        remaining: this.kicksRemaining,
        score: this.score
      });
    }
    
    // Check if this was the last kick
    if (this.currentKick >= this.totalKicks || this.kicksRemaining === 0) {
      console.log('Last kick executed, will complete level after ball stops');
    }
  }

  /**
   * Update ball physics
   */
  update(deltaTime) {
    if (!this.isBallMoving) return;
    
    const currentPos = this.ball.getPosition();
    const ballRadius = 0.11;
    
    // Update ball position using physics
    const result = this.physics.calculateTrajectory(
      currentPos,
      this.ballVelocity,
      deltaTime
    );
    
    // Update ball position
    this.ball.setPosition(
      result.position.x,
      result.position.y,
      result.position.z
    );
    
    // Check collisions (this may call handleGoal() or onMiss())
    // IMPORTANT: Check collisions BEFORE checking if ball stopped
    this.checkCollisions(result.position);
    
    // If goal or miss was registered, don't continue with physics
    if (this.goalScored || this.missRegistered) {
      return; // Goal/miss handling will continue in their callbacks
    }
    
    // Check target hits
    if (this.targetManager) {
      const hitTargets = this.targetManager.checkTargetHits(result.position);
      if (hitTargets.length > 0) {
        const reward = this.targetManager.getRewardFromHits(hitTargets);
        this.score.coins += reward;
        console.log(`Target hit! Coins: +${reward}`);
        
        // Trigger target hit callback if available
        if (this.onTargetHitCallback) {
          this.onTargetHitCallback(hitTargets, reward);
        }
      }
    }
    
    // Update velocity
    this.ballVelocity = result.velocity;
    
    // Check if ball should stop (very slow speed)
    const totalSpeed = Math.sqrt(
      this.ballVelocity.x * this.ballVelocity.x +
      this.ballVelocity.y * this.ballVelocity.y +
      this.ballVelocity.z * this.ballVelocity.z
    );
    
    // Check if ball is on ground
    const isOnGround = result.position.y <= ballRadius;
    
    // Stop ball if it's very slow (almost stopped)
    // Use higher threshold to ensure ball stops reliably
    // Only check if goal/miss hasn't been registered yet
    if (totalSpeed < 0.8 && !this.goalScored && !this.missRegistered) {
      console.log('Ball stopped (very slow speed)', {
        totalSpeed,
        position: result.position.clone(),
        kicksRemaining: this.kicksRemaining,
        goalScored: this.goalScored,
        missRegistered: this.missRegistered
      });
      this.stopBall();
      // Ensure ball is on ground
      if (result.position.y < ballRadius) {
        this.ball.setPosition(result.position.x, ballRadius, result.position.z);
      }
      
      // Final check for goal/miss before calling onKickComplete
      // This ensures we catch goals even if they weren't detected during movement
      // Use a separate method to avoid recursion
      this.finalCheckForGoalOrMiss(result.position);
      
      // Only call handleKickComplete if goal/miss wasn't just registered
      if (!this.goalScored && !this.missRegistered && !this.isCompletingKick) {
        console.log('Calling handleKickComplete immediately after ball stopped (slow speed)');
        this.handleKickComplete();
      }
    }
  }

  /**
   * Final check for goal or miss (used when ball stops, to avoid recursion)
   * This method only checks goal/miss, does NOT check ground collision
   */
  finalCheckForGoalOrMiss(ballPosition) {
    const ballRadius = 0.11;
    
    // Goal parameters (matching Goal.js)
    const goalZ = 25; // Goal position on Z axis
    const goalWidth = 7.32; // Standard goal width
    const goalHeight = 2.44; // Standard goal height
    
    // Goal bounds (center at x=0, y=0, z=goalZ)
    const goalLineZ = goalZ; // Goal line is at z = 25
    const goalMinX = -goalWidth / 2; // -3.66
    const goalMaxX = goalWidth / 2;  // 3.66
    const goalMinY = 0;
    const goalMaxY = goalHeight; // 2.44
    
    // Check if ball has crossed the goal line (forward direction, positive Z)
    const hasCrossedGoalLine = ballPosition.z >= goalLineZ;
    
    // Check if ball is within goal bounds (with tolerance for ball radius)
    const isWithinGoalWidth = ballPosition.x >= (goalMinX - ballRadius) && ballPosition.x <= (goalMaxX + ballRadius);
    const isWithinGoalHeight = ballPosition.y >= (goalMinY - ballRadius) && ballPosition.y <= (goalMaxY + ballRadius);
    
    // Goal is scored if: ball crossed goal line AND is within goal width AND is within goal height
    const isGoal = hasCrossedGoalLine && isWithinGoalWidth && isWithinGoalHeight;
    
    // Check for goal - only process if not already scored/registered
    if (isGoal && !this.goalScored && !this.missRegistered) {
      console.log('🎉🎉🎉 GOAL DETECTED in finalCheckForGoalOrMiss! 🎉🎉🎉', {
        ballPosition: { x: ballPosition.x.toFixed(2), y: ballPosition.y.toFixed(2), z: ballPosition.z.toFixed(2) }
      });
      
      if (typeof this.handleGoal === 'function') {
        this.handleGoal();
      }
      return;
    }
    
    // Check for miss - ball passed goal line but is outside bounds
    if (ballPosition.z > goalLineZ + 0.3 && !this.goalScored && !this.missRegistered) {
      const isOutsideGoalWidth = ballPosition.x < (goalMinX - ballRadius) || ballPosition.x > (goalMaxX + ballRadius);
      const isOutsideGoalHeight = ballPosition.y < (goalMinY - ballRadius) || ballPosition.y > (goalMaxY + ballRadius);
      
      if (isOutsideGoalWidth || isOutsideGoalHeight) {
        console.log('❌ MISS detected in finalCheckForGoalOrMiss');
        if (!this.missRegistered) {
          this.onMiss();
        }
        return;
      }
    }
  }

  /**
   * Check collisions (ground, goal)
   */
  checkCollisions(ballPosition) {
    const ballRadius = 0.11;
    
    // Goal parameters (matching Goal.js)
    const goalZ = 25; // Goal position on Z axis
    const goalWidth = 7.32; // Standard goal width
    const goalHeight = 2.44; // Standard goal height
    
    // Goal bounds (center at x=0, y=0, z=goalZ)
    const goalLineZ = goalZ; // Goal line is at z = 25
    const goalMinX = -goalWidth / 2; // -3.66
    const goalMaxX = goalWidth / 2;  // 3.66
    const goalMinY = 0;
    const goalMaxY = goalHeight; // 2.44
    
    // Check if ball has crossed the goal line (forward direction, positive Z)
    const hasCrossedGoalLine = ballPosition.z >= goalLineZ;
    
    // Check if ball is within goal bounds (with tolerance for ball radius)
    const isWithinGoalWidth = ballPosition.x >= (goalMinX - ballRadius) && ballPosition.x <= (goalMaxX + ballRadius);
    const isWithinGoalHeight = ballPosition.y >= (goalMinY - ballRadius) && ballPosition.y <= (goalMaxY + ballRadius);
    
    // Goal is scored if: ball crossed goal line AND is within goal width AND is within goal height
    const isGoal = hasCrossedGoalLine && isWithinGoalWidth && isWithinGoalHeight;
    
    // Debug logging when ball is near goal
    if (ballPosition.z > goalZ - 1 && ballPosition.z < goalZ + 2) {
      console.log('⚽ Ball near goal:', {
        ballPos: { x: ballPosition.x.toFixed(2), y: ballPosition.y.toFixed(2), z: ballPosition.z.toFixed(2) },
        goalLine: goalLineZ,
        goalWidth: `[${goalMinX.toFixed(2)}, ${goalMaxX.toFixed(2)}]`,
        goalHeight: `[${goalMinY.toFixed(2)}, ${goalMaxY.toFixed(2)}]`,
        hasCrossedGoalLine: hasCrossedGoalLine,
        isWithinGoalWidth: isWithinGoalWidth,
        isWithinGoalHeight: isWithinGoalHeight,
        isGoal: isGoal,
        goalScored: this.goalScored,
        missRegistered: this.missRegistered
      });
    }
    
    // Check for goal - only process if not already scored/registered
    if (isGoal && !this.goalScored && !this.missRegistered) {
      console.log('🎉🎉🎉 GOAL DETECTED in checkCollisions! 🎉🎉🎉', {
        ballPosition: { x: ballPosition.x.toFixed(2), y: ballPosition.y.toFixed(2), z: ballPosition.z.toFixed(2) },
        currentKick: this.currentKick,
        kicksRemaining: this.kicksRemaining,
        goalScored: this.goalScored,
        missRegistered: this.missRegistered,
        scoreBefore: { ...this.score }
      });
      
      // Check if handleGoal method exists
      if (typeof this.handleGoal === 'function') {
        console.log('📞 Calling handleGoal() method...');
        try {
          this.handleGoal();
          console.log('✅ handleGoal() method executed');
        } catch (error) {
          console.error('❌ Error calling handleGoal():', error);
        }
      } else {
        console.error('❌ handleGoal is not a function!', typeof this.handleGoal);
      }
      
      this.stopBall();
      return; // Don't check ground if goal scored
    }
    
    // Check for miss - ball passed goal line but is outside bounds
    if (ballPosition.z > goalLineZ + 0.3 && !this.goalScored && !this.missRegistered) {
      const isOutsideGoalWidth = ballPosition.x < (goalMinX - ballRadius) || ballPosition.x > (goalMaxX + ballRadius);
      const isOutsideGoalHeight = ballPosition.y < (goalMinY - ballRadius) || ballPosition.y > (goalMaxY + ballRadius);
      
      if (isOutsideGoalWidth || isOutsideGoalHeight) {
        console.log('❌ MISS - Ball passed goal but outside bounds', {
          ballPosition: { x: ballPosition.x.toFixed(2), y: ballPosition.y.toFixed(2), z: ballPosition.z.toFixed(2) },
          isOutsideGoalWidth: isOutsideGoalWidth,
          isOutsideGoalHeight: isOutsideGoalHeight,
          missRegistered: this.missRegistered
        });
        if (!this.missRegistered) {
          this.onMiss();
        }
        this.stopBall();
        return;
      }
    }
    
    // Check ground collision - ball hits ground and bounces/rolls
    if (this.physics.checkGroundCollision(ballPosition, ballRadius)) {
      // Keep ball on ground level
      this.ball.setPosition(ballPosition.x, ballRadius, ballPosition.z);
      
      // If ball is falling down (negative Y velocity), apply bounce with energy loss
      if (this.ballVelocity.y < 0) {
        // Bounce with energy loss (ball loses most energy on first bounce)
        this.ballVelocity.y = Math.abs(this.ballVelocity.y) * 0.3; // 30% bounce
      } else {
        // Ball is already on ground, no vertical velocity
        this.ballVelocity.y = 0;
      }
      
      // Apply friction to horizontal velocity when on ground (ball slows down)
      this.ballVelocity.x *= 0.92; // Stronger friction on X (8% loss per frame)
      this.ballVelocity.z *= 0.92; // Stronger friction on Z (8% loss per frame)
      
      // Calculate horizontal speed
      const horizontalSpeed = Math.sqrt(
        this.ballVelocity.x * this.ballVelocity.x + 
        this.ballVelocity.z * this.ballVelocity.z
      );
      
      // If ball is very slow on ground, stop it completely
      // Only check if goal/miss hasn't been registered yet
      if (horizontalSpeed < 0.8 && Math.abs(this.ballVelocity.y) < 0.5 && !this.goalScored && !this.missRegistered) {
        console.log('Ball stopped on ground (slow speed)', {
          horizontalSpeed,
          position: ballPosition.clone(),
          kicksRemaining: this.kicksRemaining,
          goalScored: this.goalScored,
          missRegistered: this.missRegistered
        });
        this.stopBall();
        // Ensure ball is on ground
        this.ball.setPosition(ballPosition.x, ballRadius, ballPosition.z);
        
        // Final check for goal/miss before calling onKickComplete
        // This ensures we catch goals even if they weren't detected during movement
        // Use a separate method to avoid recursion
        this.finalCheckForGoalOrMiss(ballPosition);
        
        // Only call handleKickComplete if goal/miss wasn't just registered
        if (!this.goalScored && !this.missRegistered && !this.isCompletingKick) {
          console.log('Calling handleKickComplete immediately after ball stopped on ground');
          this.handleKickComplete();
        }
      }
    }
  }

  /**
   * Stop ball movement
   */
  stopBall() {
    this.isBallMoving = false;
    this.ballVelocity.set(0, 0, 0);
  }

  /**
   * Handle goal scored
   */
  handleGoal() {
    // Prevent double counting goals
    // If goalScored is already true, we've already processed this goal
    if (this.goalScored) {
      console.log('⚠️ Goal already processed for this kick, ignoring duplicate call...', {
        currentGoals: this.score.goals
      });
      return;
    }
    
    console.log('🎯 handleGoal() called - processing goal...', {
      goalsBefore: this.score.goals,
      goalScored: this.goalScored
    });
    
    // Mark goal as scored FIRST to prevent double counting
    this.goalScored = true;
    
    // Update score - INCREASE goals by 1
    const goalsBefore = this.score.goals;
    this.score.goals = this.score.goals + 1; // Explicitly add 1
    this.score.coins += 10; // 10 coins for goal
    
    console.log('🎉 GOAL SCORED! Score updated:', {
      goalsBefore: goalsBefore,
      goalsAfter: this.score.goals,
      totalCoins: this.score.coins,
      kicksRemaining: this.kicksRemaining,
      currentKick: this.currentKick,
      totalKicks: this.totalKicks,
      fullScore: { ...this.score }
    });
    
    // Call callback to update UI
    if (this.onGoalCallback) {
      console.log('✅ Calling onGoalCallback with score:', this.score);
      try {
        this.onGoalCallback(this.score);
        console.log('✅ onGoalCallback executed successfully');
      } catch (error) {
        console.error('❌ Error in onGoalCallback:', error);
      }
    } else {
      console.error('❌ onGoalCallback is not set! Goals will not update in UI!');
    }
    
    // Stop the ball immediately
    this.stopBall();
    
    // Reset isCompletingKick flag to allow onKickComplete to run
    // This flag was set in checkCollisions, but we need to reset it here
    // so that onKickComplete can process the kick completion
    this.isCompletingKick = false;
    
    // Complete kick after short delay to show goal celebration
    // For last kick, check immediately if level should complete
    const isLastKick = this.currentKick >= this.totalKicks || this.kicksRemaining === 0;
    
    console.log('⏱️ handleGoal: Scheduling onKickComplete', {
      currentKick: this.currentKick,
      totalKicks: this.totalKicks,
      kicksRemaining: this.kicksRemaining,
      isLastKick: isLastKick,
      isCompletingKick: this.isCompletingKick
    });
    
    setTimeout(() => {
      console.log('⏱️ handleGoal: Calling onKickComplete after timeout', {
        currentKick: this.currentKick,
        totalKicks: this.totalKicks,
        kicksRemaining: this.kicksRemaining,
        isCompletingKick: this.isCompletingKick,
        isBallMoving: this.isBallMoving,
        goalScored: this.goalScored,
        missRegistered: this.missRegistered
      });
      
      // Ensure ball is stopped before calling onKickComplete
      if (this.isBallMoving) {
        console.log('⚠️ Ball still moving, stopping it before onKickComplete');
        this.stopBall();
      }
      
      // Check if handleKickComplete method exists
      if (typeof this.handleKickComplete === 'function') {
        console.log('✅ handleKickComplete is a function, calling it...');
        try {
          this.handleKickComplete();
          console.log('✅ handleKickComplete call completed');
        } catch (error) {
          console.error('❌ Error calling handleKickComplete:', error);
        }
      } else {
        console.error('❌ handleKickComplete is not a function!', typeof this.handleKickComplete);
      }
    }, 1500);
  }

  /**
   * Handle miss
   */
  onMiss() {
    console.log('🎯 onMiss() method called', {
      missRegistered: this.missRegistered,
      currentKick: this.currentKick,
      kicksRemaining: this.kicksRemaining
    });
    
    // Prevent double counting misses
    if (this.missRegistered) {
      console.log('⚠️ Miss already registered for this kick, ignoring duplicate call...', {
        currentKick: this.currentKick,
        kicksRemaining: this.kicksRemaining,
        misses: this.score.misses
      });
      return;
    }
    
    // Mark miss as registered IMMEDIATELY to prevent double calls
    this.missRegistered = true;
    console.log('✅ missRegistered set to true');
    
    // Update score
    this.score.misses++;
    
    // Kicks remaining already decreased in processKick()
    // Don't decrease again here
    
    console.log('❌ MISS REGISTERED!', {
      totalMisses: this.score.misses,
      kicksRemaining: this.kicksRemaining,
      currentKick: this.currentKick,
      totalKicks: this.totalKicks,
      score: { ...this.score }
    });
    
    // Stop the ball immediately
    this.stopBall();
    
    // Call callback to update UI
    if (this.onMissCallback) {
      console.log('📞 Calling onMissCallback with score:', this.score);
      try {
        this.onMissCallback(this.score);
        console.log('✅ onMissCallback executed successfully');
      } catch (error) {
        console.error('❌ Error in onMissCallback:', error);
      }
    } else {
      console.warn('⚠️ onMissCallback is not set!');
    }
    
    // Reset isCompletingKick flag to allow onKickComplete to run
    this.isCompletingKick = false;
    
    // Complete kick after short delay
    // Note: handleKickComplete will be called, but it should skip miss registration
    // since missRegistered is already true
    setTimeout(() => {
      console.log('⏱️ onMiss: Scheduling handleKickComplete', {
        currentKick: this.currentKick,
        kicksRemaining: this.kicksRemaining,
        missRegistered: this.missRegistered
      });
      // Call handleKickComplete to complete the kick and reset ball
      // It will skip miss registration since missRegistered is already true
      this.handleKickComplete();
    }, 1000);
  }

  /**
   * Handle kick completion
   */
  handleKickComplete() {
    console.log('📞 handleKickComplete() called', {
      isCompletingKick: this.isCompletingKick,
      goalScored: this.goalScored,
      missRegistered: this.missRegistered,
      kicksRemaining: this.kicksRemaining,
      currentKick: this.currentKick,
      totalKicks: this.totalKicks
    });
    
    // Prevent double calls (but allow if level is complete)
    if (this.isCompletingKick && this.kicksRemaining >= 0) {
      console.log('⚠️ onKickComplete already in progress, ignoring duplicate call');
      return;
    }
    
    this.isCompletingKick = true;
    
    console.log('✅ onKickComplete processing...', {
      goalScored: this.goalScored,
      missRegistered: this.missRegistered,
      kicksRemaining: this.kicksRemaining,
      currentKick: this.currentKick,
      totalKicks: this.totalKicks
    });
    
    // Final check: if ball stopped and goal/miss wasn't registered, check now
    // Only check if goal wasn't already scored and miss wasn't registered
    if (!this.goalScored && !this.missRegistered) {
      const ballPos = this.ball.getPosition();
      const ballRadius = 0.11;
      const goalZ = 25;
      const goalWidth = 7.32;
      const goalHeight = 2.44;
      
      // Use same simple logic as in checkCollisions
      const goalLineZ = goalZ;
      const goalMinX = -goalWidth / 2;
      const goalMaxX = goalWidth / 2;
      const goalMinY = 0;
      const goalMaxY = goalHeight;
      
      const hasCrossedGoalLine = ballPos.z >= goalLineZ;
      const isWithinGoalWidth = ballPos.x >= goalMinX - ballRadius && ballPos.x <= goalMaxX + ballRadius;
      const isWithinGoalHeight = ballPos.y >= goalMinY - ballRadius && ballPos.y <= goalMaxY + ballRadius;
      const isGoal = hasCrossedGoalLine && isWithinGoalWidth && isWithinGoalHeight;
      
      console.log('Final check on kick complete:', {
        ballPosition: { x: ballPos.x.toFixed(2), y: ballPos.y.toFixed(2), z: ballPos.z.toFixed(2) },
        hasCrossedGoalLine: hasCrossedGoalLine,
        isWithinGoalWidth: isWithinGoalWidth,
        isWithinGoalHeight: isWithinGoalHeight,
        isGoal: isGoal,
        goalScored: this.goalScored,
        missRegistered: this.missRegistered
      });
      
      // If ball is in goal, register it
      if (isGoal) {
        console.log('✅ Goal detected on kick complete! Registering goal...');
        this.isCompletingKick = false;
        this.handleGoal();
        return; // handleGoal will call handleKickComplete again
      }
      
      // If not a goal, it's a miss (only if not already registered)
      if (!this.goalScored && !this.missRegistered) {
        console.log('❌ Ball stopped - registering miss in handleKickComplete...');
        this.isCompletingKick = false;
        try {
          this.onMiss();
          console.log('✅ onMiss() called successfully from handleKickComplete');
        } catch (error) {
          console.error('❌ Error calling onMiss() from handleKickComplete:', error);
        }
        return; // onMiss will call handleKickComplete again after delay
      } else if (this.missRegistered) {
        console.log('⚠️ Miss already registered, skipping duplicate registration');
      }
    } else {
      console.log('Goal or miss already registered:', {
        goalScored: this.goalScored,
        missRegistered: this.missRegistered
      });
    }
    
    // If goal or miss was already registered, just complete the kick
    // DO NOT reset flags here - they will be reset at the start of next kick
    // This ensures score is preserved until next kick starts
    
    // Reset completion flag BEFORE checking level complete
    // This allows onKickComplete to be called again if needed
    this.isCompletingKick = false;
    
    // Kicks remaining already decreased in handleGoal() or onMiss() (1 attempt used)
    // Don't decrease again here
    
    console.log('Kick complete:', {
      currentKick: this.currentKick,
      kicksRemaining: this.kicksRemaining,
      goals: this.score.goals,
      misses: this.score.misses
    });
    
    // Check if level complete (no attempts remaining or max kicks reached) BEFORE resetting ball
    const isLevelComplete = this.kicksRemaining === 0 || this.currentKick >= this.totalKicks;
    
    console.log('🔍 Checking if level complete:', {
      currentKick: this.currentKick,
      totalKicks: this.totalKicks,
      kicksRemaining: this.kicksRemaining,
      condition1: this.kicksRemaining === 0,
      condition2: this.currentKick >= this.totalKicks,
      isLevelComplete: isLevelComplete
    });
    
    if (isLevelComplete) {
      console.log('✅✅✅ LEVEL COMPLETE! All kicks finished! ✅✅✅', {
        currentKick: this.currentKick,
        totalKicks: this.totalKicks,
        kicksRemaining: this.kicksRemaining,
        finalScore: { ...this.score }
      });
      // Don't reset ball position - level is complete
      // Complete level immediately
      // Call completeLevel immediately (it will handle stopping the game)
      console.log('⏱️ Calling completeLevel immediately...');
      if (typeof this.completeLevel === 'function') {
        this.completeLevel();
      } else {
        console.error('❌ completeLevel is not a function!', typeof this.completeLevel);
      }
      return;
    }
    
    // Reset ball to fixed position for next kick (only if there are attempts remaining)
    // Always reset if there are attempts left, even if kicksRemaining is 0 but currentKick < totalKicks
    if (this.kicksRemaining > 0 || this.currentKick < this.totalKicks) {
      console.log('🔄 Resetting ball position for next kick...', {
        currentKick: this.currentKick,
        totalKicks: this.totalKicks,
        kicksRemaining: this.kicksRemaining
      });
      this.resetBallPosition();
      console.log('✅ Ball reset complete, ready for next kick');
    } else {
      console.log('⏸️ Not resetting ball - level complete');
    }
    
    // Notify that kick completed (ball stopped)
    if (this.onKickCompleteCallback) {
      this.onKickCompleteCallback({
        kick: this.currentKick,
        remaining: this.kicksRemaining,
        score: this.score,
        attemptUsed: false // Already used in handleGoal() or onMiss()
      });
    }
  }

  /**
   * Reset ball to fixed position near player for next kick
   * Ball is always in the same position at the start of each kick
   */
  resetBallPosition() {
    // Ball should be in center of screen (where camera looks)
    // Camera is at (0, 1.7, -3) looking at (0, 1, 25)
    // Ball should be positioned so it appears in center of screen
    // Fixed position: center of screen, bіля гравця
    
    // Fixed position - always the same for each kick
    const ballX = 0; // Center horizontally
    const ballY = 0.2; // On ground (ball radius)
    const ballZ = 2; // Center of screen (visible in camera view)
    
    this.ball.setPosition(ballX, ballY, ballZ);
    this.ball.reset(); // Reset ball mesh position and velocity
    
    // Update player position relative to ball
    if (this.sceneManager && this.sceneManager.player) {
      this.sceneManager.player.updatePosition(this.ball.getPosition());
    }
    
    // Reset ball velocity and movement state - IMPORTANT: ensure ball is stopped
    this.stopBall();
    this.isBallMoving = false; // Explicitly set to false
    
    // Reset flags for next kick
    this.goalScored = false;
    this.missRegistered = false;
    this.isCompletingKick = false; // Reset completion flag
    
    console.log(`Ball reset to fixed position: (${ballX}, ${ballY}, ${ballZ})`);
    console.log('✅ Ball state reset:', {
      isBallMoving: this.isBallMoving,
      goalScored: this.goalScored,
      missRegistered: this.missRegistered,
      isCompletingKick: this.isCompletingKick
    });
  }

  /**
   * Handle level completion
   */
  completeLevel() {
    console.log('🎯🎯🎯 completeLevel() method called! 🎯🎯🎯', {
      currentKick: this.currentKick,
      totalKicks: this.totalKicks,
      kicksRemaining: this.kicksRemaining,
      score: { ...this.score },
      callbackSet: !!this.onLevelCompleteCallback
    });
    
    // Prevent multiple calls
    if (this.kicksRemaining < 0) {
      console.log('⚠️ Level already completed, ignoring duplicate call');
      return;
    }
    
    // Mark as complete (set to -1 to prevent further kicks) IMMEDIATELY
    this.kicksRemaining = -1;
    
    // Stop ball movement
    this.stopBall();
    this.isBallMoving = false; // Ensure ball is stopped
    
    // Add completion bonus
    this.score.coins += 5; // 5 coins bonus for completing level
    console.log('✅ Level complete! Bonus: +5 coins', {
      totalCoins: this.score.coins,
      goals: this.score.goals,
      misses: this.score.misses,
      finalScore: { ...this.score }
    });
    
    // Call callback to show results dialog
    if (this.onLevelCompleteCallback) {
      console.log('✅✅✅ Calling onLevelCompleteCallback with score:', this.score);
      try {
        this.onLevelCompleteCallback(this.score);
        console.log('✅✅✅ onLevelCompleteCallback executed successfully!');
      } catch (error) {
        console.error('❌❌❌ Error in onLevelCompleteCallback:', error);
        console.error('Error stack:', error.stack);
      }
    } else {
      console.error('❌❌❌ onLevelCompleteCallback is not set! Results screen will not show!');
      console.error('Available callbacks:', {
        onKickCompleteCallback: !!this.onKickCompleteCallback,
        onGoalCallback: !!this.onGoalCallback,
        onMissCallback: !!this.onMissCallback,
        onLevelCompleteCallback: !!this.onLevelCompleteCallback
      });
    }
  }

  /**
   * Start level
   */
  startLevel(levelId) {
    this.currentKick = 0;
    this.kicksRemaining = 5;
    // Store initial coins from state manager
    this.initialCoins = this.stateManager ? this.stateManager.getCoins() : 0;
    this.score = {
      goals: 0,
      misses: 0,
      coins: 0
    };
    
    // Create targets for this level
    if (this.targetManager) {
      this.targetManager.createTargetsForLevel(levelId);
    }
    
    // Reset ball to initial position
    this.resetBallPosition();
  }

  /**
   * Set callbacks
   */
  onKickStart(callback) {
    this.onKickStartCallback = callback;
  }

  onKickComplete(callback) {
    this.onKickCompleteCallback = callback;
  }

  onGoal(callback) {
    this.onGoalCallback = callback;
  }

  onMiss(callback) {
    this.onMissCallback = callback;
  }

  onLevelComplete(callback) {
    this.onLevelCompleteCallback = callback;
  }

  onTargetHit(callback) {
    this.onTargetHitCallback = callback;
  }

  /**
   * Get current game state
   */
  getGameState() {
    return {
      currentKick: this.currentKick,
      kicksRemaining: this.kicksRemaining,
      isBallMoving: this.isBallMoving,
      score: this.score
    };
  }
}

