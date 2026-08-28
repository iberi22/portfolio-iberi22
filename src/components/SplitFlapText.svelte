<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    text: string;
    duration?: number;
    delay?: number;
    class?: string;
  }

  let { text = '', duration = 1800, delay = 0, class: className = '' }: Props = $props();

  const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*+=-/_:;~';
  let displayText = $state(text);
  let isFlapping = $state(false);

  function getRandomGlyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  function getScrambledString(target: string): string {
    let s = '';
    for (let i = 0; i < target.length; i++) {
      const c = target[i];
      if (c === ' ' || c === '\n' || c === '\t' || c === '.' || c === ',' || c === '—' || c === '-') {
        s += c;
      } else {
        s += getRandomGlyph();
      }
    }
    return s;
  }

  function runFlap(targetText: string) {
    if (typeof window === 'undefined' || !targetText) {
      displayText = targetText;
      return;
    }

    isFlapping = true;
    // Immediately scramble on start so there is zero delay or flash of readable text
    displayText = getScrambledString(targetText);

    const len = targetText.length;
    const startTimestamp = performance.now();
    let animId: number;
    let lastTick = 0;

    function frame(now: number) {
      const elapsed = now - startTimestamp;
      
      // Throttle character flipping to ~35ms for authentic mechanical click feel
      if (now - lastTick > 35 || elapsed >= duration) {
        lastTick = now;

        const effectiveElapsed = Math.max(0, elapsed - delay);
        const effectiveDuration = Math.max(100, duration - delay);
        const progress = Math.min(effectiveElapsed / effectiveDuration, 1);

        let output = '';
        for (let i = 0; i < len; i++) {
          const targetChar = targetText[i];
          if (targetChar === ' ' || targetChar === '\n' || targetChar === '\t') {
            output += targetChar;
            continue;
          }

          // Progressive lock-in threshold (train station cascade)
          const lockProgress = (i + 1) / len;

          if (elapsed >= delay && progress >= lockProgress) {
            output += targetChar;
          } else {
            output += getRandomGlyph();
          }
        }

        displayText = output;

        if (progress >= 1 && elapsed >= duration) {
          displayText = targetText;
          isFlapping = false;
          return;
        }
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }

  $effect(() => {
    const cancel = runFlap(text);
    return () => {
      if (cancel) cancel();
    };
  });
</script>

<span
  class={`split-flap-root ${className}`}
  class:flapping={isFlapping}
  aria-label={text}
>
  {displayText}
</span>

<style>
  .split-flap-root {
    display: inline-block;
    letter-spacing: normal;
    transition: color 0.15s ease;
    font-variant-numeric: tabular-nums;
  }
  .split-flap-root.flapping {
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.35);
  }
</style>
