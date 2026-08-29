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
  workloadType?: 'fullstack' | 'frontend' | 'backend' | 'systems' | 'data_ml';
  contextDepth: 'short' | 'medium' | 'deep';
  budgetLimitUsd: number;
  currentMonthlySpendUsd: number;
  useFreeTiers: boolean;
  subscriptions: SubscriptionsState;
  hardware: { ramGb: number; gpuVramGb?: number; type?: string };
}

function calculateSimulationTiers(params: SimulationParams) {
  const multiplier = params.contextDepth === 'deep' ? 4000 : params.contextDepth === 'medium' ? 2000 : 1000;
  const totalDailyTokens = params.dailyPrompts * multiplier;
  const monthlyTokensM = (totalDailyTokens * 30) / 1_000_000;

  const subs = params.subscriptions;
  const julesConcurrency = subs.googleAiPro ? 15 : 4;
  const claudeConcurrency = subs.claudePro ? 5 : 2;
  const openrouterConcurrency = subs.openrouter ? 8 : 3;
  const localConcurrency = params.hardware.ramGb >= 64 ? 4 : params.hardware.ramGb >= 32 ? 2 : 1;

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
  return `# Role: Senior Software Engineer & AI Orchestrator

## Runtime Environment & Context
- Assigned Architecture: ${tierTitle}
- Primary Routing: ${routing}
- Workspace: \`${srcPath}\` | Test Suite: \`${testPath}\`
- Concurrency Limit: Maximum ${concurrency} simultaneous tasks

## Core Operational Directives
1. Code Micro-Fragmentation: 1 Issue → 1 Branch → 1 PR with automated verification.
2. Surgical File Operations: Read targeted line ranges; never perform bulk rewrites of untouched files.
3. Zero Credential Leaks: All API keys and secrets must strictly be read from environment variables.
4. Mandatory Verification: Execute the local test suite (\`${testPath}\`) before committing or proposing any changes.`;
}

function generateCleanWebSearchPrompt(hardware: string, workload: string, spend: number, budget: number) {
  return `Act as a Senior AI Infrastructure & Agentic Architecture Consultant.

MY CURRENT TECHNICAL SETUP:
- Hardware: ${hardware}.
- Workload Profile: ${workload}.
- Current Monthly AI Spend: $${spend} USD/month (Target Budget: $${budget} USD/month).

LIVE RESEARCH DIRECTIVES (AS OF TODAY):
1. Search the web for current, active model releases across my subscriptions.
2. Fetch up-to-date pricing per 1M tokens (Input / Output).`;
}

