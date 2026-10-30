package com.example.kamati.data.model

data class ExamItem(
    val semester: Int,
    val name: String,
    val subjectFullName: String,
    val dateString: String,
    val targetTimestampMs: Long
)
