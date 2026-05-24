# Quick Start Guide ⚡

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Run `sql/setup.sql` (copy & paste, then click Run)
5. Run `sql/test-data.sql` (optional, for sample data)

## 3. Configure Environment

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
# Get them from: Supabase Dashboard → Settings → API
```

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## File Structure

```
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── quiz/              # Quiz feature
│   ├── leaderboard/       # Leaderboard
│   ├── questions/         # Ask questions
│   ├── all-questions/     # View all Q&A
│   └── feedback/          # Feedback form
├── lib/
│   └── supabase.ts        # Database client
├── public/assets/
│   ├── styles.css         # Global styles
│   └── animations.js      # Animations
├── sql/
│   ├── setup.sql          # Create tables
│   ├── test-data.sql      # Sample data
│   └── reset.sql          # Delete everything
└── .env.local             # Your secrets (create this!)
```

---

## Key Features

✅ **Quiz System** - Interactive quiz with leaderboard  
✅ **Q&A Platform** - Students ask, admins answer  
✅ **Feedback System** - Collect ratings and feedback  
✅ **Beautiful UI** - Royal purple & gold theme  
✅ **Fully Responsive** - Works on all devices  
✅ **Real-time Data** - Powered by Supabase  

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Run production build

# Maintenance
npm run lint         # Check code quality
```

---

## Need Help?

- 📖 Full guide: See `SETUP_GUIDE.md`
- 🐛 Issues: Check `README.md` troubleshooting section
- 💬 Questions: Open an issue on GitHub

---

**That's it! You're ready to go! 🚀**
