import * as THREE from 'three';

/**
 * Camera Controller
 * Manages static camera position - always shows goal in center
 */
export class CameraController {
  constructor(camera, ball, player = null) {
    this.camera = camera;
    this.ball = ball;
    this.player = player;
    // 3D camera - at player eye level, looking at ball (center of screen)
    // Camera positioned behind player, at eye level
    // Ball is in center of screen, player on the left, goal in background
    this.initialPosition = new THREE.Vector3(0, 1.7, -3); // Behind player, at eye level (1.7m)
    this.initialLookAt = new THREE.Vector3(0, 0.5, 2); // Look at ball area (center of screen, z=2)
  }

  /**
   * Update camera (static - no movement)
   */
  update() {
    // Camera is static - always shows goal in center
    // No need to update position
  }

  /**
   * Reset camera to static position
   */
  reset() {
    // Set static camera position - always shows goal in center
    this.camera.position.copy(this.initialPosition);
    this.camera.lookAt(this.initialLookAt);
    this.camera.updateMatrixWorld();
    
    console.log('Camera reset to 3D position:', {
      position: this.camera.position,
      lookAt: this.initialLookAt
    });
  }

  /**
   * Initialize camera to static position
   */
  init() {
    this.reset();
  }
}

