# Care@Home – Patienten-App (Prototyp)

Vibe-coded Next.js-Prototyp der Care@Home Patienten-App (Hospital-at-Home in der Schweiz).
Nur Frontend; das Backend ist simuliert. Zweisprachig: Deutsch (Schweiz) und Englisch, Sie-Form, kurze Sätze.
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

## Sprache (i18n)

Die App ist auf Deutsch und Englisch verfügbar (`next-intl`, ohne Sprachpräfix in der URL –
`/`, `/termin`, … bleiben unverändert). Die Sprache wird pro Anfrage bestimmt, in dieser Reihenfolge:

1. Cookie `cah_locale` (`de` | `en`) – gesetzt über den Sprachumschalter (`POST /api/locale`)
2. `Accept-Language` des Browsers – Einträge nach Gewicht (`q`) sortiert, der erste mit unterstützter
   Hauptsprache gewinnt (`de-CH` → `de`; nicht unterstützte Sprachen wie `fr` werden übersprungen)
3. Standard: `en`

Der Sprachumschalter zeigt immer die jeweils andere Sprache («English» auf Deutsch, «Deutsch» auf Englisch)
und sitzt auf der Anmeldeseite oben rechts im blauen Kopf sowie in der Übersicht neben «Abmelden».
Das Cookie gilt ein Jahr; `<html lang>`, Titel/Beschreibung und Datumsformate folgen der Sprache
(`de` → `de-CH`, `en` → `en-GB`, Zeitzone immer Europe/Zurich).

Dateien:

- `messages/de.json`, `messages/en.json` – alle Texte, nach Namespaces gegliedert
  (`common`, `login`, `dashboard`, `appointment`, `doctor`, `consultation`, `health`, `demo`, `error`, `labels`).
  Unter `labels` liegen die Bezeichnungen der Domänenwerte (Terminarten, Zeitfenster, Kanäle, Werte, …),
  unter `error.api` die Fehlermeldungen der API.
- `src/i18n/config.ts` – `LOCALES`, `DEFAULT_LOCALE`, `LOCALE_COOKIE`, Zuordnung zu den `Intl`-Locales
- `src/i18n/negotiate.ts` – Auswertung von `Accept-Language`
- `src/i18n/request.ts` – `getRequestConfig` (liest Cookie und Header, lädt die Messages)
- `src/i18n/global.ts` – Typisierung der Übersetzungsschlüssel und ICU-Argumente gegen `messages/en.json`
- `src/components/LanguageSwitcher.tsx`, `src/app/api/locale/route.ts`

Eine Sprache ergänzen:

1. `messages/<code>.json` anlegen (gleiche Struktur wie `en.json`; fehlende Schlüssel meldet TypeScript nicht,
   next-intl fällt zur Laufzeit auf den Schlüssel zurück – deshalb vollständig übersetzen).
2. `LOCALES` und die `Intl`-Zuordnung in `src/i18n/config.ts` erweitern; den Sprachnamen unter
   `common.languages.<code>` in allen Message-Dateien ergänzen.
3. Bei mehr als zwei Sprachen schaltet der Umschalter reihum durch `LOCALES`.

Hinweis: Der simulierte Store ist sprachunabhängig. Die API liefert deshalb Rohdaten statt Texten – z. B.
`kind` und `context` bei Arzt-Nachrichten, `id`/`values` bei Werten, `specialty: "cardiology"` bei der Ärztin.
Übersetzt wird erst in den Komponenten. Nur die Fehlermeldungen (`error` im JSON) kommen bereits in der
Sprache der Anfrage.

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
    layout.tsx            Root-Layout (lang je Sprache, NextIntlClientProvider, Schrift Atkinson Hyperlegible)
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
    LanguageSwitcher.tsx  Sprachumschalter (zeigt die jeweils andere Sprache)
    icons.tsx             Inline-SVG-Icons aus der Design-Vorlage
    ui/                   Button, Card, BackLink, SectionLabel, OptionCard, StatusBadge, …
    layout/               Screen (zentrierte Spalte), BrandLogo
    dashboard/, appointments/, doctor/, consultation/, health/, auth/, demo/
  lib/
    api.ts                fetch-Client für die API-Routen (Client-Komponenten)
    dates.ts              Datumsberechnung (sprachunabhängig) und -formatierung je Sprache (Europe/Zurich)
    numbers.ts            Zahlen je Sprache formatieren (Messwerte)
    greeting.ts           Tageszeit für die Begrüssung
    labels.ts             Sprachunabhängige Konstanten (Notfallnummer, Hilfe-Hotline)
    useErrorMessage.ts    Hook: API-Fehler in eine anzeigbare Meldung übersetzen
    session.ts            Session-Cookie lesen/kodieren
  i18n/
    config.ts             Sprachen, Cookie-Name, Intl-Zuordnung
    negotiate.ts          Accept-Language auswerten
    request.ts            next-intl-Request-Konfiguration
    global.ts             Typisierung der Übersetzungsschlüssel
messages/
  de.json, en.json        Alle Texte je Sprache
  server/
    domain.ts             Domänentypen
    seed.ts               Seed-Daten, relativ zu «heute»
    state.ts              Cookie-Zustand (DemoState) lesen/schreiben
    store.ts              Queries (Ansichtsdaten) und Reducer (Mutationen)
    validation.ts         Eingaben der API prüfen
    errors.ts             HTTP-Fehler mit Übersetzungsschlüssel (`error.api.*`)
    http.ts               Gemeinsame Bausteine der Route Handlers, übersetzt Fehler in der Sprache der Anfrage
design/                   Design-Entwurf (Claude-Design-Canvas: *.dc.html, canvas.json)
```

## API (Kurzübersicht)

| Methode | Pfad                                | Zweck                                   |
| ------- | ----------------------------------- | --------------------------------------- |
| POST    | `/api/login`                        | `{insuranceNumber, pin}` → Session-Cookie |
| POST    | `/api/logout`                       | Session löschen                         |
| POST    | `/api/locale`                       | `{locale: 'de' \| 'en'}` → Cookie `cah_locale` |
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
