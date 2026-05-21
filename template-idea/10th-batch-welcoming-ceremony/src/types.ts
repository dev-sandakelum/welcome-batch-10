export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  category: string;
  displayOrder: number;
}

export interface Score {
  id: string;
  participantName: string;
  participantEmail?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  submittedAt: string;
}

export interface Feedback {
  id: string;
  participantName: string;
  participantEmail?: string;
  ratingValue: number; // overall rating
  welcomeRating: number; // rating 1-5
  websiteRating: number; // rating 1-5
  eventRating: number; // rating 1-5
  category: 'Academic' | 'Social' | 'Facilities' | 'Other';
  comments?: string;
  submittedAt: string;
}

export interface UserQuestion {
  id: string;
  askerName: string;
  askerEmail?: string;
  questionText: string;
  answerText?: string;
  isAnswered: boolean;
  repliedBy?: string;
  askedAt: string;
  answeredAt?: string;
}

// Initial seed quiz question bank mirroring the 10th Batch Welcoming Ceremony theme
export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What major programming framework is the primary teaching focus for full-stack engineering courses in our department?',
    optionA: 'Ruby on Rails',
    optionB: 'Next.js & React with TypeScript',
    optionC: 'COBOL Legacy Framework',
    optionD: 'Basic WordPress Templating',
    correctAnswer: 'B',
    category: 'Department Facts',
    displayOrder: 1
  },
  {
    id: 'q2',
    text: 'Which computer lab contains our powerful virtual reality systems and 3D printing equipment for student projects?',
    optionA: 'The Turing Lounge (Lab E)',
    optionB: 'The Basement Server Room',
    optionC: 'First Floor Lecture hall',
    optionD: 'The Central Cafeteria Annex',
    correctAnswer: 'A',
    category: 'Department Facts',
    displayOrder: 2
  },
  {
    id: 'q3',
    text: 'Which color is officially designated on our Department flag representing technical innovation and heritage?',
    optionA: 'Crimson Rose',
    optionB: 'Faded Mustard Yellow',
    optionC: 'Regal Royal Blue & Gold',
    optionD: 'Lime Neon Green',
    correctAnswer: 'C',
    category: 'Department Facts',
    displayOrder: 3
  },
  {
    id: 'q4',
    text: 'In what year was our university campus originally founded, initiating thousands of academic careers?',
    optionA: '1905',
    optionB: '1968',
    optionC: '2015',
    optionD: '1842',
    correctAnswer: 'B',
    category: 'University Trivia',
    displayOrder: 4
  },
  {
    id: 'q5',
    text: 'What is the name of our university\'s official mascot that stands at the campus courtyard during the freshmen inauguration?',
    optionA: 'Leo the Golden Lion',
    optionB: 'Rocky the Pebble',
    optionC: 'Cody the Sloth',
    optionD: 'Barnaby the Grizzly Bear',
    correctAnswer: 'A',
    category: 'University Trivia',
    displayOrder: 5
  },
  {
    id: 'q6',
    text: 'Which historic university tower holds the majestic brass clock chimes that sing at the start of each class hour?',
    optionA: 'Science Complex Observatory',
    optionB: 'The Founders Hall Clocktower',
    optionC: 'The North Parking Garage',
    optionD: 'The West Dormitory Chimney',
    correctAnswer: 'B',
    category: 'University Trivia',
    displayOrder: 6
  },
  {
    id: 'q7',
    text: 'What is the legendary late-night snack that sustained the 9th Batch during their grueling 48-hour Hackathon?',
    optionA: 'Super Spicy Ramen Noodles',
    optionB: 'Plain Celery Sticks',
    optionC: 'Cold Canned Anchovies',
    optionD: 'Fruit Yogurt Parfait',
    correctAnswer: 'A',
    category: 'Batch Culture & Fun',
    displayOrder: 7
  },
  {
    id: 'q8',
    text: 'Which intense game is historically used to break the ice in the student union lounge between the 9th and 10th Batches?',
    optionA: 'Extreme Foosball Tournament',
    optionB: 'Undercompetitive Chess',
    optionC: 'Synchronized Skipping',
    optionD: 'Professional Staring Contests',
    correctAnswer: 'A',
    category: 'Batch Culture & Fun',
    displayOrder: 8
  },
  {
    id: 'q9',
    text: 'Which of the following hexadecimal colors represents the primary Gold accent used in our 10th Batch Welcoming Ceremony theme?',
    optionA: '#ffffff',
    optionB: '#000000',
    optionC: '#CFB53B',
    optionD: '#ff0000',
    correctAnswer: 'C',
    category: 'General Knowledge',
    displayOrder: 9
  },
  {
    id: 'q10',
    text: 'Which programming pioneer is celebrated for discovering the first actual computer hardware bug (a real moth trapped in a relay)?',
    optionA: 'Grace Hopper',
    optionB: 'Ada Lovelace',
    optionC: 'Alan Turing',
    optionD: 'Linus Torvalds',
    correctAnswer: 'A',
    category: 'General Knowledge',
    displayOrder: 10
  }
];

