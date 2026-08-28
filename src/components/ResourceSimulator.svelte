<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '../i18n/index';

  interface ProviderItem {
    id: string;
    name: string;
    category: 'cloud' | 'router' | 'specialized' | 'local' | 'free';
    costInput: number; // USD per 1M tokens
    costOutput: number; // USD per 1M tokens
    speedScore: number; // 1-10
    qualityScore: number; // 1-10
    freeTierAvailable: boolean;
    active: boolean;
  }

  interface HardwareState {
    type: 'gpu_high' | 'mac_studio' | 'cpu_only' | 'vps_linux' | 'cloud_ec2';
    ramGb: number;
    gpuVramGb: number;
  }

  interface WorkloadState {
    dailyPrompts: number;
    repoSizeMb: number;
    rateLimitRpm: number;
    budgetLimitUsd: number;
    currentMonthlySpendUsd: number;
    subscriptions: string[];
    useFreeTiers: boolean;
  }

  interface ContextState {
    srcPath: string;
    testPath: string;
    docsUrl: string;
    envKeys: string;
    selectedCli: 'hermes' | 'openclaw' | 'gitcore' | 'jules';
  }

  interface UserProfile {
    version: string;
    providers: Record<string, boolean>;
    hardware: HardwareState;
    workload: WorkloadState;
    context: ContextState;
  }

  // Top 20+ Industry AI Providers & Routers
  const initialProvidersList: ProviderItem[] = [
    { id: 'gemini', name: 'Google Gemini (2.5 Flash / Pro)', category: 'cloud', costInput: 0.15, costOutput: 0.60, speedScore: 9.6, qualityScore: 9.3, freeTierAvailable: true, active: true },
    { id: 'claude', name: 'Anthropic Claude (3.7 Sonnet / Haiku)', category: 'cloud', costInput: 3.00, costOutput: 15.00, speedScore: 8.9, qualityScore: 9.8, freeTierAvailable: false, active: true },
    { id: 'openai', name: 'OpenAI (GPT-4o / o3-mini / GPT-4.5)', category: 'cloud', costInput: 2.50, costOutput: 10.00, speedScore: 8.7, qualityScore: 9.4, freeTierAvailable: false, active: true },
    { id: 'openrouter', name: 'OpenRouter (Multi-Model Meta-Router)', category: 'router', costInput: 0.40, costOutput: 1.20, speedScore: 9.2, qualityScore: 9.5, freeTierAvailable: true, active: true },
    { id: 'deepseek', name: 'DeepSeek API (V3 / R1 Direct)', category: 'cloud', costInput: 0.14, costOutput: 0.28, speedScore: 8.5, qualityScore: 9.2, freeTierAvailable: false, active: true },
    { id: 'groq', name: 'Groq (LPU Ultra-Fast Inference)', category: 'specialized', costInput: 0.08, costOutput: 0.20, speedScore: 9.9, qualityScore: 8.8, freeTierAvailable: true, active: true },
    { id: 'bedrock', name: 'Amazon Bedrock (AWS Enterprise)', category: 'cloud', costInput: 1.50, costOutput: 6.00, speedScore: 9.1, qualityScore: 9.5, freeTierAvailable: false, active: false },
    { id: 'vertex', name: 'Google Cloud Vertex AI', category: 'cloud', costInput: 1.20, costOutput: 5.00, speedScore: 9.3, qualityScore: 9.4, freeTierAvailable: false, active: false },
    { id: 'mistral', name: 'Mistral AI (Codestral / Large)', category: 'cloud', costInput: 0.30, costOutput: 0.90, speedScore: 9.0, qualityScore: 9.0, freeTierAvailable: true, active: false },
    { id: 'together', name: 'Together AI (Open Source GPU Cloud)', category: 'specialized', costInput: 0.20, costOutput: 0.60, speedScore: 9.1, qualityScore: 8.9, freeTierAvailable: false, active: false },
    { id: 'fireworks', name: 'Fireworks AI (Fast Speculative Decoding)', category: 'specialized', costInput: 0.20, costOutput: 0.50, speedScore: 9.4, qualityScore: 8.9, freeTierAvailable: false, active: false },
    { id: 'perplexity', name: 'Perplexity AI (Sonar / Live Search)', category: 'specialized', costInput: 1.00, costOutput: 5.00, speedScore: 8.8, qualityScore: 9.1, freeTierAvailable: false, active: false },
    { id: 'cohere', name: 'Cohere (Command R+ / Embeddings)', category: 'specialized', costInput: 0.40, costOutput: 1.50, speedScore: 8.6, qualityScore: 8.8, freeTierAvailable: false, active: false },
    { id: 'xai', name: 'xAI Grok (Grok-2 / Grok-3)', category: 'cloud', costInput: 2.00, costOutput: 10.00, speedScore: 8.7, qualityScore: 9.1, freeTierAvailable: false, active: false },
    { id: 'cerebras', name: 'Cerebras (WSE Wafer-Scale Fast Inference)', category: 'specialized', costInput: 0.10, costOutput: 0.30, speedScore: 9.9, qualityScore: 8.7, freeTierAvailable: true, active: false },
    { id: 'cloudflare', name: 'Cloudflare Workers AI (Serverless Edge)', category: 'router', costInput: 0.15, costOutput: 0.45, speedScore: 9.0, qualityScore: 8.5, freeTierAvailable: true, active: false },
    { id: 'github_models', name: 'GitHub Models / Azure OpenAI', category: 'cloud', costInput: 1.80, costOutput: 7.00, speedScore: 8.8, qualityScore: 9.2, freeTierAvailable: true, active: false },
    { id: 'ollama', name: 'Ollama Local (Llama 3.3 / Qwen 2.5 / R1)', category: 'local', costInput: 0.00, costOutput: 0.00, speedScore: 7.8, qualityScore: 8.6, freeTierAvailable: true, active: true },
    { id: 'vllm', name: 'vLLM Local GPU Server (High-Throughput)', category: 'local', costInput: 0.00, costOutput: 0.00, speedScore: 8.9, qualityScore: 8.8, freeTierAvailable: true, active: false },
    { id: 'free_routers', name: 'Free-Tier Endpoints (Google AI Studio / Groq Free / OpenRouter Free)', category: 'free', costInput: 0.00, costOutput: 0.00, speedScore: 7.2, qualityScore: 8.3, freeTierAvailable: true, active: false },
  ];

  const defaultProfile: UserProfile = {
    version: '1.2.0',
    providers: {
      gemini: true,
      claude: true,
      openai: true,
      openrouter: true,
      deepseek: true,
      groq: true,
      ollama: true,
    },
    hardware: {
      type: 'mac_studio',
      ramGb: 64,
      gpuVramGb: 24,
    },
    workload: {
      dailyPrompts: 150,
      repoSizeMb: 120,
      rateLimitRpm: 60,
      budgetLimitUsd: 80,
      currentMonthlySpendUsd: 40,
      subscriptions: ['ChatGPT Plus ($20)', 'Claude Pro ($20)'],
      useFreeTiers: false,
    },
    context: {
      srcPath: './src',
      testPath: './tests',
      docsUrl: 'https://github.com/iberi22/portfolio-iberi22',
      envKeys: 'OPENROUTER_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, GROQ_API_KEY',
      selectedCli: 'jules',
    },
  };

  let profile = $state<UserProfile>(JSON.parse(JSON.stringify(defaultProfile)));
  let providersList = $state<ProviderItem[]>(JSON.parse(JSON.stringify(initialProvidersList)));
  let selectedTierIndex = $state<number>(0);
  let activeTab = $state<'sim' | 'prompt' | 'websearch' | 'skill' | 'env'>('sim');
  let copyFeedback = $state<string | null>(null);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  const STORAGE_KEY = 'swal_sim_profiles_v2';

  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        profile = { ...defaultProfile, ...parsed };
      }
      syncProvidersState();
    } catch (e) {
      console.error('Failed to load profile from localStorage', e);
    }
  });

  function syncProvidersState() {
    providersList.forEach((p) => {
      p.active = !!profile.providers[p.id];
    });
  }

  function saveProfile() {
    try {
      providersList.forEach((p) => {
        profile.providers[p.id] = p.active;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }

  function toggleProvider(id: string) {
    const p = providersList.find((x) => x.id === id);
    if (p) {
      p.active = !p.active;
      saveProfile();
    }
  }

  function resetProfile() {
    profile = JSON.parse(JSON.stringify(defaultProfile));
    syncProvidersState();
    saveProfile();
    showFeedback('Valores restablecidos a valores por defecto');
  }

  function exportProfileJson() {
    providersList.forEach((p) => {
      profile.providers[p.id] = p.active;
    });
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `swal_sim_profile_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function triggerImport() {
    fileInputRef?.click();
  }

  function handleImportFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        if (imported && typeof imported === 'object') {
          profile = { ...defaultProfile, ...imported };
          syncProvidersState();
          saveProfile();
          showFeedback('¡Perfil importado exitosamente!');
        }
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  }

  function showFeedback(msg: string) {
    copyFeedback = msg;
    setTimeout(() => {
      if (copyFeedback === msg) copyFeedback = null;
    }, 3000);
  }

  // --- Algorithmic Simulation & Scoring Engine ---
  const simulationResults = $derived.by(() => {
    const activeProviders = providersList.filter((p) => p.active);
    const hasLocal = activeProviders.some((p) => p.category === 'local');
    const hasRouter = activeProviders.some((p) => p.category === 'router');
    const useFree = profile.workload.useFreeTiers;

    const totalDailyTokens = profile.workload.dailyPrompts * 2500;
    const monthlyTokensM = (totalDailyTokens * 30) / 1_000_000;

    const tiers = [
      {
        id: 'tier1',
        title: '💰 Tier 1: Ultra-Cost Optimizer (Local + DeepSeek / Groq)',
        tagline: 'Ollama local para triage/lints + OpenRouter/DeepSeek para síntesis económica',
        description: 'Reduce hasta un 85% de costos usando inferencia local en tu hardware y delegando código pesado a modelos de centavos por millón de tokens.',
        costEstUsd: useFree ? 0 : hasLocal ? Math.round(monthlyTokensM * 0.22) : Math.round(monthlyTokensM * 0.45),
        estLatencyMs: hasLocal ? 750 : 350,
        concurrencyLimit: 4,
        antiDriftScore: 89,
        e2eVerificationRate: 93,
        costEfficiencyScore: 98,
        devVelocityScore: 78,
        resilienceScore: 88,
        primaryRouting: 'Local Ollama (Qwen2.5-Coder) → OpenRouter (DeepSeek-V3 / Groq LPU)',
        recommendedCli: 'openclaw',
      },
      {
        id: 'tier2',
        title: '⚡ Tier 2: Maximum Velocity (Cloud Wave Parallelism)',
        tagline: 'Oleadas masivas de agentes paralelos con Google Jules (15 micro-tareas) + Gemini 2.5 Flash',
        description: 'Optimizado para máxima velocidad de entrega de features mediante paralelismo extremo en la nube y pruebas E2E automatizadas.',
        costEstUsd: Math.round(monthlyTokensM * 1.6),
        estLatencyMs: 190,
        concurrencyLimit: 15,
        antiDriftScore: 92,
        e2eVerificationRate: 96,
        costEfficiencyScore: 80,
        devVelocityScore: 99,
        resilienceScore: 91,
        primaryRouting: 'Google Jules 15-Wave Parallel Task Engine → Gemini 2.5 Flash / Pro',
        recommendedCli: 'jules',
      },
      {
        id: 'tier3',
        title: '⚖️ Tier 3: Balanced Hybrid Orchestrator',
        tagline: 'Orquestador Claude 3.7 Sonnet / Hermes + Workers locales para pruebas deterministas',
        description: 'El estándar de la industria: razonamiento de clase mundial para arquitectura y contratos, con ejecución local determinista sin sobrecostes.',
        costEstUsd: Math.round(monthlyTokensM * 2.1),
        estLatencyMs: 380,
        concurrencyLimit: 8,
        antiDriftScore: 97,
        e2eVerificationRate: 98,
        costEfficiencyScore: 86,
        devVelocityScore: 90,
        resilienceScore: 96,
        primaryRouting: 'Claude 3.7 Sonnet / Hermes Multi-Provider Router → Local Test Sandbox',
        recommendedCli: 'hermes',
      },
      {
        id: 'tier4',
        title: '🛡️ Tier 4: Sovereign Local-First (100% On-Premise)',
        tagline: 'Cero fugas de código a la nube. Runtimes locales (vLLM / Ollama) + Memoria Xavier',
        description: 'Ideal para proyectos con estricto NDA y privacidad absoluta. Todo el ciclo corre en tu GPU o Mac Studio sin llamadas externas.',
        costEstUsd: 0,
        estLatencyMs: profile.hardware.type === 'mac_studio' || profile.hardware.type === 'gpu_high' ? 620 : 1200,
        concurrencyLimit: profile.hardware.ramGb >= 64 ? 6 : 2,
        antiDriftScore: 95,
        e2eVerificationRate: 96,
        costEfficiencyScore: 96,
        devVelocityScore: 72,
        resilienceScore: 98,
        primaryRouting: 'Local vLLM / Ollama (DeepSeek-R1 / Llama 3.3) → Xavier2 SQLite-vec Local',
        recommendedCli: 'gitcore',
      },
      {
        id: 'tier5',
        title: '🏢 Tier 5: Enterprise Bedrock & Governance Swarm',
        tagline: 'Enrutamiento multi-cuenta Amazon Bedrock / Vertex AI + Motor GitCore CI/CD',
        description: 'Diseñado para empresas con requerimientos de gobernanza SOC2, rotación de API keys automatizada y suites de validación cruzada.',
        costEstUsd: Math.round(monthlyTokensM * 3.2),
        estLatencyMs: 280,
        concurrencyLimit: 20,
        antiDriftScore: 99,
        e2eVerificationRate: 99,
        costEfficiencyScore: 70,
        devVelocityScore: 95,
        resilienceScore: 99,
        primaryRouting: 'Amazon Bedrock / GCP Vertex AI → GitCore State Engine → Gated CI/CD',
        recommendedCli: 'gitcore',
      },
    ];

    const scored = tiers.map((tier) => {
      const budgetPenalty = tier.costEstUsd > profile.workload.budgetLimitUsd ? 18 : 0;
      const score = Math.round(
        tier.costEfficiencyScore * 0.35 +
        tier.devVelocityScore * 0.35 +
        tier.resilienceScore * 0.30 -
        budgetPenalty
      );
      return { ...tier, overallScore: Math.max(10, score) };
    });

    return scored.sort((a, b) => b.overallScore - a.overallScore);
  });

  const currentSelectedTier = $derived(simulationResults[selectedTierIndex] || simulationResults[0]);

  // Active Providers Summary String
  const activeProvidersString = $derived(
    providersList.filter((p) => p.active).map((p) => p.name).join(', ') || 'Local Ollama / OpenRouter'
  );

  // 1. MASTER SYSTEM PROMPT
  const generatedMasterPrompt = $derived.by(() => {
    const tier = currentSelectedTier;
    const p = profile;
    return `================================================================================
SWAL MASTER AGENT SYSTEM PROMPT [ARCHIVAL GRADE]
Arquitectura Asignada: ${tier.title}
Entorno de Ejecución: ${p.hardware.type.toUpperCase()} (${p.hardware.ramGb}GB RAM, ${p.hardware.gpuVramGb}GB VRAM)
Workspace: ${p.context.srcPath} | Tests: ${p.context.testPath}
================================================================================

1. DIRECTIVAS DE OPERACIÓN DETERMINISTA:
- Eres un Agente de Ingeniería de Software Autónomo Staff/Senior operando bajo el framework determinista SWAL.
- Enrutamiento Primario: ${tier.primaryRouting}
- Arnés CLI Activo: ${p.context.selectedCli.toUpperCase()}
- Política de Tokens: Micro-fragmentación de código, lecturas quirúrgicas por rango, cero reescrituras de archivos no modificados.
- Presupuesto mensual asignado: $${p.workload.budgetLimitUsd} USD (Gasto actual reportado: $${p.workload.currentMonthlySpendUsd} USD).

2. LÍMITES DE PROVEEDORES & RECURSOS:
- Proveedores Activos: ${activeProvidersString}
- Concurrencia de Tareas Paralelas: Máximo ${tier.concurrencyLimit} tareas simultáneas.
- Rate Limit Máximo: ${p.workload.rateLimitRpm} RPM.
- Modo Servicios Gratuitos: ${p.workload.useFreeTiers ? 'ACTIVO (Advertencia: ventana de contexto reducida y throttling en horas pico)' : 'INACTIVO (Prioridad a endpoints dedicados de baja latencia)'}.

3. PROTOCOLO DE SEGURIDAD & AISLAMIENTO (ISLAS DISJUNTAS):
- Regla 1 Issue → 1 Rama → 1 PR con pruebas automáticas.
- Prohibido modificar archivos fuera del alcance de la tarea.
- Cero fugas de credenciales: Toda API key se lee estrictamente de variables de entorno (${p.context.envKeys}).
- Umbral de estabilidad Anti-Drift: Mínimo ${tier.antiDriftScore}%.
- Verificación E2E obligatoria: Tasa de aprobación mínima del ${tier.e2eVerificationRate}%.`;
  });

  // 2. LIVE WEB-SEARCH AGENT PROMPT (Para Agente con Búsqueda Web en Vivo)
  const generatedWebSearchPrompt = $derived.by(() => {
    const p = profile;
    const tier = currentSelectedTier;
    return `[PROMPT DE AUDITORÍA EN TIEMPO REAL CON BÚSQUEDA WEB]
Actúa como un Consultor Senior en Infraestructura de IA y Arquitectura Agéntica.

MIS DATOS TÉCNICOS ACTUALES:
- Hardware Disponible: ${p.hardware.type} con ${p.hardware.ramGb}GB RAM y ${p.hardware.gpuVramGb}GB VRAM.
- Proveedores / APIs Activas: ${activeProvidersString}
- Gasto Mensual Actual en IA: $${p.workload.currentMonthlySpendUsd} USD/mes
- Presupuesto Máximo Objetivo: $${p.workload.budgetLimitUsd} USD/mes
- Carga de Trabajo: ~${p.workload.dailyPrompts} prompts/día (~${p.workload.dailyPrompts * 75000} tokens/mes)
- Preferencia de Servicios Gratuitos: ${p.workload.useFreeTiers ? 'Sí, quiero maximizar tiers gratuitos conociendo sus limitaciones de contexto y lentitud.' : 'No, prefiero estabilidad y velocidad de pago por uso.'}

INSTRUCCIONES DE BÚSQUEDA EN VIVO:
1. Realiza búsquedas web actualizadas al día de hoy para verificar:
   - Precios actuales por 1M de tokens (Input/Output) de Gemini 2.5 Flash, Claude 3.7 Sonnet, DeepSeek V3/R1, Groq LPU y OpenRouter.
   - Estado de disponibilidad, cuotas gratuitas y rate limits (RPM/RPD) de los servicios activos.
   - Las mejores técnicas de enrutamiento y failover en OpenRouter para ahorrar hasta un 70% sin perder calidad de código.
2. Analiza si mi gasto actual ($${p.workload.currentMonthlySpendUsd} USD) puede ser reducido sustituyendo suscripciones fijas por tokens bajo demanda o modelos locales (Ollama Qwen 2.5 / DeepSeek R1).
3. Evalúa si la arquitectura recomendada (${tier.title}) es la más óptima para mi hardware actual.
4. Genera una recomendación de actualización para mi archivo SKILL.md y mis variables de entorno con los mejores endpoints descubiertos hoy.`;
  });

  // 3. SKILL.MD TEMPLATE
  const generatedSkillMd = $derived.by(() => {
    const tier = currentSelectedTier;
    const p = profile;
    return `---
name: swal-resource-orchestrator-${p.context.selectedCli}
description: Protocolo y habilidades de desarrollo determinista optimizado para ${p.hardware.type.toUpperCase()} con ${tier.title}.
---

# SKILL: SWAL RESOURCE ORCHESTRATOR (${p.context.selectedCli.toUpperCase()})

## 1. Mapeo y Enrutamiento de Modelos
- **Tareas Simples / Lints / Lectura de Archivos**: Modelos ligeros (Gemini Flash / DeepSeek V3 / Groq LPU) o Local Ollama.
- **Arquitectura / Refactor Complejo / Razonamiento**: Claude 3.7 Sonnet / DeepSeek R1 vía OpenRouter.
- **Ruta Primaria Asignada**: \`${tier.primaryRouting}\`

## 2. Guardrails de Ejecución y Cuotas
- **Concurrencia Máxima de Tareas**: ${tier.concurrencyLimit} tareas paralelas.
- **Límite de Frecuencia**: ${p.workload.rateLimitRpm} RPM.
- **Directorio de Código**: \`${p.context.srcPath}\`
- **Directorio de Pruebas**: \`${p.context.testPath}\`

## 3. Protocolo Anti-Drift & Privacidad
- Validar tests antes de cada commit.
- Cero subida de archivos de secretos ni tokens al repositorio.
`;
  });

  // 4. SANITIZED .ENV.EXAMPLE
  const generatedEnvExample = $derived.by(() => {
    const p = profile;
    let env = `# .env.example — SWAL Local-First Simulation Framework\n`;
    env += `# 100% Generado en local en tu navegador (0% almacenamiento en servidor)\n\n`;
    env += `SWAL_SIMULATOR_VERSION=${p.version}\n`;
    env += `SWAL_SELECTED_CLI=${p.context.selectedCli}\n`;
    env += `SWAL_RATE_LIMIT_RPM=${p.workload.rateLimitRpm}\n`;
    env += `SWAL_MONTHLY_BUDGET_USD=${p.workload.budgetLimitUsd}\n\n`;
    env += `# --- Proveedores y Credenciales ---\n`;

    providersList.filter((x) => x.active).forEach((x) => {
      if (x.id === 'openrouter') env += `OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
      if (x.id === 'gemini') env += `GEMINI_API_KEY=AIzaSyXxxxxxxxxxxxxxxxxxxxxxxx\n`;
      if (x.id === 'claude') env += `ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
      if (x.id === 'openai') env += `OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
      if (x.id === 'deepseek') env += `DEEPSEEK_API_KEY=sk-ds-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
      if (x.id === 'groq') env += `GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx\n`;
      if (x.id === 'bedrock') env += `AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX\nAWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx\nAWS_REGION=us-east-1\n`;
      if (x.id === 'ollama') env += `OLLAMA_HOST=http://localhost:11434\n`;
      if (x.id === 'vllm') env += `VLLM_ENDPOINT=http://localhost:8000/v1\n`;
    });

    return env;
  });

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      showFeedback(`¡${label} copiado al portapapeles!`);
    }).catch((err) => {
      console.error('Failed to copy', err);
    });
  }

  function downloadAllArtifacts() {
    const files = [
      { name: 'MASTER_SYSTEM_PROMPT.txt', content: generatedMasterPrompt },
      { name: 'LIVE_WEBSEARCH_PROMPT.txt', content: generatedWebSearchPrompt },
      { name: 'SKILL.md', content: generatedSkillMd },
      { name: '.env.example', content: generatedEnvExample },
    ];

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    showFeedback('¡Paquete completo descargado!');
  }
