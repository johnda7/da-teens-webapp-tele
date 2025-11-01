#!/bin/bash

# Скрипт для исправления конфликтов портов между проектами
# Использование: ./scripts/fix-ports.sh

echo "🔍 Проверка занятых портов..."

# Проверяем порты
DA_TEENS_PORT=5001
PHUKET_PORT=5000  # или 8080

# Проверяем, занят ли порт da-teens
if lsof -Pi :$DA_TEENS_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Порт $DA_TEENS_PORT (da-teens-webapp-tele) - ЗАНЯТ"
    PID=$(lsof -ti:$DA_TEENS_PORT)
    echo "   Процесс PID: $PID"
else
    echo "❌ Порт $DA_TEENS_PORT (da-teens-webapp-tele) - СВОБОДЕН"
fi

# Проверяем, занят ли порт phuket
if lsof -Pi :$PHUKET_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Порт $PHUKET_PORT (phuket-telegram-shop) - ЗАНЯТ"
    PID=$(lsof -ti:$PHUKET_PORT)
    echo "   Процесс PID: $PID"
else
    echo "❌ Порт $PHUKET_PORT (phuket-telegram-shop) - СВОБОДЕН"
fi

echo ""
echo "📋 Текущие процессы Vite:"
ps aux | grep -E "vite|node.*dev" | grep -v grep | head -5

echo ""
echo "🔧 Если нужно освободить порты, выполните:"
echo "   pkill -9 -f vite"
echo ""
echo "📝 Настройки портов:"
echo "   • da-teens-webapp-tele: порт выбирается автоматически (обычно 5000 или 5001)"
echo "   • phuket-telegram-shop: порт 5000 или 8080"
