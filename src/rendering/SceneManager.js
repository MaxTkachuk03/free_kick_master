import * as THREE from 'three';
import { Ball } from '../game/Ball.js';
import { Goal } from '../game/Goal.js';
import { Player } from '../game/Player.js';

/**
 * Scene Manager
 * Creates and manages game scene objects (field, lines, etc.)
 */
export class SceneManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.field = null;
    this.fieldLines = null;
    this.stadium = null;
    this.ball = null;
    this.goal = null;
    this.player = null;
  }

  /**
   * Create the game field (bright green grass plane)
   */
  createField() {
    // Create bright green grass plane (more vibrant like reference)
    const fieldGeometry = new THREE.PlaneGeometry(40, 60);
    const fieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a9d3a, // Brighter, more vibrant green
      roughness: 0.8,
      metalness: 0.1
    });
    
    this.field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    this.field.rotation.x = -Math.PI / 2; // Rotate to horizontal
    this.field.position.y = 0;
    this.field.receiveShadow = true;
    
    this.renderer.addObject(this.field);
    return this.field;
  }

  /**
   * Create white field lines
   */
  createFieldLines() {
    const linesGroup = new THREE.Group();
    
    // Center line
    const centerLineGeometry = new THREE.BoxGeometry(40, 0.1, 0.2);
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.y = 0.01;
    linesGroup.add(centerLine);

    // Center circle
    const circleGeometry = new THREE.RingGeometry(9, 9.2, 64);
    const circleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.rotation.x = -Math.PI / 2;
    circle.position.y = 0.01;
    linesGroup.add(circle);

    // Penalty area lines (simplified)
    const penaltyAreaGeometry = new THREE.BoxGeometry(16, 0.1, 0.2);
    
    // Left penalty area
    const leftPenalty = new THREE.Mesh(penaltyAreaGeometry, lineMaterial);
    leftPenalty.rotation.x = -Math.PI / 2;
    leftPenalty.rotation.z = Math.PI / 2;
    leftPenalty.position.set(-28, 0.01, 0);
    linesGroup.add(leftPenalty);

    // Right penalty area
    const rightPenalty = new THREE.Mesh(penaltyAreaGeometry, lineMaterial);
    rightPenalty.rotation.x = -Math.PI / 2;
    rightPenalty.rotation.z = Math.PI / 2;
    rightPenalty.position.set(28, 0.01, 0);
    linesGroup.add(rightPenalty);

    // Penalty arc (semi-circle) - visible in foreground
    const arcGeometry = new THREE.RingGeometry(9, 9.2, 64, 1, 0, Math.PI);
    const arc = new THREE.Mesh(arcGeometry, circleMaterial);
    arc.rotation.x = -Math.PI / 2;
    arc.position.set(0, 0.01, 25); // Near goal
    linesGroup.add(arc);

    this.fieldLines = linesGroup;
    this.renderer.addObject(linesGroup);
    return linesGroup;
  }

  /**
   * Create stadium with stands and spectators
   * Stands are positioned BEHIND the field and goals
   */
  createStadium() {
    const stadiumGroup = new THREE.Group();

    // Field dimensions: 40 (width) x 60 (length)
    // Field spans: X: -20 to +20, Z: -30 to +30

    // Left side stands (behind the field, on the left side)
    const leftStands = this.createStands(60, 10, 1, -25, 5, 0);
    stadiumGroup.add(leftStands);

    // Right side stands (behind the field, on the right side)
    const rightStands = this.createStands(60, 10, 1, 25, 5, 0);
    stadiumGroup.add(rightStands);

    // Top stands (behind the goal at z = -30)
    const topStands = this.createStands(1, 10, 50, 0, 5, -40);
    topStands.rotation.y = Math.PI / 2;
    stadiumGroup.add(topStands);

    // Bottom stands (behind the goal at z = +30)
    const bottomStands = this.createStands(1, 10, 50, 0, 5, 40);
    bottomStands.rotation.y = Math.PI / 2;
    stadiumGroup.add(bottomStands);

    // Add spectators
    this.addSpectators(stadiumGroup);

    this.stadium = stadiumGroup;
    this.renderer.addObject(stadiumGroup);
    return stadiumGroup;
  }

  /**
   * Create stands geometry
   */
  createStands(width, height, depth, x, y, z) {
    const standsGroup = new THREE.Group();

    // Main stands structure
    const standsGeometry = new THREE.BoxGeometry(width, height, depth);
    const standsMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333, // Dark gray for stands
      roughness: 0.7
    });
    const stands = new THREE.Mesh(standsGeometry, standsMaterial);
    stands.position.set(0, 0, 0);
    stands.castShadow = true;
    stands.receiveShadow = true;
    standsGroup.add(stands);

    // Add some color variation (seats)
    const seatRows = 5;
    const seatColor = 0x1a1a1a;
    for (let i = 0; i < seatRows; i++) {
      const seatGeometry = new THREE.BoxGeometry(width * 0.9, 0.1, depth * 0.15);
      const seatMaterial = new THREE.MeshStandardMaterial({ color: seatColor });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.set(0, -height / 2 + (i + 1) * (height / (seatRows + 1)), 0);
      standsGroup.add(seat);
    }

    standsGroup.position.set(x, y, z);
    return standsGroup;
  }

  /**
   * Add spectators to the stands
   * Spectators are positioned on stands BEHIND the field
   */
  addSpectators(stadiumGroup) {
    const spectatorColors = [
      0xff0000, // Red
      0x0000ff, // Blue
      0xffff00, // Yellow
      0x00ff00, // Green
      0xff00ff, // Magenta
      0xffffff  // White
    ];

    // Create simple spectator figures (small boxes with colors)
    // Positions are BEHIND the field (outside field boundaries)
    const spectatorPositions = [
      // Left stands (behind field, x = -25)
      { x: -25, y: 6, z: -20, rows: 5, cols: 10, dir: 'z' },
      { x: -25, y: 6, z: 0, rows: 5, cols: 10, dir: 'z' },
      { x: -25, y: 6, z: 20, rows: 5, cols: 10, dir: 'z' },
      // Right stands (behind field, x = 25)
      { x: 25, y: 6, z: -20, rows: 5, cols: 10, dir: 'z' },
      { x: 25, y: 6, z: 0, rows: 5, cols: 10, dir: 'z' },
      { x: 25, y: 6, z: 20, rows: 5, cols: 10, dir: 'z' },
      // Top stands (behind goal, z = -40)
      { x: -15, y: 6, z: -40, rows: 5, cols: 8, dir: 'x' },
      { x: 0, y: 6, z: -40, rows: 5, cols: 8, dir: 'x' },
      { x: 15, y: 6, z: -40, rows: 5, cols: 8, dir: 'x' },
      // Bottom stands (behind goal, z = 40)
      { x: -15, y: 6, z: 40, rows: 5, cols: 8, dir: 'x' },
      { x: 0, y: 6, z: 40, rows: 5, cols: 8, dir: 'x' },
      { x: 15, y: 6, z: 40, rows: 5, cols: 8, dir: 'x' }
    ];

    spectatorPositions.forEach(pos => {
      for (let row = 0; row < pos.rows; row++) {
        for (let col = 0; col < pos.cols; col++) {
          // Random color for variety
          const color = spectatorColors[Math.floor(Math.random() * spectatorColors.length)];
          
          // Create simple spectator (small box)
          const spectatorGeometry = new THREE.BoxGeometry(0.4, 0.7, 0.2);
          const spectatorMaterial = new THREE.MeshStandardMaterial({ color });
          const spectator = new THREE.Mesh(spectatorGeometry, spectatorMaterial);
          
          // Position spectators in rows
          const spacing = 1.3;
          const rowOffset = (row - pos.rows / 2) * spacing * 0.8;
          const colOffset = (col - pos.cols / 2) * spacing;
          
          // Position based on direction (which axis to spread along)
          if (pos.dir === 'z') {
            // Left/Right stands - spread along Z axis
            spectator.position.set(pos.x, pos.y + rowOffset, pos.z + colOffset);
          } else {
            // Top/Bottom stands - spread along X axis
            spectator.position.set(pos.x + colOffset, pos.y + rowOffset, pos.z);
          }
          
          stadiumGroup.add(spectator);
        }
      }
    });
  }

  /**
   * Create ball, goal, and player
   */
  createGameObjects() {
    // Create ball
    this.ball = new Ball();
    this.renderer.addObject(this.ball.getMesh());

    // Create goal
    this.goal = new Goal();
    this.renderer.addObject(this.goal.getMesh());

    // Create player
    this.player = new Player();
    this.renderer.addObject(this.player.getMesh());
    
    // Position player relative to initial ball position
    const ballPos = this.ball.getPosition();
    this.player.updatePosition(ballPos);
    this.player.faceGoal();
  }

  /**
   * Create background wall with colorful circular patterns
   */
  createBackground() {
    const backgroundGroup = new THREE.Group();

    // Light blue wall behind goal
    const wallGeometry = new THREE.PlaneGeometry(50, 20);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x87ceeb, // Light blue
      roughness: 0.8,
      metalness: 0.1
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, 10, 35); // Behind goal
    backgroundGroup.add(wall);

    // Add colorful circular patterns on the wall
    const patternColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181];
    for (let i = 0; i < 15; i++) {
      const circleGeometry = new THREE.CircleGeometry(1.5 + Math.random() * 1, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: patternColors[Math.floor(Math.random() * patternColors.length)],
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
      });
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 15 + 10,
        35.01
      );
      backgroundGroup.add(circle);
    }

    this.renderer.addObject(backgroundGroup);
    return backgroundGroup;
  }

  /**
   * Create palm trees around the field
   */
  createPalmTrees() {
    const palmsGroup = new THREE.Group();

    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513, // Brown
      roughness: 0.8
    });

    const leavesMaterial = new THREE.MeshStandardMaterial({
      color: 0x228b22, // Green
      roughness: 0.7
    });

    // Palm tree positions (around field edges)
    const palmPositions = [
      { x: -22, z: -25 },
      { x: -22, z: 0 },
      { x: -22, z: 25 },
      { x: 22, z: -25 },
      { x: 22, z: 0 },
      { x: 22, z: 25 }
    ];

    palmPositions.forEach(pos => {
      const palmGroup = new THREE.Group();

      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 3;
      trunk.castShadow = true;
      palmGroup.add(trunk);

      // Leaves (simplified - using cones)
      for (let i = 0; i < 6; i++) {
        const leafGeometry = new THREE.ConeGeometry(1, 3, 8);
        const leaf = new THREE.Mesh(leafGeometry, leavesMaterial);
        const angle = (i / 6) * Math.PI * 2;
        leaf.position.set(
          Math.cos(angle) * 1.5,
          5.5,
          Math.sin(angle) * 1.5
        );
        leaf.rotation.z = angle;
        leaf.castShadow = true;
        palmGroup.add(leaf);
      }

      palmGroup.position.set(pos.x, 0, pos.z);
      palmsGroup.add(palmGroup);
    });

    this.renderer.addObject(palmsGroup);
    return palmsGroup;
  }

  /**
   * Create stadium stands in background
   */
  createStadiumStands() {
    const standsGroup = new THREE.Group();

    // Background stands (simplified, far away)
    const standsGeometry = new THREE.BoxGeometry(60, 8, 5);
    const standsMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.8
    });
    const stands = new THREE.Mesh(standsGeometry, standsMaterial);
    stands.position.set(0, 4, 40);
    standsGroup.add(stands);

    // Add small spectator dots
    for (let i = 0; i < 50; i++) {
      const spectatorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const spectatorMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xff0000 : 0x0000ff
      });
      const spectator = new THREE.Mesh(spectatorGeometry, spectatorMaterial);
      spectator.position.set(
        (Math.random() - 0.5) * 55,
        5 + Math.random() * 3,
        40.1
      );
      standsGroup.add(spectator);
    }

    this.renderer.addObject(standsGroup);
    return standsGroup;
  }

  /**
   * Initialize complete scene
   */
  init() {
    this.createField();
    this.createFieldLines();
    this.createBackground();
    this.createPalmTrees();
    this.createStadiumStands();
    this.createGameObjects();
  }

  /**
   * Get ball instance
   */
  getBall() {
    return this.ball;
  }

  /**
   * Get goal instance
   */
  getGoal() {
    return this.goal;
  }

  /**
   * Get player instance
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Update player position relative to ball
   */
  updatePlayerPosition() {
    if (this.player && this.ball) {
      this.player.updatePosition(this.ball.getPosition());
    }
  }
}

