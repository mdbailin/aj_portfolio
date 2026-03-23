import SITE_CONFIG from "./config.js";

function navLink(href, label, activePage) {
  const activeClass = activePage === href ? "is-active" : "";
  return `<a class="${activeClass}" href="${href}">${label}</a>`;
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

export function initSite(activePage) {
  document.title = activePage === "index.html" ? SITE_CONFIG.site.title : `${document.title}`;

  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <a class="site-mark" href="index.html" aria-label="Go to the home page">
        <span class="site-mark-title">${SITE_CONFIG.site.title}</span>
        ${SITE_CONFIG.site.subtitle ? `<span class="site-mark-subtitle">${SITE_CONFIG.site.subtitle}</span>` : ""}
      </a>
      <nav class="site-nav" aria-label="Primary">
        ${navLink("index.html", "Home", activePage)}
        ${navLink("videos.html", "Videos", activePage)}
        ${navLink("blog.html", "Blog", activePage)}
      </nav>
    `;
  }

  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <p>${SITE_CONFIG.site.title}.</p>
      <p><a class="footer-link" href="resume.pdf" download>Resume PDF</a></p>
    `;
  }

  bindProfileContent();
}
