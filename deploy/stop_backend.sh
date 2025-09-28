set -euo pipefail
SESSION_NAME="is-lab1-backend"
if screen -list | grep -q "$SESSION_NAME"; then
  screen -S "$SESSION_NAME" -X quit || true
  echo "Backend stopped."
else
  echo "Backend screen session not found."
fi
