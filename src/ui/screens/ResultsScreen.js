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
    const progress = this.stateManager.getProgress();
    const nextLevel = levelId + 1;
    const hasNextLevel = nextLevel <= 5 && progress.unlockedLevels.includes(nextLevel);

    this.element.innerHTML = `
      <div class="results-content" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 3vh, 30px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Рівень ${levelId} завершено!</h1>
        
        <div class="stats" style="
          margin-bottom: clamp(20px, 3vh, 30px);
          font-size: clamp(18px, 4vw, 24px);
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
          ${hasNextLevel ? `
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
          ">Повторити</button>
          
          <button class="result-button" data-action="menu" style="
            padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
            font-size: clamp(16px, 3.5vw, 20px);
            background: #f44336;
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

