# Deployment Checklist ✅

Use this checklist to ensure everything is set up correctly before going live.

---

## Pre-Deployment Checklist

### 1. Local Development ✓

- [ ] Project runs locally without errors (`npm run dev`)
- [ ] All pages load correctly
- [ ] Quiz functionality works
- [ ] Questions can be submitted
- [ ] Feedback can be submitted
- [ ] Leaderboard displays correctly
- [ ] No console errors in browser
- [ ] Build succeeds (`npm run build`)

### 2. Supabase Setup ✓

- [ ] Supabase project created
- [ ] `sql/setup.sql` executed successfully
- [ ] All 3 tables created (questions, quiz_scores, feedback)
- [ ] RLS policies enabled on all tables
- [ ] Test data inserted (optional: `sql/test-data.sql`)
- [ ] Can view data in Table Editor
- [ ] API credentials copied (URL and anon key)

### 3. Environment Variables ✓

- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] No quotes around values
- [ ] File is in `.gitignore` (should be by default)
- [ ] Values tested and working locally

### 4. Code Quality ✓

- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings (run `npm run lint`)
- [ ] All imports resolve correctly
- [ ] No unused variables or functions
- [ ] Comments added where needed

### 5. Content Review ✓

- [ ] Quiz questions are accurate
- [ ] FAQ answers are complete
- [ ] University information is correct
- [ ] Contact information updated (if any)
- [ ] Branding/colors match university theme

---

## Deployment Steps

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Prepare Repository

- [ ] Code committed to Git
  ```bash
  git add .
  git commit -m "Ready for deployment"
  ```
- [ ] Repository pushed to GitHub
  ```bash
  git push origin main
  ```
- [ ] Repository is public or accessible to Vercel

#### Step 2: Connect to Vercel

- [ ] Signed up/logged in to [vercel.com](https://vercel.com)
- [ ] Clicked "Add New..." → "Project"
- [ ] Imported GitHub repository
- [ ] Vercel detected Next.js automatically

#### Step 3: Configure Environment Variables

- [ ] Clicked "Environment Variables" section
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Values match your `.env.local` file
- [ ] Applied to all environments (Production, Preview, Development)

#### Step 4: Deploy

- [ ] Clicked "Deploy" button
- [ ] Waited for build to complete (2-3 minutes)
- [ ] Build succeeded ✅
- [ ] Received deployment URL

#### Step 5: Test Production

- [ ] Opened deployment URL
- [ ] Home page loads correctly
- [ ] Tested quiz functionality
- [ ] Submitted a test question
- [ ] Submitted test feedback
- [ ] Checked leaderboard
- [ ] Tested on mobile device
- [ ] No console errors

---

### Option B: Deploy to Netlify

#### Step 1: Prepare Repository

- [ ] Code committed and pushed to GitHub

#### Step 2: Connect to Netlify

- [ ] Signed up/logged in to [netlify.com](https://netlify.com)
- [ ] Clicked "Add new site" → "Import an existing project"
- [ ] Connected to GitHub
- [ ] Selected repository

#### Step 3: Configure Build Settings

- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Added environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Step 4: Deploy

- [ ] Clicked "Deploy site"
- [ ] Waited for build
- [ ] Build succeeded ✅
- [ ] Received deployment URL

#### Step 5: Test Production

- [ ] Tested all features (same as Vercel checklist above)

---

## Post-Deployment Checklist

### 1. Functionality Testing

- [ ] All pages accessible
- [ ] Quiz works end-to-end
- [ ] Scores appear on leaderboard
- [ ] Questions submitted successfully
- [ ] Feedback submitted successfully
- [ ] Search and filters work (all-questions page)
- [ ] Navigation works correctly
- [ ] Back buttons work

### 2. Performance Testing

- [ ] Page loads in < 3 seconds
- [ ] Images load quickly (if any)
- [ ] No layout shifts
- [ ] Smooth animations
- [ ] Database queries are fast

### 3. Mobile Testing

- [ ] Tested on iPhone/iOS
- [ ] Tested on Android
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] Text is readable

### 4. Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### 5. Database Verification

- [ ] Supabase project is active
- [ ] Data is being saved correctly
- [ ] Can view submissions in Table Editor
- [ ] RLS policies working as expected
- [ ] No unauthorized access

### 6. Security Check

- [ ] `.env.local` not committed to Git
- [ ] Supabase keys not exposed in client code
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] No sensitive data in error messages
- [ ] RLS policies prevent unauthorized modifications

