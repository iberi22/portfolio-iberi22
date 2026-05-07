# CRITICAL TASK: Add i18n + fix social links + SWAL mission to portfolio

Work in E:\scripts-python\portfolio-iberi22

## i18n System Already Created
10 translation files exist in `src/i18n/`:
- `index.ts` - locale detection, t(key) function, setCurrentLocale()
- `en.json` through `ur.json` - English, Spanish, Chinese, Hindi, Arabic, French, Portuguese, Bengali, Russian, Urdu

The `t(key)` function uses dot notation: `t('hero.badge')` returns text in current locale.
The `locale` key group contains: `locale.label`, `locale.announcement`, `locale.mission`, `locale.accelerate`

## Step 1: Update Nav.svelte
Add to script block (before any other code):
```ts
  import { t, getCurrentLocale, setCurrentLocale } from '../i18n/index';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
```
Replace hardcoded text with t() calls:
- `{item.label}` → `{t('nav.' + item.label.toLowerCase())}` (the navItems labels are: About, Projects, Blog, Contact)
  Actually better: create a map or just use the nav key directly.
  Change navItems to use `key` instead of `label`:
  ```
  const navItems = [
    { key: 'about', href: '#about' },
    { key: 'projects', href: '#projects' },
    { key: 'blog', href: '#blog' },
    { key: 'contact', href: '#contact' },
  ];
  ```
  Then render: `{t('nav.' + item.key)}`
