# CLAUDE-planning.md - Planning Mode Configuration

> **This file must be loaded whenever planning work is requested.**
> Referenced from: `CLAUDE.md`

---

## Core Planning Principle: Ask Questions First

> **In planning mode, ALWAYS ask questions to clarify everything. Do NOT assume.**

### Ask Questions Tool - Required Usage

When planning and writing planning documentation, the **Ask Questions tool** must be used to:
- **Strengthen clarity** - Ensure requirements are unambiguous
- **Surface hidden constraints** - Discover limitations not initially stated
- **Expose missing requirements** - Find gaps in the specification

### Question Categories to Cover

| Category | Example Questions |
|----------|-------------------|
| **Scope** | What's in scope? What's explicitly out of scope? |
| **Users** | Who are the users? What are their technical levels? |
| **Constraints** | Performance requirements? Browser support? Accessibility? |
| **Dependencies** | External services? APIs? Data sources? |
| **Edge Cases** | What happens when X fails? Empty states? Error handling? |
| **Success Criteria** | How do we know this is done? What does success look like? |
| **Priorities** | What's most important? What can be deferred? |
| **Unknowns** | What don't we know yet? What needs research? |

### Questioning Rules

- ❌ Do NOT assume requirements that weren't explicitly stated
- ❌ Do NOT proceed with ambiguity
- ✅ Ask clarifying questions before designing
- ✅ Document answers in planning artifacts
- ✅ Re-ask if answers create new questions

---

## Planning Mode Entry Requirements

### 1. Planning Folder Requirement

Before creating ANY planning documents:

1. Verify `planning/` folder exists at project root
2. If `planning/` folder does **NOT** exist: **STOP immediately**
3. Prompt user: *"The planning folder does not exist. Please create a `planning/` folder in the project root, then we can continue."*
4. Only resume planning after user confirms folder creation

### 2. All Planning Documents Go in `planning/`

Never create planning documents outside the `planning/` folder.

---

## End-to-End Workflow Pipeline

The entire process must be executed as a structured pipeline:

| Step | Phase | Description |
|------|-------|-------------|
| 1 | Planning | Clarify and constrain the problem |
| 2 | Planning | Design with multiple approaches |
| 3 | Planning | Perform tradeoff analysis |
| 4 | Planning | Analyze failure modes (Top 10) |
| 5 | Planning | Define invariants |
| 6 | Planning | Assign subagents with explicit roles |
| 7 | Planning | Break work into atomic tasks |
| 8 | Planning | Write tests early as part of design |
| **⛔** | **GATE** | **STOP - Await user approval before proceeding** |
| 9 | Execution | Implement incrementally |
| 10 | Execution | Validate using Playwright where appropriate |
| 11 | Execution | Complete with multi-model reinforcement checks |

### Multi-Model Reinforcement Checks (Step 11)

Final validation must cover:
- **Correctness**: Does it do what it should?
- **Security**: Are there vulnerabilities?
- **UX/UI**: Is the interface intuitive and accessible?
- **Performance**: Does it meet performance requirements?

---

## Failure-First Planning

Planning must be **failure-first**, not success-first.

### Required Failure Analysis

The plan must explicitly identify and document:

1. **Top Ten Failure Modes** for the proposed solution
2. **Boundaries and Invariants**
   - What must NEVER break
   - What behaviors must ALWAYS remain true
3. **Adversarial Review Thinking** - Attempt to break your own design

### Required Adversarial Reviewer Viewpoints

Before finalizing any plan, adopt these critical perspectives:

| Reviewer | Perspective |
|----------|-------------|
| **Paranoid Staff Engineer** | Assumes everything can fail. What happens when it does? |
| **Over-Engineering Reviewer** | Believes the solution is too complex. Can it be simpler? |
| **Under-Specification Reviewer** | Believes requirements are missing or unclear. What's ambiguous? |

**Purpose**: Expose weak points BEFORE implementation begins.

### Failure Analysis Template

```markdown
## Failure Analysis

### Top 10 Failure Modes
1. [Failure mode] → [Impact] → [Mitigation]
2. [Failure mode] → [Impact] → [Mitigation]
...

### Invariants (Must ALWAYS be true)
- [ ] [Invariant 1]
- [ ] [Invariant 2]

### Boundaries (Must NEVER happen)
- [ ] [Boundary 1]
- [ ] [Boundary 2]

### Adversarial Review
**Paranoid Staff Engineer**: [Concerns]
**Over-Engineering Reviewer**: [Concerns]
**Under-Specification Reviewer**: [Concerns]
```

---

## Planning Definition of Done

A planning deliverable is **NOT COMPLETE** unless it ends with a **Decision Summary**.

