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
rsync `public/` and `private/` into their own subfolders (a bare `rsync public/ private/ dest/` flattens them into the app root). Dry-run first (`-n`); exclude `screenshot-*.png`.
```bash
git push origin dev
R=root@187.124.86.103:/root/jeffreyshew/campaigns/lawrencehill
rsync -avzc server.js package.json package-lock.json $R/
rsync -avzc private/ $R/private/
rsync -avzc --exclude 'screenshot-*.png' public/ $R/public/
ssh root@187.124.86.103 "cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d --build"
```
`verify-qa.mjs` is the existing QA script. Secrets live only in the VPS `.env` (use `set-portal-password.sh`, `set-fub-key.sh`, `set-smtp.sh`).

## Halloween open house raffle (Oct 24-25, 12:30-4:00 PM)
- $100 gift card draw, first week of November, for guests who register AND attend. Conditions apply (wording needs brokerage/legal sign-off).
- Two routes, ONE form (the QR check-in modal) and ONE record per person (same email OR phone):
  - Pop-up button -> check-in modal (dismissable) -> source `Halloween RSVP (Open House form)`: pre-registered, CRM tag `Open House RSVP` + `Halloween RSVP`, then the dark confirmation screen with entry number `LH-HW-XXXXX`.
  - QR check-in at the venue on Oct 24-25 (Toronto time): registers AND marks attended; a pre-registered person scanning the QR is marked attended on the same record (no new lead, no second email).
- Repeat attempts are not saved, not sent to the CRM, get no second email. Portal shows "Pre-registered" / "Attended" + entry number; CSV has Raffle Entry # and Raffle Status.
- Confirmation email via SMTP (`SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM` in the VPS `.env`, see `set-smtp.sh`); without them no email is sent and the page just shows the number.

## Design/SEO (Canadian real estate)
Use the installed taste-skill, impeccable, frontend-design and claude-seo skills. Landing pages run Google/Meta ads: mobile-first, fast, clear lead form; include brokerage/REALTOR® disclosures and CASL/PIPEDA consent on forms.
