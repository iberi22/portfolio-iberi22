<script lang="ts">
  import { t } from '../i18n/index';

  const topics = [
    'agenda.top1',
    'agenda.top2',
    'agenda.top3',
    'agenda.top4',
    'agenda.top5',
    'agenda.top6',
  ];

  const formats = [
    { k: 'agenda.fmtDur', v: 'agenda.fmtDurV' },
    { k: 'agenda.fmtMod', v: 'agenda.fmtModV' },
    { k: 'agenda.fmtLang', v: 'agenda.fmtLangV' },
    { k: 'agenda.fmtFol', v: 'agenda.fmtFolV' },
  ];

  const tracks = [
    {
      badge: 'EXPRESS · $20 USD',
      title: 'agenda.track1Title',
      desc: 'agenda.track1Desc',
      icon: '📊',
      accent: true,
      price: '$20 USD'
    },
    {
      badge: 'EQUIPOS & DEVS',
      title: 'agenda.track2Title',
      desc: 'agenda.track2Desc',
      icon: '🎓',
      accent: false,
      price: 'Custom'
    },
    {
      badge: 'SETUP & CLI TOOLS',
      title: 'agenda.track3Title',
      desc: 'agenda.track3Desc',
      icon: '🛠️',
      accent: false,
      price: 'Hands-on'
    }
  ];

  const pillars = [
    { icon: '📊', t: 'agenda.p1t', d: 'agenda.p1d' },
    { icon: '🎓', t: 'agenda.p2t', d: 'agenda.p2d' },
    { icon: '⚡', t: 'agenda.p3t', d: 'agenda.p3d' },
  ];

  const tools = [
    'OpenRouter',
    'Amazon Bedrock',
    'Smart API Keys',
    'Hermes Gateway',
    'OpenClaw Browser',
    'GitCore Engine',
    'Gestalt Swarm',
    'Google Jules',
    'Claude Code',
    'Ollama / vLLM Local',
    'Custom Agent Skills',
    'Xavier Memory'
  ];

  const slots = ['agenda.slot1', 'agenda.slot2', 'agenda.slot3'];

  let sent = $state(false);
  let isPaying = $state(false);
  let selectedService = $state('diagnostic');

  // Default Stripe Payment Link
  const stripePaymentLink = 'https://buy.stripe.com/test_diagnostic_20usd';

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const profile = data.get('profile');
    const service = data.get('service');
    const infra = data.get('infra');
    const topic = data.get('topic');
    const message = data.get('message');

    const isDiag = service?.toString().includes('20');
    const subject = encodeURIComponent(`Solicitud Técnica: ${service} — ${name}`);
    const body = encodeURIComponent(
      `SOLICITUD DE ASESORÍA / CAPACITACIÓN / ARNÉS AGÉNTICO\n` +
      `====================================================\n\n` +
      `Cliente: ${name}\n` +
      `Correo: ${email}\n` +
      `Perfil: ${profile}\n` +
      `Servicio Seleccionado: ${service}\n` +
      `Infraestructura/Proveedores Actuales: ${infra}\n` +
      `Área de Enfoque Principal: ${topic}\n\n` +
      `Detalles del Caso / Objetivos de Capacitación o Setup:\n${message}\n\n` +
      `---\n` +
      `Arnés y CLI Tools de Interés: Hermes, OpenClaw, GitCore, Gestalt, Jules, Ollama/vLLM\n` +
      (isDiag ? `Pago Base: $20 USD gestionado vía Stripe` : `Modalidad: Plan coordinado con cliente`)
    );

    window.location.href = `mailto:iberi22@gmail.com?subject=${subject}&body=${body}`;
    sent = true;
  }

  function handleStripeDirect() {
    isPaying = true;
    window.open(stripePaymentLink, '_blank', 'noopener,noreferrer');
  }
</script>

