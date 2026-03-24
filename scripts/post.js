import { loadPostBySlug, renderFullPost } from "./blog-data.js";
import { initSite, setStatus } from "./site.js";

let mathRendererPromise;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      if (existing.dataset.loaded === "true") {
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });
}

function ensureMathRenderer() {
  if (!mathRendererPromise) {
    mathRendererPromise = loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js")
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"));
  }

  return mathRendererPromise;
}

async function renderMath(container) {
  await ensureMathRenderer();

  if (typeof window.renderMathInElement !== "function") {
    throw new Error("Math rendering library did not load.");
  }

  window.renderMathInElement(container, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
}

async function initPostPage() {
  initSite("");

  const status = document.getElementById("post-status");
  const container = document.getElementById("post-view");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    setStatus(status, "No blog post was specified.", "error");
    return;
  }

  try {
    const post = await loadPostBySlug(slug);
    document.title = `${post.title} | Aidin Jalilzadeh`;
    container.innerHTML = renderFullPost(post);
    await renderMath(container);
  } catch (error) {
    setStatus(status, error.message, "error");
  }
}

initPostPage();
