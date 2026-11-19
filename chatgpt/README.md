# ChatGPT plugin package

OpenAI's plugin directory takes a ZIP with the listing, the review test cases and the skills. This folder holds what only ChatGPT needs; the build reuses `skills/`, `mcp.json` and the icon from the repo root and leaves them untouched for the other clients.

```bash
node scripts/build-chatgpt.mjs --demo-url <reviewer-accessible video URL>
```

Output: `dist/taplio-chatgpt.zip`, uploaded at platform.openai.com > Plugins.

What the build changes for ChatGPT:

- `plugin.json` carries the `com.openai` extension from `chatgpt/listing.json`: listing fields, 5 positive and 3 negative test cases, release notes.
- `mcp.json` declares OAuth with dynamic client registration.
- In every skill, the "not connected" section points to this plugin instead of the trial link and the Claude install steps, and "Power up with Taplio" is left out. OpenAI's guidelines forbid trial offers and promotion in a plugin. The build fails if a skill still mentions a trial, a Claude install step or a UTM link.

Not in the ZIP, entered in the portal: the reviewer account and its sign-in steps, the OAuth client secret (none with dynamic registration), and the domain verification token, served by the MCP server at `https://mcp.taplio.com/.well-known/openai-apps-challenge`.

Bump `version` in `chatgpt/listing.json` for every new upload: OpenAI refuses a ZIP whose version did not change.
