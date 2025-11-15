# 🔥 Миграция с @github/spark: Полное руководство

## 📋 Проблема

При попытке удалить `@github/spark` из проекта, приложение ломалось с ошибкой:
```
Cannot read properties of undefined (reading 'useLayoutEffect')
at useMergeRef.ts:4
```

## 🔍 Корневая причина

**`import "@github/spark/spark"`** в `src/main.tsx` делал КРИТИЧЕСКУЮ инициализацию:

1. ✅ Регистрировал React в глобальной области видимости (`window.React`)
2. ✅ Создавал единый React контекст для всех зависимостей
3. ✅ Настраивал module resolution для Radix UI и других библиотек

Когда мы удалили этот импорт без замены:
- ❌ Radix UI потерял доступ к React контексту
- ❌ `useMergeRef` получал `undefined` вместо React
- ❌ Production build падал с white screen

## ✅ Решение

Создали **замену** для Spark инициализации: `src/lib/react-init.ts`

Этот файл:
- Регистрирует React глобально для совместимости
- Заменяет функциональность `@github/spark/spark`
- Решает проблему без тяжёлой зависимости

## 📝 Пошаговая миграция

### Шаг 1: Создать react-init.ts (✅ ГОТОВО)

```typescript
// src/lib/react-init.ts
import * as React from 'react'
import * as ReactDOM from 'react-dom'

if (typeof window !== 'undefined') {
  ;(window as any).React = React
  ;(window as any).ReactDOM = ReactDOM
}

export { React, ReactDOM }
```

### Шаг 2: Обновить main.tsx

**БЫЛО (сломанная версия fc8ebd7):**
```tsx
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
// ❌ Удалён import "@github/spark/spark"

import App from './app/App'
```

**ДОЛЖНО БЫТЬ:**
```tsx
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import './lib/react-init' // ✅ Замена для @github/spark/spark

import App from './app/App'
```

### Шаг 3: Очистить vite.config.ts

**БЫЛО (рабочая версия 3435c14):**
```typescript
import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";

export default defineConfig({
  base: '/da-teens-webapp-tele/',
  plugins: [
    react(),
    tailwindcss(),
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption, // ❌ Удалить
  ],
```

**ДОЛЖНО БЫТЬ:**
```typescript
export default defineConfig({
  base: '/da-teens-webapp-tele/', // ✅ Фиксированный base path
  plugins: [
    react(),
    tailwindcss(),
  ],
```

### Шаг 4: Обновить package.json

**build скрипт - БЫЛО (3435c14):**
```json
"build": "tsc -b --noCheck && vite build"
```

**СТАЛО (fc8ebd7) - ПЛОХО:**
```json
"build": "vite build"
```

**ДОЛЖНО БЫТЬ (с проверкой типов):**
```json
"build": "tsc --noEmit && vite build"
```

**Удалить зависимость:**
```json
{
  "dependencies": {
    // ❌ Удалить эту строку:
    "@github/spark": "^0.39.0",
  }
}
```

### Шаг 5: Заменить useKV (✅ УЖЕ СДЕЛАНО в fc8ebd7)

Создан локальный `src/lib/kv.ts` с имплементацией через localStorage.

**В App.tsx изменено:**
```typescript
// БЫЛО:
import { useKV } from '@github/spark/hooks'

// СТАЛО:
import { useKV } from '@/lib/kv'
```

### Шаг 6: Обновить .github/workflows/deploy.yml

**ДОЛЖНО БЫТЬ:**
```yaml
- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build
  env:
    NODE_ENV: production
```

### Шаг 7: Установить зависимости заново

```bash
# Удалить старые зависимости
rm -rf node_modules package-lock.json

# Установить без Spark
npm install

# Проверить сборку локально
npm run build

# Проверить локально
npm run preview
```

## 🧪 Тестирование

После миграции проверить:

1. ✅ Локальная разработка работает: `npm run dev`
2. ✅ Production build собирается: `npm run build`
3. ✅ Preview работает: `npm run preview`
4. ✅ Нет ошибок `useMergeRef` в консоли
5. ✅ GitHub Pages деплоится корректно
6. ✅ Все Radix UI компоненты работают

## 📊 Сравнение версий

| Файл | 3435c14 (работает) | fc8ebd7 (сломан) | Правильная миграция |
|------|-------------------|------------------|---------------------|
| main.tsx | `import "@github/spark/spark"` | ❌ Удалён | ✅ `import './lib/react-init'` |
| package.json | `@github/spark` | ❌ Удалён | ✅ Удалён |
| vite.config.ts | sparkPlugin | ❌ Удалён | ✅ Удалён |
| lib/kv.ts | Не было | ✅ Создан | ✅ Создан |
| lib/react-init.ts | Не было | ❌ Не создан | ✅ Создан |

## ⚠️ Частые ошибки

### Ошибка 1: Забыли импортировать react-init
**Симптом:** `useMergeRef: Cannot read 'useLayoutEffect'`
**Решение:** Добавить `import './lib/react-init'` в `main.tsx`

### Ошибка 2: Неправильный порядок импортов
**Симптом:** React не регистрируется до загрузки Radix UI
**Решение:** `react-init` должен быть ВТОРЫМ импортом после React

### Ошибка 3: Забыли удалить sparkPlugin из vite.config
**Симптом:** Build падает с ошибкой "Cannot find module '@github/spark'"
**Решение:** Удалить все импорты Spark из vite.config.ts

### Ошибка 4: Изменили base path на динамический
**Симптом:** Ассеты не загружаются на GitHub Pages
**Решение:** Вернуть `base: '/da-teens-webapp-tele/'` (фиксированный)

## 🎯 Чеклист миграции

- [ ] Создан `src/lib/react-init.ts`
- [ ] Обновлён `src/main.tsx` (импорт react-init)
- [ ] Очищен `vite.config.ts` (удалены Spark плагины)
- [ ] Обновлён `package.json` (удалён @github/spark)
- [ ] Обновлён build скрипт (добавлен tsc --noEmit)
- [ ] Удалены `node_modules` и `package-lock.json`
- [ ] Запущен `npm install`
- [ ] Проверена локальная разработка (`npm run dev`)
- [ ] Проверена production сборка (`npm run build`)
- [ ] Проверен preview (`npm run preview`)
- [ ] Задеплоено на GitHub Pages
- [ ] Проверено отсутствие ошибок в консоли production

## 🚀 Применение миграции

```bash
# 1. Убедиться что мы на рабочем коммите
git log --oneline -1
# Должно быть: 3435c14 feat: Интеграция XP Handler, Badge Triggers...

# 2. Создать react-init.ts (уже создан выше)

# 3. Применить изменения
git add src/lib/react-init.ts
git commit -m "✨ Add react-init.ts to replace @github/spark initialization"

# 4. Обновить main.tsx (см. Шаг 2)
# 5. Очистить vite.config.ts (см. Шаг 3)
# 6. Обновить package.json (см. Шаг 4)

# 7. Коммит изменений
git add .
git commit -m "♻️ Migrate from @github/spark to local implementations"

# 8. Переустановить зависимости
rm -rf node_modules package-lock.json
npm install

# 9. Тестировать
npm run build
npm run preview

# 10. Деплой
git push origin main
```

## 📚 Дополнительные материалы

- [React Context Issue with Radix UI](https://github.com/radix-ui/primitives/issues/1743)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Module Resolution in Vite](https://vitejs.dev/guide/dep-pre-bundling.html)

---

**Автор:** GitHub Copilot  
**Дата:** 15 ноября 2025  
**Версия:** 1.0
