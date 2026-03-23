import SITE_CONFIG from "./config.js";
import { parseFrontMatter, renderMarkdown, slugify } from "./markdown.js";
import { formatDate } from "./site.js";

let postIndexPromise;

function isLocalPreview() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function getGithubDirectoryUrl() {
  const { owner, repo, branch, contentDir } = SITE_CONFIG.github;
  const encodedDir = contentDir
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `https://api.github.com/repos/${owner}/${repo}/contents/${encodedDir}?ref=${encodeURIComponent(branch)}`;
}

function normalizePost(markdown, fileName) {
  const { data, body } = parseFrontMatter(markdown);
  const fallbackSlug = slugify(fileName.replace(/\.md$/i, ""));
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    title: data.title || fileName.replace(/\.md$/i, ""),
    slug: data.slug ? slugify(data.slug) : fallbackSlug,
    summary: data.summary || "",
    author: data.author || SITE_CONFIG.profile.name,
    publishedAt: data.publishedAt || new Date(0).toISOString(),
    tags,
    draft: Boolean(data.draft),
    body,
    file: fileName,
  };
}

async function fetchPostDirectory() {
  if (isLocalPreview()) {
    const response = await fetch("content/posts/", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load local blog posts.");
    }

    const html = await response.text();
    const documentFragment = new DOMParser().parseFromString(html, "text/html");
    return Array.from(documentFragment.querySelectorAll("a"))
      .map((link) => link.getAttribute("href") || "")
      .filter((href) => href.endsWith(".md"))
      .map((href) => ({
        name: href,
        download_url: `content/posts/${href}`,
      }));
  }

  const response = await fetch(getGithubDirectoryUrl(), {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit reached while loading blog posts.");
    }
    throw new Error("Could not load blog posts from GitHub.");
  }

  const entries = await response.json();
  return entries.filter((entry) => entry.type === "file" && entry.name.endsWith(".md"));
}

async function fetchMarkdownPost(entry) {
  const response = await fetch(entry.download_url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${entry.name}.`);
  }

  const markdown = await response.text();
  return normalizePost(markdown, entry.name);
}

export async function loadPostIndex() {
  if (!postIndexPromise) {
    postIndexPromise = fetchPostDirectory().then(async (entries) => {
      const posts = await Promise.all(entries.map(fetchMarkdownPost));
      return posts
        .filter((post) => !post.draft)
        .sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
    });
  }

  return postIndexPromise;
}

export async function loadPostBySlug(slug) {
  const index = await loadPostIndex();
  const post = index.find((entry) => entry.slug === slug);
  if (!post) {
    throw new Error("Post not found.");
  }

  return post;
}

export function renderPostCard(post) {
  const tags = (post.tags || [])
    .slice(0, 3)
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  return `
    <article class="post-card">
      <p class="meta-text">${formatDate(post.publishedAt)}</p>
      <h3>${post.title}</h3>
      <p>${post.summary}</p>
      <div class="tag-row">${tags}</div>
      <a class="post-link" href="post.html?slug=${encodeURIComponent(post.slug)}">Read post</a>
    </article>
  `;
}

export function renderPostListItem(post) {
  const tags = (post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");
  return `
    <article class="post-list-item">
      <p class="meta-text">${formatDate(post.publishedAt)}</p>
      <h2>${post.title}</h2>
      <p>${post.summary}</p>
      <div class="tag-row">${tags}</div>
      <a class="post-link" href="post.html?slug=${encodeURIComponent(post.slug)}">Open article</a>
    </article>
  `;
}

export function renderFullPost(post) {
  const tags = (post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");

  return `
    <header class="post-header">
      <p class="eyebrow">Blog Post</p>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <span class="meta-text">${formatDate(post.publishedAt)}</span>
        <span class="meta-text">${post.author}</span>
      </div>
      <div class="tag-row">${tags}</div>
    </header>
    <div class="rich-copy">${renderMarkdown(post.body)}</div>
  `;
}
