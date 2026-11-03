# Platform Diskusi Deployment Guide

## Prerequisites
- Node.js 18+
- Git
- Vercel account (vercel.com)

## 1. Prepare for Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Verify build works locally
npm run build
npm run type-check
```

## 2. Deploy to Vercel

### Option A: Push to GitHub + Connect Vercel

```bash
# Initialize Git (if not done)
git init
git add .
git commit -m "Platform Diskusi MVP ready for production"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/platform-diskusi.git
git branch -M main
git push -u origin main
```

Then:
1. Go to vercel.com/import
2. Select GitHub repo
3. Import project
4. Add environment variables (see below)
5. Deploy

### Option B: Deploy via CLI

```bash
cd E:/platform-diskusi
vercel --prod
```

## 3. Set Environment Variables on Vercel

In Vercel dashboard > Settings > Environment Variables, add:

```
DATABASE_URL=postgresql://neondb_owner:O82wfKZFvuYgv70aXBfWiQ@ep-empty-forest-bewvj4nl-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DIRECT_URL=postgresql://neondb_owner:O82wfKZFvuYgv70aXBfWiQ@ep-empty-forest-bewvj4nl.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

AUTH_SECRET=db1e4a2c5f8b9d3e7a1c6f4b2e8d9a5c

AUTH_URL=https://YOUR_VERCEL_DOMAIN.vercel.app

CLOUDINARY_CLOUD_NAME=dqzbb7tda
CLOUDINARY_API_KEY=896924358388247
CLOUDINARY_API_SECRET=HxNqI6Gq4YIyxZR0gP--0QQ8oi8

ABLY_API_KEY=qcFFjA.box6tg:764_tlji0CGDYht-3p03HqhICG09P8y7JXU4-CNrZbs

UPSTASH_REDIS_REST_URL=https://united-giraffe-89746.upstash.io
UPSTASH_REDIS_REST_TOKEN=gQAAAAAAAV6SAAIgcDJkYzRjMmU2NWM5MWU0NzliYWRiOTI5MDdmZjBmOGJmNA

RESEND_API_KEY=re_YOUR_RESEND_KEY
```

## 4. Run Database Migrations

After deployment:

```bash
# SSH into Vercel or run via GitHub Actions
npx prisma migrate deploy

# Seed test data (optional)
npx prisma db seed
```

Or use Vercel CLI:

```bash
vercel env pull  # Download prod env
npx prisma migrate deploy
npx prisma db seed
```

## 5. Verify Deployment

```bash
curl https://YOUR_VERCEL_DOMAIN.vercel.app

# Test API
curl https://YOUR_VERCEL_DOMAIN.vercel.app/api/auth/callback/credentials
```

## 6. Monitor

- Vercel Dashboard: analytics + logs
- Check for errors: `vercel logs`
- Database: Neon console

## Troubleshooting

**Build fails:** Check `npm run build` locally first
**Database connection:** Verify DATABASE_URL + DIRECT_URL
**Auth not working:** Check AUTH_SECRET + AUTH_URL match
**Images not loading:** Verify Cloudinary API keys

---

Ready to deploy? 🚀
