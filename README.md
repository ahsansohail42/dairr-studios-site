# Dairr Studios Portfolio Site

A free, Netlify-ready Pinterest-style portfolio website for Dairr Studios.

## What is included

- Static website with no paid framework requirement
- Pinterest-style masonry feed
- Filters for All, Videos/Reels, Graphics, and Brands
- Brand-specific filtering
- Search bar
- Preview modal
- Email CTA connected to dairrstudios@gmail.com
- Decap CMS admin folder for updating `data/works.json`
- Dairr logo placed in `assets/dairr-logo.jpeg`

## Free stack

- Hosting: Netlify Free
- Code storage: GitHub Free
- CMS: Decap CMS
- Media storage: GitHub repo uploads through Decap CMS

## Important limits

This setup keeps costs at $0, but videos can become heavy. GitHub blocks files larger than 100 MB and warns above 50 MB. Keep uploaded videos compressed and short. For big video portfolios, host the video on YouTube and paste the YouTube URL instead.

## How to deploy on Netlify

1. Create a GitHub repository, for example `dairr-studios-site`.
2. Upload all files from this folder to that repo.
3. In `admin/config.yml`, replace:
   - `YOUR-GITHUB-USERNAME/dairr-studios-site`
   - `https://YOUR-SITE.netlify.app`
4. Go to Netlify and create a new site from your GitHub repo.
5. Keep the publish directory as `.` because this is a pure static site.
6. After deployment, open `/admin` to manage the feed.

## How to add work

Open `/admin` and edit the Works Feed.

### Manual graphic

- Type: Graphic
- Source: Manual Upload
- Media Type: Image
- Upload image in Thumbnail Upload and Media Upload

### Manual video/reel

- Type: Video or Reel
- Source: Manual Upload
- Media Type: Video
- Upload a thumbnail and video file

### YouTube URL

- Type: Video
- Source: YouTube
- Paste the YouTube URL in External URL
- Optional: upload a custom thumbnail

### Instagram URL

- Type: Graphic, Video, or Reel
- Source: Instagram
- Paste the Instagram URL in External URL
- Upload a thumbnail for the cleanest portfolio preview

## Notes

Instagram automatic previews can be unreliable without using Meta APIs. For the cleanest free version, always upload a thumbnail for Instagram work.
