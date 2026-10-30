package com.example.kamati.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.kamati.data.model.Note
import com.example.kamati.ui.components.NoteCard
import com.example.kamati.ui.theme.CyanPrimary
import com.example.kamati.ui.theme.GoldStar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesScreen(
    notes: List<Note>,
    semesterSubjects: Map<Int, List<String>>,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    selectedSemester: String,
    onSelectSemester: (String) -> Unit,
    selectedSubject: String,
    onSelectSubject: (String) -> Unit,
    bookmarksOnly: Boolean,
    onToggleBookmarksOnly: () -> Unit,
    onBookmarkToggle: (String) -> Unit,
    onRateNote: (String, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var subjectDropdownExpanded by remember { mutableStateOf(false) }

    val semesters = listOf("all", "1", "3", "4", "5", "6", "7")
    val subjectsForSemester = if (selectedSemester == "all") {
        emptyList()
    } else {
        semesterSubjects[selectedSemester.toIntOrNull() ?: 3] ?: emptyList()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .testTag("notes_screen")
    ) {
        // Search & Filters Header
        Surface(
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Search field
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    placeholder = { Text("Search by document title or subject...") },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = CyanPrimary
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchQueryChange("") }) {
                                Icon(Icons.Default.Close, contentDescription = "Clear search")
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyanPrimary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("search_input")
                )

                // Semester Chips row
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(semesters) { sem ->
                        val isSelected = selectedSemester == sem
                        FilterChip(
                            selected = isSelected,
                            onClick = {
                                onSelectSemester(sem)
                                onSelectSubject("all")
                            },
                            label = {
                                Text(if (sem == "all") "All Semesters" else "Sem $sem")
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = CyanPrimary,
                                selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                            ),
                            modifier = Modifier.testTag("filter_sem_$sem")
                        )
                    }

                    // Bookmark filter chip
                    item {
                        FilterChip(
                            selected = bookmarksOnly,
                            onClick = onToggleBookmarksOnly,
                            leadingIcon = {
                                Icon(
                                    imageVector = if (bookmarksOnly) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                    contentDescription = null,
                                    tint = if (bookmarksOnly) GoldStar else MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(16.dp)
                                )
                            },
                            label = { Text("Bookmarks") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = GoldStar.copy(alpha = 0.2f),
                                selectedLabelColor = MaterialTheme.colorScheme.onSurface
                            ),
                            modifier = Modifier.testTag("filter_bookmarks")
                        )
                    }
                }

                // Subject Dropdown (if semester selected)
                if (subjectsForSemester.isNotEmpty()) {
                    ExposedDropdownMenuBox(
                        expanded = subjectDropdownExpanded,
                        onExpandedChange = { subjectDropdownExpanded = !subjectDropdownExpanded },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedTextField(
                            value = if (selectedSubject == "all") "All Subjects" else selectedSubject,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Filter Subject") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = subjectDropdownExpanded) },
                            shape = RoundedCornerShape(12.dp),
                            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                                .testTag("subject_dropdown")
                        )
                        ExposedDropdownMenu(
                            expanded = subjectDropdownExpanded,
                            onDismissRequest = { subjectDropdownExpanded = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("All Subjects") },
                                onClick = {
                                    onSelectSubject("all")
                                    subjectDropdownExpanded = false
                                }
                            )
                            subjectsForSemester.forEach { subj ->
                                DropdownMenuItem(
                                    text = { Text(subj) },
                                    onClick = {
                                        onSelectSubject(subj)
                                        subjectDropdownExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                // Results count
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Showing ${notes.size} study resources",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    if (searchQuery.isNotEmpty() || selectedSemester != "all" || selectedSubject != "all" || bookmarksOnly) {
                        Text(
                            text = "Reset Filters",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = CyanPrimary,
                            modifier = Modifier
                                .clickable {
                                    onSearchQueryChange("")
                                    onSelectSemester("all")
                                    onSelectSubject("all")
                                    if (bookmarksOnly) onToggleBookmarksOnly()
                                }
                                .padding(4.dp)
                        )
                    }
                }
            }
        }

        // Notes List
        if (notes.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.SearchOff,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(56.dp)
                    )
                    Text(
                        text = "No study materials found",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Try clearing search keywords or choosing 'All Semesters'.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Button(
                        onClick = {
                            onSearchQueryChange("")
                            onSelectSemester("all")
                            onSelectSubject("all")
                            if (bookmarksOnly) onToggleBookmarksOnly()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Show All Notes")
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(notes, key = { it.id }) { note ->
                    NoteCard(
                        note = note,
                        onBookmarkToggle = { onBookmarkToggle(note.id) },
                        onRateNote = { stars -> onRateNote(note.id, stars) }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }
}
