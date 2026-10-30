import resourcesData from './resources.json';
import { SEMESTERS } from './curriculum';

export function getLocalApprovedResources() {
  try {
    const saved = localStorage.getItem('kamati_approved_resources');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export function getAllResources() {
  const localApproved = getLocalApprovedResources();
  return [...localApproved, ...resourcesData];
}

export function normalizeSubjectName(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getResourcesForSubject(subjectName, category = 'all') {
  const norm = normalizeSubjectName(subjectName);
  const all = getAllResources();
  return all.filter(res => {
    const resNorm = normalizeSubjectName(res.subject);
    const matchesSubject = resNorm === norm || 
      resNorm.includes(norm) || 
      norm.includes(resNorm);
    const matchesCategory = category === 'all' || res.category === category;
    return matchesSubject && matchesCategory;
  });
}

export function getResourcesForSemester(semNumber, category = 'all') {
  const semInt = parseInt(semNumber, 10);
  const all = getAllResources();
  return all.filter(res => {
    const matchesSem = res.semester === semInt;
    const matchesCategory = category === 'all' || res.category === category;
    return matchesSem && matchesCategory;
  });
}

export function searchResources(query, semester = 'all', category = 'all') {
  if (!query && semester === 'all' && category === 'all') {
    return resourcesData.slice(0, 50);
  }

  const q = (query || '').toLowerCase().trim();
  const qTerms = q.split(/\s+/).filter(Boolean);

  return resourcesData.filter(res => {
    const matchesSem = semester === 'all' || res.semester === parseInt(semester, 10);
    const matchesCat = category === 'all' || res.category === category;
    if (!matchesSem || !matchesCat) return false;

    if (qTerms.length === 0) return true;

    const targetText = `${res.title} ${res.subject} sem ${res.semester} semester ${res.semester} ${res.unit} ${res.year || ''}`.toLowerCase();
    return qTerms.every(term => targetText.includes(term));
  });
}

export function getRecentlyAdded(limit = 6) {
  // Return most recently added or prominent verified resources
  return [...resourcesData]
    .sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''))
    .slice(0, limit);
}

export function getSemesterStats(semNumber) {
  const semInt = parseInt(semNumber, 10);
  const semResources = resourcesData.filter(r => r.semester === semInt);
  const semObj = SEMESTERS.find(s => s.number === semInt);
  
  return {
    totalResources: semResources.length,
    notesCount: semResources.filter(r => r.category === 'notes').length,
    pyqCount: semResources.filter(r => r.category === 'pyq').length,
    revisionCount: semResources.filter(r => r.category === 'revision').length,
    syllabusCount: semResources.filter(r => r.category === 'syllabus').length,
    formulaCount: semResources.filter(r => r.category === 'formula').length,
    subjectsCount: semObj ? semObj.subjects.length : 0,
    subjects: semObj ? semObj.subjects : []
  };
}

export function getSubjectStats(subjectName) {
  const items = getResourcesForSubject(subjectName);
  return {
    total: items.length,
    notes: items.filter(r => r.category === 'notes').length,
    pyqs: items.filter(r => r.category === 'pyq').length,
    revision: items.filter(r => r.category === 'revision').length,
    syllabus: items.filter(r => r.category === 'syllabus').length,
    formulas: items.filter(r => r.category === 'formula').length
  };
}
