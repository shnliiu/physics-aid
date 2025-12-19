# Physics Study Hub - Deployment Guide

## Deploy to Vercel (Recommended - 100% Free)

Vercel is the company behind Next.js and offers free hosting for Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com with your GitHub account)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Physics Study Hub - Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/physics-aid.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `physics-aid` repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Click "Deploy"

### Step 3: Configure Environment (Optional)


**To deploy:**
- No additional configuration needed
- The app will work perfectly with just the static physics content

### Your Live URL

After deployment, Vercel will provide:
- Production URL: `https://physics-aid.vercel.app` (or similar)
- Automatic HTTPS
- Global CDN distribution
- Automatic deployments on git push

### Free Tier Limits (Hobby Plan)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Perfect for classroom use (hundreds of students)

---

## Alternative: Deploy to Netlify (Also 100% Free)

### Quick Deploy to Netlify

1. Go to https://netlify.com and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Framework**: Next.js
5. Click "Deploy site"

### Free Tier Limits
- ✅ 100GB bandwidth per month
- ✅ 300 build minutes per month
- ✅ Custom domains
- ✅ Automatic HTTPS

---

## Sharing with Classmates

Once deployed, share the URL with your classmates:
- No login required
- Works on mobile and desktop
- Fast loading from CDN
- Always available (unless you exceed free tier limits)

**Example URLs to share:**
- `https://physics-aid.vercel.app/tutor` - Main study hub
- `https://your-site.netlify.app/tutor` - Alternative

---

## Updating Content

To add more physics content:

1. Edit `/src/data/physicsContent.ts`
2. Add new chapters, problems, or flashcards
3. Commit and push:
   ```bash
   git add .
   git commit -m "Add more thermodynamics content"
   git push
   ```
4. Vercel/Netlify will automatically rebuild and deploy (takes ~2 minutes)

---

## Monitoring Usage

### Vercel Dashboard
- View deployment status
- Check bandwidth usage
- See visitor analytics
- Monitor build logs

### Free Tier is Enough
For a classroom of 50-100 students:
- Average page size: ~180KB
- 100GB = ~555,000 page loads per month
- More than enough for heavy daily use

---

## Troubleshooting

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Ensure `package.json` has all dependencies
- Test build locally first: `npm run build`

**Page not loading:**
- Check Vercel deployment status
- Verify the URL is correct (add `/tutor` path)
- Check browser console for errors



---

## Cost Breakdown

- ✅ Hosting: **FREE** (Vercel/Netlify Hobby plan)
- ✅ Domain: **FREE** (vercel.app or netlify.app subdomain)
- ✅ SSL/HTTPS: **FREE** (automatic)
- ✅ CDN: **FREE** (global distribution)
- ✅ Deployments: **FREE** (unlimited)

**Total monthly cost: $0.00**

Perfect for sharing with classmates! 🎓
