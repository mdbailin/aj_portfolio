import SITE_CONFIG from "./config.js";

function navLink(href, label, activePage) {
  const activeClass = activePage === href ? "is-active" : "";
  return `<li><a class="${activeClass}" href="${href}">${label}</a></li>`;
}

export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function setStatus(element, message, variant = "") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove("status-success", "status-error", "is-hidden");
  if (variant === "success") {
    element.classList.add("status-success");
  }
  if (variant === "error") {
    element.classList.add("status-error");
  }
}

export function hideStatus(element) {
  if (element) {
    element.classList.add("is-hidden");
  }
}

export function bindProfileContent() {
  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = SITE_CONFIG.profile.name;
  });
  document.querySelectorAll("[data-profile-role]").forEach((node) => {
    node.textContent = SITE_CONFIG.profile.role;
  });
  document.querySelectorAll("[data-profile-summary]").forEach((node) => {
    node.textContent = SITE_CONFIG.profile.summary;
  });
}

function initMobileMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.querySelector(".nav-links");
  
  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
    
    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
}

export function initSite(activePage) {
  document.title = activePage === "index.html" ? SITE_CONFIG.site.title : `${document.title}`;

  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    header.className = "header";
    
    // Logo: show headerTitle if it exists, otherwise empty
    const logoHtml = SITE_CONFIG.site.headerTitle ? 
      `<a class="logo" href="index.html"><span>${SITE_CONFIG.site.headerTitle}</span></a>` : "";
    
    header.innerHTML = `
      ${logoHtml}
      <ul class="nav-links">
        ${navLink("index.html", "Home", activePage)}
        ${navLink("blog.html", "Blog", activePage)}
        ${navLink("videos.html", "Videos", activePage)}
      </ul>
      <a class="visit-btn" href="resume.pdf" download>Resume</a>
      <i class="fa-solid fa-bars" id="menu-icon"></i>
    `;
    
    // Initialize mobile menu after header is added to DOM
    initMobileMenu();
  }

  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <p>${SITE_CONFIG.site.headerTitle || "Dr. Aidin Jalilzadeh"}</p>
      <p><a class="footer-link" href="resume.pdf" download>Resume PDF</a></p>
    `;
  }

  bindProfileContent();
}
