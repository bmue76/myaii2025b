# MYAII2025b – Teilprojekt 1.0  
Projektsetup & Grundstruktur

## 1. Ziel

Ein sauberes, reproduzierbares Grundsetup für MYAII2025b erstellen:

- Git-Repository und klare Ordnerstruktur.
- Expo-/React-Native-App (TypeScript) im Ordner `mobile/`.
- Basis-Navigation mit React Navigation (Stack).
- Zwei Screens: `Home` (Start) und `AvatarPlaceholder` (Platzhalter für LiveAvatar).
- Doku-Grundlage für weitere Teilprojekte.

## 2. Schritte

1. **Repo & Ordnerstruktur**
   - Root-Ordner `C:\dev\myaii2025b` angelegt.
   - `git init` ausgeführt.
   - Unterordner `mobile/` (App) und `docs/` (Doku) angelegt.
   - `.gitignore` für Node/Expo/Env erstellt.

2. **Expo-App (TypeScript)**
   - `npx create-expo-app@latest mobile` ausgeführt.
   - Template **„Blank (TypeScript)“** gewählt.
   - App-Name und Slug in `mobile/app.json` auf `MYAII2025b` / `myaii2025b` angepasst.

3. **Navigation**
   - Installation von:
     - `@react-navigation/native`
     - `@react-navigation/native-stack`
     - `react-native-screens`
     - `react-native-safe-area-context`
   - Stack-Navigator in `src/navigation/AppNavigator.tsx` definiert.
   - `App.tsx` so angepasst, dass `AppNavigator` verwendet wird.

4. **Screens**
   - `HomeScreen` mit Begrüssungstext und Button „Avatar-Demo“, der auf den Avatar-Placeholder navigiert.
   - `AvatarPlaceholderScreen` mit Hinweis, dass hier später der LiveAvatar integriert wird.

5. **Doku**
   - `docs/PROJECT_OVERVIEW.md` mit Projektbeschreibung, Roadmap-Auszug und Statusübersicht erstellt.
   - `docs/teilprojekt-1.0-projektsetup.md` (dieses Dokument) mit Zielen, Schritten, Resultat und Befehlen angelegt.

## 3. Resultat

- MYAII2025b ist als Expo-TypeScript-App im Ordner `mobile/` startklar.
- Die App verfügt über eine einfache, funktionierende Navigation:
  - Start in `HomeScreen`.
  - Button „Avatar-Demo“ führt zu `AvatarPlaceholderScreen`.
- Projekt- und Doku-Struktur sind gesetzt (`mobile/`, `docs/`, `.gitignore`).
- Teilprojekt 1.0 bildet die Basis für die Avatar-Integration in Teilprojekt 1.1.

## 4. Wichtige Befehle (Referenz)

### Projekt anlegen & Git initialisieren

```bash
# Root-Ordner anlegen und wechseln
mkdir -p /c/dev/myaii2025b
cd /c/dev/myaii2025b

# Git initialisieren
git init

# docs-Ordner anlegen
mkdir docs
