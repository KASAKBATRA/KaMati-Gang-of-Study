package com.example.kamati.data.model

data class TeamMember(
    val id: String,
    val name: String,
    val role: String,
    val description: String,
    val linkedinUrl: String,
    val initialLetter: String,
    val badgeColorHex: Long
)