- "GIT" button: `{t('nav.git')}`
- "GITHUB /" in mobile: `{t('nav.github')}`
- "/architect" badge: keep as-is (it's a brand element)
- Add `<LanguageSwitcher />` after the GIT button in desktop nav, and at bottom of mobile menu

## Step 2: Update HeroSection.svelte
Add: `import { t } from '../i18n/index';`
- `Systems Architect & Developer` → `{t('hero.badge')}`
- `Samuel` → keep (name doesn't translate)
- `Belalcazar` → keep
- `Building resilient systems at scale.` → `{t('hero.tagline')}`
- `Rust, AI orchestration...` → `{t('hero.taglineExtra')}`
- `View Projects` → `{t('hero.viewProjects')}`
- `Get in Touch` → `{t('hero.getInTouch')}`
- `SCROLL` → `{t('hero.scroll')}`

## Step 3: Update AboutSection.svelte
Add: `import { t } from '../i18n/index';`
- `# about` → `{t('about.heading')}`
- `Architecting` → `{t('about.title')}`
- `resilient` → `{t('about.titleAccent')}`
- `infrastructure` → `{t('about.titleSuffix')}`
- Bio text → `{t('about.bio')}`
- Philosophy text → `{t('about.philosophy')}`
- `clean architecture, zero compromise.` → `{t('about.philosophyAccent')}`
- `Core Projects` → `{t('about.statProjects')}`
- `Primary Stack` → `{t('about.statStack')}`
- `Core Competencies` → `{t('about.competencies')}`
- `Stack Index` → `{t('about.stackIndex')}`

## Step 4: Update ProjectsTimeline.svelte
Add: `import { t } from '../i18n/index';`
- `# projects` → `{t('projects.heading')}`
- `Building` → `{t('projects.title')}`
- `resilient` → `{t('projects.titleAccent')}`
- `systems` → `{t('projects.titleSuffix')}`
- Subtitle text → `{t('projects.subtitle')}`
- `Tech Stack` → `{t('projects.techStack')}`
- `Timeline & Roadmap` → `{t('projects.timeline')}`
- `Repository` → `{t('projects.repository')}`

BEFORE the #projects line, add a SWAL mission banner:
```svelte
<div class="text-center mb-24 max-w-3xl mx-auto">
  <div class="glass-card p-8 md:p-12 space-y-6 text-center">
    <p class="text-text-secondary text-sm leading-relaxed">
      {t('locale.announcement')}
    </p>
    <div class="w-12 h-px bg-accent/30 mx-auto"></div>
    <p class="text-text-muted text-sm leading-relaxed">
      {t('locale.mission')}
    </p>
    <p class="text-accent text-sm font-bold tracking-wider">
      {t('locale.accelerate')}
    </p>
  </div>
</div>
```

## Step 5: Update BlogSection.svelte
Add: `import { t } from '../i18n/index';`
- `# blog` → `{t('blog.heading')}`
- `Insights &` → `{t('blog.title')}`
- `architecture` → `{t('blog.titleAccent')}`
- Subtitle text → `{t('blog.subtitle')}`
- `Draft` → `{t('blog.draft')}`
- `COMING SOON` → `{t('blog.comingSoon')}`
- Pipeline status text → `{t('blog.pipelineStatus')}`

## Step 6: Update ContactSection.svelte
Add: `import { t } from '../i18n/index';`
- `# contact` → `{t('contact.heading')}`
- `Let's build` → `{t('contact.title')}`
- `something` → `{t('contact.titleAccent')}`
- `resilient` → `{t('contact.titleSuffix')}`
- Subtitle text → `{t('contact.subtitle')}`
- `YOUR@EMAIL.COM` placeholder → `{t('contact.emailPlaceholder')}`
- Message placeholder → `{t('contact.messagePlaceholder')}`
- `INITIALIZE CONTACT` → `{t('contact.submit')}`
- `EMAIL` link → `{t('contact.email')}`

UPDATE social links to include more platforms:
```ts
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/iberi22', icon: 'github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/samuel-belalcazar', icon: 'linkedin' },
  { name: 'Twitter / X', url: 'https://x.com/iberi22', icon: 'twitter' },
  { name: 'YouTube', url: 'https://youtube.com/@swal', icon: 'youtube' },
];
```
Add Twitter SVG and YouTube SVG icons. Use simple minimal SVG paths.

## Step 7: Update Footer.svelte
Add: `import { t } from '../i18n/index';`
- `Systems Architect & Developer` → `{t('footer.tagline')}`
- `Part of` → `{t('footer.partOf')}`
- `Built with` → `{t('footer.builtWith')}`

## Step 8: Create LanguageSwitcher.svelte
Create file: `src/components/LanguageSwitcher.svelte`

A minimal dropdown-style selector. Uses the `localeNames` import and `setCurrentLocale`.
Close the mobile menu on language change.

```svelte
<script lang="ts">
  import { localeNames, getCurrentLocale, setCurrentLocale, t } from '../i18n/index';
  import type { Locale } from '../i18n/index';

  let open = $state(false);
  let current = $state(getCurrentLocale());
  const locales = Object.keys(localeNames) as Locale[];

  function select(locale: Locale) {
    setCurrentLocale(locale);
    current = locale;
    open = false;
    window.location.reload();
  }
</script>

<div class="relative">
  <button
    onclick={() => (open = !open)}
    class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border border-white/10 text-text-muted hover:text-accent hover:border-accent/30 transition-all"
  >
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span>{localeNames[current]}</span>
  </button>

  {#if open}
    <div
      class="absolute top-full right-0 mt-2 w-44 glass-card p-2 z-50 max-h-64 overflow-y-auto"
      style="background: rgba(18, 18, 18, 0.95); backdrop-filter: blur(24px);"
    >
      {#each locales as locale}
        <button
          onclick={() => select(locale)}
          class="w-full text-left px-3 py-2 rounded text-xs transition-all flex items-center justify-between"
          class:bg-accent/10={locale === current}
          class:text-accent={locale === current}
          class:text-text-muted={locale !== current}
          class:hover:text-accent={locale !== current}
          class:hover:bg-white/5={locale !== current}
        >
          <span>{localeNames[locale]}</span>
          {#if locale === current}
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<svelte:window onclick={(e) => { if (!e.target?.closest?.('div')) open = false; }} />
```

## Step 9: Update Layout.astro
In the head, add a script to detect and set locale BEFORE rendering:
```astro
<script>
  import { detectLocale, setCurrentLocale } from '../i18n/index';
  setCurrentLocale(detectLocale());
</script>
```
This ensures the locale is loaded on page load.

## CRITICAL: After all changes
1. Run `npm run build` and fix any errors
2. Run `npm install --legacy-peer-deps` if build fails (but it probably won't)
3. Then `git add -A`, `git commit -m "feat: i18n 10 languages + SWAL mission + social links"`, `git push origin main`

## IMPORTANT NOTES:
- Keep all `font-mono` classes as-is (don't remove them, that was already fixed)
- Keep all existing Tailwind classes intact
- The projects data (names, descriptions, tech) stays in English - only UI labels translate
- Do NOT touch global.css, tailwind.config.mjs, or astro.config.mjs
- Do NOT modify .github/workflows/deploy.yml
- Keep all Svelte 5 runes syntax ($state, etc.)
- Do NOT use $: or on:click — use onclick={} and $state
