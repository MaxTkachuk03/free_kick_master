// Free Kick Master - Main Entry Point
import { ThreeJSRenderer } from './rendering/ThreeJSRenderer.js';
import { SceneManager } from './rendering/SceneManager.js';
import { InputHandler } from './input/InputHandler.js';
import { GameLogic } from './core/GameLogic.js';
import { TargetManager } from './game/TargetManager.js';
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
import { UNIFORMS } from './shop/uniforms.js';
import { getAllBalls } from './shop/balls.js';

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
    
    // Music disabled - don't start
    // startMenuMusic();
    
    // Store interaction handler for removal later
    let playMusicOnInteraction = null;
    let isGameActive = false; // Track if game is currently active
    let musicInteractionListenersRemoved = false; // Track if listeners were removed
    
    // If music didn't start (autoplay blocked), try on first user interaction
    playMusicOnInteraction = (event) => {
      // Always check if game is active first
      if (isGameActive) {
        return;
      }
      
      // Don't start music if game is running (check if HUD is visible)
      const hud = document.getElementById('game-hud');
      if (hud && hud.style.display !== 'none') {
        // Game is running, don't start music
        return;
      }
      
      // Don't start music if listeners were already removed or music already started
      if (musicInteractionListenersRemoved || musicStarted) {
        return;
      }
      
      console.log('User interaction detected, starting music...');
      startMenuMusic();
      
      // Remove listeners immediately after attempting to start music
      document.removeEventListener('click', playMusicOnInteraction, true);
      document.removeEventListener('touchstart', playMusicOnInteraction, true);
      document.removeEventListener('keydown', playMusicOnInteraction, true);
      document.removeEventListener('mousedown', playMusicOnInteraction, true);
      musicInteractionListenersRemoved = true;
    };
    
    // Music disabled - don't add interaction listeners
    // document.addEventListener('click', playMusicOnInteraction, true);
    // document.addEventListener('touchstart', playMusicOnInteraction, true);
    // document.addEventListener('keydown', playMusicOnInteraction, true);
    // document.addEventListener('mousedown', playMusicOnInteraction, true);

    // Initialize UI Manager
    const uiManager = new UIManager('game-container', stateManager);
    
    // Control music: play only in menus, stop during gameplay
    const menuScreens = ['mainMenu', 'levelSelect', 'shop', 'settings', 'profile'];
    const gameScreens = ['hud', 'results', 'pause'];
    
    const originalShowScreen = uiManager.showScreen.bind(uiManager);
    uiManager.showScreen = function(screenName) {
      originalShowScreen(screenName);
      
      // Stop music for game screens (HUD, results, pause)
      if (gameScreens.includes(screenName)) {
        if (audioManager) {
          audioManager.stopMusic();
          console.log('Music stopped - game screen active:', screenName);
        }
      }
      
      // Music disabled - don't start/resume
      // if (menuScreens.includes(screenName)) {
      //   if (musicStarted && audioManager.musicAudio && audioManager.musicAudio.paused) {
      //     audioManager.resumeMusic();
      //   } else if (!musicStarted) {
      //     startMenuMusic();
      //   }
      // }
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

    // Initialize target manager
    const targetManager = new TargetManager(goal, renderer.getScene());

    // Initialize game logic
    const gameLogic = new GameLogic(ball, goal, sceneManager, stateManager, targetManager);
    
    // Store targetManager for game engine
    let targetManagerRef = targetManager;
    
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
      isPaused = false;
      
      // Stop menu music immediately when level starts (ensure it's stopped during gameplay)
      if (audioManager) {
        audioManager.stopMusic();
        console.log('Music stopped for level start');
      }
      
      // Remove music interaction listeners to prevent music from starting during gameplay
      if (playMusicOnInteraction && !musicInteractionListenersRemoved) {
        document.removeEventListener('click', playMusicOnInteraction, true);
        document.removeEventListener('touchstart', playMusicOnInteraction, true);
        document.removeEventListener('keydown', playMusicOnInteraction, true);
        document.removeEventListener('mousedown', playMusicOnInteraction, true);
        musicInteractionListenersRemoved = true;
      }
      
      // Mark game as active
      isGameActive = true;
      
      // Hide UI screens
      uiManager.hideCurrentScreen();
      
      // Hide pause screen if visible
      if (pauseScreen) {
        pauseScreen.hide();
      }
      
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
      
      // Apply selected uniform to player
      const selectedUniformId = stateManager.getSelectedUniform();
      const selectedUniform = UNIFORMS.find(u => u.id === selectedUniformId) || UNIFORMS[0]; // Default to first uniform if none selected
      if (player && selectedUniform) {
        console.log('Applying uniform to player:', selectedUniform);
        player.applyUniform(selectedUniform);
      }

      // Apply selected ball style
      const selectedBallId = stateManager.getSelectedBall();
      const balls = getAllBalls();
      const selectedBall = balls.find(b => b.id === selectedBallId) || balls[0]; // Default to first ball if none selected
      const gameBall = sceneManager.getBall();
      if (gameBall && selectedBall) {
        console.log('Applying ball style:', selectedBall);
        const ballConfig = {
          color: selectedBall.color,
          patternColor: selectedBall.pattern === 'classic' ? 0x000000 : (selectedBall.patternColor || 0x000000),
          hasPattern: selectedBall.pattern !== 'solid'
        };
        gameBall.applyBallStyle(ballConfig);
      }

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
        gameLogic.processKick(params.direction, params.power, params.swipeSpeed || 0);
      });

      // Initialize camera controller (static - always shows goal in center)
      cameraController = new CameraController(renderer.camera, ball, player);
      cameraController.init();

      // Initialize game engine (handles game loop)
      if (gameEngine) {
        gameEngine.stop();
      }
      gameEngine = new GameEngine(renderer, gameLogic, cameraController, sceneManager, inputHandler, targetManagerRef);
      gameEngine.init();
      gameEngine.start();
      
      // Setup pause functionality
      setupPauseControls();
    };
    
    /**
     * Setup pause controls (ESC key and pause button)
     */
    const setupPauseControls = () => {
      // ESC key handler
      const handleKeyPress = (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          togglePause();
        }
      };
      
      // Remove old listener if exists
      document.removeEventListener('keydown', handleKeyPress);
      document.addEventListener('keydown', handleKeyPress);
      
      // Pause button in HUD
      const pauseButton = document.getElementById('pause-button');
      if (pauseButton) {
        pauseButton.onclick = () => {
          togglePause();
        };
      }
    };
    
    /**
     * Toggle pause state
     */
    const togglePause = () => {
      if (!gameEngine || !gameEngine.isRunning) return;
      
      isPaused = !isPaused;
      
      if (isPaused) {
        // Pause game
        gameEngine.pause();
        if (pauseScreen) {
          pauseScreen.show();
        }
      } else {
        // Resume game
        gameEngine.resume();
        if (pauseScreen) {
          pauseScreen.hide();
        }
        // Ensure music is stopped when resuming game
        if (audioManager) {
          audioManager.stopMusic();
        }
      }
    };
    
    /**
     * Resume game from pause
     */
    const resumeGame = () => {
      isPaused = false;
      if (gameEngine) {
        gameEngine.resume();
      }
      if (pauseScreen) {
        pauseScreen.hide();
      }
      // Ensure music is stopped when resuming game
      if (audioManager) {
        audioManager.stopMusic();
      }
    };
    
    /**
     * Exit to menu from pause
     */
    const exitToMenu = () => {
      // Stop game
      if (gameEngine) {
        gameEngine.stop();
      }
      
      // Mark game as inactive
      isGameActive = false;
      
      // Hide pause screen
      if (pauseScreen) {
        pauseScreen.hide();
      }
      
      // Hide HUD
      uiManager.hideCurrentScreen();
      
      // Show main menu (music will start automatically via showScreen override)
      uiManager.showScreen('mainMenu');
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
    // Callback when kick starts (after swipe)
    gameLogic.onKickStart((state) => {
      console.log('Kick started:', state);
      // Update HUD immediately after swipe
      if (hud) {
        hud.update({
          kick: state.kick,
          total: state.total,
          coins: stateManager ? stateManager.getCoins() : state.score.coins,
          goals: state.score.goals,
          misses: state.score.misses
        });
      }
    });
    
    gameLogic.onKickComplete((state) => {
      console.log('Kick complete callback:', state);
      
      // Get current game state to ensure we have the latest values
      const gameState = gameLogic.getGameState();
      
      // Update coins in state manager (score.coins is total earned this level)
      if (stateManager) {
        const initialCoins = gameLogic.initialCoins || 0;
        const earnedCoins = state.score.coins;
        const targetTotal = initialCoins + earnedCoins;
        const currentCoins = stateManager.getCoins();
        
        if (currentCoins !== targetTotal) {
          console.log('Updating coins in state manager:', {
            currentCoins,
            targetTotal,
            difference: targetTotal - currentCoins
          });
          stateManager.updateCoins(targetTotal - currentCoins);
        }
      }
      
      // Update HUD with current game state (refresh display without changing values)
      // Use gameState to get the most up-to-date values
      const hudData = {
        kick: gameState.currentKick,
        total: 5,
        remaining: gameState.kicksRemaining,
        coins: stateManager ? stateManager.getCoins() : gameState.score.coins,
        goals: gameState.score.goals,
        misses: gameState.score.misses
      };
      
      console.log('🔄 Refreshing HUD after kick complete (no value changes):', hudData);
      hud.update(hudData);
      
      console.log('✅ HUD refreshed after kick complete:', {
        kick: hudData.kick,
        remaining: hudData.remaining,
        coins: hudData.coins,
        goals: hudData.goals,
        misses: hudData.misses
      });
    });

    // Target hit callback
    gameLogic.onTargetHit((hitTargets, reward) => {
      // Update HUD with target hit notification
      if (hud) {
        hud.showRewardNotification(`Мішень! +${reward} монет`);
      }
      // Play coin sound
      if (audioManager) {
        audioManager.playSound('coin');
      }
    });
    
    gameLogic.onGoal((score) => {
      console.log('🎯 GOAL callback triggered! Score object:', score);
      console.log('🎯 Score.goals value:', score.goals);
      console.log('🎯 Score type:', typeof score);
      console.log('🎯 Score keys:', Object.keys(score));
      
      // Play goal sound
      audioManager.playSound('goal');
      
      // Update coins in state manager immediately after goal (+10 coins)
      if (stateManager) {
        const currentCoins = stateManager.getCoins();
        stateManager.updateCoins(10);
        console.log('Coins updated:', currentCoins, '->', stateManager.getCoins());
      }
      
      // Get current game state
      const gameState = gameLogic.getGameState();
      console.log('🎯 Game state goals:', gameState.score.goals);
      
      // Update HUD and show reward immediately
      const hudData = {
        kick: gameState.currentKick,
        total: 5,
        remaining: gameState.kicksRemaining,
        coins: stateManager ? stateManager.getCoins() : score.coins,
        goals: score.goals || gameState.score.goals || 0,
        misses: score.misses || gameState.score.misses || 0
      };
      
      console.log('🎯 Updating HUD with data:', hudData);
      hud.update(hudData);
      hud.showRewardNotification(10, 'Гол!');
      
      console.log('✅ HUD updated after goal:', {
        goals: hudData.goals,
        misses: hudData.misses,
        coins: hudData.coins,
        remaining: hudData.remaining
      });
    });

    gameLogic.onMiss((score) => {
      console.log('MISS callback! Score:', score);
      // Play miss sound
      audioManager.playSound('miss');
      
      // Get current game state
      const gameState = gameLogic.getGameState();
      
      // Update HUD
      hud.update({
        kick: gameState.currentKick,
        total: 5,
        remaining: gameState.kicksRemaining,
        coins: stateManager ? stateManager.getCoins() : score.coins,
        goals: score.goals,
        misses: score.misses
      });
      
      console.log('HUD updated after miss:', {
        goals: score.goals,
        misses: score.misses,
        coins: stateManager ? stateManager.getCoins() : score.coins,
        remaining: gameState.kicksRemaining
      });
    });

    gameLogic.onLevelComplete((score) => {
      console.log('🎉🎉🎉 Level complete callback triggered! Final score:', score);
      console.log('🎉 Score details:', {
        goals: score.goals,
        misses: score.misses,
        coins: score.coins
      });
      
      // Stop game immediately
      if (gameEngine) {
        gameEngine.stop();
        console.log('✅ Game engine stopped');
      }
      
      // Mark game as inactive
      isGameActive = false;
      
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
        console.log('✅ Level completion saved to state manager');
      }
      
      // Play coin sound for completion bonus
      audioManager.playSound('coin');
      
      // Hide HUD first
      if (uiManager.screens['hud']) {
        uiManager.screens['hud'].hide();
      }
      uiManager.hideCurrentScreen();
      console.log('✅ HUD hidden');
      
      // Small delay to ensure HUD is hidden before showing results
      setTimeout(() => {
        // Show results screen as dialog
        const resultsScreen = uiManager.screens['results'];
        if (resultsScreen) {
          const finalCoins = stateManager ? stateManager.getCoins() : score.coins;
          console.log('✅✅✅ Showing results dialog after 5 kicks:', {
            level: currentLevel,
            goals: score.goals,
            misses: score.misses,
            coins: score.coins,
            totalCoins: finalCoins
          });
          
          // Show results screen directly (it's a modal dialog)
          resultsScreen.show(currentLevel, {
            goals: score.goals,
            misses: score.misses,
            coins: score.coins,
            totalCoins: finalCoins
          });
          
          // Also register it in uiManager for proper tracking
          uiManager.currentScreen = 'results';
          
          console.log('✅✅✅ Results dialog shown and displayed!');
        } else {
          console.error('❌❌❌ Results screen not found in uiManager.screens!');
          console.error('Available screens:', Object.keys(uiManager.screens || {}));
        }
      }, 300); // Small delay to ensure smooth transition
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
    // Store reference to shop for applying uniforms
    shop.applyUniformToPlayer = (uniformId) => {
      const uniform = UNIFORMS.find(u => u.id === uniformId) || UNIFORMS[0];
      const player = sceneManager ? sceneManager.getPlayer() : null;
      if (player && uniform) {
        console.log('Applying uniform to player from shop:', uniform);
        player.applyUniform(uniform);
      }
    };
    
    shop.applyBallToGame = (ballId) => {
      const balls = getAllBalls();
      const ball = balls.find(b => b.id === ballId) || balls[0];
      const gameBall = sceneManager ? sceneManager.getBall() : null;
      if (gameBall && ball) {
        console.log('Applying ball style from shop:', ball);
        // Convert ball config to format expected by applyBallStyle
        const ballConfig = {
          color: ball.color,
          patternColor: ball.pattern === 'classic' ? 0x000000 : (ball.patternColor || 0x000000),
          hasPattern: ball.pattern !== 'solid'
        };
        gameBall.applyBallStyle(ballConfig);
      }
    };
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
    // Restart game function (restart current level)
    const restartGame = () => {
      if (currentLevel) {
        // Stop current game
        if (gameEngine) {
          gameEngine.stop();
        }
        isGameActive = false;
        isPaused = false;
        
        // Hide pause screen
        if (pauseScreen) {
          pauseScreen.hide();
        }
        
        // Restart the current level
        startGame(currentLevel);
      }
    };

    pauseScreen = new PauseScreen(
      uiManager.getContainer(),
      resumeGame,
      exitToMenu,
      restartGame
    );

    // Show main menu on start
    uiManager.showScreen('mainMenu');

    console.log('Game initialized successfully!');
  } catch (error) {
    console.error('Error initializing game:', error);
  }
});
