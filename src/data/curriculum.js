// GGSIPU Artificial Intelligence & Data Science - Complete 8 Semesters Curriculum

export const SEMESTERS = [
  {
    number: 1,
    title: "Semester 1",
    year: "1st Year (Autumn)",
    shortDesc: "Foundation engineering sciences, basic programming, and communication.",
    credits: 22,
    subjects: [
      {
        slug: "programming-in-c",
        name: "Programming in C",
        code: "ES-101",
        units: ["Variables, Data Types & Operators", "Control Structures & Loops", "Arrays, Strings & Pointers", "Structures, Unions & File Handling"]
      },
      {
        slug: "engineering-mathematics",
        name: "Engineering Mathematics",
        code: "BS-103",
        units: ["Differential Calculus & Taylor Series", "Partial Differentiation & Jacobians", "Integral Calculus & Multiple Integrals", "Vector Calculus & Line/Surface Integrals"]
      },
      {
        slug: "engineering-physics",
        name: "Engineering Physics",
        code: "BS-105",
        units: ["Interference & Diffraction of Light", "Polarization & Laser Physics", "Electromagnetism & Maxwell's Equations", "Quantum Mechanics & Wave Functions"]
      },
      {
        slug: "communication-skills",
        name: "Communication Skills",
        code: "HS-107",
        units: ["Communication Fundamentals & Barriers", "Writing Skills & Technical Reports", "Grammar, Vocabulary & Editing", "Oral Presentation & Group Discussion"]
      },
      {
        slug: "environmental-studies",
        name: "Environmental Studies",
        code: "BS-109",
        units: ["Ecosystems & Biodiversity", "Natural Resources & Conservation", "Environmental Pollution & Control", "Sustainable Development & Policies"]
      },
      {
        slug: "manufacturing-process",
        name: "Manufacturing Process",
        code: "ES-111",
        units: ["Casting Processes & Foundry", "Forming & Metal Working", "Machining & Machine Tools", "Welding & Advanced Manufacturing"]
      }
    ]
  },
  {
    number: 2,
    title: "Semester 2",
    year: "1st Year (Spring)",
    shortDesc: "Advanced calculus, basic electrical circuits, mechanics and Python.",
    credits: 22,
    subjects: [
      {
        slug: "applied-mathematics-2",
        name: "Engineering Mathematics - II",
        code: "BS-102",
        units: ["Ordinary Differential Equations", "Laplace Transforms & Applications", "Fourier Series & Integrals", "Complex Analysis & Mapping"]
      },
      {
        slug: "applied-physics-2",
        name: "Engineering Physics - II",
        code: "BS-104",
        units: ["Crystal Structure & X-ray Diffraction", "Band Theory of Solids & Semiconductors", "Superconductivity & Nanotechnology", "Fiber Optics & Sensors"]
      },
      {
        slug: "engineering-mechanics",
        name: "Engineering Mechanics",
        code: "ES-106",
        units: ["Equilibrium of Rigid Bodies & Friction", "Centroids & Moment of Inertia", "Kinematics of Particles & D'Alembert's Principle", "Kinetics of Rigid Bodies & Work-Energy"]
      },
      {
        slug: "electrical-technology",
        name: "Basic Electrical & Electronics",
        code: "ES-108",
        units: ["DC Circuits & Network Theorems", "AC Fundamentals & Resonance", "Transformers & Induction Motors", "Diodes, Transistors & Op-Amps"]
      },
      {
        slug: "python-programming",
        name: "Python Programming",
        code: "ES-110",
        units: ["Python Basics & Data Collections", "Functions, Modules & OOP", "File I/O & Exception Handling", "NumPy & Pandas Foundations"]
      },
      {
        slug: "engineering-graphics",
        name: "Engineering Graphics & CAD",
        code: "ES-112",
        units: ["Scales & Engineering Curves", "Projections of Points, Lines & Planes", "Projections of Solids & Section of Solids", "Isometric Projections & CAD Basics"]
      }
    ]
  },
  {
    number: 3,
    title: "Semester 3",
    year: "2nd Year (Autumn)",
    shortDesc: "Core AI & Data Science foundations: Data structures, linear algebra, logic design and AI principles.",
    credits: 24,
    subjects: [
      {
        slug: "data-structures",
        name: "Data Structures",
        code: "AIDS-201",
        units: ["Arrays, Stacks, Queues & Recursion", "Linked Lists (Singly, Doubly, Circular)", "Trees (Binary, AVL, B-Trees & Heaps)", "Graphs, Sorting & Hashing Techniques"]
      },
      {
        slug: "principles-of-artificial-intelligence",
        name: "Principles of Artificial Intelligence",
        code: "AIDS-203",
        units: ["Intelligent Agents & Problem Formulations", "Informed & Uninformed Search (A*, Heuristics)", "Propositional & First-Order Logic", "Knowledge Representation, Reasoning & Planning"]
      },
      {
        slug: "data-science",
        name: "Data Science",
        code: "AIDS-205",
        units: ["Introduction to Data Science & Exploratory Analysis", "Data Cleaning, Preprocessing & Transformation", "Regression Analysis & Statistical Modeling", "Predictive Mining & Machine Learning Workflows"]
      },
      {
        slug: "probability-statistics-and-linear-algebra",
        name: "Probability, Statistics and Linear Algebra",
        code: "BS-207",
        units: ["Probability Distributions & Central Limit Theorem", "Sampling, Hypothesis Testing & Chi-Square", "Matrices, Vector Spaces & Subspaces", "Eigenvalues, Eigenvectors & SVD"]
      },
      {
        slug: "digital-logic-design",
        name: "Digital Logic Design",
        code: "ES-209",
        units: ["Boolean Algebra & K-Maps", "Combinational Logic & Arithmetic Circuits", "Sequential Circuits (Flip-Flops, Registers)", "Synchronous & Asynchronous Counters"]
      },
      {
        slug: "universal-human-values",
        name: "Universal Human Values",
        code: "HS-211",
        units: ["Value Education & Self Exploration", "Harmony in Human Being (Self & Body)", "Harmony in Family & Society", "Harmony in Nature & Universal Order"]
      },
      {
        slug: "critical-reasoning-system-thinking",
        name: "Critical Reasoning, System Thinking",
        code: "HS-213",
        units: ["Fundamentals of Critical Thinking", "Fallacies & Deductive Logic", "System Dynamics & Feedback Loops", "Decision Making & Problem Solving Frameworks"]
      },
      {
        slug: "syllabus",
        name: "Syllabus",
        code: "SYL-201",
        units: ["End Term Scheme", "Examination Rules", "Curriculum Structure", "Marking Rubrics"]
      }
    ]
  },
  {
    number: 4,
    title: "Semester 4",
    year: "2nd Year (Spring)",
    shortDesc: "Machine learning, databases, networking, software engineering, and object-oriented Java.",
    credits: 24,
    subjects: [
      {
        slug: "machine-learning",
        name: "Machine Learning",
        code: "AIDS-202",
        units: ["Supervised Learning & Decision Trees", "Linear & Logistic Regression, SVM", "Unsupervised Learning, Clustering & PCA", "Ensemble Methods & Model Evaluation"]
      },
      {
        slug: "database-management-system",
        name: "Database Management System",
        code: "AIDS-204",
        units: ["ER Modeling & Relational Algebra", "SQL Queries, Views & PL/SQL", "Normalization (1NF to BCNF) & Dependencies", "Transactions, Concurrency Control & Recovery"]
      },
      {
        slug: "computer-networks-and-internet-protocols",
        name: "Computer Networks and Internet Protocols",
        code: "AIDS-206",
        units: ["OSI & TCP/IP Protocol Architectures", "Data Link Layer & Error Control (ARQ)", "Network Layer, IP Addressing & Routing", "Transport (TCP/UDP) & Application Protocols"]
      },
      {
        slug: "object-oriented-programming-in-java",
        name: "Object Oriented Programming in Java",
        code: "AIDS-208",
        units: ["OOP Principles, Classes & Inheritance", "Packages, Interfaces & Polymorphism", "Exception Handling & Multithreading", "Java Collections Framework & Streams"]
      },
      {
        slug: "software-engineering",
        name: "Software Engineering",
        code: "AIDS-210",
        units: ["SDLC Models (Waterfall, Agile, Scrum)", "Requirement Engineering & SRS", "Software Design Patterns & Architecture", "Software Testing, QA & Maintenance"]
      },
      {
        slug: "computational-mathematics",
        name: "Computational Mathematics",
        code: "BS-212",
        units: ["Root Finding Methods (Newton-Raphson)", "System of Linear Equations (Gauss Elimination)", "Interpolation & Curve Fitting", "Numerical Differentiation & Runge-Kutta"]
      }
    ]
  },
  {
    number: 5,
    title: "Semester 5",
    year: "3rd Year (Autumn)",
    shortDesc: "Algorithm design, operating systems, computer architecture, IoT and data mining.",
    credits: 24,
    subjects: [
      {
        slug: "design-and-analysis-of-algorithms",
        name: "Design and Analysis of Algorithms",
        code: "AIDS-301",
        units: ["Asymptotic Notations & Recurrences", "Divide and Conquer, Greedy Algorithms", "Dynamic Programming & Matrix Multiplication", "Graph Algorithms, NP-Completeness"]
      },
      {
        slug: "operating-system",
        name: "Operating System",
        code: "AIDS-303",
        units: ["Processes, Threads & CPU Scheduling", "Process Synchronization & Semaphores", "Deadlock Prevention & Avoidance", "Memory Management, Paging & File Systems"]
      },
      {
        slug: "computer-architecture-and-organization",
        name: "Computer Architecture and Organization",
        code: "AIDS-305",
        units: ["Register Transfer & Basic Computer Design", "Instruction Set Architecture & Addressing Modes", "Pipelining & Vector Processing", "Memory Hierarchy & I/O Organization"]
      },
      {
        slug: "internet-of-things",
        name: "Internet of Things",
        code: "AIDS-307",
        units: ["IoT Architecture & Hardware Protocols", "Sensors, Actuators & Microcontrollers", "Wireless Communication & MQTT/CoAP", "Cloud IoT Platforms & Security"]
      },
      {
        slug: "data-mining",
        name: "Data Mining",
        code: "AIDS-309",
        units: ["Data Warehousing & OLAP", "Association Rule Mining (Apriori)", "Classification & Prediction Algorithms", "Cluster Analysis & Outlier Detection"]
      },
      {
        slug: "principles-of-entrepreneurship-mindset",
        name: "Principles of Entrepreneurship Mindset",
        code: "HS-311",
        units: ["Entrepreneurial Mindset & Ideation", "Market Research & Customer Discovery", "Business Model Canvas & Prototyping", "Pitching, Funding & Startup Scaling"]
      }
    ]
  },
  {
    number: 6,
    title: "Semester 6",
    year: "3rd Year (Spring)",
    shortDesc: "Deep learning, cloud computing, big data, blockchain and cognitive systems.",
    credits: 24,
    subjects: [
      {
        slug: "fundamentals-of-deep-learning",
        name: "Fundamentals of Deep Learning",
        code: "AIDS-302",
        units: ["Neural Networks, Activation & Backprop", "CNN Architectures for Vision", "RNN, LSTM & Sequence Modeling", "Generative Models & Transformers"]
      },
      {
        slug: "big-data-analytics",
        name: "Big Data Analytics",
        code: "AIDS-304",
        units: ["Big Data Ecosystem & MapReduce", "Apache Hadoop, HDFS & Architecture", "Apache Spark & Stream Processing", "NoSQL Databases & Graph Analytics"]
      },
      {
        slug: "digital-image-processing",
        name: "Digital Image Processing",
        code: "AIDS-306",
        units: ["Image Fundamentals & Spatial Filtering", "Frequency Domain Transforms (DFT/FFT)", "Image Restoration & Color Models", "Morphological Processing & Segmentation"]
      },
      {
        slug: "cloud-computing",
        name: "Cloud Computing",
        code: "AIDS-308",
        units: ["Cloud Models (IaaS, PaaS, SaaS)", "Virtualization & Containers (Docker/K8s)", "Cloud Storage, Compute & IAM", "Serverless Architecture & Security"]
      },
      {
        slug: "blockchain-technology",
        name: "Blockchain Technology",
        code: "AIDS-310",
        units: ["Cryptography & Distributed Ledgers", "Consensus Algorithms (PoW, PoS)", "Smart Contracts & Ethereum", "Decentralized Applications (DApps)"]
      },
      {
        slug: "cognitive-computing",
        name: "Cognitive Computing",
        code: "AIDS-312",
        units: ["Cognitive Architecture & Philosophy", "Natural Interaction & Knowledge Representation", "Cognitive Reasoning Systems", "Applications in Healthcare & Robotics"]
      }
    ]
  },
  {
    number: 7,
    title: "Semester 7",
    year: "4th Year (Autumn)",
    shortDesc: "Advanced system programming, computer vision, business intelligence, web intelligence.",
    credits: 20,
    subjects: [
      {
        slug: "computer-vision",
        name: "Computer Vision",
        code: "AIDS-401",
        units: ["Feature Detection & Matching (SIFT/ORB)", "Motion Estimation & Optical Flow", "Object Detection (YOLO, Faster R-CNN)", "Semantic Segmentation & 3D Vision"]
      },
      {
        slug: "advanced-system-programming",
        name: "Advanced System Programming",
        code: "AIDS-403",
        units: ["Linux Kernel & System Calls", "Process Management & Inter-Process Communication", "Socket Programming & Network Servers", "Device Drivers & Memory Mapping"]
      },
      {
        slug: "advanced-data-structures",
        name: "Advanced Data Structures",
        code: "AIDS-405",
        units: ["Tries, Suffix Trees & String Matching", "Disjoint Sets & Segment Trees", "Fibonacci Heaps & Splay Trees", "Spatial Data Structures (R-Trees, Quad-Trees)"]
      },
      {
        slug: "business-intelligence-analytics",
        name: "Business Intelligence & Analytics",
        code: "AIDS-407",
        units: ["BI Architecture & Data Pipelines", "Dimensional Modeling & ETL", "Reporting Dashboards & KPI Tracking", "Prescriptive Analytics & Forecasting"]
      },
      {
        slug: "web-intelligence",
        name: "Web Intelligence",
        code: "AIDS-409",
        units: ["Web Crawling & Information Retrieval", "Search Engine Architectures & PageRank", "Web Mining & User Behavior Analytics", "Semantic Web & Ontologies"]
      },
      {
        slug: "principles-of-management-economics",
        name: "Principles of Management & Economics",
        code: "HS-411",
        units: ["Management Theories & Organizational Structure", "Managerial Economics & Demand Forecasting", "Cost Analysis & Market Structures", "Financial Management & Capital Budgeting"]
      },
      {
        slug: "practical-files-sem-7",
        name: "Practical Files (Sem 7)",
        code: "PRAC-401",
        units: ["Computer Vision Lab Experiments", "ASP System Programs", "BI Dashboards & Reports", "Sample Viva Voce Questions"]
      },
      {
        slug: "general-sem-7",
        name: "General (Sem 7)",
        code: "GEN-401",
        units: ["Major Project Guidelines", "Placement & Internship Preparation", "Interview Technical Questions", "Industry Research Topics"]
      }
    ]
  },
  {
    number: 8,
    title: "Semester 8",
    year: "4th Year (Spring)",
    shortDesc: "Major Capstone Project, industry internship, NLP, and AI governance.",
    credits: 20,
    subjects: [
      {
        slug: "natural-language-processing",
        name: "Natural Language Processing",
        code: "AIDS-402",
        units: ["Text Preprocessing, Tokenization & N-grams", "Word Embeddings (Word2Vec, GloVe)", "Seq2Seq Models, Attention & Transformers", "Large Language Models & Prompt Engineering"]
      },
      {
        slug: "reinforcement-learning",
        name: "Reinforcement Learning",
        code: "AIDS-404",
        units: ["Markov Decision Processes & Bellman Equations", "Dynamic Programming & Monte Carlo Methods", "Q-Learning & Temporal Difference", "Deep Q-Networks (DQN) & Policy Gradients"]
      },
      {
        slug: "ai-ethics-and-governance",
        name: "AI Ethics & Governance",
        code: "AIDS-406",
        units: ["Algorithmic Bias, Fairness & Accountability", "Privacy Preserving AI & Differential Privacy", "AI Safety, Alignment & Explainability (XAI)", "Legal Frameworks, Intellectual Property & Policy"]
      },
      {
        slug: "major-project",
        name: "Major Capstone Project & Internship",
        code: "PROJ-402",
        units: ["Project Synopsis & Literature Review", "System Architecture & Dataset Curation", "Model Training, Validation & Evaluation", "Final Report, Research Paper & Viva Voce"]
      }
    ]
  }
];

