package com.example.kamati.data.repository

import com.example.kamati.data.model.Discussion
import com.example.kamati.data.model.Reply
import java.util.UUID

class DiscussionRepository {

    private val discussions = mutableListOf<Discussion>()

    init {
        seedDiscussions()
    }

    private fun seedDiscussions() {
        discussions.addAll(
            listOf(
                Discussion(
                    id = "disc_1",
                    title = "Where can I find Unit 4 FODS short revision notes?",
                    content = "Hey everyone! Does anyone have concise formula sheets and short notes for Unit 4 of Data Science (Predictive Mining & Regression)?",
                    author = "Aman Verma",
                    semesterTag = "Sem 3",
                    repliesCount = 2,
                    upvotes = 14,
                    createdAt = "2 hours ago",
                    replies = listOf(
                        Reply(
                            id = "reply_1",
                            discussionId = "disc_1",
                            content = "Check out 'FODS FOR END TERM UNIT 1,2 and 4' in the Notes tab! It covers all derivations.",
                            author = "Kasak Batra",
                            upvotes = 8,
                            createdAt = "1 hour ago"
                        ),
                        Reply(
                            id = "reply_2",
                            discussionId = "disc_1",
                            content = "Also the python libraries cheat sheet is super helpful for practicals.",
                            author = "Akshat Pal",
                            upvotes = 5,
                            createdAt = "45 mins ago"
                        )
                    )
                ),
                Discussion(
                    id = "disc_2",
                    title = "DAA Greedy vs Dynamic Programming questions in End Term",
                    content = "What are the most repeated question patterns for DAA in semester 5? Are Knapsack and Huffman coding guaranteed?",
                    author = "Rohan Sethi",
                    semesterTag = "Sem 5",
                    repliesCount = 1,
                    upvotes = 9,
                    createdAt = "Yesterday",
                    replies = listOf(
                        Reply(
                            id = "reply_3",
                            discussionId = "disc_2",
                            content = "0/1 Knapsack using DP and Fractional Knapsack via Greedy are asked almost every year. Practice both!",
                            author = "Himanshi Sharma",
                            upvotes = 6,
                            createdAt = "Yesterday"
                        )
                    )
                ),
                Discussion(
                    id = "disc_3",
                    title = "Sem 7 Practical Files & Viva preparation tips",
                    content = "Any senior here who can guide about the viva questions for Computer Vision and Advanced System Programming?",
                    author = "Priya Nair",
                    semesterTag = "Sem 7",
                    repliesCount = 1,
                    upvotes = 11,
                    createdAt = "2 days ago",
                    replies = listOf(
                        Reply(
                            id = "reply_4",
                            discussionId = "disc_3",
                            content = "For CV, focus on edge detection filters (Sobel, Canny) and Convolution kernels. The practical files in Sem 7 have sample viva questions.",
                            author = "Reachal Jain",
                            upvotes = 7,
                            createdAt = "2 days ago"
                        )
                    )
                )
            )
        )
    }

    fun getDiscussions(): List<Discussion> = discussions.toList()

    fun createDiscussion(title: String, content: String, author: String, semester: String): Discussion {
        val newDisc = Discussion(
            id = UUID.randomUUID().toString(),
            title = title,
            content = content,
            author = if (author.isBlank()) "Anonymous" else author,
            semesterTag = semester,
            repliesCount = 0,
            upvotes = 1,
            createdAt = "Just now",
            isUpvoted = true
        )
        discussions.add(0, newDisc)
        return newDisc
    }

    fun addReply(discussionId: String, content: String, author: String): Reply? {
        val index = discussions.indexOfFirst { it.id == discussionId }
        if (index != -1) {
            val disc = discussions[index]
            val reply = Reply(
                id = UUID.randomUUID().toString(),
                discussionId = discussionId,
                content = content,
                author = if (author.isBlank()) "Anonymous" else author,
                upvotes = 1,
                createdAt = "Just now",
                isUpvoted = true
            )
            val updatedReplies = disc.replies + reply
            discussions[index] = disc.copy(
                replies = updatedReplies,
                repliesCount = updatedReplies.size
            )
            return reply
        }
        return null
    }

    fun toggleUpvoteDiscussion(discussionId: String): Discussion? {
        val index = discussions.indexOfFirst { it.id == discussionId }
        if (index != -1) {
            val disc = discussions[index]
            val newUpvoted = !disc.isUpvoted
            val newCount = if (newUpvoted) disc.upvotes + 1 else disc.upvotes - 1
            val updated = disc.copy(isUpvoted = newUpvoted, upvotes = newCount)
            discussions[index] = updated
            return updated
        }
        return null
    }

    fun toggleUpvoteReply(discussionId: String, replyId: String): Reply? {
        val discIndex = discussions.indexOfFirst { it.id == discussionId }
        if (discIndex != -1) {
            val disc = discussions[discIndex]
            val replyIndex = disc.replies.indexOfFirst { it.id == replyId }
            if (replyIndex != -1) {
                val r = disc.replies[replyIndex]
                val newUpvoted = !r.isUpvoted
                val newCount = if (newUpvoted) r.upvotes + 1 else r.upvotes - 1
                val updatedReply = r.copy(isUpvoted = newUpvoted, upvotes = newCount)
                val newReplies = disc.replies.toMutableList()
                newReplies[replyIndex] = updatedReply
                discussions[discIndex] = disc.copy(replies = newReplies)
                return updatedReply
            }
        }
        return null
    }

    fun deleteDiscussion(discussionId: String): Boolean {
        return discussions.removeAll { it.id == discussionId }
    }
}
