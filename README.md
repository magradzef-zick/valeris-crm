# Valeris CRM

Internal CRM for the Valeris team — managing leads, companies, contacts, and projects for a consultancy specialising in India↔Poland trade facilitation.

## Architecture

```
Browser → Next.js (App Router) → /api/crm proxy → Google Apps Script → Google Sheets
```

The Apps Script is the sole backend. The Next.js frontend never accesses Google Sheets directly. `APPS_SCRIPT_URL` is a server-side environment variable — never `NEXT_PUBLIC_`.

Full setup guide: `../docs/crm-setup.md`

## Development

```bash
cp .env.local.example .env.local  # fill in APPS_SCRIPT_URL
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

All three must pass with zero errors before committing.

## Milestones

| Milestone | Status | Description |
|-----------|--------|-------------|
| M0 | ✓ | Foundation & Auth — login, session, app shell |
| M1 | ✓ | Leads — list, detail, status updates, timeline |
| M2 |   | Companies & Contacts |
| M3 |   | Projects, Tasks, Dashboard |
| M4 |   | Team management, Settings, Polish |
