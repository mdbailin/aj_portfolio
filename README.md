# Aidin Jalilzadeh Portfolio

Static academic portfolio designed for GitHub Pages.

## Included pages

- `index.html`: home page with headshot and resume download.
- `videos.html`: latest 10 uploads from a configured YouTube channel.
- `blog.html`: public blog index.
- `post.html`: individual post reader.

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

## Blog authoring with CloudCannon

The public site no longer exposes an admin page. Blog authoring is intended to happen through CloudCannon, which connects to the GitHub repository and provides a proper editor/login flow for Aidin.

Relevant repo files:

- `cloudcannon.config.yml`
- `.cloudcannon/schemas/post.md`
- `content/posts/*.md`

Recommended CloudCannon setup:

1. Create a CloudCannon site connected to `mdbailin/aj_portfolio`.
2. Invite Aidin as an editor in CloudCannon.
3. Open the `Blog Posts` collection.
4. Create or edit Markdown posts in the CloudCannon editor.
5. Publish the changes back to GitHub.

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

## Local preview

Serve the folder with a small static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
