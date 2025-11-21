/**
 * Results Screen
 * Shows level completion results with stats and navigation options
 */
export class ResultsScreen {
  constructor(container, stateManager, onNext, onRetry, onMenu) {
    this.container = container;
    this.stateManager = stateManager;
    this.onNext = onNext;
    this.onRetry = onRetry;
    this.onMenu = onMenu;
    this.element = null;
    this.createScreen();
  }

  /**
   * Create results screen
   */
  createScreen() {
    this.element = document.createElement('div');
    this.element.id = 'results-screen';
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
      z-index: 1002;
    `;

    this.container.appendChild(this.element);
    this.hide();
  }

  /**
   * Show results
   */
  show(levelId, results) {
    if (!this.element) return;

    const { goals, misses, coins, totalCoins } = results;
    
    // Determine win/loss: 3+ goals = victory
    const isVictory = goals >= 3;
    const nextLevel = levelId + 1;
    const hasNextLevel = nextLevel <= 5;
    
    // Unlock next level if victory
    if (isVictory && hasNextLevel) {
      this.stateManager.unlockLevel(nextLevel);
    }

    const title = isVictory ? '🎉 Перемога!' : '😔 Поразка';
    const titleColor = isVictory ? '#4CAF50' : '#f44336';
    const bgGradient = isVictory 
      ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
      : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    const message = isVictory 
      ? `Вітаємо! Ви забили ${goals} голів і пройшли рівень!`
      : `Ви забили ${goals} голів. Для перемоги потрібно мінімум 3 голи.`;

    this.element.innerHTML = `
      <div class="results-content" style="
        background: ${bgGradient};
        border-radius: 20px;
        padding: clamp(20px, 4vh, 40px);
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        text-align: center;
        color: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        margin: max(20px, 5vh) auto;
      ">
        <h1 style="
          font-size: clamp(32px, 7vw, 56px);
          margin-bottom: clamp(15px, 2vh, 20px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          color: ${titleColor};
        ">${title}</h1>
        
        <p style="
          font-size: clamp(18px, 4vw, 22px);
          margin-bottom: clamp(20px, 3vh, 30px);
          opacity: 0.95;
        ">${message}</p>
        
        <div class="stats" style="
          margin-bottom: clamp(20px, 3vh, 30px);
          font-size: clamp(18px, 4vw, 24px);
          background: rgba(0, 0, 0, 0.2);
          padding: clamp(15px, 3vh, 25px);
          border-radius: 12px;
        ">
          <div style="margin-bottom: 15px;">
            <span style="color: #4CAF50; font-weight: bold;">Голи:</span> ${goals}
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #f44336; font-weight: bold;">Промахи:</span> ${misses}
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #ffd700; font-weight: bold;">Зароблено монет:</span> ${coins}
          </div>
          <div style="
            margin-top: clamp(15px, 2vh, 20px);
            padding-top: clamp(15px, 2vh, 20px);
            border-top: 2px solid rgba(255,255,255,0.3);
            font-size: clamp(22px, 4.5vw, 28px);
            color: #ffd700;
          ">
            Всього монет: ${totalCoins}
          </div>
        </div>

        <div class="buttons" style="
          display: flex;
          gap: clamp(10px, 2vw, 15px);
          justify-content: center;
          flex-wrap: wrap;
        ">
          ${isVictory && hasNextLevel ? `
            <button class="result-button" data-action="next" style="
              padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
              font-size: clamp(16px, 3.5vw, 20px);
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.3s;
            ">Наступний рівень</button>
          ` : ''}
          
          ${!isVictory ? `
            <button class="result-button" data-action="retry" style="
              padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
              font-size: clamp(16px, 3.5vw, 20px);
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.3s;
            ">Спробувати знову</button>
          ` : ''}
          
          <button class="result-button" data-action="menu" style="
            padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
            font-size: clamp(16px, 3.5vw, 20px);
            background: #757575;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">В меню</button>
        </div>
      </div>
    `;

    // Add hover effects
    const style = document.createElement('style');
    style.textContent = `
      .result-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    `;
    if (!document.getElementById('results-screen-style')) {
      style.id = 'results-screen-style';
      document.head.appendChild(style);
    }

    // Add event listeners
    this.element.querySelectorAll('.result-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        switch (action) {
          case 'next':
            if (this.onNext) this.onNext(nextLevel);
            break;
          case 'retry':
            if (this.onRetry) this.onRetry(levelId);
            break;
          case 'menu':
            if (this.onMenu) this.onMenu();
            break;
        }
      });
    });

    this.element.style.display = 'flex';
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

