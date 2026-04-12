import { loadPostIndex, renderPostListItem } from "./blog-data.js";
import { initSite } from "./site.js";

async function initBlogPage() {
  initSite("blog.html");

  const status = document.getElementById("blog-status");
  const blogList = document.getElementById("blog-list");
  
  const params = new URLSearchParams(window.location.search);
  const filterTag = params.get("tag");

  try {
    let posts = await loadPostIndex();
    console.log("Posts loaded:", posts.length);
    
    if (filterTag) {
      posts = posts.filter(post => 
        post.tags && post.tags.some(tag => 
          tag.toLowerCase().trim() === filterTag.toLowerCase().trim()
        )
      );
      console.log("Filtered posts:", posts.length);
    }
    
    if (posts.length === 0) {
      if (status) {
        status.textContent = filterTag ? `No posts found with tag "${filterTag}".` : "No posts yet.";
        status.style.display = "block";
      }
      return;
    }

    // HIDE the status message
    if (status) {
      status.style.display = "none";
    }
    
    // SHOW the posts
    if (blogList) {
      blogList.innerHTML = posts.map(renderPostListItem).join("");
    }
    
  } catch (error) {
    console.error("Error:", error);
    if (status) {
      status.textContent = "Error loading posts.";
      status.style.display = "block";
    }
  }
}

initBlogPage();
