package com.example.kamati.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Note(
    val id: String,
    val title: String,
    val subject: String,
    val semester: String,
    val size: String = "2 MB",
    @SerialName("file_url")
    val fileUrl: String = "",
    @SerialName("uploaded_at")
    val uploadedAt: String = "",
    @SerialName("avg_rating")
    var avgRating: Double = 4.8,
    @SerialName("total_ratings")
    var totalRatings: Int = 15,
    var isBookmarked: Boolean = false,
    var userRating: Int = 0
)
