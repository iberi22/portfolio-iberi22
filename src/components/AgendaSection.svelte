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

  const pillars = [
    { icon: '📊', t: 'agenda.p1t', d: 'agenda.p1d' },
    { icon: '🤖', t: 'agenda.p2t', d: 'agenda.p2d' },
    { icon: '⚡', t: 'agenda.p3t', d: 'agenda.p3d' },
  ];

  const slots = ['agenda.slot1', 'agenda.slot2', 'agenda.slot3'];

  let sent = $state(false);
  let isPaying = $state(false);

  // Default Stripe Payment Link (can be configured or customized via env)
  const stripePaymentLink = 'https://buy.stripe.com/test_diagnostic_20usd';

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const profile = data.get('profile');
    const infra = data.get('infra');
    const topic = data.get('topic');
    const message = data.get('message');

    const subject = encodeURIComponent(`Solicitud Diagnóstico Técnico ($20 USD) — ${name}`);
    const body = encodeURIComponent(
      `SOLICITUD DE DIAGNÓSTICO TÉCNICO & RECURSOS ($20 USD)\n` +
      `====================================================\n\n` +
      `Cliente: ${name}\n` +
      `Correo: ${email}\n` +
      `Perfil: ${profile}\n` +
      `Infraestructura/Proveedores: ${infra}\n` +
      `Área de Enfoque: ${topic}\n\n` +
      `Detalles del Caso / Arquitectura:\n${message}\n\n` +
      `---\n` +
      `Entregables acordados:\n` +
      `- Informe evaluado por Brahyans Belalcázar + Consejo de Agentes\n` +
      `- Paquete de Skills y Scripts de automatización\n` +
      `- Sesión técnica 1 a 1 de 60 minutos\n` +
      `Pago: $20 USD gestionado vía Stripe`
    );

    // Open mailto to register structured order
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

      <!-- Pricing Callout Badge -->
      <div class="mt-8 inline-block">
        <div class="glass-card px-8 py-4 border-accent/40 bg-accent/5 backdrop-blur-md rounded-2xl flex flex-wrap items-center justify-center gap-4">
          <span class="text-3xl md:text-4xl font-extrabold text-accent font-mono">{t('agenda.priceTag')}</span>
          <div class="h-8 w-px bg-white/10 hidden sm:block"></div>
          <span class="text-sm md:text-base text-text-primary font-medium max-w-md text-left">
            {t('agenda.priceSub')}
          </span>
        </div>
      </div>
    </div>

    <!-- Pillars / Deliverables -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      {#each pillars as p, i}
        <div class="glass-card p-8 entry-rise flex flex-col justify-between border border-white/10 hover:border-accent/40 transition-all duration-300 group" style={`animation-delay: ${100 + i * 90}ms`}>
          <div>
            <div class="text-4xl mb-5 group-hover:scale-110 transition-transform">{p.icon}</div>
            <h3 class="text-lg font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">{t(p.t)}</h3>
            <p class="text-text-secondary text-sm leading-relaxed">{t(p.d)}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Format + Key Diagnostic Areas -->
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
                <label for="agenda-profile" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formProfile')}</label>
                <select id="agenda-profile" name="profile" required class="field w-full appearance-none cursor-pointer">
                  <option value={t('agenda.formProfile1')} class="bg-[#121212]">{t('agenda.formProfile1')}</option>
                  <option value={t('agenda.formProfile2')} class="bg-[#121212]">{t('agenda.formProfile2')}</option>
                  <option value={t('agenda.formProfile3')} class="bg-[#121212]">{t('agenda.formProfile3')}</option>
                  <option value={t('agenda.formProfile4')} class="bg-[#121212]">{t('agenda.formProfile4')}</option>
                </select>
              </div>

              <div>
                <label for="agenda-topic" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.topTitle')}</label>
                <select id="agenda-topic" name="topic" required class="field w-full appearance-none cursor-pointer">
                  {#each topics as topic}
                    <option value={t(topic)} class="bg-[#121212]">{t(topic)}</option>
                  {/each}
                </select>
              </div>
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

            <div>
              <label for="agenda-message" class="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">{t('agenda.formMsg')}</label>
              <textarea
                id="agenda-message"
                name="message"
                rows="4"
                required
                placeholder="Describe los lenguajes, frameworks, repositorios o procesos que deseas auditar y optimizar..."
                class="field w-full resize-none"
              ></textarea>
            </div>

            <div class="pt-4 space-y-4">
              <button
                type="submit"
                class="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-accent text-black font-mono font-bold text-sm tracking-wider uppercase hover:bg-accent-light transition-all duration-300 shadow-xl shadow-accent/20 cursor-pointer"
              >
                <span>{t('agenda.formSubmit')}</span>
                <span class="text-base font-extrabold font-sans">→</span>
              </button>

              <div class="flex items-center justify-center gap-6 pt-2">
                <span class="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                  <svg class="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  Pago Seguro con Stripe
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
