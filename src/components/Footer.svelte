<script lang="ts">
  import { t } from '../i18n/index';
  import { baseUrl } from '../lib/baseUrl';
</script>

<footer class="relative py-16 px-6 border-t border-white/5 bg-bg-surface-dark/40">
  <div class="max-w-6xl mx-auto space-y-10">
    <!-- Security Verification & Trust Badges Strip -->
    <div class="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
          Auditoría de Seguridad & Sellos de Autenticidad
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-[11px] font-mono">
        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          OverWatch & ClamAV: 0 Malware
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          Gitleaks: 0 Secretos Expuestos
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          CodeQL / Dependabot: 0 CVEs Críticos
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent">
          ⚡ 100% Serverless / Local-First
        </span>
      </div>
    </div>

    <!-- Navigation & Links -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <span class="text-lg font-bold text-accent">iberi22</span>
        <p class="text-text-muted text-sm mt-1">{t('footer.tagline')}</p>
      </div>

      <div class="flex flex-wrap items-center gap-6 text-xs uppercase font-mono tracking-wider text-text-muted">
        <a href="#about" class="hover:text-accent transition-colors">{t('nav.about')}</a>
        <a href="#projects" class="hover:text-accent transition-colors">{t('nav.projects')}</a>
        <a href={baseUrl('blog')} class="hover:text-accent transition-colors">{t('nav.blog')}</a>
        <a href={baseUrl('simulator')} class="text-accent hover:text-accent-light transition-colors">{t('nav.simulator')}</a>
        <a href="#contact" class="hover:text-accent transition-colors">{t('nav.contact')}</a>
        <a href={baseUrl('agenda')} class="text-accent hover:text-accent-light transition-colors">{t('nav.agenda')}</a>
      </div>

      <a href="https://github.com/iberi22" target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      </a>
    </div>

    <!-- Copyright -->
    <div class="pt-6 border-t border-white/5 text-center">
      <p class="text-text-muted text-xs">
        <span class="text-accent/40">&copy;</span> {new Date().getFullYear()} <span class="text-accent/70">iberi22</span>
        <span class="text-text-muted mx-2">/</span>
        {t('footer.partOf')} <span class="text-text-secondary">SouthWest AI Labs</span>
        <span class="text-text-muted mx-2">/</span>
        {t('footer.builtWith')} <span class="text-accent/70">Astro</span> + <span class="text-secondary/70">Svelte</span>
      </p>
    </div>
  </div>
</footer>
