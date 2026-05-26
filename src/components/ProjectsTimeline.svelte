<script lang="ts">
  import { t } from '../i18n/index';

  let expandedProject = $state<string | null>('xavier2');

  const projects = [
    {
      id: 'xavier2',
      name: 'Xavier2',
      tagline: 'Memory Core',
      version: 'v0.6.0-beta',
      status: 'active',
      description: 'Persistent memory system for AI agents built in Rust. Features vector storage, semantic search, and knowledge graph capabilities. Running as a Docker service on port 8006.',
      tech: ['Rust', 'Docker', 'REST API', 'Vector DB'],
      github: 'https://github.com/iberi22/xavier2',
      color: 'var(--color-accent)',
      timeline: [
        { date: '2025 Q4', label: 'Initial concept and storage layer' },
        { date: '2026 Q1', label: 'Beta release v0.1 - CRUD operations' },
        { date: '2026 Q2', label: 'v0.6.0-beta - Search and Docker' },
        { date: '2026 Q3', label: 'Roadmap: Knowledge graphs' },
      ],
    },
    {
      id: 'gestalt',
      name: 'Gestalt',
      tagline: 'Agent Orchestrator',
      version: 'v0.3.0',
      status: 'development',
      description: 'CLI orchestrator for multi-agent AI systems. Uses SurrealDB for persistent state management, role-based agent routing, and inter-agent communication protocols.',
      tech: ['Rust', 'SurrealDB', 'CLI', 'Multi-Agent'],
      github: 'https://github.com/iberi22/gestalt',
      color: 'var(--color-secondary)',
      timeline: [
        { date: '2026 Q1', label: 'Prototype - single agent routing' },
        { date: '2026 Q2', label: 'Multi-agent coordination layer' },
        { date: '2026 Q3', label: 'Roadmap: Swarm intelligence' },
        { date: '2026 Q4', label: 'Roadmap: Production ready' },
      ],
    },
    {
      id: 'gos',
      name: 'GOS',
      tagline: 'Gastronomic Open Standard',
      version: 'v1.0.0',
      status: 'beta',
      description: 'Monorepo PWA for culinary reviews with offline support. Built with a shared design system, featuring restaurant discovery, menu scanning, and community reviews.',
      tech: ['Flutter', 'PWA', 'TypeScript', 'GraphQL'],
      github: 'https://github.com/iberi22/gos',
      color: 'var(--color-accent)',
      timeline: [
        { date: '2025 Q3', label: 'Monorepo init and design system' },
        { date: '2025 Q4', label: 'PWA shell and offline support' },
        { date: '2026 Q1', label: 'Beta launch with reviews' },
        { date: '2026 Q3', label: 'Roadmap: AI recommendations' },
      ],
    },
    {
      id: 'orion',
      name: 'OrionHealth',
      tagline: 'Health Tracking',
      version: 'v0.5.0',
      status: 'development',
      description: 'Offline-first health tracking application built with Flutter. Features encrypted local storage, sync capabilities, and comprehensive health metrics dashboard.',
      tech: ['Flutter', 'Dart', 'SQLite', 'Encryption'],
      github: 'https://github.com/iberi22/OrionHealth',
      color: 'var(--color-secondary)',
      timeline: [
        { date: '2025 Q4', label: 'Flutter init and data models' },
        { date: '2026 Q1', label: 'Offline-first with SQLite' },
        { date: '2026 Q2', label: 'Sync engine and encryption' },
        { date: '2026 Q3', label: 'Roadmap: Cloud sync GA' },
      ],
    },
    {
      id: 'manteniapp',
      name: 'ManteniApp',
      tagline: 'Industrial Maintenance SaaS',
      version: 'v0.2.0',
      status: 'development',
      description: 'SaaS platform for industrial maintenance management. Designed for engineering and mining companies in Chile, featuring work order tracking, preventive maintenance scheduling, and equipment lifecycle management.',
      tech: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      github: 'https://github.com/swal/manteniapp',
      color: 'var(--color-accent-dark)',
      timeline: [
        { date: '2026 Q1', label: 'SaaS architecture design' },
        { date: '2026 Q2', label: 'Work order module MVP' },
        { date: '2026 Q3', label: 'Roadmap: PM scheduling' },
        { date: '2026 Q4', label: 'Roadmap: Multi-tenant' },
      ],
    },
  ];

  function toggleProject(id: string) {
    expandedProject = expandedProject === id ? null : id;
  }

  function handleMouseMove(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  }
</script>

