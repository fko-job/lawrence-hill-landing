# Lawrence Hill Urban Towns: landing page + open-house portal

Node/Express app (`server.js`, `public/`, `private/`), Docker, behind Traefik on a Hostinger VPS.

## Repo and branches
- Remote: `git@github.com:fko-job/lawrence-hill-landing.git` (account `fko-job`). Git user: Franco Amador.
- Work on `dev`; merge to `main` only after the user verifies. Check out `dev` before editing.

## URLs
- Landing: https://jeffreyshew.com/lawrence-hill/ (alias `/lawrencehill/`); QR open-house URL adds `?openhouse=true`
- Private attendee register: `/lawrence-hill/openhouse-portal` (HTTP Basic auth, live updates via SSE `/api/openhouse/stream`, CSV at `/api/openhouse/export-csv`)
- Credentials are NOT stored here: read `OPENHOUSE_ADMIN_PASS` from the server `.env`; ask the user if needed.

## Hard rules
- Never change MX/SPF/DKIM/DMARC DNS records (email is Microsoft 365).
- Follow Up Boss: every incoming lead is assigned to Jeffrey Shew (`assignedUserId: 1`), never user 4 (Franco). Tag `jeffreyshew-website`; source `Lawrence Hill Urban Towns` / `Open House QR Check-In`.
- Never commit secrets. Ask before any deploy, SSH or `docker compose` run on the VPS (it is live).

## Server (Hostinger VPS, Ubuntu 24.04)
- `root@187.124.86.103` (key `~/.ssh/id_ed25519`), app dir `/root/jeffreyshew/campaigns/lawrencehill/`, container `lawrencehill-app` (port 3000), Docker network `proxy-network`.

## Deploy (only when the user says so)
```bash
git push origin dev
rsync -avz --exclude '.git' --exclude 'node_modules' --exclude 'data' \
  server.js private/ public/ root@187.124.86.103:/root/jeffreyshew/campaigns/lawrencehill/
ssh root@187.124.86.103 "cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d --build"
```
`verify-qa.mjs` is the existing QA script.

## Design/SEO (Canadian real estate)
Use the installed taste-skill, impeccable, frontend-design and claude-seo skills. Landing pages run Google/Meta ads: mobile-first, fast, clear lead form; include brokerage/REALTOR® disclosures and CASL/PIPEDA consent on forms.
