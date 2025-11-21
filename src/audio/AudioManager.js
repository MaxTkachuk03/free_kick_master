/**
 * Audio Manager
 * Manages sound effects and background music playback
 */
export class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicAudio = null;
    this.masterVolume = 1.0;
    this.soundVolume = 1.0;
    this.musicVolume = 0.5;
    this.musicEnabled = false; // Music disabled
    this.soundsEnabled = true;
    
    // Initialize audio context (for better control)
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported, using HTML5 Audio');
      this.audioContext = null;
    }
    
    this.loadSounds();
  }

  /**
   * Load sound effects
   */
  loadSounds() {
    // Sound effects mapping - use available sound file or create silent fallback
    const availableSound = '/src/audio/sounds/378e471317469fa.mp3';
    const soundFiles = {
      kick: availableSound,
      goal: availableSound,
      miss: availableSound,
      coin: availableSound,
      click: availableSound,
      menu: availableSound
    };

    // Preload sounds (will use HTML5 Audio as fallback)
    Object.keys(soundFiles).forEach(soundId => {
      this.sounds[soundId] = {
        url: soundFiles[soundId],
        audio: null,
        loaded: false
      };
      
      // Try to preload (but don't fail if file doesn't exist)
      this.preloadSound(soundId);
    });
  }

  /**
   * Preload a sound
   */
  preloadSound(soundId) {
    if (!this.sounds[soundId]) return;
    
    try {
      const audio = new Audio(this.sounds[soundId].url);
      audio.preload = 'auto';
      audio.volume = this.soundVolume * this.masterVolume;
      
      audio.addEventListener('canplaythrough', () => {
        this.sounds[soundId].loaded = true;
      });
      
      audio.addEventListener('error', () => {
        console.warn(`Sound ${soundId} failed to load, will use silent fallback`);
        this.sounds[soundId].loaded = false;
      });
      
      this.sounds[soundId].audio = audio;
    } catch (error) {
      console.warn(`Error preloading sound ${soundId}:`, error);
      this.sounds[soundId].loaded = false;
    }
  }

  /**
   * Play sound effect
   */
  playSound(soundId, volume = 1.0) {
    if (!this.soundsEnabled || !this.masterVolume) return;
    
    if (!this.sounds[soundId]) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    try {
      // Clone audio element to allow overlapping sounds
      const sound = this.sounds[soundId];
      let audio;
      
      if (sound.audio) {
        audio = sound.audio.cloneNode();
      } else {
        // Try to load on demand
        audio = new Audio(sound.url);
        sound.audio = audio;
      }
      
      audio.volume = this.soundVolume * this.masterVolume * volume;
      audio.play().catch(error => {
        // Audio play failed (user interaction required, etc.)
        console.warn(`Failed to play sound ${soundId}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundId}:`, error);
    }
  }

  /**
   * Play background music
   */
  playMusic(musicId, loop = true) {
    if (!this.musicEnabled || !this.masterVolume) {
      console.log('Music disabled or volume is 0');
      return;
    }
    
    // Check if game is active - don't play music during gameplay
    const hud = document.getElementById('game-hud');
    if (hud && hud.style.display !== 'none') {
      console.log('Game is active, music will not play');
      return;
    }
    
    // Stop current music if playing
    this.stopMusic();
    
    // Use available sound file
    const musicUrl = '/src/audio/sounds/378e471317469fa.mp3';
    
    try {
      this.musicAudio = new Audio(musicUrl);
      this.musicAudio.loop = loop;
      this.musicAudio.volume = this.musicVolume * this.masterVolume;
      
      this.musicAudio.addEventListener('error', (e) => {
        console.warn(`Music ${musicId} failed to load:`, e);
        this.musicAudio = null;
      });
      
      this.musicAudio.addEventListener('loadeddata', () => {
        console.log('Music loaded, attempting to play...');
      });
      
      // Set music ID first
      this.music = musicId;
      
      // Try to play music immediately
      const playPromise = this.musicAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Music started successfully
            console.log(`Music ${musicId} started successfully`);
          })
          .catch(error => {
            // Autoplay was prevented - this is normal in many browsers
            // Music will be available to play after user interaction
            console.log(`Music autoplay prevented (will play on user interaction):`, error.name);
            // Keep musicAudio ready for when user interacts
          });
      } else {
        // Fallback for older browsers
        console.log('Music play() returned undefined (older browser)');
      }
    } catch (error) {
      console.warn(`Error playing music ${musicId}:`, error);
    }
  }
  
  /**
   * Resume music if it was blocked by autoplay policy
   */
  resumeMusic() {
    // Don't resume music if game is active
    const hud = document.getElementById('game-hud');
    if (hud && hud.style.display !== 'none') {
      console.log('Game is active, music will not resume');
      return;
    }
    
    if (this.music && this.musicAudio && this.musicEnabled) {
      if (this.musicAudio.paused) {
        console.log('Resuming paused music...');
        this.musicAudio.play()
          .then(() => {
            console.log('Music resumed successfully');
          })
          .catch(error => {
            console.warn('Failed to resume music:', error);
          });
      } else {
        console.log('Music is already playing');
      }
    } else {
      console.log('Cannot resume music:', {
        hasMusic: !!this.music,
        hasAudio: !!this.musicAudio,
        enabled: this.musicEnabled
      });
    }
  }
  
  /**
   * Check if music is playing
   */
  isMusicPlaying() {
    return this.musicAudio && !this.musicAudio.paused && !this.musicAudio.ended;
  }

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      // Remove all event listeners to prevent any callbacks
      this.musicAudio.onplay = null;
      this.musicAudio.onpause = null;
      this.musicAudio.onended = null;
      this.musicAudio = null;
      this.music = null;
      console.log('Music stopped');
    }
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set sound effects volume (0.0 to 1.0)
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set music volume (0.0 to 1.0)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * Update all audio volumes
   */
  updateVolumes() {
    // Update music volume
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume * this.masterVolume;
    }
    
    // Update all preloaded sound volumes
    Object.keys(this.sounds).forEach(soundId => {
      if (this.sounds[soundId].audio) {
        this.sounds[soundId].audio.volume = this.soundVolume * this.masterVolume;
      }
    });
  }

  /**
   * Enable/disable music
   */
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else if (this.music) {
      // Resume music if it was playing
      this.playMusic(this.music, true);
    }
  }

  /**
   * Enable/disable sounds
   */
  setSoundsEnabled(enabled) {
    this.soundsEnabled = enabled;
  }

  /**
   * Get current settings
   */
  getSettings() {
    return {
      masterVolume: this.masterVolume,
      soundVolume: this.soundVolume,
      musicVolume: this.musicVolume,
      musicEnabled: this.musicEnabled,
      soundsEnabled: this.soundsEnabled
    };
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('freeKickMaster_audioSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.masterVolume = settings.masterVolume ?? 1.0;
        this.soundVolume = settings.soundVolume ?? 1.0;
        this.musicVolume = settings.musicVolume ?? 0.5;
        this.musicEnabled = settings.musicEnabled ?? true;
        this.soundsEnabled = settings.soundsEnabled ?? true;
        this.updateVolumes();
      }
    } catch (error) {
      console.warn('Error loading audio settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('freeKickMaster_audioSettings', JSON.stringify({
        masterVolume: this.masterVolume,
        soundVolume: this.soundVolume,
        musicVolume: this.musicVolume,
        musicEnabled: this.musicEnabled,
        soundsEnabled: this.soundsEnabled
      }));
    } catch (error) {
      console.warn('Error saving audio settings:', error);
    }
  }

  /**
   * Cleanup
   */
  dispose() {
    this.stopMusic();
    Object.values(this.sounds).forEach(sound => {
      if (sound.audio) {
        sound.audio.pause();
        sound.audio = null;
      }
    });
    this.sounds = {};
  }
}

