package com.example.kamati.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.kamati.data.model.Discussion
import com.example.kamati.ui.theme.CrimsonRed
import com.example.kamati.ui.theme.CyanPrimary

@Composable
fun DiscussionScreen(
    discussions: List<Discussion>,
    onCreateDiscussion: (String, String, String, String) -> Unit,
    onAddReply: (String, String, String) -> Unit,
    onToggleUpvoteDiscussion: (String) -> Unit,
    onToggleUpvoteReply: (String, String) -> Unit,
    onDeleteDiscussion: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var showNewDiscussionDialog by remember { mutableStateOf(false) }
    var expandedDiscussionId by remember { mutableStateOf<String?>(null) }
    var replyingToDiscussionId by remember { mutableStateOf<String?>(null) }
    var deleteConfirmDiscussionId by remember { mutableStateOf<String?>(null) }

    var newTitle by remember { mutableStateOf("") }
    var newContent by remember { mutableStateOf("") }
    var newAuthor by remember { mutableStateOf("") }
    var newSemester by remember { mutableStateOf("Sem 3") }

    var replyContent by remember { mutableStateOf("") }
    var replyAuthor by remember { mutableStateOf("") }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showNewDiscussionDialog = true },
                containerColor = CyanPrimary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
                shape = CircleShape,
                modifier = Modifier.testTag("new_discussion_fab")
            ) {
                Icon(Icons.Default.Add, contentDescription = "New Discussion")
            }
        },
        modifier = modifier.fillMaxSize()
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .testTag("discussion_screen"),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "Student Discussions & Forum",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Ask questions, share syllabus doubts & clarify end-term concepts.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (discussions.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(48.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.ChatBubbleOutline,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(48.dp)
                            )
                            Text(
                                text = "No discussions yet.",
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "Be the first to start a conversation!",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            } else {
                items(discussions, key = { it.id }) { disc ->
                    val isExpanded = expandedDiscussionId == disc.id

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("discussion_card_${disc.id}")
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Top metadata row
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = CyanPrimary.copy(alpha = 0.15f)
                                    ) {
                                        Text(
                                            text = disc.semesterTag,
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = CyanPrimary
                                            ),
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                    Text(
                                        text = "Posted by ${disc.author} • ${disc.createdAt}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                IconButton(
                                    onClick = { deleteConfirmDiscussionId = disc.id },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Delete",
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }

                            // Title & Content
                            Text(
                                text = disc.title,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            Text(
                                text = disc.content,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            // Action buttons: Upvote & Replies
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedButton(
                                        onClick = { onToggleUpvoteDiscussion(disc.id) },
                                        shape = RoundedCornerShape(8.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(
                                            contentColor = if (disc.isUpvoted) CyanPrimary else MaterialTheme.colorScheme.onSurface
                                        ),
                                        modifier = Modifier.testTag("upvote_${disc.id}")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.ThumbUp,
                                            contentDescription = "Upvote",
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(text = "${disc.upvotes}")
                                    }

                                    Button(
                                        onClick = {
                                            expandedDiscussionId = if (isExpanded) null else disc.id
                                        },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = MaterialTheme.colorScheme.surface,
                                            contentColor = MaterialTheme.colorScheme.onSurface
                                        ),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.ChatBubble,
                                            contentDescription = null,
                                            tint = CyanPrimary,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(text = "${disc.replies.size} Replies")
                                    }
                                }

                                TextButton(onClick = { replyingToDiscussionId = disc.id }) {
                                    Icon(Icons.Default.Reply, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Reply")
                                }
                            }

                            // Replies accordion
                            AnimatedVisibility(visible = isExpanded && disc.replies.isNotEmpty()) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(top = 8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                                    Text(
                                        text = "Replies (${disc.replies.size}):",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                        color = CyanPrimary
                                    )
                                    disc.replies.forEach { r ->
                                        Surface(
                                            shape = RoundedCornerShape(10.dp),
                                            color = MaterialTheme.colorScheme.surface,
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Column(
                                                modifier = Modifier.padding(10.dp),
                                                verticalArrangement = Arrangement.spacedBy(4.dp)
                                            ) {
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Text(
                                                        text = r.author,
                                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                                        color = MaterialTheme.colorScheme.onSurface
                                                    )
                                                    Text(
                                                        text = r.createdAt,
                                                        style = MaterialTheme.typography.labelSmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                                Text(
                                                    text = r.content,
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    color = MaterialTheme.colorScheme.onSurface
                                                )
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.End,
                                                    verticalAlignment = Alignment.CenterVertically
                                                ) {
                                                    IconButton(
                                                        onClick = { onToggleUpvoteReply(disc.id, r.id) },
                                                        modifier = Modifier.size(24.dp)
                                                    ) {
                                                        Icon(
                                                            imageVector = Icons.Default.ThumbUp,
                                                            contentDescription = "Upvote reply",
                                                            tint = if (r.isUpvoted) CyanPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                                            modifier = Modifier.size(14.dp)
                                                        )
                                                    }
                                                    Text(
                                                        text = "${r.upvotes}",
                                                        style = MaterialTheme.typography.labelSmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(60.dp))
            }
        }
    }

    // New Discussion Dialog
    if (showNewDiscussionDialog) {
        AlertDialog(
            onDismissRequest = { showNewDiscussionDialog = false },
            title = { Text("Start a New Discussion", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = newTitle,
                        onValueChange = { newTitle = it },
                        label = { Text("Question or Topic Title") },
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("new_discussion_title_input")
                    )
                    OutlinedTextField(
                        value = newContent,
                        onValueChange = { newContent = it },
                        label = { Text("Details or Description") },
                        maxLines = 4,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("new_discussion_content_input")
                    )
                    OutlinedTextField(
                        value = newAuthor,
                        onValueChange = { newAuthor = it },
                        label = { Text("Your Name (Optional)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newTitle.isNotBlank() && newContent.isNotBlank()) {
                            onCreateDiscussion(newTitle, newContent, newAuthor, newSemester)
                            showNewDiscussionDialog = false
                            newTitle = ""
                            newContent = ""
                            newAuthor = ""
                            Toast.makeText(context, "Discussion posted!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Please enter title and content", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary),
                    modifier = Modifier.testTag("submit_new_discussion_button")
                ) {
                    Text("Post Discussion")
                }
            },
            dismissButton = {
                TextButton(onClick = { showNewDiscussionDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Reply Dialog
    if (replyingToDiscussionId != null) {
        AlertDialog(
            onDismissRequest = { replyingToDiscussionId = null },
            title = { Text("Post a Reply", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = replyContent,
                        onValueChange = { replyContent = it },
                        label = { Text("Your Reply / Solution") },
                        maxLines = 3,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("reply_content_input")
                    )
                    OutlinedTextField(
                        value = replyAuthor,
                        onValueChange = { replyAuthor = it },
                        label = { Text("Your Name (Optional)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (replyContent.isNotBlank()) {
                            onAddReply(replyingToDiscussionId!!, replyContent, replyAuthor)
                            replyingToDiscussionId = null
                            replyContent = ""
                            replyAuthor = ""
                            Toast.makeText(context, "Reply added!", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary),
                    modifier = Modifier.testTag("submit_reply_button")
                ) {
                    Text("Post Reply")
                }
            },
            dismissButton = {
                TextButton(onClick = { replyingToDiscussionId = null }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Delete Confirmation Dialog
    if (deleteConfirmDiscussionId != null) {
        AlertDialog(
            onDismissRequest = { deleteConfirmDiscussionId = null },
            title = { Text("Delete Discussion?", fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to delete this discussion thread?") },
            confirmButton = {
                Button(
                    onClick = {
                        onDeleteDiscussion(deleteConfirmDiscussionId!!)
                        deleteConfirmDiscussionId = null
                        Toast.makeText(context, "Discussion deleted", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonRed)
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { deleteConfirmDiscussionId = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
