/**
 * Level Select Screen
 * Grid of 5 levels with status display (locked/unlocked, coins earned)
 */
export class LevelSelect {
  constructor(container, stateManager, onLevelSelect, onBack) {
    this.container = container;
    this.stateManager = stateManager;
    this.onLevelSelect = onLevelSelect;
    this.onBack = onBack;
    this.element = null;
    this.createMenu();
  }

  /**
   * Create level select menu
   */
  createMenu() {
    this.element = document.createElement('div');
    this.element.id = 'level-select';
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

    this.updateLevels();

    this.container.appendChild(this.element);
    this.hide();
  }

  /**
   * Update levels display
   */
  updateLevels() {
    const progress = this.stateManager.getProgress();
    const levels = [1, 2, 3, 4, 5];

    this.element.innerHTML = `
      <div class="level-select-content" style="
        text-align: center;
        color: white;
        max-width: 800px;
        width: 100%;
        margin-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 40px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Вибір рівня</h1>
        
        <div class="levels-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: clamp(10px, 2vw, 20px);
          margin-bottom: clamp(20px, 4vh, 40px);
        ">
          ${levels.map(levelId => {
            const isUnlocked = progress.unlockedLevels.includes(levelId);
            const isCompleted = progress.completedLevels.includes(levelId);
            const stats = this.stateManager.getLevelStats(levelId);
            const coins = stats.coins || 0;

            return `
              <div class="level-card" data-level="${levelId}" style="
                background: ${isUnlocked ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'};
                border-radius: 12px;
                padding: clamp(10px, 2vw, 20px);
                cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
                opacity: ${isUnlocked ? '1' : '0.6'};
                transition: all 0.3s;
                border: 2px solid ${isUnlocked ? '#4CAF50' : '#666'};
                position: relative;
              ">
                ${!isUnlocked ? `
                  <div style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                  ">🔒</div>
                ` : ''}
                
                <div style="
                  font-size: clamp(32px, 6vw, 48px);
                  margin-bottom: 10px;
                  font-weight: bold;
                ">${levelId}</div>
                
                <div style="
                  font-size: clamp(12px, 2vw, 14px);
                  margin-bottom: 10px;
                  color: ${isCompleted ? '#4CAF50' : '#ccc'};
                ">
                  ${isCompleted ? '✓ Завершено' : isUnlocked ? 'Доступно' : 'Заблоковано'}
                </div>
                
                <div style="
                  font-size: clamp(14px, 3vw, 18px);
                  color: #ffd700;
                  font-weight: bold;
                ">
                  ${coins} монет
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button class="back-button" style="
          padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
          font-size: clamp(16px, 3.5vw, 20px);
          background: #f44336;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        ">Назад</button>
      </div>
    `;

    // Add hover effects
    const style = document.createElement('style');
    style.textContent = `
      .level-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      }
      .back-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    `;
    if (!document.getElementById('level-select-style')) {
      style.id = 'level-select-style';
      document.head.appendChild(style);
    }

    // Add event listeners
    this.element.querySelectorAll('.level-card').forEach(card => {
      const levelId = parseInt(card.getAttribute('data-level'));
      const isUnlocked = progress.unlockedLevels.includes(levelId);
      
      if (isUnlocked) {
        card.addEventListener('click', () => {
          if (this.onLevelSelect) {
            this.onLevelSelect(levelId);
          }
        });
      }
    });

    this.element.querySelector('.back-button').addEventListener('click', () => {
      if (this.onBack) {
        this.onBack();
      }
    });
  }

  /**
   * Show menu
   */
  show() {
    if (this.element) {
      this.element.style.display = 'flex';
      this.updateLevels(); // Refresh levels on show
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

