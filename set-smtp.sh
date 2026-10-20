#!/usr/bin/env bash
# Saves the mailbox used for Halloween raffle confirmation emails into the VPS .env (not the local one).
# Tests the login first (no email is sent). Replaces only the SMTP_* / MAIL_FROM lines. Does NOT restart the container.
# Microsoft 365: the mailbox needs "Authenticated SMTP" enabled by an admin; if MFA is on, use an app password.
# No DNS records (MX/SPF/DKIM/DMARC) are touched.
set -euo pipefail

VPS=root@187.124.86.103
REMOTE_ENV=/root/jeffreyshew/campaigns/lawrencehill/.env
cd "$(dirname "$0")"

read -rp "SMTP host [smtp.office365.com]: " HOST; HOST=${HOST:-smtp.office365.com}
read -rp "SMTP port [587]: " PORT; PORT=${PORT:-587}
read -rp "Mailbox (login email, e.g. jeffrey@jeffreyshew.com): " USER_
read -rsp "Mailbox password or app password: " PASS; echo
[ -n "$USER_" ] && [ -n "$PASS" ] || { echo "Missing mailbox or password. Nothing changed."; exit 1; }
read -rp "From name [Jeffrey Shew | Lawrence Hill]: " FROMNAME; FROMNAME=${FROMNAME:-Jeffrey Shew | Lawrence Hill}
FROM="$FROMNAME <$USER_>"

echo "Testing the login (no email is sent)..."
SMTP_HOST="$HOST" SMTP_PORT="$PORT" SMTP_USER="$USER_" SMTP_PASS="$PASS" node --input-type=module -e '
import nodemailer from "nodemailer";
const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), secure: false, requireTLS: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
try { await t.verify(); console.log("Login accepted."); } catch (e) { console.error("Login rejected:", e.message); process.exit(1); }
'

printf '%s\n%s\n%s\n%s\n%s\n' "$HOST" "$PORT" "$USER_" "$PASS" "$FROM" | ssh "$VPS" "f=$REMOTE_ENV; cp \$f \$f.bak; chmod 600 \$f.bak; read -r h; read -r p; read -r u; read -r w; read -r m; { grep -v -E '^(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS|MAIL_FROM)=' \$f || true; printf 'SMTP_HOST=%s\nSMTP_PORT=%s\nSMTP_USER=%s\nSMTP_PASS=%s\nMAIL_FROM=%s\n' \"\$h\" \"\$p\" \"\$u\" \"\$w\" \"\$m\"; } > \$f.tmp && chmod 600 \$f.tmp && mv \$f.tmp \$f"

echo "OK: saved to $REMOTE_ENV (mailbox $USER_). Backup: $REMOTE_ENV.bak"
echo "Not restarted. Restart when ready: ssh $VPS 'cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d --force-recreate'"
