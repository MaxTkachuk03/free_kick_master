import * as THREE from 'three';

/**
 * Three.js Renderer wrapper
 * Manages Three.js scene, camera, lighting, and rendering
 */
export class ThreeJSRenderer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;
  }

  /**
   * Initialize Three.js scene, camera, and renderer
   */
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb0e0e6); // Light sky blue background (brighter)

    // Create camera - static view (always shows goal in center)
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    
    // Static camera position - behind player, slightly right, elevated, looking at goal
    // Camera will be set by CameraController, but set initial position here
    this.camera.position.set(3, 5, 2); // Behind player, slightly right, elevated
    this.camera.lookAt(0, 1, 25); // Look at goal (center)

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container.querySelector('#game-canvas'),
      antialias: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Setup lighting
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Setup ambient and directional lighting (bright, arcade-style)
   */
  setupLighting() {
    // Ambient light for overall illumination (brighter for arcade look)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Directional light (sun) for shadows and depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Additional fill light for brighter, more even lighting
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-10, 15, -10);
    this.scene.add(fillLight);
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Add object to scene
   */
  addObject(object) {
    if (this.scene) {
      this.scene.add(object);
    }
  }

  /**
   * Remove object from scene
   */
  removeObject(object) {
    if (this.scene) {
      this.scene.remove(object);
    }
  }

  /**
   * Render current frame
   */
  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Start render loop
   */
  start() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.render();
    };
    animate();
  }

  /**
   * Stop render loop
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.stop();
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

