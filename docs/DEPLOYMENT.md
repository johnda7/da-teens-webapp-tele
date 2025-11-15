# 🚀 Deployment Guide - DA Teens Webapp

## ✅ Текущий статус

**Production URL:** https://johnda7.github.io/da-teens-webapp-tele/

**Последний успешный деплой:** 15 ноября 2025, 15:50 UTC

**Статус:** ✅ Работает без ошибок

---

## 📋 Процесс деплоя

### 1. Локальная подготовка

```bash
# 1. Проверить что все изменения закоммичены
git status

# 2. Установить зависимости (если были изменения в package.json)
npm install

# 3. ОБЯЗАТЕЛЬНО: Протестировать production build локально
npm run build

# 4. Проверить что build прошёл успешно (должна появиться папка dist/)
ls -la dist/

# 5. Опционально: Запустить preview для проверки
npm run preview
# Откроется на http://localhost:8080
```

### 2. Деплой на GitHub Pages

```bash
# 1. Закоммитить изменения
git add -A
git commit -m "your commit message"

# 2. Отправить на GitHub
git push origin main

# 3. Деплой запустится автоматически через GitHub Actions
# Проверить статус можно на:
# https://github.com/johnda7/da-teens-webapp-tele/actions
```

### 3. Проверка деплоя

**Автоматическая проверка через API:**
```bash
# Проверить статус последнего workflow
curl -s 'https://api.github.com/repos/johnda7/da-teens-webapp-tele/actions/runs?event=push&per_page=1' \
  | grep -E '"status"|"conclusion"'

# Должно быть:
# "status": "completed"
# "conclusion": "success"
```

**Ручная проверка:**
1. Открыть https://github.com/johnda7/da-teens-webapp-tele/actions
2. Найти последний "Deploy to GitHub Pages" workflow
3. Убедиться что статус ✅ зелёный

**Проверка сайта:**
```bash
# 1. Проверить доступность
curl -I https://johnda7.github.io/da-teens-webapp-tele/

# 2. Проверить что загружаются JS файлы
curl -s https://johnda7.github.io/da-teens-webapp-tele/ | grep "index-"

# 3. Открыть в браузере и проверить Console на ошибки
# https://johnda7.github.io/da-teens-webapp-tele/
```

---

## 🔧 GitHub Actions Workflow

### Файл конфигурации

`.github/workflows/deploy.yml`

### Шаги деплоя

1. **Checkout** - клонирование репозитория
2. **Setup Node** - установка Node.js 20.x
3. **Install dependencies** - `npm ci` (быстрая установка из lock файла)
4. **Build** - `npm run build` (компиляция через Vite)
5. **Setup Pages** - подготовка для GitHub Pages
6. **Upload artifact** - загрузка собранных файлов
7. **Deploy** - публикация на GitHub Pages

### Важные переменные окружения

```yaml
env:
  NODE_ENV: production
```

### Base path для GitHub Pages

В `vite.config.ts` обязательно указан:
```typescript
base: '/da-teens-webapp-tele/'
```

---

## ⚠️ Типичные ошибки и решения

### Ошибка 1: White screen (пустой экран)

**Симптомы:** Сайт открывается, но показывает белый экран

**Причины:**
- ❌ Неправильный `base` path в `vite.config.ts`
- ❌ JavaScript ошибки в production build
- ❌ Неправильные пути к assets

**Решение:**
```bash
# 1. Проверить base path
grep "base:" vite.config.ts
# Должно быть: base: '/da-teens-webapp-tele/'

# 2. Проверить локальный build
npm run build
npm run preview

# 3. Открыть Browser Console и посмотреть ошибки
# https://johnda7.github.io/da-teens-webapp-tele/
```

### Ошибка 2: useMergeRef / useLayoutEffect errors

**Симптомы:** 
```
Cannot read properties of undefined (reading 'useLayoutEffect')
at useMergeRef.ts:4
```

**Причина:** 
- ❌ Radix UI не может найти React в правильном scope
- ❌ Удалили `src/lib/react-init.ts` импорт из `main.tsx`

**Решение:**
```bash
# Проверить что в main.tsx есть:
grep "react-init" src/main.tsx
# Должно быть: import './lib/react-init'

# Проверить что файл существует:
cat src/lib/react-init.ts
```

### Ошибка 3: Module not found (@github/spark)

**Симптомы:**
```
Cannot find module '@github/spark/hooks'
```

**Причина:**
- ❌ Остались импорты от старой Spark зависимости

**Решение:**
```bash
# Найти все упоминания
grep -r "@github/spark" src/

# Заменить на локальные:
# @github/spark/hooks → @/lib/kv
```

### Ошибка 4: Build fails with icon errors

