import { ResumeData } from "../lib/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Sanitize URLs to prevent javascript: protocol injection */
function safeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return escapeHtml(trimmed);
  if (/^mailto:/i.test(trimmed)) return escapeHtml(trimmed);
  if (/^tel:/i.test(trimmed)) return escapeHtml(trimmed);
  // Bare domain or path — prefix with https
  if (trimmed && !trimmed.includes(":")) return escapeHtml("https://" + trimmed);
  return "#";
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
  if (hasContent(data.experience))
    navItems.push({ id: "experience", label: "Experience" });
  if (hasContent(data.education))
    navItems.push({ id: "education", label: "Education" });
  if (hasContent(data.skills))
    navItems.push({ id: "skills", label: "Skills" });
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

  // Hero contact links
  const contactLinks: string[] = [];
  if (data.email)
    contactLinks.push(
      `<a href="mailto:${e(data.email)}" class="hero-btn" title="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span>${e(data.email)}</span></a>`
    );
  if (data.linkedin)
    contactLinks.push(
      `<a href="${safeUrl(data.linkedin)}" target="_blank" rel="noopener noreferrer" class="hero-btn" title="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg><span>LinkedIn</span></a>`
    );
  if (data.github)
    contactLinks.push(
      `<a href="${safeUrl(data.github)}" target="_blank" rel="noopener noreferrer" class="hero-btn" title="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg><span>GitHub</span></a>`
    );
  if (data.portfolio)
    contactLinks.push(
      `<a href="${safeUrl(data.portfolio)}" target="_blank" rel="noopener noreferrer" class="hero-btn" title="Portfolio"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>Portfolio</span></a>`
    );

  const heroHtml = `
    <section id="hero" class="hero">
      <div class="hero-glow"></div>
      <div class="hero-content anim" style="--d:0">
        <div class="hero-badge"><span class="hero-badge-dot"></span>${e(data.location || "Open to opportunities")}</div>
        <h1 class="hero-name">${e(data.name || "Your Name")}</h1>
        <p class="hero-title">${e(data.title || "Professional")}</p>
        ${data.summary ? `<p class="hero-summary">${e(data.summary)}</p>` : ""}
        ${contactLinks.length > 0 ? `<div class="hero-links">${contactLinks.join("\n")}</div>` : ""}
      </div>
    </section>`;

  // Section numbering
  let sectionNum = 1;

  // Experience section
  const experienceHtml = hasContent(data.experience)
    ? `
    <section id="experience" class="section">
      <div class="container">
        <div class="section-header anim"><span class="section-num">0${sectionNum++}</span><h2 class="section-title">Experience</h2></div>
        <div class="timeline">
          ${data.experience
            .filter((exp) => exp.company || exp.role)
            .map(
              (exp, i) => `
          <div class="timeline-item anim" style="--d:${i * 0.1}">
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
                ${exp.bullets.filter((b) => b).map((b) => `<li>${e(b)}</li>`).join("\n                ")}
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
        <div class="section-header anim"><span class="section-num">0${sectionNum++}</span><h2 class="section-title">Education</h2></div>
        <div class="education-grid">
          ${data.education
            .filter((edu) => edu.institution || edu.degree)
            .map(
              (edu, i) => `
          <div class="education-card anim" style="--d:${i * 0.1}">
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

  // Skills section
  const skillsHtml = hasContent(data.skills)
    ? `
    <section id="skills" class="section">
      <div class="container">
        <div class="section-header anim"><span class="section-num">0${sectionNum++}</span><h2 class="section-title">Skills & Technologies</h2></div>
        <div class="skills-grid">
          ${data.skills
            .filter((s) => s.category && hasContent(s.items))
            .map(
              (skill, i) => `
          <div class="skill-group anim" style="--d:${i * 0.08}">
            <h3 class="skill-category">${e(skill.category)}</h3>
            <div class="skill-tags">
              ${skill.items.filter((item) => item).map((item) => `<span class="skill-tag">${e(item)}</span>`).join("\n              ")}
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`
    : "";

  // Projects section — with gradient accent borders
  const gradients = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #06b6d4, #3b82f6)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #10b981, #06b6d4)",
    "linear-gradient(135deg, #ec4899, #8b5cf6)",
    "linear-gradient(135deg, #f97316, #f59e0b)",
  ];
  const projectsHtml = hasContent(data.projects)
    ? `
    <section id="projects" class="section">
      <div class="container">
        <div class="section-header anim"><span class="section-num">0${sectionNum++}</span><h2 class="section-title">Projects</h2></div>
        <div class="projects-grid">
          ${data.projects
            .filter((p) => p.name || p.description)
            .map(
              (project, i) => `
          <div class="project-card anim" style="--d:${i * 0.1}">
            <div class="project-accent" style="background:${gradients[i % gradients.length]}"></div>
            <div class="project-body">
              <div class="project-header">
                <h3 class="project-name">${e(project.name)}</h3>
                ${
                  project.link
                    ? `<a href="${safeUrl(project.link)}" target="_blank" rel="noopener noreferrer" class="project-link" title="View Project">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </a>`
                    : ""
                }
              </div>
              <p class="project-description">${e(project.description)}</p>
              ${
                hasContent(project.techStack)
                  ? `<div class="project-tech">
                ${project.techStack.filter((t) => t).map((tech) => `<span class="tech-tag">${e(tech)}</span>`).join("\n                ")}
              </div>`
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

  // More section
  const hasCerts = hasContent(data.certifications);
  const hasAwards = hasContent(data.awards);
  const hasLangs = hasContent(data.languages);
  const moreHtml =
    hasCerts || hasAwards || hasLangs
      ? `
    <section id="more" class="section">
      <div class="container">
        <div class="section-header anim"><span class="section-num">0${sectionNum++}</span><h2 class="section-title">Additional</h2></div>
        <div class="more-grid">
          ${hasCerts ? `<div class="more-card anim" style="--d:0"><h3 class="more-card-title">Certifications</h3><ul class="more-list">${data.certifications.filter((c) => c).map((c) => `<li>${e(c)}</li>`).join("")}</ul></div>` : ""}
          ${hasAwards ? `<div class="more-card anim" style="--d:0.08"><h3 class="more-card-title">Awards</h3><ul class="more-list">${data.awards.filter((a) => a).map((a) => `<li>${e(a)}</li>`).join("")}</ul></div>` : ""}
          ${hasLangs ? `<div class="more-card anim" style="--d:0.16"><h3 class="more-card-title">Languages</h3><div class="skill-tags">${data.languages.filter((l) => l).map((l) => `<span class="skill-tag">${e(l)}</span>`).join("")}</div></div>` : ""}
        </div>
      </div>
    </section>`
      : "";

  // Contact section
  const contactHtml = `
    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="contact-content anim">
          <h2 class="section-title" style="text-align:center">Get In Touch</h2>
          <p class="contact-text">I'm always open to new opportunities and interesting projects. Feel free to reach out!</p>
          <div class="contact-links">
            ${data.email ? `<a href="mailto:${e(data.email)}" class="contact-btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>${e(data.email)}</a>` : ""}
            ${data.phone ? `<a href="tel:${e(data.phone)}" class="contact-btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${e(data.phone)}</a>` : ""}
            ${data.linkedin ? `<a href="${safeUrl(data.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn</a>` : ""}
            ${data.github ? `<a href="${safeUrl(data.github)}" target="_blank" rel="noopener noreferrer" class="contact-btn-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>GitHub</a>` : ""}
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
  <meta name="description" content="Portfolio of ${e(data.name || "")} — ${e(data.title || "")}">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #09090b;
      --bg-s: #111113;
      --bg-t: #18181b;
      --text: #fafafa;
      --text-s: #a1a1aa;
      --text-t: #71717a;
      --border: #27272a;
      --accent: #6366f1;
      --accent-h: #818cf8;
      --accent-sub: rgba(99,102,241,.1);
      --card: #111113;
      --card-h: #1c1c1f;
      --shadow: 0 1px 3px rgba(0,0,0,.3);
      --shadow-l: 0 20px 60px rgba(0,0,0,.35);
      --r: 14px;
      --t: .2s ease;
    }
    [data-theme="light"] {
      --bg: #fafafa;
      --bg-s: #ffffff;
      --bg-t: #f4f4f5;
      --text: #09090b;
      --text-s: #52525b;
      --text-t: #a1a1aa;
      --border: #e4e4e7;
      --accent: #4f46e5;
      --accent-h: #6366f1;
      --accent-sub: rgba(79,70,229,.07);
      --card: #ffffff;
      --card-h: #f4f4f5;
      --shadow: 0 1px 3px rgba(0,0,0,.06);
      --shadow-l: 0 20px 60px rgba(0,0,0,.06);
    }

    html { scroll-behavior: smooth; scroll-padding-top: 80px; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      transition: background var(--t), color var(--t);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::selection { background: var(--accent); color: #fff; }

    /* ── Navbar ── */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(16px) saturate(1.8);
      background: color-mix(in srgb, var(--bg) 80%, transparent);
      transition: background var(--t), border-color var(--t);
    }
    .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { font-weight: 700; font-size: 1.05rem; color: var(--text); text-decoration: none; letter-spacing: -.01em; }
    .nav-links { display: flex; align-items: center; gap: 2px; }
    .nav-link { color: var(--text-t); text-decoration: none; font-size: .8rem; font-weight: 500; padding: 6px 12px; border-radius: 8px; transition: all var(--t); letter-spacing: .01em; }
    .nav-link:hover { color: var(--text); background: var(--accent-sub); }
    .nav-link.active { color: var(--accent); background: var(--accent-sub); }
    .nav-right { display: flex; align-items: center; gap: 6px; }
    .theme-btn {
      background: var(--bg-t); border: 1px solid var(--border); border-radius: 10px;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--text-s); transition: all var(--t); flex-shrink: 0;
    }
    .theme-btn:hover { color: var(--text); border-color: var(--text-t); }
    .theme-btn svg { width: 16px; height: 16px; }
    .sun-i { display: none; } .moon-i { display: block; }
    [data-theme="light"] .sun-i { display: block; }
    [data-theme="light"] .moon-i { display: none; }
    .mob-btn { display: none; background: none; border: none; color: var(--text); cursor: pointer; padding: 6px; border-radius: 8px; }
    .mob-btn:hover { background: var(--bg-t); }

    /* Mobile nav overlay */
    .nav-overlay { display: none; position: fixed; inset: 0; z-index: 99; background: color-mix(in srgb, var(--bg) 95%, transparent); backdrop-filter: blur(20px); padding: 80px 24px 24px; }
    .nav-overlay.open { display: flex; flex-direction: column; gap: 4px; animation: fadeIn .2s; }
    .nav-overlay .nav-link { font-size: 1.2rem; padding: 14px 16px; border-radius: 12px; }

    /* ── Container ── */
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    /* ── Scroll Animations ── */
    .anim { opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--d, 0) * 1s); }
    .anim.visible { opacity: 1; transform: translateY(0); }

    /* ── Hero ── */
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 100px 24px 80px; text-align: center; position: relative; overflow: hidden; }
    .hero-glow {
      position: absolute; top: -40%; left: 50%; transform: translateX(-50%);
      width: 800px; height: 800px; border-radius: 50%;
      background: radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 70%);
      pointer-events: none; animation: glowPulse 6s ease-in-out infinite alternate;
    }
    @keyframes glowPulse { 0% { opacity: .6; transform: translateX(-50%) scale(1); } 100% { opacity: 1; transform: translateX(-50%) scale(1.15); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .hero-content { max-width: 680px; position: relative; z-index: 1; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 16px; background: var(--accent-sub); color: var(--accent);
      border-radius: 100px; font-size: .78rem; font-weight: 600; letter-spacing: .02em;
      margin-bottom: 28px; border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }
    .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: dotPulse 2s infinite; }
    @keyframes dotPulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
    .hero-name {
      font-size: clamp(2.8rem, 7vw, 4.5rem); font-weight: 800;
      letter-spacing: -.04em; line-height: 1.05; margin-bottom: 16px;
    }
    .hero-title { font-size: clamp(1.1rem, 2.5vw, 1.35rem); color: var(--text-s); font-weight: 400; margin-bottom: 20px; }
    .hero-summary { font-size: .95rem; color: var(--text-t); line-height: 1.7; max-width: 540px; margin: 0 auto 32px; }
    .hero-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
    .hero-btn {
      display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px;
      background: var(--bg-t); color: var(--text-s); text-decoration: none;
      border-radius: 10px; font-size: .82rem; font-weight: 500;
      border: 1px solid var(--border); transition: all var(--t);
    }
    .hero-btn:hover { color: var(--text); border-color: var(--text-t); transform: translateY(-1px); box-shadow: var(--shadow); }

    /* ── Sections ── */
    .section { padding: 80px 0; }
    .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
    .section-num { font-size: .75rem; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; letter-spacing: .05em; }
    .section-title { font-size: 1.7rem; font-weight: 700; letter-spacing: -.02em; color: var(--text); }

    /* ── Skills ── */
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .skill-group {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--r);
      padding: 22px; transition: all var(--t);
    }
    .skill-group:hover { border-color: var(--text-t); box-shadow: var(--shadow); }
    .skill-category { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); margin-bottom: 12px; }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag {
      padding: 4px 11px; background: var(--bg-t); color: var(--text-s);
      border-radius: 6px; font-size: .8rem; font-weight: 500;
      transition: all var(--t); border: 1px solid transparent;
    }
    .skill-tag:hover { color: var(--text); border-color: var(--border); transform: translateY(-1px); }

    /* ── Timeline ── */
    .timeline { position: relative; padding-left: 36px; }
    .timeline::before { content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, var(--accent), var(--border)); border-radius: 2px; }
    .timeline-item { position: relative; margin-bottom: 32px; }
    .timeline-item:last-child { margin-bottom: 0; }
    .timeline-marker {
      position: absolute; left: -36px; top: 8px; width: 16px; height: 16px;
      border-radius: 50%; background: var(--bg); border: 3px solid var(--accent); z-index: 1;
      box-shadow: 0 0 0 4px var(--accent-sub);
    }
    .timeline-content {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--r);
      padding: 24px; transition: all var(--t);
    }
    .timeline-content:hover { border-color: var(--text-t); box-shadow: var(--shadow); }
    .timeline-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .timeline-role { font-size: 1.05rem; font-weight: 600; color: var(--text); }
    .timeline-company { font-size: .9rem; color: var(--accent); font-weight: 500; margin-top: 2px; }
    .timeline-meta { text-align: right; display: flex; flex-direction: column; gap: 2px; }
    .timeline-duration { font-size: .82rem; color: var(--text-s); font-weight: 500; }
    .timeline-location { font-size: .78rem; color: var(--text-t); }
    .timeline-bullets { list-style: none; padding: 0; }
    .timeline-bullets li { position: relative; padding-left: 16px; margin-bottom: 5px; font-size: .9rem; color: var(--text-s); line-height: 1.6; }
    .timeline-bullets li::before { content: ''; position: absolute; left: 0; top: 10px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }

    /* ── Education ── */
    .education-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .education-card {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--r);
      padding: 26px; transition: all var(--t);
    }
    .education-card:hover { border-color: var(--text-t); box-shadow: var(--shadow); transform: translateY(-2px); }
    .education-icon {
      width: 42px; height: 42px; border-radius: 10px;
      background: var(--accent-sub); color: var(--accent);
      display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
    }
    .education-institution { font-size: 1.05rem; font-weight: 600; margin-bottom: 4px; }
    .education-degree { font-size: .9rem; color: var(--text-s); margin-bottom: 10px; }
    .education-meta { display: flex; gap: 16px; font-size: .82rem; color: var(--text-t); }
    .education-gpa { color: var(--accent); font-weight: 600; }

    /* ── Projects ── */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .project-card {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--r);
      overflow: hidden; transition: all .25s ease; display: flex; flex-direction: column;
    }
    .project-card:hover { border-color: var(--text-t); box-shadow: var(--shadow-l); transform: translateY(-4px); }
    .project-accent { height: 4px; width: 100%; flex-shrink: 0; }
    .project-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
    .project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .project-name { font-size: 1.05rem; font-weight: 600; }
    .project-link { color: var(--text-t); transition: color var(--t); flex-shrink: 0; padding: 4px; border-radius: 6px; }
    .project-link:hover { color: var(--accent); background: var(--accent-sub); }
    .project-description { font-size: .88rem; color: var(--text-s); line-height: 1.65; margin-bottom: 16px; flex-grow: 1; }
    .project-tech { display: flex; flex-wrap: wrap; gap: 5px; }
    .tech-tag { padding: 3px 9px; background: var(--accent-sub); color: var(--accent); border-radius: 5px; font-size: .72rem; font-weight: 600; letter-spacing: .01em; }

    /* ── More ── */
    .more-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .more-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 22px; }
    .more-card-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); margin-bottom: 12px; }
    .more-list { list-style: none; padding: 0; }
    .more-list li { padding: 8px 0; font-size: .88rem; color: var(--text-s); border-bottom: 1px solid var(--border); }
    .more-list li:last-child { border-bottom: none; }

    /* ── Contact ── */
    .contact-section { padding-bottom: 100px; }
    .contact-content { text-align: center; }
    .contact-text { font-size: 1.05rem; color: var(--text-s); margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; }
    .contact-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .contact-btn-lg {
      display: inline-flex; align-items: center; gap: 10px; padding: 12px 22px;
      background: var(--bg-t); color: var(--text-s); text-decoration: none;
      border-radius: 12px; font-size: .85rem; font-weight: 500;
      border: 1px solid var(--border); transition: all var(--t);
    }
    .contact-btn-lg:hover { color: var(--text); background: var(--accent-sub); border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow); }

    /* ── Footer ── */
    .footer { text-align: center; padding: 24px; border-top: 1px solid var(--border); color: var(--text-t); font-size: .8rem; }

    /* ── Back to top ── */
    .btt {
      position: fixed; bottom: 28px; right: 28px; z-index: 50;
      width: 40px; height: 40px; border-radius: 12px;
      background: var(--card); border: 1px solid var(--border);
      color: var(--text-s); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(10px); transition: all .3s ease; pointer-events: none;
    }
    .btt.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .btt:hover { color: var(--text); border-color: var(--text-t); box-shadow: var(--shadow); }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .mob-btn { display: block; }
      .hero { padding: 100px 20px 60px; min-height: auto; }
      .hero-name { font-size: 2.4rem; }
      .hero-glow { width: 400px; height: 400px; }
      .section { padding: 60px 0; }
      .section-title { font-size: 1.4rem; }
      .section-header { margin-bottom: 32px; }
      .timeline-header { flex-direction: column; }
      .timeline-meta { text-align: left; flex-direction: row; gap: 12px; }
      .hero-btn span { display: none; }
      .hero-btn { padding: 9px 12px; }
      .projects-grid, .education-grid { grid-template-columns: 1fr; }
      .btt { bottom: 16px; right: 16px; }
    }

    /* ── Print ── */
    @media print {
      .navbar, .theme-btn, .mob-btn, .btt, .nav-overlay, .hero-glow { display: none !important; }
      .hero { min-height: auto; padding: 40px 0; }
      .anim { opacity: 1 !important; transform: none !important; }
      .section { padding: 30px 0; break-inside: avoid; }
      body { background: #fff; color: #000; font-size: 11pt; }
      .timeline-content, .project-card, .skill-group, .education-card, .more-card { box-shadow: none; border: 1px solid #ddd; }
      a { color: inherit; }
    }

    /* ── Accessibility: focus visible ── */
    :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }

    /* ── Reduced motion ── */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
      html { scroll-behavior: auto; }
      .anim { opacity: 1; transform: none; transition: none; }
    }
  </style>
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="#hero" class="nav-brand">${e(data.name || "Portfolio")}</a>
      <div class="nav-links" id="navLinks">${navLinksHtml}</div>
      <div class="nav-right">
        <button class="theme-btn" id="themeToggle" aria-label="Toggle dark/light theme">
          <svg class="sun-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="moon-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="mob-btn" id="mobBtn" aria-label="Open navigation menu" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </nav>

  <div class="nav-overlay" id="navOverlay" role="dialog" aria-label="Navigation menu">
    ${navLinksHtml}
  </div>

  <main>
    ${heroHtml}
    ${experienceHtml}
    ${educationHtml}
    ${skillsHtml}
    ${projectsHtml}
    ${moreHtml}
    ${contactHtml}
  </main>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${e(data.name || "Portfolio")}</p>
  </footer>

  <button class="btt" id="btt" aria-label="Back to top">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <script>
    // Intercept hash links — scroll within document instead of navigating (prevents iframe nesting)
    document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;e.preventDefault();var id=a.getAttribute('href').slice(1);var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})});

    // Theme
    const tgl=document.getElementById('themeToggle'),htm=document.documentElement;
    const st=localStorage.getItem('theme');
    if(st)htm.dataset.theme=st;
    else if(matchMedia('(prefers-color-scheme:light)').matches)htm.dataset.theme='light';
    tgl.onclick=()=>{const n=htm.dataset.theme==='dark'?'light':'dark';htm.dataset.theme=n;localStorage.setItem('theme',n)};

    // Mobile nav overlay
    const mb=document.getElementById('mobBtn'),ov=document.getElementById('navOverlay');
    mb.onclick=()=>{const o=!ov.classList.contains('open');ov.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
    ov.querySelectorAll('.nav-link').forEach(l=>l.onclick=()=>{ov.classList.remove('open');mb.setAttribute('aria-expanded','false')});

    // Active section
    const secs=document.querySelectorAll('section[id]'),nls=document.querySelectorAll('.nav-link[data-section]');
    new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){nls.forEach(n=>n.classList.remove('active'));document.querySelectorAll('.nav-link[data-section="'+en.target.id+'"]').forEach(a=>a.classList.add('active'))}})},{rootMargin:'-20% 0px -70% 0px'}).observe&&secs.forEach(s=>new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){nls.forEach(n=>n.classList.remove('active'));document.querySelectorAll('.nav-link[data-section="'+en.target.id+'"]').forEach(a=>a.classList.add('active'))}})},{rootMargin:'-20% 0px -70% 0px'}).observe(s));

    // Scroll animations
    const aO=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting)en.target.classList.add('visible')})},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.anim').forEach(el=>aO.observe(el));

    // Back to top
    const btt=document.getElementById('btt');
    window.addEventListener('scroll',()=>{btt.classList.toggle('show',scrollY>500)},{passive:true});
    btt.onclick=()=>scrollTo({top:0,behavior:'smooth'});

    // Keyboard: Escape closes mobile menu
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('open')){ov.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus()}});
  </script>
</body>
</html>`;
}
