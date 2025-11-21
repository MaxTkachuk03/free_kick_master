import * as THREE from 'three';

/**
 * Target component
 * Represents a target in the goal (coin, lightning, fire) that gives bonus coins when hit
 */
export class Target {
  constructor(type = 'coin', position = new THREE.Vector3(0, 1, 25), reward = 5) {
    this.type = type; // 'coin', 'lightning', 'fire'
    this.position = position.clone();
    this.reward = reward;
    this.isHit = false;
    this.mesh = null;
    this.size = 0.5; // Target size
    this.createMesh();
  }

  /**
   * Create 3D target mesh based on type
   */
  createMesh() {
    const targetGroup = new THREE.Group();
    
    let material;
    let geometry;
    
    switch (this.type) {
      case 'coin':
        // Gold coin - circular, flat
        material = new THREE.MeshStandardMaterial({
          color: 0xffd700, // Gold
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0xffd700,
          emissiveIntensity: 0.3
        });
        geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, 0.05, 16);
        break;
        
      case 'lightning':
        // Lightning bolt - yellow zigzag
        material = new THREE.MeshStandardMaterial({
          color: 0xffff00, // Yellow
          emissive: 0xffff00,
          emissiveIntensity: 0.5
        });
        // Create lightning shape using custom geometry
        const shape = new THREE.Shape();
        shape.moveTo(0, this.size / 2);
        shape.lineTo(-this.size / 4, this.size / 4);
        shape.lineTo(0, 0);
        shape.lineTo(this.size / 4, -this.size / 4);
        shape.lineTo(0, -this.size / 2);
        shape.lineTo(-this.size / 4, -this.size / 4);
        shape.lineTo(0, 0);
        shape.lineTo(this.size / 4, this.size / 4);
        shape.lineTo(0, this.size / 2);
        const extrudeSettings = {
          depth: 0.1,
          bevelEnabled: false
        };
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        break;
        
      case 'fire':
        // Fire - orange/red sphere with glow
        material = new THREE.MeshStandardMaterial({
          color: 0xff4500, // Orange-red
          emissive: 0xff4500,
          emissiveIntensity: 0.6
        });
        geometry = new THREE.SphereGeometry(this.size / 2, 16, 16);
        break;
        
      default:
        // Default to coin
        material = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          metalness: 0.8,
          roughness: 0.2
        });
        geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, 0.05, 16);
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Add glow effect for visibility
    const glowGeometry = geometry.clone();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: material.color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.multiplyScalar(1.2);
    targetGroup.add(glowMesh);
    targetGroup.add(mesh);
    
    // Rotate coin to be flat (horizontal)
    if (this.type === 'coin') {
      mesh.rotation.x = Math.PI / 2;
      glowMesh.rotation.x = Math.PI / 2;
    }
    
    // Rotate lightning to face forward
    if (this.type === 'lightning') {
      mesh.rotation.z = Math.PI / 2;
    }
    
    this.mesh = targetGroup;
    this.mesh.position.copy(this.position);
    
    // Add pulsing animation
    this.animationOffset = Math.random() * Math.PI * 2;
  }

  /**
   * Update target animation (pulsing effect)
   */
  update(deltaTime) {
    if (this.isHit || !this.mesh) return;
    
    // Pulsing scale animation
    const pulseSpeed = 2.0;
    const pulseAmount = 0.1;
    const scale = 1.0 + Math.sin(Date.now() * 0.001 * pulseSpeed + this.animationOffset) * pulseAmount;
    this.mesh.scale.set(scale, scale, scale);
    
    // Rotation for coin
    if (this.type === 'coin') {
      this.mesh.rotation.z += deltaTime * 0.5;
    }
  }

  /**
   * Check if ball hit this target
   */
  checkCollision(ballPosition, ballRadius = 0.11) {
    if (this.isHit) return false;
    
    const distance = ballPosition.distanceTo(this.position);
    return distance < (this.size / 2 + ballRadius);
  }

  /**
   * Mark target as hit
   */
  hit() {
    if (this.isHit) return false;
    
    this.isHit = true;
    
    // Animate target disappearing
    if (this.mesh) {
      const startScale = this.mesh.scale.x;
      const startTime = Date.now();
      const duration = 300; // 300ms animation
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scale = startScale * (1 - progress);
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.material?.forEach(mat => {
          if (mat.opacity !== undefined) {
            mat.opacity = 1 - progress;
          }
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Hide mesh after animation
          this.mesh.visible = false;
        }
      };
      
      animate();
    }
    
    return true;
  }

  /**
   * Get target mesh for adding to scene
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Reset target (for new level/kick)
   */
  reset() {
    this.isHit = false;
    if (this.mesh) {
      this.mesh.visible = true;
      this.mesh.scale.set(1, 1, 1);
      this.mesh.material?.forEach(mat => {
        if (mat.opacity !== undefined) {
          mat.opacity = 1;
        }
      });
    }
  }
}

