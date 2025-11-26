# TEST Plan — AI-Native Engineering Handbook

## Scope
- Documentation completeness (roles, workflows, architecture, guardrails).
- Deterministic pipeline instructions (Codex MCP + Agents SDK).
- Alignment across REQUIREMENTS.md, AGENTS.md, WORKFLOWS.md, and AGENT_TASKS.md.

## Tests
- [PM] Requirements alignment  
  Confirm REQUIREMENTS.md covers goals, users, features, constraints, deliverables, and acceptance criteria for the handbook.

- [PM/Copywriter] Cross-doc consistency  
  AGENTS.md, WORKFLOWS.md, and README.md references match REQUIREMENTS.md (roles, handoffs, MCP guardrails).

- [PM] Tasks mapping  
  AGENT_TASKS.md assigns clear outputs to each role; no missing roles from AGENTS.md.

- [Designer] Optional visuals  
  If design_spec.md/wireframe.md exist, they depict the workflow and handoffs consistent with WORKFLOWS.md.

- [Ops/PM] MCP configuration guidance  
  README/handbook include steps to run Codex MCP + Agents SDK with approval-policy: never and sandbox: workspace-write.

- [Tester] Deterministic pipeline runbook  
  Sample run instructions (e.g., python script or steps) are present and avoid TBD placeholders; required files paths are correct.

- [Tester] No stray folders/files  
  Only expected files are present; no invented tools or directories.

- [Reviewer] Clarity and brevity  
  Language is concise; no ambiguous “maybe/TBD”; actionable next steps are obvious.
