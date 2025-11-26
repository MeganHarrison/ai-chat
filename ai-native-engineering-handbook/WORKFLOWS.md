# AI-Native SDLC Workflow

This workflow defines the lifecycle of any project executed with agents.

---

## 1️⃣ PLAN
- PM creates REQUIREMENTS.md  
- PM identifies ambiguities  
- Tests + tasks are defined upfront  

Deliverables:
- REQUIREMENTS.md  
- TEST.md  
- AGENT_TASKS.md  

---

## 2️⃣ DESIGN
Designer:
- Reads requirements + tasks  
- Produces design_spec.md  
- Optionally produces wireframe.md  

---

## 3️⃣ BUILD
Frontend + Backend agents:
- Implement features exactly as specified  
- No extra features  
- Use Codex MCP for file writes  

---

## 4️⃣ TEST
Tester:
- Creates a runnable test plan  
- Validates output files exist  
- Writes automated scripts where possible  

---

## 5️⃣ REVIEW
Code Reviewer:
- Runs a full PR-style review  
- Flags architecture issues  
- Generates final diff  

---

## 6️⃣ DEPLOY
Ops Agent:
- Validates logs  
- Checks for breakage  
- Provides root cause suggestions  

Humans approve deployment.

