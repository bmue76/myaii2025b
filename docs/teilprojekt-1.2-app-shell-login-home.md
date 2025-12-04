# MYAII2025b – Teilprojekt 1.2  
Splash, Login & Personal Home – App-Shell

## 1. Ziel & Scope

Ziel von Teilprojekt 1.2 war es, eine erste **App-Shell** für MYAII2025b bereitzustellen mit:

- Splash-Screen im MYAII-Branding.
- Login-/Registrierungs-Screen mit Name & Handy-Nummer.
- Persönlichem Home-Screen mit Begrüssung und Platzhalter für den zukünftigen AI-Avatar.
- Einfachem Onboarding-Flow inkl. lokalem Storage von Userprofil (Name, Phone, isOnboarded).
- Grundlegendem App-Rahmen für spätere Erweiterungen (Top-Bar, Bottom-Navigation).

Bewusst **nicht** Teil dieses Teilprojekts:

- Echte SMS-/E-Mail-Verifizierung.
- Backend-/Auth-Integration.
- LiveKit-/HeyGen-Integration des Avatars.
- Funktionale Navigation der Bottom-Tabs (UI-only).

---

## 2. Technische Basis

- **Framework**: Expo + React Native + TypeScript
- **Navigation**: Expo Router (Dateibasiert, `app/`-Ordner)
- **App-Entry**:  
  - `mobile/App.tsx` → `import 'expo-router/entry';`
- **Routen/Screens**:
  - `mobile/app/index.tsx` → SplashScreen
  - `mobile/app/login.tsx` → Login-/Registrierungs-Screen
  - `mobile/app/home.tsx` → Persönlicher Home-Screen mit Avatar-Placeholder
- **State & Storage**:
  - `@react-native-async-storage/async-storage`
  - Service-Schicht in `mobile/src/services/userStorage.ts`
  - Begrüssungslogik in `mobile/src/utils/greetings.ts`
- **UI/Icons**:
  - Branding-Farben (MYAII-Hellblau, dunkles Blau, weisse Flächen)
  - `@expo/vector-icons` (Ionicons) für Header- und Bottom-Nav-Icons

Für AsyncStorage wurde ein neuer iOS-Dev-Client über **EAS Build** erzeugt, da es sich um ein natives Modul handelt.

---

## 3. Screens & Flow

### 3.1 Splash-Screen (`app/index.tsx`)

**Zweck**

- Erster Screen beim App-Start.
- Zeigt MYAII-Logo im Zentrum vor hellblauem Hintergrund.
- Führt eine einfache Onboarding-Entscheidung durch.

**UI**

- Hintergrund: MYAII-Hellblau (`#CFE1FF`).
- Logo (gleich wie im Login-Screen) zentriert.
- Unten: ActivityIndicator + Copyright:
  - `© {year} MYAII GMBH ALL RIGHTS RESERVED`

**Logik**

- `useEffect` lädt das Userprofil via `getUserProfile()`.
- Nach ~1.5 Sekunden:
  - Wenn `profile && profile.isOnboarded === true` → `router.replace('/home')`
  - Sonst → `router.replace('/login')`
- Fehler beim Lesen des Profils führen ebenfalls auf `/login`.

---

### 3.2 Login-/Registrierungs-Screen (`app/login.tsx`)

**Zweck**

- Erfasst Basisdaten des Users:
  - Name
  - Handy-Nummer
- Markiert den User als „onboarded“ (lokal) und leitet danach auf den Home-Screen weiter.
- SMS-Hinweis ist rein UI/Placebo – echte Verifizierung folgt später.

**UI**

- Hintergrund: MYAII-Hellblau.
- Logo oben, gross und zentriert (gleiche Grafik wie Splash).
- Zwei Eingabefelder (weisse „Pills“ mit leicht reduzierten Eckenradien):
  - Label 1: `WIE HEISST DU?` (weiss, uppercase)
  - Label 2: `WIE LAUTET DEINE HANDY NUMMER*` (weiss, uppercase)
  - Handy-Feld mit Placeholder im CH-Format:
    - `+41 79 123 45 67` (abgeschwächte Farbe)
- Hinweistext unter den Feldern:
  - `*ES WIRD DIR EIN SMS CODE ZUGESTELLT UM DICH ANZUMELDEN` (weiss, uppercase)
- Button:
  - Pill-Button `CODE EINGEBEN` mit kleinem Pfeil `›`
  - In dunklem Blau, mit Abstand zum Eingabebereich
- Copyright ganz unten:
  - `© {year} MYAII GMBH ALL RIGHTS RESERVED`

**Interaktion und UX**

- Validierung:
  - Name: nicht leer.
  - Handy-Nummer: min. Länge (vereinfachter Check).
- Bei Fehlern: Fehlermeldung in Rot.
- Klick auf Button:
  - Schliesst die Tastatur (`Keyboard.dismiss()`).
  - Validiert.
  - Speichert Profil via `saveUserProfile({ name, phone })`.
  - Leitet via `router.replace('/home')` weiter.
- Zusätzlich:
  - Tap ausserhalb der Felder schliesst die Tastatur (via `TouchableWithoutFeedback` + `Keyboard.dismiss`).
  - `onSubmitEditing` im Handy-Feld löst ebenfalls `handleContinue` aus.

---

### 3.3 Persönlicher Home-Screen (`app/home.tsx`)

