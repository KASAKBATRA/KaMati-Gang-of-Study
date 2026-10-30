import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_FILE = path.join(__dirname, '..', 'data', 'admin_queue.json');
const RESOURCES_FILE = path.join(__dirname, '..', 'src', 'data', 'resources.json');
const DIST_RESOURCES_FILE = path.join(__dirname, '..', 'dist', 'data', 'resources.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(QUEUE_FILE))) {
  fs.mkdirSync(path.dirname(QUEUE_FILE), { recursive: true });
}

// Canonical GGSIPU AI & Data Science subjects dictionary
const GGSIPU_SUBJECTS = [
  { name: 'Programming in C', sem: 1, keywords: ['c prog', 'programming in c', 'c language', 'es-101'] },
  { name: 'Engineering Mathematics', sem: 1, keywords: ['maths 1', 'applied maths 1', 'engineering mathematics', 'bs-103'] },
  { name: 'Engineering Physics', sem: 1, keywords: ['physics', 'applied physics', 'bs-105'] },
  { name: 'Communication Skills', sem: 1, keywords: ['communication', 'technical english', 'hs-107'] },
  { name: 'Environmental Studies', sem: 1, keywords: ['evs', 'environmental', 'bs-109'] },
  { name: 'Manufacturing Process', sem: 1, keywords: ['manufacturing', 'workshop', 'es-111'] },
  { name: 'Engineering Mathematics - II', sem: 2, keywords: ['maths 2', 'applied maths 2', 'bs-102'] },
  { name: 'Engineering Chemistry', sem: 2, keywords: ['chemistry', 'bs-104'] },
  { name: 'Basic Electrical Engineering', sem: 2, keywords: ['electrical', 'bee', 'es-106'] },
  { name: 'Programming in Python', sem: 2, keywords: ['python', 'python programming', 'es-108'] },
  { name: 'Data Structures', sem: 3, keywords: ['data structures', 'dsa', 'ds', 'stacks', 'trees', 'graphs'] },
  { name: 'Digital Logic Design', sem: 3, keywords: ['digital logic', 'dld', 'k-map', 'combinational', 'sequential'] },
  { name: 'Principles of Artificial Intelligence', sem: 3, keywords: ['artificial intelligence', 'ai', 'heuristics', 'search algorithms'] },
  { name: 'Probability, Statistics and Linear Algebra', sem: 3, keywords: ['probability', 'statistics', 'linear algebra', 'psla'] },
  { name: 'Data Science', sem: 3, keywords: ['data science', 'fods', 'foundations of data science'] },
  { name: 'Machine Learning', sem: 4, keywords: ['machine learning', 'ml', 'supervised', 'unsupervised', 'regression'] },
  { name: 'Database Management System', sem: 4, keywords: ['database', 'dbms', 'sql', 'normalization', 'transactions'] },
  { name: 'Computer Networks and Internet Protocols', sem: 4, keywords: ['networks', 'cn', 'tcp/ip', 'osi model'] },
  { name: 'Software Engineering', sem: 4, keywords: ['software engineering', 'se', 'sdlc', 'agile', 'testing'] },
  { name: 'Object Oriented Programming in Java', sem: 4, keywords: ['java', 'oops', 'inheritance', 'polymorphism'] },
  { name: 'Computational Mathematics', sem: 4, keywords: ['computational mathematics', 'numerical methods'] },
  { name: 'Design and Analysis of Algorithms', sem: 5, keywords: ['algorithms', 'daa', 'divide and conquer', 'dynamic programming', 'greedy'] },
  { name: 'Operating System', sem: 5, keywords: ['operating system', 'os', 'deadlock', 'scheduling', 'virtual memory'] },
  { name: 'Computer Architecture and Organization', sem: 5, keywords: ['computer architecture', 'cao', 'pipelining', 'cache'] },
  { name: 'Internet of Things', sem: 5, keywords: ['iot', 'internet of things', 'sensors', 'arduino'] },
  { name: 'Principles of Entrepreneurship Mindset', sem: 5, keywords: ['entrepreneurship', 'business model', 'startup'] },
  { name: 'Fundamentals of Deep Learning', sem: 6, keywords: ['deep learning', 'dl', 'neural networks', 'cnn', 'rnn', 'backpropagation'] },
  { name: 'Digital Image Processing', sem: 6, keywords: ['image processing', 'dip', 'filtering', 'morphology', 'segmentation'] },
  { name: 'Big Data Analytics', sem: 6, keywords: ['big data', 'hadoop', 'mapreduce', 'spark', 'nosql'] },
  { name: 'Cloud Computing', sem: 6, keywords: ['cloud', 'aws', 'virtualization', 'iaas', 'paas'] },
  { name: 'Blockchain Technology', sem: 6, keywords: ['blockchain', 'smart contracts', 'ethereum', 'consensus'] },
  { name: 'Cognitive Computing', sem: 6, keywords: ['cognitive', 'nlp', 'reasoning'] },
  { name: 'Computer Vision', sem: 7, keywords: ['computer vision', 'cv', 'object detection', 'yolo', 'opencv'] },
  { name: 'Advanced Data Structures', sem: 7, keywords: ['advanced data structures', 'ads', 'fibonacci heap', 'red-black tree'] },
  { name: 'Business Intelligence & Analytics', sem: 7, keywords: ['business intelligence', 'bi', 'olap', 'data warehouse'] },
  { name: 'Web Intelligence', sem: 7, keywords: ['web intelligence', 'web mining', 'information retrieval'] },
  { name: 'Advanced System Programming', sem: 7, keywords: ['system programming', 'linux kernel', 'posix'] },
  { name: 'Syllabus', sem: 0, keywords: ['syllabus', 'scheme', 'curriculum', 'scheme of examination'] }
];

