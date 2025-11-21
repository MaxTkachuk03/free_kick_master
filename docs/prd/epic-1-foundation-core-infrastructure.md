# Epic 1: Foundation & Core Infrastructure

**Розширена мета:** Встановити базову інфраструктуру проєкту: репозиторій, структуру папок, залежності (Three.js, build tools). Налаштувати 3D рендеринг з базовою сценою (поле, м'яч, камера). Налаштувати deployment (GitHub Pages/Vercel/Netlify) для демонстрації. Це забезпечує основу для подальшої розробки та дозволяє показати працюючу демо-версію.

## Story 1.1: Project Setup & Repository Structure

**As a** developer,  
**I want** налаштувати структуру проєкту та репозиторій,  
**so that** я маю основу для розробки та можу відстежувати зміни коду.

**Acceptance Criteria:**
1. Створено репозиторій на GitHub/GitLab/Bitbucket
2. Налаштована базова структура папок (src/, public/, docs/, assets/)
3. Додано .gitignore для Node.js/веб-проєктів
4. Створено package.json з базовими метаданими проєкту
5. Налаштовано базовий build tool (Vite, Webpack, або подібний)
6. Створено базовий index.html файл
7. Проєкт запускається локально через npm/yarn команду

## Story 1.2: Three.js Integration & Basic 3D Scene

**As a** developer,  
**I want** інтегрувати Three.js та створити базову 3D сцену,  
**so that** я маю основу для 3D рендерингу гри.

**Acceptance Criteria:**
1. Three.js встановлено як залежність
2. Створено базовий Three.js scene з renderer, camera, та scene об'єктами
3. Налаштовано фіксовану камеру з оптимальним кутом огляду (вид збоку/зверху на поле)
4. Додано базове освітлення (ambient + directional light)
5. Створено простий зелений plane як поле (газон)
6. Додано білі лінії поля (lines або geometry)
7. Сцена рендериться в браузері без помилок
8. FPS стабільний (60 FPS на середньостатистичному десктопі)

## Story 1.3: Basic Game Objects (Ball & Goal)

**As a** developer,  
**I want** створити базові ігрові об'єкти (м'яч та ворота),  
**so that** я маю візуальну основу для геймплею.

**Acceptance Criteria:**
1. Створено 3D модель м'яча (sphere geometry) з базовою текстурою
2. М'яч розміщено на полі в позиції для штрафного удару
3. Створено 3D модель воріт (box geometry) з білою текстурою
4. Ворота розміщено на одному кінці поля
5. М'яч та ворота видимі в сцені
6. Розміри та позиції пропорційні та реалістичні

## Story 1.4: Deployment Setup

**As a** developer,  
**I want** налаштувати deployment для статичного hosting,  
**so that** я можу демонструвати працюючу версію гри за посиланням.

**Acceptance Criteria:**
1. Налаштовано GitHub Pages, Vercel, Netlify, або подібний статичний hosting
2. Налаштовано автоматичний deployment з main/master гілки (бажано)
3. Створено працююче посилання на deployed версію
4. Deployed версія відкривається в Chrome без помилок
5. Всі статичні ресурси (JS, CSS, assets) завантажуються коректно
6. Додано посилання на deployment в README.md (базова версія)
