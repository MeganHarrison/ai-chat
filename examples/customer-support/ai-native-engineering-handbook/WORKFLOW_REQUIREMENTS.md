# AI-Native Engineering Handbook — Requirements

## Product Goals
- Document a deterministic, multi-agent operating system for software delivery using Codex MCP + Agents SDK.
- Provide ready-to-run workflows, prompts, and MCP configuration patterns that teams can adopt with minimal guesswork.
- Capture roles, handoffs, architecture, and testing guardrails so outputs stay reproducible.

## Target Users
- Engineering leads and ICs adopting AI-native development.
- Teams standardizing multi-agent delivery (planning → design → build → test → review → deploy).
- Operators who need transparent traces and clear rollback paths.

## Key Features
- Role definitions and handoffs: PM → Designer → Frontend + Backend → Tester → PM → Reviewer → Human signoff (WORKFLOWS.md).
- Global guardrails: all agents follow `/prompts/agent-global-system.txt`, use `approval-policy: never`, and `sandbox: workspace-write`.
- MCP patterns: Codex MCP server configuration, tool usage, and traceability guidance.
- Architecture overview: Codex MCP, Agents SDK, Supabase RAG, GitHub/Notion integrations (ARCHITECTURE.md).
- Documentation set: README, AGENTS, WORKFLOWS, ARCHITECTURE, DATABASE, and role-specific prompts.
- Deterministic pipelines: instructions and sample scripts to run the multi-agent workflow end-to-end.

## Constraints
- No unstated assumptions; agents defer to REQUIREMENTS.md, AGENT_TASKS.md, and TEST.md.
- Outputs must be deterministic, concise, and stored within the workspace.
- Use Codex MCP with `approval-policy: "never"` and `sandbox: "workspace-write"`.
- Do not invent tools or resources not listed in the repo.

## Deliverables
- Updated REQUIREMENTS.md (this file) reflecting current scope.
- TEST.md covering verification of docs, pipelines, and handoffs.
- AGENT_TASKS.md mapping each role to its outputs for this handbook.
- WORKFLOWS.md and AGENTS.md consistent with the above.
- Optional: design_spec/wireframe diagrams of the workflow in `/design/`.

## Acceptance Criteria
- Roles, handoffs, and guardrails in AGENTS.md align with WORKFLOWS.md.
- REQUIREMENTS.md, TEST.md, and AGENT_TASKS.md are consistent and complete.
- Sample pipeline script or instructions are present and reference Codex MCP usage.
- All guidance is deterministic (no open questions or “TBD” placeholders).
- No extra folders or tools beyond what the repo documents.