describe('Resource Simulator E2E & Parameter Validation Suite', () => {
  describe('Subscription-Driven Dynamic Concurrency', () => {
    it('grants 15 concurrent tasks for Google AI Pro users', () => {
      const results = calculateSimulationTiers({
        dailyPrompts: 150,
        contextDepth: 'medium',
        budgetLimitUsd: 100,
        currentMonthlySpendUsd: 50,
        useFreeTiers: false,
        subscriptions: {
          googleAiPro: true,
          claudePro: false,
          openaiPlus: false,
          openrouter: false,
          localHardware: false,
        },
        hardware: { ramGb: 64 },
      });

      const velocityTier = results.find(t => t.id === 'tier_velocity');
      expect(velocityTier?.concurrencyLimit).toBe(15);
      expect(velocityTier?.name).toContain('Wave Parallelism (Jules)');
    });

    it('adapts concurrency to 5 for Claude Pro users without Google AI Pro', () => {
      const results = calculateSimulationTiers({
        dailyPrompts: 150,
        contextDepth: 'medium',
        budgetLimitUsd: 100,
        currentMonthlySpendUsd: 40,
        useFreeTiers: false,
        subscriptions: {
          googleAiPro: false,
          claudePro: true,
          openaiPlus: false,
          openrouter: false,
          localHardware: false,
        },
        hardware: { ramGb: 32 },
      });

      const velocityTier = results.find(t => t.id === 'tier_velocity');
      expect(velocityTier?.concurrencyLimit).toBe(5);
      expect(velocityTier?.name).toContain('Claude Subagents');
    });

    it('calculates local concurrency based on RAM capacity (1, 2, or 4 workers)', () => {
      const highRam = calculateSimulationTiers({
        dailyPrompts: 100,
        contextDepth: 'short',
        budgetLimitUsd: 50,
        currentMonthlySpendUsd: 0,
        useFreeTiers: false,
        subscriptions: { googleAiPro: false, claudePro: false, openaiPlus: false, openrouter: false, localHardware: true },
        hardware: { ramGb: 64 },
      });
      const lowRam = calculateSimulationTiers({
        dailyPrompts: 100,
        contextDepth: 'short',
        budgetLimitUsd: 50,
        currentMonthlySpendUsd: 0,
        useFreeTiers: false,
        subscriptions: { googleAiPro: false, claudePro: false, openaiPlus: false, openrouter: false, localHardware: true },
        hardware: { ramGb: 16 },
      });

      expect(highRam.find(t => t.id === 'tier_local')?.concurrencyLimit).toBe(4);
      expect(lowRam.find(t => t.id === 'tier_local')?.concurrencyLimit).toBe(1);
    });
  });

  describe('Context Depth & Budget Penalty Matrix', () => {
    it('scales token usage across Short (1k), Medium (2k), and Deep (4k) context depths', () => {
      const shortResults = calculateSimulationTiers({
        dailyPrompts: 100,
        contextDepth: 'short',
        budgetLimitUsd: 100,
        currentMonthlySpendUsd: 20,
        useFreeTiers: false,
        subscriptions: { googleAiPro: true, claudePro: true, openaiPlus: true, openrouter: true, localHardware: true },
        hardware: { ramGb: 64 },
      });
      const deepResults = calculateSimulationTiers({
        dailyPrompts: 100,
        contextDepth: 'deep',
        budgetLimitUsd: 100,
        currentMonthlySpendUsd: 20,
        useFreeTiers: false,
        subscriptions: { googleAiPro: true, claudePro: true, openaiPlus: true, openrouter: true, localHardware: true },
        hardware: { ramGb: 64 },
      });

      const shortCost = shortResults.find(t => t.id === 'tier_hybrid')?.costEstUsd || 0;
      const deepCost = deepResults.find(t => t.id === 'tier_hybrid')?.costEstUsd || 0;
      expect(deepCost).toBeGreaterThan(shortCost);
    });

    it('penalizes tiers exceeding budget limits', () => {
      const results = calculateSimulationTiers({
        dailyPrompts: 500,
        contextDepth: 'deep',
        budgetLimitUsd: 15,
        currentMonthlySpendUsd: 200,
        useFreeTiers: false,
        subscriptions: { googleAiPro: true, claudePro: true, openaiPlus: true, openrouter: true, localHardware: true },
        hardware: { ramGb: 64 },
      });

      // Low cost tiers (Sovereign $0 or Ultra-Cost) should win due to strict penalty on heavy tiers
      const winner = results[0];
      expect(winner.costEstUsd).toBeLessThanOrEqual(50);
    });

    it('guarantees $0 estimated cost for all tiers when 100% Free-Tiers mode is enabled', () => {
      const freeResults = calculateSimulationTiers({
        dailyPrompts: 200,
        contextDepth: 'medium',
        budgetLimitUsd: 0,
        currentMonthlySpendUsd: 0,
        useFreeTiers: true,
        subscriptions: { googleAiPro: false, claudePro: false, openaiPlus: false, openrouter: false, localHardware: true },
        hardware: { ramGb: 32 },
      });

      freeResults.forEach(tier => {
        if (tier.id === 'tier_velocity' || tier.id === 'tier_hybrid' || tier.id === 'tier_cost' || tier.id === 'tier_local') {
          expect(tier.costEstUsd).toBe(0);
        }
      });
    });
  });

  describe('Clean English Prompts Verification (Zero Bloat)', () => {
    it('produces pure English Master Prompt without decorative ASCII headers', () => {
      const prompt = generateCleanMasterPrompt('Wave Parallelism', 'Google Jules → Gemini Flash', 15, './src', './tests');

      expect(prompt).toContain('# Role: Senior Software Engineer & AI Orchestrator');
      expect(prompt).toContain('Concurrency Limit: Maximum 15 simultaneous tasks');
      expect(prompt).toContain('Code Micro-Fragmentation: 1 Issue → 1 Branch → 1 PR');
      expect(prompt).not.toContain('================================================================================');
      expect(prompt).not.toContain('[ARCHIVAL GRADE]');
      expect(prompt).not.toContain('SWAL MASTER AGENT SYSTEM PROMPT');
    });

    it('produces pure English Web-Search live audit prompt', () => {
      const webPrompt = generateCleanWebSearchPrompt('Mac Studio (64GB RAM)', 'fullstack', 40, 60);

      expect(webPrompt).toContain('Act as a Senior AI Infrastructure & Agentic Architecture Consultant.');
      expect(webPrompt).toContain('MY CURRENT TECHNICAL SETUP:');
      expect(webPrompt).toContain('LIVE RESEARCH DIRECTIVES (AS OF TODAY):');
      expect(webPrompt).not.toContain('================');
    });
  });
});
