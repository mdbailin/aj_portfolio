import { loadPostIndex, renderPostListItem } from "./blog-data.js";
import { hideStatus, initSite, setStatus } from "./site.js";

async function initBlogPage() {
  initSite("blog.html");

  const status = document.getElementById("blog-status");
  const blogList = document.getElementById("blog-list");
  
  const params = new URLSearchParams(window.location.search);
  const filterTag = params.get("tag");
  console.log("Filter tag from URL:", filterTag);

  try {
    let posts = await loadPostIndex();
    console.log("Total posts loaded:", posts.length);
    console.log("Posts:", posts.map(p => ({ title: p.title, tags: p.tags })));
    
    if (filterTag) {
      const beforeCount = posts.length;
      posts = posts.filter(post => {
        const hasTag = post.tags && post.tags.some(tag => 
          tag.toLowerCase() === filterTag.toLowerCase()
        );
        console.log(`  Post "${post.title}" - tags: ${post.tags} - matches "${filterTag}": ${hasTag}`);
        return hasTag;
      });
      console.log(`Filtered from ${beforeCount} to ${posts.length} posts`);
      
      // Update page title
      const titleMap = {
        'education': 'Math Education',
        'research': 'Research & Applied Math',
        'communication': 'Science Communication'
      };
      const sectionTitle = titleMap[filterTag] || filterTag;
      document.title = `${sectionTitle} | Dr. Aidin Jalilzadeh`;
      
      const introSection = document.querySelector('.page-intro h1');
      if (introSection) {
        introSection.textContent = `${sectionTitle} articles`;
      }
      
      const descParagraph = document.querySelector('.page-intro p');
      if (descParagraph) {
        descParagraph.textContent = `Posts about ${sectionTitle.toLowerCase()}.`;
      }
    }
    
    if (posts.length === 0) {
      const message = filterTag 
        ? `No posts found with the tag "${filterTag}".` 
        : "No posts have been published yet.";
      console.log("Showing status message:", message);
      setStatus(status, message);
      return;
    }

    console.log("Rendering", posts.length, "posts");
    hideStatus(status);
    blogList.innerHTML = posts.map(renderPostListItem).join("");
  } catch (error) {
    console.error("Error:", error);
    setStatus(status, error.message, "error");
  }
}

initBlogPage();