<section class="relative pt-32 pb-20 px-6">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="text-center entry-rise">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-accent/10 text-accent border border-accent/30 shadow-lg shadow-accent/10">
        <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
        {t('agenda.badge')}
      </span>
      <h1 class="section-title mt-6 text-3xl md:text-5xl font-bold tracking-tight">
        {t('agenda.title')}
      </h1>
      <p class="text-text-secondary text-lg mt-4 max-w-3xl mx-auto leading-relaxed">
        {t('agenda.subtitle')}
      </p>

      <!-- Tools Marquee / Badge Strip -->
      <div class="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        {#each tools as tool}
          <span class="px-3 py-1 rounded-full text-[11px] font-mono bg-bg-surface-dark border border-white/10 text-text-muted hover:border-accent/40 hover:text-accent transition-colors">
            {tool}
          </span>
        {/each}
      </div>
    </div>

    <!-- 3 Service Tracks -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
      {#each tracks as track, i}
        <div class="glass-card p-8 entry-rise flex flex-col justify-between border transition-all duration-300 group {track.accent ? 'border-accent/40 bg-accent/5 hover:border-accent' : 'border-white/10 hover:border-accent/40'}" style={`animation-delay: ${100 + i * 90}ms`}>
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono font-bold tracking-widest px-2.5 py-1 rounded {track.accent ? 'bg-accent text-black' : 'bg-white/10 text-text-muted'}">
                {track.badge}
              </span>
              <span class="text-2xl group-hover:scale-110 transition-transform">{track.icon}</span>
            </div>
            <h3 class="text-lg font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">{t(track.title)}</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-6">{t(track.desc)}</p>
          </div>
          <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span class="text-text-muted">Inversión:</span>
            <span class="font-bold text-text-primary {track.accent ? 'text-accent text-sm' : ''}">{track.price}</span>
          </div>
        </div>
      {/each}
    </div>

    <!-- Pillars Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {#each pillars as p, i}
        <div class="glass-card p-8 entry-rise flex flex-col justify-between border border-white/10 hover:border-accent/30 transition-all" style={`animation-delay: ${280 + i * 80}ms`}>
          <div>
            <div class="text-3xl mb-4">{p.icon}</div>
            <h3 class="text-base font-bold text-text-primary mb-2">{t(p.t)}</h3>
            <p class="text-text-secondary text-xs leading-relaxed">{t(p.d)}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Format + Key Scope Areas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      <div class="glass-card p-8 entry-rise" style="animation-delay: 350ms">
        <h3 class="text-accent text-sm tracking-widest uppercase mb-6 font-mono font-bold flex items-center gap-2">
          <span>// 01.</span> {t('agenda.fmtTitle')}
        </h3>
        <ul class="space-y-4">
          {#each formats as f}
            <li class="flex flex-col gap-1 border-l-2 border-accent/30 pl-4 py-1">
              <span class="text-xs uppercase tracking-wider text-text-muted font-mono">{t(f.k)}</span>
              <span class="text-text-primary text-sm font-semibold">{t(f.v)}</span>
            </li>
          {/each}
        </ul>
      </div>

      <div class="glass-card p-8 entry-rise" style="animation-delay: 430ms">
        <h3 class="text-accent text-sm tracking-widest uppercase mb-6 font-mono font-bold flex items-center gap-2">
          <span>// 02.</span> {t('agenda.topTitle')}
        </h3>
        <ul class="space-y-3">
          {#each topics as topic}
            <li class="text-text-secondary text-sm leading-relaxed flex items-start gap-2.5">
              <span class="text-accent mt-0.5">▹</span>
              <span>{t(topic)}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Availability bar -->
    <div class="glass-card p-6 mt-10 entry-rise" style="animation-delay: 500ms">
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3 justify-center text-center">
        <span class="text-xs font-mono uppercase tracking-widest text-text-muted">{t('agenda.slotsLabel')}</span>
        {#each slots as s}
          <span class="flex items-center gap-2 text-sm text-text-secondary font-mono">
            <span class="w-2 h-2 rounded-full bg-accent inline-block"></span>{t(s)}
          </span>
        {/each}
      </div>
    </div>

    <!-- Data-Driven Decision & Scenario Simulation Methodology -->
    <div class="glass-card p-8 md:p-10 mt-12 border-accent/20 bg-bg-surface-dark/80 entry-rise" style="animation-delay: 540ms">
      <div class="flex items-center gap-3 mb-4">
        <span class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-accent/10 text-accent border border-accent/30">
          Metodología Basada en Datos
        </span>
        <span class="text-xs font-mono text-text-muted tracking-wider">SWAL Simulation Framework</span>
      </div>

      <h3 class="text-xl md:text-2xl font-bold text-text-primary mb-3">
        {t('agenda.methodologyTitle')}
      </h3>
      <p class="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
        {t('agenda.methodologySub')}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-xl border border-white/10 bg-black/40 flex flex-col justify-between">
          <div>
            <span class="text-accent text-xs font-mono font-bold block mb-2">01 / RECOLECCIÓN</span>
            <h4 class="text-text-primary text-sm font-bold mb-2">{t('agenda.m1t')}</h4>
            <p class="text-text-muted text-xs leading-relaxed">{t('agenda.m1d')}</p>
          </div>
        </div>

        <div class="p-5 rounded-xl border border-accent/30 bg-accent/5 flex flex-col justify-between">
          <div>
            <span class="text-accent text-xs font-mono font-bold block mb-2">02 / SIMULACIÓN</span>
            <h4 class="text-text-primary text-sm font-bold mb-2">{t('agenda.m2t')}</h4>
            <p class="text-text-muted text-xs leading-relaxed">{t('agenda.m2d')}</p>
          </div>
        </div>

        <div class="p-5 rounded-xl border border-white/10 bg-black/40 flex flex-col justify-between">
          <div>
            <span class="text-accent text-xs font-mono font-bold block mb-2">03 / GENERACIÓN</span>
            <h4 class="text-text-primary text-sm font-bold mb-2">{t('agenda.m3t')}</h4>
            <p class="text-text-muted text-xs leading-relaxed">{t('agenda.m3d')}</p>
          </div>
        </div>

        <div class="p-5 rounded-xl border border-white/10 bg-black/40 flex flex-col justify-between">
          <div>
            <span class="text-accent text-xs font-mono font-bold block mb-2">04 / VALIDACIÓN</span>
            <h4 class="text-text-primary text-sm font-bold mb-2">{t('agenda.m4t')}</h4>
            <p class="text-text-muted text-xs leading-relaxed">{t('agenda.m4d')}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking & Payment Form -->
    <div class="mt-14 max-w-3xl mx-auto entry-rise" style="animation-delay: 570ms">
      <div class="glass-card p-8 md:p-12 border-accent/30 bg-bg-surface-dark/95 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        {#if sent}
          <div class="text-center py-10 space-y-6">
            <div class="text-5xl">🎯</div>
            <h3 class="text-2xl font-bold text-text-primary">{t('agenda.okTitle')}</h3>
            <p class="text-text-secondary text-base max-w-lg mx-auto leading-relaxed">{t('agenda.okText')}</p>
            
            <div class="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onclick={handleStripeDirect}
                class="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-black font-mono font-bold text-sm tracking-wider hover:bg-accent-light transition-all shadow-lg shadow-accent/20 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                {t('agenda.formSubmitStripe')}
              </button>
            </div>
          </div>
        {:else}
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-text-primary">{t('agenda.formTitle')}</h3>
            <p class="text-xs text-text-muted font-mono mt-2">{t('agenda.formPayNote')}</p>
          </div>

          <form onsubmit={handleSubmit} class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="agenda-name" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formName')}</label>
                <input id="agenda-name" type="text" name="name" required placeholder="Brahyans B." class="field w-full" />
              </div>
              <div>
                <label for="agenda-email" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formEmail')}</label>
                <input id="agenda-email" type="email" name="email" required placeholder="tu-correo@empresa.com" class="field w-full" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="agenda-service" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formService')}</label>
                <select id="agenda-service" name="service" required bind:value={selectedService} class="field w-full appearance-none cursor-pointer">
                  <option value="diagnostic" class="bg-[#121212]">{t('agenda.formService1')}</option>
                  <option value="training" class="bg-[#121212]">{t('agenda.formService2')}</option>
                  <option value="harness" class="bg-[#121212]">{t('agenda.formService3')}</option>
                  <option value="architecture" class="bg-[#121212]">{t('agenda.formService4')}</option>
                </select>
              </div>

              <div>
                <label for="agenda-profile" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formProfile')}</label>
                <select id="agenda-profile" name="profile" required class="field w-full appearance-none cursor-pointer">
                  <option value={t('agenda.formProfile1')} class="bg-[#121212]">{t('agenda.formProfile1')}</option>
                  <option value={t('agenda.formProfile2')} class="bg-[#121212]">{t('agenda.formProfile2')}</option>
                  <option value={t('agenda.formProfile3')} class="bg-[#121212]">{t('agenda.formProfile3')}</option>
                  <option value={t('agenda.formProfile4')} class="bg-[#121212]">{t('agenda.formProfile4')}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="agenda-topic" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.topTitle')}</label>
                <select id="agenda-topic" name="topic" required class="field w-full appearance-none cursor-pointer">
                  {#each topics as topic}
                    <option value={t(topic)} class="bg-[#121212]">{t(topic)}</option>
                  {/each}
                </select>
              </div>

              <div>
                <label for="agenda-infra" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formInfra')}</label>
                <input
                  id="agenda-infra"
                  type="text"
                  name="infra"
                  required
                  placeholder={t('agenda.formInfraPh')}
                  class="field w-full"
                />
              </div>
            </div>

            <div>
              <label for="agenda-message" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formMsg')}</label>
              <textarea
                id="agenda-message"
                name="message"
                rows="4"
                required
                placeholder="Describe tus necesidades de capacitación, frameworks, repositorios o herramientas CLI que deseas configurar (Hermes, OpenClaw, GitCore, etc.)..."
                class="field w-full resize-none"
              ></textarea>
            </div>

            <div class="pt-4 space-y-4">
              <button
                type="submit"
                class="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-accent text-black font-mono font-bold text-sm tracking-wider uppercase hover:bg-accent-light transition-all duration-300 shadow-xl shadow-accent/20 cursor-pointer"
              >
                <span>{selectedService === 'diagnostic' ? t('agenda.formSubmit') : t('agenda.formSubmitAlt')}</span>
                <span class="text-base font-extrabold font-sans">→</span>
              </button>

              <div class="flex items-center justify-center gap-6 pt-2">
                <span class="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                  <svg class="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  Stripe Checkout / Confirmación Directa
                </span>
                <span class="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                  <svg class="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Respuesta en &lt;24h
                </span>
              </div>

              <p class="text-text-muted text-xs text-center leading-relaxed">
                {t('agenda.formNote')}
              </p>
            </div>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>
