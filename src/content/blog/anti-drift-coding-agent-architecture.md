---
title: 'Arquitectura Anti-Drift para Agentes de Código: Micro-Fragmentación (<150 LOC) e Islas de Archivos Disjuntas'
excerpt: 'Cómo diseñar tuberías de software deterministas para agentes autónomos: la hipótesis del drift como fallo arquitectónico (no del modelo), reglas de micro-fragmentación de tareas por debajo de 150 líneas de código, islas de archivos disjuntas por construcción, y el rol del reconciliador neutral de merges.'
description: 'Guía de diseño de pipelines deterministas para coding agents: micro-fragmentación (<150 LOC), disjoint file islands, contratos de interfaz explícitos y verificación mecánica anti-drift, con métricas empíricas de un ecosistema de 80+ repositorios.'
date: '2026-08-29'
tags: ['AI Agents', 'Architecture', 'Software Engineering', 'DevOps', 'Multi-Agent']
draft: false
published: false
canonical: 'https://iberi22.github.io/portfolio-iberi22/blog/anti-drift-coding-agent-architecture/'
readingTime: 12
---

# Anti-Drift: Diseñar Tuberías Deterministas para Agentes de Código

El consenso popular atribuye el comportamiento errático de los agentes de código al modelo: "se alucina", "pierde el contexto", "no sigue instrucciones". Después de un año operando oleadas autónomas de agentes (Jules, Claude Code, subagentes Hermes) sobre un ecosistema de más de 80 repositorios, nuestra conclusión es incómoda para la industria del modelo y liberadora para el ingeniero:

**El drift es, en su mayoría, un property de la arquitectura del pipeline, no del LLM.** Un agente colocado dentro de una tubería determinista produce resultados predecibles incluso con modelos mediocres. El mismo agente dentro de una tubería ambigua produce caos con los mejores modelos del mercado.

Este artículo detalla los tres mecanismos que convierten una petición "no determinista" en una unidad de trabajo determinista.

---

## 1. Anatomía del drift

Definimos drift como cualquier desviación entre el trabajo que el agente *produce* y el trabajo que el pipeline *necesita*, clasificada en tres modos:

- **Drift de alcance** — el agente toca más de lo solicitado (refactor "preventivo", renombrados de estilo, dependencias "mejoradas"). Cada archivo extra multiplicado por N agentes paralelos produce conflictos de merge garantizados.
- **Drift de memoria** — el agente pierde o contradice decisiones tomadas en turnos anteriores de la misma sesión (reimplementa una utilidad que ya creó, restaura código que él mismo borró).
- **Drift de interfaz** — el agente asume una forma para el contrato entre componentes (tipos, firmas, rutas) que nadie definió. Es el modo más caro porque produce *código individualmente correcto y colectivamente incompatible*.

Observación empírica: la tasa de los tres modos crece de forma superlineal con el tamaño de la tarea asignada. La conclusión de diseño es directa — **reduce la tarea hasta que el agente no tenga espacio donde irse de madre**.

---

## 2. Mecanismo 1: Micro-fragmentación <150 LOC

Regla dura del pipeline: **ninguna unidad de trabajo encargada a un agente debe materializarse en más de ~150 líneas de código producción-netas** (excluyendo tests propios y docs, que cuentan aparte).

### Por qué 150

No es numerología. Es el umbral donde tres cosas ocurren simultáneamente en nuestros registros:

1. El humano que revisa el PR puede sostener el diff completo en su memoria de trabajo (revisión real, no "aprobar por confianza").
2. El agente cabe holgadamente en un solo ciclo de atención del contexto sin necesidad de *compaction* — la causa raíz del drift de memoria.
3. El CI feedback loop se mantiene por debajo de 3 iteraciones de corrección (más allá de 3, el agente empieza a parchear parches).

### Cómo fragmentar sin morir en el intento

La micro-fragmentación naïf (dividir un módulo en 6 PRs encadenados) crea serialización y merge hell. Nuestro patrón funcional es el **corte por capas verticales estrechas**:

```
✗  MAL:  "implementar módulo de pagos"            (~800 LOC, 14 archivos)
✓  BIEN: (1) tipos + schema del request           (~60 LOC, 2 archivos)
         (2) validación pura de entrada           (~90 LOC, 1 archivo)
         (3) cliente del proveedor (mockable)     (~120 LOC, 2 archivos)
         (4) handler Axum + wiring con feature flag (~100 LOC, 3 archivos)
```

Cada corte es **compilable y testeable de forma independiente** — si la tarea no puede fusionarse a `main` con CI verde sin terminar las demás, el corte está mal hecho. Esta es la prueba de acidez de la fragmentación.

Las unidades (2) y (3) son *pure islands*: no necesitan conocer a los demás para ser correctas. La unidad (4) es la única con conocimiento integrador, y precisamente por eso va al final y es la más supervisada.

---

## 3. Mecanismo 2: Disjoint File Islands (por construcción, no por promesa)

Cuando N agentes trabajan en paralelo, la probabilidad de conflicto de merge es proporcional a la intersección de sus conjuntos de archivos. El objetivo del pipeline es **intersección vacía por diseño**, no por "por favor no toques X" en el prompt.