### Required Decision Summary Contents

```markdown
## Decision Summary

### What Was Chosen and Why
[Explain the selected approach and reasoning]

### Short-Term Execution Path
[Immediate next steps and priorities]

### Long-Term Evolution Path
[How this will grow and change over time]

### Remaining Unknowns
[What we still don't know]

### Follow-Up Questions
[Questions that must be answered later]

### Dependency Mapping
- **Must exist first**: [Prerequisites]
- **Can be done in parallel**: [Independent work streams]
- **Blocks what**: [Downstream dependencies]
```

---

## TDD as Part of Design

Test-driven development must be applied as part of **planning**, not only during implementation.

### Tests Are Design Tools

Tests are treated as a **design tool**, not merely a verification step after coding.

During planning, define:
- What the tests will validate
- Why those tests represent correct behavior
- Expected inputs and outputs
- Edge cases and boundary conditions

### Implementation TDD Rules

When implementation begins:
1. Tests should be written **early**
2. Tests should **drive development**
3. Where practical, tests should be authored or reviewed by a **separate model/subagent**
   - This reduces shared blind spots
   - Improves correctness

### Test Planning Template

```markdown
## Test Strategy

### Unit Tests
| Component | Test Cases | Why These Tests |
|-----------|------------|-----------------|
| [Component] | [Cases] | [Reasoning] |

### Integration Tests
| Flow | Test Cases | Why These Tests |
|------|------------|-----------------|
| [Flow] | [Cases] | [Reasoning] |

### Edge Cases
- [Edge case 1]: [Expected behavior]
- [Edge case 2]: [Expected behavior]

### End-to-End Tests (Playwright)
- [User flow 1]: [Steps and assertions]
- [User flow 2]: [Steps and assertions]
```

---

## Subagent Strategy (Required for Planning)

Subagents must be used **intentionally**, and the decision to use them must be explicitly driven by planning.

### Planning Agent Must Decide

For every plan, explicitly state:
- **When** subagents should be spun up
- **What role** each subagent should play

### Required Planning Output: Subagent Strategy

The plan must include a clear subagent strategy:

```markdown
## Subagent Strategy

### Task Assignments
| Task | Assigned To | Why |
|------|-------------|-----|
| [Task] | [Subagent Role] | [Reasoning] |

### Subagent Roles
- **[Role Name]**: [What expertise/perspective they provide]

### Work Breakdown
- Primary agent tasks: [List]
- Subagent tasks: [List]
```

### Standard Subagent Roles for Planning

| Role | Responsibility |
|------|----------------|
| **Research Subagent** | Gathering requirements, investigating options |
| **Architecture Subagent** | Technical design, system structure |
| **Task Breakdown Subagent** | Decomposing work into atomic tasks |
| **Frontend Designer** | UX/UI structure and layout decisions |
| **Security Reviewer** | Threat modeling during design |

### Subagent Usage Rules

- ❌ Subagent usage must NOT be random or opportunistic
- ✅ Subagent usage must be a deliberate part of the plan
- ✅ Each subagent receives complete, updated context
- ✅ Main agent synthesizes all subagent outputs

### Subagent Context Template

When spawning a planning subagent, provide:
```markdown
## Subagent Context

### Objective
[What this subagent should accomplish]

### Background
[Project context and current state]

### Constraints
[Limitations and requirements]

### Decisions Made
[What has already been decided]

### Expected Output
[Format and content of deliverable]
```

---

## Required Planning Artifacts

Before planning is considered complete, the following artifacts must exist in `planning/`:

| Artifact | Filename | Purpose |
|----------|----------|---------|
| Product Requirements Document | `PRD.md` | What we're building and why |
| Component Designs | `component-designs.md` | Technical component specifications |
| Subagent Context | `subagent-context.md` | Context document for subagents |
| Execution Guide | `execution-guide.md` | Step-by-step implementation guide |
| Design System | `design-system.md` | UI/UX patterns and standards (if UI) |
| Tasks | `tasks.md` | Atomic task breakdown |
| Progress Log | `progress.md` | Ongoing progress tracking |
| Data Schema | `data-schema.md` | Data models and structures |
| Testing Plan | `testing-plan.md` | Test strategy and cases |
| Planning Complete Checklist | `planning-checklist.md` | Verification that planning is done |
| Design Brief | `design-brief.md` | Creative/design direction (if UI) |
| Decision Summary | `decision-summary.md` | Final decisions and rationale |
| **Planning Summary** | `planning-summary.md` | **All 11 pipeline steps documented** |
| Changelog | `CHANGELOG.md` | All changes logged |

---

## Task Breakdown Requirements

### Atomic Task Principles

