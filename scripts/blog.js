import { loadPostIndex, renderPostListItem } from "./blog-data.js";
import { hideStatus, initSite, setStatus } from "./site.js";

async function initBlogPage() {
  console.log("=== STEP 1: initBlogPage started ===");
  
  initSite("blog.html");

  const status = document.getElementById("blog-status");
  const blogList = document.getElementById("blog-list");
  
  const params = new URLSearchParams(window.location.search);
  const filterTag = params.get("tag");
  console.log("STEP 2: Filter tag from URL:", filterTag);

  try {
    console.log("STEP 3: About to call loadPostIndex...");
    let posts = await loadPostIndex();
    console.log("STEP 4: loadPostIndex completed, posts count:", posts.length);
    console.log("STEP 5: Posts data:", JSON.stringify(posts.map(p => ({ title: p.title, tags: p.tags })), null, 2));
    
    if (filterTag) {
      console.log("STEP 6: Filtering posts by tag:", filterTag);
      const beforeCount = posts.length;
      posts = posts.filter(post => {
        const hasTag = post.tags && post.tags.some(tag => 
          tag.toLowerCase() === filterTag.toLowerCase()
        );
        console.log(`  Post "${post.title.substring(0,30)}..." - tags: ${JSON.stringify(post.tags)} - matches: ${hasTag}`);
        return hasTag;
      });
      console.log("STEP 7: Filtered from", beforeCount, "to", posts.length, "posts");
    }
    
    console.log("STEP 8: Checking if posts.length === 0");
    if (posts.length === 0) {
      const message = filterTag 
        ? `No posts found with the tag "${filterTag}".` 
        : "No posts have been published yet.";
      console.log("STEP 9: No posts, setting status message:", message);
      setStatus(status, message);
      return;
    }

    console.log("STEP 10: Rendering", posts.length, "posts");
    hideStatus(status);
    blogList.innerHTML = posts.map(renderPostListItem).join("");
    console.log("STEP 11: Done rendering");
    
  } catch (error) {
    console.error("STEP ERROR:", error);
    setStatus(status, error.message, "error");
  }
}

initBlogPage();