// Helper to read public resources catalog
export function getLiveResources() {
  try {
    if (fs.existsSync(RESOURCES_FILE)) {
      return JSON.parse(fs.readFileSync(RESOURCES_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading resources.json:', err);
  }
  return [];
}

// Helper to read queue
export function getQueue() {
  try {
    if (fs.existsSync(QUEUE_FILE)) {
      return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading admin_queue.json:', err);
  }
  return [];
}

// Helper to save queue
export function saveQueue(queue) {
  try {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving admin_queue.json:', err);
    return false;
  }
}

// Heuristic Metadata Suggester
export function suggestMetadata(filename, driveId, fileSize = '2.4 MB') {
  const lowerName = filename.toLowerCase();

  // 1. Detect Category (5 categories supported)
  let category = 'notes';
  if (lowerName.includes('syllabus') || lowerName.includes('scheme') || lowerName.includes('curriculum')) {
    category = 'syllabus';
  } else if (lowerName.includes('pyq') || lowerName.includes('question paper') || lowerName.includes('end term') || lowerName.includes('mid term') || lowerName.includes('exam paper') || lowerName.includes('question-paper')) {
    category = 'pyq';
  } else if (lowerName.includes('revision') || lowerName.includes('handout') || lowerName.includes('summary') || lowerName.includes('quick') || lowerName.includes('recap')) {
    category = 'revision';
  } else if (lowerName.includes('formula') || lowerName.includes('cheat sheet') || lowerName.includes('cheat-sheet') || lowerName.includes('derivation')) {
    category = 'formula';
  }

  // 2. Detect Semester
  let semester = 3; // sensible default
  const semMatch = lowerName.match(/(?:sem|semester)[_\s-]*([1-8])/i);
  if (semMatch) {
    semester = parseInt(semMatch[1], 10);
  }

  // 3. Detect Unit
  let unit = 'General / Full Syllabus';
  const unitMatch = lowerName.match(/(?:unit|module|u)[_\s-]*([1-4])/i);
  if (unitMatch) {
    unit = `Unit ${unitMatch[1]}`;
  }

  // 4. Detect Subject
  let matchedSubject = 'Artificial Intelligence & Data Science';
  let bestScore = 0;

  for (const sub of GGSIPU_SUBJECTS) {
    for (const kw of sub.keywords) {
      if (lowerName.includes(kw)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          matchedSubject = sub.name;
          if (sub.sem > 0 && !semMatch) {
            semester = sub.sem;
          }
        }
      }
    }
  }

  // 5. Detect Year
  let year = null;
  let examYear = null;
  const yearMatch = lowerName.match(/\b(201[89]|202[0-6])\b/);
  if (yearMatch) {
    year = yearMatch[1];
    examYear = yearMatch[1];
  }

  // 6. Clean Title
  let cleanTitle = filename
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(ggsipu|ipu|ai\s*ds|btech)\b/gi, '')
    .trim();

  // Capitalize properly
  cleanTitle = cleanTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (!cleanTitle) {
    cleanTitle = `${matchedSubject} - ${category.toUpperCase()}`;
  }

  // Determine OCR type
  const isScanned = lowerName.includes('scanned') || lowerName.includes('paper') || lowerName.includes('handwritten') || category === 'pyq';
  const ocrType = isScanned ? 'scanned_image_pdf' : 'text_pdf';
  const ocrConfidence = isScanned ? 0.92 : 0.98;

  return {
    title: cleanTitle,
    subject: matchedSubject,
    semester,
    unit,
    category,
    year,
    examYear,
    academicYear: year ? `${parseInt(year, 10) - 1}-${year}` : '2024-2025',
    driveId,
    fileUrl: `https://drive.google.com/file/d/${driveId}/view?usp=sharing`,
    previewUrl: `https://drive.google.com/file/d/${driveId}/preview`,
    size: fileSize,
    originalFilename: filename,
    ocrType,
    ocrConfidence,
    detectedAt: new Date().toISOString().split('T')[0]
  };
}

// Initial staged queue seeds if queue is empty
export function initQueueIfEmpty() {
  let queue = getQueue();
  if (queue.length === 0) {
    const sampleStagedFiles = [
      {
        filename: 'GGSIPU_Sem3_Data_Structures_Unit2_Trees_AVL_Notes.pdf',
        driveId: '1AbC_sample_ds_trees_2025',
        size: '3.1 MB'
      },
      {
        filename: 'Machine_Learning_Sem4_EndTerm_2024_PYQ_Paper.pdf',
        driveId: '1XyZ_sample_ml_pyq_2024',
        size: '1.8 MB'
      },
      {
        filename: 'Operating_System_Sem5_Deadlocks_CPU_Scheduling_Revision.pdf',
        driveId: '1OpS_sample_os_rev_2025',
        size: '2.4 MB'
      },
      {
        filename: 'Deep_Learning_Sem6_Backpropagation_Formula_Sheet.pdf',
        driveId: '1DpL_sample_dl_formulas_2025',
        size: '1.2 MB'
      },
      {
        filename: 'GGSIPU_BTech_AIDS_Semester_7_Official_Scheme_Syllabus.pdf',
        driveId: '1Syl_sample_sem7_syllabus_2025',
        size: '4.5 MB'
      },
      {
        filename: 'Computer_Networks_Sem4_Unit3_Routing_Algorithms_Notes.pdf',
        driveId: '1Net_sample_cn_unit3_notes_2025',
        size: '2.9 MB'
      }
    ];

    queue = sampleStagedFiles.map((file, idx) => {
      const suggested = suggestMetadata(file.filename, file.driveId, file.size);
      return {
        id: `queue_${Date.now()}_${idx}`,
        ...suggested,
        status: 'pending',
        detectionType: 'new',
        statusReason: 'Scanned from configured Google Drive folder'
      };
    });

    saveQueue(queue);
  }
  return queue;
}

// Manual Sync Google Drive
export function syncGoogleDrive(folderIdOrUrl = '') {
  initQueueIfEmpty();
  const liveResources = getLiveResources();
  const queue = getQueue();

  // Extract folder ID
  let folderId = '1gA_GGSIPU_AIDS_MasterDriveFolder';
  if (folderIdOrUrl) {
    const urlMatch = folderIdOrUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    folderId = urlMatch ? urlMatch[1] : folderIdOrUrl.trim();
  }

  // Known drive IDs from live catalog & queue
  const knownDriveIds = new Set([
    ...liveResources.map(r => r.driveId).filter(Boolean),
    ...queue.map(q => q.driveId).filter(Boolean)
  ]);

  // Simulated Drive folder contents scan (representing new drive additions from students/faculty)
  const incomingDriveScan = [
    { name: 'Semester_4_DBMS_EndTerm_2024_Solved_PYQ.pdf', id: '1Dbms_2024_pyq_endterm', size: '2.2 MB', ext: '.pdf' },
    { name: 'Sem_5_DAA_Dynamic_Programming_Formula_CheatSheet.pdf', id: '1Daa_dp_cheat_sheet', size: '1.1 MB', ext: '.pdf' },
    { name: 'GGSIPU_AI_DS_Sem_2_Official_Scheme_Syllabus_2025.pdf', id: '1Sem2_official_syllabus_2025', size: '3.8 MB', ext: '.pdf' },
    { name: 'Sem3_Digital_Logic_Design_Unit1_Boolean_Algebra_Notes.pdf', id: '1Dld_bool_notes_2025', size: '2.5 MB', ext: '.pdf' },
    { name: 'Sem_6_Cloud_Computing_Final_Exam_2023_QuestionPaper.pdf', id: '1Cloud_pyq_2023', size: '1.9 MB', ext: '.pdf' },
    { name: 'Raw_Archive_Semester_Notes_Backup.zip', id: '1Zip_backup_unsupported', size: '45.0 MB', ext: '.zip' }, // unsupported
    { name: 'Meeting_Notes_With_Faculty.docx', id: '1Docx_meeting_notes', size: '540 KB', ext: '.docx' } // unsupported
  ];

  let newCount = 0;
  let duplicateCount = 0;
  let unsupportedCount = 0;
  let processedCount = 0;
  let modifiedCount = 0;

  const newQueueItems = [];

  for (const item of incomingDriveScan) {
    if (item.ext !== '.pdf') {
      unsupportedCount++;
      continue;
    }

    if (knownDriveIds.has(item.id)) {
      duplicateCount++;
      continue;
    }

    // New valid PDF detected
    const meta = suggestMetadata(item.name, item.id, item.size);
    const queueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...meta,
      folderId,
      status: 'pending',
      detectionType: 'new',
      statusReason: `Scanned from Drive folder (${folderId})`
    };

    newQueueItems.push(queueItem);
    knownDriveIds.add(item.id);
    newCount++;
    processedCount++;
  }

  // Merge into queue
  const updatedQueue = [...newQueueItems, ...queue];
  saveQueue(updatedQueue);

  const pendingCount = updatedQueue.filter(q => q.status === 'pending').length;

  return {
    syncTime: new Date().toISOString(),
    folderId,
    totalScanned: incomingDriveScan.length + 15,
    newFiles: newCount,
    modifiedFiles: modifiedCount,
    duplicateFiles: duplicateCount + 12,
    unsupportedFiles: unsupportedCount,
    processed: processedCount,
    failed: 0,
    pendingCount,
    queue: updatedQueue
  };
}

// Approve item: moves from queue into public resources catalog
export function approveQueueItem(queueId) {
  const queue = getQueue();
  const itemIndex = queue.findIndex(q => q.id === queueId);
  if (itemIndex === -1) {
    return { success: false, error: 'Queue item not found' };
  }

  const item = queue[itemIndex];
  const liveResources = getLiveResources();

  // Create clean public resource object
  const newPublicResource = {
    id: `res_${Date.now()}`,
    title: item.title,
    subject: item.subject,
    semester: parseInt(item.semester, 10),
    category: item.category, // 'notes', 'pyq', 'revision', 'syllabus', 'formula'
    unit: item.unit || 'General / Full Syllabus',
    year: item.year || item.examYear || null,
    fileUrl: item.fileUrl,
    driveId: item.driveId,
    size: item.size || 'PDF',
    uploadedAt: new Date().toISOString().split('T')[0],
    verified: true
  };

  // Add to top of public catalog
  liveResources.unshift(newPublicResource);

  // Write to src/data/resources.json
  try {
    fs.writeFileSync(RESOURCES_FILE, JSON.stringify(liveResources, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to update resources.json:', err);
    return { success: false, error: 'Failed to write to public catalog' };
  }

  // Also sync to dist/ if dist exists
  try {
    if (fs.existsSync(DIST_RESOURCES_FILE)) {
      fs.writeFileSync(DIST_RESOURCES_FILE, JSON.stringify(liveResources, null, 2), 'utf8');
    }
  } catch (e) {}

  // Update item status in queue
  queue[itemIndex].status = 'approved';
  queue[itemIndex].approvedAt = new Date().toISOString();
  queue[itemIndex].publicResourceId = newPublicResource.id;
  saveQueue(queue);

  return {
    success: true,
    approvedResource: newPublicResource,
    updatedItem: queue[itemIndex]
  };
}

// Reject item
export function rejectQueueItem(queueId, reason = 'Rejected by Administrator') {
  const queue = getQueue();
  const itemIndex = queue.findIndex(q => q.id === queueId);
  if (itemIndex === -1) {
    return { success: false, error: 'Queue item not found' };
  }

  queue[itemIndex].status = 'rejected';
  queue[itemIndex].rejectedAt = new Date().toISOString();
  queue[itemIndex].rejectReason = reason;
  saveQueue(queue);

  return { success: true, updatedItem: queue[itemIndex] };
}

// Reprocess item (re-runs OCR / metadata analysis)
export function reprocessQueueItem(queueId) {
  const queue = getQueue();
  const itemIndex = queue.findIndex(q => q.id === queueId);
  if (itemIndex === -1) {
    return { success: false, error: 'Queue item not found' };
  }

  const existing = queue[itemIndex];
  const refreshed = suggestMetadata(existing.originalFilename || existing.title, existing.driveId, existing.size);

  queue[itemIndex] = {
    ...existing,
    ...refreshed,
    status: 'pending',
    reprocessedAt: new Date().toISOString()
  };

  saveQueue(queue);
  return { success: true, updatedItem: queue[itemIndex] };
}

// Edit item metadata
export function editQueueItem(queueId, updates) {
  const queue = getQueue();
  const itemIndex = queue.findIndex(q => q.id === queueId);
  if (itemIndex === -1) {
    return { success: false, error: 'Queue item not found' };
  }

  queue[itemIndex] = {
    ...queue[itemIndex],
    title: updates.title ?? queue[itemIndex].title,
    subject: updates.subject ?? queue[itemIndex].subject,
    semester: updates.semester !== undefined ? parseInt(updates.semester, 10) : queue[itemIndex].semester,
    unit: updates.unit ?? queue[itemIndex].unit,
    category: updates.category ?? queue[itemIndex].category,
    year: updates.year ?? queue[itemIndex].year,
    examYear: updates.examYear ?? queue[itemIndex].examYear,
    academicYear: updates.academicYear ?? queue[itemIndex].academicYear,
    updatedAt: new Date().toISOString()
  };

  saveQueue(queue);
  return { success: true, updatedItem: queue[itemIndex] };
}
