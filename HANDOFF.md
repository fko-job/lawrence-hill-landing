# Handoff: Lawrence Hill landing page + open house portal

Written 2026-10-19 at the end of a long working session. Read `CLAUDE.md` (project rules, URLs, deploy steps) first; this file is the "where are we and how do we work" layer on top.

## Where we are (one paragraph)

The landing page, the Halloween open house pop-up/raffle, and the private open house portal are **live** on the Hostinger VPS and run exactly the code on branch `dev` (commit `e6f174a`). `main` is 3 commits behind (`ffade16`): merge when the user asks. Confirmation **emails are built but switched off** until Jeffrey enables Authenticated SMTP for `deals@jeffreyshew.com` and the user runs `./set-smtp.sh`.

## What is live (all verified on production)

**Landing page** (`https://jeffreyshew.com/lawrence-hill/`, alias `/lawrencehill/`)
- Removed the "Buyer Representation Advantage" section; fixed the empty gap it left (broker card now lives in the left column on every tab; grid aligned with FAQ).
- First screen has a "Get the price list & incentives" button beside the price; it opens the existing price-list pop-up form (one price-list form on the page, on purpose).
- Fixed: stale hardcoded tour date + dead calendar code removed; newsletter checkboxes are NOT pre-ticked (CASL); darker copper/faint ink for contrast, 12px minimum text, 44px touch targets, FAQ is an h2, no skipped heading levels.
- No secrets in the repo: portal password and Follow Up Boss key fallbacks removed (both come from the VPS `.env` only).

**Halloween open house pop-up** (Oct 24 & 25, 12:30 PM to 4:00 PM)
- Shows once per browser session to everyone EXCEPT QR visitors (`?openhouse` / `#open-house`), after ~1.8 s once the photos are decoded; never shown after 2026-10-26 00:00 Toronto time; never shown again to a browser that already registered (localStorage `lhHwRegistration`).
- Copy: "Register, attend, and participate for a chance to win a $100 gift card!" Fine print: conditions apply, draw in the first week of November, one registration per person.
- Dark card, cobweb behind the text, collage (exterior aerial + 2 Model Suite 62 interiors), brand name shown. Flat colours, no gradients/emoji (taste-skill rules).
- Its button opens the SAME check-in modal the QR opens ("promo" mode = has a close button; QR visitors stay hard-gated, no close button).

