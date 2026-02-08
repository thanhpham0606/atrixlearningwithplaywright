# CLAUDE.md - Global Claude Code Configuration

## Critical File References

> ⚠️ **MANDATORY LOADING REQUIREMENTS**
>
> **When ANY planning work is requested:**
> - STOP and load `CLAUDE-planning.md` first
> - Fully understand all planning requirements before proceeding
> - This includes: new features, architecture changes, project initialization, task breakdown
>
> **When ANY UI work is requested:**
> - STOP and load `CLAUDE-ui.md` first
> - Fully understand all UI requirements before proceeding
> - This includes: frontend changes, styling, components, visual elements, user interactions
>
> **When BOTH planning AND UI are involved:**
> - Load BOTH files before proceeding

---

## Project Structure

- **Primary Working Directory**: Project root directory
- **Planning Documents**: All planning-related documents go in `planning/` folder
- **UI Content**: Look for `content/` subfolder for pictures and UI-related assets
- **On New Project Init**: Create project-specific `CLAUDE.md` at project root

---

## Core Workflow Rule

> **Planning must happen first, planning must stop at a clear approval gate, and coding must begin only after the plan is approved.**

This is non-negotiable. No implementation begins without explicit plan approval from the user.

---

## Operating Modes

### Planning Mode
→ **See `CLAUDE-planning.md` for complete planning requirements**

### Normal Mode (Implementation)

#### Session Initialization (Required Every Session)

> **At the start of EVERY fresh Claude Code session in normal mode, MUST read:**

1. **Project Documentation**
   - `CLAUDE.md` (project-specific if exists)
   - `planning/PRD.md`
   - `planning/execution-guide.md`
   - Any other relevant planning docs

2. **Codebase Understanding**
   - Review project structure
   - Understand key files and their purposes
   - Check current implementation state

3. **Changelog Review**
   - Read `planning/CHANGELOG.md`
   - Understand recent changes
   - Know what was last worked on

4. **Progress Check**
   - Read `planning/progress.md`
   - Know current task status
   - Understand what's next

**Purpose:** Understand where we are and what we're working on before taking any action.

---

#### Main Agent Role

> **The main agent ONLY interacts with the user and manages subagent contexts.**

The main agent's job is to:
- Communicate with the user
- Delegate work to subagents
- Synthesize subagent outputs
- Keep context window short by not doing implementation directly

The main agent does NOT:
- Implement fixes directly
- Write large amounts of code
- Do deep investigation without subagents

---

#### Fix Request Workflow

