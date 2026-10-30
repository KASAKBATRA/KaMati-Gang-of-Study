package com.example.kamati.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.example.kamati.data.model.Discussion
import com.example.kamati.data.model.Note
import com.example.kamati.data.repository.DiscussionRepository
import com.example.kamati.data.repository.NotesRepository
import com.example.kamati.ui.components.AppTab
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class KamatiViewModel(application: Application) : AndroidViewModel(application) {

    private val notesRepo = NotesRepository(application)
    private val discussRepo = DiscussionRepository()

    private val _currentTab = MutableStateFlow(AppTab.HOME)
    val currentTab: StateFlow<AppTab> = _currentTab.asStateFlow()

    private val _isTeamScreenOpen = MutableStateFlow(false)
    val isTeamScreenOpen: StateFlow<Boolean> = _isTeamScreenOpen.asStateFlow()

    private val _isDarkTheme = MutableStateFlow(true)
    val isDarkTheme: StateFlow<Boolean> = _isDarkTheme.asStateFlow()

    private val _isFeedbackOpen = MutableStateFlow(false)
    val isFeedbackOpen: StateFlow<Boolean> = _isFeedbackOpen.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedSemester = MutableStateFlow("all")
    val selectedSemester: StateFlow<String> = _selectedSemester.asStateFlow()

    private val _selectedSubject = MutableStateFlow("all")
    val selectedSubject: StateFlow<String> = _selectedSubject.asStateFlow()

    private val _bookmarksOnly = MutableStateFlow(false)
    val bookmarksOnly: StateFlow<Boolean> = _bookmarksOnly.asStateFlow()

    private val _filteredNotes = MutableStateFlow<List<Note>>(emptyList())
    val filteredNotes: StateFlow<List<Note>> = _filteredNotes.asStateFlow()

    private val _discussions = MutableStateFlow<List<Discussion>>(emptyList())
    val discussions: StateFlow<List<Discussion>> = _discussions.asStateFlow()

    val semesterSubjects = notesRepo.semesterSubjects
    val todayTarget = notesRepo.getTodayTarget()

    init {
        refreshNotes()
        _discussions.value = discussRepo.getDiscussions()
    }

    fun setTab(tab: AppTab) {
        _currentTab.value = tab
        _isTeamScreenOpen.value = false
    }

    fun openTeamScreen() {
        _isTeamScreenOpen.value = true
    }

    fun closeTeamScreen() {
        _isTeamScreenOpen.value = false
    }

    fun toggleTheme() {
        _isDarkTheme.value = !_isDarkTheme.value
    }

    fun openFeedback() {
        _isFeedbackOpen.value = true
    }

    fun closeFeedback() {
        _isFeedbackOpen.value = false
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
        refreshNotes()
    }

    fun selectSemester(semester: String) {
        _selectedSemester.value = semester
        _selectedSubject.value = "all"
        refreshNotes()
    }

    fun selectSubject(subject: String) {
        _selectedSubject.value = subject
        refreshNotes()
    }

    fun toggleBookmarksOnly() {
        _bookmarksOnly.value = !_bookmarksOnly.value
        refreshNotes()
    }

    fun toggleBookmark(noteId: String) {
        notesRepo.toggleBookmark(noteId)
        refreshNotes()
    }

    fun rateNote(noteId: String, stars: Int) {
        notesRepo.rateNote(noteId, stars)
        refreshNotes()
    }

    fun createDiscussion(title: String, content: String, author: String, semester: String) {
        discussRepo.createDiscussion(title, content, author, semester)
        _discussions.value = discussRepo.getDiscussions()
    }

    fun addReply(discussionId: String, content: String, author: String) {
        discussRepo.addReply(discussionId, content, author)
        _discussions.value = discussRepo.getDiscussions()
    }

    fun toggleUpvoteDiscussion(discussionId: String) {
        discussRepo.toggleUpvoteDiscussion(discussionId)
        _discussions.value = discussRepo.getDiscussions()
    }

    fun toggleUpvoteReply(discussionId: String, replyId: String) {
        discussRepo.toggleUpvoteReply(discussionId, replyId)
        _discussions.value = discussRepo.getDiscussions()
    }

    fun deleteDiscussion(discussionId: String) {
        discussRepo.deleteDiscussion(discussionId)
        _discussions.value = discussRepo.getDiscussions()
    }

    private fun refreshNotes() {
        _filteredNotes.value = notesRepo.searchNotes(
            query = _searchQuery.value,
            semester = _selectedSemester.value,
            subject = _selectedSubject.value,
            bookmarksOnly = _bookmarksOnly.value
        )
    }
}
