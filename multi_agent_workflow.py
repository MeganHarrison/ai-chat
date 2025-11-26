import asyncio
import os

from dotenv import load_dotenv

from agents import (
    Agent,
    ModelSettings,
    Runner,
    WebSearchTool,
    set_default_openai_api,
)
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
from agents.mcp import MCPServerStdio
from openai.types.shared import Reasoning

load_dotenv(override=True)
set_default_openai_api(os.getenv("OPENAI_API_KEY"))


async def main() -> None:
    async with MCPServerStdio(
        name="Codex CLI",
        params={"command": "npx", "args": ["-y", "@openai/codex", "mcp-server"]},
        client_session_timeout_seconds=360000,
    ) as codex_mcp_server:
        designer_agent = Agent(
            name="Designer",
            instructions=(
                f"""{RECOMMENDED_PROMPT_PREFIX}"""
                "You are the Designer.\n"
                "Source of truth: REQUIREMENTS.md and AGENT_TASKS.md produced by the Project Manager (Nutrition Solutions brief).\n"
                "Do not invent requirements; stay within those docs. You may research patterns if needed.\n\n"
                "Deliverables (write to /design):\n"
                "- design_spec.md – single page describing the chat UI, guided flow presentation, transformation carousel placement, off-route/handoff affordances, and support path layout.\n"
                "- wireframe.md – concise ASCII/text wireframe for the key screen states (initial hook, guided flow, off-route answer, support handoff).\n\n"
                "Keep outputs implementation-friendly and compact.\n"
                "When complete, handoff to the Project Manager with transfer_to_project_manager_agent."
                "When creating files, call Codex MCP with {\"approval-policy\":\"never\",\"sandbox\":\"workspace-write\"}."
            ),
            model="gpt-5",
            tools=[WebSearchTool()],
            mcp_servers=[codex_mcp_server],
        )

        frontend_developer_agent = Agent(
            name="Frontend Developer",
            instructions=(
                f"""{RECOMMENDED_PROMPT_PREFIX}"""
                "You are the Frontend Developer.\n"
                "Read AGENT_TASKS.md and design_spec.md. Produce an implementation plan aligned to Nutrition Solutions (do not ship production code here).\n\n"
                "Deliverables (write to /frontend):\n"
                "- frontend_plan.md – concrete steps to adapt the ChatKit React UI to the guided flow, transformation carousel widget, brand voice, and support/handoff affordances.\n"
                "- component_contracts.md – DOM/data contracts for the carousel widget, profile side panel, objection markers, and handoff triggers.\n\n"
                "Follow the Designer’s layout guidance and PM’s integration notes. Keep it specific and minimal.\n\n"
                "When complete, handoff to the Project Manager with transfer_to_project_manager_agent."
                "When creating files, call Codex MCP with {\"approval-policy\":\"never\",\"sandbox\":\"workspace-write\"}."
            ),
            model="gpt-5",
            mcp_servers=[codex_mcp_server],
        )

        backend_developer_agent = Agent(
            name="Backend Developer",
            instructions=(
                f"""{RECOMMENDED_PROMPT_PREFIX}"""
                "You are the Backend Developer.\n"
                "Read AGENT_TASKS.md and REQUIREMENTS.md. Produce an implementation plan (no production code) for the Nutrition Solutions agent backend.\n\n"
                "Deliverables (write to /backend):\n"
                "- backend_plan.md – steps to integrate Supabase (profiles/session_history/vector_documents), RAG pipeline, long/short-term memory, objection logging, support handoff logic, and ChatKit agent routing.\n"
                "- supabase_schema.sql – SQL for the user_profiles, session_history, and vector_documents tables per requirements (include triggers as specified).\n\n"
                "Keep it concise, actionable, and aligned with the acceptance criteria.\n\n"
                "When complete, handoff to the Project Manager with transfer_to_project_manager_agent."
                "When creating files, call Codex MCP with {\"approval-policy\":\"never\",\"sandbox\":\"workspace-write\"}."
            ),
            model="gpt-5",
            mcp_servers=[codex_mcp_server],
        )

        tester_agent = Agent(
            name="Tester",
            instructions=(
                f"""{RECOMMENDED_PROMPT_PREFIX}"""
                "You are the Tester.\n"
                "Read AGENT_TASKS.md and TEST.md. Verify that plans and schemas satisfy the Nutrition Solutions acceptance criteria.\n\n"
                "Deliverables (write to /tests):\n"
                "- TEST_PLAN.md – manual/automated checks covering guided flow, RAG triggers, memory, objections, support path, transformation carousel, and handoff behavior.\n"
                "- test_checklist.md – concise go/no-go list mapped to acceptance criteria.\n\n"
                "Keep it minimal and runnable in the current repo context.\n\n"
                "When complete, handoff to the Project Manager with transfer_to_project_manager."
                "When creating files, call Codex MCP with {\"approval-policy\":\"never\",\"sandbox\":\"workspace-write\"}."
            ),
            model="gpt-5",
            mcp_servers=[codex_mcp_server],
        )

        project_manager_agent = Agent(
            name="Project Manager",
            instructions=(
                f"""{RECOMMENDED_PROMPT_PREFIX}"""
                """
                You are the Project Manager.

                Objective:
                Convert the Nutrition Solutions brief (guided sales coach with RAG/memory/handoff) into actionable artifacts.

                Deliverables (write in project root):
                - REQUIREMENTS.md: concise summary of goals, users, key features, data/model constraints, and acceptance criteria from AGENTS.md.
                - TEST.md: tasks with [Owner] tags (Designer, Frontend, Backend, Tester) plus clear acceptance criteria tied to the brief.
                - AGENT_TASKS.md: one section per role containing:
                  - Project name
                  - Required deliverables (exact file names and purpose)
                  - Key technical notes and constraints (Supabase schema, RAG triggers, guided flow, brand voice, handoff rules).

                Process:
                - Resolve ambiguities with minimal, reasonable assumptions. Be specific so each role can act without guessing.
                - Create files using Codex MCP with {"approval-policy":"never","sandbox":"workspace-write"}.
                - Do not create folders. Only create REQUIREMENTS.md, TEST.md, AGENT_TASKS.md in the project root.
                - Continue executing handoffs until ALL downstream artifacts are produced (design, frontend plan, backend plan, test plan). Do not finish early.

                Handoffs (gated by required files):
                1) After the three root files are created, hand off to the Designer with transfer_to_designer_agent and include REQUIREMENTS.md and AGENT_TASKS.md.
                2) Wait for the Designer to produce /design/design_spec.md. Verify that file exists before proceeding.
                3) When design_spec.md exists, hand off in parallel to both:
                   - Frontend Developer with transfer_to_frontend_developer_agent (provide design_spec.md, REQUIREMENTS.md, AGENT_TASKS.md).
                   - Backend Developer with transfer_to_backend_developer_agent (provide REQUIREMENTS.md, AGENT_TASKS.md).
                4) Wait for Frontend to produce /frontend/frontend_plan.md and Backend to produce /backend/backend_plan.md. Verify both files exist.
                5) When both exist, hand off to the Tester with transfer_to_tester_agent and provide all prior artifacts and outputs.
                6) Do not advance to the next handoff until the required files for that step are present. If something is missing, request the owning agent to supply it and re-check.
                7) Finish only after the Tester delivers /tests/TEST_PLAN.md and /tests/test_checklist.md (or equivalent files in /tests matching the deliverable names above).

                PM Responsibilities:
                - Coordinate all roles, track file completion, and enforce the above gating checks.
                - Do NOT respond with status updates. Just handoff to the next agent until the project is complete.
                """
            ),
            model="gpt-5",
            model_settings=ModelSettings(
                reasoning=Reasoning(effort="medium"),
            ),
            handoffs=[designer_agent, frontend_developer_agent, backend_developer_agent, tester_agent],
            mcp_servers=[codex_mcp_server],
        )

        designer_agent.handoffs = [project_manager_agent]
        frontend_developer_agent.handoffs = [project_manager_agent]
        backend_developer_agent.handoffs = [project_manager_agent]
        tester_agent.handoffs = [project_manager_agent]

        task_list = """
Project: Nutrition Solutions AI Sales Coach

Goal: Deliver a guided assessment + intelligent assistant that matches the Nutrition Solutions brand voice, uses RAG from Supabase vectors, and supports long/short-term memory with human handoff.

Key features (from AGENTS.md):
- Guided question path (Messages 1–8) with conditional branches for cooking preference and goal.
- Off-route handling: pause flow, answer with RAG, then return naturally; never force.
- RAG from Supabase vectors for FAQs, meal plans, testimonials/transformations, brand voice.
- Memory: short-term (session) + long-term Supabase profile (name, age, gender, primary goal, eating habits, emotional why, support level, objection, recommended plan, returning_user, session history, last_seen).
- Objection detection and storage; use to tailor responses.
- Support path trigger + human handoff messaging.
- Transformation carousel widget filtered by user profile; plan recommendation logic (Shred/Beast x Spartan/Gladiator).
- Tone: bold, direct, identity-focused, motivational coach; match brand-voice doc.

Data model (Supabase):
- user_profiles table (fields + triggers provided).
- session_history table (session id, user id, messages json, timestamps).
- vector_documents table (doc id, content, embedding, category).

Acceptance criteria:
- Guided flow runs end-to-end, personalized recs work, off-route responses natural, RAG relevant, carousel filters correctly, support path/handoff reliable, returning users recognized, tone consistent, checkout path initiates.

Constraints:
- Use ChatKit agent pattern; integrate Supabase for profile + vector store.
- Keep outputs concise and actionable for this repo; no heavy code, focus on plans/schemas/contracts.
"""

        result = await Runner.run(project_manager_agent, task_list, max_turns=30)
        print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
