# Welcome 10th Batch - University Welcome Portal

A beautiful, interactive welcome portal for new university students built with Next.js and Supabase.

## Features

### Public Features
- 🏠 **Home Page** - Elegant landing page with smooth scroll sections
- 🧠 **Interactive Quiz** - Test your knowledge about the university
- 🏆 **Leaderboard** - See top quiz performers
- ❓ **Q&A System** - Ask questions and get answers from seniors
- 💌 **Feedback System** - Share your experience with ratings
- 🎨 **Beautiful UI** - Royal purple and gold theme with smooth animations

### Admin Features
- 🔐 **Secure Login** - Protected admin panel with authentication
- 📊 **Dashboard** - View statistics and analytics
- 📝 **Question Management** - Answer, edit, and delete questions
- 🏆 **Score Management** - View and manage quiz leaderboard
- 💬 **Feedback Management** - View ratings and delete feedback
- 🧪 **Database Testing** - Test all CRUD operations

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with CSS Variables
- **Animations**: Custom JavaScript animations

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd welcome-10
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Run the SQL setup script:
      - Go to your Supabase project dashboard
      - Navigate to SQL Editor
      - Copy and paste the contents of `sql/setup.sql`
      - Click "Run"
   
   c. (Optional) Insert test data:
      - In SQL Editor, copy and paste contents of `sql/test-data.sql`
      - Click "Run"

4. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   Find these values in your Supabase project settings under "API".

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── quiz/                # Quiz page
│   ├── leaderboard/         # Leaderboard page
│   ├── questions/           # Ask questions page
│   ├── all-questions/       # View all Q&A
│   └── feedback/            # Feedback page
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── public/
│   └── assets/
│       ├── styles.css       # Global styles
│       └── animations.js    # Animation utilities
├── sql/
│   ├── setup.sql            # Database schema setup
│   ├── test-data.sql        # Sample data for testing
│   └── reset.sql            # Reset database (removes all data)
├── template/                # Original HTML templates
└── .env.local              # Environment variables (create this)
```

## Database Schema

### Tables

1. **questions** - Stores student questions
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR)
   - `email` (VARCHAR, Optional)
   - `question` (TEXT)
   - `answer` (TEXT, Optional)
   - `answered` (BOOLEAN)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **quiz_scores** - Stores quiz results
   - `id` (UUID, Primary Key)
   - `player_name` (VARCHAR)
   - `score` (INTEGER)
   - `total_questions` (INTEGER)
   - `created_at` (TIMESTAMP)

3. **feedback** - Stores user feedback
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR)
   - `email` (VARCHAR, Optional)
   - `rating` (INTEGER, 1-5)
   - `feedback_text` (TEXT)
   - `created_at` (TIMESTAMP)

## SQL Scripts

### Setup Database
```bash
# Run in Supabase SQL Editor
sql/setup.sql
```

### Insert Test Data
```bash
# Run in Supabase SQL Editor
sql/test-data.sql
```

### Reset Database (⚠️ Deletes all data)
```bash
# Run in Supabase SQL Editor
sql/reset.sql
```

## Customization

### Colors
Edit CSS variables in `public/assets/styles.css`:
```css
:root {
  --royal: #1a0e3d;
  --accent-gold: #c9a227;
  --accent-teal: #00b4d8;
  /* ... more colors */
}
```

### Quiz Questions
Edit the `quizData` array in `app/quiz/page.tsx`

### FAQ Content
Edit the `faqData` array in `app/page.tsx`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Features in Detail

### Quiz System
- 5 multiple-choice questions
- Real-time feedback
- Score tracking
- Leaderboard integration

### Q&A System
- Submit questions anonymously or with email
- Filter by answered/pending status
- Search functionality
- Admin can answer via Supabase dashboard

### Feedback System
- 5-star rating system
- Text feedback
- Stored in database for analysis

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and anon key in `.env.local`
- Check if RLS policies are enabled (they should be)
- Ensure you ran `sql/setup.sql`

### Database Operations Not Working
- If UPDATE or DELETE operations fail, run `sql/update-policies.sql` in Supabase
- Test all operations at `/admin/test-db`
- See `DATABASE_OPERATIONS.md` for detailed troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 20+)

### Admin Login Issues
- Check credentials in `.env.local`
- Default: Username: `Admin_1234`, Password: `admin`
- Clear browser cache and try again

## Documentation

📚 **Comprehensive guides available:**

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[DATABASE_OPERATIONS.md](DATABASE_OPERATIONS.md)** - Database CRUD operations guide
- **[VERIFICATION_COMPLETE.md](VERIFICATION_COMPLETE.md)** - Verification checklist
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - All documentation index

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Credits

Created with ❤️ by the 9th Batch for the 10th Batch