### El issue como contrato de isla

Cada issue de asignación incluye un campo verificable de *territorio*:

```markdown
## Files Territory (hard constraint)
- CREATE: src/modules/pricing/validator.ts, tests/pricing/validator.test.ts
- MODIFY: none
- FORBIDDEN: everything else, incl. shared types, index barrels, lockfiles
```

Tres detalles que importan:

1. **`MODIFY: none` siempre que sea posible.** El código en islas nuevas se puede fusionar en cualquier orden; el código modificado fija un orden.
2. **Los barrels (`index.ts`) y lockfiles están prohibidos para agentes paralelos.** Son imanes de conflicto. La única persona que los toca es el reconciliador al cerrar la ola.
3. **El territorio se declara en el issue, no en un prompt libre.** Nuestro orquestador puede validar mecánicamente la disjunción de territorios entre issues de la misma ola *antes* de despachar — dos issues que se solapan se serializan automáticamente. La comprobación son 20 líneas de script sobre etiquetas del issue; el ahorro son oleadas enteras de reconcilio.

### ¿Y las interfaces compartidas?

Aquí es donde la micro-fragmentación y las islas se complementan: el tipo compartido no lo define el agente que lo consume, sino una **unidad de previo de la ola** — el corte (1) del ejemplo anterior. La ola 0 produce contratos compilados (types, traits, schemas) → la ola 1 produce implementaciones en islas que solo importan, nunca renegocian. Ningún agente paralelo define nunca una interfaz que otro agente paralelo espera.

---

## 4. Mecanismo 3: Verificación mecánica, no lectura de código

Una tarea anti-drift necesita un oráculo que no sea un humano cansado. Por orden de coste creciente, nuestro pipeline exige:

- **Compila/analiza estático** — `cargo check`, `tsc --noEmit`, `svelte-check`, linters con reglas que fallen el build (no adviertan).
- **Tests adjuntos en la misma isla** — el agente entrega implementación + tests; los tests viajan con la isla, no se escriben después.
- **Assertion de territorio** — CI falla el PR si `git diff --name-only` devuelve archivos fuera del territorio declarado. No negociable, sin excepciones con comentario.
- **Presupuesto de diff** — soft-check automático que etiqueta PRs >150 LOC netas como "fragmentar antes de revisar".

La regla cultural clave: **el CI es el reviewer senior; el humano es el arquitecto**. Si una verificación puede expresarse como test, no debe depender de un comentario de código. Los agentes cumplen la verificación mecánica ~3× mejor que las normas implícitas ("no cambies estilos aquí") porque la máquina no negocia ni se confunde con contexto.

---

## 5. El reconciliador neutral

Ni siquiera una arquitectura perfecta elimina todos los conflictos: las islas importan funciones que otras islas renombran sutilmente, dos agentes documentan el mismo comportamiento de formas incompatibles, o el territorio prohibido se viola accidentalmente.

Nuestro último recurso es un **reconciliador neutral**: un agente (o humano) con permisos de fusión que nunca escribió código en la ola. Su trabajo:

1. Aplicar orden de fusión topológico según los contratos de la ola 0.
2. Resolver conflictos **a favor de la implementación existente en `main`** cuando dos PRs colisionan en semántica — y cosechar el delta del perdedor (tests extra, fixes de accesibilidad, casos borde) antes de cerrarlo.
3. Nunca "mejorar" código durante el reconcilio. El reconciliador que refactoriza introduce drift de alcance a escala de ola completa.

Cerrar PRs en bloque como "duplicados" sin cosechar su delta es la forma más común de perder dinero ya gastado en tokens.

---

## 6. Resultados medidos

Aplicando los tres mecanismos sobre el mismo lote de trabajo de 12 issues descrito en nuestro benchmark de token economics:

| Métrica | Pipeline libre | Pipeline anti-drift | Δ |
|---|---|---|---|
| Drift Tax (tokens perdidos) | 21% | **7%** | −14 pp |
| Fusión primer intento | 58% | **73%** | +15 pp |
| Tiempo humano de reconcilio/ola | ~3.5 h | ~40 min | −80% |
| Retrabajo por conflictos de merge | 2.1 PRs/ola | 0.2 PRs/ola | −90% |

Ninguno de estos resultados vino de cambiar de modelo. Vinieron de cambiar la tubería.

---

## 7. Checklist de implementación

Para llevar esto a tu propio pipeline sin un año de iteración:

- [ ] Plantilla de issue con **Files Territory** (CREATE/MODIFY/FORBIDDEN) obligatoria.
- [ ] Validador pre-despacho que serialice issues con territorios solapados.
- [ ] Regla de corte: ninguna unidad >150 LOC netas; toda unidad fusible con CI verde sola.
- [ ] Ola 0 = contratos (types/schemas); olas N = implementaciones que solo importan.
- [ ] CI: assert de territorio + presupuesto de diff + linters en modo fail.
- [ ] Reconciliador neutral al final de cada ola; prohibido refactorizar durante el reconcilio.
- [ ] Delta harvesting obligatorio antes de cerrar cualquier PR como duplicado.

El modelo hace el código. **La arquitectura decide si el código sobrevivirá al resto del sistema.**
