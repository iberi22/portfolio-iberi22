<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let mounted = false;
  let mouseX = 0;
  let mouseY = 0;
  let heroRef: HTMLElement;
  let cursorX = 0;
  let cursorY = 0;

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  onMount(() => {
    mounted = true;
  });

  function handleMouseMove(e: MouseEvent) {
    if (!heroRef) return;
    const rect = heroRef.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  }
</script>

<section
  bind:this={heroRef}
  on:mousemove={handleMouseMove}
  class="relative min-h-screen flex items-center justify-center overflow-hidden grid-background"
>
  <!-- Animated particles -->
  {#if mounted}
    {#each particles as p (p.id)}
      <div
        class="particle"
        style="
          left: {p.x}%;
          top: {p.y}%;
          width: {p.size}px;
          height: {p.size}px;
          animation-delay: {p.delay}s;
          opacity: {p.opacity};
        "
      />
    {/each}
  {/if}

  <!-- Gradient orbs -->
  <div class="absolute top-1/4 -left-32 w-96 h-96 bg-neon-green/10 rounded-full blur-[120px] animate-float" />
  <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-float" style="animation-delay: -3s" />

  <!-- Center content -->
  <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
    {#if mounted}
      <div
        in:fly={{ y: 60, duration: 800, easing: quintOut }}
        class="mb-8"
      >
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/20 bg-neon-green/5 text-neon-green text-sm font-mono mb-8">
          <span class="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          Systems Architect & Developer
        </span>
      </div>
    {/if}

    <h1
      class="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
    >
      {#if mounted}
        <span
          in:fly={{ y: 40, duration: 900, delay: 200, easing: quintOut }}
        >
          <span class="text-gradient">Samuel</span>
        </span>
        <br />
        <span
          in:fly={{ y: 40, duration: 900, delay: 350, easing: quintOut }}
          class="text-white"
        >
          Belalcazar
        </span>
      {:else}
        <span class="text-gradient">Samuel</span><br />
        <span class="text-white">Belalcazar</span>
      {/if}
    </h1>

    {#if mounted}
      <p
        in:fly={{ y: 40, duration: 900, delay: 500, easing: quintOut }}
        class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
      >
        Building resilient systems at scale. <br class="hidden md:block" />
        Rust, AI orchestration, and cloud-native architectures.
      </p>

      <div
        in:fly={{ y: 40, duration: 900, delay: 650, easing: quintOut }}
        class="flex flex-wrap justify-center gap-4"
      >
        <a
          href="#projects"
          class="group relative px-8 py-3 bg-neon-green text-dark font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <span class="relative z-10">View Projects</span>
          <div class="absolute inset-0 bg-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </a>
        <a
          href="#contact"
          class="group px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:border-neon-green transition-all duration-300 hover:scale-105"
        >
          Get in Touch
        </a>
      </div>
    {/if}
  </div>

  <!-- Scroll indicator -->
  <a
    href="#about"
    class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-neon-green transition-colors"
  >
    <span class="text-xs font-mono tracking-widest">SCROLL</span>
    <div class="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5">
      <div class="w-1.5 h-3 bg-current rounded-full animate-bounce" />
    </div>
  </a>
</section>

<style>
  .particle {
    position: absolute;
    border-radius: 50%;
    background: #00ff88;
    animation: float-particle 8s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float-particle {
    0%, 100% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: translateY(-30px) translateX(10px);
      opacity: 0.6;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
  }
</style>
