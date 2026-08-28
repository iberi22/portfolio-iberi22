<script lang="ts">
  import { t } from '../i18n/index';

  const stackCategories = [
    {
      category: 'Lenguajes & Runtimes',
      items: ['PHP (Senior / Core)', 'TypeScript', 'JavaScript (Node.js)', 'Python', 'Rust', 'Shell / Bash', 'Dart', 'SQL']
    },
    {
      category: 'Web, CMS & Frameworks',
      items: ['WordPress (Custom Plugins & Themes)', 'React 19', 'Svelte 5', 'Astro 6', 'Flutter', 'Tailwind CSS 4', 'REST APIs / Webhooks']
    },
    {
      category: 'Bases de Datos & Búsqueda Vectorial',
      items: ['PostgreSQL', 'MySQL / MariaDB', 'SQLite', 'pgvector', 'SQLite-vec', 'SurrealDB', 'Redis', 'HNSW Cosine Search']
    },
    {
      category: 'Arneses de IA, Enrutadores & Orquestación',
      items: ['Hermes Gateway', 'OpenClaw Browser', 'GitCore Engine', 'Gestalt Orchestrator', 'Google Jules', 'OpenRouter', 'Amazon Bedrock', 'Google Vertex AI', 'Smart API Key Management', 'Custom Skills Authoring', 'Claude Code', 'OpenCode']
    },
    {
      category: 'Infraestructura, Servidores & DevSecOps',
      items: ['VPS Linux (Ubuntu / NixOS)', 'cPanel / WHM', 'Nginx & Apache', 'PHP-FPM Tuning', 'Docker', 'Vulnerability Scanning', 'Antivirus & MCP Security Protocols']
    }
  ];

  const specialties = [
    {
      title: 'Ingeniería Full-Stack & PHP Avanzado',
      desc: '10+ años en producción: arquitectura de plugins propietarios para WordPress, temas a medida desde cero, APIs REST, hooks/filtros y arquitecturas Node.js.',
      code: '0x01'
    },
    {
      title: 'Enrutadores de IA, Orquestación & Skills',
      desc: 'Configuración de enrutadores (OpenRouter, Bedrock, Vertex), gestión inteligente de API keys, protocolos agénticos a medida y capacitación en arneses internos (Hermes, OpenClaw, GitCore, Jules).',
      code: '0x02'
    },
    {
      title: 'Sistemas, Rust & Mobile Offline-First',
      desc: 'Servicios de alto rendimiento en Rust, aplicaciones móviles con Flutter, bases de datos locales encriptadas y runtimes WebAssembly.',
      code: '0x03'
    },
    {
      title: 'Bases de Datos Relacionales & Vectoriales',
      desc: 'Diseño de esquemas en PostgreSQL/MySQL y motores de búsqueda semántica local con pgvector, SQLite-vec y memoria episódica HNSW.',
      code: '0x04'
    },
    {
      title: 'Infraestructura VPS, cPanel & Hosting',
      desc: 'Aprovisionamiento de servidores dedicados/VPS en Linux y NixOS, administración integral cPanel/WHM, tuning Nginx/PHP-FPM y SSL/DNS.',
      code: '0x05'
    },
    {
      title: 'Seguridad, Hardening & Protocolos MCP',
      desc: 'Auditorías de código, proxies de seguridad para API keys, escaneo de vulnerabilidades, herramientas de antivirus y servidores de inspección bajo el protocolo MCP.',
      code: '0x06'
    }
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
            <span class="text-accent text-2xl font-bold">10+</span>
            <span class="text-text-muted text-xs uppercase tracking-tighter">Años en Producción</span>
          </div>
          <div class="w-px h-10 bg-white/10 mx-4"></div>
          <div class="flex flex-col">
            <span class="text-secondary text-2xl font-bold">Full-Stack</span>
            <span class="text-text-muted text-xs uppercase tracking-tighter">JS · PHP · Rust · AI</span>
          </div>
        </div>
      </div>

      <div>
        <div class="glass-card p-8 entry-rise" style="animation-delay: 180ms">
          <h3 class="text-xs mb-8 text-text-muted uppercase tracking-[0.2em]">{t('about.competencies')}</h3>
          <div class="space-y-6">
            {#each specialties as s}
              <div class="group flex items-start gap-5">
                <span class="text-accent text-xs mt-1 transition-transform group-hover:translate-x-1 font-mono">{s.code}</span>
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

    <!-- Categorized Stack Index -->
    <div class="mt-32 entry-scan" style="animation-delay: 420ms">
      <h3 class="text-center text-[10px] text-text-muted tracking-[0.3em] mb-12 uppercase">{t('about.stackIndex')}</h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each stackCategories as cat}
          <div class="glass-card p-6 space-y-3">
            <h4 class="text-accent text-xs font-mono uppercase tracking-wider">{cat.category}</h4>
            <div class="flex flex-wrap gap-2">
              {#each cat.items as item}
                <span
                  class="px-2.5 py-1 rounded border border-white/5 bg-bg-surface-dark/60 text-[11px] font-mono text-text-secondary hover:border-accent/40 hover:text-accent transition-all duration-200 cursor-default"
                >
                  {item}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
