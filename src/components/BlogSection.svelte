<script lang="ts">
  import { t } from '../i18n/index';

  const blogPosts = [
    {
      title: 'Building Xavier2: A Memory Core for AI Agents',
      excerpt: 'How I built a persistent memory system in Rust with vector search and knowledge graphs.',
      tags: ['Rust', 'AI', 'Systems'],
      draft: true,
    },
    {
      title: 'Multi-Agent Orchestration with Gestalt',
      excerpt: 'Designing a CLI orchestrator that coordinates multiple AI agents using SurrealDB.',
      tags: ['Rust', 'Agents', 'Architecture'],
      draft: true,
    },
    {
      title: 'Offline-First Architecture for Mobile',
      excerpt: 'Patterns and trade-offs for building resilient mobile apps with Flutter.',
      tags: ['Flutter', 'Mobile', 'Architecture'],
      draft: true,
    },
  ];

  function handleMouseMove(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  }
</script>

<section id="blog" class="relative py-32 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="entry-clip">
      <span class="text-accent text-sm tracking-widest mb-4 block">{t('blog.heading')}</span>
      <h2 class="section-title">
        {t('blog.title')} <span class="text-accent">{t('blog.titleAccent')}</span>
      </h2>
      <p class="text-text-secondary text-lg mt-4 max-w-2xl">
        {t('blog.subtitle')}
      </p>
    </div>

    <div class="blog-layout mt-16">
      {#each blogPosts as post, i (post.title)}
        <article
          class="glass-card p-8 group transition-all duration-500 entry-rise"
          class:draft-card={post.draft}
          style="animation-delay: {i * 130}ms"
          onmousemove={handleMouseMove}
        >
          <div class="flex items-center justify-between mb-6">
            <span class="text-[10px] text-text-muted tracking-widest">{t('blog.comingSoon')}</span>
            {#if post.draft}
              <span class="px-2 py-0.5 rounded-full text-[9px] bg-accent-dark/10 text-accent-dark border border-accent-dark/20 uppercase">
                {t('blog.draft')}
              </span>
            {/if}
          </div>

          <h3 class="text-xl font-bold mb-4 text-text-primary group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p class="text-sm text-text-muted leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div class="flex flex-wrap gap-2">
            {#each post.tags as tag}
              <span class="text-[10px] px-2 py-1 rounded bg-white/5 text-text-muted border border-white/5">{tag}</span>
            {/each}
          </div>
        </article>
      {/each}
    </div>

    <div class="text-center mt-20 entry-scan" style="animation-delay: 500ms">
      <p class="text-text-muted text-[10px] uppercase tracking-[0.2em]">
        {t('blog.pipelineStatus')}
      </p>
    </div>
  </div>
</section>

<style>
  .blog-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.92fr);
    gap: 1.5rem;
    align-items: stretch;
  }

  .blog-layout article:first-child {
    grid-row: span 2;
  }

  .blog-layout article:hover {
    transform: translateY(-4px);
  }

  .draft-card {
    opacity: 0.72;
  }

  @media (max-width: 767px) {
    .blog-layout {
      grid-template-columns: 1fr;
    }

    .blog-layout article:first-child {
      grid-row: auto;
    }
  }
</style>
