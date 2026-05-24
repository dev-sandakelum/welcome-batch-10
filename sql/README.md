# SQL Scripts Guide

This folder contains SQL scripts for setting up and managing your Supabase database.

## Files

### 1. `setup.sql` - Initial Database Setup
**Purpose**: Creates all tables, indexes, RLS policies, and seeds admin credentials.

**When to use**: 
- First time setting up the database
- After running `reset.sql`

**What it creates**:
- `questions` table - Stores student questions
- `quiz_scores` table - Stores quiz results
- `feedback` table - Stores user feedback
- `admin_users` table - Stores admin login credentials (plain text passwords)
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

### 4. `update-policies.sql` - Update RLS Policies
**Purpose**: Adds missing UPDATE/DELETE policies and ensures `admin_users` table is ready.

**When to use**:
- If you already have the database set up but admin login isn't working
- To add UPDATE/DELETE permissions for the admin panel

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

### admin_users
```sql
id              UUID PRIMARY KEY
username        VARCHAR(255) NOT NULL
password        TEXT NOT NULL
is_active       BOOLEAN DEFAULT TRUE
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

---

## Row Level Security (RLS)

All tables have RLS enabled with these policies:

**SELECT (Read)**: ✅ Anyone can read all data  
**INSERT (Create)**: ✅ Anyone can insert new records  
**UPDATE (Modify)**: ✅ Anyone can update (admin panel uses this)  
**DELETE (Remove)**: ✅ Anyone can delete (admin panel uses this)

For `admin_users`, access is handled server-side via the API route using the service role key.

---

## Admin Credentials

Admin usernames/passwords are stored in the `admin_users` table as plain text.

Seeded users (from `setup.sql`):
- Username: `welcome_admin` / Password: `fot_26_1`
- Username: `welcome_admin` / Password: `fot_26_2`
- Username: `welcome_admin` / Password: `fot_26_3`
- Username: `welcome_admin` / Password: `fot_26_4`
- Username: `welcome_admin` / Password: `fot_26_5`

To add a new admin password:
```sql
INSERT INTO admin_users (username, password, is_active)
VALUES ('welcome_admin', 'your-new-password', TRUE);
```

Make sure your `.env.local` has the service role key so the login API can query `admin_users`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

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

### Admin login still fails after setup
**Cause**: `admin_users` table may have old `password_hash` column from a previous setup  
**Solution**: Run `reset.sql` then `setup.sql` to get a clean schema with the `password` column

### No data showing in app
**Cause**: Tables empty or RLS blocking  
**Solution**: 
1. Run `test-data.sql` to add sample data
2. Check RLS policies are set correctly
3. Verify your Supabase credentials in `.env.local`

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

---

**Remember**: Always test SQL scripts on a development database first before running on production!