export const INITIAL_SCORES: Score[] = [
  {
    id: 's1',
    participantName: 'Albie Wright',
    participantEmail: 'albie@student.edu',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    timeTaken: 42,
    submittedAt: '2026-05-20T10:15:30Z'
  },
  {
    id: 's2',
    participantName: 'Chloe Jenkins',
    participantEmail: 'chloe@student.edu',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    timeTaken: 55,
    submittedAt: '2026-05-20T11:45:00Z'
  },
  {
    id: 's3',
    participantName: 'Daniel Kim',
    participantEmail: 'daniel@student.edu',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    timeTaken: 38,
    submittedAt: '2026-05-20T12:02:11Z'
  },
  {
    id: 's4',
    participantName: 'Sarah Connor',
    participantEmail: 'sarah@alumni.org',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    timeTaken: 62,
    submittedAt: '2026-05-20T13:20:45Z'
  },
  {
    id: 's5',
    participantName: 'Ethan Hunt',
    participantEmail: 'ethan@imf.org',
    score: 7,
    totalQuestions: 10,
    percentage: 70,
    timeTaken: 49,
    submittedAt: '2026-05-20T14:10:00Z'
  }
];

export const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'f1',
    participantName: 'Gemma Foster',
    participantEmail: 'gemma@student.edu',
    ratingValue: 5,
    welcomeRating: 5,
    websiteRating: 5,
    eventRating: 5,
    category: 'Social',
    comments: 'The Welcoming Ceremony was incredible! The websites interactive cards and fun quiz kept us fully engaged. Built wonderfully by the 9th Batch!',
    submittedAt: '2026-05-20T15:30:22Z'
  },
  {
    id: 'f2',
    participantName: 'Nathan Patel',
    participantEmail: 'nathan@student.edu',
    ratingValue: 4,
    welcomeRating: 4,
    websiteRating: 5,
    eventRating: 4,
    category: 'Academic',
    comments: 'Really fun and cheerful design. Very responsive, the 10-question challenge is super sweet and well-rounded.',
    submittedAt: '2026-05-20T16:12:05Z'
  },
  {
    id: 'f3',
    participantName: 'Lucas Vance',
    ratingValue: 5,
    welcomeRating: 5,
    websiteRating: 5,
    eventRating: 5,
    category: 'Other',
    comments: 'Impressed by the smooth routing and cute layout. Best welcome app so far!',
    submittedAt: '2026-05-20T18:45:50Z'
  }
];

export const INITIAL_USER_QUESTIONS: UserQuestion[] = [
  {
    id: 'uq1',
    askerName: 'Sophia Miller',
    askerEmail: 'sophia@student.edu',
    questionText: 'Are we allowed to use Lab E during evening hours for personal learning projects, or do we need special authorization?',
    answerText: 'Yes! All 10th Batch students have 24/7 access using your digital student badge. Regular scheduled sessions have priority, but during evening hours you are free to study and use the systems.',
    isAnswered: true,
    repliedBy: '9th Batch Senior Counsel',
    askedAt: '2026-05-20T09:20:00Z',
    answeredAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'uq2',
    askerName: 'Mason Cooper',
    questionText: 'When is the upcoming autumn hackathon expected to take place? Will freshman form teams among ourselves or with seniors?',
    answerText: 'Its scheduled for the second week of October! And yes, we highly encourage mixed teams: 9th Batch seniors will join forces with 10th Batch newcomers to build fantastic apps.',
    isAnswered: true,
    repliedBy: '9th Batch Hackathon Organizer',
    askedAt: '2026-05-20T11:05:00Z',
    answeredAt: '2026-05-20T11:40:00Z'
  },
  {
    id: 'uq3',
    askerName: 'Emma Watson',
    askerEmail: 'emma@student.edu',
    questionText: 'Who should we contact if we want to submit original suggestions for weekend social workshops?',
    isAnswered: false,
    askedAt: '2026-05-20T21:10:00Z'
  }
];
