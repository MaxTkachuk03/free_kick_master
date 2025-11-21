import * as THREE from 'three';

/**
 * Ball component
 * Represents the football in the game
 */
export class Ball {
  constructor() {
    this.mesh = null;
    this.material = null; // Store material reference for customization
    this.patternMeshes = []; // Store pattern meshes for customization
    // Initial position in center of screen (will be set by game logic)
    this.position = new THREE.Vector3(0, 0.2, 2); // Start in center area
    this.radius = 0.11; // Standard football radius (~22cm diameter)
    this.createMesh();
  }

  /**
   * Create 3D ball mesh
   */
  createMesh() {
    // Create sphere geometry for ball
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    
    // Create material with white base color and black pattern
    // For now, simple white material (can add texture later)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White
      roughness: 0.3,
      metalness: 0.1
    });
    this.material = material; // Store reference for customization
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    // Add simple black pentagon pattern (simplified)
    this.addPattern();
  }

  /**
   * Add black and white pattern to ball (classic football pattern)
   */
  addPattern() {
    // Create black pentagon/hexagon pattern using multiple black patches
    const blackMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });

    // Add black pentagons (simplified as circles for visual effect)
    const pentagonCount = 12;
    for (let i = 0; i < pentagonCount; i++) {
      const pentagonGeometry = new THREE.CircleGeometry(this.radius * 0.15, 5);
      const pentagon = new THREE.Mesh(pentagonGeometry, blackMaterial);
      
      // Distribute pentagons around the sphere
      const phi = Math.acos(-1 + (2 * i) / pentagonCount);
      const theta = Math.sqrt(pentagonCount * Math.PI) * phi;
      
      pentagon.position.set(
        this.radius * 0.9 * Math.cos(theta) * Math.sin(phi),
        this.radius * 0.9 * Math.sin(theta) * Math.sin(phi),
        this.radius * 0.9 * Math.cos(phi)
      );
      
      // Orient pentagon to face outward
      pentagon.lookAt(
        pentagon.position.x * 2,
        pentagon.position.y * 2,
        pentagon.position.z * 2
      );
      
      this.mesh.add(pentagon);
      this.patternMeshes.push(pentagon); // Store reference for customization
    }

    // Add black stripes for classic football look
    const stripeGeometry = new THREE.RingGeometry(this.radius * 0.85, this.radius, 32);
    for (let i = 0; i < 3; i++) {
      const stripe = new THREE.Mesh(stripeGeometry, blackMaterial);
      stripe.rotation.x = Math.PI / 2;
      stripe.rotation.z = (i * Math.PI * 2) / 3;
      this.mesh.add(stripe);
      this.patternMeshes.push(stripe); // Store reference for customization
    }
  }

  /**
   * Get the ball mesh for adding to scene
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Reset ball to initial position
   */
  reset() {
    // Reset ball mesh position and ensure it's at the correct position
    this.mesh.position.copy(this.position);
    // Reset any rotation or other state if needed
  }

  /**
   * Set ball position
   */
  setPosition(x, y, z) {
    this.position.set(x, y, z);
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
  }

  /**
   * Get current position
   */
  getPosition() {
    return this.mesh ? this.mesh.position : this.position;
  }

  /**
   * Apply ball style/color
   * @param {Object} ballConfig - Ball configuration with color
   */
  applyBallStyle(ballConfig) {
    if (!ballConfig) {
      console.warn('⚠️ applyBallStyle: ballConfig is null or undefined');
      return;
    }
    
    console.log('⚽ Applying ball style:', ballConfig);
    
    // Apply base color
    if (ballConfig.color !== undefined && this.material) {
      console.log('⚽ Setting ball color to:', ballConfig.color.toString(16));
      this.material.color.setHex(ballConfig.color);
    }
    
    // Apply pattern color if specified
    if (ballConfig.patternColor !== undefined) {
      console.log('⚽ Setting pattern color to:', ballConfig.patternColor.toString(16));
      this.patternMeshes.forEach(patternMesh => {
        if (patternMesh.material) {
          patternMesh.material.color.setHex(ballConfig.patternColor);
        }
      });
    }
    
    // Show/hide pattern based on ball type
    if (ballConfig.hasPattern === false) {
      console.log('⚽ Hiding pattern');
      this.patternMeshes.forEach(patternMesh => {
        patternMesh.visible = false;
      });
    } else if (ballConfig.hasPattern === true) {
      console.log('⚽ Showing pattern');
      this.patternMeshes.forEach(patternMesh => {
        patternMesh.visible = true;
      });
    }
    
    console.log('✅ Ball style applied successfully');
  }
}

