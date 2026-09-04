# Care@Home – Patienten-App (Prototyp)

Ziel: Vibe-coded Next.js-Prototyp der Care@Home Patienten-App (nur Frontend, Backend simuliert), Deployment über Vercel.
Design-Vorlage: `design/*.dc.html` (Claude-Design-Canvas, erster Entwurf).

## Plan
- [x] Pitch-Deck lesen, Farben und Idee extrahieren
- [x] Design-Entwurf mit Claude Design (7 Artboards) erstellen und speichern
- [x] Design-Durchsicht: Wochentage, Ampel-Widerspruch, Rahmenhöhen, Schriftgrössen korrigiert
- [x] Next.js-App scaffolden (App Router, TypeScript, Tailwind v4)
- [x] Simuliertes Backend (Seed + Zustand im Cookie, Route Handlers, Cookie-Session) – Vercel-tauglich, kein Server-Speicher
- [x] Seiten: Anmelden, Übersicht, Termin buchen, Termin gebucht, Mein Arzt, Besprechung vereinbaren, Meine Gesundheit, Demo-Steuerung
- [x] Build + Lint grün, im Browser geprüft (Playwright-Durchlauf durch alle Abläufe, Screenshots bei 390 px und Desktop)
- [x] Sicherheits-Review und Korrekturen (Header, Cookie-Grenzen, tiefe Cookie-Validierung, Fehlerseite)
- [x] Code-Review und Korrekturen (Datumsfehler, Server-Validierung, Fokus, Touch-Ziele, Radiogruppen, Duplikate)
- [x] README inkl. Vercel-Deployment
- [ ] Git-Repository anlegen und zu GitHub pushen (für Vercel-Import) – auf Wunsch des Nutzers

## Design-Tokens (aus dem Pitch-Deck)
- Blau `#0040F8` (Primär), dunkler Hover `#0030BF`, Fläche `#E8EDFF`, Himmel-Fläche `#ECF9FE`
- Text `#1F2E33`, gedämpft `#5C6F75`, blass `#8A9BA0`, Linie `#D5DDE2`
- Grün `#1B873F` / `#E6F4EA` (Badge-Text `#146B32`), Gelb `#B26A00` / `#FFF4E0`, Rot `#C62828` / `#FDECEC`
- Schrift: Atkinson Hyperlegible (Google Fonts), Fallback Segoe UI / system-ui
- Elderly-first: Grundschrift 18 px, Labels 17 px, Titel 28–30 px, Knöpfe ≥ 60 px, Radius 14–16 px, Rahmen 2 px, Auswahl 3 px blau + Fläche

## Review
- Design-Canvas: https://claude.ai/code/artifact/eab0ae09-9d4a-4e21-96d2-c2dd4399ec23
- Verifiziert: Login (Fehler + Erfolg), Termin buchen → Bestätigung → Absage-Dialog, Mein Arzt → Besprechung (Telefon/Spital) → Bestätigung, Medikament abhaken, alle drei Ampel-Szenarien über `/demo`, Desktop-Ansicht.
- Sicherheit: Security-Header gesetzt, State-Cookie auf max. 10 Termine / 5 Zusatznachrichten begrenzt und bei > 3500 Bytes zurückgesetzt, Cookie-Inhalt bis auf Elementebene validiert (manipuliertes Cookie → Default statt Absturz), Request-Body auf 10 KB begrenzt, `error.tsx` mit «Demo-Daten zurücksetzen».
- Code-Review eingearbeitet: Seed-Termin kann «heute» sein, Besprechung speichert Datum/Uhrzeit (wandert nicht mehr), Server prüft Werktage und Doppelbuchungen, zweite Besprechung wird abgelehnt, Session nur für die Seed-Patientin gültig, Fokus springt auf neue Überschriften, alle Ziele ≥ 60 px, Auswahl als Radiogruppen, `ReviewingCard`/`ArrowLink` gegen Duplikate, Cookie-Optionen zentral.
- Bewusst so gelassen: Demo-Endpunkte ohne Session (damit `/demo` vor dem Login nutzbar bleibt), Abmelden behält den Demo-Zustand (simuliert Server-Daten), Session-Cookie unsigniert (Demo).
- Offen: keine automatisierten Tests (Prototyp); `AGENTS.md`/`CLAUDE.md` wurden von `next dev` generiert (Next 16), können bleiben oder per `agentRules: false` abgeschaltet werden.
