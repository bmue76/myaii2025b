# Teilprojekt 1.6 – Avatar-Tab als Avatar-Hub & Chat-Seite trennen – MYAII2025b

## 1. Ziel

Das bisherige Konzept, bei dem der LiveAvatar-PoC direkt auf dem Avatar-Tab lief, sollte bereinigt und in die finale Struktur überführt werden:

- **Avatar-Tab** wird zum zentralen **Avatar-Hub** (Avatar-Management).
- Die eigentliche **Live-Interaktion mit dem KI-Avatar** (HeyGen + LiveKit) läuft auf einer eigenen **Chat-Seite**, die über den zentralen Chat-Button in der Tab-Bar erreichbar ist.
- UX/UI sollen klarer werden: Avatar-Management vs. Dialog-/Coaching-Erlebnis.

## 2. Ausgangslage

- Expo / React Native / TypeScript mit **Expo Router**.
- Tab-Navigation unter `mobile/app/(tabs)/_layout.tsx` mit zentralem Chat-Button.
- Avatar-Tab (`mobile/app/(tabs)/avatar.tsx`) enthielt bisher:
  - Begrüssung
  - LiveAvatar-Demo (HeyGen + LiveKit)
  - Text-Eingabe, um den Avatar sprechen zu lassen.
- Teilprojekt 1.5 hatte einen funktionierenden **HeyGen LiveAvatar-PoC**, der aber noch konzeptionell im Avatar-Tab „klemmte“.

## 3. Umsetzung

### 3.1 Avatar-Tab als Avatar-Hub

**Datei:** `mobile/app/(tabs)/avatar.tsx`

- Neuer Inhalt: Fokus auf **Avatar-Management**, kein Live-Stream mehr.
- Layout:
  - Dunkler Hintergrund (MYAII-Style).
  - HeaderBar mit Titel **„AI AVATAR“**, Icons:
    - links: `person-circle-outline` mit Navigation auf `/profile`
    - rechts: `share-outline` (Platzhalter für spätere Sharing-/Export-Themen).
  - Zwei grosse Kacheln (Cards):
    1. **„Wähle einen AI Avatar deiner Wahl“**
       - Icon: `people-circle-outline`
       - Beschreibungstext zur Avatar-Auswahl (Stile, Stimmen, Persönlichkeiten).
       - `onPress`: `Alert.alert(...)` als Platzhalter („Avatar-Auswahl folgt später“).
    2. **„Erstelle deinen AI Twin“**
       - Icon: `sparkles-outline`
       - Beschreibungstext zur Erstellung eines AI-Twins (Stimme, Aussehen, Persönlichkeit).
       - `onPress`: `Alert.alert(...)` als Platzhalter.
  - Die Kachel-Titel sind in einer weißen Leiste innerhalb der Karte, optisch an das UX-Mockup angelehnt.

Damit ist der Avatar-Tab klar als **Hub für Avatar-bezogene Konfiguration** positioniert.

### 3.2 Chat-Seite mit LiveAvatar-PoC

**Datei:** `mobile/app/(tabs)/chat.tsx`

- Der in 1.5 aufgebaute LiveAvatar-PoC wurde nach **`/ (tabs)/chat`** verschoben und optisch an einen modernen Chat-Screen angelehnt.
- HeaderBar:
  - Titel: **„AI JULIA“**
  - Icon links: `person-circle-outline` → führt zu `/profile`
  - Icon rechts: `share-outline` (Platzhalter für späteres Teilen/Export).
- Layout:
  1. **Avatar-Video oben**
     - Vollbreiter Block direkt unter dem Header.
     - Quadratisches Format (`aspectRatio: 1`), schwarzer Hintergrund.
     - Anzeige des HeyGen-LiveAvatar-Streams über `LiveKitRoom` + `RoomView`.
     - Kein lokales Selfie-Video, nur der Avatar-Stream.
  2. **Chat-Verlauf**
     - Direkt unter dem Video, auf hellem Hintergrund.
     - Chat-Bubbles:
       - Avatar-Messages: links, **weiß**, mit abgerundeten Ecken.
       - User-/Text-Messages (aktuell identischer Inhalt zu gesendetem Text): rechts, **blau**.
     - Leere-State: Text-Hinweis „Starte deinen ersten Satz für AI JULIA.“
  3. **Eingabe-Bubble**
     - Breite, weiße „Pill“-Bubble mit:
       - mehrzeiligem `TextInput`, der bis zu einer sinnvollen Max-Höhe wächst.
       - rundem, blauem Send-Button (`paper-plane-outline`).
     - Position:
       - fix am unteren Rand des Screens,
       - so dimensioniert, dass sie **über der Tab-Bar** sichtbar bleibt.
       - wird via `KeyboardAvoidingView` nach oben geschoben, wenn die Tastatur erscheint – darf den Avatar beim Tippen teilweise überdecken.
