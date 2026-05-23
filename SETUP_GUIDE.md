# Complete Setup Guide - Welcome 10th Batch

This guide will walk you through setting up the entire application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development Setup](#local-development-setup)
4. [Database Configuration](#database-configuration)
5. [Testing the Application](#testing-the-application)
6. [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** version 20 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **Supabase account** ([Sign up free](https://supabase.com))
- A **code editor** (VS Code recommended)
- **Git** installed ([Download](https://git-scm.com/))

### Verify Installation

```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `welcome-10th-batch` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be ready

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click **"Settings"** (gear icon)
2. Click **"API"** in the left sidebar
3. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
4. Keep this tab open - you'll need these values soon

### Step 3: Set Up the Database

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `sql/setup.sql` from this project
4. Copy ALL the contents and paste into the SQL Editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: ✅ "Success. No rows returned"

### Step 4: Insert Test Data (Optional but Recommended)

1. Still in the SQL Editor, click **"New query"** again
2. Open the file `sql/test-data.sql`
3. Copy ALL the contents and paste into the SQL Editor
4. Click **"Run"**
5. You should see: ✅ "Success. No rows returned"

### Step 5: Verify Tables Were Created

1. Click **"Table Editor"** in the left sidebar
2. You should see three tables:
   - `questions`
   - `quiz_scores`
   - `feedback`
3. Click on each table to see the test data

---

## Local Development Setup

### Step 1: Clone or Download the Project

If using Git:
```bash
git clone <your-repo-url>
cd welcome-10
```

Or download and extract the ZIP file, then navigate to the folder.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, React, Supabase client, etc.)

### Step 3: Configure Environment Variables

1. In the project root, you'll see a file named `.env.example`
2. Create a copy and rename it to `.env.local`:

   **On Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env.local
   ```

   **On Mac/Linux:**
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` in your code editor
4. Replace the placeholder values with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   ⚠️ **Important**: 
   - Do NOT add quotes around the values
   - Do NOT commit this file to Git (it's already in .gitignore)
   - Keep these credentials secret

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.2.6
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 5: Open in Browser

1. Open your browser
2. Go to: [http://localhost:3000](http://localhost:3000)
3. You should see the beautiful welcome page! 🎉

---

## Database Configuration

### Understanding Row Level Security (RLS)

The database is configured with RLS policies that allow:
- ✅ Anyone can **read** all data
- ✅ Anyone can **insert** new data
- ❌ No one can **update** or **delete** via the app

This is perfect for a public-facing application.

### Answering Questions (Admin Task)

To answer student questions:

1. Go to your Supabase dashboard
2. Click **"Table Editor"** → **"questions"**
3. Find the question you want to answer
4. Click on the row to edit
5. Fill in the **"answer"** field
6. Set **"answered"** to `true`
7. Click **"Save"**

The answer will immediately appear on the website!

### Viewing Feedback

1. Go to **"Table Editor"** → **"feedback"**
2. View all feedback with ratings
3. Export to CSV if needed (click the "..." menu)

---

## Testing the Application

### Test the Quiz

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click **"Take the Quiz"**
3. Answer all 5 questions
4. Enter your name
5. Click **"Submit to Leaderboard"**
6. Check the leaderboard to see your score

### Test Questions

1. Click **"Ask Questions"**
2. Fill in the form
3. Submit
4. Go to Supabase Table Editor → questions
5. You should see your question there

### Test Feedback

1. Click **"Feedback"** from the home page
2. Rate your experience (click stars)
3. Write feedback
4. Submit
5. Check Supabase Table Editor → feedback

---

## Deployment

### Deploy to Vercel (Recommended)

Vercel is made by the creators of Next.js and offers the best experience.

#### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

#### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click **"Environment Variables"**
7. Add your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
8. Click **"Deploy"**
9. Wait 2-3 minutes
10. Your site is live! 🚀

#### Step 3: Get Your Live URL

Vercel will give you a URL like: `https://your-project.vercel.app`

Share this with your students!

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **AWS Amplify**: If you're using AWS
- **DigitalOcean App Platform**: Budget-friendly option

All require the same environment variables.

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: 
- Check that `.env.local` exists in the project root
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Issue: Database queries fail

**Solution**:
- Verify you ran `sql/setup.sql` in Supabase
- Check that RLS is enabled on all tables
- Verify your Supabase project is active (not paused)

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

### Issue: Build fails with TypeScript errors

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Issue: Styles not loading

**Solution**:
- Check that `public/assets/styles.css` exists
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

---

## Maintenance

### Backing Up Your Database

1. Go to Supabase dashboard
2. Click **"Database"** → **"Backups"**
3. Backups are automatic, but you can trigger manual backups
4. Download backups for extra safety

### Resetting the Database

⚠️ **WARNING**: This deletes ALL data!

1. Go to SQL Editor in Supabase
2. Open `sql/reset.sql`
3. Copy and run the script
4. Then run `sql/setup.sql` again to recreate tables
5. Optionally run `sql/test-data.sql` for sample data

### Updating Quiz Questions

Edit `app/quiz/page.tsx` and modify the `quizData` array:

```typescript
const quizData = [
  {
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correct: 0, // Index of correct answer (0-3)
    feedback: "Explanation of the answer"
  },
  // Add more questions...
];
```

---

## Security Best Practices

1. ✅ **Never commit `.env.local`** to Git
2. ✅ **Use environment variables** for all secrets
3. ✅ **Keep Supabase keys secret** - don't share publicly
4. ✅ **Enable RLS** on all tables (already done)
5. ✅ **Regularly update dependencies**: `npm update`
6. ✅ **Monitor Supabase usage** to avoid hitting free tier limits

---

## Getting Help

### Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Docs**: [react.dev](https://react.dev)

### Common Questions

**Q: Can I use a different database?**
A: Yes, but you'll need to rewrite the database queries. Supabase is recommended for simplicity.

**Q: How much does this cost?**
A: Free! Supabase free tier includes 500MB database and 2GB bandwidth. Vercel is also free for personal projects.

**Q: Can I customize the design?**
A: Absolutely! Edit `public/assets/styles.css` to change colors, fonts, and layouts.

**Q: How do I add more pages?**
A: Create a new folder in `app/` with a `page.tsx` file. Next.js will automatically create the route.

---

## Next Steps

Now that your app is running:

1. ✅ Customize the content (quiz questions, FAQ, etc.)
2. ✅ Update colors and branding in CSS
3. ✅ Add your university logo
4. ✅ Test all features thoroughly
5. ✅ Deploy to production
6. ✅ Share with students!

---

**Congratulations! Your Welcome Portal is ready! 🎉**

If you run into any issues, refer back to this guide or check the main README.md file.
