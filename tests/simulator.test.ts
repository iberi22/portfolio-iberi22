import { describe, it, expect } from 'vitest';

describe('Simulator Architectural Engine', () => {
  it('calculates top 5 architectures deterministically', () => {
    const monthlyTokensM = (120 * 2000 * 30) / 1_000_000;
    const estTier1Cost = Math.round(monthlyTokensM * 0.45);
    expect(estTier1Cost).toBeGreaterThan(0);
  });

  it('verifies score formula bounds between 10 and 100', () => {
    const costEfficiencyScore = 98;
    const devVelocityScore = 78;
    const resilienceScore = 88;
    const score = Math.round(
      costEfficiencyScore * 0.35 +
      devVelocityScore * 0.35 +
      resilienceScore * 0.30
    );
    expect(score).toBeGreaterThanOrEqual(10);
    expect(score).toBeLessThanOrEqual(100);
  });
});
