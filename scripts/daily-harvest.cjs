#!/usr/bin/env node
/**
 * daily-harvest.js — Stage 1 of Daily Chronicle Pipeline
 *
 * Collects raw data from all engineering operations today:
 *   - Git commits (all active repos)
 *   - OpenClaw session transcripts
 *   - Xavier2 memory entries
 *   - CI/CD deployment logs
 *   - System health checks
 *   - File change deltas
 *
 * Output: JSON to stdout or to {outputDir}/harvest-YYYY-MM-DD.json
 *
 * Usage:
 *   node scripts/daily-harvest.js
 *   node scripts/daily-harvest.js --output /custom/path
 *   node scripts/daily-harvest.js --since "2026-05-06T18:00:00"
 *   node scripts/daily-harvest.js --json-only    # structured JSON for pipe
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Config ──────────────────────────────────────────────────────────────

const ACTIVE_REPOS = [
  { name: 'portfolio-iberi22', dir: 'E:\\scripts-python\\portfolio-iberi22', track: true },
  { name: 'xavier2',           dir: 'E:\\scripts-python\\xavier2',           track: true },
  { name: 'gestalt',           dir: 'E:\\scripts-python\\gestalt',           track: true },
  { name: 'GOS',               dir: 'E:\\scripts-python\\gastronomic-open-standard-GOS', track: true },
  { name: 'orionhealth',       dir: 'E:\\scripts-python\\orionhealth',       track: true },
  { name: 'manteniapp',        dir: 'E:\\scripts-python\\manteniapp',        track: true },
  { name: 'worldexams',        dir: 'E:\\scripts-python\\worldexams',        track: true },
  { name: 'cortex',            dir: 'E:\\scripts-python\\cortex',            track: false },
  { name: 'clawd',             dir: 'C:\\Users\\belal\\clawd',               track: true },
];

const XAVIER2_URL = 'http://localhost:8006';
const GITHUB_OWNER = 'iberi22';

// ── Helpers ─────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, ...opts });
    return out.trim();
  } catch (e) {
    return `[error] ${e.message?.split('\n')[0] || e}`;
  }
}

function runSilent(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, ...opts }).trim();
  } catch {
    return '';
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { since: getDefaultSince(), output: null, jsonOnly: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
    if (args[i] === '--since' && args[i + 1]) opts.since = args[++i];
    if (args[i] === '--json-only') opts.jsonOnly = true;
  }
  return opts;
}

function getDefaultSince() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Harvesters ──────────────────────────────────────────────────────────

/**
 * 1. GIT COMMITS — Scan all tracked repos for today's activity.
 */
function harvestGitCommits(since) {
  console.error(`  [git] scanning ${ACTIVE_REPOS.filter(r => r.track).length} repos since ${since}`);
  const repos = [];

  for (const repo of ACTIVE_REPOS) {
    if (!repo.track) continue;
    if (!fs.existsSync(path.join(repo.dir, '.git'))) {
      console.error(`  [git]  ⚠ ${repo.name}: no .git found, skipping`);
      continue;
    }

    const log = run(`cd ${repo.dir} && git log --since="${since}" --reverse --format=format:"%H|%ai|%an|%s" --stat`, { cwd: repo.dir });
    const branch = runSilent(`cd ${repo.dir} && git rev-parse --abbrev-ref HEAD`, { cwd: repo.dir });
    const totalCommits = runSilent(`cd ${repo.dir} && git rev-list --count --since="${since}" HEAD`, { cwd: repo.dir });

    const commits = log ? log.split('\n---\n').join('\n').split('\n').filter(Boolean) : [];
    const parsedCommits = [];
    let currentCommit = null;

    for (const line of commits) {
      if (line.includes('|') && line.split('|').length >= 4) {
        if (currentCommit) parsedCommits.push(currentCommit);
        const parts = line.split('|');
        currentCommit = {
          hash: parts[0],
          date: parts[1],
          author: parts[2],
          message: parts.slice(3).join('|'),
          filesChanged: [],
          filesChangedCount: 0,
          insertions: 0,
          deletions: 0,
        };
      } else if (currentCommit && line.trim()) {
        const match = line.trim().match(/^(.+?)\s*\|\s*(\d+)\s*[+-]/);
        if (match) {
          currentCommit.filesChanged.push(match[1].trim());
          currentCommit.filesChangedCount++;
        }
        const insMatch = line.match(/(\d+)\s*insertion/);
        const delMatch = line.match(/(\d+)\s*deletion/);
        if (insMatch) currentCommit.insertions += parseInt(insMatch[1]);
        if (delMatch) currentCommit.deletions += parseInt(delMatch[1]);
      }
    }
    if (currentCommit) parsedCommits.push(currentCommit);

    if (parsedCommits.length > 0) {
      repos.push({
        name: repo.name,
        branch,
        commitCount: parseInt(totalCommits) || parsedCommits.length,
        commits: parsedCommits,
      });
      console.error(`  [git]  ✓ ${repo.name}: ${parsedCommits.length} commits`);
    } else {
      console.error(`  [git]  - ${repo.name}: no activity today`);
    }
  }

  return repos;
}

