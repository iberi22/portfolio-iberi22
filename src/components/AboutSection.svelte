<script lang="ts">
  import { t } from '../i18n/index';

  const techStack = [
    { name: 'Rust' },
    { name: 'TypeScript' },
    { name: 'Python' },
    { name: 'Flutter' },
    { name: 'React' },
    { name: 'Svelte' },
    { name: 'Astro' },
    { name: 'Docker' },
    { name: 'Kubernetes' },
    { name: 'SurrealDB' },
    { name: 'PostgreSQL' },
    { name: 'Redis' },
  ];

  const specialties = [
    {
      title: 'Systems Architecture',
      desc: 'Designing distributed systems with Rust and cloud-native patterns',
      code: '0x01'
    },
    {
      title: 'AI Orchestration',
      desc: 'Building multi-agent systems with Gestalt and SurrealDB',
      code: '0x02'
    },
    {
      title: 'Memory Systems',
      desc: 'Persistent knowledge graphs with Xavier2 vector storage',
      code: '0x03'
    },
    {
      title: 'Full-Stack Development',
      desc: 'End-to-end applications from embedded to PWA',
      code: '0x04'
    },
  ];
</script>

<section id="about" class="relative py-32 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="entry-clip">
      <span class="text-accent text-sm tracking-widest mb-4 block">{t('about.heading')}</span>
      <h2 class="section-title">
        {t('about.title')} <span class="text-accent">{t('about.titleAccent')}</span> {t('about.titleSuffix')}
      </h2>
    </div>

    <div class="grid md:grid-cols-2 gap-16 mt-16">
      <div>
        <p class="entry-rise text-text-secondary text-lg leading-relaxed mb-8" style="animation-delay: 120ms">
          {t('about.bio')}
        </p>
        <p class="entry-rise text-text-muted leading-relaxed" style="animation-delay: 220ms">
          {t('about.philosophy')}
          <span class="text-text-primary"> {t('about.philosophyAccent')}</span>
        </p>
        <div class="entry-scan mt-12 flex gap-4" style="animation-delay: 320ms">
          <div class="flex flex-col">
            <span class="text-accent text-2xl font-bold">5+</span>
            <span class="text-text-muted text-xs uppercase tracking-tighter">{t('about.statProjects')}</span>
          </div>
          <div class="w-px h-10 bg-white/10 mx-4"></div>
          <div class="flex flex-col">
            <span class="text-secondary text-2xl font-bold">Rust</span>
            <span class="text-text-muted text-xs uppercase tracking-tighter">{t('about.statStack')}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="glass-card p-8 entry-rise" style="animation-delay: 180ms">
          <h3 class="text-xs mb-8 text-text-muted uppercase tracking-[0.2em]">{t('about.competencies')}</h3>
          <div class="space-y-6">
            {#each specialties as s}
              <div class="group flex items-start gap-5">
                <span class="text-accent text-xs mt-1 transition-transform group-hover:translate-x-1">{s.code}</span>
                <div>
                  <h4 class="text-text-primary font-bold text-base mb-1">{s.title}</h4>
                  <p class="text-text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-32 entry-scan" style="animation-delay: 420ms">
      <h3 class="text-center text-[10px] text-text-muted tracking-[0.3em] mb-12 uppercase">{t('about.stackIndex')}</h3>
      <div class="flex flex-wrap justify-center gap-4">
        {#each techStack as tech}
          <span
            class="px-4 py-2 rounded border border-white/5 bg-bg-surface-dark/50 text-xs text-text-secondary hover:border-accent hover:text-accent hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            {tech.name}
          </span>
        {/each}
      </div>
    </div>
  </div>
</section>