**Raffle logic** (server: `POST /api/leads` in `server.js`)
- One record per person: same email OR same phone (last 10 digits). Repeats are not saved, not sent to Follow Up Boss, get no second email (prevents mail-bombing a stranger's address).
- Pop-up route: source `Halloween RSVP (Open House form)` = pre-registered. CRM tags `Open House RSVP` + `Halloween RSVP` (not "Attendee"). Gets entry number `LH-HW-XXXXX` and the dark confirmation screen.
- QR check-in at the venue on Oct 24-25 (Toronto): registers AND marks present; a pre-registered person scanning the QR is marked present on the same record (no duplicate lead/email). Outside those days QR behaves as before (no raffle).
- Email: nodemailer, activates only when `SMTP_HOST/PORT/USER/PASS` + `MAIL_FROM` exist in the VPS `.env`. Without them the page just shows the number.

**Portal** (`/lawrence-hill/openhouse-portal`, HTTP Basic auth, user `jeffrey`; password only in the VPS `.env`, user changed it today)
- Source dropdown per guest (stored as `leadSource`; the original `source` field is untouched because filters/CRM depend on it).
- **Present** checkbox per guest (staff-controlled `presentAt`; live-synced; filter; "N present" count; CSV column). This is the source of truth for who attended. Badges: Pre-registered / Attended + entry number.
- **How they arrived (channel):** the page remembers the visitor's arrival in localStorage `lhArrival` (a tagged link replaces an older one; untagged returns keep it) and sends `channel` + `utm` with every lead. Channels: `Eblast` (`utm_medium=email`), `jeffreyshew.com pop-up` (`?register`), `QR at the venue` (`?openhouse`/`#open-house`), `Other campaign` (any other utm), `Landing page` (default). Server validates against a whitelist, stores `channel`/`utm`, tags the CRM lead `Channel: <name>`. Portal: "via <channel>" badge, channel filter, "By channel" counts; CSV columns Channel + Campaign. Eblast links must keep `utm_medium=email`. Leads from before this change show as Unknown.
- CSV export columns added: Lead Source, Raffle Entry #, Raffle Status, Present.

## Facts about the client to respect

- Jeffrey Shew is a **broker sales representative**, NOT the broker of record or team lead. Never write "broker of record" or "team lead" for him (none left in the site or the eblast as of 2026-10-20). "Broker" as his title on the site is fine.

## Open items (nothing here is done)

1. **SMTP / confirmation emails.** Jeffrey must enable Authenticated SMTP for `deals@jeffreyshew.com` (if MFA is on: an app password). Then the user runs `./set-smtp.sh` in a terminal (interactive; Claude never sees the password) and the container must be RECREATED: `ssh root@187.124.86.103 "cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d --force-recreate"` (a plain `up -d` may not reload `.env`). Then verify with ONE real registration to an address the user gives.
2. **Raffle terms.** Jeffrey/brokerage must approve the wording. In Canada a prize draw usually needs written rules and often a skill-testing question for the winner; not legal advice, not resolved.
3. **Hours mismatch.** Broker card still says "Open Daily: 11:00 AM - 6:00 PM" while the Halloween event is 12:30-4:00 PM. User's call; untouched.
4. **Merge `dev` to `main`** (3 commits: `9ff2c89`, `b580702`, `e6f174a`) when the user says so. Live already runs this code, merging changes nothing in production.
5. **Follow Up Boss cleanup.** Delete the test lead "Reg Test" / `reg@example.com` (created accidentally by a test that used the old hardcoded key). The old key was rotated by the user; it remains in git history (harmless now, revoked).
6. **Before the event:** back up `data/leads.json` on the VPS (`/root/jeffreyshew/campaigns/lawrencehill/data/leads.json`); it is the only store of raffle registrations.
7. **Eblast (Follow Up Boss).** `../../Email Templates/lawrence-hill-eblast-halloween.html` (in `Marketing and Web Engine/Email Templates/`) is the revised email with the raffle block. Pending: the light hero image `public/assets/email/hero-exterior-900.jpg` must be deployed BEFORE the email is sent (the email points at its live URL); the brokerage mailing address and an unsubscribe link (CASL) must be added or confirmed (send a test from FUB to see if it adds them); the user must say whether the `%contact_first_name%` problem persists (cause not confirmed: sent from FUB or another tool? pasted formatting? blank first names?). Raffle terms still pending approval.
8. Optional: `.impeccable/` (critique archive) and 6 `public/screenshot-*.png` files are untracked; the screenshots must NEVER be deployed (rsync excludes them). Optional skills the user asked about but did not install: `make-interfaces-feel-better`, `transitions.dev`. Impeccable has an update (4.7.0) not installed.

## How we work (agreements from this session)

- **Never commit, push, deploy, merge or touch the VPS without the user saying so.** The pattern that worked: finish + test locally -> end the turn asking "commit & deploy?" -> user answers -> do exactly that. Deploys are small, one change at a time.
- Work on `dev`; `main` only on request. Git user is Franco Amador (`fko-job` account). End commits with the Co-Authored-By line from the session reminder.
- **Deploy recipe** (the old handoff's rsync flattened `public/` and `private/`; use this):
  ```bash
  git push origin dev
  R=root@187.124.86.103:/root/jeffreyshew/campaigns/lawrencehill
  rsync -rcni --exclude 'screenshot-*.png' public/ $R/public/    # DRY RUN first: only expected files?
  rsync -avzc server.js package.json package-lock.json $R/
  rsync -avzc private/ $R/private/
  rsync -avzc --exclude 'screenshot-*.png' public/ $R/public/
  ssh root@187.124.86.103 "cd /root/jeffreyshew/campaigns/lawrencehill && docker compose up -d --build"
  ```
  Then verify live with curl: page 200, new strings present, protected routes 401 without auth, container healthy, `docker logs | grep -ci error` = 0. **Never submit real registrations/leads on production** (they go to Follow Up Boss); ask the user to try one.
- **Secrets**: only in the VPS `.env`. Helper scripts the user runs themselves in a terminal (silent prompts): `set-portal-password.sh`, `set-fub-key.sh`, `set-smtp.sh`. Never ask for or echo passwords/keys in chat. Never alter MX/SPF/DKIM/DMARC (Microsoft 365).
- **Local testing**: copy `public/`, `private/`, `server.js` into a scratch folder with a symlinked `node_modules`, run on port 3998 with `env -u FUB_API_KEY` (no key = no CRM calls) and `OPENHOUSE_ADMIN_PASS=pw`. For mail, use a tiny local SMTP sink (plain-text; test copy of `server.js` with `requireTLS:false`). For in-window raffle tests, test copy with the window start moved to today.
- **Environment quirks**: Claude Code runs in the desktop app on Linux; there is no `claude` CLI on the shell PATH, so `/plugin ...` commands are typed by the user in the chat box. The project path exists under two mounts (`.../Users/Franco Amador/...` and `.../Documents and Settings/Franco Amador/...`); both work. `pkill -f "node server.js"` kills your own shell: kill by port via `ss -ltnp`. The preview browser pane does not animate smooth scrolling and screenshots often catch fade-ins mid-way (take a second one); a page opened as `http://user:pass@host` makes `fetch` fail ("URL includes credentials"): navigate to the plain URL after logging in.
- **Design**: warm stone ground, ink, bronze/copper accent, Playfair Display + Karla; flat colours, no gradients, no emoji, headlines <= 2 lines, 16px body text. Installed skills: ponytail (level `full`), taste-skill, impeccable, claude-seo, frontend-design (+ marketingskills via `npx skills`). The critique workflow (impeccable) runs two isolated sub-agents.
- **Global rule** (`~/.claude/CLAUDE.md`): delegate generation/QA to the local Qwen2.5-Coder-14B (llama.cpp on `127.0.0.1:8080`, MCP server `local-llama` with `delegate_code_task` / `local_code_qa`), then QA twice; treat its verdicts as one signal (it answers in Spanish and sometimes degenerates into repetition; ignore everything after the first verdicts).
- The user communicates in English, prefers short plain explanations, and wants to be told plainly what was NOT verified.

## Quick map

```
server.js                  Express app: /api/leads (raffle, dedupe, CRM), portal API + SSE, CSV, SMTP
public/index.html|styles.css|app.js   landing page (pop-up, check-in modal, forms)
private/openhouse-portal.html         portal (Present, Source, badges)
data/leads.json            lead store (gitignored; bind-mounted into the container from the app dir on the VPS)
set-*.sh                   run-by-user scripts that write secrets to the VPS .env
CLAUDE.md                  rules + URLs + raffle summary;  HANDOFF.md  this file
```

VPS: `root@187.124.86.103`, app dir `/root/jeffreyshew/campaigns/lawrencehill/`, container `lawrencehill-app`, Traefik + Let's Encrypt. Repo: `git@github.com:fko-job/lawrence-hill-landing.git`.
