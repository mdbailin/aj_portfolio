import { loadPostIndex, renderPostListItem } from "./blog-data.js";
import { hideStatus, initSite, setStatus } from "./site.js";

async function initBlogPage() {
  initSite("blog.html");

  const status = document.getElementById("blog-status");
  const blogList = document.getElementById("blog-list");
  
  // Get tag filter from URL if present
  const params = new URLSearchParams(window.location.search);
  const filterTag = params.get("tag");

  try {
    let posts = await loadPostIndex();
    
    // Filter by tag if specified
    if (filterTag) {
      posts = posts.filter(post => 
        post.tags && post.tags.some(tag => 
          tag.toLowerCase() === filterTag.toLowerCase()
        )
      );
      
      // Update page title to show filter
      const titleMap = {
        'education': 'Math Education',
        'research': 'Research & Applied Math',
        'communication': 'Science Communication'
      };
      const sectionTitle = titleMap[filterTag] || filterTag;
      document.title = `${sectionTitle} | Dr. Aidin Jalilzadeh`;
      
      // Add heading to show filtered view
      const introSection = document.querySelector('.page-intro h1');
      if (introSection) {
        introSection.textContent = `${sectionTitle} articles`;
      }
      
      // Update the description text
      const descParagraph = document.querySelector('.page-intro p');
      if (descParagraph) {
        descParagraph.textContent = `Posts about ${sectionTitle.toLowerCase()}.`;
      }
    }
    
    if (posts.length === 0) {
      const message = filterTag 
        ? `No posts found with the tag "${filterTag}".` 
        : "No posts have been published yet.";
      setStatus(status, message);
      return;
    }

    hideStatus(status);
    blogList.innerHTML = posts.map(renderPostListItem).join("");
  } catch (error) {
    setStatus(status, error.message, "error");
  }
}

initBlogPage();
