# Teilprojekt 1.1 – Native Setup & iOS Dev-Client (Vorbereitung Avatar-Demo)

> Ursprünglicher Arbeitstitel: „Avatar-Demo (HeyGen + LiveKit)“.  
> In diesem Teilprojekt wurde der Scope bewusst reduziert:  
> Fokus auf native Setup & iOS-Dev-Client, die eigentliche Avatar-Anbindung folgt in einem eigenen Teilprojekt.

---

## 1. Ziel

Ziel von Teilprojekt 1.1 war es, die **technische Grundlage** zu schaffen, um später einen
HeyGen-/LiveKit-Avatar stabil in MYAII2025b nutzen zu können:

- Expo-Projekt **native-ready** machen (`expo prebuild`).
- iOS-Dev-Client für MYAII2025b auf einem realen iPhone lauffähig machen.
- Expo Router Starter-App (Tabs) im Dev-Client starten können.
- Erste Integration von nativen Voraussetzungen (Plugins / Packages) für spätere LiveKit-/WebRTC-Nutzung.
- Dokumentation der Setup-Schritte und Stolpersteine.

Die **eigentliche Avatar-Integration** (HeyGen-API + LiveKit-Streaming + Avatar-UI) wird in
einen Folge-Teilprojekt verschoben.

---

## 2. Ergebnis im Überblick

Erreicht in 1.1:

- `mobile/` ist **prebuild-fähig**, Android/iOS native Projekte wurden generiert.
- `app.json` ist erweitert um:
  - iOS-/Android-Permissions (Kamera/Mikrofon),
  - LiveKit-/WebRTC-Plugins:
    - `@livekit/react-native-expo-plugin`
    - `@config-plugins/react-native-webrtc`
- LiveKit-/WebRTC-Pakete sind installiert (für spätere Nutzung):
  - `@livekit/react-native`
  - `@livekit/react-native-expo-plugin`
  - `@livekit/react-native-webrtc`
  - `@config-plugins/react-native-webrtc`
  - `livekit-client`
- **EAS/Expo-Dev-Client** für iOS gebaut und auf einem realen iPhone installiert.
- iPhone ist im **Entwicklermodus** und vertraut dem Dev-Client (Developer App trusted).
- Die **Expo Router Starter-App** (Tabs mit „Home“ & „Explore“) läuft im Dev-Client.
- Asset-Setup bereinigt (`assets/icon.png` vorhanden, keinerlei Asset-Errors mehr beim Start).

Nicht umgesetzt (bewusst verschoben):

- Kein eigener Home-Screen mit Avatar-Fokus (noch Standard-Welcome-Screen von Expo).
- Kein Avatar-Tab, keine Avatar-Demo-Oberfläche.
- Keine aktiven HeyGen-/LiveKit-Calls im Code.

---

## 3. Technische Umsetzung

### 3.1 Native Setup & Dependencies

- Wechsel in den Mobile-Ordner:

  ```bash
  cd /c/dev/myaii2025b/mobile
