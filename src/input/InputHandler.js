import * as THREE from 'three';

/**
 * Input Handler
 * Handles mouse input for kick direction/power and UI interactions
 */
export class InputHandler {
  constructor(renderer, camera, scene, ball, player = null) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.ball = ball; // Reference to ball object
    this.player = player; // Reference to player object
    this.canvas = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Kick state
    this.isAiming = false;
    this.kickStartPosition = null;
    this.kickEndPosition = null;
    this.trajectoryPreview = null;
    this.pendingKickParams = null; // Store kick params until animation completes
    
    // Callbacks
    this.onKickCallback = null;
    this.onAimStartCallback = null;
    this.onAimUpdateCallback = null;
  }

  /**
   * Initialize input handlers
   */
  init() {
    this.canvas = this.renderer.renderer.domElement;
    
    // Mouse move - update aim direction
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    
    // Mouse down - start aiming
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    
    // Mouse up - execute kick
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    
    // Prevent context menu on right click
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Convert screen coordinates to 3D world position
   */
  getMouseWorldPosition(event, ballPosition) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create raycaster from camera through mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Intersect with ground plane (y = 0)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);
    
    return intersectionPoint;
  }

  /**
   * Calculate kick direction and power from mouse position
   * Similar to Indoor Soccer - direction is always forward (towards goal), mouse position determines angle and power
   */
  calculateKickParameters(mouseWorldPos, ballPosition) {
    // Goal is at z = 25, ball is on opponent's half (z > 0)
    // Direction should always go forward (towards goal), mouse position determines horizontal angle
    
    // Calculate horizontal offset from ball to mouse (X axis)
    const horizontalOffset = mouseWorldPos.x - ballPosition.x;
    
    // Calculate forward direction (always towards goal at z=25)
    const goalZ = 25;
    const forwardDistance = goalZ - ballPosition.z;
    
    // Create direction vector: forward (Z) with horizontal angle (X) from mouse position
    // Normalize to ensure consistent speed
    const direction = new THREE.Vector3(
      horizontalOffset * 0.3, // Horizontal angle (reduced for more control)
      0, // Will be set in GameLogic for upward component
      Math.max(forwardDistance, 1) // Always forward
    ).normalize();
    
    // Power based on distance from ball to mouse (clamped to reasonable range)
    const distance = mouseWorldPos.distanceTo(ballPosition);
    const maxDistance = 30; // Maximum kick distance
    const power = Math.min(distance / maxDistance, 1.0);
    
    // Ensure minimum power
    const minPower = 0.3;
    const finalPower = Math.max(power, minPower);
    
    return {
      direction: direction,
      power: finalPower,
      distance: distance
    };
  }

  /**
   * Handle mouse move - update trajectory preview
   */
  onMouseMove(event) {
    if (!this.isAiming) return;
    
    // Get ball position from ball object
    const ballPosition = this.ball ? this.ball.getPosition() : this.kickStartPosition;
    if (!ballPosition) return;
    
    // Get mouse world position
    const mouseWorldPos = this.getMouseWorldPosition(event, ballPosition);
    this.kickEndPosition = mouseWorldPos;
    
    // Calculate kick parameters
    const params = this.calculateKickParameters(mouseWorldPos, ballPosition);
    
    // Don't show trajectory preview - removed for better gameplay
    // Call update callback if set
    if (this.onAimUpdateCallback) {
      this.onAimUpdateCallback(params);
    }
  }

  /**
   * Handle mouse down - start aiming and player animation
   */
  onMouseDown(event) {
    if (event.button !== 0) return; // Only left mouse button
    
    // Get ball position from ball object
    const ballPosition = this.ball ? this.ball.getPosition() : new THREE.Vector3(0, 0.2, -25);
    this.kickStartPosition = ballPosition.clone();
    this.isAiming = true;
    
    // Start player run-up and swing animation
    if (this.player) {
      this.player.startKickAnimation();
    }
    
    // Call start callback if set
    if (this.onAimStartCallback) {
      this.onAimStartCallback();
    }
  }

  /**
   * Handle mouse up - store kick params, execute after animation
   */
  onMouseUp(event) {
    if (event.button !== 0 || !this.isAiming) return;
    
    this.isAiming = false;
    
    if (this.kickStartPosition && this.kickEndPosition) {
      // Calculate final kick parameters
      const params = this.calculateKickParameters(
        this.kickEndPosition,
        this.kickStartPosition
      );
      
      // Store kick params - will execute when animation completes
      this.pendingKickParams = params;
    }
    
    // Reset
    this.kickStartPosition = null;
    this.kickEndPosition = null;
  }

  /**
   * Check if animation is complete and execute pending kick
   */
  checkAndExecuteKick() {
    if (this.pendingKickParams && this.player && !this.player.isAnimating) {
      // Animation complete, execute kick
      if (this.onKickCallback) {
        this.onKickCallback(this.pendingKickParams);
      }
      this.pendingKickParams = null;
    }
  }

  /**
   * Update trajectory preview line
   */
  updateTrajectoryPreview(ballPosition, params) {
    // Remove old preview if exists
    this.removeTrajectoryPreview();
    
    // Create trajectory preview using physics calculation
    const points = this.calculateTrajectoryPoints(ballPosition, params);
    
    // Create line geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffff00, // Yellow preview line
      linewidth: 2,
      opacity: 0.7,
      transparent: true
    });
    
    this.trajectoryPreview = new THREE.Line(geometry, material);
    this.scene.add(this.trajectoryPreview);
  }

  /**
   * Calculate trajectory points for preview
   */
  calculateTrajectoryPoints(startPos, params) {
    const points = [];
    const gravity = -9.81;
    const initialSpeed = params.power * 20; // Scale power to speed
    const timeStep = 0.1;
    const maxTime = 3.0;
    
    // Initial velocity
    const velocity = params.direction.clone().multiplyScalar(initialSpeed);
    velocity.y = Math.abs(velocity.y) * 0.3 + 0.5; // Add upward component
    
    let position = startPos.clone();
    let time = 0;
    
    while (time < maxTime && position.y >= 0) {
      points.push(position.clone());
      
      // Update position
      position.add(velocity.clone().multiplyScalar(timeStep));
      velocity.y += gravity * timeStep;
      
      time += timeStep;
    }
    
    return points;
  }

  /**
   * Remove trajectory preview
   */
  removeTrajectoryPreview() {
    if (this.trajectoryPreview) {
      this.scene.remove(this.trajectoryPreview);
      this.trajectoryPreview.geometry.dispose();
      this.trajectoryPreview.material.dispose();
      this.trajectoryPreview = null;
    }
  }

  /**
   * Set callback for kick execution
   */
  onKick(callback) {
    this.onKickCallback = callback;
  }

  /**
   * Set callback for aim start
   */
  onAimStart(callback) {
    this.onAimStartCallback = callback;
  }

  /**
   * Set callback for aim update
   */
  onAimUpdate(callback) {
    this.onAimUpdateCallback = callback;
  }

  /**
   * Cleanup
   */
  dispose() {
    this.removeTrajectoryPreview();
    // Remove event listeners would be here if needed
  }
}

