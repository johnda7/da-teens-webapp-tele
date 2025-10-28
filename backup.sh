#!/bin/bash
# 🛡️ Скрипт автоматического бэкапа перед важными изменениями

BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"

echo "🔄 Создаем backup ветку: $BACKUP_BRANCH"

# Создать локальную backup ветку
git branch $BACKUP_BRANCH

# Отправить на GitHub
git push origin $BACKUP_BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Backup успешно создан: $BACKUP_BRANCH"
    echo "📍 Восстановить можно командой: git checkout $BACKUP_BRANCH"
else
    echo "❌ Ошибка при создании backup"
    exit 1
fi

