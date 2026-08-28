<script lang="ts">
  interface Props {
    text: string;
    duration?: number;
    delay?: number;
    class?: string;
  }

  let { text = '', duration = 1500, delay = 0, class: className = '' }: Props = $props();

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=-/_:;~';
  let displayText = $state(text);
  let isFlapping = $state(false);

  function runFlap(targetText: string) {
    if (typeof window === 'undefined' || !targetText) {
      displayText = targetText;
      return;
    }

    isFlapping = true;
    const len = targetText.length;
    let startTimestamp: number | null = null;
    let animId: number;

    function frame(now: number) {
      if (!startTimestamp) startTimestamp = now + delay;
      if (now < startTimestamp) {
        animId = requestAnimationFrame(frame);
        return;
      }

      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      let output = '';
      for (let i = 0; i < len; i++) {
        const targetChar = targetText[i];
        if (targetChar === ' ' || targetChar === '\n' || targetChar === '\t') {
          output += targetChar;
          continue;
        }

        // Each letter position locks in as progress reaches its slot in the 1.5s timeline
        const lockProgress = (i + 1) / len;
        if (progress >= lockProgress) {
          output += targetChar;
        } else {
          // While cycling, flip through split-flap characters
          const randomChar = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          output += randomChar;
        }
      }

      displayText = output;

      if (progress < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        displayText = targetText;
        isFlapping = false;
      }
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
  }
  .split-flap-root.flapping {
    font-feature-settings: 'tnum';
    text-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  }
</style>