When a user asks for a fix, follow this workflow:

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: INVESTIGATION (Before any implementation)             │
├─────────────────────────────────────────────────────────────────┤
│  Main Agent → Spawn Investigation Subagent                      │
│  Subagent investigates and proposes solution                    │
│  Subagent reports findings back to Main Agent                   │
│  Main Agent presents proposal to User                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: USER APPROVAL                                          │
├─────────────────────────────────────────────────────────────────┤
│  User reviews proposal                                          │
│  User approves / requests changes / provides direction          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: IMPLEMENTATION (Subagents only)                        │
├─────────────────────────────────────────────────────────────────┤
│  Main Agent → Spawn Implementation Subagent(s)                  │
│  ONE subagent PER fix (separate subagents for each fix)         │
│  Each subagent implements its assigned fix                      │
│  Each subagent reports completion to Main Agent                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: CODE REVIEW (After all fixes complete)                 │
├─────────────────────────────────────────────────────────────────┤
│  Main Agent → Spawn Code Reviewer Subagent                      │
│  Reviewer examines ALL changes made                             │
│  Reviewer reports findings to Main Agent                        │
│  Main Agent presents review to User                             │
│  User can request additional fixes → Return to Step 3           │
└─────────────────────────────────────────────────────────────────┘
```

#### Fix Workflow Rules

| Rule | Description |
|------|-------------|
| **Always investigate first** | Never implement without investigation and proposal |
| **Use subagents for investigation** | Main agent doesn't investigate directly |
| **Separate subagents per fix** | Each fix gets its own implementation subagent |
| **Main agent stays lean** | Only manages context and communicates with user |
| **Always code review** | Spawn reviewer subagent after all fixes complete |
| **User controls flow** | User approves proposals and can request more fixes |

---

#### Standard Workflow Operations

1. **Verify Plan Approval**
   - Confirm user has approved the plan before any implementation
   - Reference `planning/` artifacts during implementation

2. **Changelog Maintenance**
   - Maintain `planning/CHANGELOG.md` for all changes
   - Log entries for every: **ADD**, **FIX**, **CHANGE**
   - Format:
     ```markdown
     ## [Date] - Brief Description
     - **Type**: ADD | FIX | CHANGE
     - **Files affected**: list of files
     - **Description**: What was done
     - **Related task**: Reference to task if applicable
     ```

3. **Progress Logging**
   - Update `planning/progress.md` after **every atomic task completion**
   - Include: task completed, code written/modified, time/date, tests added, blockers/notes

---

## Execution and Progress Reporting

### Context Window Management

**When operating in Normal Mode with multiple tasks:**

- Monitor context window usage throughout execution
- **When context reaches ~100K tokens**: Stop at the next natural task boundary
- Do NOT continue consuming context beyond 100K
- Before stopping, provide the user with:
  - Summary of completed tasks
  - Current state of implementation
  - Next task(s) to be executed
  - Any relevant context needed to continue
  - Reference to `planning/progress.md` for full state

### Progress Update Requirements

**After every atomic task completion**, update `planning/progress.md` with:
- Task completed
- Files changed
- Tests added/modified
- Current status
- Next steps

### Subagent Context Requirements

All context provided to subagents must be **complete and updated**:
- Current plan
- Constraints and assumptions
- Decisions made
- Relevant state of implementation
- Recent changes

---

## Subagent Policy

### Main Agent Responsibilities

> **The main agent's primary role is communication and coordination, NOT implementation.**

The main agent:
- Communicates with the user
- Reads project state at session start
- Delegates ALL work to subagents
- Provides context to subagents
- Synthesizes subagent outputs
- Reports results to user
- Keeps its own context window lean

### When to Use Subagents

**Always use subagents for:**
- Investigation and analysis
- Implementation of fixes (one subagent per fix)
- Code reviews
- Planning activities (see `CLAUDE-planning.md`)
- Research and analysis
- Testing coordination

**Standard Subagent Roles:**

| Role | Responsibility |
|------|----------------|
| **Investigation Subagent** | Analyze issues, propose solutions |
| **Implementation Subagent** | Execute fixes (one per fix) |
| **Frontend Designer** | UX/UI structure and layout (see `CLAUDE-ui.md`) |
| **Code Reviewer** | Review all changes after implementation |
| **Security Reviewer** | Threat modeling and vulnerability discovery |
| **Test Author** | Independent test creation |
| **Architecture Reviewer** | System design validation |

### Subagent Context Requirements

When spawning any subagent, provide:
- Clear objective
- Relevant file paths and code
- Current project state
- Constraints and requirements
- Expected output format
- Reference to planning docs if applicable

---

## Code Review Process

**After every implementation change:**

1. Use code reviewer subagent to review changes
2. Generate review feedback covering:
   - Code quality
   - Best practices adherence
   - Potential issues
   - Suggested improvements
   - Security concerns
   - Performance implications
3. Present review findings to user
4. Wait for user decision:
   - **Approve**: Proceed as-is
   - **Implement suggestions**: Apply recommended changes
   - **Enhance**: Make additional improvements
5. Log final state in changelog

---

## Project Initialization

When starting a new project:

- [ ] Create project-specific `CLAUDE.md` at project root
- [ ] Create `planning/` folder
- [ ] Create `content/` folder (if UI project)
- [ ] Load `CLAUDE-planning.md` for planning requirements
- [ ] Load `CLAUDE-ui.md` if UI is involved

### Basic File Structure

```
project-root/
├── CLAUDE.md                    # Project-specific config
├── content/                     # UI assets (if applicable)
├── planning/
│   ├── CHANGELOG.md
│   ├── progress.md
│   ├── tasks.md
│   └── [other planning docs]   # See CLAUDE-planning.md
└── [project files]
```

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| **Fresh session start** | **READ: project docs, codebase, changelog, progress FIRST** |
| **Any planning work** | **LOAD `CLAUDE-planning.md` FIRST** |
| **Any UI work** | **LOAD `CLAUDE-ui.md` FIRST** |
| **User asks for a fix** | **Investigate with subagent FIRST, then propose** |
| **Implementing fixes** | **Use separate subagent for EACH fix** |
| **After fixes complete** | **Spawn code reviewer subagent** |
| **Main agent role** | **Only communicate + manage subagents** |
| Starting planning | Verify `planning/` folder exists (STOP if not) |
| Before implementation | **MUST have user approval** |
| After implementation | Run code review via subagent |
| Task completed | Update `progress.md` immediately |
| Code changed | Update `CHANGELOG.md` |
| Complex task | Delegate to subagent with full context |
| **Context reaches 100K** | **STOP at next task, provide handoff summary** |

---

## File Reference Summary

| File | When to Load | Contains |
|------|--------------|----------|
| `CLAUDE.md` | Always loaded | Core rules, normal mode, execution |
| `CLAUDE-planning.md` | Planning work requested | Full planning methodology, artifacts, failure analysis |
| `CLAUDE-ui.md` | UI work requested | Frontend guidelines, Playwright testing, design system |
