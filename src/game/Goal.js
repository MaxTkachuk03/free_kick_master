import * as THREE from 'three';

/**
 * Goal component
 * Represents the football goal
 */
export class Goal {
  constructor() {
    this.mesh = null;
    this.position = new THREE.Vector3(0, 0, 25); // Goal at one end of field
    this.width = 7.32; // Standard goal width (meters)
    this.height = 2.44; // Standard goal height (meters)
    this.depth = 2.0; // Goal depth
    this.createMesh();
  }

  /**
   * Create 3D goal mesh
   */
  createMesh() {
    const goalGroup = new THREE.Group();

    // Goal material - white
    const goalMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White
      roughness: 0.5,
      metalness: 0.2
    });

    // Goal posts and crossbar
    const postThickness = 0.12; // 12cm thick posts

    // Left post
    const leftPost = new THREE.Mesh(
      new THREE.BoxGeometry(postThickness, this.height, postThickness),
      goalMaterial
    );
    leftPost.position.set(-this.width / 2, this.height / 2, 0);
    leftPost.castShadow = true;
    goalGroup.add(leftPost);

    // Right post
    const rightPost = new THREE.Mesh(
      new THREE.BoxGeometry(postThickness, this.height, postThickness),
      goalMaterial
    );
    rightPost.position.set(this.width / 2, this.height / 2, 0);
    rightPost.castShadow = true;
    goalGroup.add(rightPost);

    // Crossbar (top)
    const crossbar = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, postThickness, postThickness),
      goalMaterial
    );
    crossbar.position.set(0, this.height, 0);
    crossbar.castShadow = true;
    goalGroup.add(crossbar);

    // Goal net (simplified - using lines)
    this.createNet(goalGroup);

    // Goal line (on the ground)
    const goalLineGeometry = new THREE.BoxGeometry(this.width + 0.5, 0.05, 0.1);
    const goalLineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const goalLine = new THREE.Mesh(goalLineGeometry, goalLineMaterial);
    goalLine.rotation.x = -Math.PI / 2;
    goalLine.position.y = 0.01;
    goalGroup.add(goalLine);

    this.mesh = goalGroup;
    this.mesh.position.copy(this.position);
    // Rotate goal 180 degrees around Y axis so net is visible from field side
    this.mesh.rotation.y = Math.PI;
  }

  /**
   * Create goal net using lines (improved visual)
   * Net is inside the goal, visible from the field side
   */
  createNet(group) {
    const netMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff, // White net
      opacity: 0.8,
      transparent: true,
      linewidth: 1
    });

    const netSpacing = 0.3; // Closer spacing for better net appearance
    const netDepth = this.depth;

    // Net is inside the goal, from goal line (z=0 in local space) to back (z=-depth)
    // Goal is at z=25 in world space, field is at z<25
    // Net should be visible from the field side (inside the goal)
    
    // Vertical net lines on the back wall of goal (at z = -depth)
    for (let x = -this.width / 2; x <= this.width / 2; x += netSpacing) {
      const backPoints = [
        new THREE.Vector3(x, 0, -netDepth),
        new THREE.Vector3(x, this.height, -netDepth)
      ];
      const backGeometry = new THREE.BufferGeometry().setFromPoints(backPoints);
      const backLine = new THREE.Line(backGeometry, netMaterial);
      group.add(backLine);
    }

    // Horizontal net lines on the back wall of goal
    for (let y = 0; y <= this.height; y += netSpacing) {
      const backPoints = [
        new THREE.Vector3(-this.width / 2, y, -netDepth),
        new THREE.Vector3(this.width / 2, y, -netDepth)
      ];
      const backGeometry = new THREE.BufferGeometry().setFromPoints(backPoints);
      const backLine = new THREE.Line(backGeometry, netMaterial);
      group.add(backLine);
    }

    // Side net lines (left and right sides) - connecting front to back
    for (let z = 0; z >= -netDepth; z -= netSpacing) {
      // Left side net (from goal line to back)
      const leftPoints = [
        new THREE.Vector3(-this.width / 2, 0, z),
        new THREE.Vector3(-this.width / 2, this.height, z)
      ];
      const leftGeometry = new THREE.BufferGeometry().setFromPoints(leftPoints);
      const leftLine = new THREE.Line(leftGeometry, netMaterial);
      group.add(leftLine);

      // Right side net (from goal line to back)
      const rightPoints = [
        new THREE.Vector3(this.width / 2, 0, z),
        new THREE.Vector3(this.width / 2, this.height, z)
      ];
      const rightGeometry = new THREE.BufferGeometry().setFromPoints(rightPoints);
      const rightLine = new THREE.Line(rightGeometry, netMaterial);
      group.add(rightLine);
    }

    // Top net lines (connecting top from front to back)
    for (let x = -this.width / 2; x <= this.width / 2; x += netSpacing) {
      const topPoints = [
        new THREE.Vector3(x, this.height, 0),
        new THREE.Vector3(x, this.height, -netDepth)
      ];
      const topGeometry = new THREE.BufferGeometry().setFromPoints(topPoints);
      const topLine = new THREE.Line(topGeometry, netMaterial);
      group.add(topLine);
    }

    // Bottom net lines (connecting bottom from front to back)
    for (let x = -this.width / 2; x <= this.width / 2; x += netSpacing) {
      const bottomPoints = [
        new THREE.Vector3(x, 0, 0),
        new THREE.Vector3(x, 0, -netDepth)
      ];
      const bottomGeometry = new THREE.BufferGeometry().setFromPoints(bottomPoints);
      const bottomLine = new THREE.Line(bottomGeometry, netMaterial);
      group.add(bottomLine);
    }
  }

  /**
   * Get the goal mesh for adding to scene
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Check if a point is inside the goal
   */
  isInsideGoal(point) {
    const localPoint = point.clone().sub(this.position);
    return (
      localPoint.x >= -this.width / 2 &&
      localPoint.x <= this.width / 2 &&
      localPoint.y >= 0 &&
      localPoint.y <= this.height &&
      localPoint.z >= -this.depth &&
      localPoint.z <= 0.5 // Small tolerance for goal line
    );
  }

  /**
   * Get goal bounds for collision detection
   */
  getBounds() {
    return {
      minX: this.position.x - this.width / 2,
      maxX: this.position.x + this.width / 2,
      minY: this.position.y,
      maxY: this.position.y + this.height,
      minZ: this.position.z - this.depth,
      maxZ: this.position.z + 0.5
    };
  }
}

