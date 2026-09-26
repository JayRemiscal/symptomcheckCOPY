# SymptomCheck App Structure

This document outlines the folder and file structure of the **SymptomCheck** project and explains what each part does.

## Root Directory

- **`/src`**: Contains all the application source code (React components, logic, data).
- **`/public`**: Static assets that are served directly without being bundled (e.g., icons, `manifest.webmanifest`, `.well-known` for app links).
- **`/scripts`**: Contains utility scripts, such as `generate-pwa-assets.mjs` for generating PWA (Progressive Web App) icons.
- **`package.json` & `package-lock.json`**: Defines the project dependencies (React, Vite, Lucide icons, Leaflet) and NPM scripts.
- **`vite.config.ts`**: Configuration file for Vite, the build tool and development server used in this project.
- **`vercel.json`**: Configuration for deployment on Vercel.
- **`index.html`**: The main HTML entry point that loads the React application.
- **`README.md`**: Basic instructions on how to run the project.

## Inside `/src`

The `src` folder is organized into several functional areas:

### 1. **`/components`** (User Interface)
Contains all the visual React components for the application.
- **`LoginView.tsx`**: The screen where users enter their profile details (Name, Birthdate, Gender, Mobile, Address).
- **`SymptomAssessmentView.tsx`**: The main interface where users select their symptoms and view progress.
- **`TriageResultsView.tsx`**: The results screen displaying the computed severity, recommendations, and clinical directives.
- **`HospitalMapView.tsx`**: An interactive map (using Leaflet) to help users find nearby hospitals or clinics in emergencies.
- **`HistoryView.tsx`**: Displays a log of the user's past triage assessments, saving them locally.
- **`ExportReportModal.tsx`**: The modal that formats the triage results into a printable/downloadable summary report.
- **`TopBar.tsx`**: The navigation bar shown at the top of the app.
- **`LanguageSelector.tsx`**: Component for switching languages (if implemented).
- **`AdminPasscodeModal.tsx` & `AdminRulesModal.tsx`**: Hidden admin tools for managing the inference engine rules.
- **`LandingView.tsx`**: The initial welcome/home page.
- **`AmbulanceLoader.tsx`**: An animated loading screen shown during assessment calculation.

### 2. **`/data`** (Static Configuration & Knowledge Base)
Contains static definitions and datasets that power the app.
- **`symptoms.ts`**: The list of all supported symptoms, their categories, IDs, and descriptions.
- **`ageBrackets.ts`**: The epidemiological data mapping specific conditions to age brackets and genders.
- **`seedRules.ts`**: The core rules for the Forward Chaining Engine (determining severity based on symptom combinations).
- **`staticHospitals.ts`**: A fallback offline list of major hospitals in the Philippines.
- **`translations.ts`**: Dictionary for localization and multi-language support.

### 3. **`/engine`** (Logic Engine)
- **`ForwardChainingEngine.ts`**: The core clinical decision support engine. It takes the selected symptoms, evaluates them against the rules in multiple passes, and outputs a final triage result (Critical, Moderate, Mild).

### 4. **`/services`** (State & External Integrations)
Contains helper classes and utilities to manage state and logic outside of the UI components.
- **`AuthService.ts`**: Manages the logged-in user session, profile validation, and admin authentication.
- **`GeoService.ts`**: Handles GPS location fetching and querying the Overpass/Nominatim API for nearby hospitals.
- **`HistoryService.ts`**: Saves, retrieves, and deletes user triage assessment histories using the browser's `localStorage`.
- **`RuleStorageService.ts`**: Manages the loading of rules (combining default system rules and custom admin rules).
- **`LanguageService.ts`**: Utility for fetching translated text based on the active language.

### 5. **Core Application Files**
- **`App.tsx`**: The root React component. It acts as the router, switching between different views (`home`, `login`, `assessment`, `results`, `history`, `hospitals`) and managing global state like the `userProfile` and `viewHistory`.
- **`main.tsx`**: The React DOM rendering entry point that mounts `<App />` into `index.html`.
- **`types.ts`**: Contains all the TypeScript interfaces and type definitions used across the project (e.g., `UserProfile`, `HistoryEntry`, `Rule`).
- **`index.css`**: Global CSS styles, Tailwind imports, and custom map styling.
