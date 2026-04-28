# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PURNACHANDHSUNKARA/Student-course-registration)

## Manual Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your GitHub repository: `PURNACHANDHSUNKARA/Student-course-registration`

### 2. Configure Project Settings

Vercel should auto-detect the Vite framework. Verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `Student Course Manager` (if not at root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables (Optional)

If you have any environment variables, add them in the Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add your variables (e.g., API URLs, keys)

### 4. Deploy

Click "Deploy" and Vercel will:
- Install dependencies
- Run the build command
- Deploy your application
- Provide you with a production URL

## Local Build Test

Before deploying, test the build locally:

```bash
cd "Student Course Manager"
npm install
npm run build
npm run preview
```

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check for TypeScript/ESLint errors
- Verify Node.js version compatibility (v18+ recommended)

### Routing Issues
- The `vercel.json` file handles SPA routing
- All routes redirect to `/index.html`

### Environment Issues
- Check that build outputs to `dist` directory
- Verify `vercel.json` configuration is correct

## Files Added for Deployment

- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `public/_redirects` - SPA routing support
- Updated `vite.config.js` - Production build settings

## Post-Deployment

After successful deployment:
1. Test all routes and functionality
2. Check browser console for errors
3. Verify responsive design
4. Test on different browsers

## Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
