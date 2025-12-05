MYAII2025b – Teilprojekt 1.3  
Tabs & Screens: Avatar, Themen, Tagebuch & Freunde – Schlussrapport
===================================================================

1. Ziel
-------

Ziel dieses Teilprojekts war es, auf Basis der bestehenden App-Shell (Splash, Login, Home)
die **untere Tab-Navigation** sowie die ersten inhaltlichen Screens für:

- **Avatar**
- **Meine Themen**
- **Mein Tagebuch**
- **Freunde**

zu definieren und als klickbaren UX-Prototyp umzusetzen.  
Der Fokus lag auf einem konsistenten Header-/Footer-Layout im MYAII-Branding sowie
auf einem realistisch wirkenden Tagebuch-Flow mit Emojis und Notizen – ohne
Abhängigkeit von nativen Modulen (Audio, Kamera), um die Entwicklung unter Expo Dev-Client
stabil zu halten.

2. Ausgangslage
---------------

- MYAII2025b war bereits mit:
  - Splash-Screen,
  - Login/Registrierung (Name + Handy-Nummer),
  - persönlicher Home-Übersicht und
  - Avatar-Platzhalter

aufgesetzt (Teilprojekt 1.2 – App-Shell).

- Es existierte noch **keine** Tab-Navigation für Themen/Tagebuch/Freunde und
  die Screens waren noch nicht gestaltet.

- Erste UI-Referenzen vom Kunden (Screenshots) waren bereits vorhanden und
  sollten so nahe wie möglich nachgebaut werden (Farben, Icons, Layout).

3. Umsetzung – Technische Schritte
----------------------------------

### 3.1 Tab-Navigation mit Chat-Bubble

**Datei:** `mobile/app/(tabs)/_layout.tsx`

- Aufbau einer **Custom TabBar** auf Basis von `expo-router`:
  - Linker Block:  
    - `Themen` (Icon: `layers-outline`)  
    - `Tagebuch` (Icon: `book-outline`)
  - Rechter Block:  
    - `Freunde` (Icon: `people-outline`)  
    - `Avatar` (Icon: `person-circle-outline`)
  - Zentrierte **Chat-Bubble**:
    - weiße, runde Bubble mit 4 px Rand in `BLUE`
    - Icon: `chatbubble-ellipses-outline` in `BLUE_DARK`
    - leicht erhöht mit Schatten (floating effect)
    - aktuell Navigation auf `avatar` → später KI-Chat / Speech-to-Text

- Tab-Bar-Design:
  - Höhe: `TAB_BAR_HEIGHT = 70`
  - Hintergrund: `BLUE = #CFE1FF`
  - Inaktive Icons/Labels: weiß
  - Aktive Icons/Labels: `BLUE_DARK = #4B4B76`
  - Labels kleiner (10 pt) und eng unter dem Icon
  - zusätzlicher Padding-Bottom für mehr Abstand zum unteren Bildschirmrand

Verwendete Konstanten:

```ts
const BLUE = '#CFE1FF';        // Header/Footer-Hintergrund
const BLUE_DARK = '#4B4B76';   // aktive Icons/Labels, Titel
const BACKGROUND = '#F7F8FC';  // Content-Background
const CARD_BORDER = '#E0E4F0'; // Kartenränder
const TAB_BAR_HEIGHT = 70;
const HEADER_HEIGHT = 88;
