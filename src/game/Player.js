import * as THREE from 'three';

/**
 * Player component
 * Represents the football player who kicks the ball
 */
export class Player {
  constructor() {
    this.mesh = null;
    this.position = new THREE.Vector3(0, 0, 0);
    
    // Animation state
    this.isAnimating = false;
    this.animationProgress = 0;
    this.animationDuration = 0.5; // 0.5 seconds for run-up and swing
    this.animationStartTime = 0;
    
    // Body parts for animation and customization
    this.bodyParts = {
      rightLeg: null,
      rightFoot: null,
      rightArm: null,
      leftLeg: null,
      leftFoot: null,
      leftArm: null,
      body: null
    };
    
    // Material references for customization
    this.materials = {
      jerseyBase: null,
      jerseyStripe: null,
      jerseyYellowStripe: null,
      collar: null,
      shorts: null,
      boots: null
    };
    
    // Jersey stripe meshes for customization
    this.jerseyStripes = [];
    
    // Initial positions/rotations for reset
    this.initialStates = {};
    
    this.createMesh();
  }

  /**
   * Create 3D player mesh (stylized like the reference image)
   */
  createMesh() {
    const playerGroup = new THREE.Group();

    // Player materials - striped jersey (red/blue with yellow), dark blue shorts, red boots with white stripes
    // Create striped jersey material using a texture or multiple materials
    // For simplicity, we'll use a base material and add stripes as separate meshes
    const jerseyBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // Red base
      roughness: 0.7,
      metalness: 0.1
    });
    this.materials.jerseyBase = jerseyBaseMaterial;
    
    const jerseyStripeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0000ff, // Blue stripes
      roughness: 0.7,
      metalness: 0.1
    });
    this.materials.jerseyStripe = jerseyStripeMaterial;
    
    const jerseyYellowStripeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00, // Yellow thin stripes
      roughness: 0.7,
      metalness: 0.1
    });
    this.materials.jerseyYellowStripe = jerseyYellowStripeMaterial;
    
    const collarMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00, // Yellow collar
      roughness: 0.7,
      metalness: 0.1
    });
    this.materials.collar = collarMaterial;

    const shortsMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a3a5c, // Dark blue shorts
      roughness: 0.7,
      metalness: 0.1
    });
    this.materials.shorts = shortsMaterial;

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdbac, // Skin color
      roughness: 0.8,
      metalness: 0.0
    });

    const sockMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White socks
      roughness: 0.7,
      metalness: 0.1
    });

    const bootMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // Red boots
      roughness: 0.6,
      metalness: 0.2
    });
    this.materials.boots = bootMaterial;
    
    const bootStripeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White stripes on boots
      roughness: 0.6,
      metalness: 0.2
    });

    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.set(0, 0.9, 0);
    head.castShadow = true;
    playerGroup.add(head);

    // Hair removed - player is bald

    // Body (torso) - striped jersey (red/blue with yellow)
    const bodyGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.2);
    const body = new THREE.Mesh(bodyGeometry, jerseyBaseMaterial);
    body.position.set(0, 0.5, 0);
    body.castShadow = true;
    playerGroup.add(body);
    this.bodyParts.body = body;
    
    // Add vertical stripes to jersey
    const stripeWidth = 0.03;
    const stripeSpacing = 0.06;
    for (let i = -0.12; i <= 0.12; i += stripeSpacing) {
      // Blue stripes
      const blueStripe = new THREE.Mesh(
        new THREE.BoxGeometry(stripeWidth, 0.4, 0.21),
        jerseyStripeMaterial
      );
      blueStripe.position.set(i, 0.5, 0);
      playerGroup.add(blueStripe);
      this.jerseyStripes.push(blueStripe); // Store reference for customization
      
      // Yellow thin stripes between red and blue
      if (i < 0.12) {
        const yellowStripe = new THREE.Mesh(
          new THREE.BoxGeometry(stripeWidth * 0.5, 0.4, 0.21),
          jerseyYellowStripeMaterial
        );
        yellowStripe.position.set(i + stripeSpacing / 2, 0.5, 0);
        playerGroup.add(yellowStripe);
        this.jerseyStripes.push(yellowStripe); // Store reference for customization
      }
    }
    
    // Add yellow collar
    const collarGeometry = new THREE.TorusGeometry(0.08, 0.01, 8, 16);
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.set(0, 0.65, 0.1);
    collar.rotation.x = Math.PI / 2;
    playerGroup.add(collar);

    // Add number "10" on the back (white)
    const numberMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, // White number
      side: THREE.DoubleSide
    });
    
    // Create "1" - vertical line
    const oneLine = new THREE.Mesh(
      new THREE.PlaneGeometry(0.02, 0.12),
      numberMaterial
    );
    oneLine.position.set(-0.04, 0.5, -0.11);
    playerGroup.add(oneLine);
    
    // Create "0" - circle/oval
    const zeroGeometry = new THREE.RingGeometry(0.04, 0.06, 16);
    const zero = new THREE.Mesh(zeroGeometry, numberMaterial);
    zero.position.set(0.04, 0.5, -0.11);
    zero.rotation.x = -Math.PI / 2;
    playerGroup.add(zero);

    // Left arm (short sleeve - upper arm with jersey, lower arm with skin)
    const upperArmGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 8);
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, jerseyBaseMaterial); // Striped sleeve
    leftUpperArm.position.set(-0.2, 0.65, 0);
    leftUpperArm.rotation.z = Math.PI / 6;
    leftUpperArm.castShadow = true;
    playerGroup.add(leftUpperArm);
    
    const lowerArmGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8);
    const leftLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial); // Skin
    leftLowerArm.position.set(-0.25, 0.5, 0);
    leftLowerArm.rotation.z = Math.PI / 6;
    leftLowerArm.castShadow = true;
    playerGroup.add(leftLowerArm);
    this.bodyParts.leftArm = leftUpperArm;

    // Right arm (short sleeve, extended)
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, jerseyBaseMaterial); // Striped sleeve
    rightUpperArm.position.set(0.2, 0.65, 0.1);
    rightUpperArm.rotation.z = -Math.PI / 4;
    rightUpperArm.castShadow = true;
    playerGroup.add(rightUpperArm);
    
    const rightLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial); // Skin
    rightLowerArm.position.set(0.28, 0.55, 0.15);
    rightLowerArm.rotation.z = -Math.PI / 4;
    rightLowerArm.castShadow = true;
    playerGroup.add(rightLowerArm);
    this.bodyParts.rightArm = rightUpperArm;

    // Shorts (dark blue)
    const shortsGeometry = new THREE.BoxGeometry(0.32, 0.25, 0.22);
    const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
    shorts.position.set(0, 0.2, 0);
    shorts.castShadow = true;
    playerGroup.add(shorts);

    // Left leg
    const legGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
    const leftLeg = new THREE.Mesh(legGeometry, skinMaterial);
    leftLeg.position.set(-0.08, -0.05, 0);
    leftLeg.castShadow = true;
    playerGroup.add(leftLeg);
    this.bodyParts.leftLeg = leftLeg;

    // Left sock (white)
    const leftSock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.15, 8),
      sockMaterial
    );
    leftSock.position.set(-0.08, -0.2, 0);
    leftSock.castShadow = true;
    playerGroup.add(leftSock);

    // Right leg (kicking leg - extended)
    const rightLeg = new THREE.Mesh(legGeometry, skinMaterial);
    rightLeg.position.set(0.08, -0.05, 0.15);
    rightLeg.rotation.x = -Math.PI / 3;
    rightLeg.castShadow = true;
    playerGroup.add(rightLeg);
    this.bodyParts.rightLeg = rightLeg;

    // Right sock (white)
    const rightSock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.15, 8),
      sockMaterial
    );
    rightSock.position.set(0.08, -0.15, 0.2);
    rightSock.rotation.x = -Math.PI / 3;
    rightSock.castShadow = true;
    playerGroup.add(rightSock);

    // Left foot (red boots with white stripes)
    const footGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.2);
    const leftFoot = new THREE.Mesh(footGeometry, bootMaterial);
    leftFoot.position.set(-0.08, -0.3, 0.05);
    leftFoot.castShadow = true;
    playerGroup.add(leftFoot);
    
    // Add white stripes to left boot
    const leftBootStripe1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.02, 0.03),
      bootStripeMaterial
    );
    leftBootStripe1.position.set(-0.08, -0.28, 0.08);
    playerGroup.add(leftBootStripe1);
    
    const leftBootStripe2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.02, 0.03),
      bootStripeMaterial
    );
    leftBootStripe2.position.set(-0.08, -0.28, 0.02);
    playerGroup.add(leftBootStripe2);
    
    this.bodyParts.leftFoot = leftFoot;

    // Right foot (red boots with white stripes, kicking - extended)
    const rightFoot = new THREE.Mesh(footGeometry, bootMaterial);
    rightFoot.position.set(0.08, -0.2, 0.25);
    rightFoot.rotation.x = -Math.PI / 3;
    rightFoot.castShadow = true;
    playerGroup.add(rightFoot);
    
    // Add white stripes to right boot
    const rightBootStripe1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.02, 0.03),
      bootStripeMaterial
    );
    rightBootStripe1.position.set(0.08, -0.18, 0.28);
    rightBootStripe1.rotation.x = -Math.PI / 3;
    playerGroup.add(rightBootStripe1);
    
    const rightBootStripe2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.02, 0.03),
      bootStripeMaterial
    );
    rightBootStripe2.position.set(0.08, -0.18, 0.22);
    rightBootStripe2.rotation.x = -Math.PI / 3;
    playerGroup.add(rightBootStripe2);
    
    this.bodyParts.rightFoot = rightFoot;

    this.mesh = playerGroup;
    this.mesh.position.copy(this.position);
    
    // Store initial states for animation reset (after all parts are created)
    this.saveInitialStates();
  }

  /**
   * Save initial positions/rotations for animation reset
   */
  saveInitialStates() {
    if (!this.bodyParts.rightLeg || !this.bodyParts.rightFoot || 
        !this.bodyParts.rightArm || !this.bodyParts.leftLeg || 
        !this.bodyParts.leftFoot || !this.bodyParts.leftArm || 
        !this.bodyParts.body) {
      console.warn('Player: Not all body parts initialized before saveInitialStates');
      return;
    }
    
    this.initialStates.rightLeg = {
      position: this.bodyParts.rightLeg.position.clone(),
      rotation: this.bodyParts.rightLeg.rotation.clone()
    };
    this.initialStates.rightFoot = {
      position: this.bodyParts.rightFoot.position.clone(),
      rotation: this.bodyParts.rightFoot.rotation.clone()
    };
    this.initialStates.rightArm = {
      position: this.bodyParts.rightArm.position.clone(),
      rotation: this.bodyParts.rightArm.rotation.clone()
    };
    this.initialStates.leftLeg = {
      position: this.bodyParts.leftLeg.position.clone(),
      rotation: this.bodyParts.leftLeg.rotation.clone()
    };
    this.initialStates.leftFoot = {
      position: this.bodyParts.leftFoot.position.clone(),
      rotation: this.bodyParts.leftFoot.rotation.clone()
    };
    this.initialStates.leftArm = {
      position: this.bodyParts.leftArm.position.clone(),
      rotation: this.bodyParts.leftArm.rotation.clone()
    };
    this.initialStates.body = {
      position: this.bodyParts.body.position.clone(),
      rotation: this.bodyParts.body.rotation.clone()
    };
  }

  /**
   * Start run-up and swing animation
   */
  startKickAnimation() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.animationProgress = 0;
    this.animationStartTime = performance.now() / 1000;
  }

  /**
   * Update animation (called every frame)
   */
  updateAnimation(deltaTime) {
    if (!this.isAnimating) return;
    
    // Check if initial states are set
    if (!this.initialStates || !this.initialStates.body || !this.bodyParts.body) {
      console.warn('Player: Animation states not initialized');
      this.isAnimating = false;
      return;
    }

    this.animationProgress += deltaTime;
    const progress = Math.min(this.animationProgress / this.animationDuration, 1.0);

    if (progress >= 1.0) {
      // Animation complete - reset to idle
      this.resetToIdle();
      this.isAnimating = false;
      return;
    }

    // Phase 1: Run-up (0-0.3) - player moves back slightly
    // Phase 2: Swing (0.3-1.0) - player swings leg forward
    if (progress < 0.3) {
      // Run-up phase
      const runUpProgress = progress / 0.3;
      const backOffset = Math.sin(runUpProgress * Math.PI) * 0.3;
      
      // Move body back slightly
      if (this.bodyParts.body && this.initialStates.body) {
        this.bodyParts.body.position.z = this.initialStates.body.position.z - backOffset;
      }
      
      // Right leg goes back
      if (this.bodyParts.rightLeg && this.initialStates.rightLeg) {
        this.bodyParts.rightLeg.position.z = this.initialStates.rightLeg.position.z - backOffset * 0.5;
        this.bodyParts.rightLeg.rotation.x = -Math.PI / 6;
      }
      
      // Right arm goes back
      if (this.bodyParts.rightArm && this.initialStates.rightArm) {
        this.bodyParts.rightArm.rotation.z = -Math.PI / 2;
      }
      
    } else {
      // Swing phase
      const swingProgress = (progress - 0.3) / 0.7;
      const swingEase = 1 - Math.pow(1 - swingProgress, 3); // Ease out
      
      // Body moves forward
      if (this.bodyParts.body && this.initialStates.body) {
        const forwardOffset = Math.sin(swingProgress * Math.PI) * 0.2;
        this.bodyParts.body.position.z = this.initialStates.body.position.z - 0.3 + forwardOffset;
      }
      
      // Right leg swings forward (kicking motion)
      if (this.bodyParts.rightLeg && this.initialStates.rightLeg) {
        this.bodyParts.rightLeg.rotation.x = -Math.PI / 6 + (-Math.PI / 2) * swingEase;
        this.bodyParts.rightLeg.position.z = this.initialStates.rightLeg.position.z - 0.15 + 0.3 * swingEase;
        this.bodyParts.rightLeg.position.y = this.initialStates.rightLeg.position.y + 0.1 * swingEase;
      }
      
      // Right foot follows leg
      if (this.bodyParts.rightFoot && this.initialStates.rightFoot) {
        this.bodyParts.rightFoot.rotation.x = -Math.PI / 6 + (-Math.PI / 2) * swingEase;
        this.bodyParts.rightFoot.position.z = this.initialStates.rightFoot.position.z - 0.1 + 0.35 * swingEase;
        this.bodyParts.rightFoot.position.y = this.initialStates.rightFoot.position.y + 0.15 * swingEase;
      }
      
      // Right arm swings forward
      if (this.bodyParts.rightArm && this.initialStates.rightArm) {
        this.bodyParts.rightArm.rotation.z = -Math.PI / 2 + (Math.PI / 4) * swingEase;
      }
      
      // Left leg supports (slight bend)
      if (this.bodyParts.leftLeg && this.initialStates.leftLeg) {
        this.bodyParts.leftLeg.rotation.x = -0.1 * swingEase;
      }
    }
  }

  /**
   * Reset to idle position
   */
  resetToIdle() {
    if (this.bodyParts.rightLeg) {
      this.bodyParts.rightLeg.position.copy(this.initialStates.rightLeg.position);
      this.bodyParts.rightLeg.rotation.copy(this.initialStates.rightLeg.rotation);
    }
    if (this.bodyParts.rightFoot) {
      this.bodyParts.rightFoot.position.copy(this.initialStates.rightFoot.position);
      this.bodyParts.rightFoot.rotation.copy(this.initialStates.rightFoot.rotation);
    }
    if (this.bodyParts.rightArm) {
      this.bodyParts.rightArm.position.copy(this.initialStates.rightArm.position);
      this.bodyParts.rightArm.rotation.copy(this.initialStates.rightArm.rotation);
    }
    if (this.bodyParts.leftLeg) {
      this.bodyParts.leftLeg.position.copy(this.initialStates.leftLeg.position);
      this.bodyParts.leftLeg.rotation.copy(this.initialStates.leftLeg.rotation);
    }
    if (this.bodyParts.leftFoot) {
      this.bodyParts.leftFoot.position.copy(this.initialStates.leftFoot.position);
      this.bodyParts.leftFoot.rotation.copy(this.initialStates.leftFoot.rotation);
    }
    if (this.bodyParts.leftArm) {
      this.bodyParts.leftArm.position.copy(this.initialStates.leftArm.position);
      this.bodyParts.leftArm.rotation.copy(this.initialStates.leftArm.rotation);
    }
    if (this.bodyParts.body) {
      this.bodyParts.body.position.copy(this.initialStates.body.position);
      this.bodyParts.body.rotation.copy(this.initialStates.body.rotation);
    }
  }

  /**
   * Get the player mesh for adding to scene
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Set player position (relative to ball)
   */
  setPosition(x, y, z) {
    this.position.set(x, y, z);
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
  }

  /**
   * Get player position
   */
  getPosition() {
    return this.position.clone();
  }

  /**
   * Update player position relative to ball
   */
  updatePosition(ballPosition) {
    // Position player to the right of the ball
    // Player faces away from goal (negative Z direction)
    // Player should be on the right side of screen, next to the ball
    const offsetX = 1.5; // To the right of ball (positive X = right side)
    const offsetY = 0; // On ground
    const offsetZ = -0.3; // Slightly behind the ball
    
    this.setPosition(
      ballPosition.x + offsetX,
      ballPosition.y + offsetY,
      ballPosition.z + offsetZ
    );
  }

  /**
   * Apply uniform to player (change colors)
   * @param {Object} uniformConfig - Uniform configuration with colors
   */
  applyUniform(uniformConfig) {
    if (!uniformConfig) {
      console.warn('⚠️ applyUniform: uniformConfig is null or undefined');
      return;
    }
    
    console.log('🎨 Applying uniform to player:', uniformConfig);
    
    // Apply jersey color (can be solid or keep stripes)
    if (uniformConfig.jerseyColor !== undefined) {
      if (this.materials.jerseyBase) {
        console.log('🎨 Setting jersey color to:', uniformConfig.jerseyColor.toString(16));
        this.materials.jerseyBase.color.setHex(uniformConfig.jerseyColor);
      } else {
        console.warn('⚠️ jerseyBase material not found');
      }
    }
    
    // Apply shorts color
    if (uniformConfig.shortsColor !== undefined) {
      if (this.materials.shorts) {
        console.log('🎨 Setting shorts color to:', uniformConfig.shortsColor.toString(16));
        this.materials.shorts.color.setHex(uniformConfig.shortsColor);
      } else {
        console.warn('⚠️ shorts material not found');
      }
    }
    
    // Apply boots color
    if (uniformConfig.bootsColor !== undefined) {
      if (this.materials.boots) {
        console.log('🎨 Setting boots color to:', uniformConfig.bootsColor.toString(16));
        this.materials.boots.color.setHex(uniformConfig.bootsColor);
      } else {
        console.warn('⚠️ boots material not found');
      }
    }
    
    // If uniform has a pattern (like stripes), can modify stripe colors
    if (uniformConfig.stripeColor !== undefined) {
      console.log('🎨 Setting stripe color to:', uniformConfig.stripeColor.toString(16));
      this.jerseyStripes.forEach(stripe => {
        if (stripe.material) {
          stripe.material.color.setHex(uniformConfig.stripeColor);
        }
      });
    }
    
    // Hide/show stripes based on uniform type
    if (uniformConfig.hasStripes === false) {
      console.log('🎨 Hiding stripes');
      this.jerseyStripes.forEach(stripe => {
        stripe.visible = false;
      });
    } else if (uniformConfig.hasStripes === true) {
      console.log('🎨 Showing stripes');
      this.jerseyStripes.forEach(stripe => {
        stripe.visible = true;
      });
    }
    
    console.log('✅ Uniform applied successfully');
  }

  /**
   * Rotate player to face away from goal (facing backward)
   */
  faceGoal() {
    if (this.mesh) {
      // Player should face negative Z direction (away from goal)
      // Rotate 180 degrees to face opposite direction
      this.mesh.rotation.y = Math.PI; // Face backward (negative Z direction)
    }
  }
}

