import { describe, it, expect } from 'vitest';

interface SimulationParams {
  dailyPrompts: number;
  contextDepth: 'short' | 'medium' | 'deep';
  budgetLimitUsd: number;
  currentMonthlySpendUsd: number;
  useFreeTiers: boolean;
  hasLocalCompute: boolean;
}

function calculateSimulationTiers(params: SimulationParams) {
  const multiplier = params.contextDepth === 'deep' ? 4000 : params.contextDepth === 'medium' ? 2000 : 1000;
  const totalDailyTokens = params.dailyPrompts * multiplier;
  const monthlyTokensM = (totalDailyTokens * 30) / 1_000_000;

  const tiers = [
    {
      id: 'tier1',
      name: 'Ultra-Cost Optimizer',
      costEstUsd: params.useFreeTiers ? 0 : params.hasLocalCompute ? Math.round(monthlyTokensM * 0.22) : Math.round(monthlyTokensM * 0.45),
      costEfficiencyScore: 98,
      devVelocityScore: 78,
      resilienceScore: 88,
      concurrencyLimit: 4,
    },
    {
      id: 'tier2',
      name: 'Maximum Velocity',
      costEstUsd: Math.round(monthlyTokensM * 1.6),
      costEfficiencyScore: 80,
      devVelocityScore: 99,
      resilienceScore: 91,
      concurrencyLimit: 15,
    },
    {
      id: 'tier3',
      name: 'Balanced Hybrid Orchestrator',
      costEstUsd: Math.round(monthlyTokensM * 2.1),
      costEfficiencyScore: 86,
      devVelocityScore: 90,
      resilienceScore: 96,
      concurrencyLimit: 8,
    },
    {
      id: 'tier4',
      name: 'Sovereign Local-First',
      costEstUsd: 0,
      costEfficiencyScore: 96,
      devVelocityScore: 72,
      resilienceScore: 98,
      concurrencyLimit: 6,
    },
    {
      id: 'tier5',
      name: 'Enterprise Bedrock & Governance Swarm',
      costEstUsd: Math.round(monthlyTokensM * 3.2),
      costEfficiencyScore: 70,
      devVelocityScore: 95,
      resilienceScore: 99,
      concurrencyLimit: 20,
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

describe('Resource Simulator Algorithmic Engine', () => {
  it('should rank 5 distinct tiers correctly for balanced standard workload', () => {
    const results = calculateSimulationTiers({
      dailyPrompts: 120,
      contextDepth: 'medium',
      budgetLimitUsd: 60,
      currentMonthlySpendUsd: 40,
      useFreeTiers: false,
      hasLocalCompute: true,
    });

    expect(results).toHaveLength(5);
    expect(results[0].overallScore).toBeGreaterThanOrEqual(results[1].overallScore);
    expect(results[1].overallScore).toBeGreaterThanOrEqual(results[2].overallScore);
  });

  it('should penalize configurations that exceed the monthly budget limit', () => {
    const strictBudgetResults = calculateSimulationTiers({
      dailyPrompts: 400,
      contextDepth: 'deep',
      budgetLimitUsd: 10, // Strict $10 USD budget
      currentMonthlySpendUsd: 100,
      useFreeTiers: false,
      hasLocalCompute: true,
    });

    // Tier 4 (Sovereign $0) and Tier 1 (Low Cost) should score highest due to budget penalties on expensive cloud
    const topTier = strictBudgetResults[0];
    expect(topTier.costEstUsd).toBeLessThanOrEqual(50);
  });

  it('should support 100% free-tiers mode with zero estimated cost on tier 1 and tier 4', () => {
    const freeTierResults = calculateSimulationTiers({
      dailyPrompts: 100,
      contextDepth: 'short',
      budgetLimitUsd: 0,
      currentMonthlySpendUsd: 0,
      useFreeTiers: true,
      hasLocalCompute: true,
    });

    const tier1 = freeTierResults.find(t => t.id === 'tier1');
    const tier4 = freeTierResults.find(t => t.id === 'tier4');

    expect(tier1?.costEstUsd).toBe(0);
    expect(tier4?.costEstUsd).toBe(0);
  });
});
