# CLAUDE-ui.md - UI/Front-End Configuration

> **This file must be loaded whenever UI work is requested.**
> Referenced from: `CLAUDE.md`

---

## Tech Stack Selection

### User-Specified Stack

> **If the user specifies a specific tech stack, USE THAT STACK.**
> Only use the guidelines below if the user doesn't specify or asks for help choosing.

### AI Tool Configuration for UI

During planning, the user should specify which AI tool handles UI design and components:

| Mode | Description | When to Use |
|------|-------------|-------------|
| **Claude Code** | Claude handles all UI design, components, and implementation | Full Claude Code workflow |
| **Gemini** | Gemini handles design analysis, image generation, and content; Claude handles coding | Design-heavy projects needing image generation |
| **Partially** | Hybrid approach - split responsibilities between tools | Complex projects needing both strengths |

#### Gemini + Claude Workflow (When Using Gemini or Partially)

```
┌─────────────────────────────────────────────────────────────────┐
│  GEMINI: Design & Content                                       │
├─────────────────────────────────────────────────────────────────┤
│  - Design analysis (extract style specs from reference sites)   │
│  - Generate images, illustrations, backgrounds                  │
│  - Generate copy: headlines, subheads, microcopy                │
│  - Determine best tech stack for project                        │
│  - Validate designs and provide feedback                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CLAUDE: Planning & Code                                        │
├─────────────────────────────────────────────────────────────────┤
│  - Planning and architecture                                    │
│  - Implementation and coding                                    │
│  - Code review                                                  │
│  - Testing                                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  GEMINI: Validation                                             │
├─────────────────────────────────────────────────────────────────┤
│  - Review implemented UI                                        │
│  - Provide design feedback                                      │
│  - Suggest improvements                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Guidelines

### Stack Selection Criteria

If user asks for help choosing or doesn't specify, consider:

| Criterion | Questions to Ask |
|-----------|------------------|
| **Project Type** | Landing page? Full app? Content site? Dashboard? |
| **Content Updates** | Static? Frequently changing? CMS needed? |
| **Interactivity** | Simple? Animation-heavy? Complex interactions? |
| **SEO Requirements** | Critical? Moderate? Not important? |
| **Team Familiarity** | React? Vue? Svelte? |
| **Deployment** | Vercel? GitHub Pages? Self-hosted? |

### Recommended Stacks Summary

| Option | Stack | Best For |
|--------|-------|----------|
| **1** | Next.js + Tailwind + shadcn/ui + Framer Motion | **Best overall** - premium web apps, scalable |
| **2** | Vite + React + Tailwind + shadcn/ui | Fast iteration, simple deploy, SPAs |
| **3** | Astro + Tailwind + MDX | Content-first, marketing, best SEO |
| **4** | SvelteKit + Tailwind + Skeleton UI | Smooth interactions, minimal code |
| **5** | Nuxt 3 + Tailwind + Nuxt UI | Vue ecosystem, clean patterns |
| **6** | Next.js + Tailwind + shadcn + Sanity | Headless CMS, frequent content changes |
| **7** | Next.js + Tailwind + Framer Motion + R3F | Ultra-visual, motion-heavy |

---

## Option 1: Premium Landing + App (Best Overall)

**Stack:** Next.js (App Router) + Tailwind + shadcn/ui + Framer Motion

**Best for:** Modern premium web apps, landing pages + dashboards, long-term scalable UI

### Setup Commands

```bash
npx create-next-app@latest my-site --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-site
npx shadcn@latest init
npm i framer-motion lucide-react
```

### Folder Layout

```
src/
  app/
    layout.tsx
    page.tsx
  components/
    ui/               # shadcn components
    sections/         # Hero, Features, Testimonials...
  lib/
    design-tokens.ts
