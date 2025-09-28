set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/is-lab1}"
BACK_DIR="$APP_DIR/current/backend"
FRONT_DIR="$APP_DIR/current/frontend/dist"
LOG_DIR="$APP_DIR/logs"
SESSION_NAME="is-lab1-backend"

mkdir -p "$LOG_DIR"

# Остановить старую screen-сессию, если есть
if screen -list | grep -q "$SESSION_NAME"; then
  screen -S "$SESSION_NAME" -X quit || true
fi

# Запустить новую
screen -S "$SESSION_NAME" -dm bash -lc "
  cd '$BACK_DIR' && \
  export DB_USER='${DB_USER:-}' DB_PASS='${DB_PASS:-}' SPRING_PROFILES_ACTIVE=helios && \
  nohup java -Xms256m -Xmx512m -jar app.jar \
    --spring.profiles.active=helios \
    --server.port=8080 \
    --spring.web.resources.static-locations=file:$FRONT_DIR/ \
    > '$LOG_DIR/backend.out' 2>&1
"
echo 'Backend started in screen session: '"$SESSION_NAME"