</script>

<div class="max-w-6xl mx-auto px-6 py-12 space-y-12">
  <!-- Privacy & Free Community Tool Banner -->
  <div class="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
    <div class="flex flex-wrap items-center gap-2.5">
      <span class="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-accent text-black shadow-lg shadow-accent/20">
        HERRAMIENTA GRATIS · APORTE SENIOR
      </span>
      <span class="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
        🔒 100% Serverless · Privacidad Total en tu Navegador
      </span>
    </div>

    <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
      Simulador de Recursos, Gastos & Generador de Skills
    </h1>
    <p class="text-text-muted max-w-3xl text-sm md:text-base leading-relaxed">
      Audita tus proveedores, suscripciones mensuales y hardware para simular las 5 mejores configuraciones agénticas y generar prompts maestros y prompts para agentes con búsqueda web en tiempo real.
    </p>

    <!-- Toolbar: Save / Reset / Export / Import -->
    <div class="flex flex-wrap items-center gap-3 pt-4">
      <button
        onclick={saveProfile}
        class="px-4 py-2 text-xs font-bold rounded-md bg-accent text-black hover:bg-accent-light transition-all shadow-md cursor-pointer"
      >
        💾 Guardar Perfil Local
      </button>
      <button
        onclick={exportProfileJson}
        class="px-4 py-2 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        📥 Exportar JSON
      </button>
      <button
        onclick={triggerImport}
        class="px-4 py-2 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        📤 Importar JSON
      </button>
      <input
        type="file"
        accept=".json"
        bind:this={fileInputRef}
        onchange={handleImportFile}
        class="hidden"
      />
      <button
        onclick={resetProfile}
        class="px-4 py-2 text-xs font-semibold rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
      >
        🔄 Restablecer
      </button>

      {#if copyFeedback}
        <span class="text-xs text-accent font-mono animate-fade-in ml-auto">
          ✓ {copyFeedback}
        </span>
      {/if}
    </div>
  </div>

  <!-- SECTION 1: Top 20 Providers & Monthly Budget Engine -->
  <div class="bg-bg-surface-dark border border-white/10 rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
    <div class="flex items-center justify-between border-b border-white/10 pb-4">
      <h2 class="text-xl font-bold text-accent flex items-center gap-2">
        <span>⚙️</span> 1. Proveedores de IA (Top 20), Hardware & Presupuesto
      </h2>
      <span class="text-xs font-mono text-emerald-400">0% Llamadas a Servidores Externos</span>
    </div>

    <!-- Top 20 Providers Selector Grid -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">
          Selecciona tus Proveedores y APIs Activas ({providersList.filter(p => p.active).length}/{providersList.length} seleccionados)
        </h3>
        <span class="text-[11px] text-text-muted">Haz clic para activar o desactivar</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1 border border-white/5 rounded-lg bg-black/20">
        {#each providersList as p}
          <button
            type="button"
            onclick={() => toggleProvider(p.id)}
            class="flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer {p.active ? 'border-accent/60 bg-accent/10 text-white' : 'border-white/5 bg-black/40 text-text-muted hover:border-white/20'}"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="w-3.5 h-3.5 rounded border flex items-center justify-center {p.active ? 'border-accent bg-accent text-black text-[9px] font-bold' : 'border-white/20'}">
                {p.active ? '✓' : ''}
              </span>
              <span class="text-xs font-medium truncate">{p.name}</span>
            </div>
            <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ml-1 {p.category === 'local' ? 'bg-emerald-500/20 text-emerald-300' : p.category === 'router' ? 'bg-indigo-500/20 text-indigo-300' : p.category === 'free' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}">
              {p.category}
            </span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Hardware & Monthly Spending Details -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
      <!-- Hardware -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">Hardware & Computo</h3>
        <div>
          <label class="block text-xs text-text-muted mb-1">Entorno Principal</label>
          <select
            bind:value={profile.hardware.type}
            onchange={saveProfile}
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-2 text-xs text-white focus:border-accent focus:outline-none cursor-pointer"
          >
            <option value="mac_studio">Apple Silicon Mac (M1/M2/M3/M4 Studio/Pro)</option>
            <option value="gpu_high">Workstation Linux con GPU (NVIDIA RTX / CUDA)</option>
            <option value="vps_linux">VPS Linux Cloud (Ubuntu / Debian / NixOS)</option>
            <option value="cpu_only">Laptop / PC Estándar (CPU-Only)</option>
            <option value="cloud_ec2">Instancias Dedicadas AWS EC2 / GCP</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] text-text-muted mb-1">RAM (GB): <span class="text-accent font-mono">{profile.hardware.ramGb}</span></label>
            <input type="number" bind:value={profile.hardware.ramGb} onchange={saveProfile} min="8" max="512" class="w-full bg-black/40 border border-white/15 rounded px-2 py-1 text-xs text-white" />
          </div>
          <div>
            <label class="block text-[11px] text-text-muted mb-1">VRAM GPU (GB): <span class="text-accent font-mono">{profile.hardware.gpuVramGb}</span></label>
            <input type="number" bind:value={profile.hardware.gpuVramGb} onchange={saveProfile} min="0" max="192" class="w-full bg-black/40 border border-white/15 rounded px-2 py-1 text-xs text-white" />
          </div>
        </div>
      </div>

      <!-- Monthly Spending & Subscriptions -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">Gastos & Suscripciones Actuales</h3>
        <div>
          <label class="block text-xs text-text-muted mb-1">Gasto Actual Estimado ($/mes)</label>
          <input
            type="number"
            bind:value={profile.workload.currentMonthlySpendUsd}
            onchange={saveProfile}
            min="0"
            max="2000"
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-2 text-xs text-accent font-bold font-mono focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs text-text-muted mb-1">Presupuesto Máximo Objetivo ($/mes)</label>
          <input
            type="number"
            bind:value={profile.workload.budgetLimitUsd}
            onchange={saveProfile}
            min="0"
            max="2000"
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-2 text-xs text-emerald-400 font-bold font-mono focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <!-- Free Tier Mode & Workload -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">Carga Diaria & Modo Gratuito</h3>
        <div>
          <div class="flex justify-between text-xs text-text-muted mb-1">
            <span>Prompts / Tareas por Día:</span>
            <span class="text-accent font-mono font-bold">{profile.workload.dailyPrompts}</span>
          </div>
          <input
            type="range"
            min="10"
            max="800"
            step="10"
            bind:value={profile.workload.dailyPrompts}
            onchange={saveProfile}
            class="w-full accent-accent bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Free Tiers Toggle with Trade-off Warning -->
        <div class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2">
          <label class="flex items-center gap-2.5 text-xs text-amber-200 font-medium cursor-pointer">
            <input
              type="checkbox"
              bind:checked={profile.workload.useFreeTiers}
              onchange={saveProfile}
              class="accent-amber-400 w-4 h-4"
            />
            Habilitar Enfoque 100% Free-Tiers
          </label>
          {#if profile.workload.useFreeTiers}
            <p class="text-[10px] text-amber-300/80 leading-relaxed">
              ⚠️ <strong>Advertencia de Trade-off:</strong> Los tiers gratuitos están sujetos a ventanas de contexto cortas (8k–32k tokens), límites estrictos de RPM/RPD y tiempos de espera o saturación en horas pico.
            </p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Paths and Harness Selection -->
    <div class="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
      <div>
        <label class="block text-text-muted mb-1 font-mono">Directorio Código</label>
        <input type="text" bind:value={profile.context.srcPath} onchange={saveProfile} class="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 font-mono text-white" />
      </div>
      <div>
        <label class="block text-text-muted mb-1 font-mono">Directorio Pruebas</label>
        <input type="text" bind:value={profile.context.testPath} onchange={saveProfile} class="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 font-mono text-white" />
      </div>
      <div>
        <label class="block text-text-muted mb-1 font-mono">Arnés CLI Activo</label>
        <select bind:value={profile.context.selectedCli} onchange={saveProfile} class="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 font-mono text-white cursor-pointer">
          <option value="jules">Google Jules Swarm</option>
          <option value="hermes">Hermes Gateway</option>
          <option value="openclaw">OpenClaw Browser</option>
          <option value="gitcore">GitCore Deterministic Engine</option>
        </select>
      </div>
      <div>
        <label class="block text-text-muted mb-1 font-mono">Docs / Repo URL</label>
        <input type="text" bind:value={profile.context.docsUrl} onchange={saveProfile} class="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 font-mono text-white" />
      </div>
    </div>
  </div>

  <!-- SECTION 2: Top 5 Configuration Ranking Engine -->
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-accent flex items-center gap-2">
        <span>📊</span> 2. Simulación de Escenarios Paramétricos (Top 5 Tiers)
      </h2>
      <span class="text-xs font-mono text-text-muted">Optimizando Costo vs. Velocidad</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {#each simulationResults as result, idx}
        <button
          onclick={() => (selectedTierIndex = idx)}
          class="text-left bg-bg-surface-dark border rounded-xl p-5 transition-all space-y-3 relative overflow-hidden group cursor-pointer {selectedTierIndex === idx ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10' : 'border-white/10 hover:border-white/20'}"
        >
          {#if idx === 0}
            <div class="absolute top-0 right-0 bg-accent text-black font-extrabold text-[10px] px-2 py-0.5 rounded-bl">
              TOP 1 RECOMENDADO
            </div>
          {/if}

          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-text-muted">Rank #{idx + 1}</span>
            <span class="text-lg font-extrabold font-mono text-accent">{result.overallScore}<span class="text-xs text-text-muted">/100</span></span>
          </div>

          <h3 class="font-bold text-sm text-white line-clamp-2">{result.title}</h3>
          <p class="text-xs text-text-muted line-clamp-2">{result.tagline}</p>

          <div class="space-y-1.5 pt-2 border-t border-white/10 text-[11px]">
            <div class="flex justify-between">
              <span class="text-text-muted">Costo Est.:</span>
              <span class="font-mono text-white font-semibold">${result.costEstUsd}/mes</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-muted">Concurrencia:</span>
              <span class="font-mono text-white">{result.concurrencyLimit} tareas</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-muted">Anti-Drift:</span>
              <span class="font-mono text-accent">{result.antiDriftScore}%</span>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- Active Tier Card Details -->
    <div class="bg-bg-surface-dark border border-accent/30 rounded-xl p-6 md:p-8 space-y-6 shadow-2xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">Configuración Activa Seleccionada</span>
          <h3 class="text-2xl font-bold text-white mt-1">{currentSelectedTier.title}</h3>
          <p class="text-sm text-text-muted mt-1">{currentSelectedTier.description}</p>
        </div>
        <div class="flex items-center gap-4 bg-black/40 border border-white/10 rounded-lg p-3">
          <div class="text-center px-2">
            <span class="text-[10px] text-text-muted uppercase block">Latencia</span>
            <span class="text-sm font-bold font-mono text-white">{currentSelectedTier.estLatencyMs} ms</span>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="text-center px-2">
            <span class="text-[10px] text-text-muted uppercase block">Verificación</span>
            <span class="text-sm font-bold font-mono text-accent">{currentSelectedTier.e2eVerificationRate}%</span>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="text-center px-2">
            <span class="text-[10px] text-text-muted uppercase block">Puntuación</span>
            <span class="text-sm font-bold font-mono text-accent">{currentSelectedTier.overallScore}/100</span>
          </div>
        </div>
      </div>

      <!-- Comparative Progress Meters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted">Eficiencia de Costo</span>
            <span class="font-mono text-white font-bold">{currentSelectedTier.costEfficiencyScore}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-400 h-full transition-all duration-500" style="width: {currentSelectedTier.costEfficiencyScore}%"></div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted">Velocidad de Desarrollo</span>
            <span class="font-mono text-white font-bold">{currentSelectedTier.devVelocityScore}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-accent h-full transition-all duration-500" style="width: {currentSelectedTier.devVelocityScore}%"></div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted">Calidad & Resiliencia Anti-Drift</span>
            <span class="font-mono text-white font-bold">{currentSelectedTier.resilienceScore}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-indigo-400 h-full transition-all duration-500" style="width: {currentSelectedTier.resilienceScore}%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 3: Generator Tabs (Master Prompt, Live Search Prompt, SKILL.md, .env) -->
  <div class="bg-bg-surface-dark border border-white/10 rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div>
        <h2 class="text-xl font-bold text-accent flex items-center gap-2">
          <span>🛠️</span> 3. Generador de Prompts, Skills & Variables (.env)
        </h2>
        <p class="text-xs text-text-muted mt-1">Generación determinista adaptada a tus proveedores y límites</p>
      </div>
      <button
        onclick={downloadAllArtifacts}
        class="px-5 py-2 text-xs font-bold rounded-md bg-accent text-black hover:bg-accent-light transition-all shadow-lg flex items-center gap-2 self-start md:self-auto cursor-pointer"
      >
        <span>📦</span> Descargar Todos los Artefactos
      </button>
    </div>

    <!-- Tabs Header -->
    <div class="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
      <button
        onclick={() => activeTab = 'sim'}
        class="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer {activeTab === 'sim' ? 'bg-accent text-black' : 'bg-white/5 text-text-muted hover:text-white'}"
      >
        📜 Master System Prompt
      </button>
      <button
        onclick={() => activeTab = 'websearch'}
        class="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer {activeTab === 'websearch' ? 'bg-emerald-400 text-black' : 'bg-white/5 text-text-muted hover:text-white'}"
      >
        🌐 Prompt con Búsqueda Web en Vivo
      </button>
      <button
        onclick={() => activeTab = 'skill'}
        class="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer {activeTab === 'skill' ? 'bg-indigo-400 text-black' : 'bg-white/5 text-text-muted hover:text-white'}"
      >
        ⚡ Custom SKILL.md
      </button>
      <button
        onclick={() => activeTab = 'env'}
        class="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer {activeTab === 'env' ? 'bg-sky-400 text-black' : 'bg-white/5 text-text-muted hover:text-white'}"
      >
        🔒 .env.example Sanitizado
      </button>
    </div>

    <!-- TAB 1: Master System Prompt -->
    {#if activeTab === 'sim'}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs text-text-muted">
            Inyéctalo como system prompt en <strong>Claude Code, Antigravity, OpenCode, Cursor</strong> o tus agentes CLI:
          </p>
          <button
            onclick={() => copyToClipboard(generatedMasterPrompt, 'Master System Prompt')}
            class="px-3 py-1 text-xs font-semibold rounded bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-all cursor-pointer"
          >
            📋 Copiar Prompt
          </button>
        </div>
        <pre class="bg-black/60 border border-white/10 rounded-lg p-4 text-xs font-mono text-accent-light overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">{generatedMasterPrompt}</pre>
      </div>
    {/if}

    <!-- TAB 2: Live Web Search Optimization Prompt -->
    {#if activeTab === 'websearch'}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs text-emerald-300">
            💡 Pega este prompt en un agente con <strong>acceso a búsqueda web en vivo</strong> (Gemini con Search, Perplexity, Claude con Search, ChatGPT Search o OpenClaw) para obtener una auditoría de precios y disponibilidad al día de hoy:
          </p>
          <button
            onclick={() => copyToClipboard(generatedWebSearchPrompt, 'Prompt con Búsqueda Web')}
            class="px-3 py-1 text-xs font-semibold rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer"
          >
            📋 Copiar Prompt de Búsqueda Web
          </button>
        </div>
        <pre class="bg-black/60 border border-emerald-500/20 rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">{generatedWebSearchPrompt}</pre>
      </div>
    {/if}

    <!-- TAB 3: SKILL.md -->
    {#if activeTab === 'skill'}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs text-text-muted">
            Guarda este archivo como <code>SKILL.md</code> en el directorio de skills de tu arnés o agente:
          </p>
          <button
            onclick={() => copyToClipboard(generatedSkillMd, 'SKILL.md')}
            class="px-3 py-1 text-xs font-semibold rounded bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-all cursor-pointer"
          >
            📋 Copiar SKILL.md
          </button>
        </div>
        <pre class="bg-black/60 border border-white/10 rounded-lg p-4 text-xs font-mono text-indigo-300 overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">{generatedSkillMd}</pre>
      </div>
    {/if}

    <!-- TAB 4: .env.example -->
    {#if activeTab === 'env'}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs text-text-muted">
            Configuración sanitizada de variables de entorno lista para tus agentes:
          </p>
          <button
            onclick={() => copyToClipboard(generatedEnvExample, '.env.example')}
            class="px-3 py-1 text-xs font-semibold rounded bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-all cursor-pointer"
          >
            📋 Copiar .env.example
          </button>
        </div>
        <pre class="bg-black/60 border border-white/10 rounded-lg p-4 text-xs font-mono text-sky-300 overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">{generatedEnvExample}</pre>
      </div>
    {/if}
  </div>
</div>
