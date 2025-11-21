/**
 * Pause Screen
 * Pause menu during gameplay
 */
export class PauseScreen {
  constructor(container, onResume, onMenu, onRestart) {
    this.container = container;
    this.onResume = onResume;
    this.onMenu = onMenu;
    this.onRestart = onRestart;
    this.element = null;
    this.createScreen();
  }

  /**
   * Create pause screen
   */
  createScreen() {
    this.element = document.createElement('div');
    this.element.id = 'pause-screen';
    this.element.className = 'screen';
    this.element.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      z-index: 2000;
    `;

    this.element.innerHTML = `
      <div class="pause-content" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: clamp(30px, 6vw, 50px);
        max-width: 500px;
        width: 90%;
        text-align: center;
        color: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      ">
        <h1 style="
          font-size: clamp(32px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 30px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Пауза</h1>
        
        <div class="pause-buttons" style="
          display: flex;
          flex-direction: column;
          gap: clamp(15px, 3vh, 20px);
        ">
          <button class="pause-button" data-action="resume" style="
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
          ">Продовжити</button>
          
          <button class="pause-button" data-action="restart" style="
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
          ">Перезапустити</button>
          
          <button class="pause-button" data-action="menu" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #f44336;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Вихід в меню</button>
        </div>
        
        <div style="
          margin-top: clamp(20px, 4vh, 30px);
          font-size: clamp(12px, 2.5vw, 14px);
          color: rgba(255,255,255,0.7);
        ">
          Натисніть ESC для продовження
        </div>
      </div>
    `;

    // Add hover effects
    const style = document.createElement('style');
    style.textContent = `
      .pause-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
      }
      .pause-button:active {
        transform: translateY(0);
      }
    `;
    if (!document.getElementById('pause-screen-style')) {
      style.id = 'pause-screen-style';
      document.head.appendChild(style);
    }

    // Add event listeners
    this.element.querySelectorAll('.pause-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (action === 'resume' && this.onResume) {
          this.onResume();
        } else if (action === 'restart' && this.onRestart) {
          this.onRestart();
        } else if (action === 'menu' && this.onMenu) {
          this.onMenu();
        }
      });
    });

    this.container.appendChild(this.element);
    this.hide();
  }

  /**
   * Show pause screen
   */
  show() {
    if (this.element) {
      this.element.style.display = 'flex';
    }
  }

  /**
   * Hide pause screen
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

