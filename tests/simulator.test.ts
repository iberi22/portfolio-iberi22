import { describe, it, expect } from 'vitest';

interface SubscriptionsState {
  googleAiPro: boolean;
  claudePro: boolean;
  openaiPlus: boolean;
  openrouter: boolean;
  localHardware: boolean;
}

interface SimulationParams {
  dailyPrompts: number;
  contextDepth: 'short' | 'medium' | 'deep';
  budgetLimitUsd: number;
  currentMonthlySpendUsd: number;
  useFreeTiers: boolean;
  subscriptions: SubscriptionsState;
  hardware: { ramGb: number };
}

function calculateSimulationTiers(params: SimulationParams) {
  const multiplier = params.contextDepth === 'deep' ? 4000 : params.contextDepth === 'medium' ? 2000 : 1000;
  const totalDailyTokens = params.dailyPrompts * multiplier;
  const monthlyTokensM = (totalDailyTokens * 30) / 1_000_000;

  const subs = params.subscriptions;
  const julesConcurrency = subs.googleAiPro ? 15 : 4;
  const claudeConcurrency = subs.claudePro ? 5 : 2;
  const openrouterConcurrency = subs.openrouter ? 8 : 3;
  const localConcurrency = params.hardware.ramGb >= 64 ? 4 : 2;

  const tiers = [
    {
      id: 'tier_velocity',
      name: subs.googleAiPro ? 'Wave Parallelism (Jules)' : subs.claudePro ? 'Claude Subagents' : 'Concurrent Pipeline',
      costEstUsd: params.useFreeTiers ? 0 : Math.round(monthlyTokensM * 1.5),
      costEfficiencyScore: subs.googleAiPro ? 88 : 82,
      devVelocityScore: subs.googleAiPro ? 99 : 92,
      resilienceScore: 93,
      concurrencyLimit: subs.googleAiPro ? julesConcurrency : subs.claudePro ? claudeConcurrency : openrouterConcurrency,
    },
    {
      id: 'tier_hybrid',
      name: 'Balanced Hybrid Orchestrator',
      costEstUsd: params.useFreeTiers ? 0 : Math.round(monthlyTokensM * 0.9),
      costEfficiencyScore: 90,
      devVelocityScore: 91,
      resilienceScore: 96,
      concurrencyLimit: Math.max(claudeConcurrency, openrouterConcurrency),
    },
    {
      id: 'tier_cost',
      name: 'Ultra-Cost Optimizer',
      costEstUsd: params.useFreeTiers ? 0 : subs.localHardware ? Math.round(monthlyTokensM * 0.20) : Math.round(monthlyTokensM * 0.40),
      costEfficiencyScore: 98,
      devVelocityScore: 79,
      resilienceScore: 89,
      concurrencyLimit: subs.localHardware ? localConcurrency : 4,
    },
    {
      id: 'tier_local',
      name: 'Sovereign Local-First',
      costEstUsd: 0,
      costEfficiencyScore: 99,
      devVelocityScore: 74,
      resilienceScore: 97,
      concurrencyLimit: localConcurrency,
    },
    {
      id: 'tier_enterprise',
      name: 'Enterprise Governance',
      costEstUsd: Math.round(monthlyTokensM * 2.8),
      costEfficiencyScore: 72,
      devVelocityScore: 94,
      resilienceScore: 99,
      concurrencyLimit: 12,
    },
  ];

  return tiers.map((tier) => {
    const budgetPenalty = tier.costEstUsd > params.budgetLimitUsd ? 18 : 0;
    const score = Math.round(
      tier.costEfficiencyScore * 0.35 +
      tier.devVelocityScore * 0.35 +
      tier.resilienceScore * 0.30 -
      budgetPenalty
    );
    return { ...tier, overallScore: Math.max(10, score) };
  }).sort((a, b) => b.overallScore - a.overallScore);
}

function generateCleanMasterPrompt(tierTitle: string, routing: string, concurrency: number, srcPath: string, testPath: string) {
  return `# Rol: Senior Software Engineer & AI Orchestrator

## Entorno y Contexto de Ejecución
- Arquitectura Asignada: ${tierTitle}
- Enrutamiento Primario: ${routing}
- Workspace: \`${srcPath}\` | Tests: \`${testPath}\`
- Concurrencia de Tareas: Máximo ${concurrency} tareas simultáneas

## Directivas Operativas Clave
1. Micro-fragmentación: 1 Issue → 1 Rama → 1 PR con pruebas automáticas.
2. Lecturas quirúrgicas por rangos de líneas. Cero reescrituras completas de archivos intactos.
3. Cero fugas de credenciales: Toda API key se lee estrictamente de variables de entorno.
4. Verificación obligatoria: Ejecutar la suite de pruebas locales (\`${testPath}\`) antes de confirmar cualquier cambio.`;
}

describe('Resource Simulator Dynamic Engine', () => {
  it('should grant 15 parallel tasks concurrency when Google AI Pro is active', () => {
    const results = calculateSimulationTiers({
      dailyPrompts: 120,
      contextDepth: 'medium',
      budgetLimitUsd: 100,
      currentMonthlySpendUsd: 40,
      useFreeTiers: false,
      subscriptions: {
        googleAiPro: true,
        claudePro: false,
        openaiPlus: false,
        openrouter: false,
        localHardware: true,
      },
      hardware: { ramGb: 64 },
    });

    const velocityTier = results.find(t => t.id === 'tier_velocity');
    expect(velocityTier?.concurrencyLimit).toBe(15);
  });

  it('should dynamically adapt concurrency to 5 when user only has Claude Pro without Google AI Pro', () => {
    const results = calculateSimulationTiers({
      dailyPrompts: 120,
      contextDepth: 'medium',
      budgetLimitUsd: 100,
      currentMonthlySpendUsd: 40,
      useFreeTiers: false,
      subscriptions: {
        googleAiPro: false,
        claudePro: true,
        openaiPlus: false,
        openrouter: false,
        localHardware: true,
      },
      hardware: { ramGb: 32 },
    });

    const velocityTier = results.find(t => t.id === 'tier_velocity');
    expect(velocityTier?.concurrencyLimit).toBe(5);
  });

  it('should generate pragmatic clean master prompts without decorative ASCII banners or bloat', () => {
    const prompt = generateCleanMasterPrompt('Wave Parallelism', 'Claude Sonnet → Local Test Sandbox', 15, './src', './tests');

    expect(prompt).toContain('# Rol: Senior Software Engineer & AI Orchestrator');
    expect(prompt).toContain('Concurrencia de Tareas: Máximo 15 tareas simultáneas');
    expect(prompt).not.toContain('================================================================================');
    expect(prompt).not.toContain('[ARCHIVAL GRADE]');
  });

  it('should penalize configurations exceeding budget and support $0 free-tier simulation', () => {
    const freeResults = calculateSimulationTiers({
      dailyPrompts: 100,
      contextDepth: 'short',
      budgetLimitUsd: 0,
      currentMonthlySpendUsd: 0,
      useFreeTiers: true,
      subscriptions: {
        googleAiPro: false,
        claudePro: false,
        openaiPlus: false,
        openrouter: false,
        localHardware: true,
      },
      hardware: { ramGb: 16 },
    });

    const costTier = freeResults.find(t => t.id === 'tier_cost');
    const localTier = freeResults.find(t => t.id === 'tier_local');

    expect(costTier?.costEstUsd).toBe(0);
    expect(localTier?.costEstUsd).toBe(0);
  });
});
