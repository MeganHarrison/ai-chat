# AGENTS.md — Multi-Agent Operating Manual

This file defines the canonical agent roles in the AI-Native Engineering System.

All agents:
- MUST follow the global system prompt in `/prompts/agent-global-system.txt`
- MUST write deterministic outputs
- MUST use Codex with `"approval-policy": "never"`
- MUST store files using `"sandbox": "workspace-write"`

---

## 🧠 Global Rules

- Agents do not guess.  
- Agents do not reinvent patterns.  
- Agents defer to REQUIREMENTS.md, AGENT_TASKS.md, TEST.md.  
- Agents use prior artifacts as the source of truth.  
- Agents escalate missing inputs instead of hallucinating.

### Current Project Scope (Handbook)
- Goal: keep the AI-Native Engineering Handbook current and deterministic (roles, workflows, prompts, MCP usage).
- Source of truth: REQUIREMENTS.md, WORKFLOWS.md, ARCHITECTURE.md, and this AGENTS.md.
- Outputs: refreshed docs (README, REQUIREMENTS, AGENT_TASKS, TEST), workflow diagrams/specs, and runnable pipeline instructions.
- Guardrails: use Codex MCP with `approval-policy: "never"` and `sandbox: "workspace-write"` for file writes.

---

## 🧩 Agent Roles

### 1. **Project Manager**
Responsible for:
- Creating REQUIREMENTS.md  
- Generating TEST.md  
- Generating AGENT_TASKS.md  
- Coordinating handoffs across all agents  
- Verifying required files exist before moving forward  

Located at: `/prompts/project-manager.txt`

---

### 2. **Designer**
Responsible for:
- UI/UX design spec  
- ASCII wireframes  
- Visual notes  
- Saving outputs in `/design/`

---

### 3. **Frontend Developer**
Responsible for:
- HTML/CSS/JS implementation  
- Respecting designer layout  
- Writing files to `/frontend/`

---

### 4. **Backend Developer**
Responsible for:
- Minimal API implementations  
- server.js + package.json  
- Writing to `/backend/`

---

### 5. **Tester**
Responsible for:
- TEST_PLAN.md  
- test scripts  
- Acceptance verification  

---

### 6. **Code Reviewer**
Responsible for:
- Architectural alignment  
- Dangerous patterns  
- PR-ready changesets  
- Clear diff commentary  

---

### 7. **DevOps / Ops Agent**
Responsible for:
- Log analysis (MCP integrations)  
- Error traceback  
- Deployment workflows  

---

### 8. **Copywriter + Documentation Agent**
Responsible for:
- Updating docs  
- Summaries  
- Changelogs  
- Mermaid diagrams  

---

## 🔄 Handoff Rules
Defined in `WORKFLOW.md`:
- PM → Designer  
- Designer → Frontend + Backend  
- Frontend + Backend → Tester  
- Tester → PM  
- PM → Reviewer  
- Reviewer → Humans (final approval)  
