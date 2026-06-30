# Deploy to Cloudways — Static Site Guide

> Your complete website is built and ready in the `dist/` folder.

## Quick Deploy

### Option A: Cloudways (WordPress + Static Pages)

Cloudways primarily hosts WordPress, but you can serve static files alongside WP:

```
1. Cloudways → Application → your WordPress app
2. Go to "Application Settings" → "File Manager"
3. Upload the entire contents of `dist/` to the root:
   ├── index.html
   ├── about/
   ├── products/
   ├── solutions/
   ├── blog/
   ├── resources/
   ├── contact/
   ├── terms/
   ├── privacy-policy/
   └── _astro/
```

These static pages will be served at `sinbosen.com/` alongside your WordPress installation. WordPress handles the CMS/auth parts; Astro static pages handle the main content.

### Option B: Pure Static (Cloudflare Pages — Free, Recommended)

For the fastest, simplest deployment:

```
1. Push to a GitHub repo:
   cd website/astro-site
   git init && git add -A && git commit -m "Sinbosen site v1"
   git remote add origin https://github.com/yourname/sinbosen-site.git
   git push -u origin main

2. Go to pages.cloudflare.com → Connect GitHub → Select repo
   Build settings:
     Framework: Astro
     Build command: npm run build
     Build output: dist/
     Node version: 24

3. Add custom domain: sinbosen.com → Done
   (Free SSL, unlimited bandwidth, global CDN)
```

### Option C: Any Static Host

The `dist/` folder contains 100% static HTML, CSS, JS. Drop it on:
- Cloudways (via FTP/File Manager)
- Any Apache/Nginx server
- S3 + CloudFront
- GitHub Pages
- Netlify
- Vercel

## Site Stats

```
Pages:     23
Total size: 961 KB
Build time: 1.26 seconds
Tech:      Astro 5 + Tailwind CSS + Markdown
Content:   6 solutions, 6 products, 2 blog posts, 5 resources/static pages
```

## Content Management (No CMS Needed)

All content is in `src/content/` as Markdown files. To update:
1. Edit the `.md` file
2. Run `npm run build`
3. Upload `dist/` to your host