/**
 * 2. OPENCLAW SESSIONS — Export today's session trajectories.
 */
function harvestSessions() {
  console.error('  [sessions] querying OpenClaw...');
  const sessionsRaw = runSilent('openclaw sessions --active 1440 --json 2>&1');
  let sessions = [];
  try {
    const parsed = JSON.parse(sessionsRaw || '{}');
    sessions = parsed.sessions || [];
  } catch {
    console.error('  [sessions]  ⚠ failed to parse session list');
  }

  // For each session, export its trajectory (limit to 10 for performance)
  const enriched = sessions.slice(0, 10).map(s => {
    const key = s.key || s.sessionId;
    if (!key) return { ...s, trajectory: null };
    const trajRaw = runSilent(`openclaw sessions export-trajectory --session-key "${key}" --json 2>&1`);
    let trajectory = null;
    try { trajectory = JSON.parse(trajRaw); } catch { trajectory = trajRaw?.slice(0, 2000) || null; }
    return { ...s, trajectory };
  });

  console.error(`  [sessions] ✓ ${enriched.length} sessions harvested`);
  return enriched;
}

/**
 * 3. XAVIER2 MEMORY — Query today's saved memories.
 */
function harvestXavier2Memory() {
  console.error('  [xavier2] querying memory server...');
  const today = todayStr();
  try {
    const raw = runSilent(`curl.exe -s -X POST "${XAVIER2_URL}/memory/search" -H "Authorization: Bearer dev-token" -H "Content-Type: application/json" -d "{\\"query\\":\\"${today}\\"}"`);
    const parsed = raw ? JSON.parse(raw) : { results: [] };
    console.error(`  [xavier2] ✓ ${parsed.results?.length || 0} entries`);
    return parsed;
  } catch {
    console.error('  [xavier2] ⚠ offline or unreachable');
    return { error: 'xavier2 offline', results: [] };
  }
}

/**
 * 4. CI/CD LOGS — GitHub Actions runs for tracked repos.
 */
function harvestDeployments() {
  console.error('  [ci/cd] fetching GitHub Actions...');
  const raw = runSilent(`gh run list --repo ${GITHUB_OWNER}/portfolio-iberi22 --limit 10 --json status,conclusion,displayTitle,headBranch,databaseId,createdAt 2>&1`);
  let runs = [];
  try { runs = JSON.parse(raw || '[]'); } catch { runs = []; }
  console.error(`  [ci/cd] ✓ ${runs.length} runs`);
  return runs;
}

/**
 * 5. SYSTEM HEALTH — Environment status snapshot.
 */
function harvestSystemHealth() {
  console.error('  [system] checking health...');
  const checks = {
    timestamp: new Date().toISOString(),
    hostname: run('hostname'),
    platform: process.platform,
    nodeVersion: process.version,
  };

  // Docker containers
  const dockerPs = runSilent('docker ps --format "{{.Names}}|{{.Status}}|{{.Ports}}" 2>&1');
  checks.docker = dockerPs ? dockerPs.split('\n').map(l => {
    const parts = l.split('|');
    return { name: parts[0], status: parts[1], ports: parts[2] };
  }) : [];

  // Disk usage
  const disk = runSilent('wmic logicaldisk get size,freespace,caption 2>&1');
  checks.disk = disk ? disk.split('\n').filter(l => l.trim() && l.includes(':')).map(l => {
    const parts = l.trim().split(/\s+/);
    return { drive: parts[0], freeBytes: parts[1], totalBytes: parts[2] };
  }) : [];

  // Memory (rough)
  const mem = runSilent('wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /format:csv 2>&1');
  checks.memory = mem ? mem.split('\n').filter(l => l.includes(',')).map(l => {
    const parts = l.trim().split(',');
    return { freeKB: parts[2], totalKB: parts[1] };
  }) : [];

  console.error(`  [system] ✓ ${checks.docker?.length || 0} containers`);
  return checks;
}

