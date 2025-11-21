/**
 * Game HUD Component
 * Displays in-game information: kick counter, coins, score
 */
export class GameHUD {
  constructor(containerId = 'game-container', audioManager = null) {
    this.container = document.getElementById(containerId);
    this.audioManager = audioManager;
    this.hudElement = null;
    this.createHUD();
  }

  /**
   * Create HUD HTML structure
   */
  createHUD() {
    this.hudElement = document.createElement('div');
    this.hudElement.id = 'game-hud';
    this.hudElement.innerHTML = `
      <div class="hud-top-left">
        <div class="hud-item">
          <span class="hud-label">Удар:</span>
          <span class="hud-value" id="kick-counter">1/5</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Монети:</span>
          <span class="hud-value" id="coin-counter">0</span>
        </div>
      </div>
      <div class="hud-top-right">
        <div class="hud-item">
          <span class="hud-label">Голи:</span>
          <span class="hud-value" id="goal-counter">0</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Промахи:</span>
          <span class="hud-value" id="miss-counter">0</span>
        </div>
      </div>
      <div class="hud-bottom-right">
        <button id="pause-button" class="pause-button" style="
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          pointer-events: all;
          transition: all 0.3s;
          backdrop-filter: blur(4px);
        ">⏸ Пауза</button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #game-hud {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        font-family: Arial, sans-serif;
        color: white;
      }

      .hud-top-left {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .hud-top-right {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .hud-bottom-right {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }

      .pause-button:hover {
        background: rgba(0, 0, 0, 0.8) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        transform: translateY(-2px);
      }

      .pause-button:active {
        transform: translateY(0);
      }

      .hud-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(0, 0, 0, 0.6);
        padding: 8px 16px;
        border-radius: 8px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .hud-label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
      }

      .hud-value {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }

      #coin-counter {
        color: #ffd700;
      }
    `;

    document.head.appendChild(style);
    this.container.appendChild(this.hudElement);
  }

  /**
   * Update kick counter
   */
  updateKickCounter(current, total) {
    const element = document.getElementById('kick-counter');
    if (element) {
      element.textContent = `${current}/${total}`;
    }
  }

  /**
   * Update coin counter
   */
  updateCoins(coins) {
    const element = document.getElementById('coin-counter');
    if (element) {
      console.log('💰 HUD: Updating coin counter:', coins, 'Type:', typeof coins);
      element.textContent = coins;
      console.log('💰 HUD: Coin counter updated to:', element.textContent);
      // Add animation
      element.style.transform = 'scale(1.2)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 200);
    } else {
      console.error('❌ HUD: Coin counter element not found!');
    }
  }

  /**
   * Update goal counter
   */
  updateGoals(goals) {
    const element = document.getElementById('goal-counter');
    if (element) {
      console.log('Updating goals counter:', goals);
      element.textContent = goals;
      console.log('Goals counter updated to:', element.textContent);
    } else {
      console.error('Goal counter element not found!');
    }
  }

  /**
   * Update miss counter
   */
  updateMisses(misses) {
    const element = document.getElementById('miss-counter');
    if (element) {
      element.textContent = misses;
    }
  }

  /**
   * Update all HUD elements
   */
  update(data) {
    if (data.kick !== undefined && data.total !== undefined) {
      this.updateKickCounter(data.kick, data.total);
    }
    if (data.coins !== undefined) {
      this.updateCoins(data.coins);
    }
    if (data.goals !== undefined) {
      this.updateGoals(data.goals);
    }
    if (data.misses !== undefined) {
      this.updateMisses(data.misses);
    }
  }

  /**
   * Show reward notification
   */
  showRewardNotification(amount, reason) {
    // Play coin sound
    if (this.audioManager) {
      this.audioManager.playSound('coin');
    }
    
    const notification = document.createElement('div');
    notification.className = 'reward-notification';
    notification.innerHTML = `
      <div class="reward-amount">+${amount} монет</div>
      <div class="reward-reason">${reason}</div>
    `;

    // Add notification styles
    if (!document.getElementById('reward-notification-style')) {
      const style = document.createElement('style');
      style.id = 'reward-notification-style';
      style.textContent = `
        .reward-notification {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          padding: 20px 40px;
          border-radius: 12px;
          text-align: center;
          z-index: 200;
          animation: rewardPop 0.5s ease-out;
          pointer-events: none;
        }

        .reward-amount {
          font-size: 32px;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 8px;
        }

        .reward-reason {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
        }

        @keyframes rewardPop {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
      notification.style.animation = 'rewardPop 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 2000);
  }

  /**
   * Hide HUD
   */
  hide() {
    if (this.hudElement) {
      this.hudElement.style.display = 'none';
    }
  }

  /**
   * Show HUD
   */
  show() {
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  }

  /**
   * Dispose HUD
   */
  dispose() {
    if (this.hudElement && this.hudElement.parentNode) {
      this.hudElement.parentNode.removeChild(this.hudElement);
    }
  }
}

