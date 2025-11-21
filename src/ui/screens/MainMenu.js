/**
 * Main Menu Screen
 * Main menu with options: Start, Shop, Settings, Profile
 */
export class MainMenu {
  constructor(container, stateManager, onNavigate) {
    this.container = container;
    this.stateManager = stateManager;
    this.onNavigate = onNavigate;
    this.element = null;
    this.createMenu();
  }

  /**
   * Create main menu HTML
   */
  createMenu() {
    this.element = document.createElement('div');
    this.element.id = 'main-menu';
    this.element.className = 'screen';
    this.element.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: all;
      z-index: 1001;
      padding: max(20px, 5vh) 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
    `;

    const coins = this.stateManager.getCoins();

    this.element.innerHTML = `
      <div class="menu-content" style="
        text-align: center;
        color: white;
        max-width: 600px;
        width: 100%;
        padding: 0;
        margin-top: max(20px, 3vh);
      ">
        <h1 style="
          font-size: clamp(32px, 8vw, 64px);
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          font-weight: bold;
        ">Free Kick Master</h1>
        
        <div style="
          font-size: clamp(18px, 4vw, 24px);
          margin-bottom: clamp(20px, 5vh, 40px);
          color: #ffd700;
          font-weight: 600;
        ">
          Монети: ${coins}
        </div>

        <div class="menu-buttons" style="
          display: flex;
          flex-direction: column;
          gap: clamp(15px, 3vh, 20px);
          width: 100%;
        ">
          <button class="menu-button" data-action="start" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Старт гри</button>
          
          <button class="menu-button" data-action="shop" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Магазин</button>
          
          <button class="menu-button" data-action="settings" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Налаштування</button>
          
          <button class="menu-button" data-action="profile" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #9C27B0;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Профіль</button>
        </div>
      </div>
    `;

    // Add button hover effects
    const style = document.createElement('style');
    style.textContent = `
      .menu-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
      }
      .menu-button:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    this.element.querySelectorAll('.menu-button').forEach(button => {
      button.addEventListener('click', (e) => {
        // Try to start music on first button click (if not started yet)
        // This helps with browser autoplay restrictions
        if (window.startMenuMusicIfNeeded) {
          window.startMenuMusicIfNeeded();
        }
        
        const action = e.target.getAttribute('data-action');
        if (this.onNavigate) {
          this.onNavigate(action);
        }
      });
    });

    this.container.appendChild(this.element);
    this.hide();
  }

  /**
   * Show menu
   */
  show() {
    if (this.element) {
      this.element.style.display = 'flex';
      // Update coins display
      const coinsDisplay = this.element.querySelector('.menu-content > div');
      if (coinsDisplay) {
        coinsDisplay.textContent = `Монети: ${this.stateManager.getCoins()}`;
      }
      
      // Try to start music on first show (if not started yet)
      // This helps with browser autoplay restrictions
      if (window.startMenuMusicIfNeeded) {
        setTimeout(() => {
          window.startMenuMusicIfNeeded();
        }, 100);
      }
    }
  }

  /**
   * Hide menu
   */
  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  /**
   * Dispose
   */
  dispose() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

