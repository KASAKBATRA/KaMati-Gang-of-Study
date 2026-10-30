package com.example.kamati.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.EventNote
import androidx.compose.material.icons.filled.HourglassTop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.kamati.data.model.ExamItem
import com.example.kamati.ui.theme.CrimsonRed
import com.example.kamati.ui.theme.CyanPrimary
import com.example.kamati.ui.theme.EmeraldGreen
import kotlinx.coroutines.delay

@Composable
fun ExamTrackerScreen(
    todayTarget: String,
    modifier: Modifier = Modifier
) {
    var currentTimeMs by remember { mutableStateOf(System.currentTimeMillis()) }
    var selectedSemTab by remember { mutableStateOf(3) }

    // Live 1-second ticker
    LaunchedEffect(Unit) {
        while (true) {
            currentTimeMs = System.currentTimeMillis()
            delay(1000)
        }
    }

    // Static IPU datesheet items mapped across semesters
    val sem3Exams = remember {
        listOf(
            ExamItem(3, "UHV", "Universal Human Values", "15-Dec-2025", 1765770000000L),
            ExamItem(3, "DS", "Data Structures", "17-Dec-2025", 1765942800000L),
            ExamItem(3, "FODS", "Fundamentals of Data Science", "19-Dec-2025", 1766115600000L),
            ExamItem(3, "DLD", "Digital Logic Design", "22-Dec-2025", 1766374800000L),
            ExamItem(3, "PAI", "Principles of AI", "24-Dec-2025", 1766547600000L),
            ExamItem(3, "PSLA", "Probability, Stats & Linear Algebra", "27-Dec-2025", 1766806800000L),
            ExamItem(3, "CRST", "Critical Reasoning & System Thinking", "30-Dec-2025", 1767066000000L)
        )
    }

    val sem5Exams = remember {
        listOf(
            ExamItem(5, "PME", "Principles of Management & Economics", "16-Dec-2025", 1765856400000L),
            ExamItem(5, "DAA", "Design and Analysis of Algorithms", "18-Dec-2025", 1766029200000L),
            ExamItem(5, "FODL", "Fundamentals of Deep Learning", "20-Dec-2025", 1766202000000L),
            ExamItem(5, "COA", "Computer Architecture & Organization", "23-Dec-2025", 1766461200000L),
            ExamItem(5, "IOT", "Internet of Things", "26-Dec-2025", 1766720400000L),
            ExamItem(5, "OS", "Operating Systems", "31-Dec-2025", 1767152400000L)
        )
    }

    val sem7Exams = remember {
        listOf(
            ExamItem(7, "PEM", "Principles of Engineering Management", "15-Dec-2025", 1765770000000L),
            ExamItem(7, "BIA", "Business Intelligence & Analytics", "17-Dec-2025", 1765942800000L),
            ExamItem(7, "ADS", "Advanced Data Structures", "19-Dec-2025", 1766115600000L),
            ExamItem(7, "WI", "Web Intelligence", "22-Dec-2025", 1766374800000L),
            ExamItem(7, "CV", "Computer Vision", "24-Dec-2025", 1766547600000L),
            ExamItem(7, "ASP", "Advanced System Programming", "02-Jan-2026", 1767325200000L)
        )
    }

    val currentExams = when (selectedSemTab) {
        3 -> sem3Exams
        5 -> sem5Exams
        else -> sem7Exams
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .testTag("exam_tracker_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        item {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = "Exam Datesheets & Timers",
                    style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Real-time countdowns for end-term examinations",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Today's Target Highlight
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                border = BorderStroke(1.dp, CyanPrimary.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(CyanPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.HourglassTop, contentDescription = null, tint = CyanPrimary)
                    }
                    Column {
                        Text(
                            text = "TODAY'S STUDY RECOMMENDATION",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = CyanPrimary
                        )
                        Text(
                            text = todayTarget,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }
        }

        // Semester Tab Switcher
        item {
            TabRow(
                selectedTabIndex = if (selectedSemTab == 3) 0 else if (selectedSemTab == 5) 1 else 2,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = CyanPrimary
            ) {
                Tab(
                    selected = selectedSemTab == 3,
                    onClick = { selectedSemTab = 3 },
                    text = { Text("Semester 3", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("exam_tab_sem3")
                )
                Tab(
                    selected = selectedSemTab == 5,
                    onClick = { selectedSemTab = 5 },
                    text = { Text("Semester 5", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("exam_tab_sem5")
                )
                Tab(
                    selected = selectedSemTab == 7,
                    onClick = { selectedSemTab = 7 },
                    text = { Text("Semester 7", fontWeight = FontWeight.Bold) },
                    modifier = Modifier.testTag("exam_tab_sem7")
                )
            }
        }

        // Exam Cards list
        items(currentExams) { exam ->
            val diffMs = exam.targetTimestampMs - currentTimeMs
            val isCompleted = diffMs <= 0

            val days = if (diffMs > 0) diffMs / (1000 * 60 * 60 * 24) else 0
            val hours = if (diffMs > 0) (diffMs / (1000 * 60 * 60)) % 24 else 0
            val minutes = if (diffMs > 0) (diffMs / (1000 * 60)) % 60 else 0
            val seconds = if (diffMs > 0) (diffMs / 1000) % 60 else 0

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                border = BorderStroke(
                    1.dp,
                    if (isCompleted) MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                    else CyanPrimary.copy(alpha = 0.4f)
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("exam_card_${exam.name}")
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = CyanPrimary.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = exam.name,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = CyanPrimary
                                    ),
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                            Text(
                                text = exam.subjectFullName,
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isCompleted) MaterialTheme.colorScheme.surfaceVariant else EmeraldGreen.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = if (isCompleted) "Completed" else "Upcoming",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = if (isCompleted) MaterialTheme.colorScheme.onSurfaceVariant else EmeraldGreen
                                ),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.EventNote,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = exam.dateString,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        if (!isCompleted) {
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.AccessTime,
                                        contentDescription = null,
                                        tint = CyanPrimary,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Text(
                                        text = "${days}d ${String.format("%02d", hours)}h ${String.format("%02d", minutes)}m ${String.format("%02d", seconds)}s",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontFamily = FontFamily.Monospace,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                    )
                                }
                            }
                        } else {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = "Exam Finished",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