- Technik:
  - `ensureLiveKitGlobals()` + `useLiveKitAudioSession()` wie in 1.5.
  - Beim Öffnen des Screens:
    - Wenn HeyGen konfiguriert, wird der Avatar automatisch verbunden.
    - Nach Herstellung der Verbindung sendet AI JULIA eine Begrüssungsnachricht.
  - Error-Handling:
    - Hinweisbox, falls `EXPO_PUBLIC_HEYGEN_API_KEY` fehlt.
    - Fehler beim Senden oder Starten der Session werden in einer roten Error-Box angezeigt.

### 3.3 Navigation & zentraler Chat-Button

**Datei:** `mobile/app/(tabs)/_layout.tsx`

- Custom Tab-Bar mit zwei Blöcken (links/rechts) und zentralem Chat-Button.
- Anpassungen:
  - Tabs sind weiterhin: `avatar`, `themen`, `tagebuch`, `freunde`.
  - Der zentrale runde Button verwendet jetzt `router.push('/(tabs)/chat')` (bzw. `navigation.navigate('chat')` im Tab-Namespace) und führt direkt auf den **Chat-Screen**.
  - Alle Tabs behalten ihren Look & Feel, der Chat-Screen nutzt dieselbe Tab-Bar und denselben Header-Stil.

### 3.4 Technische Hinweise

- LiveAvatar-Code ist nun sauber in **`chat.tsx`** gekapselt.
- Avatar-Tab enthält **keine** LiveKit-/HeyGen-spezifische Logik mehr.
- Das Layout ist so angelegt, dass spätere Erweiterungen gut integrierbar sind:
  - weitere Avatar-Karten,
  - eigene Avatar-Details-Seiten,
  - erweitertes Chat-Protokoll mit echten Nutzer- vs. Avatar-Rollen.

## 4. Resultat

- **Klar getrennte Rollen:**
  - Avatar-Tab = Avatar-Management / Hub.
  - Chat-Screen = Ort der eigentlichen Interaktion mit AI JULIA (LiveAvatar).
- UX entspricht dem konzeptionellen Ziel:
  - Avatar-Selektions-/Twin-Themen sind logisch von der laufenden Session entkoppelt.
  - Chat wirkt wie ein „echter Chat“ mit Avatar-Bubble oben und Messages darunter.
- Der zentrale Chat-Button in der Tab-Bar öffnet konsistent die Chat-Seite.
- Die ursprüngliche Platzierung des LiveAvatar-PoC auf dem Avatar-Tab wurde bereinigt.

## 5. Offene Punkte / nächste Teilprojekte

- **Avatar-Auswahl (Card 1):**
  - Liste von verfügbaren Avataren (Stile, Stimmen, Personas).
  - Auswahl & Speicherung im Userprofil.
  - Einfluss auf HeyGen-Session (Avatar-ID, Stimme etc.).

- **AI Twin (Card 2):**
  - Upload/Definition von Stimme, Aussehen, Verhalten.
  - Mapping auf HeyGen-Parameter und ggf. weitere Services (LLM-Personas).

- **Chat-Logik:**
  - Echte Trennung von User- und Avatar-Nachrichten:
    - Eingabe → blaue Bubble (User),
    - Antwort vom LLM / Avatar → weiße Bubble (Avatar).
  - Persistenz des Chatverlaufs (lokal oder backendbasiert).

- **UX-Feinschliff:**
  - Typing-Indikator („AI JULIA denkt …“).
  - Optionen für Mute/Unmute, Sprache, Geschwindigkeit.
  - Sharing-Funktion über das Header-Icon rechts (Export von Sessions / Highlights).
