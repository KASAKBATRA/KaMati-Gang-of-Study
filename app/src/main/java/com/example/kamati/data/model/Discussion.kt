package com.example.kamati.data.model

data class Discussion(
    val id: String,
    val title: String,
    val content: String,
    val author: String = "Anonymous",
    val semesterTag: String = "General",
    val repliesCount: Int = 0,
    val upvotes: Int = 0,
    val createdAt: String = "Just now",
    val isUpvoted: Boolean = false,
    val replies: List<Reply> = emptyList()
)

data class Reply(
    val id: String,
    val discussionId: String,
    val content: String,
    val author: String = "Anonymous",
    val upvotes: Int = 0,
    val createdAt: String = "Just now",
    val isUpvoted: Boolean = false
)
