package com.example.kamati

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.kamati.ui.components.AppTab
import com.example.kamati.ui.components.BottomNavBar
import com.example.kamati.ui.components.FeedbackDialog
import com.example.kamati.ui.components.TopHeaderBar
import com.example.kamati.ui.screens.*
import com.example.kamati.ui.theme.KaMaTiTheme
import com.example.kamati.ui.viewmodel.KamatiViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: KamatiViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val isDarkTheme by viewModel.isDarkTheme.collectAsStateWithLifecycle()
            val currentTab by viewModel.currentTab.collectAsStateWithLifecycle()
            val isTeamScreenOpen by viewModel.isTeamScreenOpen.collectAsStateWithLifecycle()
            val isFeedbackOpen by viewModel.isFeedbackOpen.collectAsStateWithLifecycle()

            val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
            val selectedSemester by viewModel.selectedSemester.collectAsStateWithLifecycle()
            val selectedSubject by viewModel.selectedSubject.collectAsStateWithLifecycle()
            val bookmarksOnly by viewModel.bookmarksOnly.collectAsStateWithLifecycle()
            val filteredNotes by viewModel.filteredNotes.collectAsStateWithLifecycle()
            val discussions by viewModel.discussions.collectAsStateWithLifecycle()

            var showSplash by remember { mutableStateOf(true) }

            KaMaTiTheme(darkTheme = isDarkTheme) {
                if (showSplash) {
                    SplashScreen(
                        onFinishSplash = { showSplash = false }
                    )
                } else {
                    BackHandler(enabled = isTeamScreenOpen || currentTab != AppTab.HOME) {
                        if (isTeamScreenOpen) {
                            viewModel.closeTeamScreen()
                        } else {
                            viewModel.setTab(AppTab.HOME)
                        }
                    }

                    Scaffold(
                        topBar = {
                            if (!isTeamScreenOpen) {
                                TopHeaderBar(
                                    isDarkTheme = isDarkTheme,
                                    onToggleTheme = { viewModel.toggleTheme() },
                                    onOpenFeedback = { viewModel.openFeedback() }
                                )
                            }
                        },
                        bottomBar = {
                            if (!isTeamScreenOpen) {
                                BottomNavBar(
                                    selectedTab = currentTab,
                                    onTabSelected = { viewModel.setTab(it) }
                                )
                            }
                        },
                        modifier = Modifier.fillMaxSize()
                    ) { innerPadding ->
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)
                        ) {
                            if (isTeamScreenOpen) {
                                TeamScreen(
                                    onBack = { viewModel.closeTeamScreen() }
                                )
                            } else {
                                when (currentTab) {
                                    AppTab.HOME -> {
                                        HomeScreen(
                                            todayTarget = viewModel.todayTarget,
                                            onNavigateToTab = { viewModel.setTab(it) },
                                            onSelectSemester = { sem ->
                                                viewModel.selectSemester(sem)
                                            },
                                            onOpenTeam = { viewModel.openTeamScreen() }
                                        )
                                    }
                                    AppTab.NOTES -> {
                                        NotesScreen(
                                            notes = filteredNotes,
                                            semesterSubjects = viewModel.semesterSubjects,
                                            searchQuery = searchQuery,
                                            onSearchQueryChange = { viewModel.setSearchQuery(it) },
                                            selectedSemester = selectedSemester,
                                            onSelectSemester = { viewModel.selectSemester(it) },
                                            selectedSubject = selectedSubject,
                                            onSelectSubject = { viewModel.selectSubject(it) },
                                            bookmarksOnly = bookmarksOnly,
                                            onToggleBookmarksOnly = { viewModel.toggleBookmarksOnly() },
                                            onBookmarkToggle = { viewModel.toggleBookmark(it) },
                                            onRateNote = { noteId, stars ->
                                                viewModel.rateNote(noteId, stars)
                                            }
                                        )
                                    }
                                    AppTab.EXAMS -> {
                                        ExamTrackerScreen(
                                            todayTarget = viewModel.todayTarget
                                        )
                                    }
                                    AppTab.DISCUSS -> {
                                        DiscussionScreen(
                                            discussions = discussions,
                                            onCreateDiscussion = { title, content, author, sem ->
                                                viewModel.createDiscussion(title, content, author, sem)
                                            },
                                            onAddReply = { discId, content, author ->
                                                viewModel.addReply(discId, content, author)
                                            },
                                            onToggleUpvoteDiscussion = {
                                                viewModel.toggleUpvoteDiscussion(it)
                                            },
                                            onToggleUpvoteReply = { discId, replyId ->
                                                viewModel.toggleUpvoteReply(discId, replyId)
                                            },
                                            onDeleteDiscussion = {
                                                viewModel.deleteDiscussion(it)
                                            }
                                        )
                                    }
                                    AppTab.ABOUT -> {
                                        AboutScreen(
                                            onOpenTeam = { viewModel.openTeamScreen() },
                                            onOpenFeedback = { viewModel.openFeedback() }
                                        )
                                    }
                                }
                            }
                        }

                        FeedbackDialog(
                            isOpen = isFeedbackOpen,
                            onDismiss = { viewModel.closeFeedback() }
                        )
                    }
                }
            }
        }
    }
}
