# AR Showcase Platform - Complete Deployment Guide

This guide will walk you through deploying the AR Showcase Platform with:
- **Backend + Database**: Railway (Django + PostgreSQL)
- **Frontend**: Vercel (Next.js)
- **Subdomain Support**: `subdomain.yourdomain.com`

## Prerequisites

1. **Accounts Required:**
   - [Railway Account](https://railway.app) (for backend + database)
   - [Vercel Account](https://vercel.com) (for frontend)
   - Domain name (for subdomain support)

2. **Local Tools:**
   - Node.js 18+ 
   - Python 3.8+
   - Git

## Step 1: Prepare Your Code

1. **Clone/Download the project**
2. **Install Railway CLI:**
   \`\`\`bash
   npm install -g @railway/cli
   \`\`\`

3. **Install Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

## Step 2: Deploy Backend to Railway

### 2.1 Setup Railway Project

1. **Login to Railway:**
   \`\`\`bash
   railway login
   \`\`\`

2. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

3. **Initialize Railway project:**
   \`\`\`bash
   railway init
   # Choose "Create new project"
   # Name it "ar-showcase-backend"
   \`\`\`

### 2.2 Add PostgreSQL Database

1. **Add PostgreSQL service:**
   \`\`\`bash
   railway add postgresql
   \`\`\`
   
   This automatically creates a PostgreSQL database and sets the `DATABASE_URL` environment variable.

### 2.3 Configure Environment Variables

1. **Set required environment variables:**
   \`\`\`bash
   # Generate a secure secret key
   railway variables set SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
   
   # Set debug to false for production
   railway variables set DEBUG=False
   
   # Set allowed hosts (Railway will auto-configure this)
   railway variables set ALLOWED_HOSTS="*.railway.app"
   \`\`\`

### 2.4 Deploy Backend

1. **Deploy the application:**
   \`\`\`bash
   railway up
   \`\`\`

2. **Run database migrations:**
   \`\`\`bash
   railway run python manage.py migrate
   \`\`\`

3. **Create sample data:**
   \`\`\`bash
   railway run python manage.py create_sample_data
   \`\`\`

4. **Create admin user (optional):**
   \`\`\`bash
   railway run python manage.py createsuperuser
   \`\`\`

### 2.5 Get Backend URL

1. **Get your Railway deployment URL:**
   \`\`\`bash
   railway status
   \`\`\`
   
   Save this URL - you'll need it for the frontend configuration.
   Example: `https://ar-showcase-backend-production.up.railway.app`

## Step 3: Deploy Frontend to Vercel

### 3.1 Configure Environment Variables

1. **Create `.env.local` file in the root directory:**
   \`\`\`bash
   # Replace with your actual Railway backend URL
   NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
   \`\`\`

### 3.2 Deploy to Vercel

1. **Login to Vercel:**
   \`\`\`bash
   vercel login
   \`\`\`

2. **Deploy the frontend:**
   \`\`\`bash
   vercel --prod
   \`\`\`

3. **Follow the prompts:**
   - Link to existing project or create new
   - Choose your settings
   - Deploy

### 3.3 Configure Custom Domain

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains

2. **Add your domain:**
   - Add `yourdomain.com`
   - Add `*.yourdomain.com` (wildcard for subdomains)

3. **Configure DNS records** (at your domain provider):
   \`\`\`
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel's IP)
   
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   \`\`\`

## Step 4: Configure CORS for Subdomains

### 4.1 Update Backend CORS Settings

1. **Update Railway environment variables:**
   \`\`\`bash
   railway variables set FRONTEND_URLS="https://yourdomain.com,https://*.yourdomain.com"
   \`\`\`

2. **Redeploy backend:**
   \`\`\`bash
   railway up
   \`\`\`

## Step 5: Test Your Deployment

### 5.1 Test Main Domain
- Visit: `https://yourdomain.com`
- Should show the main AR showcase

### 5.2 Test Subdomains
- Visit: `https://demo.yourdomain.com`
- Should show demo company products

### 5.3 Test Local Development with Subdomains

For local testing, you can simulate subdomains:

1. **Add to your `/etc/hosts` file:**
   \`\`\`
   127.0.0.1 localhost.com
   127.0.0.1 demo.localhost.com
   127.0.0.1 test.localhost.com
   \`\`\`

2. **Start local servers:**
   \`\`\`bash
   # Backend
   cd backend
   python manage.py runserver
   
   # Frontend (new terminal)
   npm run dev
   \`\`\`

3. **Test locally:**
   - `http://demo.localhost.com:3000` - Demo company
   - `http://localhost:3000?subdomain=demo` - Alternative method

## Step 6: Admin Panel Setup

### 6.1 Access Django Admin

1. **Visit:** `https://your-backend-url.up.railway.app/admin`

2. **Login** with the superuser credentials you created

3. **Add companies and products** through the admin interface

### 6.2 Create Your First Company

1. **Go to Companies** → Add Company
2. **Fill in:**
   - Name: "Your Company Name"
   - Subdomain: "yourcompany" (will be accessible at yourcompany.yourdomain.com)
   - Description: "Your company description"
   - Upload logo (optional)

3. **Add Products** for your company

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check `FRONTEND_URLS` environment variable in Railway
   - Ensure wildcard domain is properly configured

2. **Subdomain Not Working:**
   - Verify DNS wildcard record (`*.yourdomain.com`)
   - Check Vercel domain configuration

3. **API Not Found (404):**
   - Verify `NEXT_PUBLIC_API_URL` in frontend
   - Check Railway backend URL is correct

4. **Database Connection Issues:**
   - Railway automatically configures `DATABASE_URL`
   - Run migrations: `railway run python manage.py migrate`

### Useful Commands:

\`\`\`bash
# Check Railway logs
railway logs

# Check Railway environment variables
railway variables

# Redeploy Railway
railway up

# Check Vercel deployment logs
vercel logs

# Redeploy Vercel
vercel --prod
\`\`\`

## Production Checklist

- [ ] Backend deployed to Railway with PostgreSQL
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured with wildcard DNS
- [ ] CORS settings updated for your domain
- [ ] Sample data created
- [ ] Admin user created
- [ ] SSL certificates active (automatic with Railway/Vercel)
- [ ] Subdomain routing working
- [ ] AR functionality tested on mobile devices

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Railway and Vercel logs
3. Ensure all environment variables are set correctly
4. Test API endpoints directly using the backend URL

Your AR Showcase Platform should now be fully deployed and accessible via subdomains!
