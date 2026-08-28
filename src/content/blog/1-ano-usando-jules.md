---
title: '1 Año Usando Jules: De la Experimentación al Desarrollo Autónomo por Oleadas Paralelas'
excerpt: 'Análisis técnico y retrospectiva tras 12 meses ejecutando oleadas masivas de subagentes con Google Jules, Hermes y GitCore: micro-fragmentación, islas de archivos disjuntas y feedback para escalar la ingeniería agéntica.'
date: '2026-08-28'
tags: ['Jules', 'AI Agents', 'GitCore', 'Hermes', 'Multi-Agent', 'Architecture']
draft: false
published: true
---

# 1 Año Usando Jules: De la Experimentación al Desarrollo Autónomo por Oleadas Paralelas

Hace doce meses, interactuar con agentes de código consistía en abrir una ventana de chat, pegar fragmentos de código, esperar una respuesta y copiar manualmente el diff resultante. Hoy, nuestro flujo de trabajo opera como una **fábrica de software asíncrona y determinista**: despachamos **oleadas de hasta 15 micro-tareas paralelas** a [Google Jules](https://github.com/google/jules), orquestadas por **Hermes** y gestionadas mediante la máquina de estados de **GitCore**.

Esta es la retrospectiva técnica de un año en las trincheras de la ingeniería agéntica: qué funcionó, qué falló, la arquitectura que desarrollamos para resolverlo y las áreas clave de mejora para el futuro.

---

## 1. La Tesis Central: El Problema no es el Modelo, es el Harness

El mayor error al evaluar coding agents autónomos es tratarlos como asistentes de conversación en lugar de **procesos de cómputo asíncronos**. 

Cuando asignas un feature complejo de 500 líneas a un solo agente en una sola sesión, ocurren tres fallos sistemáticos:
1. **Context Drift:** El agente consume la ventana de atención intentando razonar sobre dependencias cruzadas y olvida los invariantes iniciales.
2. **Monolithic Failure:** Si el agente falla en la línea 450, se pierde el 100% de la sesión de trabajo.
3. **Merge Blocking:** Un PR monolítico de 20 archivos paraliza el pipeline de integración continua.

La solución no fue esperar modelos con ventanas de contexto infinitas, sino diseñar una **arquitectura de orquestación externa** basada en dos pilares: **Micro-Fragmentación** e **Islas de Archivos Disjuntas**.

---

## 2. El Patrón de Micro-Fragmentación

En lugar de crear un issue titulado *"Implementar subsistema de telemetría y sincronización P2P"*, descomponemos cada feature en una cuadrilla de **3 a 4 micro-issues atómicos**:

```
┌──────────────────────────────────────────────────────────────────┐
│                   FEATURE MICRO-FRAGMENTATION                    │
├──────────────────────────────────────────────────────────────────┤
│  [Micro-Issue A] Contratos & Tipos (1 archivo, <80 líneas)      │
│  └── Structs, traits, enums y definiciones de interfaz          │
│                                                                  │
│  [Micro-Issue B] Lógica de Núcleo (1-2 archivos, <150 líneas)   │
│  └── Algoritmos, parsers, state machines y serialización         │
│                                                                  │
│  [Micro-Issue C] Integración / IPC / CLI (1-2 archivos)          │
│  └── Endpoints Axum, listeners Unix domain sockets, CLI flags    │
│                                                                  │
│  [Micro-Issue D] Suites de Pruebas Unitarias y E2E (1 archivo)   │
│  └── Fixtures mock, aserciones deterministas, tests de regresión │
└──────────────────────────────────────────────────────────────────┘
```

### ¿Por qué funciona este patrón?
- **Tiempo de Ejecución Predecible:** Cada sesión de Jules resuelve su objetivo en **10 a 25 minutos**.
- **Cero Desbordamiento de Contexto:** El agente opera enfocado exclusivamente en una interfaz acotada.
- **Tasa de Entrega del 100%:** Los Pull Requests son concisos, limpios y triviales de auditar antes del merge.

---

## 3. Matriz de Islas de Archivos Disjuntas (Disjoint File Islands)

Cuando ejecutas 15 agentes concurrentes en un mismo repositorio Git, la probabilidad de conflicto de merge se aproxima al 100% si no existe aislamiento espacial.

Para neutralizar este problema, implementamos una regla estricta: **Cada micro-tarea debe operar en una isla de archivos aislada.**

```python
# Verificador de Islas de Archivos en Python (Pre-Dispatch QA)
islands = {
    '#01_types':       ['crates/core/src/types.rs'],
    '#02_state':       ['crates/core/src/state.rs'],
    '#03_ipc_codec':   ['crates/net/src/codec.rs'],
    '#04_rest_router': ['crates/api/src/router.rs'],
    '#05_storage_vfs': ['crates/vfs/src/sandbox.rs'],
    '#06_tests_unit':  ['crates/core/tests/test_state.rs'],
    # ... hasta 15 micro-tareas 100% aisladas
}

for i1, f1 in islands.items():
    for i2, f2 in islands.items():
        if i1 < i2 and set(f1) & set(f2):
            raise ValueError(f"CONFLICTO DETECTADO: {i1} y {i2} colisionan en {set(f1) & set(f2)}")
print("✅ 100% Disjoint File Islands Verified!")
```

Si dos issues necesitan interactuar, la dependencia se resuelve a través de **orden de merge secuencial en ramas upstream**, nunca permitiendo que dos agentes concurrentes editen el mismo archivo simultáneamente.

---

## 4. El Ciclo de Vida de 7 Fases (Simulando Sprints en 30 Minutos)

El desarrollo en nuestro ecosistema opera simulando sprints completos mediante **oleadas (waves)** de 7 fases:

```
┌──────────────────────────────────────────────────────────────────┐
│                    7-PHASE WAVE LIFECYCLE                        │
├──────────────────────────────────────────────────────────────────┤
│  FASE 0: PRE-WAVE                                               │
│  ├── Lectura de .gitcore/features.json (features < 100%)         │
│  └── Asegurar baseline limpia (cargo test / npm test = 0 errores)│
│                                                                  │
│  FASE 1: INVESTIGACIÓN + MICRO-DISEÑO                           │
│  ├── Lectura completa de archivos objetivo (evitar suposiciones) │
│  └── Construcción de la matriz de islas de archivos disjuntas    │
│                                                                  │
│  FASE 2: CREACIÓN DE ISSUES (SIN label 'jules')                 │
│  ├── Redacción con template profesional canónico                 │
│  └── Guardado de bodies en .hermes/olaN/body-XX.md               │
│                                                                  │
│  FASE 3: AUDITORÍA PRE-DISPATCH                                 │
│  ├── Verificación de Criterios de Aceptación (Gherkin)           │
│  └── Validación de 0 colisiones entre rutas                      │
│                                                                  │
│  FASE 4: DISPATCH SIMULTÁNEO                                    │
│  └── Aplicación del label 'jules' en bloque (15 issues paralelos)│
│                                                                  │
│  FASE 5: MONITOREO ASÍNCRONO                                    │
│  └── Prioridad absoluta a la lista de PRs sobre logs de sesión  │
│                                                                  │
│  FASE 6: MERGE SECUENCIAL ESTRATÉGICO                           │
│  └── Stubs/Types → Core Logic → Consumers/API → Integration/Tests│
│                                                                  │
│  FASE 7: RECONCILIACIÓN + MÉTRICAS                              │
│  ├── Actualización de porcentaje en features.json                │
│  └── Suite completa de tests verdes en main                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. El Rol de Hermes, GitCore y Xavier

El éxito de este modelo descansa en la triada de infraestructura que construimos alrededor de Jules:

1. **[GitCore](https://github.com/iberi22/GitCore):** Motor de automatización sobre Git/GitHub. Mantiene el contrato determinista **1 Issue → 1 Rama → 1 PR** y el seguimiento de features en `.gitcore/features.json`.
2. **Hermes:** Gateway y despachador de alta velocidad que gestiona el ciclo de vida de los subagentes, la creación de workspaces efímeros y los guardrails de herramientas.
3. **[Xavier](https://github.com/iberi22/xavier):** Núcleo de memoria cognitiva vectorial y relacional. Permite consultar decisiones arquitectónicas previas para que la redacción de los issues de la siguiente oleada esté fundamentada en el estado real del sistema.

---

## 6. Feedback y Áreas de Mejora para Subir de Nivel

Tras un año de iteración intensiva, identificamos 4 áreas críticas donde el flujo puede optimizarse aún más:

### 1. Aserción de Invariantes Semánticos en CI
- **Situación actual:** La matriz de islas previene conflictos de archivos a nivel de Git, pero no siempre detecta incompatibilidades de firmas en compilación cuando un módulo dependiente asume un trait desactualizado.
- **Acción de mejora:** Implementar un hook en CI que valide el árbol de tipos Rust/TypeScript contra las ramas entrantes de la misma oleada antes del merge final.

### 2. Presupuesto Dinámico de Pasos y Detección de Bloqueos
- **Situación actual:** En raras ocasiones, un agente puede entrar en un bucle intentando compilar dependencias pesadas hasta que expira el timeout de 1 hora.
- **Acción de mejora:** Configurar alertas de telemetría temprana cuando una sesión de Jules supere los 20 minutos sin generar un commit inicial.

### 3. Ingestión Automática de PR Diffs hacia Xavier (Memoria Viva)
- **Situación actual:** La reconciliación de la memoria requiere indexación manual o scripts periódicos.
- **Acción de mejora:** Conectar un webhook de GitHub que envíe el AST diff y la descripción de cada PR mergeado directamente a la API de Xavier (`POST /v1/memories`), cerrando el ciclo de retroalimentación de contexto automáticamente.

### 4. Sandboxing Efímero para Pruebas Flaky
- **Situación actual:** Los tests de integración con sockets o temporizadores pueden generar falsos negativos en runners de CI compartidos.
- **Acción de mejora:** Contenedorizar los arneses de test E2E con entornos virtuales aislados por cada PR.

---

## 7. Conclusión: El Futuro de la Ingeniería de Software

La lección definitiva de este año es clara: **la productividad 10x no proviene de escribir código más rápido con un autocompletado en el editor, sino de diseñar sistemas que permitan orquestar enjambres autónomos en paralelo de forma determinista.**

Jules, coordinado con un harness riguroso como GitCore y Hermes, convierte la gestión de sprints en un proceso continuo de alto rendimiento: lo que antes tomaba dos semanas de desarrollo secuencial ahora se materializa en oleadas estructuradas de 30 minutos, con tests verificados, cero especulación y código listo para producción.
