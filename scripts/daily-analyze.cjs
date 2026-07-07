#!/usr/bin/env node
/**
 * daily-analyze.js — Stage 2 of Daily Chronicle Pipeline
 *
 * Takes harvest data and uses an LLM to extract:
 *   - Key technical decisions with rationale + trade-offs
 *   - Architecture patterns detected
 *   - Bugs found and how they were fixed
 *   - Code patterns, refactors, migrations
 *   - Metrics and summary
 *
 * Usage:
 *   node scripts/daily-analyze.cjs                         # latest harvest
 *   node scripts/daily-analyze.cjs --input path/to/harvest.json
 *   node scripts/daily-analyze.cjs --output path/to/analysis.json
 *   node scripts/daily-analyze.cjs --provider deepseek     # force provider
 */

const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────

const ANALYSIS_OUT_DIR = path.join(__dirname, '..', '.chronicle');
const DEFAULT_HARVEST_PATH = path.join(ANALYSIS_OUT_DIR, `harvest-${todayStr()}.json`);

// ── Helpers ─────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { input: null, output: null, provider: 'minimax/MiniMax-M2.7', dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) opts.input = args[++i];
    if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
    if (args[i] === '--provider' && args[i + 1]) opts.provider = args[++i];
    if (args[i] === '--dry-run') opts.dryRun = true;
  }
  if (!opts.input) opts.input = DEFAULT_HARVEST_PATH;
  if (!opts.output) opts.output = path.join(ANALYSIS_OUT_DIR, `analysis-${todayStr()}.json`);
  return opts;
}

// ── Build LLM Prompt ────────────────────────────────────────────────────

function buildAnalysisPrompt(harvest) {
  const gitSections = harvest.git.map(repo => {
    const commitMsgs = repo.commits?.map(c =>
      `  - [${c.hash.slice(0, 7)}] ${c.message} (${c.author}): +${c.insertions}/-${c.deletions} in ${c.filesChangedCount} files`
    ).join('\n') || '';
    return `## ${repo.name} (${repo.branch}, ${repo.commitCount} commits)\n${commitMsgs || '  no commits today'}`;
  }).join('\n\n');

  const sessionSummary = harvest.sessions.map(s =>
    `  - Session ${s.sessionId?.slice(0, 8) || 'unknown'} | model: ${s.model || '?'} | tokens: ${s.totalTokens || '?'} | updated: ${new Date(s.updatedAt).toLocaleString()}`
  ).join('\n');

  const deploySummary = harvest.deployments.map(d =>
    `  - ${d.displayTitle?.slice(0, 60) || 'unknown'} | ${d.conclusion || 'pending'} (${d.status})`
  ).join('\n');

  const systemInfo = harvest.system ? `Host: ${harvest.system.hostname}\nPlatform: ${harvest.system.platform}\nNode: ${harvest.system.nodeVersion}\nContainers: ${(harvest.system.docker || []).length}` : 'N/A';

  const fileSummary = harvest.files ? `${harvest.files.filesChanged} files changed, +${harvest.files.insertions}/-${harvest.files.deletions}` : 'N/A';

  return `You are an engineering technical writer. Analyze today's work from the data below and produce a structured JSON analysis.

TODAY'S DATA (${harvest.meta.date}):

## Git Commits
${gitSections}

## OpenClaw Sessions (${harvest.sessions.length})
${sessionSummary || '  no sessions today'}

## CI/CD Deployments (${harvest.deployments.length})
${deploySummary || '  no deployments today'}

## File Changes
${fileSummary}

## System
${systemInfo}

___

Respond ONLY with a valid JSON object (no markdown fences, no explanation). Use this exact structure:

{
  "title": "Daily Chronicle: <date>",
  "summary": "2-3 paragraph overview of what was accomplished today, written in first-person engineering voice",
  "keyDecisions": [
    {
      "decision": "Title of technical decision",
      "rationale": "Why this approach was chosen",
      "tradeoffs": "What was sacrificed or deferred",
      "codePattern": "Optional: code/concept pattern used"
    }
  ],
  "architectureChanges": [
    {
      "component": "Component or system name",
      "change": "What changed",
      "impact": "Why it matters"
    }
  ],
  "bugsFixed": [
    {
      "issue": "Problem description",
      "rootCause": "Why it happened",
      "fix": "How it was resolved"
    }
  ],
  "technicalDeepDives": [
    {
      "topic": "Topic explored today",
      "explanation": "Technical explanation of the concept",
      "relevance": "How it applies to this project"
    }
  ],
  "tags": ["engineering", "architecture", ...],
  "metrics": {
    "commits": <number>,
    "reposActive": <number>,
    "sessions": <number>,
    "deployments": <number>,
    "filesChanged": <number>,
    "insertions": <number>,
    "deletions": <number>
  }
}`;
}

// ── LLM Call ────────────────────────────────────────────────────────────

