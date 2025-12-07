# MYAII2025b – Projektübersicht

MYAII2025b ist eine mobile App auf Basis von **Expo / React Native / TypeScript**.  
Ziel ist ein persönlicher, AI-basierter Avatar-Coach (HeyGen LiveAvatar), der den Nutzer im Alltag begleitet.  
Im Unterschied zur Vorgängerversion wird der Avatar **direkt** über Streaming (LiveKit + HeyGen) integriert – ohne WebView.

---

## Architektur grob

- **mobile/** – Expo-React-Native-App (iOS / Android)
- **docs/** – Projektdokumentation, Teilberichte, Roadmap

Backend- und Infrastruktur-Themen (z. B. eigene API, Auth, Storage) werden in späteren Teilprojekten spezifiziert.

---

## Teilprojekte & Roadmap (Auszug)

### 1.0 – Projektsetup & Grundstruktur (dieser Chat)

- Git-Repo und Basis-Ordnerstruktur (`mobile/`, `docs/`).
- Expo-App (TypeScript) im Ordner `mobile/`.
- Einfache Navigation mit React Navigation (Stack).
- Zwei Screens: `Home` und `AvatarPlaceholder`.
- Doku-Struktur und initiale Projektübersicht.

### 1.1 – Avatar-Demo (LiveAvatar Placeholder / Tech-PoC)

- Technische Anbindung an LiveKit + HeyGen Streaming API vorbereiten.
- Minimaler Avatar-Demo-Flow (manueller Start/Stopp, einfache UI).
- Saubere Trennung von Avatar-UI und Infrastruktur-Schichten.
- Logging / Error-Handling für Avatar-Verbindung.
- Erste Doku zu Limits, Latenz, Stabilität.

(Weitere Teilprojekte folgen später, z. B. Diary-Funktionen, User-Profile, Settings, Onboarding.)

---

## Statusübersicht

| Teilprojekt | Titel                                  | Status  | Notizen                                      |
|------------|-----------------------------------------|---------|----------------------------------------------|
| 1.0        | Projektsetup & Grundstruktur           | Fertig  | Basis-Struktur, Navigation, Doku stehen.     |
| 1.1        | Avatar-Demo (LiveAvatar / Tech-PoC)    | Geplant | Fokus auf Streaming-Integration & PoC.       |

---

## Notizen

- Fokus von MYAII2025b: **Avatar-first** – erst der Coach, dann weitere Features.
- Keine WebView-Einbettung mehr für den Avatar; stattdessen direkte Integration der Streaming-API.
- Dieses Dokument dient als Einstiegspunkt in das Projekt und wird bei neuen Teilprojekten laufend ergänzt.

## 1.2 – Splash, Login & Personal Greeting – App-Shell

- **Status**: abgeschlossen (04.12.2025)
- **Ziel**: Erste App-Shell für MYAII2025b mit SplashScreen, Login-/Registrierungs-Screen und persönlichem Home-Screen inkl. Begrüssung und Avatar-Placeholder.
- **Kern-Funktionalität**:
  - Splash entscheidet anhand von lokalem Profil (`isOnboarded`), ob `/login` oder `/home` geladen wird.
  - Login erfasst Name & Handy-Nummer, speichert das Profil lokal via AsyncStorage und markiert den User als „onboarded“.
  - Home-Screen lädt das Profil, zeigt eine personalisierte Begrüssung (inkl. zufälligem Motivationsspruch) und enthält einen UI-Placeholder für den späteren AI-Avatar.
  - Top-Bar und Bottom-Navigation als visuelle App-Rahmen (Tabs aktuell UI-only).
- **Wichtige Dateien**:
  - `mobile/App.tsx` (Expo Router Entry)
  - `mobile/app/index.tsx` (SplashScreen)
  - `mobile/app/login.tsx` (Login/Onboarding)
  - `mobile/app/home.tsx` (Personal Home + Avatar-Placeholder)
  - `mobile/src/services/userStorage.ts` (Userprofil-Storage, AsyncStorage)
  - `mobile/src/utils/greetings.ts` (Random-Begrüssungen)
- **Offene Punkte / Folgeprojekte**:
  - Echte Auth-/Backend-Anbindung für SMS-/E-Mail-Verifizierung.
  - Live-Avatar-Integration via HeyGen + LiveKit.
  - Funktionale Tabs & zusätzliche Screens (Themen, Tagebuch, Freunde).

---

## 2. Snippet für `docs/PROJECT_OVERVIEW.md`

Füge z. B. unter „Teilprojekte“ folgenden Eintrag ein:

```md
### Teilprojekt 1.3 – Tabs & Screens: Avatar, Themen, Tagebuch & Freunde

- Custom-Tab-Bar mit linker/rechter Blockstruktur und zentraler Chat-Bubble.
- Einheitlicher Header-Stil für Avatar/Themen/Tagebuch (MYAII-Farben & Typografie).
- Screen „Meine Themen“ mit anwählbaren Themen + Abo-Hinweis bei >1 Thema.
- Screen „Mein Tagebuch“ inkl. Tagesnavigation, Emojis (Stimmung/Schlaf),
  Quick Notes (mit Modal), Fake-Foto-Upload/-Sprachaufnahme und Liste „Letzte Einträge“.
- Native-Funktionalitäten (Kamera, Audio, DatePicker) bewusst nur als UI-Platzhalter;
  Integration folgt in späteren Teilprojekten.

---

### 1.4 – Freunde & Mein Profil (UX & lokales Profil)

- Freunde-Tab UX verfeinert:
  - Sektion „Einladungen“ (Platzhalter)
  - Sektion „Deine Freunde“ mit Cards (Initialen, Status, aktivem Thema, …)
  - Freund-einladen-Funktion als Platzhalter-Action im Header
- Neuer Screen **„Mein Profil“**:
  - Basisdaten: Name, Handy-Nummer, E-Mail (optional)
  - UI-Einstellungen: Sprache (DE/EN), Notifications (dummys)
  - App & Datenschutz: Datenschutz, Export, Konto löschen (Platzhalter)
  - Aktionen: „Änderungen speichern“ + „Logout“
- Profil-Daten werden lokal über `userStorage` & AsyncStorage verwaltet:
  - Name wird auch unter `myaii_user_name` gespeichert
  - Avatar-Tab begrüsst den Nutzer personalisiert
- Alle Tabs (Avatar, Themen, Tagebuch, Freunde) nutzen die gemeinsame HeaderBar
  und verlinken links konsistent auf den Profil-Screen.

---

## 2. Update-Snippet für `docs/PROJECT_OVERVIEW.md`

Füge in deiner Projektübersicht einen Eintrag für **1.5** hinzu (oder passe ihn an), z. B. in einer Tabelle der Teilprojekte:

```md
| Nr. | Teilprojekt                                      | Status       | Kurzbeschreibung                                                                                   |
|-----|--------------------------------------------------|-------------|----------------------------------------------------------------------------------------------------|
| 1.1 | Native Setup & iOS Dev-Client                    | abgeschlossen | Expo prebuild, Dev-Client, LiveKit-/WebRTC-Basis                                                  |
| 1.2 | App-Shell (Splash, Login, Tabs)                  | abgeschlossen | Grundnavigation, lokales Profil, Login-Flow                                                       |
| 1.3 | Tabs & Screens (Avatar, Themen, Tagebuch, Freunde) | abgeschlossen | Tab-Layout, Basis-Screens                                                                         |
| 1.4 | Freunde & Mein Profil                            | abgeschlossen | Freunde-Tab verfeinert, Profil-Screen mit Logout                                                  |
| 1.5 | Avatar-Demo (HeyGen + LiveKit)                   | abgeschlossen | Avatar-Tab mit HeyGen Streaming-API + LiveKit, Live-Stream und Text-zu-Sprache-Interaktion (PoC) |

---

### Nachtrag ab Teilprojekt 1.6 (Avatar-Hub & Chat-Trennung)

Im Rahmen von **Teilprojekt 1.6** wurde der in 1.5 umgesetzte LiveAvatar-PoC (HeyGen + LiveKit), der zunächst auf dem Avatar-Tab integriert war, auf eine eigene **Chat-Seite** verschoben:

- Neuer Screen: `mobile/app/(tabs)/chat.tsx`
- Aufruf über den **zentralen Chat-Button** in der Tab-Bar.
- Der Avatar-Tab dient seither ausschließlich als **Avatar-Hub** (Avatar-Auswahl, AI Twin) ohne Live-Stream.

Die eigentliche Live-Interaktion mit dem KI-Avatar findet damit ab 1.6 auf der Chat-Seite statt, nicht mehr auf dem Avatar-Tab.

---

### 1.6 – Avatar-Tab als Avatar-Hub & Chat-Seite trennen

- Avatar-Tab zu einem **Avatar-Hub** umgebaut (AI AVATAR):
  - Dunkler Screen mit zwei großen Kacheln:
    - „Wähle einen AI Avatar deiner Wahl“
    - „Erstelle deinen AI Twin“
  - Beide Kacheln aktuell mit Platzhalter-Actions (Alerts).
- Neuer **Chat-Screen** (`/(tabs)/chat`) für den LiveAvatar-PoC:
  - Header „AI JULIA“ mit Profil-Link.
  - Vollbreiter Avatar-Stream oben (quadratisch, nur Avatar-Video).
  - Chatverlauf mit Avatar-/User-Bubbles.
  - iMessage-artige Eingabe-Bubble mit Send-Button, wächst bei mehrzeiligem Text.
- Zentraler Chat-Button in der Tab-Bar öffnet nun konsequent die Chat-Seite, nicht mehr den Avatar-Tab.


