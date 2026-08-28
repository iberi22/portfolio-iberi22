<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '../i18n/index';

  interface Provider {
    id: string;
    name: string;
    tier: 'cloud' | 'local' | 'router';
    costPer1MInput: number;
    costPer1MOutput: number;
    speedScore: number; // 1-10
    qualityScore: number; // 1-10
    active: boolean;
  }

  let providers = $state<Provider[]>([
    { id: 'gemini', name: 'Google Gemini (Flash/Pro)', tier: 'cloud', costPer1MInput: 0.15, costPer1MOutput: 0.60, speedScore: 9.5, qualityScore: 9.2, active: true },
    { id: 'claude', name: 'Anthropic Claude (Sonnet 3.7 / Haiku)', tier: 'cloud', costPer1MInput: 3.00, costPer1MOutput: 15.00, speedScore: 8.8, qualityScore: 9.8, active: true },
    { id: 'openai', name: 'OpenAI (GPT-4o / Mini / o3)', tier: 'cloud', costPer1MInput: 2.50, costPer1MOutput: 10.00, speedScore: 8.5, qualityScore: 9.3, active: false },
    { id: 'openrouter', name: 'OpenRouter (Multi-Provider Router)', tier: 'router', costPer1MInput: 0.50, costPer1MOutput: 1.50, speedScore: 9.0, qualityScore: 9.4, active: true },
    { id: 'bedrock', name: 'Amazon Bedrock (Enterprise)', tier: 'router', costPer1MInput: 1.20, costPer1MOutput: 4.00, speedScore: 9.1, qualityScore: 9.5, active: false },
    { id: 'ollama', name: 'Ollama / vLLM (Local Hardware)', tier: 'local', costPer1MInput: 0.00, costPer1MOutput: 0.00, speedScore: 7.5, qualityScore: 8.2, active: true },
  ]);

  let hardware = $state<'mac' | 'gpu_linux' | 'vps' | 'cpu_only'>('mac');
  let dailyPrompts = $state(50);
  let teamSize = $state(1);
  let focusGoal = $state<'balanced' | 'cost' | 'speed' | 'privacy'>('balanced');
  let repoPath = $state('~/proyectos/mi-sistema');
  let activeTab = $state<'sim' | 'prompt' | 'skill' | 'env'>('sim');

  let copied = $state(false);

  // Load from localStorage on mount
  onMount(() => {
    try {
      const saved = localStorage.getItem('swal_sim_profile_v1');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.hardware) hardware = data.hardware;
        if (data.dailyPrompts) dailyPrompts = data.dailyPrompts;
        if (data.teamSize) teamSize = data.teamSize;
        if (data.focusGoal) focusGoal = data.focusGoal;
        if (data.repoPath) repoPath = data.repoPath;
        if (data.providers) {
          providers.forEach(p => {
            const found = data.providers.find((dp: any) => dp.id === p.id);
            if (found) p.active = found.active;
          });
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  });

  function saveProfile() {
    try {
      const data = { hardware, dailyPrompts, teamSize, focusGoal, repoPath, providers };
      localStorage.setItem('swal_sim_profile_v1', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  function toggleProvider(id: string) {
    const p = providers.find(x => x.id === id);
    if (p) {
      p.active = !p.active;
      saveProfile();
    }
  }

  // Simulation Algorithm: Top 5 Scenarios
  let simulationResults = $derived.by(() => {
    const activeList = providers.filter(p => p.active);
    const hasLocal = activeList.some(p => p.id === 'ollama');
    const hasRouter = activeList.some(p => p.id === 'openrouter' || p.id === 'bedrock');
    const hasFastCloud = activeList.some(p => p.id === 'gemini');
    const hasHighQuality = activeList.some(p => p.id === 'claude' || p.id === 'openai');

    const totalMonthlyTokens = dailyPrompts * 30 * 4000; // ~4k tokens avg per prompt cycle

    // Base estimated monthly cost calculation
    const avgInputCost = activeList.length > 0 ? (activeList.reduce((acc, p) => acc + p.costPer1MInput, 0) / activeList.length) : 0.5;
    const avgOutputCost = activeList.length > 0 ? (activeList.reduce((acc, p) => acc + p.costPer1MOutput, 0) / activeList.length) : 1.5;
    const baseCloudCost = (totalMonthlyTokens / 1_000_000) * (avgInputCost * 0.7 + avgOutputCost * 0.3);

    return [
      {
        rank: '#1',
        name: 'Tier 1: Ultra-Cost Optimizer (Local + Router Triage)',
        desc: 'Usa Ollama local para tareas de planificación y pruebas unitarias, delegando solo código crítico a modelos ligeros vía OpenRouter.',
        monthlyCostUSD: hasLocal ? Math.round(baseCloudCost * 0.15) : Math.round(baseCloudCost * 0.4),
        speedRating: '8.2 / 10',
        velocityMultiplier: '3.5x',
        privacyLevel: hasLocal ? 'Alta (Local First)' : 'Media',
        recommendedStack: ['Ollama (Qwen 2.5 / DeepSeek R1 14B)', 'OpenRouter Flash Routing', 'GitCore local engine'],
        recommendedFor: 'Desarrolladores autónomos y proyectos con presupuesto ajustado.'
      },
      {
        rank: '#2',
        name: 'Tier 2: Maximum Velocity (Cloud Wave Parallelism)',
        desc: 'Orquestación de hasta 15 micro-tareas paralelas con Google Jules + Gemini Flash para entrega continua ultra-rápida.',
        monthlyCostUSD: Math.round(baseCloudCost * 0.85),
        speedRating: '9.8 / 10',
        velocityMultiplier: '7.5x',
        privacyLevel: 'Estándar Cloud',
        recommendedStack: ['Google Jules Swarm', 'Gemini 2.5 Flash/Pro', 'Hermes Gateway', 'Automated Test Suites'],
        recommendedFor: 'Startups y equipos que priorizan velocidad extrema de entrega sobre costo de tokens.'
      },
      {
        rank: '#3',
        name: 'Tier 3: Balanced Hybrid (Smart Router + Multi-Model)',
        desc: 'El equilibrio óptimo: enrutamiento inteligente por tipo de tarea (Flash para búsqueda y linting, Claude Sonnet para arquitectura y refactor).',
        monthlyCostUSD: Math.round(baseCloudCost * 0.55),
        speedRating: '9.2 / 10',
        velocityMultiplier: '5.5x',
        privacyLevel: 'Híbrida',
        recommendedStack: ['Hermes Multi-Provider Routing', 'OpenRouter API', 'Claude Sonnet 3.7', 'Ollama Local Fallback'],
        recommendedFor: 'Proyectos profesionales que buscan máxima calidad sin incurrir en sobrecostes.'
      },
      {
        rank: '#4',
        name: 'Tier 4: Sovereign Local-First (100% On-Premise)',
        desc: 'Privacidad absoluta con cero fugas de código a la nube. Runtimes locales con aceleración GPU o Apple Silicon y base de datos vectorial local.',
        monthlyCostUSD: 0,
        speedRating: hardware === 'mac' || hardware === 'gpu_linux' ? '8.5 / 10' : '6.0 / 10',
        velocityMultiplier: '3.0x',
        privacyLevel: '100% Soberana (Air-Gapped)',
        recommendedStack: ['vLLM / Ollama', 'Xavier Memory (SQLite-vec local)', 'GitCore local', 'OpenClaw Headless'],
        recommendedFor: 'Industrias reguladas, proyectos con NDA estricto y código confidencial.'
      },
      {
        rank: '#5',
        name: 'Tier 5: Enterprise Bedrock & Governance Swarm',
        desc: 'Infraestructura empresarial con Amazon Bedrock, gestión estricta de credenciales, auditoría formal de seguridad y suites CI/CD.',
        monthlyCostUSD: Math.round(baseCloudCost * 1.3),
        speedRating: '9.4 / 10',
        velocityMultiplier: '6.0x',
        privacyLevel: 'Enterprise Compliance (SOC2)',
        recommendedStack: ['Amazon Bedrock Router', 'GitCore Enterprise', 'MCP Security Proxies', 'Consenso Multi-Agente'],
        recommendedFor: 'Empresas consolidadas con altos requerimientos de gobernanza y trazabilidad.'
      }
    ];
  });

  // Generated Master Prompt
  let generatedMasterPrompt = $derived.by(() => {
    const activeNames = providers.filter(p => p.active).map(p => p.name).join(', ');
    return `<agent_system_protocol>
# ROL & IDENTIDAD
Eres un Agente de Ingeniería de Software Autónomo de nivel Staff/Senior, configurado para operar en el repositorio ubicado en \`${repoPath}\`.
Tu objetivo es ejecutar cambios con máxima predictibilidad, cero deuda técnica y verificación determinista.

# RECURSOS & PROVEEDORES DISPONIBLES
- Proveedores Activos: ${activeNames || 'Local / Multi-Provider'}
- Entorno de Hardware: ${hardware.toUpperCase()}
- Política de Tokens: Optimización continua (Micro-fragmentación de archivos, lecturas de rango precisas).

# PROTOCOLO DE EJECUCIÓN OBLIGATORIO
1. ANÁLISIS PREVIO: Leer primero los archivos de contexto y reglas del repositorio antes de escribir código.
2. AISLAMIENTO: Trabajar en islas de archivos disjuntos (1 Issue → 1 Rama → 1 PR).
3. DETERMINISMO: Cada cambio debe compilar con cero errores y pasar la suite de pruebas automatizadas.
4. SEGURIDAD: Nunca escribir ni committear credenciales, API keys ni secretos (.env).

# REGLA DE RETROALIMENTACIÓN
Al finalizar cada tarea, reportar el diff exacto, comandos de verificación ejecutados y el resultado de la suite de tests.
</agent_system_protocol>`;
  });

  // Generated SKILL.md
  let generatedSkillMd = $derived.by(() => {
    return `---
name: custom-agentic-pipeline
description: Protocolo y habilidades de desarrollo determinista optimizado para ${hardware.toUpperCase()} con ruteo de modelos (${providers.filter(p => p.active).map(p => p.id).join(', ')}).
---

# CUSTOM AGENTIC SKILL — ${hardware.toUpperCase()} PIPELINE

## 1. Guía de Ruteo de Modelos
- **Tareas Simples / Lints / Lectura de Archivos**: Usar modelos Flash / Ligeros o Local Ollama.
- **Arquitectura / Refactor Complejo / Razonamiento**: Usar modelos Pro / Claude Sonnet vía OpenRouter.

## 2. Guardrails de Ejecución
- **Ruta de Trabajo**: \`${repoPath}\`
- **Comando de Verificación**: \`pnpm run build\` / \`pytest\` / \`cargo check\`
- **Control de Cambios**: Micro-commits atómicos con mensajes convencionales (\`feat:\`, \`fix:\`, \`chore:\`).

## 3. Manejo de Secretos
- Las API keys se leen exclusivamente desde variables de entorno seguras.
- Usar proxies efímeros para evitar fugas en logs de agentes.
`;
  });

  // Generated .env.example
  let generatedEnvExample = $derived.by(() => {
    let env = `# .env.example — Configuración Generada por el Simulador SWAL\n`;
    env += `REPO_ROOT_PATH=${repoPath}\n`;
    env += `HARDWARE_PROFILE=${hardware}\n\n`;
    if (providers.find(p => p.id === 'openrouter')?.active) env += `OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx\n`;
    if (providers.find(p => p.id === 'gemini')?.active) env += `GEMINI_API_KEY=AIzaSyxxxxxxxxxxxx\n`;
    if (providers.find(p => p.id === 'claude')?.active) env += `ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx\n`;
    if (providers.find(p => p.id === 'openai')?.active) env += `OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx\n`;
    if (providers.find(p => p.id === 'bedrock')?.active) env += `AWS_BEDROCK_REGION=us-east-1\nAWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx\nAWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx\n`;
    if (providers.find(p => p.id === 'ollama')?.active) env += `OLLAMA_BASE_URL=http://localhost:11434\nOLLAMA_MODEL=qwen2.5-coder:14b\n`;
    env += `\n# Guardrails\nMAX_TOKENS_PER_CYCLE=16000\nAGENT_PARALLEL_CONCURRENCY=5\n`;
    return env;
  });

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }
</script>

<div class="glass-card p-6 md:p-10 border-accent/30 bg-bg-surface-dark/95 shadow-2xl relative overflow-hidden">
  <div class="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Free Badge & Heading -->
  <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
    <div>
      <div class="flex items-center gap-2.5">
        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-accent text-black shadow-lg shadow-accent/20">
          HERRAMIENTA GRATIS · APORTE SENIOR
        </span>
        <span class="text-xs font-mono text-text-muted">100% Client-Side · Sin Servidor</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-text-primary mt-3">
        Simulador de Recursos & Generador de Skills / Prompts
      </h2>
      <p class="text-text-secondary text-sm mt-1 max-w-2xl">
        Configura tu entorno de trabajo ingresando tus proveedores y hardware. El motor simulará las 5 mejores configuraciones y generará prompts profesionales y skills listos para inyectar en tus agentes.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <button
        onclick={() => saveProfile()}
        class="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-text-secondary hover:text-accent hover:border-accent/40 transition-all cursor-pointer"
      >
        💾 Guardar Perfil Local
      </button>
    </div>
  </div>

  <!-- Interactive Input Form -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <!-- 1. AI Providers Selection -->
    <div class="glass-card p-5 border-white/10">
      <h3 class="text-xs font-mono font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>01.</span> Proveedores & Modelos
      </h3>
      <div class="space-y-2.5">
        {#each providers as p}
          <button
            type="button"
            onclick={() => toggleProvider(p.id)}
            class="w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer {p.active ? 'border-accent/50 bg-accent/10 text-text-primary' : 'border-white/5 bg-black/30 text-text-muted hover:border-white/20'}"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-3.5 h-3.5 rounded border flex items-center justify-center {p.active ? 'border-accent bg-accent text-black text-[10px] font-bold' : 'border-white/30'}">
                {p.active ? '✓' : ''}
              </span>
              <span class="text-xs font-medium">{p.name}</span>
            </div>
            <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded {p.tier === 'local' ? 'bg-emerald-500/20 text-emerald-300' : p.tier === 'router' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-blue-500/20 text-blue-300'}">
              {p.tier}
            </span>
          </button>
        {/each}
      </div>
    </div>

    <!-- 2. Hardware & Capacity -->
    <div class="glass-card p-5 border-white/10">
      <h3 class="text-xs font-mono font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>02.</span> Hardware & Entorno
      </h3>
      <div class="space-y-4">
        <div>
          <label class="block text-[11px] font-mono text-text-muted mb-1.5 uppercase">Hardware Principal</label>
          <select bind:value={hardware} onchange={saveProfile} class="field w-full text-xs cursor-pointer">
            <option value="mac">Apple Silicon (M1/M2/M3/M4 Mac Studio/Pro)</option>
            <option value="gpu_linux">Linux Workstation / Server (NVIDIA RTX / CUDA)</option>
            <option value="vps">Linux VPS / Servidor Cloud (Ubuntu / Debian / NixOS)</option>
            <option value="cpu_only">CPU-Only / Laptop estándar</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-mono text-text-muted mb-1.5 uppercase">Ruta / Workspace Path</label>
          <input type="text" bind:value={repoPath} oninput={saveProfile} placeholder="~/proyectos/mi-app" class="field w-full text-xs font-mono" />
        </div>

        <div>
          <label class="block text-[11px] font-mono text-text-muted mb-1.5 uppercase">Prompts / Tareas Diarias: <span class="text-accent font-bold">{dailyPrompts}</span></label>
          <input type="range" min="10" max="300" step="10" bind:value={dailyPrompts} oninput={saveProfile} class="w-full accent-accent cursor-pointer" />
        </div>
      </div>
    </div>

    <!-- 3. Objective & Optimization Goal -->
    <div class="glass-card p-5 border-white/10">
      <h3 class="text-xs font-mono font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>03.</span> Enfoque de Optimización
      </h3>
      <div class="space-y-3">
        <label class="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-black/30 cursor-pointer hover:border-accent/30 transition-all">
          <input type="radio" name="goal" value="balanced" bind:group={focusGoal} onchange={saveProfile} class="accent-accent" />
          <div>
            <span class="text-xs font-bold text-text-primary block">Híbrido Balanceado (Recomendado)</span>
            <span class="text-[10px] text-text-muted">Optimiza costo y velocidad simultáneamente.</span>
          </div>
        </label>

        <label class="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-black/30 cursor-pointer hover:border-accent/30 transition-all">
          <input type="radio" name="goal" value="cost" bind:group={focusGoal} onchange={saveProfile} class="accent-accent" />
          <div>
            <span class="text-xs font-bold text-text-primary block">Mínimo Costo (Local First)</span>
            <span class="text-[10px] text-text-muted">Máxima carga a modelos locales y routers baratos.</span>
          </div>
        </label>

        <label class="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-black/30 cursor-pointer hover:border-accent/30 transition-all">
          <input type="radio" name="goal" value="speed" bind:group={focusGoal} onchange={saveProfile} class="accent-accent" />
          <div>
            <span class="text-xs font-bold text-text-primary block">Máxima Velocidad (Swarm Concurrency)</span>
            <span class="text-[10px] text-text-muted">Oleadas masivas de agentes paralelos.</span>
          </div>
        </label>
      </div>
    </div>
  </div>

  <!-- Navigation Tabs for Outputs -->
  <div class="flex flex-wrap items-center justify-between border-b border-white/10 mb-6 gap-2">
    <div class="flex items-center gap-2">
      <button
        onclick={() => activeTab = 'sim'}
        class="px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer {activeTab === 'sim' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'}"
      >
        📊 Top 5 Simulaciones
      </button>
      <button
        onclick={() => activeTab = 'prompt'}
        class="px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer {activeTab === 'prompt' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'}"
      >
        🤖 Prompt Maestro
      </button>
      <button
        onclick={() => activeTab = 'skill'}
        class="px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer {activeTab === 'skill' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'}"
      >
        🛠️ Custom SKILL.md
      </button>
      <button
        onclick={() => activeTab = 'env'}
        class="px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer {activeTab === 'env' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'}"
      >
        🔒 .env.example
      </button>
    </div>

    {#if activeTab !== 'sim'}
      <button
        onclick={() => copyToClipboard(activeTab === 'prompt' ? generatedMasterPrompt : activeTab === 'skill' ? generatedSkillMd : generatedEnvExample)}
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold hover:bg-accent hover:text-black transition-all cursor-pointer"
      >
        <span>{copied ? '✓ Copiado!' : '📋 Copiar al Portapapeles'}</span>
      </button>
    {/if}
  </div>

  <!-- TAB 1: Top 5 Scenarios Simulation -->
  {#if activeTab === 'sim'}
    <div class="space-y-4">
      {#each simulationResults as sim}
        <div class="p-5 rounded-xl border border-white/10 bg-black/40 hover:border-accent/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="max-w-2xl">
            <div class="flex items-center gap-3 mb-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                {sim.rank}
              </span>
              <h4 class="text-base font-bold text-text-primary">{sim.name}</h4>
            </div>
            <p class="text-text-secondary text-xs leading-relaxed mb-3">{sim.desc}</p>
            
            <div class="flex flex-wrap items-center gap-2">
              {#each sim.recommendedStack as item}
                <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-text-muted">
                  {item}
                </span>
              {/each}
            </div>
          </div>

          <div class="flex md:flex-col items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 min-w-[170px] text-right">
            <div>
              <span class="text-[10px] font-mono text-text-muted block uppercase">Costo Estimado</span>
              <span class="text-lg font-bold text-accent font-mono">${sim.monthlyCostUSD} USD<span class="text-xs text-text-muted font-sans font-normal">/mes</span></span>
            </div>
            <div class="mt-2">
              <span class="text-[10px] font-mono text-text-muted block uppercase">Velocidad / Multiplicador</span>
              <span class="text-xs font-bold text-emerald-400 font-mono">{sim.velocityMultiplier} ({sim.speedRating})</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- TAB 2: Generated Master Prompt -->
  {#if activeTab === 'prompt'}
    <div class="space-y-4">
      <p class="text-xs text-text-muted font-mono">
        💡 Este prompt maestro está afinado para tus proveedores y rutas. Inyéctalo como system prompt en Claude Code, Antigravity, OpenCode, Cursor o tus agentes CLI:
      </p>
      <pre class="p-5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px]">{generatedMasterPrompt}</pre>
    </div>
  {/if}

  <!-- TAB 3: Generated SKILL.md -->
  {#if activeTab === 'skill'}
    <div class="space-y-4">
      <p class="text-xs text-text-muted font-mono">
        💡 Guarda este archivo como <code class="text-accent">SKILL.md</code> en la carpeta de skills de tu arnés o agente (Hermes, Antigravity, OpenClaw, GitCore):
      </p>
      <pre class="p-5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px]">{generatedSkillMd}</pre>
    </div>
  {/if}

  <!-- TAB 4: Generated .env.example -->
  {#if activeTab === 'env'}
    <div class="space-y-4">
      <p class="text-xs text-text-muted font-mono">
        💡 Plantilla de variables de entorno con endpoints y guardrails configurados:
      </p>
      <pre class="p-5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px]">{generatedEnvExample}</pre>
    </div>
  {/if}
</div>
