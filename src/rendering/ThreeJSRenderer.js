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
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue background (like reference image)

    // Create camera - 2.5D isometric view using perspective camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    
    // 3D camera position - at player eye level, looking at ball (center of screen)
    // Camera will be set by CameraController, but set initial position here
    // Ball in center, player on left, goal in background
    this.camera.position.set(0, 1.7, -3); // Behind player, at eye level (1.7m)
    this.camera.lookAt(0, 0.5, 2); // Look at ball area (center of screen, z=2)
    
    console.log('Camera initialized:', {
      position: this.camera.position,
      lookAt: new THREE.Vector3(0, 0, 12.5),
      aspect: aspect
    });

    // Create renderer
    const canvas = this.container.querySelector('#game-canvas');
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    console.log('Renderer initialized:', {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      canvas: !!canvas
    });

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
    const aspect = width / height;

    // Update perspective camera
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  /**
   * Get Three.js scene
   */
  getScene() {
    return this.scene;
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
    } else {
      console.warn('Renderer, scene, or camera not initialized:', {
        renderer: !!this.renderer,
        scene: !!this.scene,
        camera: !!this.camera
      });
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

