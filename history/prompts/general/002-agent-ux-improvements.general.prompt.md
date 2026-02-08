---
id: "002"
title: "Agent UX Improvements"
stage: "general"
date_iso: "2026-02-08"
surface: "agent"
model: "unknown"
feature: "none"
branch: "009-ai-todo-chatbot"
user: "hak"
command: "git workflow execution"
labels:
  - "ux"
  - "agent"
  - "improvement"
  - "json"
  - "status"
links:
  spec: null
  ticket: null
  adr: null
  pr: "https://github.com/codeWithHak/sorted/pull/6"
files_yaml:
  - "apps/web/src/hooks/useChat.ts"
  - "apps/web/src/lib/sse-client.ts"
  - "services/api/src/api/agent/guardrails.py"
  - "services/api/src/api/agent/jett.py"
  - "services/api/src/api/agent/tools.py"
  - "services/api/src/api/routers/chat.py"
  - "services/api/tests/test_agent_tools.py"
  - "history/prompts/general/001-git-workflow-execution.general.prompt.md"
tests_yaml:
  - "services/api/tests/test_agent_tools.py"
prompt_text: |
  Again it slipped the json:

  {"title":"Update Wardrobe","description":"Organize and refresh the wardrobe with new outfits."}I've created the task **Update Wardrobe**: Organize and refresh the wardrobe with new outfits. 

  Let me know what else you need! 🛍️

  Created 1 task

  Update Wardrobe
  08:07 PM

  why do you display this?
  {"title":"Update Wardrobe","description":"Organize and refresh the wardrobe with new outfits."}

  08:08 PM

  J
  Oops! That was a little behind-the-scenes info that slipped through. No worries, I'll keep it tidy! 

  Your task **Update Wardrobe** has been created. How can I assist you further? 😊

  08:08 PM



  and never use rocket emoji, it is too used.
response_text: |
  I've successfully implemented additional improvements to address the remaining JSON output issue and emoji usage:

  ✅ **Fixed JSON Output Issue:**
  - Added a new guardrail in `services/api/src/api/agent/guardrails.py` that detects and prevents raw JSON from appearing in agent output
  - Updated the agent's system prompt to explicitly instruct it not to repeat or display raw JSON responses from tools
  - Modified all agent tools to return user-friendly messages instead of raw JSON

  ✅ **Addressed Emoji Usage:**
  - Removed rocket emoji as requested and replaced with other engaging emojis
  - Updated status messages in the agent's system prompt to avoid overused emojis

  ✅ **Enhanced Overall UX:**
  - Added processing status indicators during agent operations
  - Improved agent personality with engaging status messages
  - Updated frontend to handle new status events properly
  - Modified tests to match the new response format

  The agent will now properly filter out any raw JSON responses from tools and provide clean, user-friendly responses without exposing internal data structures.
outcome: |
  Successfully resolved the JSON output issue in the agent by implementing a comprehensive solution that includes:
  1. A new guardrail that detects and prevents raw JSON from appearing in agent responses
  2. Updated system prompts that explicitly instruct the agent not to repeat raw JSON
  3. Modifications to all agent tools to return user-friendly responses
  4. Removal of overused emojis as requested
  5. Enhanced status indicators during processing
  The agent now provides clean, user-friendly responses without exposing internal JSON data.
evaluation: |
  The implementation successfully addresses all the issues raised:
  - Raw JSON no longer appears in agent responses
  - Overused emojis (like rocket) have been removed
  - Agent has enhanced personality with engaging status messages
  - Proper error handling and guardrails are in place
  - All changes have been tested and integrated properly