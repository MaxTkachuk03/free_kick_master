import { ShopManager } from '../../shop/ShopManager.js';

/**
 * Shop Screen
 * Shop for purchasing uniforms and balls
 */
export class Shop {
  constructor(container, stateManager, onBack) {
    this.container = container;
    this.stateManager = stateManager;
    this.onBack = onBack;
    this.shopManager = new ShopManager(stateManager);
    this.currentTab = 'uniforms'; // 'uniforms' or 'balls'
    this.element = null;
    this.createScreen();
  }

  /**
   * Create shop screen
   */
  createScreen() {
    this.element = document.createElement('div');
    this.element.id = 'shop-screen';
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

    this.updateContent();

    this.container.appendChild(this.element);
    this.hide();
  }

  /**
   * Update shop content
   */
  updateContent() {
    const coins = this.stateManager.getCoins();
    const uniforms = this.shopManager.getAvailableUniforms();
    const balls = this.shopManager.getAvailableBalls();

    this.element.innerHTML = `
      <div class="shop-content" style="
        max-width: 1000px;
        width: 100%;
        color: white;
        padding-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 42px);
          margin-bottom: clamp(15px, 3vh, 20px);
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Магазин</h1>
        
        <div style="
          font-size: clamp(20px, 4.5vw, 28px);
          margin-bottom: clamp(15px, 3vh, 20px);
          text-align: center;
          color: #ffd700;
          font-weight: bold;
        ">
          Монети: ${coins}
        </div>

        <div class="tabs" style="
          display: flex;
          gap: clamp(10px, 2vw, 15px);
          margin-bottom: clamp(20px, 4vh, 30px);
          justify-content: center;
          flex-wrap: wrap;
        ">
          <button class="tab-button ${this.currentTab === 'uniforms' ? 'active' : ''}" 
                  data-tab="uniforms" style="
            padding: clamp(10px, 2vh, 12px) clamp(30px, 6vw, 40px);
            font-size: clamp(16px, 3.5vw, 18px);
            background: ${this.currentTab === 'uniforms' ? '#9C27B0' : 'rgba(255,255,255,0.2)'};
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">Форма</button>
          
          <button class="tab-button ${this.currentTab === 'balls' ? 'active' : ''}" 
                  data-tab="balls" style="
            padding: clamp(10px, 2vh, 12px) clamp(30px, 6vw, 40px);
            font-size: clamp(16px, 3.5vw, 18px);
            background: ${this.currentTab === 'balls' ? '#4CAF50' : 'rgba(255,255,255,0.2)'};
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">М'ячі</button>
        </div>

        <div class="items-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
          gap: clamp(15px, 3vw, 20px);
          margin-bottom: clamp(20px, 4vh, 30px);
          max-height: calc(100vh - 350px);
          overflow-y: auto;
          padding: 10px;
        ">
          ${this.currentTab === 'uniforms' 
            ? uniforms.map(uniform => this.renderUniformItem(uniform)).join('')
            : balls.map(ball => this.renderBallItem(ball)).join('')
          }
        </div>

        <div style="text-align: center;">
          <button class="back-button" style="
            padding: 15px 30px;
            font-size: 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
          ">Назад</button>
        </div>
      </div>
    `;

    // Add hover effects for tab buttons
    const style = document.createElement('style');
    style.textContent = `
      .tab-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      .tab-button.active {
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
    `;
    if (!document.getElementById('shop-screen-style')) {
      style.id = 'shop-screen-style';
      document.head.appendChild(style);
    }

    // Add event listeners
    this.element.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        this.currentTab = e.target.getAttribute('data-tab');
        this.updateContent();
      });
    });

    this.element.querySelectorAll('.purchase-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.getAttribute('data-item-id');
        const itemType = e.target.getAttribute('data-item-type');
        this.handlePurchase(itemType, itemId);
      });
    });

    this.element.querySelectorAll('.select-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.getAttribute('data-item-id');
        const itemType = e.target.getAttribute('data-item-type');
        this.handleSelect(itemType, itemId);
      });
    });

    this.element.querySelector('.back-button').addEventListener('click', () => {
      if (this.onBack) {
        this.onBack();
      }
    });
  }

  /**
   * Render uniform item
   */
  renderUniformItem(uniform) {
    const isPurchased = this.shopManager.isUniformPurchased(uniform.id);
    const isSelected = this.stateManager.getSelectedUniform() === uniform.id;
    const canAfford = this.stateManager.getCoins() >= uniform.price;

    return `
      <div class="shop-item" style="
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 2px solid ${isSelected ? '#4CAF50' : 'transparent'};
      ">
        <div style="
          width: 80px;
          height: 80px;
          background: ${this.getColorHex(uniform.jerseyColor || uniform.color || 0xffffff)};
          border-radius: 50%;
          margin: 0 auto 15px;
          border: 3px solid white;
        "></div>
        
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
          ${uniform.name}
        </div>
        
        <div style="font-size: 14px; color: #ccc; margin-bottom: 10px;">
          ${uniform.description}
        </div>
        
        <div style="font-size: 20px; color: #ffd700; margin-bottom: 15px; font-weight: bold;">
          ${uniform.price === 0 ? 'Безкоштовно' : `${uniform.price} монет`}
        </div>
        
        ${isPurchased ? `
          ${isSelected ? `
            <div style="color: #4CAF50; font-weight: bold; margin-bottom: 10px;">Обрано</div>
          ` : `
            <button class="select-button" 
                    data-item-type="uniform" 
                    data-item-id="${uniform.id}"
                    style="
              padding: 10px 20px;
              font-size: 16px;
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-weight: bold;
            ">Обрати</button>
          `}
        ` : `
          <button class="purchase-button" 
                  data-item-type="uniform" 
                  data-item-id="${uniform.id}"
                  style="
            padding: 10px 20px;
            font-size: 16px;
            background: ${canAfford ? '#4CAF50' : '#666'};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: ${canAfford ? 'pointer' : 'not-allowed'};
            width: 100%;
            font-weight: bold;
          ">${uniform.price === 0 ? 'Обрати' : 'Купити'}</button>
        `}
      </div>
    `;
  }

  /**
   * Render ball item
   */
  renderBallItem(ball) {
    const isPurchased = this.shopManager.isBallPurchased(ball.id);
    const isSelected = this.stateManager.getSelectedBall() === ball.id;
    const canAfford = this.stateManager.getCoins() >= ball.price;

    return `
      <div class="shop-item" style="
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 2px solid ${isSelected ? '#4CAF50' : 'transparent'};
      ">
        <div style="
          width: 80px;
          height: 80px;
          background: ${this.getColorHex(ball.color)};
          border-radius: 50%;
          margin: 0 auto 15px;
          border: 3px solid white;
        "></div>
        
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
          ${ball.name}
        </div>
        
        <div style="font-size: 14px; color: #ccc; margin-bottom: 10px;">
          ${ball.description}
        </div>
        
        <div style="font-size: 20px; color: #ffd700; margin-bottom: 15px; font-weight: bold;">
          ${ball.price === 0 ? 'Безкоштовно' : `${ball.price} монет`}
        </div>
        
        ${isPurchased ? `
          ${isSelected ? `
            <div style="color: #4CAF50; font-weight: bold; margin-bottom: 10px;">Обрано</div>
          ` : `
            <button class="select-button" 
                    data-item-type="ball" 
                    data-item-id="${ball.id}"
                    style="
              padding: 10px 20px;
              font-size: 16px;
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-weight: bold;
            ">Обрати</button>
          `}
        ` : `
          <button class="purchase-button" 
                  data-item-type="ball" 
                  data-item-id="${ball.id}"
                  style="
            padding: 10px 20px;
            font-size: 16px;
            background: ${canAfford ? '#4CAF50' : '#666'};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: ${canAfford ? 'pointer' : 'not-allowed'};
            width: 100%;
            font-weight: bold;
          ">${ball.price === 0 ? 'Обрати' : 'Купити'}</button>
        `}
      </div>
    `;
  }

  /**
   * Get color hex string
   */
  getColorHex(color) {
    if (color === undefined || color === null) {
      return '#ffffff'; // Default white
    }
    // Handle both number and string
    const colorNum = typeof color === 'number' ? color : parseInt(color, 16);
    return '#' + colorNum.toString(16).padStart(6, '0');
  }

  /**
   * Handle purchase
   */
  handlePurchase(type, itemId) {
    let result;
    if (type === 'uniform') {
      result = this.shopManager.purchaseUniform(itemId);
    } else {
      result = this.shopManager.purchaseBall(itemId);
    }

    if (result.success) {
      alert(`Успішно куплено! Залишилось монет: ${result.remainingCoins}`);
      this.updateContent();
    } else {
      alert(`Помилка: ${result.error}`);
    }
  }

  /**
   * Handle select
   */
  handleSelect(type, itemId) {
    let success;
    if (type === 'uniform') {
      success = this.shopManager.selectUniform(itemId);
      // Apply uniform to player if callback is available
      if (success && this.applyUniformToPlayer) {
        this.applyUniformToPlayer(itemId);
      }
    } else if (type === 'ball') {
      success = this.shopManager.selectBall(itemId);
      // Apply ball style to game ball if callback is available
      if (success && this.applyBallToGame) {
        this.applyBallToGame(itemId);
      }
    }

    if (success) {
      this.updateContent();
    }
  }

  /**
   * Show screen
   */
  show() {
    if (this.element) {
      this.element.style.display = 'flex';
      this.updateContent(); // Refresh content
    }
  }

  /**
   * Hide screen
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

