<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let mounted = false;

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
      color: '#00ff88',
      timeline: [
        { date: '2025 Q4', label: 'Initial concept & storage layer' },
        { date: '2026 Q1', label: 'Beta release v0.1 - CRUD operations' },
        { date: '2026 Q2', label: 'v0.6.0-beta - Search & Docker' },
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
      color: '#0066ff',
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
      color: '#7c3aed',
      timeline: [
        { date: '2025 Q3', label: 'Monorepo init & design system' },
        { date: '2025 Q4', label: 'PWA shell & offline support' },
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
      github: 'https://github.com/iberi22/orion-health',
      color: '#00e5ff',
      timeline: [
        { date: '2025 Q4', label: 'Flutter init & data models' },
        { date: '2026 Q1', label: 'Offline-first with SQLite' },
        { date: '2026 Q2', label: 'Sync engine & encryption' },
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
      color: '#ff6b35',
      timeline: [
        { date: '2026 Q1', label: 'SaaS architecture design' },
        { date: '2026 Q2', label: 'Work order module MVP' },
        { date: '2026 Q3', label: 'Roadmap: PM scheduling' },
        { date: '2026 Q4', label: 'Roadmap: Multi-tenant' },
      ],
    },
  ];

  let expandedProject: string | null = null;

  function toggleProject(id: string) {
    expandedProject = expandedProject === id ? null : id;
  }

  onMount(() => {
    mounted = true;
  });
</script>

<section id="projects" class="relative py-32 px-6">
  <div class="max-w-6xl mx-auto">
    {#if mounted}
      <div in:fly={{ y: 40, duration: 800, easing: quintOut }}>
        <span class="text-neon-green font-mono text-sm tracking-widest mb-4 block"># projects</span>
        <h2 class="section-title">
          Building <span class="text-gradient">resilient</span> systems
        </h2>
        <p class="text-gray-500 text-lg mt-4 max-w-2xl">
          From AI memory cores to industrial SaaS — each project pushes boundaries.
        </p>
      </div>
    {/if}

    <div class="mt-16 space-y-8">
      {#each projects as project, i (project.id)}
        <div
          class="relative group"
          in:fly={{ y: 30, duration: 600, delay: i * 150, easing: quintOut }}
        >
          <!-- Timeline dot (desktop) -->
          <div
            class="hidden md:block absolute left-0 top-8 w-4 h-4 rounded-full border-2 z-10 -translate-x-[calc(50%+2px)] transition-all duration-500"
            style="border-color: {project.color}; background: {expandedProject === project.id ? project.color : '#0a0a0f'}"
          />

          <button
            on:click={() => toggleProject(project.id)}
            class="w-full text-left glass-card p-6 md:p-8 hover:neon-glow transition-all duration-500 cursor-pointer"
            style="border-color: {expandedProject === project.id ? project.color + '44' : undefined}"
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 class="text-2xl font-bold text-white">{project.name}</h3>
                  {#if project.version}
                    <span class="px-2 py-0.5 rounded text-xs font-mono bg-white/5 border border-white/10 text-gray-400">{project.version}</span>
                  {/if}
                  {#if project.status === 'active'}
                    <span class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono border bg-neon-green/10 text-neon-green border-neon-green/20">
                      <span class="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
                      Live
                    </span>
                  {:else if project.status === 'beta'}
                    <span class="px-2 py-0.5 rounded-full text-xs font-mono border bg-neon-blue/10 text-neon-blue border-neon-blue/20">
                      Beta
                    </span>
                  {:else}
                    <span class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono border bg-yellow-500/10 text-yellow-400 border-yellow-400/20">
                      Dev
                    </span>
                  {/if}
                </div>
                <p class="text-neon-green/70 text-sm font-mono mb-3">{project.tagline}</p>
                <p class="text-gray-400 leading-relaxed">{project.description}</p>
              </div>
              <div class="flex items-center gap-4 shrink-0">
                <div class="hidden md:flex flex-wrap gap-2">
                  {#each project.tech.slice(0, 3) as tech}
                    <span class="tech-badge">{tech}</span>
                  {/each}
                </div>
                <svg
                  class="w-5 h-5 text-gray-500 shrink-0 transition-all duration-300"
                  style="transform: rotate({expandedProject === project.id ? 180 : 0}deg); color: {expandedProject === project.id ? project.color : undefined}"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Expanded timeline -->
            {#if expandedProject === project.id}
              <div
                class="mt-8 pt-8 border-t border-white/5"
                in:fly={{ y: 20, duration: 400 }}
              >
                <div class="grid md:grid-cols-5 gap-4">
                  <div class="md:col-span-2">
                    <h4 class="text-sm font-mono text-gray-500 mb-4">Tech Stack</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each project.tech as tech}
                        <span class="tech-badge" style="border-color: {project.color}44; color: {project.color}">{tech}</span>
                      {/each}
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white transition-all"
                      style="border-color: {project.color}44; hover:border-color: {project.color}"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      View on GitHub
                    </a>
                  </div>
                  <div class="md:col-span-3">
                    <h4 class="text-sm font-mono text-gray-500 mb-4">Timeline & Roadmap</h4>
                    <div class="relative">
                      {#each project.timeline as event, ti}
                        <div class="flex items-start gap-4 pb-6 relative">
                          <div class="flex flex-col items-center">
                            <div class="w-3 h-3 rounded-full border-2 shrink-0" style="border-color: {project.color}" />
                            {#if ti < project.timeline.length - 1}
                              <div class="w-0.5 flex-1 mt-1" style="background: linear-gradient(to bottom, {project.color}44, {ti >= project.timeline.length - 2 ? 'transparent' : project.color + '22'})" />
                            {/if}
                          </div>
                          <div>
                            <span class="text-xs font-mono" style="color: {project.color}">{event.date}</span>
                            <p class="text-sm text-gray-300 mt-0.5">{event.label}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>
</section>