---

## Domain Setup (Optional)

### Custom Domain Configuration

- [ ] Domain purchased (e.g., welcome.university.edu)
- [ ] Added domain in Vercel/Netlify dashboard
- [ ] Updated DNS records:
  - [ ] A record or CNAME pointing to deployment
  - [ ] SSL certificate issued (automatic)
- [ ] Domain propagated (can take 24-48 hours)
- [ ] HTTPS working on custom domain
- [ ] Redirects configured (www → non-www or vice versa)

---

## Monitoring Setup

### Analytics (Optional)

- [ ] Google Analytics added (if desired)
- [ ] Vercel Analytics enabled
- [ ] Tracking key events:
  - [ ] Quiz completions
  - [ ] Question submissions
  - [ ] Feedback submissions

### Error Tracking (Optional)

- [ ] Sentry or similar tool configured
- [ ] Error notifications set up
- [ ] Source maps uploaded

---

## Documentation

### For Users

- [ ] Shared deployment URL with students
- [ ] Created announcement/email
- [ ] Posted on social media
- [ ] Added to university website

### For Admins

- [ ] Documented how to answer questions
- [ ] Shared Supabase dashboard access
- [ ] Created admin guide
- [ ] Set up support channel

---

## Maintenance Plan

### Daily

- [ ] Check for new questions
- [ ] Monitor error logs

### Weekly

- [ ] Answer pending questions
- [ ] Review feedback
- [ ] Check database usage

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Review analytics
- [ ] Backup database
- [ ] Check for security updates

---

## Rollback Plan

### If Something Goes Wrong

1. **Vercel**: Click "Rollback" on previous deployment
2. **Netlify**: Deploy previous version from dashboard
3. **Database**: Restore from Supabase backup
4. **Code**: Revert Git commit and redeploy

### Emergency Contacts

- [ ] Supabase support: support@supabase.io
- [ ] Vercel support: support@vercel.com
- [ ] Team members: [List contact info]

---

## Success Criteria

### Launch is Successful When:

✅ All features work in production  
✅ No critical errors  
✅ Students can access the site  
✅ Data is being saved correctly  
✅ Performance is acceptable  
✅ Mobile experience is good  
✅ Admin can manage content  

---

## Final Checks Before Announcing

- [ ] Tested by at least 3 people
- [ ] All feedback addressed
- [ ] Content proofread
- [ ] Links verified
- [ ] Contact information correct
- [ ] Backup plan in place
- [ ] Team ready to support

---

## Launch Announcement Template

```
🎉 Welcome 10th Batch! 🎉

We're excited to introduce our new Welcome Portal!

🔗 Visit: [your-url-here]

Features:
✅ Interactive quiz about our university
✅ Ask questions and get answers from seniors
✅ Share your feedback
✅ Compete on the leaderboard

Get started now and explore everything our university has to offer!

#Welcome10thBatch #UniversityLife
```

---

## Post-Launch Monitoring

### First 24 Hours

- [ ] Monitor error logs every 2 hours
- [ ] Check database for submissions
- [ ] Respond to questions quickly
- [ ] Fix any critical bugs immediately

### First Week

- [ ] Daily check of all systems
- [ ] Respond to all questions within 24 hours
- [ ] Collect user feedback
- [ ] Make minor improvements

### First Month

- [ ] Weekly system checks
- [ ] Review analytics
- [ ] Plan improvements based on feedback
- [ ] Document lessons learned

---

## Troubleshooting Common Issues

### Issue: Build fails on Vercel
**Solution**: 
- Check build logs for errors
- Verify all dependencies in package.json
- Ensure TypeScript compiles locally
- Check environment variables are set

### Issue: Database connection fails
**Solution**:
- Verify Supabase URL and key
- Check RLS policies
- Ensure Supabase project is active
- Test connection locally first

### Issue: Slow performance
**Solution**:
- Check database query performance
- Optimize images
- Enable caching
- Use Vercel Analytics to identify bottlenecks

### Issue: Mobile layout broken
**Solution**:
- Test responsive CSS
- Check viewport meta tag
- Verify media queries
- Test on real devices

---

## Congratulations! 🎉

If you've checked all the boxes, your application is ready for production!

**Remember**: 
- Keep monitoring the first few days
- Be ready to respond to issues quickly
- Collect feedback for improvements
- Celebrate your success! 🚀

---

*Deployment Date: _______________*  
*Deployed By: _______________*  
*Deployment URL: _______________*  
*Custom Domain: _______________*
