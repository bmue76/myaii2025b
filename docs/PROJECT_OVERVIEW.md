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
