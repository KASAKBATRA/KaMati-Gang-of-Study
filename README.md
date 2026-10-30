# KaMaTi Gang of Study — Android Application

KaMaTi Gang of Study is a study hub designed specifically for Guru Gobind Singh Indraprastha University (GGSIPU / IPU) engineering students. The application centralizes curated semester notes, syllabus documents, exam datesheet countdowns, student forum discussions, and community resources into a modern Android app built using Kotlin, Jetpack Compose, and Material 3 design principles.

## Features

- **Animated Splash Screen:** Custom typewriter animation rendering bilingual quotes in English and Hindi, pulsating aura logo, and loading indicators.
- **Study Materials Catalog (1,000+ Notes):**
  - Full semester notes for Semester 1, 3, 4, 5, 6, and 7.
  - Search by document title, subject, and syllabus keywords.
  - Semester filtering chips and dynamic subject selection.
  - Direct document viewing via Google Drive integration.
  - 5-star interactive rating and bookmarking system.
- **Live Exam Countdown:** Real-time countdown timers down to seconds for upcoming IPU examinations (Semesters 3, 5, and 7).
- **Daily Rotating Study Target:** Algorithmic daily topic recommendations to guide revision sessions.
- **Discussion Community:** Student forum to post questions, share doubts, provide answers, and upvote helpful solutions.
- **Meet the Team:** Profiles of the student developers (Akshat Pal, Himanshi Sharma, Reachal Jain) with LinkedIn connections.
- **Feedback & WhatsApp Integration:** In-app rating submission with instant redirection to the official KaMaTi WhatsApp community channel.
- **Dark & Light Mode:** Theme toggle with Material 3 dynamic color scheme support.

## Architecture & Tech Stack

- **Platform:** Android (minSdk 24, targetSdk 35)
- **Language:** Kotlin
- **UI Toolkit:** Jetpack Compose (Material 3)
- **State Management:** MVVM with ViewModel, StateFlow, and `collectAsStateWithLifecycle`
- **Asset Storage:** Bundled `notes_data.json` containing 1,032 verified IPU study resources
- **Build System:** Gradle (Kotlin DSL, `build.gradle.kts`, `settings.gradle.kts`, `gradle/libs.versions.toml`)
