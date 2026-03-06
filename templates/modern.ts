import { ResumeData } from "../lib/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hasContent(arr: unknown[]): boolean {
  if (!arr || arr.length === 0) return false;
  if (arr.length === 1 && (arr[0] === "" || arr[0] === null)) return false;
  return true;
}

export function generateModernPortfolio(data: ResumeData): string {
  const e = escapeHtml;

  const navItems: { id: string; label: string }[] = [];
  navItems.push({ id: "hero", label: "Home" });
  if (data.summary) navItems.push({ id: "about", label: "About" });
  if (hasContent(data.skills))
    navItems.push({ id: "skills", label: "Skills" });
  if (hasContent(data.experience))
    navItems.push({ id: "experience", label: "Experience" });
  if (hasContent(data.education))
    navItems.push({ id: "education", label: "Education" });
  if (hasContent(data.projects))
    navItems.push({ id: "projects", label: "Projects" });
  if (
    hasContent(data.certifications) ||
    hasContent(data.awards) ||
    hasContent(data.languages)
  )
    navItems.push({ id: "more", label: "More" });
  navItems.push({ id: "contact", label: "Contact" });

  const navLinksHtml = navItems
    .map(
      (item) =>
        `<a href="#${item.id}" class="nav-link" data-section="${item.id}">${item.label}</a>`
    )
    .join("\n            ");

  // Hero section
  const contactLinks: string[] = [];
  if (data.email)
    contactLinks.push(
      `<a href="mailto:${e(data.email)}" class="contact-btn" title="Email"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span>${e(data.email)}</span></a>`
    );
  if (data.linkedin)
    contactLinks.push(
      `<a href="${e(data.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-btn" title="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg><span>LinkedIn</span></a>`
    );
  if (data.github)
    contactLinks.push(
      `<a href="${e(data.github)}" target="_blank" rel="noopener noreferrer" class="contact-btn" title="GitHub"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg><span>GitHub</span></a>`
    );
  if (data.portfolio)
    contactLinks.push(
      `<a href="${e(data.portfolio)}" target="_blank" rel="noopener noreferrer" class="contact-btn" title="Portfolio"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>Portfolio</span></a>`
    );

  const heroHtml = `
    <section id="hero" class="hero">
      <div class="hero-content animate-on-scroll">
        <div class="hero-badge">${e(data.location || "Available for opportunities")}</div>
        <h1 class="hero-name">${e(data.name || "Your Name")}</h1>
        <p class="hero-title">${e(data.title || "Professional")}</p>
        ${contactLinks.length > 0 ? `<div class="hero-links">${contactLinks.join("\n")}</div>` : ""}
      </div>
    </section>`;

  // About section
  const aboutHtml = data.summary
    ? `
    <section id="about" class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">About Me</h2>
        <p class="about-text animate-on-scroll">${e(data.summary)}</p>
      </div>
    </section>`
    : "";

  // Skills section
  const skillsHtml = hasContent(data.skills)
    ? `
    <section id="skills" class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Skills & Technologies</h2>
        <div class="skills-grid">
          ${data.skills
            .filter((s) => s.category && hasContent(s.items))
            .map(
              (skill) => `
          <div class="skill-group animate-on-scroll">
            <h3 class="skill-category">${e(skill.category)}</h3>
            <div class="skill-tags">
              ${skill.items
                .filter((item) => item)
                .map((item) => `<span class="skill-tag">${e(item)}</span>`)
                .join("\n              ")}
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`
    : "";

  // Experience section
  const experienceHtml = hasContent(data.experience)
    ? `
    <section id="experience" class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Experience</h2>
        <div class="timeline">
          ${data.experience
            .filter((exp) => exp.company || exp.role)
            .map(
              (exp) => `
          <div class="timeline-item animate-on-scroll">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <div>
                  <h3 class="timeline-role">${e(exp.role)}</h3>
                  <p class="timeline-company">${e(exp.company)}</p>
                </div>
                <div class="timeline-meta">
                  <span class="timeline-duration">${e(exp.duration)}</span>
                  ${exp.location ? `<span class="timeline-location">${e(exp.location)}</span>` : ""}
                </div>
              </div>
              ${
                hasContent(exp.bullets)
                  ? `<ul class="timeline-bullets">
                ${exp.bullets
                  .filter((b) => b)
                  .map((b) => `<li>${e(b)}</li>`)
                  .join("\n                ")}
              </ul>`
                  : ""
              }
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`
    : "";

  // Education section
  const educationHtml = hasContent(data.education)
    ? `
    <section id="education" class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Education</h2>
        <div class="education-grid">
          ${data.education
            .filter((edu) => edu.institution || edu.degree)
            .map(
              (edu) => `
          <div class="education-card animate-on-scroll">
            <div class="education-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5"/></svg>
            </div>
            <h3 class="education-institution">${e(edu.institution)}</h3>
            <p class="education-degree">${e(edu.degree)}</p>
            <div class="education-meta">
              ${edu.duration ? `<span>${e(edu.duration)}</span>` : ""}
              ${edu.gpa ? `<span class="education-gpa">GPA: ${e(edu.gpa)}</span>` : ""}
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`
    : "";

  // Projects section
  const projectsHtml = hasContent(data.projects)
    ? `
    <section id="projects" class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Projects</h2>
        <div class="projects-grid">
          ${data.projects
            .filter((p) => p.name || p.description)
            .map(
              (project) => `
          <div class="project-card animate-on-scroll">
            <div class="project-header">
              <h3 class="project-name">${e(project.name)}</h3>
              ${
                project.link
                  ? `<a href="${e(project.link)}" target="_blank" rel="noopener noreferrer" class="project-link" title="View Project">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              </a>`
                  : ""
              }
            </div>
            <p class="project-description">${e(project.description)}</p>
            ${
              hasContent(project.techStack)
                ? `<div class="project-tech">
              ${project.techStack
                .filter((t) => t)
                .map((tech) => `<span class="tech-tag">${e(tech)}</span>`)
                .join("\n              ")}
            </div>`
                : ""
            }
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`
    : "";

  // More section (certifications, languages, awards)
  const hasCerts = hasContent(data.certifications);
  const hasAwards = hasContent(data.awards);
  const hasLangs = hasContent(data.languages);
  const moreHtml =
    hasCerts || hasAwards || hasLangs
      ? `
    <section id="more" class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">Additional</h2>
        <div class="more-grid">
          ${
            hasCerts
              ? `<div class="more-card animate-on-scroll">
            <h3 class="more-card-title">Certifications</h3>
            <ul class="more-list">${data.certifications
              .filter((c) => c)
              .map((c) => `<li>${e(c)}</li>`)
              .join("")}</ul>
          </div>`
              : ""
          }
          ${
            hasAwards
              ? `<div class="more-card animate-on-scroll">
            <h3 class="more-card-title">Awards</h3>
            <ul class="more-list">${data.awards
              .filter((a) => a)
              .map((a) => `<li>${e(a)}</li>`)
              .join("")}</ul>
          </div>`
              : ""
          }
          ${
            hasLangs
              ? `<div class="more-card animate-on-scroll">
            <h3 class="more-card-title">Languages</h3>
            <div class="skill-tags">${data.languages
              .filter((l) => l)
              .map((l) => `<span class="skill-tag">${e(l)}</span>`)
              .join("")}</div>
          </div>`
              : ""
          }
        </div>
      </div>
    </section>`
      : "";

  // Contact section
  const contactHtml = `
    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="contact-content animate-on-scroll">
          <h2 class="section-title">Get In Touch</h2>
          <p class="contact-text">I'm always open to new opportunities and interesting projects. Feel free to reach out!</p>
          <div class="contact-links">
            ${data.email ? `<a href="mailto:${e(data.email)}" class="contact-btn-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> ${e(data.email)}</a>` : ""}
            ${data.phone ? `<a href="tel:${e(data.phone)}" class="contact-btn-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ${e(data.phone)}</a>` : ""}
            ${data.linkedin ? `<a href="${e(data.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-btn-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn</a>` : ""}
            ${data.github ? `<a href="${e(data.github)}" target="_blank" rel="noopener noreferrer" class="contact-btn-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub</a>` : ""}
          </div>
        </div>
      </div>
    </section>`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e(data.name || "Portfolio")} — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #0a0a0b;
      --bg-secondary: #111113;
      --bg-tertiary: #1a1a1d;
      --text: #fafafa;
      --text-secondary: #a1a1aa;
      --text-tertiary: #71717a;
      --border: #27272a;
      --accent: #6366f1;
      --accent-hover: #818cf8;
      --accent-subtle: rgba(99, 102, 241, 0.1);
      --card-bg: #111113;
      --card-hover: #18181b;
      --shadow: 0 1px 3px rgba(0,0,0,0.3);
      --shadow-lg: 0 10px 40px rgba(0,0,0,0.4);
      --radius: 12px;
      --radius-sm: 8px;
      --transition: 0.2s ease;
    }

    [data-theme="light"] {
      --bg: #fafafa;
      --bg-secondary: #ffffff;
      --bg-tertiary: #f4f4f5;
      --text: #09090b;
      --text-secondary: #52525b;
      --text-tertiary: #a1a1aa;
      --border: #e4e4e7;
      --accent: #4f46e5;
      --accent-hover: #6366f1;
      --accent-subtle: rgba(79, 70, 229, 0.08);
      --card-bg: #ffffff;
      --card-hover: #f4f4f5;
      --shadow: 0 1px 3px rgba(0,0,0,0.08);
      --shadow-lg: 0 10px 40px rgba(0,0,0,0.08);
    }

    html { scroll-behavior: smooth; scroll-padding-top: 80px; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      transition: background var(--transition), color var(--transition);
      -webkit-font-smoothing: antialiased;
    }

    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(12px);
      background: color-mix(in srgb, var(--bg) 85%, transparent);
      transition: background var(--transition), border-color var(--transition);
    }
    .navbar-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .navbar-brand {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text);
      text-decoration: none;
    }
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all var(--transition);
    }
    .nav-link:hover, .nav-link.active {
      color: var(--text);
      background: var(--accent-subtle);
    }
    .nav-link.active {
      color: var(--accent);
    }
    .theme-toggle {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all var(--transition);
      margin-left: 8px;
      flex-shrink: 0;
    }
    .theme-toggle:hover { color: var(--text); background: var(--card-hover); }
    .theme-toggle svg { width: 18px; height: 18px; }
    .sun-icon { display: none; }
    .moon-icon { display: block; }
    [data-theme="light"] .sun-icon { display: block; }
    [data-theme="light"] .moon-icon { display: none; }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: var(--text);
      cursor: pointer;
      padding: 8px;
    }

    /* Container */
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 24px 80px;
      text-align: center;
    }
    .hero-content { max-width: 700px; }
    .hero-badge {
      display: inline-block;
      padding: 6px 16px;
      background: var(--accent-subtle);
      color: var(--accent);
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-bottom: 24px;
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }
    .hero-name {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 12px;
      background: linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-title {
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      color: var(--text-secondary);
      font-weight: 400;
      margin-bottom: 32px;
    }
    .hero-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .contact-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid var(--border);
      transition: all var(--transition);
    }
    .contact-btn:hover {
      color: var(--text);
      background: var(--card-hover);
      border-color: var(--text-tertiary);
      transform: translateY(-1px);
    }

    /* Sections */
    .section { padding: 80px 0; }
    .section-title {
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 48px;
      color: var(--text);
    }

    /* About */
    .about-text {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.8;
      max-width: 700px;
    }

    /* Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .skill-group {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      transition: all var(--transition);
    }
    .skill-group:hover {
      border-color: var(--text-tertiary);
      box-shadow: var(--shadow);
    }
    .skill-category {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 14px;
    }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag {
      padding: 5px 12px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border-radius: 6px;
      font-size: 0.825rem;
      font-weight: 500;
      transition: all var(--transition);
      border: 1px solid transparent;
    }
    .skill-tag:hover {
      color: var(--text);
      border-color: var(--border);
      background: var(--card-hover);
    }

    /* Timeline */
    .timeline { position: relative; padding-left: 32px; }
    .timeline::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--border);
    }
    .timeline-item {
      position: relative;
      margin-bottom: 40px;
    }
    .timeline-item:last-child { margin-bottom: 0; }
    .timeline-marker {
      position: absolute;
      left: -32px;
      top: 8px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--bg);
      border: 3px solid var(--accent);
      z-index: 1;
    }
    .timeline-content {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      transition: all var(--transition);
    }
    .timeline-content:hover {
      border-color: var(--text-tertiary);
      box-shadow: var(--shadow);
    }
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .timeline-role {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text);
    }
    .timeline-company {
      font-size: 0.95rem;
      color: var(--accent);
      font-weight: 500;
    }
    .timeline-meta {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .timeline-duration {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .timeline-location {
      font-size: 0.8rem;
      color: var(--text-tertiary);
    }
    .timeline-bullets {
      list-style: none;
      padding: 0;
    }
    .timeline-bullets li {
      position: relative;
      padding-left: 16px;
      margin-bottom: 6px;
      font-size: 0.925rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .timeline-bullets li::before {
      content: '›';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-weight: 700;
    }

    /* Education */
    .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .education-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      transition: all var(--transition);
    }
    .education-card:hover {
      border-color: var(--text-tertiary);
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    .education-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--accent-subtle);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .education-institution {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .education-degree {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    .education-meta {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    .education-gpa {
      color: var(--accent);
      font-weight: 600;
    }

    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .project-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      transition: all var(--transition);
      display: flex;
      flex-direction: column;
    }
    .project-card:hover {
      border-color: var(--text-tertiary);
      box-shadow: var(--shadow-lg);
      transform: translateY(-3px);
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .project-name {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .project-link {
      color: var(--text-tertiary);
      transition: color var(--transition);
      flex-shrink: 0;
    }
    .project-link:hover { color: var(--accent); }
    .project-description {
      font-size: 0.925rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 16px;
      flex-grow: 1;
    }
    .project-tech { display: flex; flex-wrap: wrap; gap: 6px; }
    .tech-tag {
      padding: 3px 10px;
      background: var(--accent-subtle);
      color: var(--accent);
      border-radius: 5px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* More section */
    .more-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .more-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
    }
    .more-card-title {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 14px;
    }
    .more-list {
      list-style: none;
      padding: 0;
    }
    .more-list li {
      padding: 6px 0;
      font-size: 0.925rem;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border);
    }
    .more-list li:last-child { border-bottom: none; }

    /* Contact */
    .contact-section {
      padding-bottom: 120px;
    }
    .contact-content { text-align: center; }
    .contact-text {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 32px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .contact-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }
    .contact-btn-lg {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      border: 1px solid var(--border);
      transition: all var(--transition);
    }
    .contact-btn-lg:hover {
      color: var(--text);
      background: var(--accent-subtle);
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid var(--border);
      color: var(--text-tertiary);
      font-size: 0.825rem;
    }

    /* Animations */
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .navbar-links { display: none; }
      .navbar-links.open {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--bg);
        border-bottom: 1px solid var(--border);
        padding: 16px 24px;
        gap: 4px;
      }
      .mobile-menu-btn { display: block; }
      .hero { padding: 100px 20px 60px; min-height: auto; }
      .hero-name { font-size: 2.2rem; }
      .section { padding: 60px 0; }
      .section-title { font-size: 1.5rem; margin-bottom: 32px; }
      .timeline-header { flex-direction: column; }
      .timeline-meta { text-align: left; flex-direction: row; gap: 12px; }
      .contact-btn span { display: none; }
      .contact-btn { padding: 10px; }
      .projects-grid { grid-template-columns: 1fr; }
      .education-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="navbar-inner">
      <a href="#hero" class="navbar-brand">${e(data.name ? data.name.split(" ")[0] : "Portfolio")}</a>
      <div class="navbar-links" id="navLinks">
        ${navLinksHtml}
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </nav>

  <main>
    ${heroHtml}
    ${aboutHtml}
    ${skillsHtml}
    ${experienceHtml}
    ${educationHtml}
    ${projectsHtml}
    ${moreHtml}
    ${contactHtml}
  </main>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${e(data.name || "Portfolio")}. All rights reserved.</p>
  </footer>

  <script>
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const stored = localStorage.getItem('theme');
    if (stored) html.setAttribute('data-theme', stored);
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) html.setAttribute('data-theme', 'light');

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[data-section]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(item => item.classList.remove('active'));
          const active = document.querySelector('.nav-link[data-section="' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(section => observer.observe(section));

    // Scroll animations
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => animObserver.observe(el));
  </script>
</body>
</html>`;
}
