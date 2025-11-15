# ⚡ Быстрый справочник по деплою

## 🚀 Стандартный деплой (3 команды)

```bash
npm run build              # 1. Проверить сборку
git add -A && git commit -m "your message"  # 2. Закоммитить
git push origin main       # 3. Деплой (автоматически)
```

## ✅ Проверка что всё работает

```bash
# Статус деплоя (должно быть "success")
curl -s 'https://api.github.com/repos/johnda7/da-teens-webapp-tele/actions/runs?event=push&per_page=1' | grep conclusion

# Доступность сайта (должно быть HTTP/2 200)
curl -I https://johnda7.github.io/da-teens-webapp-tele/
```

**Или просто открыть:** https://johnda7.github.io/da-teens-webapp-tele/

## ⚠️ Если сайт не работает

### White screen?
```bash
# Проверь base path
grep "base:" vite.config.ts
# Должно: base: '/da-teens-webapp-tele/'
```

### JavaScript ошибки?
```bash
# Проверь react-init
grep "react-init" src/main.tsx
# Должно: import './lib/react-init'
```

### Build падает?
```bash
# Проверь что нет Spark
grep -r "@github/spark" src/
# Не должно быть результатов
```

## 🔄 Откат (если сломалось)

```bash
git reset --hard 8f7542c   # Последний рабочий коммит
git push -f origin main     # Force push
```

## 📊 Текущий статус

✅ Production: https://johnda7.github.io/da-teens-webapp-tele/
✅ Last deploy: 15 Nov 2025, 15:50 UTC
✅ Status: Working без ошибок
✅ Spark: Полностью удалён

## 🆘 Проблемы?

Смотри полную документацию: `docs/DEPLOYMENT.md`
