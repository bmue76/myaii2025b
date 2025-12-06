# Teilprojekt 1.5 – Avatar-Demo (HeyGen + LiveKit)

## 1. Ziel

Ziel dieses Teilprojekts war ein funktionsfähiger PoC des Avatars im **Avatar-Tab** der MYAII2025b-App:

- Start einer **HeyGen LiveAvatar**-Session aus der App heraus.
- Aufbau einer **LiveKit**-Verbindung auf dem iPhone (Dev-Client).
- Anzeige des Avatar-Video-Streams im Avatar-Tab.
- Einfache **Text-Interaktion**: Text eingeben → Avatar spricht den Text.
- Saubere Trennung in:
  - HeyGen-Service (Streaming-API),
  - LiveKit-Hilfen (Globals & AudioSession),
  - Avatar-UI (Tab-Screen).

Die Integration ist als **PoC** konzipiert und soll später durch einen Backend-Service (Token-Erzeugung, Secrets) abgelöst werden.

---

## 2. Ausgangslage

Stand nach den vorherigen Teilprojekten:

- **1.1 – Native Setup & iOS Dev-Client**
  - `expo prebuild` ausgeführt, `ios/` + `android/` vorhanden.
  - iOS Dev-Client auf realem iPhone installiert.
  - LiveKit-/WebRTC-Abhängigkeiten bereits installiert:
    - `@livekit/react-native`
    - `@livekit/react-native-expo-plugin`
    - `@livekit/react-native-webrtc`
    - `@config-plugins/react-native-webrtc`
    - `livekit-client`
- **1.2 – App-Shell**
  - Splash → Login → Tabs-Flow mit lokalem Userprofil (AsyncStorage).
- **1.3 – Tabs & Screens**
  - Tabs: Avatar, Themen, Tagebuch, Freunde.
  - Avatar-Tab existiert mit persönlicher Begrüssung + Placeholder.
- **1.4 – Freunde & Mein Profil**
  - Verfeinerter Freunde-Screen.
  - Profil-Screen mit lokalem Profil und Logout-Funktion.

Die eigentliche HeyGen-/LiveKit-Anbindung war bislang noch nicht umgesetzt.

---

## 3. Architektur: App ↔ HeyGen ↔ LiveKit

### 3.1 High-Level Flow

1. Nutzer öffnet den **Avatar-Tab**.
2. Nutzer klickt **„Avatar starten“**:
   - App ruft `startAvatarSession()` im HeyGen-Service auf:
     1. `POST /v1/streaming.create_token` (Auth via `X-Api-Key`).
     2. `POST /v1/streaming.new` (Avatar + Quality + optional Knowledge Base).
     3. `POST /v1/streaming.start` (Session starten).
   - Response enthält:
     - `session_id`
     - `session_token`
     - `url` (LiveKit-Server)
     - `access_token` (LiveKit-Token)
3. Avatar-Tab übergibt `livekitUrl` + `livekitToken` an `LiveKitRoom` (RN-Komponente).
4. LiveKit baut Verbindung auf und zeigt den **Avatar-Video-Stream**.
5. Nutzer gibt Text ein und klickt **„Sagen lassen“**:
   - App ruft `sendTextToAvatar(session, text)`:
     - `POST /v1/streaming.task` mit `task_type: "talk"`.
   - Avatar spricht den Text.
6. Nutzer klickt **„Avatar stoppen“**:
   - App ruft `stopAvatarSession(session)`:
     - `POST /v1/streaming.stop`.
   - LiveKit-Verbindung wird beendet, Session aufgeräumt.

### 3.2 Dateien & Verantwortlichkeiten

- `mobile/src/services/heygenStreaming.ts`
  - Kapselt alle HeyGen-Streaming-API-Calls.
  - API-Funktionen:
    - `isHeygenConfigured()`
    - `startAvatarSession(options?)`
    - `sendTextToAvatar(session, text, taskType?)`
    - `stopAvatarSession(session)`
  - Interne Schritte:
    - `createSessionToken()` → `streaming.create_token`
    - `createNewSession()` → `streaming.new`
    - `startStreamingSession()` → `streaming.start`

- `mobile/src/lib/livekitClient.ts`
  - Hilfs-Layer für LiveKit in React Native:
    - `ensureLiveKitGlobals()` → ruft `registerGlobals()` von `@livekit/react-native`, einmal pro App-Lauf.
    - `useLiveKitAudioSession()` → Hook zum Starten/Stoppen der LiveKit-AudioSession (in `useEffect`).

- `mobile/src/hooks/useUserProfile.ts`
  - Kleiner Hook für das lokale Userprofil aus `AsyncStorage`.
  - Wird für die personalisierte Begrüssung im Avatar-Tab verwendet.

- `mobile/app/(tabs)/avatar.tsx`
  - UI-Komponente für den Avatar-Tab mit:
    - `HeaderBar` (einheitliche App-Header-Leiste).
    - Begrüssungstext auf Basis des Userprofils.
    - Hinweisbox, falls HeyGen nicht konfiguriert ist.
    - **Live-Avatar Card**:
      - Status-Anzeige (Bereit / Verbinden / Live / Fehler).
      - Videobereich mit `LiveKitRoom` + `VideoTrack`.
      - Buttons „Avatar starten“ / „Avatar stoppen“.
      - Textfeld + Button „Sagen lassen“.

---

## 4. Environment & Konfiguration

### 4.1 `.env` (Dev-Setup)

Im Ordner `mobile/`:

```env
# HeyGen API
EXPO_PUBLIC_HEYGEN_API_KEY=...dein_token...
EXPO_PUBLIC_HEYGEN_API_BASE_URL=https://api.heygen.com

# Standard-Avatar (aus HeyGen-Dashboard bzw. Share-Link)
EXPO_PUBLIC_HEYGEN_DEFAULT_AVATAR_ID=ee22459691c0454aabeb7dae03333b74

# Optionales Tuning
EXPO_PUBLIC_HEYGEN_AVATAR_QUALITY=high
EXPO_PUBLIC_HEYGEN_KNOWLEDGE_BASE_ID=c9a7e0d54cf24bbb96b0f337fae6dcd5
