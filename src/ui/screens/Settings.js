/**
 * Settings Screen
 * Game settings (audio, controls, etc.)
 */
export class Settings {
  constructor(container, stateManager, audioManager, onBack) {
    this.container = container;
    this.stateManager = stateManager;
    this.audioManager = audioManager;
    this.onBack = onBack;
    this.element = null;
    this.createScreen();
  }

  /**
   * Create settings screen
   */
  createScreen() {
    this.element = document.createElement('div');
    this.element.id = 'settings-screen';
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
   * Update settings content
   */
  updateContent() {
    const audioSettings = this.audioManager ? this.audioManager.getSettings() : {
      masterVolume: 1.0,
      soundVolume: 1.0,
      musicVolume: 0.5,
      musicEnabled: true,
      soundsEnabled: true
    };

    this.element.innerHTML = `
      <div class="settings-content" style="
        max-width: 600px;
        width: 100%;
        color: white;
        margin-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 40px);
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Налаштування</h1>
        
        <div class="settings-section" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
        ">
          <h2 style="font-size: 28px; margin-bottom: 20px;">Аудіо</h2>
          
          <div class="setting-item" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 18px;">Загальна гучність</label>
              <span id="master-volume-value" style="font-size: 18px; font-weight: bold; min-width: 50px; text-align: right;">
                ${Math.round(audioSettings.masterVolume * 100)}%
              </span>
            </div>
            <input type="range" id="master-volume" min="0" max="100" value="${audioSettings.masterVolume * 100}" 
                   style="width: 100%; height: 8px; border-radius: 4px; outline: none;">
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(20px, 4vh, 25px);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Гучність звуків</label>
              <span id="sound-volume-value" style="font-size: clamp(14px, 3vw, 18px); font-weight: bold; min-width: 50px; text-align: right;">
                ${Math.round(audioSettings.soundVolume * 100)}%
              </span>
            </div>
            <input type="range" id="sound-volume" min="0" max="100" value="${audioSettings.soundVolume * 100}" 
                   style="width: 100%; height: 8px; border-radius: 4px; outline: none;">
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(20px, 4vh, 25px);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Гучність музики</label>
              <span id="music-volume-value" style="font-size: clamp(14px, 3vw, 18px); font-weight: bold; min-width: 50px; text-align: right;">
                ${Math.round(audioSettings.musicVolume * 100)}%
              </span>
            </div>
            <input type="range" id="music-volume" min="0" max="100" value="${audioSettings.musicVolume * 100}" 
                   style="width: 100%; height: 8px; border-radius: 4px; outline: none;">
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(12px, 2.5vh, 15px);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Увімкнути музику</label>
              <input type="checkbox" id="music-enabled" ${audioSettings.musicEnabled ? 'checked' : ''} 
                     style="width: 24px; height: 24px; cursor: pointer;">
            </div>
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(12px, 2.5vh, 15px);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Увімкнути звуки</label>
              <input type="checkbox" id="sounds-enabled" ${audioSettings.soundsEnabled ? 'checked' : ''} 
                     style="width: 24px; height: 24px; cursor: pointer;">
            </div>
          </div>
        </div>

        <div class="settings-section" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: clamp(20px, 4vw, 30px);
          margin-bottom: clamp(20px, 4vh, 30px);
        ">
          <h2 style="font-size: clamp(20px, 4.5vw, 28px); margin-bottom: clamp(15px, 3vh, 20px);">Гра</h2>
          
          <div class="setting-item" style="margin-bottom: clamp(15px, 3vh, 20px);">
            <button id="reset-progress" style="
              padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
              font-size: clamp(14px, 3vw, 18px);
              background: #f44336;
              color: white;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              width: 100%;
              transition: all 0.3s;
            ">Скинути прогрес</button>
          </div>
        </div>

        <div style="text-align: center;">
          <button class="back-button" style="
            padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
            font-size: clamp(16px, 3.5vw, 20px);
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">Назад</button>
        </div>
      </div>
    `;

    // Add hover effects
    const style = document.createElement('style');
    style.textContent = `
      .back-button:hover, #reset-progress:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255,255,255,0.3);
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
      }
      input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
        border: none;
      }
    `;
    if (!document.getElementById('settings-screen-style')) {
      style.id = 'settings-screen-style';
      document.head.appendChild(style);
    }

    // Add event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for settings
   */
  setupEventListeners() {
    // Master volume
    const masterVolume = this.element.querySelector('#master-volume');
    const masterVolumeValue = this.element.querySelector('#master-volume-value');
    if (masterVolume && this.audioManager) {
      masterVolume.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) / 100;
        this.audioManager.setMasterVolume(value);
        this.audioManager.saveSettings();
        masterVolumeValue.textContent = Math.round(value * 100) + '%';
      });
    }

    // Sound volume
    const soundVolume = this.element.querySelector('#sound-volume');
    const soundVolumeValue = this.element.querySelector('#sound-volume-value');
    if (soundVolume && this.audioManager) {
      soundVolume.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) / 100;
        this.audioManager.setSoundVolume(value);
        this.audioManager.saveSettings();
        soundVolumeValue.textContent = Math.round(value * 100) + '%';
      });
    }

    // Music volume
    const musicVolume = this.element.querySelector('#music-volume');
    const musicVolumeValue = this.element.querySelector('#music-volume-value');
    if (musicVolume && this.audioManager) {
      musicVolume.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) / 100;
        this.audioManager.setMusicVolume(value);
        this.audioManager.saveSettings();
        musicVolumeValue.textContent = Math.round(value * 100) + '%';
      });
    }

    // Music enabled
    const musicEnabled = this.element.querySelector('#music-enabled');
    if (musicEnabled && this.audioManager) {
      musicEnabled.addEventListener('change', (e) => {
        this.audioManager.setMusicEnabled(e.target.checked);
        this.audioManager.saveSettings();
      });
    }

    // Sounds enabled
    const soundsEnabled = this.element.querySelector('#sounds-enabled');
    if (soundsEnabled && this.audioManager) {
      soundsEnabled.addEventListener('change', (e) => {
        this.audioManager.setSoundsEnabled(e.target.checked);
        this.audioManager.saveSettings();
      });
    }

    // Reset progress
    const resetProgress = this.element.querySelector('#reset-progress');
    if (resetProgress) {
      resetProgress.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете скинути весь прогрес? Цю дію неможливо скасувати.')) {
          this.stateManager.resetProgress();
          alert('Прогрес скинуто!');
          this.updateContent();
        }
      });
    }

    // Back button
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