/**
 * 6. FILE CHANGE DELTA — Portfolios's own changed files today.
 */
function harvestFileDeltas(since) {
  console.error('  [files] tracking changes...');
  const portfolioDir = 'E:\\scripts-python\\portfolio-iberi22';
  const diff = runSilent(`cd ${portfolioDir} && git diff --stat HEAD~$(git rev-list --count --since="${since}" HEAD) 2>&1`, { cwd: portfolioDir });
  const status = runSilent(`cd ${portfolioDir} && git status --short`, { cwd: portfolioDir });
  const lines = runSilent(`cd ${portfolioDir} && git diff --shortstat HEAD~$(git rev-list --count --since="${since}" HEAD) 2>&1`, { cwd: portfolioDir });

  const filesChanged = diff ? diff.split('\n').filter(Boolean).length : 0;
  const insertionsMatch = lines?.match(/(\d+)\s*insertion/);
  const deletionsMatch = lines?.match(/(\d+)\s*deletion/);

  return {
    filesChanged,
    insertions: insertionsMatch ? parseInt(insertionsMatch[1]) : 0,
    deletions: deletionsMatch ? parseInt(deletionsMatch[1]) : 0,
    changedFiles: diff || '',
    workingTreeStatus: status || '',
    trackedDir: portfolioDir,
  };
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();
  const startTime = Date.now();

  console.error('');
  console.error('═'.repeat(50));
  console.error('  DAILY HARVEST');
  console.error(`  Date: ${todayStr()}`);
  console.error(`  Since: ${opts.since}`);
  console.error('═'.repeat(50));
  console.error('');

  // Run all harvesters in sequence (avoid rate limits / conflicts)
  const harvest = {
    meta: {
      generatedAt: new Date().toISOString(),
      date: todayStr(),
      since: opts.since,
      duration: 0,
    },
    git: harvestGitCommits(opts.since),
    sessions: harvestSessions(),
    xavier2: harvestXavier2Memory(),
    deployments: harvestDeployments(),
    system: harvestSystemHealth(),
    files: harvestFileDeltas(opts.since),
  };

  harvest.meta.duration = Date.now() - startTime;

  // Summary
  const totalCommits = harvest.git.reduce((sum, r) => sum + r.commitCount, 0);
  console.error('');
  console.error('─'.repeat(50));
  console.error('  HARVEST SUMMARY');
  console.error(`  Repos with activity: ${harvest.git.length}/${ACTIVE_REPOS.filter(r => r.track).length}`);
  console.error(`  Total commits:       ${totalCommits}`);
  console.error(`  Sessions today:      ${harvest.sessions.length}`);
  console.error(`  Xavier2 entries:     ${harvest.xavier2.results?.length || 0}`);
  console.error(`  CI/CD runs:          ${harvest.deployments.length}`);
  console.error(`  Files changed:       ${harvest.files.filesChanged}`);
  console.error(`  Duration:            ${harvest.meta.duration}ms`);
  console.error('─'.repeat(50));
  console.error('');

  // Output
  const json = JSON.stringify(harvest, null, 2);

  if (opts.output) {
    const outDir = opts.output;
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `harvest-${todayStr()}.json`);
    fs.writeFileSync(outPath, json, 'utf8');
    console.error(`  ✨ Written to ${outPath}`);
  } else if (opts.jsonOnly) {
    process.stdout.write(json);
  } else {
    // Default: save to portfolio content directory for reference
    const defaultDir = path.join(__dirname, '..', '.chronicle');
    if (!fs.existsSync(defaultDir)) fs.mkdirSync(defaultDir, { recursive: true });
    const outPath = path.join(defaultDir, `harvest-${todayStr()}.json`);
    fs.writeFileSync(outPath, json, 'utf8');
    console.error(`  ✨ Written to ${outPath}`);
  }

  console.error('');
}

main().catch(err => {
  console.error('  ❌ Fatal:', err.message);
  process.exit(1);
});
