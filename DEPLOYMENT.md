# Інструкція з деплою Free Kick Master

## Як отримати посилання на гру

### Варіант 1: GitHub Pages (Безкоштовно)

1. **Створіть репозиторій на GitHub:**
   - Перейдіть на https://github.com
   - Натисніть "New repository"
   - Назвіть репозиторій (наприклад: `free-kick-master`)
   - Створіть репозиторій

2. **Завантажте код:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/free-kick-master.git
   git push -u origin main
   ```

3. **Увімкніть GitHub Pages:**
   - Перейдіть в Settings → Pages
   - Source: виберіть "GitHub Actions"
   - Збережіть

4. **Посилання буде:**
   ```
   https://YOUR_USERNAME.github.io/free-kick-master/
   ```
   
   Замініть `YOUR_USERNAME` на ваш GitHub username.

---

### Варіант 2: Vercel (Безкоштовно, найпростіше)

1. **Встановіть Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Задеплойте:**
   ```bash
   vercel --prod
   ```

3. **Посилання буде:**
   - Vercel автоматично дасть вам посилання типу:
   ```
   https://free-kick-master.vercel.app
   ```
   - Або можна налаштувати кастомний домен

---

### Варіант 3: Netlify (Безкоштовно)

1. **Варіант A - Через Netlify Drop:**
   - Перейдіть на https://app.netlify.com/drop
   - Перетягніть папку `dist/` (після `npm run build`)
   - Отримаєте посилання типу: `https://random-name-123.netlify.app`

2. **Варіант B - Через Git:**
   - Підключіть GitHub репозиторій до Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Отримаєте посилання типу: `https://your-app-name.netlify.app`

---

### Варіант 4: Cloudflare Pages (Безкоштовно)

1. Перейдіть на https://pages.cloudflare.com
2. Підключіть GitHub репозиторій
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Отримаєте посилання типу: `https://your-app.pages.dev`

---

## Швидкий старт (GitHub Pages)

Якщо у вас вже є GitHub репозиторій:

1. **Перевірте поточний remote:**
   ```bash
   git remote -v
   ```

2. **Якщо немає remote, додайте:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

3. **Запуште код:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Увімкніть GitHub Pages:**
   - GitHub → Settings → Pages
   - Source: GitHub Actions
   - Збережіть

5. **Посилання:**
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

---

## Перевірка деплою

Після деплою перевірте:
- ✅ Гра завантажується
- ✅ Немає помилок в консолі браузера
- ✅ Всі ассети завантажуються
- ✅ localStorage працює

---

## Примітки

- **GitHub Pages:** Може зайняти 1-2 хвилини після push
- **Vercel/Netlify:** Зазвичай деплоїться за 30-60 секунд
- **Custom domain:** Можна налаштувати власний домен на будь-якому хостингу

---

## Проблеми?

Якщо гра не працює після деплою:
1. Перевірте консоль браузера (F12)
2. Переконайтеся, що всі файли завантажилися
3. Перевірте, що `base` path правильний в `vite.config.js`
4. Перевірте, що `dist/` містить всі файли