```

### Design Tokens Starter

Create `src/lib/design-tokens.ts`:

```typescript
export const tokens = {
  radius: "2xl",
  container: "max-w-6xl",
  sectionPad: "py-16 md:py-24",
  card: "rounded-2xl border bg-background shadow-sm",
  muted: "text-muted-foreground",
};
```

### Gemini Prompts (if using Gemini mode)

- "Extract style spec from these 3 websites: typography scale, spacing scale, button/card recipes, motion rules."
- "Generate 10 hero headlines + 10 subheads for [your product]."
- "Generate 3 hero background images: abstract premium, soft gradients, minimal tech."

### Claude Code Workflow

1. Paste style spec into `planning/design-system.md`
2. Implement sections in `components/sections/*`
3. Keep all spacing/type consistent with tokens

### Why This Stack Looks Great

- shadcn gives high-end base without "template look"
- Tailwind makes it fast to match AI-generated design spacing
- Motion + hover/focus polish = instant "wow"

---

## Option 2: Fast SPA (Simple Deploy)

**Stack:** Vite + React + Tailwind + shadcn/ui + Framer Motion

**Best for:** Fast iteration, SPA-style sites, static hosting (GitHub Pages), simple deployments

### Setup Commands

```bash
npm create vite@latest my-site -- --template react-ts
cd my-site
npm i
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i lucide-react framer-motion
# For shadcn: follow Vite install steps in shadcn docs
# Or ask Claude: "install shadcn for Vite"
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Folder Layout

```
src/
  pages/          # or routes/
  components/
    ui/
    sections/
  lib/
    design-tokens.ts
```

### Gemini Prompts

- "Give me 3 layout variants for a landing page: hero + features + social proof + pricing + FAQ."
- "Generate concise microcopy: button labels, form hints, empty states."

### Claude Code Workflow

1. Build 1-page layout first
2. Add animations after layout is stable

---

## Option 3: Content-First Marketing + Blog (Best SEO)

**Stack:** Astro + Tailwind + MDX (+ React islands if needed)

**Best for:** Beautiful marketing sites, content-heavy pages, fastest-feeling UI

### Setup Commands

```bash
npm create astro@latest my-site
cd my-site
npm i
npx astro add tailwind
npx astro add mdx
# Optional React components:
npx astro add react
npm i framer-motion lucide-react
```

### Folder Layout

```
src/
  pages/
    index.astro
    blog/
  components/
    sections/       # Astro or React
  content/
    blog/           # MDX files
```

### Gemini Prompts

- "Generate 12 blog post ideas + outlines for [topic]."
- "Write 3 versions of the homepage copy: short, medium, bold."
- "Generate feature illustrations (simple, flat, brand-consistent)."

### Claude Code Workflow

1. Use Astro for layout + sections
2. Use React only for interactive islands (filters, pricing toggle)

### Why This Stack Feels Premium

- Astro produces very "clean" pages = smooth + fast
- Great for editorial layout and "Apple-style" marketing
- Islands let you sprinkle interactivity without heavy app

---

## Option 4: Ultra Smooth Interactive UI

**Stack:** SvelteKit + Tailwind (or UnoCSS) + Skeleton UI

**Best for:** Slick UI with less code, animation-heavy interfaces, "modern feel"

### Setup Commands

```bash
npm create svelte@latest my-site
cd my-site
npm i
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i @skeletonlabs/skeleton
```

### Folder Layout

```
src/
  routes/
  lib/
    components/
    sections/
    design-tokens.ts
```

### Gemini Prompts

- "Design a SvelteKit landing page with subtle transitions and a premium minimal vibe."
- "Give me animation guidelines: durations, easing, hover behaviors."

### Claude Code Workflow

1. Use Svelte transitions for "premium feel"
2. Keep UI consistent via Skeleton themes + your tokens

### Why This Stack Looks Amazing

- Svelte makes UI feel smooth and alive with less effort
- Great for micro-interactions and fluid motion

---

## Option 5: Vue-Friendly Premium Sites

**Stack:** Nuxt 3 + Tailwind + Nuxt UI

**Best for:** Vue fans, fast development, clean component patterns

### Setup Commands

```bash
npx nuxi init my-site
cd my-site
npm i
npx nuxi@latest module add tailwind
npm i @nuxt/ui lucide-vue-next
```

### Folder Layout

```
components/
  sections/
pages/
  index.vue
lib/
  design-tokens.ts
```

### Gemini Prompts

- "Create a Nuxt homepage section plan + component list."
- "Generate 3 tone variants: corporate, playful, luxury."

### Claude Code Workflow

1. Use Nuxt UI components as base
2. Customize spacing/type with Tailwind tokens

---

## Option 6: Headless CMS (Content Changes Often)

**Stack:** Next.js + Tailwind + shadcn + Sanity

**Best for:** Sites where content changes frequently, marketing teams need to update without code

### Setup Commands

```bash
# In your Next app
npm i next-sanity sanity

# Create Sanity studio
npm create sanity@latest
```

### Gemini Prompts (Content Model)

- "Define CMS schema for: homepage hero, features, testimonials, pricing, FAQ, blog posts."

### Claude Code Workflow

1. CMS defines content shape
2. Frontend renders blocks/components
3. Regenerate copy/images without touching code

---

## Option 7: Ultra-Visual Landing Pages (Motion-Heavy)

**Stack:** Next.js + Tailwind + Framer Motion (+ React Three Fiber optional)

**Best for:** Highly visual, animation-heavy experiences

### Setup Commands

Same as Option 1, plus:

```bash
npm i @react-three/fiber three
```

### Gemini Prompts

- "Generate 5 hero concepts: layout + background style + motion idea."
- "Generate a color system: 1 primary, 1 accent, neutrals, gradients."

### Claude Code Workflow

1. Start with a static hero
2. Add motion as the final pass
3. Keep performance tight (don't animate everything)

---

## Stacks to Avoid (If You Want "Non-Generic Premium")

These are powerful but often look "default" unless heavily customized:

| Stack | Issue |
|-------|-------|
| MUI / Material UI | Instantly recognizable Google style |
| Ant Design | Recognizable enterprise look |
| Bootstrap-heavy | Generic feel without heavy customization |

Not bad — just harder to make truly unique without significant effort.

---

## Secret Sauce Add-Ons (Works With Any Stack)

### Design Tokens via CSS Variables

So Claude can keep consistent spacing/colors across all components.

### SVG Pipeline

- SVGR (React) to import AI-generated SVG assets cleanly

### Premium Motion

- Framer Motion (best polish)
- Motion One (lighter alternative)

### Automatic UI Checking

- Playwright screenshots at breakpoints
- Claude can self-correct layout mismatches

---

## Core UI Rule

> **Always consult front-end design skills for ANY UI work, even when a design contract or spec already exists.**

This applies to:
- Planning mode UI work
- Normal mode UI additions
- Normal mode UI modifications
- Any change affecting visual presentation or user interaction

---

## Front-End Design Skill Reference

**Always reference:** `/mnt/skills/public/frontend-design/SKILL.md`

Before any UI work:
1. Load and read the front-end design skill
2. Apply its best practices to your work
3. Ensure alignment with established patterns

---

## UI Content Folder

### Location and Purpose

When working with UI projects, look for the `content/` subfolder at project root:

```
project-root/
├── content/
│   ├── images/          # Photos, illustrations, backgrounds
│   ├── icons/           # Icon assets
│   ├── logos/           # Brand logos
│   └── [other assets]   # Any other UI-related content
└── ...
```

### Usage Rules

- **Always check** `content/` folder for existing assets before creating new ones
- **Use existing assets** in implementations when available
- **Reference assets** in design documents and component specs
- **Organize new assets** into appropriate subfolders
- **Document asset usage** in component designs

---

## UI Planning Requirements

When planning involves UI, create these artifacts in `planning/`:

| Artifact | Filename | Purpose |
|----------|----------|---------|
| Design System | `design-system.md` | Colors, typography, spacing, patterns |
| Component Designs | `component-designs.md` | Individual component specifications |
| Design Brief | `design-brief.md` | Creative direction and visual goals |

### Design System Template

```markdown
# Design System

## Tech Stack
[Specified stack or recommended from guidelines]

## AI Tool Mode
[Claude Code / Gemini / Partially]

## Colors
### Primary
- Primary: [hex] - [usage]
- Primary Light: [hex] - [usage]
- Primary Dark: [hex] - [usage]

### Secondary
- Secondary: [hex] - [usage]

### Neutrals
- Background: [hex]
- Surface: [hex]
- Text Primary: [hex]
- Text Secondary: [hex]

### Semantic
- Success: [hex]
- Warning: [hex]
- Error: [hex]
- Info: [hex]

## Typography
### Font Families
- Headings: [font]
- Body: [font]
- Code: [font]

### Scale
- H1: [size/weight/line-height]
- H2: [size/weight/line-height]
- Body: [size/weight/line-height]
- Small: [size/weight/line-height]

## Spacing
- xs: [value]
- sm: [value]
- md: [value]
- lg: [value]
- xl: [value]

## Border Radius
- sm: [value]
- md: [value]
- lg: [value]
- full: [value]

## Shadows
- sm: [value]
- md: [value]
- lg: [value]

## Breakpoints
- mobile: [value]
- tablet: [value]
- desktop: [value]
- wide: [value]
```

### Component Design Template

```markdown
# Component Designs

## Component: [Name]

### Purpose
[What this component does]

### Visual Specification
- Dimensions: [width/height]
- Padding: [values]
- Margin: [values]
- Background: [color/style]
- Border: [style]
- Border Radius: [value]

### States
- Default: [description]
- Hover: [description]
- Active: [description]
- Disabled: [description]
- Focus: [description]
- Error: [description]

### Content
- Text: [specs]
- Icons: [from content/ folder]
- Images: [from content/ folder]

### Responsive Behavior
- Mobile: [behavior]
- Tablet: [behavior]
- Desktop: [behavior]

### Accessibility
- ARIA labels: [requirements]
- Keyboard navigation: [requirements]
- Screen reader: [requirements]

### Assets Used
- [asset path from content/]
```

---

## UI Implementation Workflow

### Planning Mode

1. **Determine AI tool mode** (Claude Code / Gemini / Partially)
2. **Select or confirm tech stack**
3. **Consult front-end design skill** for all UI-related planning
4. **Review existing assets** in `content/` folder
5. **Document component designs** in `planning/component-designs.md`
6. **Define design system** in `planning/design-system.md`

### Implementation Mode

1. **Consult front-end design skill** before any UI changes
2. **Follow tech stack guidelines** for chosen stack
3. **Use assets** from `content/` folder
4. **Follow design system** specifications
5. **Implement incrementally** - one component at a time
6. **Validate with Playwright MCP** after implementation
7. **Run code review** via subagent
8. **If using Gemini mode**: Send to Gemini for validation

---

## UI Testing with Playwright MCP

### When to Use Playwright

Use Playwright MCP for:
- UI behavior verification
- User flow testing
- Integration-level interactions
- Visual regression checks
- Responsive design validation
- Auto screenshot at breakpoints (Claude can self-correct)

### Before Marking UI Tasks Complete

1. **Spin up the application** using Playwright MCP
2. **Visually verify** UI renders correctly
3. **Check interactive elements** function properly
4. **Capture screenshots** if needed
5. **Test user flows** end-to-end

### Test Scope

| Test Type | What to Check |
|-----------|---------------|
| Component Rendering | Elements appear correctly |
| Layout Verification | Spacing, alignment, positioning |
| Interactive Elements | Buttons, forms, links work |
| Responsive Behavior | Adapts to screen sizes |
| User Flow Completion | Multi-step processes work |
| Integration Points | Components work together |

### Playwright Test Template

```markdown
## UI Test Results

### Test Environment
- Browser: [browser]
- Viewport: [dimensions]
- Date: [date]

### Component Tests
| Component | Status | Notes |
|-----------|--------|-------|
| [Component] | ✅/❌ | [Notes] |

### User Flow Tests
| Flow | Steps | Status | Notes |
|------|-------|--------|-------|
| [Flow] | [Steps] | ✅/❌ | [Notes] |

### Visual Issues Found
- [Issue 1]: [Description and screenshot reference]

### Responsive Tests
| Breakpoint | Status | Notes |
|------------|--------|-------|
| Mobile | ✅/❌ | [Notes] |
| Tablet | ✅/❌ | [Notes] |
| Desktop | ✅/❌ | [Notes] |

### Recommendations
- [Recommendation 1]
- [Recommendation 2]
```

---

## UI Code Review Checklist

When reviewing UI code, check:

### Structure
- [ ] Semantic HTML used appropriately
- [ ] Component structure is logical
- [ ] Code is modular and reusable
- [ ] Follows chosen tech stack patterns

### Styling
- [ ] Follows design system specifications
- [ ] Consistent spacing and alignment
- [ ] Responsive design implemented
- [ ] No hardcoded values (uses variables/tokens)
- [ ] Uses design tokens from `design-tokens.ts`

### Accessibility
- [ ] ARIA labels present where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Focus states visible
- [ ] Screen reader compatible

### Performance
- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] Efficient CSS selectors
- [ ] Lazy loading where appropriate
- [ ] Motion performance optimized

### Assets
- [ ] Uses assets from `content/` folder
- [ ] Assets properly referenced
- [ ] No missing or broken images

---

## Quick Reference - UI Work

| Situation | Action |
|-----------|--------|
| User specifies stack | **USE THAT STACK** |
| User asks for help | Use stack selection guidelines |
| Any UI work | Load this file + consult front-end skill |
| Planning UI | Determine AI mode, select stack, create artifacts |
| Need images/icons | Check `content/` folder first |
| Before UI changes | Consult front-end design skill |
| After UI changes | Validate with Playwright MCP |
| Using Gemini mode | Send to Gemini for design validation |
| UI code review | Use UI-specific checklist above |
| New UI assets | Organize in `content/` subfolders |
| Design exists | STILL consult front-end skill |

---

## File Structure for UI Projects

```
project-root/
├── content/                         # UI assets
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── [other assets]
├── planning/
│   ├── design-system.md             # Colors, typography, spacing, STACK
│   ├── component-designs.md         # Component specifications
│   ├── design-brief.md              # Creative direction
│   ├── testing-plan.md              # Include Playwright tests
│   └── [other planning docs]
├── src/
│   ├── components/
│   │   ├── ui/                      # Base UI components
│   │   └── sections/                # Page sections
│   └── lib/
│       └── design-tokens.ts         # Design tokens
└── [project files per stack]
```

---

## Integration with Other Files

| File | UI-Related Content |
|------|-------------------|
| `CLAUDE.md` | References this file for UI work |
| `CLAUDE-planning.md` | Planning process; specify AI tool mode during planning |
| `planning/design-system.md` | Include tech stack and AI mode |
| `planning/testing-plan.md` | Include Playwright UI tests |
| `planning/tasks.md` | Include UI-specific tasks |
| `planning/CHANGELOG.md` | Log UI changes |
