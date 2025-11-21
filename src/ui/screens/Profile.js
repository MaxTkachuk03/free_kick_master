/**
 * Profile Screen
 * Player profile with stats and achievements
 */
export class Profile {
  constructor(container, stateManager, onBack) {
    this.container = container;
    this.stateManager = stateManager;
    this.onBack = onBack;
    this.element = null;
    this.createScreen();
  }

  /**
   * Create profile screen
   */
  createScreen() {
    this.element = document.createElement('div');
    this.element.id = 'profile-screen';
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
   * Update profile content
   */
  updateContent() {
    const progress = this.stateManager.getProgress();
    const totalCoins = this.stateManager.getCoins();
    const completedLevels = progress.completedLevels.length;
    const unlockedLevels = progress.unlockedLevels.length;

    // Calculate total goals and misses from level stats
    let totalGoals = 0;
    let totalMisses = 0;
    Object.keys(progress.levelStats).forEach(levelId => {
      const stats = progress.levelStats[levelId];
      // Estimate goals/misses from coins (10 coins per goal)
      totalGoals += Math.floor((stats.coins || 0) / 10);
    });

    this.element.innerHTML = `
      <div class="profile-content" style="
        max-width: 800px;
        width: 100%;
        color: white;
        text-align: center;
        margin-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 40px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Профіль гравця</h1>
        
        <div class="profile-stats" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: clamp(15px, 3vw, 20px);
          margin-bottom: clamp(20px, 4vh, 40px);
        ">
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #ffd700; font-weight: bold; margin-bottom: 10px;">
              ${totalCoins}
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Монети</div>
          </div>
          
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #4CAF50; font-weight: bold; margin-bottom: 10px;">
              ${completedLevels}/5
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Пройдено рівнів</div>
          </div>
          
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #2196F3; font-weight: bold; margin-bottom: 10px;">
              ${totalGoals}
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Забито голів</div>
          </div>
          
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #f44336; font-weight: bold; margin-bottom: 10px;">
              ${progress.purchasedUniforms.length + progress.purchasedBalls.length}
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Куплено предметів</div>
          </div>
        </div>

        <div class="level-progress" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: clamp(20px, 4vw, 30px);
          margin-bottom: clamp(20px, 4vh, 30px);
        ">
          <h2 style="font-size: clamp(20px, 4.5vw, 28px); margin-bottom: clamp(15px, 3vh, 20px);">Прогрес по рівнях</h2>
          ${[1, 2, 3, 4, 5].map(levelId => {
            const stats = this.stateManager.getLevelStats(levelId);
            const isCompleted = progress.completedLevels.includes(levelId);
            const isUnlocked = progress.unlockedLevels.includes(levelId);
            
            return `
              <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: clamp(12px, 2.5vw, 15px);
                margin-bottom: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                flex-wrap: wrap;
                gap: 10px;
              ">
                <div style="font-size: clamp(16px, 3.5vw, 20px); font-weight: bold;">
                  Рівень ${levelId}
                  ${isCompleted ? ' ✓' : isUnlocked ? '' : ' 🔒'}
                </div>
                <div style="font-size: clamp(14px, 3vw, 18px); color: #ffd700;">
                  ${stats.coins || 0} монет
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="inventory" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: clamp(20px, 4vw, 30px);
          margin-bottom: clamp(20px, 4vh, 30px);
        ">
          <h2 style="font-size: clamp(20px, 4.5vw, 28px); margin-bottom: clamp(15px, 3vh, 20px);">Інвентар</h2>
          
          <div style="margin-bottom: clamp(15px, 3vh, 20px);">
            <h3 style="font-size: clamp(16px, 3.5vw, 20px); margin-bottom: 10px;">Обрана форма:</h3>
            <div style="font-size: clamp(14px, 3vw, 18px); color: #4CAF50;">
              ${progress.selectedUniform ? `ID: ${progress.selectedUniform}` : 'Базова біла'}
            </div>
          </div>
          
          <div>
            <h3 style="font-size: clamp(16px, 3.5vw, 20px); margin-bottom: 10px;">Обраний м'яч:</h3>
            <div style="font-size: clamp(14px, 3vw, 18px); color: #4CAF50;">
              ${progress.selectedBall ? `ID: ${progress.selectedBall}` : 'Класичний'}
            </div>
          </div>
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

    // Add hover effect
    const style = document.createElement('style');
    style.textContent = `
      .back-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    `;
    if (!document.getElementById('profile-screen-style')) {
      style.id = 'profile-screen-style';
      document.head.appendChild(style);
    }

    // Add event listener
    this.element.querySelector('.back-button').addEventListener('click', () => {
      if (this.onBack) {
        this.onBack();
      }
    });
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

