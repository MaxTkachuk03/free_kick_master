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
    this.kickStartTime = null; // Track time for swipe speed calculation
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
   * Direction is always towards goal (positive Z), mouse position determines horizontal angle
   * Swipe speed determines ball height - faster swipe = higher flight
   */
  calculateKickParameters(mouseWorldPos, ballPosition, swipeSpeed = 0) {
    // Calculate direction vector from ball to mouse position
    // This is the swipe direction - ball should fly in this exact direction
    const swipeDirection = new THREE.Vector3()
      .subVectors(mouseWorldPos, ballPosition);
    
    // Calculate power based on swipe distance
    const distance = swipeDirection.length();
    const maxDistance = 20; // Maximum kick distance
    const power = Math.min(distance / maxDistance, 1.0);
    
    // Ensure minimum power
    const minPower = 0.3;
    const finalPower = Math.max(power, minPower);
    
    // Store original components before any adjustments
    // These represent the exact angles of the swipe
    const originalX = swipeDirection.x;
    const originalY = swipeDirection.y;
    const originalZ = swipeDirection.z;
    const originalLength = swipeDirection.length();
    
    // Normalize to get direction
    swipeDirection.normalize();
    
    // Preserve the exact horizontal (X) and vertical (Y) direction from swipe
    // Only adjust Z component to ensure forward movement towards goal (z=25)
    // The X component determines left/right direction - preserve it exactly
    // The Y component determines up/down direction - preserve it exactly
    
    // If swipe goes backwards (negative Z), we need to flip it forward
    // But keep X and Y exactly as swiped
    if (swipeDirection.z < 0) {
      // Calculate the horizontal/vertical magnitude (X and Y combined)
      const horizontalVerticalMag = Math.sqrt(originalX * originalX + originalY * originalY);
      const forwardMag = Math.abs(originalZ);
      
      // If there's horizontal/vertical component, preserve it exactly
      if (horizontalVerticalMag > 0.001) {
        // Normalize X and Y to preserve their ratio
        swipeDirection.x = originalX / horizontalVerticalMag;
        swipeDirection.y = originalY / horizontalVerticalMag;
        // Set Z to forward, scaled to maintain unit vector
        const totalMag = Math.sqrt(horizontalVerticalMag * horizontalVerticalMag + forwardMag * forwardMag);
        swipeDirection.z = forwardMag / totalMag;
        // Re-normalize X and Y to maintain unit vector
        const scale = Math.sqrt(1 - swipeDirection.z * swipeDirection.z) / Math.sqrt(swipeDirection.x * swipeDirection.x + swipeDirection.y * swipeDirection.y);
        swipeDirection.x *= scale;
        swipeDirection.y *= scale;
      } else {
        // No horizontal component, just flip Z
        swipeDirection.z = Math.abs(swipeDirection.z);
        swipeDirection.normalize();
      }
    }
    
    // Ensure minimum forward component (always towards goal)
    // But preserve X and Y components exactly as swiped
    if (swipeDirection.z < 0.1) {
      // Calculate horizontal/vertical magnitude
      const horizontalVerticalMag = Math.sqrt(swipeDirection.x * swipeDirection.x + swipeDirection.y * swipeDirection.y);
      
      if (horizontalVerticalMag > 0.001) {
        // Preserve X and Y ratio, scale them down to make room for minimum Z
        const scale = Math.sqrt(1 - 0.1 * 0.1) / horizontalVerticalMag;
        swipeDirection.x *= scale;
        swipeDirection.y *= scale;
        swipeDirection.z = 0.1;
      } else {
        // No horizontal component, just set minimum Z
        swipeDirection.z = 0.1;
        swipeDirection.normalize();
      }
    }
    
    return {
      direction: swipeDirection, // Normalized direction vector (preserves exact swipe angles)
      power: finalPower,         // Power from 0.3 to 1.0 based on swipe distance
      distance: distance,        // Raw distance
      swipeSpeed: swipeSpeed     // Swipe speed (0-2.0) for height control
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
    
    // Calculate kick parameters (no swipe speed during move, only on mouse up)
    const params = this.calculateKickParameters(mouseWorldPos, ballPosition, 0);
    
    // Don't show trajectory preview - removed for better gameplay
    // Call update callback if set
    if (this.onAimUpdateCallback) {
      this.onAimUpdateCallback(params);
    }
  }

  /**
   * Handle mouse down - start aiming (no animation delay)
   */
  onMouseDown(event) {
    if (event.button !== 0) return; // Only left mouse button
    
    // Get ball position from ball object
    const ballPosition = this.ball ? this.ball.getPosition() : new THREE.Vector3(0, 0.2, 5);
    this.kickStartPosition = ballPosition.clone();
    this.kickStartTime = performance.now(); // Track start time for swipe speed
    this.isAiming = true;
    
    // No player animation - immediate kick on mouse up
    // Call start callback if set
    if (this.onAimStartCallback) {
      this.onAimStartCallback();
    }
  }

  /**
   * Handle mouse up - execute kick immediately (one swipe = one kick)
   */
  onMouseUp(event) {
    if (event.button !== 0 || !this.isAiming) return;
    
    this.isAiming = false;
    
    if (this.kickStartPosition && this.kickEndPosition && this.kickStartTime) {
      // Calculate swipe speed (distance / time)
      const swipeTime = (performance.now() - this.kickStartTime) / 1000; // Convert to seconds
      const swipeDistance = this.kickEndPosition.distanceTo(this.kickStartPosition);
      const swipeSpeed = swipeTime > 0 ? swipeDistance / swipeTime : 0; // pixels per second
      
      // Normalize swipe speed (typical swipe: 100-1000 pixels/second)
      const normalizedSwipeSpeed = Math.min(swipeSpeed / 500, 2.0); // Clamp to 0-2.0
      
      // Calculate final kick parameters with swipe speed
      const params = this.calculateKickParameters(
        this.kickEndPosition,
        this.kickStartPosition,
        normalizedSwipeSpeed
      );
      
      // Execute kick immediately - no animation delay
      if (this.onKickCallback) {
        this.onKickCallback(params);
      }
    }
    
    // Reset
    this.kickStartPosition = null;
    this.kickEndPosition = null;
    this.kickStartTime = null;
  }

  /**
   * Check if animation is complete and execute pending kick
   * (Not used anymore - kicks execute immediately)
   */
  checkAndExecuteKick() {
    // Kicks now execute immediately on mouse up
    // This method kept for compatibility but does nothing
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

