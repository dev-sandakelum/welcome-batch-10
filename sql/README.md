# SQL Scripts Guide

This folder contains SQL scripts for setting up and managing your Supabase database.

## Files

### 1. `setup.sql` - Initial Database Setup
**Purpose**: Creates all tables, indexes, RLS policies, and functions.

**When to use**: 
- First time setting up the database
- After running `reset.sql`

**What it creates**:
- `questions` table - Stores student questions
- `quiz_scores` table - Stores quiz results
- `feedback` table - Stores user feedback
- Indexes for better performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

**How to run**:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Click "New query"
4. Copy and paste the entire contents of `setup.sql`
5. Click "Run" or press Ctrl/Cmd + Enter

**Expected output**: ✅ "Success. No rows returned"

---

### 2. `test-data.sql` - Sample Data
**Purpose**: Inserts sample data for testing and demonstration.

**When to use**:
- After running `setup.sql`
- When you want to see how the app looks with data
- For development and testing

**What it inserts**:
- 7 sample questions (5 answered, 2 pending)
- 15 sample quiz scores for the leaderboard
- 6 sample feedback entries with ratings

**How to run**:
1. Make sure you've run `setup.sql` first
2. Open Supabase SQL Editor
3. Click "New query"
4. Copy and paste the entire contents of `test-data.sql`
5. Click "Run"

**Expected output**: ✅ "Success. No rows returned"

**Note**: You can run this multiple times, but it will create duplicate data.

---

### 3. `reset.sql` - Database Reset
**Purpose**: Removes ALL tables and data. Use with caution!

⚠️ **WARNING**: This script will permanently delete:
- All tables
- All data
- All triggers
- All functions

**When to use**:
- When you want to start fresh
- When testing database migrations
- When you've made a mistake and want to reset

**How to run**:
1. Open Supabase SQL Editor
2. Click "New query"
3. Copy and paste the entire contents of `reset.sql`
4. Click "Run"
5. Then run `setup.sql` again to recreate the structure

**Expected output**: ✅ "Success. No rows returned"

**After running**: You must run `setup.sql` again to recreate the tables.

---

## Typical Workflow

### First Time Setup
```
1. Run setup.sql
2. Run test-data.sql (optional)
3. Start using the app
```

### Reset and Start Over
```
1. Run reset.sql
2. Run setup.sql
3. Run test-data.sql (optional)
```

### Production Setup
```
1. Run setup.sql
2. Do NOT run test-data.sql
3. Let real users create data
```

---

## Database Schema

### questions
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) NOT NULL
email           VARCHAR(255)
question        TEXT NOT NULL
answer          TEXT
answered        BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

### quiz_scores
```sql
id                  UUID PRIMARY KEY
player_name         VARCHAR(255) NOT NULL
score               INTEGER NOT NULL
total_questions     INTEGER NOT NULL
created_at          TIMESTAMP WITH TIME ZONE
```

### feedback
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) NOT NULL
email           VARCHAR(255)
rating          INTEGER NOT NULL (1-5)
feedback_text   TEXT NOT NULL
created_at      TIMESTAMP WITH TIME ZONE
```

---

## Row Level Security (RLS)

All tables have RLS enabled with these policies:

**SELECT (Read)**: ✅ Anyone can read all data  
**INSERT (Create)**: ✅ Anyone can insert new records  
**UPDATE (Modify)**: ❌ Not allowed via app (admin only via dashboard)  
**DELETE (Remove)**: ❌ Not allowed via app (admin only via dashboard)

This ensures:
- Students can submit questions, quiz scores, and feedback
- Everyone can view public data
- Only admins can modify or delete data (via Supabase dashboard)

---

## Troubleshooting

### Error: "relation already exists"
**Cause**: Tables already exist  
**Solution**: Run `reset.sql` first, then `setup.sql`

### Error: "permission denied"
**Cause**: RLS policies blocking access  
**Solution**: Check that you're using the correct Supabase anon key

### Error: "syntax error"
**Cause**: Incomplete SQL copied  
**Solution**: Make sure you copied the ENTIRE file contents

### No data showing in app
**Cause**: Tables empty or RLS blocking  
**Solution**: 
1. Run `test-data.sql` to add sample data
2. Check RLS policies are set correctly
3. Verify your Supabase credentials in `.env.local`

---

## Backup and Restore

### Manual Backup
1. Go to Supabase Dashboard
2. Click "Database" → "Backups"
3. Click "Create backup"
4. Download the backup file

### Restore from Backup
1. Go to Supabase Dashboard
2. Click "Database" → "Backups"
3. Find your backup
4. Click "Restore"

### Export Data as CSV
1. Go to "Table Editor"
2. Select a table
3. Click the "..." menu
4. Click "Download as CSV"

---

## Advanced: Custom Queries

### Get all unanswered questions
```sql
SELECT * FROM questions 
WHERE answered = false 
ORDER BY created_at DESC;
```

### Get top 10 quiz scores
```sql
SELECT * FROM quiz_scores 
ORDER BY score DESC, created_at ASC 
LIMIT 10;
```

### Get average feedback rating
```sql
SELECT AVG(rating) as average_rating 
FROM feedback;
```

### Count questions by status
```sql
SELECT 
  answered,
  COUNT(*) as count
FROM questions
GROUP BY answered;
```

---

## Need Help?

- Check the main `SETUP_GUIDE.md` for detailed instructions
- Visit [Supabase Documentation](https://supabase.com/docs)
- Open an issue on GitHub

---

**Remember**: Always test SQL scripts on a development database first before running on production!
