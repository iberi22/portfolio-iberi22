<script lang="ts">
  import { t } from '../i18n/index';

  let selectedCategory = $state<'all' | 'production' | 'opensource'>('all');
  let expandedProject = $state<string | null>('xavier2');

  interface Project {
    id: string;
    name: string;
    tagline: string;
    version: string;
    category: 'production' | 'opensource';
    status: 'live' | 'beta' | 'active' | 'production';
    companyOrContext: string;
    period: string;
    description: string;
    architecture: string;
    metrics: string[];
    tech: string[];
    github?: string;
    demoUrl?: string;
    color: string;
    timeline: { date: string; label: string }[];
  }

  const projects: Project[] = [
    // --- OPEN SOURCE & DEEP TECH ---
    {
      id: 'xavier2',
      name: 'Xavier',
      tagline: 'AI Cognitive Memory Core',
      version: 'v0.6.0-beta',
      category: 'opensource',
      status: 'active',
      companyOrContext: 'SouthWest AI Labs',
      period: '2025 - Presente',
      description: 'Núcleo de memoria cognitiva persistente local para agentes de IA implementado en Rust. Microservicio encapsulado en Docker que proporciona almacenamiento vectorial, índice de búsqueda semántica HNSW y grafos de conocimiento unificados.',
      architecture: 'Motor nativo en Rust con SQLite-vec y pgvector. Búsqueda vectorial por similitud coseno con embeddings locales sin dependencia de la nube externa. API REST y RPC de alta velocidad.',
      metrics: ['Latencia de búsqueda <10ms en índices locales', 'Zero cloud lock-in: 100% on-device', 'Integración unificada con Hermes y Gestalt'],
      tech: ['Rust', 'Docker', 'SQLite-vec', 'pgvector', 'HNSW', 'SurrealDB', 'REST API'],
      github: 'https://github.com/iberi22/xavier',
      color: 'var(--color-accent)',
      timeline: [
        { date: '2025 Q4', label: 'Diseño arquitectural y capa de persistencia vectorial en Rust' },
        { date: '2026 Q1', label: 'Release v0.1 - Operaciones CRUD, embeddings locales y endpoints REST' },
        { date: '2026 Q2', label: 'v0.6.0-beta - Índices HNSW, Dockerización y memoria episódica' },
        { date: '2026 Q3', label: 'Roadmap: Integración de grafos semánticos y context routing' },
      ],
    },
    {
      id: 'gitcore',
      name: 'GitCore',
      tagline: 'Autonomous Multi-Agent Git/GitHub Orchestrator',
      version: 'v3.8.0',
      category: 'opensource',
      status: 'active',
      companyOrContext: 'SouthWest AI Labs',
      period: '2026 - Presente',
      description: 'Harness operacional y orquestador determinista para agentes de codificación autónomos (Jules, Claude Code, OpenCode). Automatiza la creación de issues con especificaciones formales, lotes de micro-fragmentación de hasta 15 tareas paralelas y validación de PRs sin colisiones.',
      architecture: 'Arquitectura desacoplada en Rust y scripts de automatización CLI. Sistema de islas de archivos disjuntos (disjoint file islands) para prevenir conflictos de merge durante ejecuciones paralelas masivas.',
      metrics: ['Hasta 15 tareas autónomas en paralelo', '100% trazabilidad con issues canónicos', '0 conflictos en merge secuencial'],
      tech: ['Rust', 'Agent Orchestration', 'Git/GitHub API', 'Jules Waves', 'Automated QA', 'Shell'],
      github: 'https://github.com/iberi22/GitCore',
      color: 'var(--color-secondary)',
      timeline: [
        { date: '2026 Q1', label: 'Protocolo inicial de issues y trazabilidad para agentes' },
        { date: '2026 Q2', label: 'Wave Operations: micro-fragmentación y lotes de 15 micro-tareas' },
        { date: '2026 Q3', label: 'Integración con Hermes Gateway y auditoría pre-delegación' },
        { date: '2026 Q4', label: 'Roadmap: Enjambre distribuido P2P multi-repositorio' },
      ],
    },
    {
      id: 'gestalt',
      name: 'Gestalt',
      tagline: 'Multi-Agent Swarm Orchestrator CLI',
      version: 'v0.4.0',
      category: 'opensource',
      status: 'active',
      companyOrContext: 'SouthWest AI Labs',
      period: '2025 - Presente',
      description: 'Orquestador de enjambres autónomos y enrutamiento inteligente de agentes multi-rol por línea de comandos (CLI) en Rust. Utiliza SurrealDB para persistencia de estados, enrutamiento basado en roles y protocolos personalizados de comunicación inter-agente.',
      architecture: 'CLI nativa en Rust con integración asíncrona Tokio. Persistencia de grafos y estados en SurrealDB. Sandboxes deterministas para pruebas de código generado por LLMs.',
      metrics: ['Ejecución de agentes en sandboxes aislados', 'Persistencia reactiva de estados en SurrealDB', 'Enrutamiento dinámico por especialidad'],
      tech: ['Rust', 'SurrealDB', 'Tokio Async', 'CLI Tools', 'Multi-Agent Protocols'],
      github: 'https://github.com/iberi22/gestalt',
      color: 'var(--color-accent-light)',
      timeline: [
        { date: '2025 Q4', label: 'Prototipo y esquema de estado en SurrealDB' },
        { date: '2026 Q1', label: 'Capa de coordinación multi-agente y ejecución dinámica desde CLI' },
        { date: '2026 Q2', label: 'Integración de ciclo continuo con memoria Xavier' },
        { date: '2026 Q3', label: 'Roadmap: Inteligencia de enjambre descentralizada' },
      ],
    },
    {
      id: 'photon-core',
      name: 'Photon-Core',
      tagline: '5D Optical Storage Simulation',
      version: 'v1.0.0-poc',
      category: 'opensource',
      status: 'active',
      companyOrContext: 'Deep Tech Lab',
      period: '2025 - 2026',
      description: 'Framework de simulación de física óptica de alto rendimiento en Rust para almacenamiento volumétrico de datos 5D en cristales de sílice fundida. Modela birrefringencia por láser de femtosegundo, crosstalk espacial 3D, corrección de errores Reed-Solomon y esteganografía multidimensional.',
      architecture: 'Modelado matemático de voxels fotónicos con paralelismo Rayon en Rust. Codificación Reed-Solomon entrelazada y simulación de degradación térmica/mecánica.',
      metrics: ['Rendimiento de codificación >470 MB/s', 'Corrección de errores Reed-Solomon con tolerancia >30% crosstalk', 'Publicación académica de soporte'],
      tech: ['Rust', 'Physics Sim', 'Reed-Solomon ECC', 'Steganography', 'Rayon Parallelism'],
      github: 'https://github.com/iberi22/photon-core',
      color: 'var(--color-accent)',
      timeline: [
        { date: '2025 Q4', label: 'Modelo matemático inicial y definición de voxel fotónico' },
        { date: '2026 Q1', label: 'Integración ECC Reed-Solomon y simulación crosstalk 3D' },
        { date: '2026 Q2', label: 'Ocultación de datos esteganográficos y kit CLI' },
        { date: '2026 Q3', label: 'Roadmap: Reconstrucción de señal asistida por deep learning' },
      ],
    },
    {
      id: 'edge-mesh',
      name: 'edge-mesh',
      tagline: 'P2P Mesh Network with CRDT & Post-Quantum Crypto',
      version: 'v0.5.0',
      category: 'opensource',
      status: 'beta',
      companyOrContext: 'SouthWest AI Labs',
      period: '2025 - Presente',
      description: 'Librería de red de comunicación entre pares (P2P) con sincronización de estado libre de conflictos (CRDTs) e identidad basada en criptografía post-cuántica ML-DSA-65.',
      architecture: 'Topología peer-to-peer descentralizada sin servidor central. Tipos de datos replicados libres de conflictos (Yjs/Automerge) para sincronización determinista en condiciones de red hostil.',
      metrics: ['Cero dependencia de servidores centrales', 'Criptografía resistente a computación cuántica ML-DSA-65', 'Latencia P2P <15ms'],
      tech: ['Rust', 'TypeScript', 'CRDT', 'P2P Mesh', 'ML-DSA-65 Crypto', 'WebRTC'],
      github: 'https://github.com/iberi22/edge-mesh',
      color: 'var(--color-secondary)',
      timeline: [
        { date: '2025 Q3', label: 'Diseño de protocolo de descubrimiento P2P' },
        { date: '2025 Q4', label: 'Implementación de esquemas CRDT y resolución de bifurcaciones' },
        { date: '2026 Q1', label: 'Adopción de estándar criptográfico post-cuántico ML-DSA-65' },
        { date: '2026 Q3', label: 'Roadmap: SDK móvil para Android y iOS' },
      ],
    },
    {
      id: 'orion',
      name: 'OrionHealth',
      tagline: 'Offline-First Health Ecosystem',
      version: 'v0.5.0',
      category: 'opensource',
      status: 'active',
      companyOrContext: 'HealthTech',
      period: '2025 - 2026',
      description: 'Aplicación de seguimiento de salud personal y métricas clínicas 100% offline-first. Almacenamiento local SQLite encriptado, motor de sincronización en segundo plano y panel analítico interactivo.',
      architecture: 'Flutter & Dart con base de datos SQLite encriptada on-device (SQLCipher). Sincronización resiliente con reconciliación de datos offline y estándares de privacidad SSI.',
      metrics: ['100% de datos encriptados on-device', 'Funcionamiento continuo sin conexión', 'Dashboard clínico interactivo'],
      tech: ['Flutter', 'Dart', 'SQLite / SQLCipher', 'Offline-First', 'Health Metrics'],
      github: 'https://github.com/iberi22/OrionHealth',
      color: 'var(--color-accent-light)',
      timeline: [
        { date: '2025 Q4', label: 'Modelado clínico y arquitectura Flutter offline-first' },
        { date: '2026 Q1', label: 'Persistencia encriptada con SQLite y esquemas seguros' },
        { date: '2026 Q2', label: 'Motor de sincronización en background y analíticas' },
        { date: '2026 Q3', label: 'Roadmap: Sincronización descentralizada P2P' },
      ],
    },
    {
      id: 'gara-g',
      name: 'GARA-G',
      tagline: 'DePIN Mobility & V2V Mesh Network',
      version: 'v0.3.0',
      category: 'opensource',
      status: 'active',
      companyOrContext: 'Mobility Tech',
      period: '2026',
      description: 'Red DePIN de movilidad y malla vehicular (V2V) con telemetría en tiempo real, copiloto de IA y mercado descentralizado para el sector automotriz.',
      architecture: 'Backbone en Rust para procesamiento de telemetría automotriz y frontend móvil en Flutter. Protocolo de malla vehicular para alertas de tráfico sin cobertura celular.',
      metrics: ['Telemetría vehicular de baja latencia', 'Copiloto de diagnóstico automotriz on-device', 'Integración con red Polygon'],
      tech: ['Rust', 'Flutter', 'P2P V2V', 'Polygon', 'Automotive Telemetry'],
      github: 'https://github.com/iberi22/gara-g',
      color: 'var(--color-accent)',
      timeline: [
        { date: '2026 Q1', label: 'Arquitectura del protocolo de telemetría vehicular' },
        { date: '2026 Q2', label: 'Integración de copiloto de IA para diagnósticos OBD-II' },
        { date: '2026 Q3', label: 'Roadmap: Red de malla entre vehículos en ruta' },
      ],
    },

    // --- HISTORIA LABORAL EN PRODUCCIÓN (10+ AÑOS) ---
    {
      id: 'tripro-mining',
      name: 'Tripro SPA (Chile)',
      tagline: 'Industrial IoT, Mining Telemetry & Real-Time Dashboards',
      version: 'Producción',
      category: 'production',
      status: 'production',
      companyOrContext: 'Servicios Eléctricos Industriales y Minería',
      period: '2025 - 2026',
      description: 'Desarrollo de software y plataformas de monitoreo que conectan sensores de maquinaria pesada minera con dashboards web en tiempo real. Construcción de canales de ingesta de datos desde planta a la nube para análisis predictivo y desarrollo de apps web con pasarelas de pago.',
      architecture: 'Stack moderno con Astro, Next.js, React, PostgreSQL y Tailwind CSS. Pipelines de datos con Python, n8n y Node.js con bots de alerta en Telegram y creación automatizada de issues de soporte.',
      metrics: ['Monitoreo continuo de sensores en plantas mineras', 'Conversión de telemetría cruda en analítica predictiva', 'Web App CGP San Patricio con pasarela Flow desplegada'],
      tech: ['PostgreSQL', 'Next.js', 'React', 'Astro', 'Python', 'n8n', 'Node.js', 'Flow Payments', 'Tailwind CSS'],
      demoUrl: 'https://www.tripro.cl',
      color: 'var(--color-accent)',
      timeline: [
        { date: 'Jun 2025 - Oct 2025', label: 'Sitio Astro + Flow, Web App CGP San Patricio y Bot de soporte multi-sitio n8n/Python' },
        { date: 'Ene 2026 - May 2026', label: 'Plataforma de telemetría IoT de sensores mineros e IA ligera para optimización energética' },
      ],
    },
    {
      id: 'smartax-mobile',
      name: 'Restrepo y Londoño / Smartax',
      tagline: 'API Data Consumption, Google Play Validation & WordPress Architecture',
      version: 'Producción',
      category: 'production',
      status: 'production',
      companyOrContext: 'Firma de Asesoría Fiscal y Jurídica',
      period: '2021 - 2025',
      description: 'Integración de API para consumo de datos con el CMS WordPress y preparación técnica de la aplicación para cumplir con los estándares y directivas de validación actuales de Google Play Store para su publicación exitosa. Desarrollo y arquitectura de plugins propietarios en PHP para utilidades corporativas.',
      architecture: 'Integración de capa de consumo REST API conectada al CMS WordPress. Actualización técnica a directivas de seguridad de Android/Google Play, gestión de permisos, renderizado de reportes PDF y desarrollo de plugins en PHP para cálculo y soporte fiscal.',
      metrics: ['Validación y aprobación exitosa en Google Play Store', 'Integración fluida de API REST para sincronización de contenido', 'Plugins en PHP para lógica fiscal y reportes'],
      tech: ['REST APIs', 'Google Play Console', 'Android SDK Compliance', 'PHP', 'WordPress Plugins', 'PDF Engine', 'JavaScript'],
      demoUrl: 'http://smartax.com.co',
      color: 'var(--color-secondary)',
      timeline: [
        { date: 'Oct 2021 - Sep 2022', label: 'Desarrollo web B2B, plugins propietarios en PHP y administración web corporativa' },
        { date: 'Ene 2025 - May 2025', label: 'Integración de APIs de datos, adecuación a políticas de Google Play y proceso de publicación' },
      ],
    },
    {
      id: 'siesa-ecommerce',
      name: 'Siesa Ecommerce (E-Solutions)',
      tagline: 'Enterprise B2B/B2C E-Commerce & Cloud Infrastructure',
      version: 'Producción',
      category: 'production',
      status: 'production',
      companyOrContext: 'E-Solutions / Siesa',
      period: '2019 - 2020',
      description: 'Desarrollo de funcionalidades escalables para plataformas de comercio electrónico B2B y B2C. Creación desde cero de un módulo de calendario logístico para programación de despachos y administración de infraestructura de servidores Linux (CentOS 7).',
      architecture: 'Backend en PHP con framework Yii2 y frontend reactivo en Angular. Administración de servidores LAMP vía terminal Linux, automatización de flujos CI/CD con Git, gestión de certificados SSL, VPN y reglas de firewall.',
      metrics: ['Módulo de calendario logístico en producción', 'Aprovisionamiento de servidores Linux CentOS 7 LAMP', 'Manuales operativos y estandarización técnica'],
      tech: ['PHP (Yii2)', 'Angular', 'Linux (CentOS 7)', 'LAMP Stack', 'CI/CD Git', 'SSL & VPN', 'MySQL'],
      color: 'var(--color-accent-light)',
      timeline: [
        { date: 'Oct 2019 - Ene 2020', label: 'Desarrollo del módulo de calendario logístico y funcionalidades e-commerce' },
        { date: 'Feb 2020 - Abr 2020', label: 'Aprovisionamiento de servidores cloud, automatización CI/CD y hardening de seguridad' },
      ],
    },
    {
      id: 'logicalsoft-siip',
      name: 'LogicalSoft',
      tagline: 'SIIP Mobile Android App, Retail Analytics & Electron Desktop',
      version: 'Producción',
      category: 'production',
      status: 'production',
      companyOrContext: 'ERP, Signage & Retail Analytics',
      period: '2015 - 2019',
      description: 'Desarrollo integral de la aplicación móvil híbrida SIIP Móvil publicada en la Play Store con más de 15 vistas operativas (inventarios, logística y accesos QR). Creación de aplicaciones web RIA en PHP/MySQL para evaluación de centros comerciales y app de escritorio Electron con soporte offline.',
      architecture: 'Backend en PHP y MySQL con frontend JavaScript y almacenamiento local IndexedDB para censos comerciales. Aplicación de escritorio multiplataforma con Electron, Node.js y ReactJS. Gestión cloud en AWS y Google Cloud.',
      metrics: ['App SIIP Móvil publicada en Play Store', 'Módulos de acceso rápido vía Códigos QR', 'Funcionamiento offline con IndexedDB'],
      tech: ['PHP', 'JavaScript', 'MySQL', 'ReactJS', 'Electron', 'Android Play Store', 'IndexedDB', 'AWS & GCP'],
      color: 'var(--color-accent)',
      timeline: [
        { date: '2015 - 2017', label: 'Apps web RIA en PHP/MySQL, censo móvil con IndexedDB y desktop Electron' },
        { date: '2018', label: 'Sprint de modernización y optimización de rendimiento de plataforma legacy' },
        { date: '2019', label: 'Desarrollo de SIIP Móvil (PHP/JS/WebView) publicado en Play Store' },
      ],
    },
    {
      id: 'los-tres-editores',
      name: 'Los Tres Editores SAS',
      tagline: 'PostgreSQL Procedures, Java EE Architecture & Debian Servers',
      version: 'Producción',
      category: 'production',
      status: 'production',
      companyOrContext: 'Editorial e Impresión de Gran Escala',
      period: '2013 - 2015',
      description: 'Programación avanzada de bases de datos del lado del servidor mediante procedimientos almacenados, funciones y disparadores (triggers) en PostgreSQL. Desarrollo de componentes Java EE con iReport, módulos de reportes dinámicos en PHP (FPDF) y mantenimiento de servidores Linux Debian.',
      architecture: 'Base de datos relacional PostgreSQL con lógica de negocio encapsulada en stored procedures. Capa de servicios Java EE para generación masiva de reportes corporativos y personalización de plataforma educativa Moodle.',
      metrics: ['Optimización de consultas y triggers en PostgreSQL', 'Generación automatizada de reportes PDF masivos', 'Administración y estabilidad de servidores Debian'],
      tech: ['PostgreSQL (Triggers/Functions)', 'Java EE', 'PHP (FPDF)', 'Moodle', 'Linux Debian', 'iReport'],
      color: 'var(--color-secondary)',
      timeline: [
        { date: '2013 - 2014', label: 'Documentación técnica de sistemas heredados y desarrollo de funciones en PostgreSQL' },
        { date: '2014 - 2015', label: 'Implementación Java EE, reportes con FPDF/iReport y administración de servidores Debian' },
      ],
    },
  ];

  let filteredProjects = $derived(
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)
  );

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
    <!-- SWAL Mission Banner -->
    <div class="text-center mb-20 max-w-3xl mx-auto">
      <a
        href="https://github.com/southwest-ai-labs"
        target="_blank"
        rel="noopener noreferrer"
        class="glass-card p-8 md:p-10 space-y-5 text-center block transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 group cursor-pointer"
      >
        <p class="text-text-secondary text-sm leading-relaxed">
          {t('locale.announcement')}
        </p>
        <div class="w-12 h-px bg-accent/30 mx-auto"></div>
        <p class="text-text-muted text-sm leading-relaxed">
          {t('locale.mission')}
        </p>
        <div class="flex items-center justify-center gap-2 text-accent text-sm font-bold tracking-wider group-hover:underline">
          <span>{t('locale.accelerate')}</span>
          <span class="text-xs">↗</span>
        </div>
      </a>
    </div>

    <!-- Section Heading -->
    <div class="entry-clip">
      <span class="text-accent text-sm tracking-widest mb-4 block">{t('projects.heading')}</span>
      <h2 class="section-title">
        {t('projects.title')} <span class="text-accent">{t('projects.titleAccent')}</span> {t('projects.titleSuffix')}
      </h2>
      <p class="text-text-secondary text-lg mt-4 max-w-2xl">
        {t('projects.subtitle')}
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex flex-wrap gap-3 mt-10 mb-12">
      <button
        onclick={() => (selectedCategory = 'all')}
        class="px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border {selectedCategory === 'all' ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20' : 'bg-bg-surface-dark border-white/10 text-text-muted hover:border-accent/40 hover:text-white'}"
      >
        Todos ({projects.length})
      </button>
      <button
        onclick={() => (selectedCategory = 'production')}
        class="px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border {selectedCategory === 'production' ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20' : 'bg-bg-surface-dark border-white/10 text-text-muted hover:border-accent/40 hover:text-white'}"
      >
        Producción &amp; Industria (10+ Años)
      </button>
      <button
        onclick={() => (selectedCategory = 'opensource')}
        class="px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border {selectedCategory === 'opensource' ? 'bg-accent text-black border-accent shadow-lg shadow-accent/20' : 'bg-bg-surface-dark border-white/10 text-text-muted hover:border-accent/40 hover:text-white'}"
      >
        Open Source &amp; Deep Tech
      </button>
    </div>

    <!-- Projects List -->
    <div class="project-list">
      {#each filteredProjects as project, i (project.id)}
        <!-- Section Delimiter for Open Source -->
        {#if selectedCategory === 'all' && i === 0 && project.category === 'opensource'}
          <div class="pt-2 pb-4 flex items-center gap-3">
            <span class="text-xs font-mono font-bold tracking-widest text-accent uppercase">
              // 01. Núcleos Deep Tech &amp; Ecosistema Open Source
            </span>
            <div class="flex-1 h-px bg-accent/20"></div>
          </div>
        {/if}

        <!-- Section Delimiter for Labor Experience -->
        {#if selectedCategory === 'all' && project.category === 'production' && (i === 0 || filteredProjects[i - 1].category !== 'production')}
          <div class="pt-10 pb-4 flex items-center gap-3">
            <span class="text-xs font-mono font-bold tracking-widest text-secondary uppercase">
              // 02. Experiencias Laborales &amp; Software en Producción (10+ Años)
            </span>
            <div class="flex-1 h-px bg-secondary/30"></div>
          </div>
        {/if}

        <article class="project-row entry-rise" style="animation-delay: {i * 70}ms">
          <div
            onmousemove={handleMouseMove}
            class="w-full text-left glass-card p-6 md:p-8 transition-all duration-500 rounded-xl"
            style:border-color={expandedProject === project.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}
          >
            <!-- Card Header -->
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 class="text-2xl font-bold text-text-primary">{project.name}</h3>
                  <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-bg-surface border border-white/10 text-text-muted">
                    {project.period}
                  </span>
                  {#if project.status === 'production'}
                    <span class="status-chip status-live"><span></span>Producción</span>
                  {:else if project.status === 'active'}
                    <span class="status-chip status-live"><span></span>Activo</span>
                  {:else if project.status === 'beta'}
                    <span class="status-chip status-beta">Beta</span>
                  {:else}
                    <span class="status-chip status-prototype"><span></span>Prototipo</span>
                  {/if}
                  <span class="text-xs font-mono text-accent/80">
                    // {project.companyOrContext}
                  </span>

                  <!-- Direct Web Link Pill -->
                  {#if project.demoUrl}
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono text-accent bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-colors"
                      onclick={(e) => e.stopPropagation()}
                    >
                      <span>{project.demoUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      <span class="text-[10px]">↗</span>
                    </a>
                  {/if}
                </div>
                <p class="text-accent text-sm font-mono mb-3">{project.tagline}</p>
                <p class="text-text-muted leading-relaxed text-sm md:text-base">{project.description}</p>
              </div>

              <div class="flex flex-col items-end gap-3 shrink-0">
                <div class="flex flex-wrap gap-1.5 max-w-[280px] justify-end">
                  {#each project.tech.slice(0, 4) as tech}
                    <span class="tech-badge">{tech}</span>
                  {/each}
                  {#if project.tech.length > 4}
                    <span class="tech-badge opacity-75">+{project.tech.length - 4}</span>
                  {/if}
                </div>
                
                <button
                  onclick={() => toggleProject(project.id)}
                  class="mt-2 inline-flex items-center gap-2 text-xs font-mono font-bold text-accent hover:text-white px-3 py-1.5 rounded-lg border border-accent/30 hover:border-accent bg-accent/5 transition-all duration-200 cursor-pointer"
                >
                  <span>{expandedProject === project.id ? 'Ocultar Detalles' : 'Ver Arquitectura & Métricas'}</span>
                  <svg
                    class="w-4 h-4 transition-transform duration-300"
                    style:transform={`rotate(${expandedProject === project.id ? 180 : 0}deg)`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Expandable Deep Dive Panel -->
            {#if expandedProject === project.id}
              <div class="details-panel mt-8 pt-8 border-t border-white/10 space-y-8">
                <!-- Architecture & Metrics Grid -->
                <div class="grid md:grid-cols-2 gap-8">
                  <!-- Architecture Breakdown -->
                  <div class="space-y-4">
                    <h4 class="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      Arquitectura &amp; Decisiones Técnicas
                    </h4>
                    <p class="text-text-secondary text-sm leading-relaxed bg-bg-surface-dark/60 p-4 rounded-lg border border-white/5 font-mono">
                      {project.architecture}
                    </p>

                    <h4 class="text-xs font-mono text-accent uppercase tracking-wider pt-2 flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      Stack Técnico Completo
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      {#each project.tech as tech}
                        <span class="tech-badge tech-badge-strong">{tech}</span>
                      {/each}
                    </div>
                  </div>

                  <!-- Key Metrics & Insights -->
                  <div class="space-y-4">
                    <h4 class="text-xs font-mono text-secondary uppercase tracking-wider flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Métricas de Rendimiento &amp; Resultados
                    </h4>
                    <div class="space-y-2.5">
                      {#each project.metrics as metric}
                        <div class="flex items-start gap-2.5 text-sm text-text-secondary bg-bg-surface-dark/40 p-3 rounded border border-white/5">
                          <span class="text-secondary font-mono text-xs mt-0.5">✓</span>
                          <span>{metric}</span>
                        </div>
                      {/each}
                    </div>

                    <!-- Links & Actions -->
                    <div class="pt-3 flex flex-wrap gap-3">
                      {#if project.github}
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="repo-link"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                          <span>Ver Repositorio</span>
                        </a>
                      {/if}
                      {#if project.demoUrl}
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="repo-link border-accent/30 text-accent hover:border-accent"
                        >
                          <span class="text-xs">↗</span>
                          <span>Visitar Producción / Web</span>
                        </a>
                      {/if}
                    </div>
                  </div>
                </div>

                <!-- Timeline & Milestones -->
                <div class="pt-6 border-t border-white/5">
                  <h4 class="text-xs font-mono text-text-muted mb-4 uppercase tracking-wider">Cronograma &amp; Hitos Clave</h4>
                  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {#each project.timeline as event}
                      <div class="p-3.5 rounded bg-bg-surface-dark/50 border border-white/5 space-y-1">
                        <span class="text-xs font-mono font-bold" style:color={project.color}>{event.date}</span>
                        <p class="text-xs text-text-secondary leading-relaxed">{event.label}</p>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .project-list {
    display: grid;
    gap: 1.5rem;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 9999px;
    border-width: 1px;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-family: monospace;
  }

  .status-chip span {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    animation: pulse 1500ms ease-in-out infinite;
  }

  .status-live {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    color: var(--color-accent);
  }

  .status-live span {
    background: var(--color-accent);
  }

  .status-beta {
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.3);
    color: var(--color-secondary);
  }

  .status-prototype {
    background: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.3);
    color: #f59e0b;
  }

  .status-prototype span {
    background: #f59e0b;
  }

  .tech-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 9999px;
    border: 1px solid rgba(16, 185, 129, 0.15);
    background: rgba(16, 185, 129, 0.05);
    padding: 0.2rem 0.6rem;
    color: var(--color-accent);
    font-size: 10px;
    font-family: monospace;
    font-weight: 700;
    transition: color 200ms ease, border-color 200ms ease;
  }

  .tech-badge-strong {
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-accent);
  }

  .repo-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.5rem 1rem;
    color: var(--color-text-primary);
    font-size: 0.8rem;
    font-family: monospace;
    transition: color 200ms ease, border-color 200ms ease, transform 200ms ease;
    background: rgba(255, 255, 255, 0.03);
  }

  .repo-link:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-1px);
  }

  .details-panel {
    animation: detailsOpen 300ms cubic-bezier(.16, 1, .3, 1) both;
  }

  @keyframes detailsOpen {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    50% { opacity: 0.45; }
  }
</style>