**Zweck**

- Startpunkt nach erfolgreichem Onboarding.
- Personalisierte Begrüssung + kleiner „Happy Moment“ via zufälligem Spruch.
- UI-Rahmen für den späteren AI-Avatar.
- Bottom-Navigation (derzeit UI-only).

**Layout**

- **Top-Bar**:
  - Hintergrund: Hellblau.
  - Links: runder weisser Avatar-Kreis mit `person-outline`-Icon.
  - Mitte: Titel `AI AVATAR`.
  - Rechts: `share-outline`-Icon (weiss, leicht grösser).
- **Content-Bereich** (helles Grau/Weiss im Hintergrund):
  - Begrüssungs-Card:
    - `Hey {Vorname},`
    - `{Random Greeting}` (z.B. „you look great today“)
  - Avatar-Card:
    - Titel: `DEIN AI AVATAR`
    - Hellblauer Block mit Text:
      - `Avatar kommt hier hin`
      - Erklärungstext, dass hier später der Live-Avatar (HeyGen + LiveKit) integriert wird.
- **Bottom-Nav-Bar** (UI-only):
  - Flacher hellblauer Balken unten.
  - Vier Items mit **weissen** Outline-Icons (Ionicons) und weissem Label:
    - `sparkles-outline` – **AI AVATAR** (aktiv, fett)
    - `flame-outline` – THEMEN
    - `book-outline` – TAGEBUCH
    - `people-outline` – FREUNDE
  - Labels mit `marginTop` unter dem Icon für klaren Abstand.

**Logik**

- `useEffect` lädt Profil via `getUserProfile()`.
- Wenn kein Profil oder `!isOnboarded` → Redirect auf `/login`.
- Wird ein Profil gefunden:
  - Vorname aus dem gespeicherten Namen extrahiert (Split am ersten Leerzeichen).
  - Zufälliger Begrüssungsspruch via `getRandomGreeting()` gesetzt.
- Bei Ladezustand: Fullscreen-Spinner auf blauem Hintergrund.

---

## 4. State- & Storage-Konzept

### 4.1 `userStorage`-Service (`src/services/userStorage.ts`)

Zentrale Kapselung der AsyncStorage-Logik:

- `saveUserProfile({ name, phone })`
  - Speichert Name, Phone und setzt `isOnboarded: true`.
  - JSON-Objekt in AsyncStorage (z.B. Key: `user_profile`).
- `getUserProfile()`
  - Liest das gespeicherte Profil aus AsyncStorage.
  - Gibt `null` zurück, wenn nichts vorhanden ist oder das JSON ungültig ist.
- `clearUserProfile()`
  - Löscht das Profil aus AsyncStorage (Grundlage für späteren Logout/Reset).

Verwendung:

- **Splash**:
  - Prüft `profile?.isOnboarded` und entscheidet über Routing.
- **Login**:
  - Schreibt Profil (Name/Phone + Flag).
- **Home**:
  - Liest Profil, extrahiert Vorname und nutzt `isOnboarded` zur Schutzlogik.

---

### 4.2 Zufallsbegrüssungen (`src/utils/greetings.ts`)

- Ein einfaches Array mit „positiven Mini-Botschaften“, z.B.:
  - `you look great today`
  - `today is your day`
  - `you’re doing better than you think`
  - etc.
- Funktion `getRandomGreeting()`:
  - Wählt einen zufälligen Eintrag aus dem Array.
  - Wird beim Laden des Home-Screens aufgerufen.

---

## 5. UX-Entscheidungen & Learnings

- **Brand-Konsistenz**:
  - Splash, Login und Home verwenden consistent das MYAII-Hellblau, das zentrale Logo und eine klare Hierarchie (Logo → Content → Navigation).
- **Onboarding-Fokus**:
  - Minimaler Datensatz (Name, Phone).
  - SMS-Hinweis bereits im UI, jedoch explizit als Platzhalter kommuniziert.
- **Device-Experience**:
  - Tastatur-Verhalten auf iOS sauber adressiert (KeyboardAvoidingView + Tap to dismiss).
  - CH-Phone-Placeholder als visuelle Hilfe.
- **App-Rahmen**:
  - Top-Bar und Bottom-Nav sind bereits visuell definiert, sodass spätere Feature-Screens in ein stimmiges Layout integriert werden können.

---

## 6. Offene Punkte / Nächste Schritte

- **Echte Auth/Verifizierung**:
  - Anbindung eines Backends für SMS-/E-Mail-Verifizierung.
  - Ersetzung der lokalen `isOnboarded`-Flag durch „echten“ User-/Session-Status.
- **AI-Avatar-Integration**:
  - Einbindung von HeyGen LiveAvatar via LiveKit im Avatar-Placeholder.
  - Handling von Streaming, Mute/Unmute, Prompts etc.
- **Navigation funktionalisieren**:
  - Bottom-Nav über Expo Router (z.B. Layout mit Tabs) produktiv machen.
  - Screens für THEMEN, TAGEBUCH, FREUNDE definieren.
- **Settings / Profil**:
  - Screen für Profil-/Einstellungen (z.B. Avatar in Top-Bar tippbar).
- **Analytics & Telemetry**:
  - Tracking von Onboarding-Abbruch, Screen-Aufrufen etc. (spätere Iteration).
