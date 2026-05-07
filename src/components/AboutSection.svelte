<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let mounted = false;

  const techStack = [
    { name: 'Rust', icon: '🦀', color: '#ff6b35' },
    { name: 'TypeScript', icon: '📘', color: '#3178c6' },
    { name: 'Python', icon: '🐍', color: '#3776ab' },
    { name: 'Flutter', icon: '🪶', color: '#02569b' },
    { name: 'React', icon: '⚛️', color: '#61dafb' },
    { name: 'Svelte', icon: '🧡', color: '#ff3e00' },
    { name: 'Astro', icon: '🚀', color: '#ff5a01' },
    { name: 'Docker', icon: '🐳', color: '#2496ed' },
    { name: 'Kubernetes', icon: '☸', color: '#326ce5' },
    { name: 'SurrealDB', icon: '🗄️', color: '#ff00a0' },
    { name: 'PostgreSQL', icon: '🐘', color: '#4169e1' },
    { name: 'Redis', icon: '🔴', color: '#dc382d' },
  ];

  const specialties = [
    {
      title: 'Systems Architecture',
      desc: 'Designing distributed systems with Rust & cloud-native patterns',
      icon: '🏗️',
    },
    {
      title: 'AI Orchestration',
      desc: 'Building multi-agent systems with Gestalt & SurrealDB',
      icon: '🧠',
    },
    {
      title: 'Memory Systems',
      desc: 'Persistent knowledge graphs with Xavier2 vector storage',
      icon: '💾',
    },
    {
      title: 'Full-Stack Development',
      desc: 'End-to-end applications from embedded to PWA',
      icon: '⚡',
    },
  ];

  onMount(() => {
    mounted = true;
  });
</script>

<section id="about" class="relative py-32 px-6">
  <div class="max-w-6xl mx-auto">
    {#if mounted}
      <div in:fly={{ y: 40, duration: 800, easing: quintOut }}>
        <span class="text-neon-green font-mono text-sm tracking-widest mb-4 block"># about</span>
        <h2 class="section-title">
          <span class="text-gradient">Crafting</span> the future<br />of AI infrastructure
        </h2>
      </div>

      <div
        in:fly={{ y: 40, duration: 800, delay: 200, easing: quintOut }}
        class="grid md:grid-cols-2 gap-12 mt-12"
      >
        <div>
          <p class="text-gray-400 text-lg leading-relaxed mb-6">
            I'm Samuel Belalcazar — a systems architect and developer focused on 
            building resilient, distributed infrastructure for AI agents. 
            Founder of <span class="text-neon-green">SouthWest AI Labs</span>, 
            where I push the boundaries of what's possible with memory systems 
            and agent coordination.
          </p>
          <p class="text-gray-500 leading-relaxed">
            From orchestrating multi-agent swarms to crafting offline-first 
            health apps, every project is built with the same philosophy: 
            <span class="text-white">clean architecture, zero compromise</span>.
          </p>
        </div>
        <div>
          <div class="glass-card p-8">
            <h3 class="text-lg font-semibold mb-6 text-gray-300">Core Competencies</h3>
            <div class="space-y-4">
              {#each specialties as s, i}
                <div
                  class="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  style="transition-delay: {i * 100}ms"
                >
                  <span class="text-2xl">{s.icon}</span>
                  <div>
                    <h4 class="text-white font-medium">{s.title}</h4>
                    <p class="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Tech Stack -->
    <div class="mt-24">
      <h3 class="text-center text-sm font-mono text-gray-500 tracking-widest mb-10">TECHNOLOGIES I WORK WITH</h3>
      <div class="flex flex-wrap justify-center gap-3">
        {#each techStack as tech, i}
          <span
            class="tech-badge text-base px-4 py-1.5 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style="border-color: {tech.color}33; color: {tech.color}; transition-delay: {i * 50}ms"
          >
            {tech.icon} {tech.name}
          </span>
        {/each}
      </div>
    </div>
  </div>
</section>