- Break all tasks into **atomic, small pieces**
- Each task should be independently completable
- Include clear acceptance criteria
- Estimate complexity where possible

### Task Document Template

```markdown
## Tasks

### Epic: [Epic Name]

#### Task 1: [Task Name]
- **ID**: TASK-001
- **Description**: [What needs to be done]
- **Acceptance Criteria**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
- **Dependencies**: [Other tasks this depends on]
- **Complexity**: [Low/Medium/High]
- **Assigned to**: [Primary Agent / Subagent Role]

#### Task 2: [Task Name]
...
```

---

## Planning Complete Checklist

Use this checklist to verify planning is complete before requesting approval:

```markdown
# Planning Complete Checklist

## Questions Phase
- [ ] Asked clarifying questions using Ask Questions tool
- [ ] All answers documented
- [ ] No assumptions made without verification
- [ ] Hidden constraints surfaced
- [ ] Missing requirements exposed

## Required Artifacts
- [ ] PRD.md created and reviewed
- [ ] component-designs.md created
- [ ] subagent-context.md prepared
- [ ] execution-guide.md written
- [ ] design-system.md defined (if UI project)
- [ ] tasks.md with atomic task breakdown
- [ ] progress.md initialized
- [ ] data-schema.md defined
- [ ] testing-plan.md with TDD approach
- [ ] planning-checklist.md completed
- [ ] design-brief.md created (if UI project)
- [ ] decision-summary.md completed
- [ ] **planning-summary.md with all 11 steps documented**

## Failure-First Review
- [ ] Top 10 failure modes documented
- [ ] Invariants defined
- [ ] Adversarial review completed (3 perspectives)

## Subagent Strategy
- [ ] Subagent roles assigned
- [ ] Task assignments documented
- [ ] Context documents prepared

## Testing Strategy
- [ ] Unit tests defined
- [ ] Integration tests defined
- [ ] Playwright MCP tests planned for user flows
- [ ] Test cases documented in testing-plan.md

## Approval Gate
- [ ] **USER APPROVAL RECEIVED** ← Required before implementation
```

---

## Planning Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLANNING PHASE                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Verify planning/ folder exists (STOP if missing)            │
│  2. Clarify and constrain the problem                           │
│  3. Design with multiple approaches                             │
│  4. Perform tradeoff analysis                                   │
│  5. Analyze failure modes (TOP 10)                              │
│  6. Adversarial review (3 perspectives)                         │
│  7. Define invariants                                           │
│  8. Assign subagents with explicit roles                        │
│  9. Break work into atomic tasks                                │
│ 10. Write tests early as part of design                         │
│ 11. Create all required planning artifacts                      │
│ 12. Complete planning checklist                                 │
│ 13. Write Decision Summary                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ⛔ APPROVAL GATE - FULL STOP ⛔                     │
│         Present plan to user and WAIT for approval              │
│              DO NOT proceed without approval                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure for Planning

```
project-root/
├── planning/
│   ├── CHANGELOG.md                 # All changes logged here
│   ├── PRD.md                       # Product requirements
│   ├── component-designs.md         # Component specifications
│   ├── subagent-context.md          # Context for subagents
│   ├── execution-guide.md           # Implementation guide
│   ├── design-system.md             # UI patterns (if applicable)
│   ├── tasks.md                     # Atomic task breakdown
│   ├── progress.md                  # Progress tracking
│   ├── data-schema.md               # Data models
│   ├── testing-plan.md              # Test strategy (incl. Playwright)
│   ├── planning-checklist.md        # Planning completion check
│   ├── design-brief.md              # Creative direction (if applicable)
│   ├── decision-summary.md          # Final decisions
│   └── planning-summary.md          # All 11 pipeline steps documented
└── ...
```

---

## Quick Reference - Planning Mode

| Action | Requirement |
|--------|-------------|
| Start planning | **ASK QUESTIONS FIRST** - clarify everything |
| Assumptions | Do NOT assume - ask instead |
| Missing info | Use Ask Questions tool |
| Check folder | Verify `planning/` folder exists |
| Missing folder | STOP, ask user to create it |
| Multiple approaches | Document at least 2-3 options |
| Failure analysis | Document top 10 failure modes |
| Adversarial review | Apply 3 reviewer perspectives |
| Task breakdown | Atomic, independently completable tasks |
| Tests | Define during planning, not after |
| Subagents | Explicitly assign roles and tasks |
| End of planning | Create Planning Summary (all 11 steps) |
| Completion | All artifacts + checklist + Decision Summary |
| Before coding | **MUST have user approval** |

---

## End of Planning: Required Summary

**At the end of every planning phase, create a `planning-summary.md` document that explicitly documents how each of the 11 pipeline steps was addressed.**

