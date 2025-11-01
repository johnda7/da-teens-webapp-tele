#!/bin/bash

echo "🔍 Диагностика локального сервера da-teens-webapp-tele..."
echo ""

# Проверка процесса
if ps aux | grep -E "vite.*da-teens|node.*vite.*da-teens" | grep -v grep > /dev/null; then
    echo "✅ Сервер запущен"
    ps aux | grep -E "vite.*da-teens|node.*vite.*da-teens" | grep -v grep | head -1
else
    echo "❌ Сервер НЕ запущен"
    echo "   Запуск: npm run dev"
fi

echo ""

# Проверка порта - ищем на каком порту работает наш сервер
DA_TEENS_PORT=""
for port in 5000 5001 5173 5174; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -ti:$port | head -1)
        if ps -p $PID 2>/dev/null | grep -q vite; then
            echo "✅ Порт $port занят Vite сервером (PID: $PID)"
            DA_TEENS_PORT=$port
        fi
    fi
done

if [ -z "$DA_TEENS_PORT" ]; then
    echo "❌ Не найден работающий Vite сервер"
else
    echo ""
    # Проверка доступности
    if curl -s http://localhost:$DA_TEENS_PORT/da-teens-webapp-tele/ > /dev/null 2>&1; then
        echo "✅ Сервер отвечает на http://localhost:$DA_TEENS_PORT/da-teens-webapp-tele/"
    else
        echo "❌ Сервер НЕ отвечает на HTTP запросы"
    fi
fi

echo ""
echo "📋 Последние 10 строк логов:"
tail -10 /tmp/vite*.log 2>/dev/null | tail -10 || echo "   Логи не найдены"

echo ""
echo "💡 Используй: ./scripts/fix-ports.sh для подробной диагностики"

echo "📋 Последние 10 строк логов:"
tail -10 /tmp/vite*.log 2>/dev/null | tail -10 || echo "   Логи не найдены"

echo ""
echo "💡 Используй: ./scripts/fix-ports.sh для подробной диагностики"
