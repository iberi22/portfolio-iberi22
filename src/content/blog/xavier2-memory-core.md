---
title: 'Building Xavier2: A Memory Core for AI Agents'
excerpt: 'How I built a persistent memory system in Rust with vector search and knowledge graphs.'
date: '2026-05-07'
tags: ['Rust', 'AI', 'Systems']
draft: false
published: true
---

## The Problem

AI agents need persistent memory. Without it, every session starts from scratch — no context, no history, no learning.

Xavier2 was born from this gap: a **memory core** designed specifically for multi-agent systems, running as a lightweight Docker service.

## Architecture

- **Rust** for performance and safety
- **Vector storage** for semantic similarity search
- **Knowledge graph** capabilities for relational context
- **REST API** on port 8006

## Key Decisions

1. **Ports-first over layers** — the hexagonal architecture emerged from actual connector needs, not upfront abstraction
2. **Docker-first deployment** — single container, environment-configured
3. **Token-auth** — simple dev-token model for agent-to-agent communication

## What's Next

Knowledge graph queries, bidirectional agent communication, and cron-based maintenance.

Stay tuned.