<section id="projects" class="relative py-32 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-24 max-w-3xl mx-auto">
      <div class="glass-card p-8 md:p-12 space-y-6 text-center">
        <p class="text-text-secondary text-sm leading-relaxed">
          {t('locale.announcement')}
        </p>
        <div class="w-12 h-px bg-accent/30 mx-auto"></div>
        <p class="text-text-muted text-sm leading-relaxed">
          {t('locale.mission')}
        </p>
        <p class="text-accent text-sm font-bold tracking-wider">
          {t('locale.accelerate')}
        </p>
      </div>
    </div>

    <div class="entry-clip">
      <span class="text-accent text-sm tracking-widest mb-4 block">{t('projects.heading')}</span>
      <h2 class="section-title">
        {t('projects.title')} <span class="text-accent">{t('projects.titleAccent')}</span> {t('projects.titleSuffix')}
      </h2>
      <p class="text-text-secondary text-lg mt-4 max-w-2xl">
        {t('projects.subtitle')}
      </p>
    </div>

    <div class="project-list mt-16">
      {#each projects as project, i (project.id)}
        <article class="project-row entry-rise" style="animation-delay: {i * 110}ms">
          <button
            onclick={() => toggleProject(project.id)}
            onmousemove={handleMouseMove}
            class="w-full text-left glass-card p-6 md:p-8 transition-all duration-500 cursor-pointer"
            style:border-color={expandedProject === project.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)'}
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 class="text-2xl font-bold text-text-primary">{project.name}</h3>
                  <span class="px-2 py-0.5 rounded text-xs bg-bg-surface border border-white/10 text-text-muted">{project.version}</span>
                  {#if project.status === 'active'}
                    <span class="status-chip status-live"><span></span>Live</span>
                  {:else if project.status === 'beta'}
                    <span class="status-chip status-beta">Beta</span>
                  {:else}
                    <span class="status-chip status-dev"><span></span>Dev</span>
                  {/if}
                </div>
                <p class="text-accent/70 text-sm mb-3">{project.tagline}</p>
                <p class="text-text-muted leading-relaxed">{project.description}</p>
              </div>
              <div class="flex items-center gap-4 shrink-0">
                <div class="hidden md:flex flex-wrap gap-2">
                  {#each project.tech.slice(0, 3) as tech}
                    <span class="tech-badge">{tech}</span>
                  {/each}
                </div>
                <svg
                  class="w-5 h-5 text-text-muted shrink-0 transition-all duration-300"
                  style:transform={`rotate(${expandedProject === project.id ? 180 : 0}deg)`}
                  style:color={expandedProject === project.id ? 'var(--color-accent)' : 'var(--color-text-muted)'}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {#if expandedProject === project.id}
              <div class="details-panel mt-8 pt-8 border-t border-white/5">
                <div class="grid md:grid-cols-5 gap-8">
                  <div class="md:col-span-2">
                    <h4 class="text-sm text-text-muted mb-4 uppercase tracking-wider">{t('projects.techStack')}</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each project.tech as tech}
                        <span class="tech-badge tech-badge-strong">{tech}</span>
                      {/each}
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="repo-link"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      {t('projects.repository')}
                    </a>
                  </div>
                  <div class="md:col-span-3">
                    <h4 class="text-sm text-text-muted mb-4 uppercase tracking-wider">{t('projects.timeline')}</h4>
                    {#each project.timeline as event, ti}
                      <div class="timeline-item">
                        <div class="timeline-marker">
                          <div class="w-3 h-3 rounded-full border-2 shrink-0" style:border-color={project.color}></div>
                          {#if ti < project.timeline.length - 1}
                            <div class="w-0.5 flex-1 mt-1 bg-white/10"></div>
                          {/if}
                        </div>
                        <div>
                          <span class="text-xs" style:color={project.color}>{event.date}</span>
                          <p class="text-sm text-text-secondary mt-0.5">{event.label}</p>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </button>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .project-list {
    display: grid;
    gap: 2rem;
  }

  .project-row:nth-child(even) {
    margin-left: clamp(0rem, 6vw, 4rem);
  }

  .project-row:nth-child(3n) {
    margin-right: clamp(0rem, 4vw, 3rem);
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 9999px;
    border-width: 1px;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
  }

  .status-chip span {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    animation: pulse 1500ms ease-in-out infinite;
  }

  .status-live {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
    color: var(--color-accent);
  }

  .status-live span {
    background: var(--color-accent);
  }

  .status-beta {
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.2);
    color: var(--color-secondary);
  }

  .status-dev {
    background: rgba(5, 150, 105, 0.1);
    border-color: rgba(5, 150, 105, 0.2);
    color: var(--color-accent-dark);
  }

  .status-dev span {
    background: var(--color-accent-dark);
  }

  .tech-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 9999px;
    border: 1px solid rgba(16, 185, 129, 0.1);
    background: rgba(16, 185, 129, 0.05);
    padding: 0.25rem 0.75rem;
    color: var(--color-accent);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 200ms ease, border-color 200ms ease;
  }

  .tech-badge-strong {
    border-color: rgba(16, 185, 129, 0.2);
    color: var(--color-accent);
  }

  .repo-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.625rem 1.25rem;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    transition: color 200ms ease, border-color 200ms ease, transform 200ms ease;
  }

  .repo-link:hover {
    border-color: var(--color-accent);
    color: var(--color-text-primary);
    transform: translateX(2px);
  }

  .details-panel {
    animation: detailsOpen 360ms cubic-bezier(.16, 1, .3, 1) both;
  }

  .timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding-bottom: 1.5rem;
  }

  .timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
  }

  @keyframes detailsOpen {
    from { opacity: 0; clip-path: inset(0 0 100% 0); }
    to { opacity: 1; clip-path: inset(0 0 0 0); }
  }

  @keyframes pulse {
    50% { opacity: 0.45; }
  }
</style>

