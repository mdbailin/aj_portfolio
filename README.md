# Aidin Jalilzadeh Portfolio

Static academic portfolio designed for GitHub Pages with TinaCMS-backed blog authoring.

## Included pages

- `index.html`: home page with headshot and resume download.
- `videos.html`: latest 10 uploads from a configured YouTube channel.
- `blog.html`: public blog index.
- `post.html`: individual post reader.
- `admin/`: TinaCMS admin app generated during deployment when Tina secrets are configured.

## GitHub Pages deployment

1. Create or use the target repo under the `mdbailin` account.
2. Push these files to the repository.
3. In GitHub, open `Settings > Pages`.
4. Set the source to `Deploy from a branch`.
5. Choose the branch, typically `main`, and `/ (root)`.

If the repo name changes, update `scripts/config.js`:

```js
github: {
  owner: "mdbailin",
  repo: "aj_portfolio",
  branch: "main",
  contentDir: "content/posts",
}
```

## YouTube feed setup

Add Aidin's YouTube channel details in `scripts/config.js`:

```js
youtube: {
  channelId: "YOUR_CHANNEL_ID",
  channelUrl: "https://www.youtube.com/@yourhandle",
}
```

The videos page uses the public channel RSS feed and renders the latest 10 uploads.

## Blog authoring with TinaCMS

The public site does not expose a custom in-browser editor. Blog authoring is intended to happen through TinaCMS, which provides a proper authenticated editing flow and writes Markdown content back to the GitHub repository.

Relevant repo files:

- `tina/config.ts`
- `content/posts/*.md`
- `.github/workflows/deploy-pages.yml`

Recommended Tina setup:

1. Create a TinaCloud project connected to `mdbailin/aj_portfolio`.
2. Copy the TinaCloud `clientId` and `token`.
3. Add GitHub repository secrets:
   - `TINA_PUBLIC_CLIENT_ID`
   - `TINA_TOKEN`
4. In GitHub Pages, switch the source from `Deploy from a branch` to `GitHub Actions`.
5. Push to `main` or rerun the `Deploy GitHub Pages` workflow.
6. Open `/admin/` on the deployed site and sign in through Tina.

Each blog post is a Markdown file with front matter in `content/posts/`, for example:

```md
---
title: Example Title
summary: A short summary for blog listing pages.
author: Aidin Jalilzadeh
publishedAt: 2026-03-23T00:00:00.000Z
tags:
  - research
  - notes
---

# Example Title

Post body here.
```

The public site reads those Markdown files directly from the GitHub repository and renders them on the blog pages.

## Local Tina development

Install dependencies:

```bash
npm install
```

Run the local site together with Tina:

```bash
npm run dev
```

If TinaCloud credentials are not configured locally, the public site still works, but the Tina admin build and authenticated editing flow will not.

## Local preview

Serve the folder with a small static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