**Симптомы:**
```
"MessageCircle" is not exported by "@phosphor-icons/react"
```

**Причина:**
- ❌ Использовали несуществующие иконки из Phosphor

**Решение:**
```typescript
// ❌ Неправильно:
import { MessageCircle, AlertTriangle } from '@phosphor-icons/react'

// ✅ Правильно:
import { ChatCircle, Warning } from '@phosphor-icons/react'
```

### Ошибка 5: CSS не применяется

**Симптомы:** Сайт работает, но стили сломаны

**Причина:**
- ❌ Старые CSS селекторы `#spark-app`
- ❌ Tailwind CSS не скомпилировался

**Решение:**
```bash
# 1. Проверить что #spark-app заменён на :root
grep "#spark-app" src/styles/theme.css
# Не должно быть результатов

# 2. Проверить Tailwind в vite.config.ts
grep "tailwindcss" vite.config.ts
# Должно быть: import tailwindcss from "@tailwindcss/vite"
```

### Ошибка 6: 404 на assets

**Симптомы:** Assets не загружаются (404 ошибки)

**Причина:**
- ❌ Неправильный base path
- ❌ Assets не попали в dist/

**Решение:**
```bash
# Проверить структуру dist/
ls -la dist/assets/

# Должны быть файлы:
# index-*.js
# index-*.css
# vendor-*.js
# etc.
```

---

## 📊 Мониторинг деплоя

### Проверка после каждого push:

1. **GitHub Actions** (1-2 минуты)
   - https://github.com/johnda7/da-teens-webapp-tele/actions
   - Должен быть ✅ зелёный статус

2. **Production site** (сразу после деплоя)
   - https://johnda7.github.io/da-teens-webapp-tele/
   - Открыть Console (F12) - не должно быть красных ошибок

3. **Functionality check**
   - Навигация работает (табы внизу)
   - Модули открываются
   - localStorage сохраняет данные

### Быстрая команда проверки:

```bash
# Скрипт для полной проверки
curl -I https://johnda7.github.io/da-teens-webapp-tele/ && \
curl -s 'https://api.github.com/repos/johnda7/da-teens-webapp-tele/actions/runs?event=push&per_page=1' \
  | grep -E '"conclusion"' && \
echo "✅ Deployment check complete"
```

---

## 🔄 Откат на предыдущую версию

Если что-то сломалось:

```bash
# 1. Найти последний рабочий коммит
git log --oneline -10

# 2. Откатиться к нему
git reset --hard <commit-hash>

# 3. Force push (ОСТОРОЖНО!)
git push -f origin main

# 4. Деплой запустится автоматически
```

**Текущий стабильный коммит:** `8f7542c` (полная очистка от Spark)

---

## 📝 Чеклист перед деплоем

- [ ] `npm run build` проходит без ошибок
- [ ] `npm run preview` показывает работающее приложение
- [ ] Нет TypeScript ошибок (можно игнорировать warnings)
- [ ] Git status чистый (все изменения закоммичены)
- [ ] Commit message информативный
- [ ] README.md обновлён (если были значительные изменения)

---

## 🎯 Оптимизация деплоя

### Ускорение build:

1. **Cache node_modules** (уже настроено в GitHub Actions)
2. **Минификация включена** (через Vite esbuild)
3. **Code splitting настроен** (vite.config.ts → manualChunks)

### Размеры бандлов (текущие):

```
index.html                    1.38 kB
index-*.css               1,014.22 kB
index-*.js                  213.07 kB
boundaries-*.js             430.83 kB
vendor-*.js                  11.79 kB
ui-*.js                      48.22 kB
features-*.js                55.64 kB
animations-*.js             117.01 kB
icons-*.js                  147.50 kB
```

**Total:** ~2.0 MB (до gzip), ~500 KB (после gzip)

---

## 🔐 Безопасность

### Что НЕ коммитить:

- `.env` файлы с секретами
- `node_modules/`
- `dist/` (собирается автоматически)
- API ключи
- Персональные данные

### Что уже в .gitignore:

```
node_modules/
dist/
.env
.env.local
.spark-workbench-id
```

---

## 🆘 Контакты для помощи

**Если деплой сломался:**

1. Проверить GitHub Actions logs
2. Проверить Browser Console
3. Откатиться на последний рабочий коммит
4. Проверить эту документацию

**Полезные ссылки:**

- GitHub Actions: https://github.com/johnda7/da-teens-webapp-tele/actions
- Production: https://johnda7.github.io/da-teens-webapp-tele/
- Vite docs: https://vite.dev
- GitHub Pages docs: https://docs.github.com/en/pages

---

**Последнее обновление:** 15 ноября 2025
**Статус:** ✅ Всё работает, Spark полностью удалён
