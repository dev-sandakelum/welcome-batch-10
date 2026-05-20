# Route UI & Content Documentation

A comprehensive guide describing the UI and content structure for every route in the Welcome Ceremony application. Use this document for planning and implementing new UI designs.

---

## 📋 Table of Contents
1. [Public Routes](#public-routes)
2. [Admin Routes](#admin-routes)
3. [Design System](#design-system)

---

## Public Routes

### 1. **Home Page** - `/`
**Path:** `app/page.tsx`

#### Purpose
Landing page that greets users and displays live visitor count. Serves as the central hub with navigation to all available features.

#### UI Components
- **Header Section**
  - Site title: "Welcome Ceremony"
  - Live visitor counter showing real-time user count
  - Animated live indicator (pulsing red dot)

- **Navigation Buttons** (Link-based)
  - Quiz Button
  - Ask Question Button
  - Leaderboard Button
  - Feedback Button
  - Admin Panel Link

- **Visual Elements**
  - Gradient background: from `#FDF5E6` to `#F5E6D3`
  - Decorative blur circles (accent and primary colored)
  - Framer Motion animations (staggered container/item variants)
  - Shimmer animation effects

#### Content
- Welcome message text
- Call-to-action buttons with icons
- Live event statistics

#### Data Sources
- **API:** `/api/analytics/live-visitors`
- **Refresh Rate:** Every 10 seconds

#### Key Features
- Real-time visitor tracking
- Responsive button grid
- Smooth page transitions
- Mobile-friendly design

---

### 2. **Quiz Page** - `/quiz`
**Path:** `app/quiz/page.tsx`

#### Purpose
Main quiz/challenge page where users answer MCQ questions with a timer and scoring system.

#### UI Stages

##### Stage 1: Info/Welcome
- Introduction text explaining the quiz
- Input fields for participant information
  - Name (required)
  - Email (optional)
- "Start Quiz" button

##### Stage 2: Quiz Taking
- **Question Display**
  - Current question text
  - Question number indicator (e.g., "Question 1 of 10")
  - Progress bar

- **Answer Options**
  - 4 buttons for options A, B, C, D
  - Button highlights when selected
  - Visual feedback for correct/incorrect (green flash for correct)

- **Timer**
  - 30-second countdown timer
  - Timer display with visual warning when low
  - Auto-advance on timeout

- **Navigation**
  - "Next Question" button (enabled after answering)

##### Stage 3: Results
- **Score Summary**
  - Final score display (e.g., "8 out of 10")
  - Score percentage
  - Percentage bar visualization

- **Performance Message**
  - Dynamic message based on score

- **Actions**
  - "Take Quiz Again" button
  - "Back to Home" button

#### Components Used
- Button (custom UI)
- Input (for participant name/email)
- Animation effects (confetti on correct answers)
- Canvas-confetti library for celebration

#### Data Sources
- **Fetch:** `/questions` table via Supabase
- **Save:** `/scores` table via Supabase

#### Key Features
- Per-question 30-second timer
- Automatic answer evaluation
- Confetti celebration effects on correct answers
- Score persistence to database
- Participant tracking (name & email)
- Order-based question display using `display_order`

---

### 3. **Leaderboard Page** - `/leaderboard`
**Path:** `app/leaderboard/page.tsx`

#### Purpose
Display top performers in descending order with their scores and completion timestamps.

#### UI Components

- **Header**
  - Back button (returns to home)
  - Page title: "Leaderboard"
  - Subtitle: "Top performers in the challenge"

- **Leaderboard Table/List**
  - Rank number (auto-calculated position)
  - Participant name
  - Score (raw number)
  - Total questions
  - Percentage score
  - Completion timestamp

- **Styling**
  - Row highlighting for top 3
  - Alternating row colors for readability
  - Ranking badges/medals for top positions

- **Loading State**
  - Spinner animation while fetching
  - "Loading leaderboard..." text

- **Empty State**
  - Message when no scores exist yet

#### Data Display
- Sorted by score (descending)
- Limit: Top 50 entries
- Real-time refresh: Every 10 seconds

#### Data Sources
- **Fetch:** `/scores` table from Supabase
- **Sort:** By `score` column (descending)

#### Key Features
- Real-time leaderboard updates
- Responsive table layout
- Participant ranking system
- Performance metrics display
- Auto-refresh capability

---

### 4. **Ask Question Page** - `/ask-question`
**Path:** `app/ask-question/page.tsx`

#### Purpose
Allow users to submit questions and view previously answered community questions.

#### UI Components

##### Question Submission Section
- **Input Fields**
  - Name input (required)
  - Email input (optional)
  - Question textarea (required, large text area)

- **Buttons**
  - "Submit Question" button
  - "Back" button

- **Validation & Feedback**
  - Error messages (if any)
  - Success confirmation message

##### Answered Questions Section
- **Header**
  - Subtitle: "Previously answered questions"

- **Questions Display** (Scrollable list/grid)
  - Question asker's name (badge/label)
  - Question text
  - Answer text
  - Timestamp of answer
  - Visual card layout

- **Real-time Updates**
  - Questions list updates as new answers are provided

- **Empty State**
  - Message when no questions answered yet

#### Data Sources
- **Insert:** User's question to `/user_questions` table
- **Fetch:** Answered questions from `/user_questions` table
- **Filter:** `is_answered = true`
- **Real-time:** Supabase subscription on `user_questions` table

#### Key Features
- Form submission with validation
- Real-time Q&A display via subscriptions
- Participant tracking
- Celebration confetti on successful submission
- Display of community Q&A history

---

### 5. **Feedback Page** - `/feedback`
**Path:** `app/feedback/page.tsx`

#### Purpose
Collect feedback from users about the welcome ceremony experience.

#### UI Components

- **Header**
  - Back button
  - Page title: "Share Your Feedback"
  - Subtitle: "Help us improve the welcome ceremony"

- **Feedback Form**
  - **Name Input** (required)
    - Placeholder: "Enter your name"
  
  - **Email Input** (optional)
    - Placeholder: "Enter your email"
  
  - **Rating Component** (required)
    - Star rating (1-5 or similar)
    - Visual feedback on hover/selection
  
  - **Comments Textarea** (optional)
    - Placeholder: "Share your thoughts..."
    - Large text area for detailed feedback
  
  - **Submit Button**
    - Disabled until required fields filled
    - Loading state during submission

- **Submission Success Screen**
  - Success message
  - Celebration confetti animation
  - "Submit Another Feedback" option
  - "Back to Home" button

- **Styling**
  - Glassmorphism effect (white/40 with backdrop blur)
  - Smooth animations using Framer Motion

#### Data Sources
- **Insert:** User feedback to `/feedback` table
- **Save Fields:**
  - `participant_name` (required)
  - `participant_email` (optional)
  - `rating` (1-5)
  - `comments` (optional)

#### Key Features
- Rating system integration
- Celebration confetti on successful submission
- Form validation
- ScrollFade animations for form elements
- Success state management
- Email optional for privacy

---

### 6. **Q&A Display Page** - `/qa`
**Path:** `app/qa/page.tsx`

#### Purpose
Community Q&A section displaying all answered questions in a read-only, expandable format.

#### UI Components

- **Header**
  - Back button
  - Page title: "Q&A"
  - Subtitle: "Community questions and answers"

- **Questions List**
  - **Expandable Question Card**
    - Question asker name (as badge/label)
    - Question text (always visible)
    - Expand/collapse toggle button
    - Answer text (hidden until expanded via accordion/animation)
    - Timestamp of answer
    - Visual hierarchy with proper spacing

  - **Animation**
    - Smooth expand/collapse using AnimatePresence
    - Height/opacity transitions

- **Loading State**
  - Spinner with loading text

- **Empty State**
  - Message when no answered questions exist

- **Real-time Updates**
  - Subscribe to changes in answered questions
  - Auto-refresh when new answers are added

#### Data Sources
- **Fetch:** `/user_questions` table
- **Filter:** `is_answered = true`
- **Sort:** By `answered_at` (descending - newest first)
- **Real-time Subscription:** On `user_questions` table changes

#### Key Features
- Expandable accordion-style display
- Real-time Q&A updates
- Responsive card layout
- Search/filtering capability (optional enhancement)
- Community engagement display

---

## Admin Routes

### 1. **Admin Login Page** - `/admin/login`
**Path:** `app/admin/login/page.tsx`

#### Purpose
Authenticate admin users with username and password to access admin dashboard.

#### UI Components

- **Login Card** (Centered on page)
  - Glassmorphic design (white/40 with backdrop blur)
  - Border styling with accent color

- **Header**
  - Title: "Admin Access"
  - Subtitle: "Sign in to manage the ceremony"

- **Form Fields**
  - **Username Input**
    - Label: "Username"
    - Placeholder: "Enter your username"
  
  - **Password Input**
    - Label: "Password"
    - Placeholder: "Enter password"
    - Type: password (masked input)

- **Buttons**
  - "Sign In" button (primary)
  - Loading state during authentication

- **Error Display**
  - Error alert box (red background)
  - Error message text: "Invalid username or password"
  - Animated entrance

- **Styling**
  - Gradient background
  - Centered layout
  - Mobile responsive

#### Data Sources
- **API:** POST `/api/admin/login`
- **Request Body:** `{ username, password }`
- **Response:** `{ token, ... }`

#### Credentials (from `.env.local`)
- **Username:** Admin_1234
- **Password:** admin3

#### Key Features
- Form validation
- Error messaging
- Token storage in localStorage
- Client-side authentication check
- Redirect on successful login

---

### 2. **Admin Dashboard** - `/admin/dashboard`
**Path:** `app/admin/dashboard/page.tsx`

#### Purpose
Main admin control panel displaying system statistics and providing navigation to other admin features.

#### UI Components

- **Header**
  - Admin branding/title
  - Logout button
  - Welcome message

- **Loading State**
  - Spinner with "Loading dashboard..." text

- **Stats Cards Grid**
  - **Card 1: Total Questions**
    - Icon: 📋
    - Label: "Total Questions"
    - Value: Number from database
    - Link to: `/admin/questions`
  
  - **Card 2: Quiz Submissions**
    - Icon: ✅
    - Label: "Quiz Submissions"
    - Value: Total scores count
    - Link to: `/admin/scores`
  
  - **Card 3: Average Score**
    - Icon: ⭐
    - Label: "Average Score"
    - Value: Calculated average
  
  - **Card 4: Feedback Received**
    - Icon: 💬
    - Label: "Feedback Received"
    - Value: Total feedback count
    - Link to: `/admin/feedback`

- **Navigation Menu** (Optional)
  - Links to all admin pages
  - Current page indicator

#### Data Sources
- **Fetch:** Multiple Supabase tables
  - `/questions` - count
  - `/scores` - count and average calculation
  - `/feedback` - count

#### Key Features
- Statistics aggregation
- Authentication check (token validation)
- Redirect to login if not authenticated
- Card-based dashboard layout
- Quick navigation to admin sections

---

### 3. **Admin Questions Management** - `/admin/questions`
**Path:** `app/admin/questions/page.tsx`

#### Purpose
Create, edit, and delete quiz questions with multiple choice answers.

#### UI Components

- **Header**
  - Title: "Manage Questions"
  - "Add Question" button

- **Question List/Table**
  - **Columns:**
    - Question text (truncated)
    - Category
    - Display order
    - Actions (Edit, Delete buttons)
  
  - **Sorting**
    - Sort by `display_order`

- **Question Form** (Expandable/Modal)
  - **Input Fields:**
    - Question text (textarea, required)
    - Option A (input, required)
    - Option B (input, required)
    - Option C (input, required)
    - Option D (input, required)
    - Correct Answer (dropdown: A, B, C, D)
    - Category (input, optional)
    - Display Order (number input, optional)

  - **Buttons:**
    - "Save Question"
    - "Cancel"

- **Loading States**
  - Form submission loading
  - List loading spinner

- **Error Display**
  - Error messages for failed operations
  - Validation errors

#### Data Operations
- **Fetch:** GET all questions from `/questions` table
- **Create:** POST new question to database
- **Update:** PATCH question data
- **Delete:** DELETE question by ID

#### Key Features
- CRUD operations for questions
- Form validation (all MCQ fields required)
- Display order management
- Edit existing questions
- Delete with confirmation
- Category tagging
- Duplicate question detection (optional enhancement)

---

### 4. **Admin Scores Management** - `/admin/scores`
**Path:** `app/admin/scores/page.tsx`

#### Purpose
View quiz submission scores and performance metrics from all participants.

#### UI Components

- **Header**
  - Title: "Quiz Scores"
  - Back button

- **Statistics Summary**
  - **Total Submissions:** Count of all scores
  - **Average Score:** Calculated mean score
  - **Average Percentage:** Mean percentage
  - **Highest Score:** Maximum score achieved

- **Scores Table**
  - **Columns:**
    - Rank (auto-calculated)
    - Participant name
    - Email (if provided)
    - Score (raw number)
    - Total questions
    - Percentage (%)
    - Completion timestamp
    - Actions (Delete button)

  - **Sorting**
    - Default: By score (descending)

  - **Pagination** (optional for better UX with many records)

- **Delete Action**
  - Confirmation dialog before deletion
  - Success/error messages

#### Loading State
- Spinner with "Loading scores..." text

#### Empty State
- Message when no scores exist

#### Data Sources
- **Fetch:** All scores from `/scores` table
- **Sort:** By score (descending)

#### Key Features
- Score statistics aggregation
- Participant performance tracking
- Full submission history
- Delete individual scores
- Authentication check
- Real-time data updates (optional enhancement)

---

### 5. **Admin Feedback Management** - `/admin/feedback`
**Path:** `app/admin/feedback/page.tsx`

#### Purpose
Review and manage feedback submissions from participants.

#### UI Components

- **Header**
  - Title: "Feedback Management"
  - Back button

- **Statistics Summary**
  - **Total Feedback:** Count of all feedback entries
  - **Average Rating:** Calculated mean rating (1-5)

- **Feedback List/Cards**
  - **Card for Each Feedback Entry:**
    - Participant name
    - Email (if provided)
    - Rating (star display or numeric: e.g., 4.5/5)
    - Comments (if provided)
    - Submission timestamp
    - Delete button (with confirmation)

  - **Sorting**
    - Default: By submission date (newest first)

  - **Filtering** (optional)
    - Filter by rating score
    - Filter by date range

- **Loading State**
  - Spinner while fetching feedback

- **Empty State**
  - Message when no feedback received

#### Data Sources
- **Fetch:** All feedback from `/feedback` table
- **Sort:** By `submitted_at` (descending)

#### Key Features
- Feedback statistics
- Rating visualization
- Comment display
- Delete feedback entries
- Authentication check
- Chronological ordering
- Email validation display

---

### 6. **Admin User Questions** - `/admin/user-questions`
**Path:** `app/admin/user-questions/page.tsx`

#### Purpose
Manage user-submitted questions and provide answers through admin interface.

#### UI Components

- **Header**
  - Title: "User Questions"
  - Back button

- **Questions List**
  - **Unanswered Questions Section**
    - List of questions with `is_answered = false`
    - For each question:
      - Asker's name
      - Question text
      - Submission timestamp
      - Expand button to show answer form

  - **Answered Questions Section**
    - List of questions with `is_answered = true`
    - For each question:
      - Asker's name
      - Question text
      - Answer text (displayed or expandable)
      - Answered timestamp
      - Edit/Delete buttons (optional)

- **Answer Form** (Appears on expand)
  - **Textarea** for answer text
  - **Submit Answer** button
  - **Cancel** button
  - Loading state during submission

- **Loading State**
  - Spinner with "Loading questions..." text

- **Empty State**
  - Message when no questions exist

#### Data Sources
- **Fetch:** All user questions from `/user_questions` table
- **Sort:** By `asked_at` (descending)
- **Update:** Patch question with answer and `is_answered = true`

#### Key Features
- Separate answered/unanswered views
- Form-based answer submission
- Timestamp tracking (asked_at, answered_at)
- Answer editing capability (optional)
- Question deletion (optional)
- Real-time update on other pages

---

## Design System

### All Routes Use:

#### Color Palette
- **Background Gradient:** `from-[#FDF5E6] to-[#F5E6D3]` (warm cream/beige)
- **Primary Color:** Used for headings and key elements
- **Accent Color:** Used for secondary elements and highlights
- **Foreground:** Text color for content

#### Typography
- **Fonts Used:**
  - `font-playfair` - Headings (elegant serif)
  - `font-lora` - Body text and descriptions
  - `font-edu` - Decorative usage
  - `font-comic` - Casual/fun elements

#### Components Library
All pages use custom UI components from `components/ui/`:
- `button.tsx` - Button component
- `input.tsx` - Text input
- `textarea.tsx` - Multi-line text
- `form.tsx` - Form utilities
- `dialog.tsx` - Modal dialogs
- `card.tsx` - Card containers
- `table.tsx` - Data tables
- `badge.tsx` - Label badges
- `skeleton.tsx` - Loading placeholders
- Additional specialized components for complex UIs

#### Animation & Transitions
- **Framer Motion** for all animations
- **Variants Used:**
  - `containerVariants` - Staggered container animations
  - `itemVariants` - Individual item entrance animations
  - `shimmerVariants` - Shimmer/glow effects

- **Common Animations:**
  - Fade in/out
  - Slide up/down
  - Scale grow/shrink
  - Stagger delays

#### Common Patterns
1. **Loading States**
   - Centered spinner (border-4 border-accent border-t-primary)
   - "Loading..." text below spinner

2. **Error Handling**
   - Red alert boxes with error messages
   - Toast notifications (optional)

3. **Responsive Design**
   - Mobile-first approach
   - Tailwind CSS `md:` breakpoints
   - Max-width constraints (`max-w-md`, `max-w-4xl`, etc.)

4. **Forms**
   - Input validation
   - Error message display
   - Loading button states
   - Focus state styling

5. **Navigation**
   - Back buttons (Link with Button component)
   - Navigation menu/header on all pages
   - Consistent routing with Next.js Link

#### Glassmorphism Design
- Used on form pages and panels
- `bg-white/40 backdrop-blur-md border-2 border-accent/30`
- Rounded corners: `rounded-2xl` or `rounded-xl`
- Padding: `p-8` for forms, `p-5` or `p-6` for headers

#### Accessibility Features
- ARIA labels on form inputs
- Proper heading hierarchy (h1 > h2, etc.)
- Keyboard navigation support
- Focus states visible on interactive elements

---

## Summary Matrix

| Route | Purpose | Key Components | Data Source | User Type |
|-------|---------|-----------------|-------------|-----------|
| `/` | Home/Landing | Navigation Hub, Live Counter | Analytics API | Public |
| `/quiz` | Quiz Challenge | MCQ Questions, Timer, Scoring | Supabase | Public |
| `/leaderboard` | Rankings | Score Table, Sorting | Supabase | Public |
| `/ask-question` | Q&A Submission | Form, Q&A List | Supabase | Public |
| `/feedback` | Feedback Collection | Rating Form, Success State | Supabase | Public |
| `/qa` | Read-only Q&A | Expandable Cards | Supabase | Public |
| `/admin/login` | Authentication | Login Form | API Endpoint | Admin |
| `/admin/dashboard` | Stats Overview | Stat Cards, Navigation | Supabase | Admin |
| `/admin/questions` | Quiz Management | CRUD Form, Question List | Supabase | Admin |
| `/admin/scores` | Score Review | Stats, Score Table | Supabase | Admin |
| `/admin/feedback` | Feedback Management | Stat Summary, Feedback Cards | Supabase | Admin |
| `/admin/user-questions` | Answer Management | Question List, Answer Form | Supabase | Admin |

---

## Notes for UI Enhancement

When planning new UI designs, consider:
1. **Consistency** - Maintain the existing color palette and animation patterns
2. **Mobile Responsiveness** - All components should work on mobile devices
3. **Performance** - Optimize animations and data fetching
4. **Accessibility** - Ensure keyboard navigation and screen reader compatibility
5. **Loading States** - Always show meaningful loading indicators
6. **Error States** - Provide clear error messages and recovery options
7. **Real-time Updates** - Leverage Supabase subscriptions for live data
8. **Celebration Moments** - Use confetti effects for positive user actions
