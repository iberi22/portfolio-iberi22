<script lang="ts">
  import { t } from '../i18n/index';

  const topics = ['agenda.top1','agenda.top2','agenda.top3','agenda.top4','agenda.top5','agenda.top6'];

  const formats = [
    { k: 'agenda.fmtDur', v: 'agenda.fmtDurV' },
    { k: 'agenda.fmtMod', v: 'agenda.fmtModV' },
    { k: 'agenda.fmtLang', v: 'agenda.fmtLangV' },
    { k: 'agenda.fmtFol', v: 'agenda.fmtFolV' },
  ];

  const pillars = [
    { icon: '🔍', t: 'agenda.p1t', d: 'agenda.p1d' },
    { icon: '🧩', t: 'agenda.p2t', d: 'agenda.p2d' },
    { icon: '🌱', t: 'agenda.p3t', d: 'agenda.p3d' },
  ];

  const slots = ['agenda.slot1', 'agenda.slot2', 'agenda.slot3'];

  let sent = $state(false);

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const topic = data.get('topic');
    const message = data.get('message');
    const subject = encodeURIComponent(`Agendamiento técnico — ${topic}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} · ${email}`);
    window.location.href = `mailto:iberi22@gmail.com?subject=${subject}&body=${body}`;
    sent = true;
  }
</script>

<section class="relative pt-32 pb-20 px-6">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="text-center entry-rise">
      <span class="text-accent text-sm tracking-widest">{t('agenda.badge')}</span>
      <h1 class="section-title mt-4">{t('agenda.title')}</h1>
      <p class="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">{t('agenda.subtitle')}</p>
    </div>

    <!-- Pillars -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      {#each pillars as p, i}
        <div class="glass-card p-8 entry-rise" style={`animation-delay: ${100 + i * 90}ms`}>
          <div class="text-3xl mb-4">{p.icon}</div>
          <h3 class="text-lg font-bold text-text-primary mb-2">{t(p.t)}</h3>
          <p class="text-text-secondary text-sm leading-relaxed">{t(p.d)}</p>
        </div>
      {/each}
    </div>

    <!-- Format + Topics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      <div class="glass-card p-8 entry-rise" style="animation-delay: 350ms">
        <h3 class="text-accent text-sm tracking-widest uppercase mb-6">{t('agenda.fmtTitle')}</h3>
        <ul class="space-y-4">
          {#each formats as f}
            <li class="flex flex-col gap-0.5 border-l border-white/10 pl-4">
              <span class="text-xs uppercase tracking-wider text-text-muted">{t(f.k)}</span>
              <span class="text-text-primary text-sm font-medium">{t(f.v)}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="glass-card p-8 entry-rise" style="animation-delay: 430ms">
        <h3 class="text-accent text-sm tracking-widest uppercase mb-6">{t('agenda.topTitle')}</h3>
        <ul class="space-y-3">
          {#each topics as topic}
            <li class="text-text-secondary text-sm leading-relaxed flex gap-2">
              <span class="text-accent">▹</span>{t(topic)}
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Availability -->
    <div class="glass-card p-6 mt-10 entry-rise" style="animation-delay: 500ms">
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3 justify-center">
        <span class="text-xs uppercase tracking-widest text-text-muted">{t('agenda.slotsLabel')}</span>
        {#each slots as s}
          <span class="flex items-center gap-2 text-sm text-text-secondary">
            <span class="w-2 h-2 rounded-full bg-accent inline-block"></span>{t(s)}
          </span>
        {/each}
      </div>
    </div>

    <!-- Booking form -->
    <div class="mt-12 max-w-2xl mx-auto entry-rise" style="animation-delay: 570ms">
      <div class="glass-card p-10">
        {#if sent}
          <div class="text-center py-8">
            <div class="text-4xl mb-4">📬</div>
            <h3 class="text-xl font-bold text-text-primary mb-2">{t('agenda.okTitle')}</h3>
            <p class="text-text-secondary text-sm">{t('agenda.okText')}</p>
          </div>
        {:else}
          <h3 class="text-xl font-bold text-text-primary mb-6 text-center">{t('agenda.formTitle')}</h3>
          <form onsubmit={handleSubmit} class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="name" required placeholder={t('agenda.formName')} class="field" />
              <input type="email" name="email" required placeholder={t('agenda.formEmail')} class="field" />
            </div>
            <select name="topic" required class="field appearance-none cursor-pointer">
              {#each topics as topic}
                <option value={t(topic)} class="bg-[#121212]">{t(topic)}</option>
              {/each}
            </select>
            <textarea name="message" rows="4" required placeholder={t('agenda.formMsg')} class="field resize-none"></textarea>
            <button type="submit" class="btn-primary w-full">{t('agenda.formSubmit')}</button>
            <p class="text-text-muted text-xs text-center">{t('agenda.formNote')}</p>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>