export const RESOURCE_CATEGORIES = [
  {
    id: "notes",
    name: "Notes",
    shortName: "Notes",
    icon: "BookOpen",
    badge: "Unit-Wise",
    color: "#08B6D4",
    description: "Detailed handwritten and faculty notes organized unit by unit for complete syllabus coverage."
  },
  {
    id: "pyq",
    name: "Previous Year Papers",
    shortName: "PYQs",
    icon: "FileText",
    badge: "With Solutions",
    color: "#3B82F6",
    description: "Actual GGSIPU end-term and mid-term examination papers categorized by year with question banks."
  },
  {
    id: "revision",
    name: "Quick Revision",
    shortName: "Revision",
    icon: "Zap",
    badge: "Last Minute",
    color: "#10B981",
    description: "Concise summary handouts, high-yield topics, and chapter recaps for night-before-exam prep."
  },
  {
    id: "syllabus",
    name: "Syllabus",
    shortName: "Syllabus",
    icon: "GraduationCap",
    badge: "Official Scheme",
    color: "#8B5CF6",
    description: "Official GGSIPU AI & Data Science scheme, examination scheme, credits, and syllabus modules."
  },
  {
    id: "formula",
    name: "Formula Sheets",
    shortName: "Formulas",
    icon: "Sigma",
    badge: "Cheat Sheets",
    color: "#F59E0B",
    description: "Handy formula compilations, algorithm cheat sheets, derivation guides, and command references."
  }
];

export const TEAM_MEMBERS = [
  {
    name: "Akshat Pal",
    role: "Developer",
    bio: "Building the front-end user experience, data architecture, and maintaining resource delivery pipelines.",
    linkedin: "https://www.linkedin.com/in/akshatpal2007/",
    tag: "UI / Architecture"
  },
  {
    name: "Himanshi Sharma",
    role: "Developer",
    bio: "Curating verified syllabus material, resolving student queries, and optimizing site accessibility.",
    linkedin: "https://www.linkedin.com/in/himanshi-sharma-908341255/",
    tag: "Content / Quality"
  },
  {
    name: "Reachal Jain",
    role: "Social Media Manager",
    bio: "Managing the official WhatsApp community, sharing instant exam notices, and student engagement.",
    linkedin: "https://www.linkedin.com/in/reachal-jain-0946a536b/",
    tag: "Community / Outreach"
  }
];