function callLLM(prompt, provider) {
  const { execSync } = require('child_process');
  const fs = require('fs');

  // Write prompt to temp file
  const tmpFile = path.join(ANALYSIS_OUT_DIR, `_prompt-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, prompt, 'utf8');

  console.error(`  [llm] calling ${provider}...`);
  const startTime = Date.now();

  // Use -f to attach the file, inline prompt as instruction
  try {
    const result = execSync(
      `opencode run --model ${provider} -f "${tmpFile}" "Analyze this engineering data and respond ONLY with valid JSON matching the requested structure."`,
      { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024, timeout: 180000 }
    );
    fs.unlinkSync(tmpFile);
    console.error(`  [llm]  ✓ response in ${Date.now() - startTime}ms`);
    return result;
  } catch (e) {
    console.error(`  [llm]  ⚠ opencode failed, trying deepseek via stdin...`);
    fs.unlinkSync(tmpFile);
    return callLLMFallback(prompt);
  }
}

function callLLMFallback(prompt) {
  const { execSync } = require('child_process');
  const fs = require('fs');
  const tmpFile = path.join(ANALYSIS_OUT_DIR, `_prompt2-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, prompt, 'utf8');

  try {
    const result = execSync(
      `opencode run --model deepseek/deepseek-chat -f "${tmpFile}" "Analyze this engineering data and respond ONLY with valid JSON matching the requested structure."`,
      { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024, timeout: 180000 }
    );
    fs.unlinkSync(tmpFile);
    console.error('  [llm]  ✓ deepseek response');
    return result;
  } catch (e) {
    fs.unlinkSync(tmpFile);
    // Last resort: inline prompt directly
    console.error('  [llm]  ⚠ trying inline fallback...');
    const result = execSync(
      `opencode run --model deepseek/deepseek-chat "${prompt.slice(0, 4000).replace(/"/g, '\\"')}"`,
      { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024, timeout: 180000 }
    );
    return result;
  }
}

// ── Main ────────────────────────────────────────────────────────────────

function main() {
  const opts = parseArgs();
  const startTime = Date.now();

  console.error('');
  console.error('═'.repeat(50));
  console.error('  DAILY ANALYZE');
  console.error(`  Input:  ${opts.input}`);
  console.error(`  Output: ${opts.output}`);
  console.error(`  Provider: ${opts.provider}`);
  console.error('═'.repeat(50));
  console.error('');

  // 1. Load harvest
  if (!fs.existsSync(opts.input)) {
    console.error(`  ❌ harvest file not found: ${opts.input}`);
    console.error('  Run daily-harvest.cjs first, or specify --input');
    process.exit(1);
  }
  const harvest = JSON.parse(fs.readFileSync(opts.input, 'utf8'));
  console.error(`  ✓ Loaded harvest: ${harvest.git.length} repos, ${harvest.sessions.length} sessions`);

  // 2. Build prompt
  const prompt = buildAnalysisPrompt(harvest);
  console.error(`  ✓ Prompt built: ~${Math.round(prompt.length / 1024)}KB`);

  if (opts.dryRun) {
    console.error('');
    console.error('  [dry-run] Prompt preview:');
    console.error(prompt.slice(0, 1000) + '...');
    console.error('');
    console.error(`  [dry-run] Prompt saved to ${opts.output}.prompt.txt`);
    fs.writeFileSync(opts.output + '.prompt.txt', prompt, 'utf8');
    console.error('  [dry-run] Done (no LLM call)');
    return;
  }

  // 3. Call LLM
  const llmOutput = callLLM(prompt, opts.provider);

  // 4. Parse response
  let analysis = null;
  const jsonMatch = llmOutput.match(/\{[\s\S]*\}/);
  const rawJson = jsonMatch ? jsonMatch[0] : llmOutput;
  try {
    analysis = JSON.parse(rawJson);
  } catch {
    // Try to clean up markdown fences
    const cleaned = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try { analysis = JSON.parse(cleaned); } catch {
      console.error('  ⚠ Failed to parse LLM response as JSON');
      analysis = { raw: rawJson.slice(0, 5000), parseError: true };
    }
  }

  // 5. Add metadata
  analysis._meta = {
    generatedAt: new Date().toISOString(),
    date: harvest.meta.date,
    duration: Date.now() - startTime,
    provider: opts.provider,
    harvestSource: opts.input,
  };

  // 6. Save
  if (!fs.existsSync(path.dirname(opts.output))) {
    fs.mkdirSync(path.dirname(opts.output), { recursive: true });
  }
  fs.writeFileSync(opts.output, JSON.stringify(analysis, null, 2), 'utf8');

  console.error('');
  console.error('─'.repeat(50));
  console.error('  ANALYSIS COMPLETE');
  console.error(`  Title:    ${analysis.title || '(unset)'}`);
  console.error(`  Decisions:  ${analysis.keyDecisions?.length || 0}`);
  console.error(`  Architects: ${analysis.architectureChanges?.length || 0}`);
  console.error(`  Bugs:       ${analysis.bugsFixed?.length || 0}`);
  console.error(`  Deep dives: ${analysis.technicalDeepDives?.length || 0}`);
  console.error(`  Duration:   ${analysis._meta.duration}ms`);
  console.error(`  Output:     ${opts.output}`);
  console.error('─'.repeat(50));
  console.error('');
}

main();
