# Taplio for LinkedIn (Claude plugin)

A Claude plugin with **26 Claude Skills for LinkedIn**. Install it once and Claude can write, plan, engage, and grow your LinkedIn presence, working on your real voice, audience, and analytics through your Taplio account.

## What's inside

**26 skills** across six areas:

- **Content creation**: post writer, hook generator, carousel builder, repurposer, story extractor, CTA optimizer
- **Research and inspiration**: niche creator finder, viral post analyzer, trending topics scanner, swipe file builder
- **Strategy**: niche definer, content pillars builder, audience persona builder, content calendar planner
- **Analytics and profile**: post performance critic, analytics interpreter, profile optimizer
- **Engagement**: comment opportunity finder, smart comment writer, comment reply manager, warm lead finder, engagement watchlist builder, daily engagement routine, engagement tracker
- **Networking**: connection request hook, DM opener

The plugin contains skills only: markdown instructions, no scripts, no hooks, and no bundled MCP server.

## Requires the official Taplio connector

Every skill runs on the **official Taplio Claude connector** (the Taplio MCP server, `https://mcp.taplio.com`). The plugin does not install it: connect it first.

- **Claude on the web, desktop, or mobile, and Cowork**: install it from [claude.ai/customize/connectors/id/taplio](https://claude.ai/customize/connectors/id/taplio) (or Customize > Connectors > Discover, search "Taplio", Connect to Claude, sign in, Allow access).
- **Claude Code**: `claude mcp add --transport http taplio https://mcp.taplio.com`, then sign in to Taplio on the first tool call.

No Taplio account yet? [Start a free trial](https://app.taplio.com/signin?utm_source=github&utm_medium=repo&utm_campaign=linkedin-skills).

Each skill calls `get_me` first. If the connector is not connected, the skill stops and walks you through the setup above: there is no plain-prompt fallback.

## What the skills do with the connector

Through the connector, the skills read your Taplio profile settings, your posts, drafts, and analytics, inspiration posts from other creators, and the comment threads worth engaging with. They can save drafts, schedule posts, draft and schedule comments and replies under your name, like posts and comments, and queue plain connection requests. All of it goes through your own Taplio account; the skills send nothing to any other service.

Nothing reaches LinkedIn without your say-so. Publishing a post, committing a comment or reply, liking, and sending a connection request are always gated behind your explicit confirmation, and the skills quote the scheduled time instead of saying something is live until the connector confirms it.

## Use

Skills are invoked as `/taplio:<skill-name>`, for example `/taplio:linkedin-post-writer`, or simply by asking ("write a LinkedIn post about...", "who in my comments is worth talking to?").

To try it locally in Claude Code:

```bash
claude --plugin-dir ./taplio-linkedin-plugin
```

## Cursor

The same repository is also a Cursor plugin (`.cursor-plugin/plugin.json`). In Cursor, the plugin brings the 26 skills **and** the Taplio MCP server (`https://mcp.taplio.com/`), so there is nothing to connect separately: install it, then sign in to Taplio in the browser on the first tool call.

To try it locally, copy this folder to `~/.cursor/plugins/local/taplio` and restart Cursor. If you already added a `taplio` server in `~/.cursor/mcp.json`, remove it to avoid seeing the tools twice.

## Grok Build

The repository is also a Grok Build plugin (`.grok-plugin/plugin.json`), for the [xAI plugin marketplace](https://github.com/xai-org/plugin-marketplace). As in Cursor, it brings the 26 skills **and** the Taplio MCP server (`https://mcp.taplio.com/`); sign in to Taplio in the browser on the first tool call.

## GitHub Copilot

The repository is also a GitHub Copilot plugin (`.github/plugin/plugin.json`), for Copilot CLI and VS Code. As in Cursor, it brings the 26 skills **and** the Taplio MCP server (`https://mcp.taplio.com/`); sign in to Taplio in the browser on the first tool call.

```bash
copilot plugin install TaplioOfficial/taplio-linkedin-plugin
```

## Gemini CLI

The repository is also a Gemini CLI extension (`gemini-extension.json`). It brings the 26 skills and the Taplio MCP server; Gemini CLI discovers the OAuth sign-in on the first tool call.

```bash
gemini extensions install https://github.com/TaplioOfficial/taplio-linkedin-plugin
```

## Other agents (skills only)

To add the 26 skills to any agent supported by [skills.sh](https://skills.sh), then connect the Taplio MCP server (`https://mcp.taplio.com/`) in that agent:

```bash
npx skills add TaplioOfficial/taplio-linkedin-plugin
```

## Links

- Skills source: https://github.com/TaplioOfficial/taplio-linkedin-claude-skills
- MCP server: https://github.com/TaplioOfficial/taplio-linkedin-mcp
- Product page: https://taplio.com/claude-skills-for-linkedin

## License

MIT
