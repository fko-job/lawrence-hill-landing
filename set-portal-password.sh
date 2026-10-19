#!/usr/bin/env bash
# Sets OPENHOUSE_ADMIN_PASS in the local .env and the VPS .env, then checks both match.
# Only that one line is touched; other variables (FUB keys etc.) are kept. Does NOT restart the container.
set -euo pipefail

VPS=root@187.124.86.103
REMOTE_ENV=/root/jeffreyshew/campaigns/lawrencehill/.env
LOCAL_ENV="$(cd "$(dirname "$0")" && pwd)/.env"

read -rsp "New portal password: " PASS; echo
read -rsp "Repeat it: " PASS2; echo
[ -n "$PASS" ] && [ "$PASS" = "$PASS2" ] || { echo "Empty or not matching. Nothing changed."; exit 1; }

touch "$LOCAL_ENV"; chmod 600 "$LOCAL_ENV"
{ grep -v '^OPENHOUSE_ADMIN_PASS=' "$LOCAL_ENV" || true; printf 'OPENHOUSE_ADMIN_PASS=%s\n' "$PASS"; } > "$LOCAL_ENV.tmp"
mv "$LOCAL_ENV.tmp" "$LOCAL_ENV"; chmod 600 "$LOCAL_ENV"

printf '%s\n' "$PASS" | ssh "$VPS" "f=$REMOTE_ENV; touch \$f; chmod 600 \$f; read -r p; { grep -v '^OPENHOUSE_ADMIN_PASS=' \$f || true; printf 'OPENHOUSE_ADMIN_PASS=%s\n' \"\$p\"; } > \$f.tmp && mv \$f.tmp \$f"

L=$(grep '^OPENHOUSE_ADMIN_PASS=' "$LOCAL_ENV" | sha256sum | cut -c1-12)
R=$(ssh "$VPS" "grep '^OPENHOUSE_ADMIN_PASS=' $REMOTE_ENV | sha256sum | cut -c1-12")
[ "$L" = "$R" ] && echo "OK: local and VPS passwords match." || { echo "MISMATCH: check both files."; exit 1; }
echo "Not restarted. When ready: ssh $VPS 'cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d'"
