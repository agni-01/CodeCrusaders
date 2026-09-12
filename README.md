# CampusPulse — VIT Unified Campus News Aggregator

A single feed that brings together official announcements, community chatter, and club updates from across VIT Vellore — so students stop missing workshops, deadlines, and events scattered across a dozen different platforms.

## The Problem

VIT students currently have to check multiple disconnected sources to stay updated:
- **vit.ac.in/news** for official announcements
- **r/vit** for real, student-driven ground truth
- **Dozens of club/chapter Instagram pages** (CodeChef VIT, ACM VIT, etc.) for workshops and events
- **VTOP** for academic deadlines

Nothing ties these together. Students miss events they'd genuinely want to attend simply because the information lives in the wrong place at the wrong time.

## What This Does

CampusPulse aggregates all of the above into one unified, filterable feed — and, critically, **labels every item by source reliability** so students know what's official, what's club-verified, and what's community-sourced.

## Data Sources & Trust Tiers

| Tier | Source | Method | Badge |
|------|--------|--------|-------|
| Official | vit.ac.in/news | Live scraper (Python + BeautifulSoup) | 🟢 Official |
| Club | CodeChef VIT, ACM VIT, and other chapter Instagram pages | Manually curated cache (demo), Instagram Graph API opt-in (production) | 🔵 Club |
| Community | r/vit | Reddit API (PRAW) + keyword-based relevance filtering | 🟡 Community |
| Academic | Exam/deadline data | Simulated/mock data (standing in for VTOP integration) | 🟣 Academic |

## Key Features

- **Unified feed** — all sources in one scrollable, filterable timeline
- **Source-tier badges** — instantly see what's official vs. community-sourced
- **Category filters** — Academic / Club / Community / Workshops
- **Clash detection** — flags when an event overlaps with an exam or deadline
- **Keyword-filtered Reddit feed** — cuts through memes and rants to surface genuine event/deadline posts

## Tech Stack

- **Frontend:** HTML/CSS/JS (or React)
- **Backend/Database:** Firebase (Firestore + Hosting)
- **Scraping:** Python (`requests` + `BeautifulSoup`) for vit.ac.in/news
- **Reddit integration:** Python (`PRAW`) via Reddit's official API
- **Club data:** Manually curated for demo; Instagram Graph API planned for production

## Data Model (Firestore — `events` collection)

```
{
  title: string,
  date: string,
  source: string,        // e.g. "vit.ac.in", "r/vit", "CodeChef VIT"
  source_type: string,    // "Official" | "Club" | "Community" | "Academic"
  category: string,       // "Workshop" | "Deadline" | "Fest" | "Announcement" ...
  link: string,
  description: string
}
```

## Known Limitations (by design, for this prototype)

- **VTOP integration is simulated**, not live. VTOP has no public API, and scraping it would require student credentials — a security risk we're not willing to take on for a prototype. Production would need an official SSO/API partnership with VIT.
- **Instagram data is manually curated**, not live-scraped. Instagram's ToS blocks scraping; live sync would require each club to opt in via Instagram's official Graph API.
- **Reddit filtering is keyword-based** in this version — a relevance classifier (simple LLM call) is a planned upgrade.

## Roadmap

- [ ] Phase 1: Firebase setup + feed UI skeleton
- [ ] Phase 2: vit.ac.in/news scraper (live)
- [ ] Phase 3: r/vit integration + keyword filtering
- [ ] Phase 4: Club Instagram data (curated cache)
- [ ] Phase 5: Clash detection + personalized category filtering
- [ ] Phase 6: Polish, badge styling, demo rehearsal

## Team

Built by a first-year CSE team - CodeCrusaders, at VIT Vellore for IEEE-CS Hackathon - HackBattle.
