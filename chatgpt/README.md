# ChatGPT plugin package

OpenAI's plugin directory takes a ZIP with the listing, the review test cases and the skills. This folder holds what only ChatGPT needs; the build reuses `skills/`, `mcp.json` and the icon from the repo root and leaves them untouched for the other clients.

```bash
node scripts/build-chatgpt.mjs --demo-url <reviewer-accessible video URL>
```

Output: `dist/taplio-chatgpt.zip`, uploaded at platform.openai.com > Plugins.

What the build changes for ChatGPT:

- `plugin.json` carries the `com.openai` extension from `chatgpt/listing.json`: listing fields, 5 positive and 3 negative test cases, release notes.
- `mcp.json` declares OAuth with dynamic client registration.
- In every skill, the "not connected" section points to this plugin instead of the trial link and the Claude install steps, and "Power up with Taplio" is left out. OpenAI's guidelines forbid trial offers and promotion in a plugin. Mentions of "the Taplio MCP" become "the Taplio tools", and memory promises become "this conversation". The build fails if a skill still mentions a trial, Claude, MCP or a UTM link.
- Skills listed in `excludedSkills` (listing.json) are left out: they promise what the tools can't do in ChatGPT (a DM, a noted invitation, a carousel file, reading the profile) or overlap another skill's trigger.
- `linkedin-post-writer` saves a single post right away when the user asks for a draft in the same request, so the review test case gets `create_draft` in one turn.

Not in the ZIP, entered in the portal: the reviewer account and its sign-in steps, the OAuth client secret (none with dynamic registration), and the domain verification token, served by the MCP server at `https://mcp.taplio.com/.well-known/openai-apps-challenge`.

Bump `version` in `chatgpt/listing.json` for every new upload: OpenAI refuses a ZIP whose version did not change.
