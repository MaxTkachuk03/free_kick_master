// Free Kick Master - Main Entry Point
import { ThreeJSRenderer } from './rendering/ThreeJSRenderer.js';
import { SceneManager } from './rendering/SceneManager.js';
import { InputHandler } from './input/InputHandler.js';
import { GameLogic } from './core/GameLogic.js';
import { GameEngine } from './core/GameEngine.js';
import { CameraController } from './rendering/CameraController.js';
import { GameHUD } from './ui/components/GameHUD.js';
import { StateManager } from './core/StateManager.js';
import { UIManager } from './ui/UIManager.js';
import { MainMenu } from './ui/screens/MainMenu.js';
import { LevelSelect } from './ui/screens/LevelSelect.js';
import { ResultsScreen } from './ui/screens/ResultsScreen.js';
import { Shop } from './ui/screens/Shop.js';
import { Profile } from './ui/screens/Profile.js';
import { Settings } from './ui/screens/Settings.js';
import { PauseScreen } from './ui/screens/PauseScreen.js';
import { AudioManager } from './audio/AudioManager.js';

console.log('Free Kick Master - Game Starting...');

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  
  if (!container) {
    console.error('Game container not found!');
    return;
  }

  try {
    // Initialize State Manager (for saving progress)
    const stateManager = new StateManager();

    // Initialize Audio Manager
    const audioManager = new AudioManager();
    audioManager.loadSettings(); // Load saved audio settings
    
    // Track if music has been started (only start once)
    let musicStarted = false;
    
    // Function to start menu music (only once)
    const startMenuMusic = () => {
      if (musicStarted) {
        // Music already started, just resume if paused
        if (audioManager.musicAudio && audioManager.musicAudio.paused) {
          audioManager.resumeMusic();
        }
        return;
      }
      
      if (audioManager.musicEnabled) {
        audioManager.playMusic('menu', true);
        musicStarted = true;
        console.log('Menu music started');
      }
    };
    
    // Make function globally available for UI buttons (for first interaction)
    window.startMenuMusicIfNeeded = startMenuMusic;
    
    // Try to start music immediately (may fail due to browser autoplay policy)
    startMenuMusic();
    
    // If music didn't start (autoplay blocked), try on first user interaction
    const playMusicOnInteraction = (event) => {
      if (!musicStarted) {
        console.log('User interaction detected, starting music...');
        startMenuMusic();
      }
      // Remove listeners after first successful interaction
      document.removeEventListener('click', playMusicOnInteraction, true);
      document.removeEventListener('touchstart', playMusicOnInteraction, true);
      document.removeEventListener('keydown', playMusicOnInteraction, true);
      document.removeEventListener('mousedown', playMusicOnInteraction, true);
    };
    
    // Add multiple event listeners to catch any user interaction
    document.addEventListener('click', playMusicOnInteraction, true);
    document.addEventListener('touchstart', playMusicOnInteraction, true);
    document.addEventListener('keydown', playMusicOnInteraction, true);
    document.addEventListener('mousedown', playMusicOnInteraction, true);

    // Initialize UI Manager
    const uiManager = new UIManager('game-container', stateManager);
    
    // Resume music when main menu is shown (if it was paused)
    const originalShowScreen = uiManager.showScreen.bind(uiManager);
    uiManager.showScreen = function(screenName) {
      originalShowScreen(screenName);
      // Only resume music if it was already started and is paused
      // Don't start new music when switching screens
      if (screenName === 'mainMenu' && musicStarted && audioManager.musicAudio && audioManager.musicAudio.paused) {
        setTimeout(() => {
          audioManager.resumeMusic();
        }, 100);
      }
    };

    // Initialize Three.js renderer
    const renderer = new ThreeJSRenderer(container);
    renderer.init();

    // Initialize scene
    const sceneManager = new SceneManager(renderer);
    sceneManager.init();

    // Get game objects
    const ball = sceneManager.getBall();
    const goal = sceneManager.getGoal();

    // Initialize game logic
    const gameLogic = new GameLogic(ball, goal, sceneManager, stateManager);
    
    // Initialize HUD
    const hud = new GameHUD('game-container', audioManager);
    uiManager.registerScreen('hud', hud);
    
    // Game state variables
    let currentLevel = 1;
    let gameEngine = null;
    let inputHandler = null;
    let cameraController = null;
    let isPaused = false;
    let pauseScreen = null;

    /**
     * Start game for a specific level
     */
    const startGame = (levelId) => {
      currentLevel = levelId;
      
      // Stop menu music
      audioManager.stopMusic();
      
      // Hide UI screens
      uiManager.hideCurrentScreen();
      
      // Show HUD
      uiManager.showScreen('hud');
      
      // Reset game logic for new level (this will store initial coins)
      gameLogic.startLevel(levelId);
      
      // Update HUD with initial state
      const coins = stateManager.getCoins();
      hud.update({
        kick: 1,
        total: 5,
        coins: coins,
        goals: 0,
        misses: 0
      });

      // Get player
      const player = sceneManager.getPlayer();

      // Initialize input handler
      inputHandler = new InputHandler(
        renderer,
        renderer.camera,
        renderer.scene,
        ball,
        player
      );
      inputHandler.init();

      // Set up kick callback - connect input to game logic
      inputHandler.onKick((params) => {
        // Play kick sound
        audioManager.playSound('kick');
        gameLogic.processKick(params.direction, params.power);
      });

      // Initialize camera controller (static - always shows goal in center)
      cameraController = new CameraController(renderer.camera, ball, player);
      cameraController.init();

      // Initialize game engine (handles game loop)
      if (gameEngine) {
        gameEngine.stop();
      }
      gameEngine = new GameEngine(renderer, gameLogic, cameraController, sceneManager, inputHandler);
      gameEngine.init();
      gameEngine.start();
    };

    /**
     * Stop game and return to menu
     */
    const stopGame = () => {
      if (gameEngine) {
        gameEngine.stop();
      }
      // Resume menu music (if paused, don't restart)
      if (musicStarted && audioManager.musicAudio && audioManager.musicAudio.paused) {
        audioManager.resumeMusic();
      }
      uiManager.hideCurrentScreen();
      uiManager.showScreen('mainMenu');
    };

    // Set up game logic callbacks
    gameLogic.onKickComplete((state) => {
      console.log('Kick complete:', state);
      // Update coins in state manager (score.coins is total earned this level)
      if (stateManager) {
        const initialCoins = gameLogic.initialCoins || 0;
        const earnedCoins = state.score.coins;
        const targetTotal = initialCoins + earnedCoins;
        const currentCoins = stateManager.getCoins();
        
        if (currentCoins !== targetTotal) {
          stateManager.updateCoins(targetTotal - currentCoins);
        }
      }
      
      // Update HUD
      hud.update({
        kick: state.kick,
        total: 5,
        coins: stateManager ? stateManager.getCoins() : state.score.coins,
        goals: state.score.goals,
        misses: state.score.misses
      });
    });

    gameLogic.onGoal((score) => {
      console.log('GOAL! Score:', score);
      // Play goal sound
      audioManager.playSound('goal');
      
      // Update coins in state manager
      if (stateManager) {
        const initialCoins = gameLogic.initialCoins || 0;
        const earnedCoins = score.coins;
        const targetTotal = initialCoins + earnedCoins;
        const currentCoins = stateManager.getCoins();
        
        if (currentCoins !== targetTotal) {
          stateManager.updateCoins(targetTotal - currentCoins);
        }
      }
      
      // Update HUD and show reward
      hud.update({
        coins: stateManager ? stateManager.getCoins() : score.coins,
        goals: score.goals
      });
      hud.showRewardNotification(10, 'Гол!');
    });

    gameLogic.onMiss((score) => {
      console.log('Miss! Score:', score);
      // Play miss sound
      audioManager.playSound('miss');
      
      // Update HUD
      hud.update({
        misses: score.misses
      });
    });

    gameLogic.onLevelComplete((score) => {
      console.log('Level complete! Final score:', score);
      
      // Final update coins in state manager
      if (stateManager) {
        const initialCoins = gameLogic.initialCoins || 0;
        const earnedCoins = score.coins;
        const targetTotal = initialCoins + earnedCoins;
        const currentCoins = stateManager.getCoins();
        
        if (currentCoins !== targetTotal) {
          stateManager.updateCoins(targetTotal - currentCoins);
        }
        
        // Save level completion with earned coins
        stateManager.completeLevel(currentLevel, earnedCoins);
      }
      
      // Stop game
      if (gameEngine) {
        gameEngine.stop();
      }
      
      // Play coin sound for completion bonus
      audioManager.playSound('coin');
      
      // Hide HUD
      uiManager.hideCurrentScreen();
      
      // Resume menu music (if it was paused, don't restart)
      if (musicStarted && audioManager.musicAudio && audioManager.musicAudio.paused) {
        audioManager.resumeMusic();
      } else if (!musicStarted) {
        // Only start if it wasn't started before
        startMenuMusic();
      }
      
      // Show results screen
      const resultsScreen = uiManager.screens['results'];
      if (resultsScreen) {
        const finalCoins = stateManager ? stateManager.getCoins() : score.coins;
        resultsScreen.show(currentLevel, {
          goals: score.goals,
          misses: score.misses,
          coins: score.coins,
          totalCoins: finalCoins
        });
      }
    });

    // Create and register UI screens
    const mainMenu = new MainMenu(uiManager.getContainer(), stateManager, (action) => {
      uiManager.handleMenuNavigation(action, audioManager);
    });
    uiManager.registerScreen('mainMenu', mainMenu);

    const levelSelect = new LevelSelect(
      uiManager.getContainer(),
      stateManager,
      (levelId) => {
        startGame(levelId);
      },
      () => {
        uiManager.showScreen('mainMenu');
        // Music will resume automatically via showScreen override
      }
    );
    uiManager.registerScreen('levelSelect', levelSelect);

    const resultsScreen = new ResultsScreen(
      uiManager.getContainer(),
      stateManager,
      (nextLevel) => {
        startGame(nextLevel);
      },
      (levelId) => {
        startGame(levelId);
      },
      () => {
        uiManager.showScreen('mainMenu');
        // Music will resume automatically via showScreen override
      }
    );
    uiManager.registerScreen('results', resultsScreen);

    const shop = new Shop(
      uiManager.getContainer(),
      stateManager,
      () => {
        uiManager.showScreen('mainMenu');
        // Music will resume automatically via showScreen override
      }
    );
    uiManager.registerScreen('shop', shop);

    const profile = new Profile(
      uiManager.getContainer(),
      stateManager,
      () => {
        uiManager.showScreen('mainMenu');
        // Music will resume automatically via showScreen override
      }
    );
    uiManager.registerScreen('profile', profile);

    const settings = new Settings(
      uiManager.getContainer(),
      stateManager,
      audioManager,
      () => {
        uiManager.showScreen('mainMenu');
        // Music will resume automatically via showScreen override
      }
    );
    uiManager.registerScreen('settings', settings);

    // Create pause screen
    pauseScreen = new PauseScreen(
      uiManager.getContainer(),
      resumeGame,
      exitToMenu
    );

    // Show main menu on start
    uiManager.showScreen('mainMenu');

    console.log('Game initialized successfully!');
  } catch (error) {
    console.error('Error initializing game:', error);
  }
});