### Planning Summary Template

```markdown
# Planning Summary

## 1. Clarify and Constrain the Problem
**Questions Asked:**
- [Question 1] → [Answer received]
- [Question 2] → [Answer received]

**Problem Statement:**
[Clear, constrained problem definition]

**Scope:**
- In scope: [list]
- Out of scope: [list]

---

## 2. Design with Multiple Approaches
**Approach A: [Name]**
- Description: [summary]
- Pros: [list]
- Cons: [list]

**Approach B: [Name]**
- Description: [summary]
- Pros: [list]
- Cons: [list]

**Approach C: [Name]** (if applicable)
- Description: [summary]
- Pros: [list]
- Cons: [list]

---

## 3. Tradeoff Analysis
| Criterion | Approach A | Approach B | Approach C |
|-----------|------------|------------|------------|
| Complexity | [rating] | [rating] | [rating] |
| Performance | [rating] | [rating] | [rating] |
| Maintainability | [rating] | [rating] | [rating] |
| Time to implement | [rating] | [rating] | [rating] |

**Selected Approach:** [Name]
**Reasoning:** [Why this approach was chosen]

---

## 4. Failure Mode Analysis
| # | Failure Mode | Impact | Likelihood | Mitigation |
|---|--------------|--------|------------|------------|
| 1 | [mode] | [impact] | [likelihood] | [mitigation] |
| 2 | [mode] | [impact] | [likelihood] | [mitigation] |
| ... | ... | ... | ... | ... |
| 10 | [mode] | [impact] | [likelihood] | [mitigation] |

---

## 5. Invariants Defined
**Must ALWAYS be true:**
- [ ] [Invariant 1]
- [ ] [Invariant 2]

**Must NEVER happen:**
- [ ] [Boundary 1]
- [ ] [Boundary 2]

---

## 6. Subagent Assignments
| Task/Area | Subagent Role | Reasoning |
|-----------|---------------|-----------|
| [task] | [role] | [why] |

**Context Prepared:** [Yes/No - reference to subagent-context.md]

---

## 7. Atomic Task Breakdown
**Total Tasks:** [number]
**Reference:** See `tasks.md` for full breakdown

**Summary by Epic:**
- Epic 1: [name] - [X tasks]
- Epic 2: [name] - [X tasks]

---

## 8. Test Strategy (TDD)
**Unit Tests Defined:** [count]
**Integration Tests Defined:** [count]
**E2E Tests Defined:** [count]

**Reference:** See `testing-plan.md` for full test specifications

**Key Test Cases:**
- [Critical test 1]
- [Critical test 2]

---

## 9. Implementation Plan
**Execution Order:**
1. [First phase/milestone]
2. [Second phase/milestone]
3. [Third phase/milestone]

**Reference:** See `execution-guide.md` for detailed steps

---

## 10. Playwright MCP Validation Plan
**User Flows to Validate:**
- [ ] [Flow 1]: [description]
- [ ] [Flow 2]: [description]

**UI Components to Test:**
- [ ] [Component 1]
- [ ] [Component 2]

**Responsive Breakpoints:**
- [ ] Mobile ([size])
- [ ] Tablet ([size])
- [ ] Desktop ([size])

---

## 11. Multi-Model Reinforcement Checks
**Correctness Review:**
- Assigned to: [subagent/model]
- Focus areas: [list]

**Security Review:**
- Assigned to: [subagent/model]
- Focus areas: [list]

**UX/UI Review:**
- Assigned to: [subagent/model]
- Focus areas: [list]

**Performance Review:**
- Assigned to: [subagent/model]
- Focus areas: [list]

---

## Planning Artifacts Completed
- [ ] PRD.md
- [ ] component-designs.md
- [ ] subagent-context.md
- [ ] execution-guide.md
- [ ] design-system.md (if UI)
- [ ] tasks.md
- [ ] progress.md (initialized)
- [ ] data-schema.md
- [ ] testing-plan.md
- [ ] planning-checklist.md
- [ ] design-brief.md (if UI)
- [ ] decision-summary.md
- [ ] **planning-summary.md** (this document)

---

## Ready for Approval
**All 11 steps completed:** [Yes/No]
**All artifacts created:** [Yes/No]
**Questions resolved:** [Yes/No]

⛔ **AWAITING USER APPROVAL BEFORE IMPLEMENTATION**
```

### Playwright MCP Emphasis

**Playwright MCP** must be used for testing, especially for:
- Verifying real user flows
- Ensuring behavior matches expectations
- Visual regression testing
- Interactive element validation
- End-to-end scenario completion

Include specific Playwright test plans in `testing-plan.md` and reference them in the Planning Summary.
