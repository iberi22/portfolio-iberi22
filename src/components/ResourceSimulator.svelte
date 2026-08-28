<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '../i18n/index';

  interface ProviderState {
    openai: boolean;
    anthropic: boolean;
    gemini: boolean;
    openrouter: boolean;
    bedrock: boolean;
    localModels: boolean;
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
    providers: ProviderState;
    hardware: HardwareState;
    workload: WorkloadState;
    context: ContextState;
  }

  const defaultProfile: UserProfile = {
    version: '1.0.0',
    providers: {
      openai: true,
      anthropic: true,
      gemini: true,
      openrouter: true,
      bedrock: false,
      localModels: true,
    },
    hardware: {
      type: 'mac_studio',
      ramGb: 64,
      gpuVramGb: 24,
    },
    workload: {
      dailyPrompts: 350,
      repoSizeMb: 120,
      rateLimitRpm: 60,
      budgetLimitUsd: 150,
    },
    context: {
      srcPath: './src',
      testPath: './tests',
      docsUrl: 'https://github.com/iberi22/portfolio-iberi22',
      envKeys: 'OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY',
      selectedCli: 'jules',
    },
  };

  let profile = $state<UserProfile>(JSON.parse(JSON.stringify(defaultProfile)));
  let selectedTierIndex = $state<number>(0);
  let copyFeedback = $state<string | null>(null);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  const STORAGE_KEY = 'swal_sim_profiles';

  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        profile = { ...defaultProfile, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage', e);
    }
  });

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }

  function resetProfile() {
    profile = JSON.parse(JSON.stringify(defaultProfile));
    saveProfile();
  }

  function exportProfileJson() {
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
          saveProfile();
          showFeedback('Profile imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
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
    const p = profile;
    const totalDailyTokens = p.workload.dailyPrompts * 1200; // estimated tokens per prompt cycle
    const monthlyTokensM = (totalDailyTokens * 30) / 1000000;

    // Tiers Definition
    const tiers = [
      {
        id: 'tier1',
        title: '💰 Tier 1: Ultra-Cost Optimizer',
        tagline: 'Ollama local planning & unit tests + OpenRouter/DeepSeek fallback for core logic',
        description: 'Maximizes zero-cost local inference for repetitive context parsing, using cheap high-efficiency models for synthesis.',
        costEstUsd: Math.min(p.workload.budgetLimitUsd, Math.round(monthlyTokensM * 0.45)),
        estLatencyMs: 850,
        concurrencyLimit: 4,
        antiDriftScore: 88,
        e2eVerificationRate: 92,
        costEfficiencyScore: 98,
        devVelocityScore: 72,
        resilienceScore: 86,
        primaryRouting: 'Local Ollama (Qwen2.5/Llama3) → OpenRouter (DeepSeek-V3)',
        recommendedCli: 'openclaw',
      },
      {
        id: 'tier2',
        title: '⚡ Tier 2: Maximum Velocity (Wave Parallelism)',
        tagline: 'High-concurrency cloud agent swarms with Google Jules (15 parallel tasks) + Gemini Pro/Flash',
        description: 'Optimized for rapid feature delivery via parallelized task waves, sub-second API execution, and high rate-limit throughput.',
        costEstUsd: Math.round(monthlyTokensM * 2.8),
        estLatencyMs: 220,
        concurrencyLimit: 15,
        antiDriftScore: 91,
        e2eVerificationRate: 95,
        costEfficiencyScore: 74,
        devVelocityScore: 99,
        resilienceScore: 90,
        primaryRouting: 'Google Jules 15-Wave Parallel Task Engine → Gemini Flash 1.5 / Gemini Pro',
        recommendedCli: 'jules',
      },
      {
        id: 'tier3',
        title: '⚖️ Tier 3: Balanced Hybrid Orchestrator',
        tagline: 'Cloud orchestrator (Hermes / Claude) + local workers for deterministic test runs and linting',
        description: 'Best-of-both-worlds approach combining high-reasoning cloud leads with local isolated execution environments.',
        costEstUsd: Math.round(monthlyTokensM * 1.5),
        estLatencyMs: 420,
        concurrencyLimit: 8,
        antiDriftScore: 96,
        e2eVerificationRate: 98,
        costEfficiencyScore: 88,
        devVelocityScore: 89,
        resilienceScore: 95,
        primaryRouting: 'Claude 3.5 Sonnet / Hermes Gateway Orchestrator → Local Docker Verification Sandbox',
        recommendedCli: 'hermes',
      },
      {
        id: 'tier4',
        title: '🛡️ Tier 4: Sovereign Local-First & Privacy',
        tagline: '100% on-premise execution with zero cloud API leaks, local vector DB (Xavier/SQLite-vec), and strict sandboxing',
        description: 'Guarantees zero outbound data leakage. Operates purely on local GPU hardware with deterministic memory cores.',
        costEstUsd: 0,
        estLatencyMs: 1100,
        concurrencyLimit: 3,
        antiDriftScore: 94,
        e2eVerificationRate: 96,
        costEfficiencyScore: 95,
        devVelocityScore: 68,
        resilienceScore: 98,
        primaryRouting: 'Local vLLM / Ollama → Xavier2 Memory Core + SQLite-vec Sandbox',
        recommendedCli: 'gitcore',
      },
      {
        id: 'tier5',
        title: '🏢 Tier 5: Enterprise High-Throughput',
        tagline: 'Multi-account Bedrock/Vertex routing with GitCore CI/CD state engine and formal acceptance gating',
        description: 'Designed for enterprise pipelines with compliance requirements, multi-region key failover, and strict PR acceptance gating.',
        costEstUsd: Math.round(monthlyTokensM * 3.4),
        estLatencyMs: 310,
        concurrencyLimit: 20,
        antiDriftScore: 99,
        e2eVerificationRate: 99,
        costEfficiencyScore: 68,
        devVelocityScore: 94,
        resilienceScore: 99,
        primaryRouting: 'Amazon Bedrock / GCP Vertex AI → GitCore State Engine → CI/CD Gated Pipelines',
        recommendedCli: 'gitcore',
      },
    ];

    // Compute composite overall score
    const scoredTiers = tiers.map((tier) => {
      // Weighting: Cost (35%), Velocity (35%), Resilience & Quality (30%)
      const budgetPenalty = tier.costEstUsd > p.workload.budgetLimitUsd ? 15 : 0;
      const overallScore = Math.round(
        tier.costEfficiencyScore * 0.35 +
        tier.devVelocityScore * 0.35 +
        tier.resilienceScore * 0.30 -
        budgetPenalty
      );
      return { ...tier, overallScore: Math.max(10, overallScore) };
    });

    // Sort descending by overall score
    return scoredTiers.sort((a, b) => b.overallScore - a.overallScore);
  });

  const currentSelectedTier = $derived(simulationResults[selectedTierIndex] || simulationResults[0]);

  // Generators for Prompt, Skill, and .env
  const generatedMasterPrompt = $derived.by(() => {
    const tier = currentSelectedTier;
    const p = profile;
    return `================================================================================
SWAL MASTER AGENT SYSTEM PROMPT [ARCHIVAL GRADE]
Generated for Architecture: ${tier.title}
Target Repository: ${p.context.srcPath} | Test Suite: ${p.context.testPath}
================================================================================

1. CORE SYSTEM DIRECTIVE & OPERATIONAL RULES:
- You are an autonomous software engineering agent operating under the SWAL deterministic execution framework.
- Preferred Routing: ${tier.primaryRouting}
- Active CLI Harness: ${p.context.selectedCli.toUpperCase()}
- Strictly limit token usage by avoiding redundant code snippets. Only emit surgical diffs or disjoint file updates.
- Workload Profile: ~${p.workload.dailyPrompts} prompts/day, Repository footprint ~${p.workload.repoSizeMb}MB.

2. BOUNDARIES & TOKEN CONSERVATION:
- Do NOT rewrite existing unmodified functions. Use precise file references.
- Documentation Link: ${p.context.docsUrl}
- Environment Variable Guardrails: Mandatory validation of keys (${p.context.envKeys}) prior to execution.

3. QUALITY & RESILIENCE CONSTRAINTS:
- Minimum Target E2E Test Pass Rate: ${tier.e2eVerificationRate}%
- Anti-Drift Threshold: ${tier.antiDriftScore}% code stability score.
- Concurrency limit: ${tier.concurrencyLimit} parallel execution waves.

4. EXECUTION PROTOCOL:
  Step 1: Read requirements and local codebase context.
  Step 2: Propose execution plan with precise verification steps.
  Step 3: Execute modifications local-first with mandatory automated verification.
  Step 4: Formally close issue only when all verification gates pass.`;
  });

  const generatedSkillMd = $derived.by(() => {
    const tier = currentSelectedTier;
    const p = profile;
    return `# SKILL.md — Custom Agent Skill Template

## Name: swal-resource-orchestrator-${p.context.selectedCli}
Description: Custom skill for executing agentic pipelines under the ${tier.title} configuration.

### System Configuration
- **Selected CLI**: ${p.context.selectedCli.toUpperCase()}
- **Concurrency Wave Limit**: ${tier.concurrencyLimit}
- **Primary Model Pipeline**: ${tier.primaryRouting}
- **Local Sandbox Path**: ${p.context.srcPath}
- **Test Sandbox Path**: ${p.context.testPath}

### Instructions for Agent:
1. **Pre-flight Inspection**: Verify local environment variables from sanitized configuration.
2. **Context Indexing**: Inspect repository (${p.workload.repoSizeMb} MB) without overwhelming prompt context windows.
3. **Task Wave Execution**: Run parallel sub-tasks adhering to a max rate limit of ${p.workload.rateLimitRpm} RPM.
4. **Deterministic Validation**: Execute tests in \`${p.context.testPath}\` and confirm 0 failure regression before submission.
5. **Telemetry & Privacy**: Ensure zero sensitive credentials or code payloads leave local-first boundary.`;
  });

  const generatedEnvExample = $derived.by(() => {
    const p = profile;
    const keysArray = p.context.envKeys.split(',').map((k) => k.trim()).filter(Boolean);
    let envContent = `# Sanitized .env.example — SWAL Simulation Framework
# Generated local-first (0% server storage)

SWAL_SIMULATOR_VERSION=${p.version}
SWAL_SELECTED_CLI=${p.context.selectedCli}
SWAL_RATE_LIMIT_RPM=${p.workload.rateLimitRpm}
SWAL_MONTHLY_BUDGET_USD=${p.workload.budgetLimitUsd}

# Provider Endpoints & Guardrails
`;

    if (p.providers.openai) envContent += `OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
    if (p.providers.anthropic) envContent += `ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
    if (p.providers.gemini) envContent += `GEMINI_API_KEY=AIzaSyXxxxxxxxxxxxxxxxxxxxxxxx\n`;
    if (p.providers.openrouter) envContent += `OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx\n`;
    if (p.providers.bedrock) {
      envContent += `AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX\nAWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx\nAWS_REGION=us-east-1\n`;
    }
    if (p.providers.localModels) {
      envContent += `OLLAMA_HOST=http://localhost:11434\nVLLM_ENDPOINT=http://localhost:8000/v1\n`;
    }

    keysArray.forEach((key) => {
      if (!envContent.includes(key)) {
        envContent += `${key}=placeholder_value_here\n`;
      }
    });

    return envContent;
  });

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      showFeedback(`${label} copied to clipboard!`);
    }).catch((err) => {
      console.error('Failed to copy', err);
    });
  }

  function downloadAllArtifacts() {
    const zipData = [
      { name: 'MASTER_SYSTEM_PROMPT.txt', content: generatedMasterPrompt },
      { name: 'SKILL.md', content: generatedSkillMd },
      { name: '.env.example', content: generatedEnvExample },
    ];

    zipData.forEach((file) => {
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

    showFeedback('Artifact files downloaded!');
  }
</script>

<div class="max-w-6xl mx-auto px-6 py-12 space-y-12">
  <!-- Header Banner -->
  <div class="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold">
      <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
      {t('simulator.badge')}
    </div>
    <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
      {t('simulator.title')}
    </h1>
    <p class="text-text-muted max-w-3xl text-sm md:text-base leading-relaxed">
      {t('simulator.subtitle')}
    </p>

    <!-- Toolbar: Save / Reset / Export / Import -->
    <div class="flex flex-wrap items-center gap-3 pt-4">
      <button
        onclick={saveProfile}
        class="px-4 py-2 text-xs font-bold rounded-md bg-accent text-black hover:bg-accent-light transition-all shadow-md"
      >
        💾 Save Profile
      </button>
      <button
        onclick={exportProfileJson}
        class="px-4 py-2 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
      >
        📥 {t('simulator.exportProfile')}
      </button>
      <button
        onclick={triggerImport}
        class="px-4 py-2 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
      >
        📤 {t('simulator.importProfile')}
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
        class="px-4 py-2 text-xs font-semibold rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
      >
        🔄 {t('simulator.resetDefaults')}
      </button>

      {#if copyFeedback}
        <span class="text-xs text-accent font-mono animate-fade-in ml-auto">
          ✓ {copyFeedback}
        </span>
      {/if}
    </div>
  </div>

  <!-- SECTION 1: Input Engine -->
  <div class="bg-bg-surface-dark border border-white/10 rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
    <div class="flex items-center justify-between border-b border-white/10 pb-4">
      <h2 class="text-xl font-bold text-accent flex items-center gap-2">
        <span>⚙️</span> {t('simulator.sectionResources')}
      </h2>
      <span class="text-xs font-mono text-text-muted">Local-First Storage Active</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Providers Checkboxes -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">1. AI Providers & APIs</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-3 text-sm cursor-pointer text-white/90 hover:text-white">
            <input type="checkbox" bind:checked={profile.providers.openai} onchange={saveProfile} class="accent-accent w-4 h-4" />
            OpenAI API (GPT-4o, o3-mini)
          </label>
          <label class="flex items-center gap-3 text-sm cursor-pointer text-white/90 hover:text-white">
            <input type="checkbox" bind:checked={profile.providers.anthropic} onchange={saveProfile} class="accent-accent w-4 h-4" />
            Anthropic (Claude 3.5 Sonnet)
          </label>
          <label class="flex items-center gap-3 text-sm cursor-pointer text-white/90 hover:text-white">
            <input type="checkbox" bind:checked={profile.providers.gemini} onchange={saveProfile} class="accent-accent w-4 h-4" />
            Google Gemini (1.5 Flash / Pro)
          </label>
          <label class="flex items-center gap-3 text-sm cursor-pointer text-white/90 hover:text-white">
            <input type="checkbox" bind:checked={profile.providers.openrouter} onchange={saveProfile} class="accent-accent w-4 h-4" />
            OpenRouter (DeepSeek / Meta)
          </label>
          <label class="flex items-center gap-3 text-sm cursor-pointer text-white/90 hover:text-white">
            <input type="checkbox" bind:checked={profile.providers.bedrock} onchange={saveProfile} class="accent-accent w-4 h-4" />
            Amazon Bedrock / GCP Vertex
          </label>
          <label class="flex items-center gap-3 text-sm cursor-pointer text-white/90 hover:text-white">
            <input type="checkbox" bind:checked={profile.providers.localModels} onchange={saveProfile} class="accent-accent w-4 h-4" />
            Local LLMs (Ollama / vLLM)
          </label>
        </div>
      </div>

      <!-- Hardware Profile Selectors -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">2. Available Hardware</h3>
        <div>
          <label class="block text-xs text-text-muted mb-1">Compute Infrastructure</label>
          <select
            bind:value={profile.hardware.type}
            onchange={saveProfile}
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          >
            <option value="mac_studio">Apple Silicon Mac Studio (M-Series)</option>
            <option value="gpu_high">Local Workstation GPU (RTX 4090 / 3090)</option>
            <option value="cpu_only">Standard PC / Laptop (CPU-only)</option>
            <option value="vps_linux">VPS Linux (Debian / NixOS)</option>
            <option value="cloud_ec2">Cloud Compute (AWS EC2 / GCP)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label class="block text-xs text-text-muted mb-1">System RAM (GB)</label>
            <input
              type="number"
              bind:value={profile.hardware.ramGb}
              onchange={saveProfile}
              min="8"
              max="512"
              class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs text-text-muted mb-1">GPU VRAM (GB)</label>
            <input
              type="number"
              bind:value={profile.hardware.gpuVramGb}
              onchange={saveProfile}
              min="0"
              max="192"
              class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Workload Sliders -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">3. Workload & Limits</h3>

        <div>
          <div class="flex justify-between text-xs text-text-muted mb-1">
            <span>Daily Prompt Load:</span>
            <span class="text-accent font-mono font-bold">{profile.workload.dailyPrompts} prompts/day</span>
          </div>
          <input
            type="range"
            min="20"
            max="2000"
            step="10"
            bind:value={profile.workload.dailyPrompts}
            onchange={saveProfile}
            class="w-full accent-accent bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div class="flex justify-between text-xs text-text-muted mb-1">
            <span>Repo Size:</span>
            <span class="text-accent font-mono font-bold">{profile.workload.repoSizeMb} MB</span>
          </div>
          <input
            type="range"
            min="10"
            max="2000"
            step="10"
            bind:value={profile.workload.repoSizeMb}
            onchange={saveProfile}
            class="w-full accent-accent bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div class="flex justify-between text-xs text-text-muted mb-1">
            <span>Monthly Budget Cap:</span>
            <span class="text-accent font-mono font-bold">${profile.workload.budgetLimitUsd} USD</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            bind:value={profile.workload.budgetLimitUsd}
            onchange={saveProfile}
            class="w-full accent-accent bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>

    <!-- Repository & Pipeline Context -->
    <div class="border-t border-white/10 pt-6 space-y-4">
      <h3 class="text-xs uppercase tracking-wider text-text-muted font-bold">4. Pipeline & Context Inputs</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-text-muted mb-1">Source Path</label>
          <input
            type="text"
            bind:value={profile.context.srcPath}
            onchange={saveProfile}
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs text-text-muted mb-1">Test Path</label>
          <input
            type="text"
            bind:value={profile.context.testPath}
            onchange={saveProfile}
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs text-text-muted mb-1">Documentation URL</label>
          <input
            type="text"
            bind:value={profile.context.docsUrl}
            onchange={saveProfile}
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs text-text-muted mb-1">Target CLI Harness</label>
          <select
            bind:value={profile.context.selectedCli}
            onchange={saveProfile}
            class="w-full bg-black/40 border border-white/15 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:border-accent focus:outline-none"
          >
            <option value="jules">Google Jules CLI</option>
            <option value="hermes">Hermes Agent Gateway</option>
            <option value="openclaw">OpenClaw CLI</option>
            <option value="gitcore">GitCore CLI Engine</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 2: Top 5 Configuration Ranking Engine -->
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-accent flex items-center gap-2">
        <span>📊</span> {t('simulator.sectionSimulations')}
      </h2>
      <span class="text-xs font-mono text-text-muted">Ranked by SWAL Parametric Scoring</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {#each simulationResults as result, idx}
        <button
          onclick={() => (selectedTierIndex = idx)}
          class="text-left bg-bg-surface-dark border rounded-xl p-5 transition-all space-y-3 relative overflow-hidden group cursor-pointer {selectedTierIndex === idx ? 'border-accent bg-accent/5' : 'border-white/10'}"
        >
          {#if idx === 0}
            <div class="absolute top-0 right-0 bg-accent text-black font-extrabold text-[10px] px-2 py-0.5 rounded-bl">
              TOP 1 RECOMMENDATION
            </div>
          {/if}

          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-text-muted">Rank #{idx + 1}</span>
            <span class="text-lg font-extrabold font-mono text-accent">{result.overallScore}<span class="text-xs text-text-muted">/100</span></span>
          </div>

          <h3 class="font-bold text-sm text-white line-clamp-2">{result.title}</h3>
          <p class="text-xs text-text-muted line-clamp-3">{result.tagline}</p>

          <div class="space-y-1.5 pt-2 border-t border-white/10 text-[11px]">
            <div class="flex justify-between">
              <span class="text-text-muted">Est. Cost:</span>
              <span class="font-mono text-white font-semibold">${result.costEstUsd}/mo</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-muted">Parallelism:</span>
              <span class="font-mono text-white">{result.concurrencyLimit} tasks</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-muted">Anti-Drift:</span>
              <span class="font-mono text-accent">{result.antiDriftScore}%</span>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- Selected Architecture Details & Charts -->
    <div class="bg-bg-surface-dark border border-accent/30 rounded-xl p-6 md:p-8 space-y-6 shadow-2xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">Active Selection Matrix</span>
          <h3 class="text-2xl font-bold text-white mt-1">{currentSelectedTier.title}</h3>
          <p class="text-sm text-text-muted mt-1">{currentSelectedTier.description}</p>
        </div>
        <div class="flex items-center gap-4 bg-black/40 border border-white/10 rounded-lg p-3">
          <div class="text-center px-2">
            <span class="text-[10px] text-text-muted uppercase block">Latency</span>
            <span class="text-sm font-bold font-mono text-white">{currentSelectedTier.estLatencyMs} ms</span>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="text-center px-2">
            <span class="text-[10px] text-text-muted uppercase block">E2E Verification</span>
            <span class="text-sm font-bold font-mono text-accent">{currentSelectedTier.e2eVerificationRate}%</span>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="text-center px-2">
            <span class="text-[10px] text-text-muted uppercase block">Composite</span>
            <span class="text-sm font-bold font-mono text-accent">{currentSelectedTier.overallScore}/100</span>
          </div>
        </div>
      </div>

      <!-- Comparative Progress Meters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted">Cost Efficiency</span>
            <span class="font-mono text-white font-bold">{currentSelectedTier.costEfficiencyScore}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-400 h-full transition-all duration-500" style="width: {currentSelectedTier.costEfficiencyScore}%"></div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted">Development Velocity</span>
            <span class="font-mono text-white font-bold">{currentSelectedTier.devVelocityScore}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-accent h-full transition-all duration-500" style="width: {currentSelectedTier.devVelocityScore}%"></div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted">Quality & Resilience</span>
            <span class="font-mono text-white font-bold">{currentSelectedTier.resilienceScore}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div class="bg-indigo-400 h-full transition-all duration-500" style="width: {currentSelectedTier.resilienceScore}%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 3: Custom Skill, Master System Prompt & .env Generator -->
  <div class="bg-bg-surface-dark border border-white/10 rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div>
        <h2 class="text-xl font-bold text-accent flex items-center gap-2">
          <span>🛠️</span> {t('simulator.sectionArtifacts')}
        </h2>
        <p class="text-xs text-text-muted mt-1">Generated dynamically for the selected architecture and local context</p>
      </div>
      <button
        onclick={downloadAllArtifacts}
        class="px-5 py-2 text-xs font-bold rounded-md bg-accent text-black hover:bg-accent-light transition-all shadow-lg flex items-center gap-2 self-start md:self-auto"
      >
        <span>📦</span> {t('simulator.downloadAll')}
      </button>
    </div>

    <div class="space-y-8">
      <!-- Master Agent System Prompt -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>📜</span> Master System Prompt
          </h3>
          <button
            onclick={() => copyToClipboard(generatedMasterPrompt, 'Master System Prompt')}
            class="px-3 py-1 text-xs font-semibold rounded bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-all"
          >
            📋 {t('simulator.copyPrompt')}
          </button>
        </div>
        <pre class="bg-black/60 border border-white/10 rounded-lg p-4 text-xs font-mono text-accent-light overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap">{generatedMasterPrompt}</pre>
      </div>

      <!-- SKILL.md Template -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>⚡</span> Agent Skill Template (SKILL.md)
          </h3>
          <button
            onclick={() => copyToClipboard(generatedSkillMd, 'SKILL.md')}
            class="px-3 py-1 text-xs font-semibold rounded bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-all"
          >
            📋 {t('simulator.copySkill')}
          </button>
        </div>
        <pre class="bg-black/60 border border-white/10 rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap">{generatedSkillMd}</pre>
      </div>

      <!-- Sanitized .env.example -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>🔒</span> Sanitized Environment Blueprint (.env.example)
          </h3>
          <button
            onclick={() => copyToClipboard(generatedEnvExample, '.env.example')}
            class="px-3 py-1 text-xs font-semibold rounded bg-white/5 border border-white/15 text-white hover:bg-white/15 transition-all"
          >
            📋 {t('simulator.copyEnv')}
          </button>
        </div>
        <pre class="bg-black/60 border border-white/10 rounded-lg p-4 text-xs font-mono text-sky-300 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap">{generatedEnvExample}</pre>
      </div>
    </div>
  </div>
</div>
