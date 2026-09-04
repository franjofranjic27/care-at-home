# Care@Home – Patienten-App (Prototyp)

Vibe-coded Next.js-Prototyp der Care@Home Patienten-App (Hospital-at-Home in der Schweiz).
Nur Frontend; das Backend ist simuliert. Sprache: Deutsch (Schweiz), Sie-Form, kurze Sätze.
Zielgruppe sind ältere Menschen – grosse Schrift, grosse Knöpfe, ein Thema pro Bildschirm.

## Starten

```bash
npm install
npm run dev
```

Danach `http://localhost:3000` öffnen.

- `npm run lint` – ESLint
- `npm run build` – Produktions-Build
- `npm start` – gebaute App starten

## Demo-Login

- AHV-Nummer: beliebig (nicht leer)
- PIN: `1234`

## Demo-Steuerung

Unter `/demo` (Link unten auf der Anmeldeseite) lassen sich die drei Ampel-Zustände auslösen:

| Knopf               | Wirkung                                                    |
| ------------------- | ---------------------------------------------------------- |
| Arzt prüft gerade   | Blaue, pulsierende Karte auf der Übersicht und unter «Mein Arzt» |
| Werte sind gut      | Neue grüne Nachricht, Ampel grün                           |
| Besprechung nötig   | Neue gelbe Nachricht mit «Termin auswählen», Ampel gelb    |
| Daten zurücksetzen  | Löscht den Demo-Zustand, Seed-Daten gelten wieder          |

## Backend simuliert (kein Server-Speicher)

Es gibt keine Datenbank und keinen echten Server. Die Route Handlers unter `src/app/api/`
setzen Seed-Daten (`src/server/seed.ts`) mit einem kleinen Delta-Zustand zusammen.

Dieser Zustand liegt **nicht im Speicher des Servers**, sondern in einem httpOnly-Cookie
(`cah_state`, base64url-kodiertes JSON, 7 Tage gültig). Damit funktioniert die App auch auf
Serverless-Plattformen mit mehreren Instanzen und Cold Starts. Der Zustand ist pro Browser;
«Daten zurücksetzen» löscht das Cookie. Die Session ist ein separates Cookie (`cah_session`).

Alle Termine, Slots und Nachrichten werden relativ zum heutigen Datum berechnet
(Zeitzone Europe/Zurich).

## Deployment auf Vercel

1. Repository bei Vercel importieren (Framework-Preset «Next.js» wird erkannt).
2. Keine Umgebungsvariablen nötig.
3. Deploy. Standard-Build (`next build`) reicht; keine `vercel.json` erforderlich.

Hinweis: Der Demo-Zustand liegt pro Browser im Cookie und hält etwa 7 Tage.
Die Seiten im geschützten Bereich lesen Cookies und sind deshalb dynamisch – das ist gewollt.

## Design

Der erste Entwurf wurde mit Claude Design erstellt und liegt als Canvas unter
https://claude.ai/code/artifact/eab0ae09-9d4a-4e21-96d2-c2dd4399ec23.
Die Arbeitsdateien dazu liegen in `design/` (`*.dc.html` je Bildschirm, `canvas.json` für die Anordnung).
Farben stammen aus dem Pitch-Deck: Blau `#0040F8` auf Weiss, Text `#1F2E33`, Flächen `#E8EDFF`.

## Struktur

```
src/
  app/
    layout.tsx            Root-Layout (lang="de-CH", Schrift Atkinson Hyperlegible)
    globals.css           Tailwind v4 mit Design-Tokens (@theme)
    login/                Anmelden
    demo/                 Demo-Steuerung
    (app)/                Geschützter Bereich (Layout leitet ohne Session nach /login um)
      page.tsx            Übersicht
      termin/             Termin buchen, termin/bestaetigt
      arzt/               Mein Arzt, arzt/besprechung
      gesundheit/         Meine Gesundheit
    api/                  Route Handlers (JSON)
  components/
    icons.tsx             Inline-SVG-Icons aus der Design-Vorlage
    ui/                   Button, Card, BackLink, SectionLabel, OptionCard, StatusBadge, …
    layout/               Screen (zentrierte Spalte), BrandLogo
    dashboard/, appointments/, doctor/, consultation/, health/, auth/, demo/
  lib/
    api.ts                fetch-Client für die API-Routen (Client-Komponenten)
    dates.ts              Datumsberechnung und -formatierung (de-CH, Europe/Zurich)
    labels.ts             Deutsche Bezeichnungen für Domänenwerte
    session.ts            Session-Cookie lesen/kodieren
  server/
    domain.ts             Domänentypen
    seed.ts               Seed-Daten, relativ zu «heute»
    state.ts              Cookie-Zustand (DemoState) lesen/schreiben
    store.ts              Queries (Ansichtsdaten) und Reducer (Mutationen)
    validation.ts         Eingaben der API prüfen
    http.ts               Gemeinsame Bausteine der Route Handlers
design/                   Design-Entwurf (Claude-Design-Canvas: *.dc.html, canvas.json)
```

## API (Kurzübersicht)

| Methode | Pfad                                | Zweck                                   |
| ------- | ----------------------------------- | --------------------------------------- |
| POST    | `/api/login`                        | `{insuranceNumber, pin}` → Session-Cookie |
| POST    | `/api/logout`                       | Session löschen                         |
| GET     | `/api/me`                           | Patientin + Zusammenfassung             |
| GET/POST| `/api/appointments`                 | Termine lesen / `{type, date, slot}` buchen |
| DELETE  | `/api/appointments/[id]`            | Termin absagen                          |
| GET     | `/api/doctor`                       | Ärztin, Status, Nachrichten             |
| POST    | `/api/doctor/messages/[id]/read`    | Nachricht als gelesen markieren         |
| GET     | `/api/consultations/slots`          | Besprechungs-Slots                      |
| POST    | `/api/consultations`                | `{slotId, channel}` Besprechung vereinbaren |
| GET     | `/api/health`                       | Werte + Medikamente                     |
| POST    | `/api/medications/[id]/taken`       | `{taken: boolean}`                      |
| POST    | `/api/demo/scenario`                | `{scenario: 'reviewing' \| 'good' \| 'consultation'}` |
| POST    | `/api/demo/reset`                   | Demo-Zustand zurücksetzen               |
