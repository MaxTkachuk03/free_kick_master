/**
 * UI Manager
 * Manages all UI screens (menus, HUD, shop, results), handles navigation
 */
export class UIManager {
  constructor(containerId = 'game-container', stateManager) {
    this.container = document.getElementById(containerId);
    this.stateManager = stateManager;
    this.currentScreen = null;
    this.screens = {};
    this.init();
  }

  /**
   * Initialize UI Manager
   */
  init() {
    // Create UI container
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'ui-container';
    this.uiContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    `;
    this.container.appendChild(this.uiContainer);
  }

  /**
   * Register a screen
   */
  registerScreen(screenName, screenElement) {
    this.screens[screenName] = screenElement;
  }

  /**
   * Show a screen
   */
  showScreen(screenName) {
    // Hide current screen
    if (this.currentScreen && this.screens[this.currentScreen]) {
      this.screens[this.currentScreen].hide();
    }

    // Show new screen
    if (this.screens[screenName]) {
      this.screens[screenName].show();
      this.currentScreen = screenName;
    } else {
      console.warn(`Screen ${screenName} not found`);
    }
  }

  /**
   * Hide current screen
   */
  hideCurrentScreen() {
    if (this.currentScreen && this.screens[this.currentScreen]) {
      this.screens[this.currentScreen].hide();
      this.currentScreen = null;
    }
  }

  /**
   * Get UI container
   */
  getContainer() {
    return this.uiContainer;
  }

  /**
   * Update HUD (in-game overlay)
   */
  updateHUD(data) {
    if (this.screens['hud']) {
      this.screens['hud'].update(data);
    }
  }

  /**
   * Show reward notification
   */
  showRewardNotification(amount, reason) {
    if (this.screens['hud']) {
      this.screens['hud'].showRewardNotification(amount, reason);
    }
  }

  /**
   * Handle menu navigation
   */
  handleMenuNavigation(action, audioManager = null) {
    switch (action) {
      case 'start':
        this.showScreen('levelSelect');
        break;
      case 'shop':
        this.showScreen('shop');
        break;
      case 'settings':
        this.showScreen('settings');
        break;
      case 'profile':
        this.showScreen('profile');
        break;
      case 'back':
        this.showScreen('mainMenu');
        // Resume menu music when returning to main menu
        if (audioManager && audioManager.musicEnabled) {
          audioManager.playMusic('menu', true);
        }
        break;
      case 'play':
        // Will be handled by game engine
        this.hideCurrentScreen();
        break;
      default:
        console.warn(`Unknown navigation action: ${action}`);
    }
  }

  /**
   * Cleanup
   */
  dispose() {
    Object.values(this.screens).forEach(screen => {
      if (screen.dispose) {
        screen.dispose();
      }
    });
    if (this.uiContainer && this.uiContainer.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
    }
  }
}

