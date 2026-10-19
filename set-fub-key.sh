#!/usr/bin/env bash
# Sets FUB_API_KEY in the VPS .env only (not local, so local tests never touch the live CRM).
# Checks the key against Follow Up Boss (read-only /v1/me call) before saving. Does NOT restart the container.
set -euo pipefail

VPS=root@187.124.86.103
REMOTE_ENV=/root/jeffreyshew/campaigns/lawrencehill/.env

read -rsp "New Follow Up Boss API key: " KEY; echo
KEY=$(printf %s "$KEY" | tr -d "[:space:]\"'")   # drop stray spaces/newlines/quotes from pasting
[ -n "$KEY" ] || { echo "Empty. Nothing changed."; exit 1; }
echo "Key length: ${#KEY} characters, starts with ${KEY:0:4}"

CODE=$(printf 'user = "%s:"\n' "$KEY" | curl -s -o /dev/null -w '%{http_code}' -K - https://api.followupboss.com/v1/me)
[ "$CODE" = "200" ] || { echo "Follow Up Boss rejected the key (HTTP $CODE). Nothing changed."; exit 1; }
echo "Key accepted by Follow Up Boss."

printf '%s\n' "$KEY" | ssh "$VPS" "f=$REMOTE_ENV; cp \$f \$f.bak; chmod 600 \$f.bak; read -r k; { grep -v '^FUB_API_KEY=' \$f || true; printf 'FUB_API_KEY=%s\n' \"\$k\"; } > \$f.tmp && chmod 600 \$f.tmp && mv \$f.tmp \$f"

[ "$(ssh "$VPS" "grep '^FUB_API_KEY=' $REMOTE_ENV | tail -c 5")" = "${KEY: -4}" ] \
  && echo "OK: VPS .env updated (key ends in ${KEY: -4}). Backup: $REMOTE_ENV.bak" \
  || { echo "MISMATCH: check $REMOTE_ENV"; exit 1; }
echo "Not restarted. Restart when ready: ssh $VPS 'cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d'"
