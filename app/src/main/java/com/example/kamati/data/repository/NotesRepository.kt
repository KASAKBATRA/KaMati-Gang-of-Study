package com.example.kamati.data.repository

import android.content.Context
import com.example.kamati.data.model.Note
import kotlinx.serialization.json.Json
import java.io.InputStreamReader

class NotesRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }
    private var cachedNotes: MutableList<Note> = mutableListOf()

    val semesterSubjects: Map<Int, List<String>> = mapOf(
        1 to listOf(
            "Communication Skills",
            "Environmental Studies",
            "Manufacturing Process",
            "Engineering Mathematics",
            "Engineering Physics",
            "Programming in C"
        ),
        3 to listOf(
            "Syllabus",
            "Data Science",
            "Data Structures",
            "Principles of Artificial Intelligence",
            "Probability, Statistics and Linear Algebra",
            "Digital Logic Design",
            "Universal Human Values",
            "Critical Reasoning, System Thinking"
        ),
        4 to listOf(
            "Machine Learning",
            "Object Oriented Programming in Java",
            "Computational Mathematics",
            "Computer Networks and Internet Protocols",
            "Software Engineering",
            "Database Management System"
        ),
        5 to listOf(
            "Syllabus",
            "Computer Architecture and Organization",
            "Design and Analysis of Algorithms",
            "Data Mining",
            "Internet of Things",
            "Operating System",
            "Principles of Entrepreneurship Mindset"
        ),
        6 to listOf(
            "Digital Image Processing",
            "Fundamentals of Deep Learning",
            "Big Data Analytics",
            "Cognitive Computing",
            "Blockchain Technology",
            "Cloud Computing"
        ),
        7 to listOf(
            "General (Sem 7)",
            "Advanced System Programming",
            "Advanced Data Structures",
            "Computer Vision",
            "Business Intelligence & Analytics",
            "Practical Files (Sem 7)",
            "Web Intelligence",
            "Principles of Management & Economics"
        )
    )

    private val todaysTargets = listOf(
        "PME - Revision: Module 1",
        "DAA - Greedy Algorithms",
        "FODL - Design Patterns",
        "COA - Pipelining",
        "IOT - MQTT Basics",
        "OS - Process Scheduling",
        "UHV - Ethics Case Study",
        "DS - Graph Algorithms",
        "FODS - Database Normalization",
        "DLD - Sequential Circuits",
        "PAI - Search Heuristics",
        "PSLA - Probability Problems",
        "CRST - Critical Reasoning",
        "BIA - Business Intelligence Overview",
        "ADS - Advanced Data Structures",
        "WI - Web Integration",
        "CV - Computer Vision Pipeline",
        "ASP - Advanced System Programming"
    )

    init {
        loadNotes()
    }

    private fun loadNotes() {
        try {
            val assetManager = context.assets
            assetManager.open("notes_data.json").use { inputStream ->
                InputStreamReader(inputStream).use { reader ->
                    val rawJson = reader.readText()
                    val parsed = json.decodeFromString<List<Note>>(rawJson)
                    cachedNotes.clear()
                    cachedNotes.addAll(parsed)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            if (cachedNotes.isEmpty()) {
                cachedNotes.addAll(createFallbackNotes())
            }
        }
    }

    fun getAllNotes(): List<Note> = cachedNotes.toList()

    fun searchNotes(
        query: String = "",
        semester: String = "all",
        subject: String = "all",
        bookmarksOnly: Boolean = false
    ): List<Note> {
        val q = query.trim().lowercase()
        return cachedNotes.filter { note ->
            val matchesSearch = q.isEmpty() ||
                    note.title.lowercase().contains(q) ||
                    note.subject.lowercase().contains(q)

            val matchesSemester = semester == "all" || note.semester == semester
            val matchesSubject = subject == "all" || note.subject.equals(subject, ignoreCase = true)
            val matchesBookmark = !bookmarksOnly || note.isBookmarked

            matchesSearch && matchesSemester && matchesSubject && matchesBookmark
        }
    }

    fun rateNote(noteId: String, stars: Int): Note? {
        val index = cachedNotes.indexOfFirst { it.id == noteId }
        if (index != -1) {
            val note = cachedNotes[index]
            val oldRating = note.userRating
            val total = note.totalRatings
            val oldAvg = note.avgRating

            val newTotal = if (oldRating == 0) total + 1 else total
            val newAvg = if (oldRating == 0) {
                ((oldAvg * total) + stars) / newTotal
            } else {
                ((oldAvg * total) - oldRating + stars) / total
            }

            val updated = note.copy(
                avgRating = Math.round(newAvg * 100.0) / 100.0,
                totalRatings = newTotal,
                userRating = stars
            )
            cachedNotes[index] = updated
            return updated
        }
        return null
    }

    fun toggleBookmark(noteId: String): Boolean {
        val index = cachedNotes.indexOfFirst { it.id == noteId }
        if (index != -1) {
            val note = cachedNotes[index]
            val newBookmarkState = !note.isBookmarked
            cachedNotes[index] = note.copy(isBookmarked = newBookmarkState)
            return newBookmarkState
        }
        return false
    }

    fun getTodayTarget(): String {
        val dayIndex = ((System.currentTimeMillis() / (24 * 60 * 60 * 1000L)) % todaysTargets.size).toInt()
        return todaysTargets[Math.abs(dayIndex)]
    }

    private fun createFallbackNotes(): List<Note> {
        return listOf(
            Note(
                id = "note_1",
                title = "Linear Regression Comprehensive Notes",
                subject = "Data Science",
                semester = "3",
                size = "2.1 MB",
                fileUrl = "https://drive.google.com/file/d/188rdGm-gAwuQKq8IhaXuid-pKAkBWhV-/view",
                avgRating = 4.9,
                totalRatings = 34
            ),
            Note(
                id = "note_2",
                title = "Data Structures Complete Akash Notes",
                subject = "Data Structures",
                semester = "3",
                size = "4.2 MB",
                fileUrl = "https://drive.google.com/file/d/1_0qyW6J7E_WaIGTZBmfDmAjM8Uw2dyMw/view",
                avgRating = 4.8,
                totalRatings = 48
            ),
            Note(
                id = "note_3",
                title = "Principles of AI Handouts & Logic",
                subject = "Principles of Artificial Intelligence",
                semester = "3",
                size = "3.5 MB",
                fileUrl = "https://drive.google.com/file/d/11vy4frIf6WrQPAuFiMWuErw3_5Nelfxk/view",
                avgRating = 5.0,
                totalRatings = 29
            )
        )
    }
}
