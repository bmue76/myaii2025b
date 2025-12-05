# Teilprojekt 1.4 – Freunde & Mein Profil (UX & lokales Profil)

## 1. Ziel

In diesem Teilprojekt wurde der Friends-Bereich UX-seitig verfeinert und ein eigener Screen **„Mein Profil“** eingeführt.  
Das lokale Profil (Name, Handy-Nummer etc.) wird zentral über `userStorage` und AsyncStorage verwaltet und ist die Basis für:

- persönliche Begrüssung im Avatar-Tab
- spätere Personalisierung (Sprache, Benachrichtigungen)
- zukünftige Social-Features (Freunde, Einladungen)

---

## 2. Freunde-Tab

**Datei:** `mobile/app/(tabs)/freunde.tsx`  
**Komponenten:** `HeaderBar`, Dummy-Daten für Freunde

### UX-Struktur

- **HeaderBar**
  - Titel: `MEINE FREUNDE`
  - Linkes Icon: `person-circle-outline` → navigiert zu `/profile`
  - Rechtes Icon: `person-add-outline` → Platzhalter-Alert „Freunde einladen“

- **Sektion „Einladungen“**
  - Card mit Platzhalter-Text:
    - „Du hast aktuell keine offenen Einladungen.“
    - Subtext: Hinweis, dass hier später eingehende Anfragen erscheinen

- **Sektion „Deine Freunde“**
  - Liste von Friends-Cards (Dummy-Daten):
    - Avatar-Kreis mit Initialen
    - Name
    - Status (z. B. „Online“, „Zuletzt aktiv vor 2 Std.“)
    - optionaler Text „Aktiv in: {Thema}“
    - „…“-Button rechts für spätere Aktionen (aktuell Alert-Platzhalter)

- **Freund einladen**
  - Kein eigener Content-Block mehr im Body
  - Funktion „Freund einladen“ hängt am rechten Header-Icon

---

## 3. Mein Profil

**Datei:** `mobile/app/(tabs)/profile.tsx`  
**Services:** `src/services/userStorage.ts`, `AsyncStorage`

### 3.1 Basisdaten

- Grosser Avatar-Kreis mit Initialen (aus dem Namen)
- Felder:
  - **Name** (Pflicht für persönliche Ansprache)
  - **Handy-Nummer** (editierbar, Phone-Keyboard)
  - **E-Mail (optional)**

Die Daten werden via `getUserProfile()` geladen und via `saveUserProfile()` gespeichert.

Zusätzlich wird der **Name** unter dem Key `myaii_user_name` in AsyncStorage abgelegt, damit der Avatar-Tab den Vornamen direkt auslesen und für die persönliche Begrüssung verwenden kann.

### 3.2 Einstellungen (UI only)

- **Sprache**
  - Toggle-Pills `DE` / `EN`
  - aktuell nur optischer Switch, noch ohne echte Lokalisierung
- **Benachrichtigungen**
  - `Daily Check-in Reminder` (Switch, dummy)
  - `Push bei neuen Avatar-Nachrichten` (Switch, dummy)

### 3.3 App & Datenschutz (Platzhalter)

- Navigationszeilen mit Chevron:
  - „Datenschutz & Nutzungsbedingungen“
  - „Daten exportieren“
  - „Konto löschen“ (rot markiert)
- Alle Zeilen zeigen aktuell nur einen Platzhalter-Alert.

### 3.4 Aktionen

- **„Änderungen speichern“**
  - Validiert minimal (nur leere Notiz wird verhindert, Name kann leer sein)
  - Speichert Profil in `userStorage`
  - Synchronisiert den Namen zusätzlich nach `AsyncStorage` (`myaii_user_name`)
  - Navigiert zurück zum Avatar-Tab (`/avatar`)

- **„Logout“**
  - Bestätigungsdialog (Alert)
  - Ruft `clearUserProfile()` auf
  - Löscht ebenfalls den Avatar-Namen (`myaii_user_name`)
  - Navigiert via `router.replace('/login')` zurück in den Login-/Onboarding-Flow

---

## 4. Tabs & Navigation

Alle Tabs (Avatar, Themen, Tagebuch, Freunde) verwenden nun die gemeinsame **HeaderBar** in MYAII-Farben und verlinken links konsistent:

- **Avatar-Tab**
  - Header: `AI AVATAR`
  - Linkes Icon `person-circle-outline` → `/profile`
  - Rechtes Icon `share-outline` → Platzhalter (Avatar teilen)

- **Themen-Tab**
  - Header: `MEINE THEMEN`
  - Linkes Icon `person-circle-outline` → `/profile`
  - Rechtes Icon `share-outline` → Platzhalter

- **Tagebuch-Tab**
  - Header: `MEIN TAGEBUCH`
  - Linkes Icon `person-circle-outline` → `/profile`
  - Rechtes Icon `calendar-clear-outline` → Platzhalter für Datumsauswahl

- **Freunde-Tab**
  - Header: `MEINE FREUNDE`
  - Linkes Icon `person-circle-outline` → `/profile`
  - Rechtes Icon `person-add-outline` → Platzhalter „Freund einladen“

---

## 5. Datenbasis & Persistenz

- **Lokale Persistenz:** `AsyncStorage`
- **Service:** `src/services/userStorage.ts` (zentraler Zugriff auf Profil & Onboarding-Status)
- **Zusätzlicher Key für Avatar-Gruß:**
  - `myaii_user_name` – speichert den (Vor-)Namen
  - wird beim Speichern im Profil aktualisiert
  - wird beim Logout gelöscht

Avatar-Tab liest diesen Namen aus und generiert einen personalisierten Begrüssungstext nach dem Muster:

> „Hey {Vorname}, {Random Greeting}“

---

## 6. Offene Punkte / ToDo

- Echte Einladungs-Logik und Backend-Anbindung im Freunde-Tab
- Konfiguration der Notifications (OS-Berechtigungen, Scheduling)
- Echte Datenschutz-/Export-/Löschen-Flows
- Globale Lokalisierung (DE/EN) auf Basis der Spracheinstellung
- Synchronisation des Profils über Geräte / Backend, sobald ein Server existiert
