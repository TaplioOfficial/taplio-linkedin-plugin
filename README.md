# Taplio for LinkedIn (Claude Code plugin)

A Claude Code plugin that bundles **26 Claude Skills for LinkedIn** together with the **Taplio MCP server**. Install it once and Claude can write, plan, engage, and grow your LinkedIn presence, working on your real voice, audience, and analytics through your Taplio account.

## What's inside

**26 skills** across six areas:

- **Content creation**: post writer, hook generator, carousel builder, repurposer, story extractor, CTA optimizer
- **Research and inspiration**: niche creator finder, viral post analyzer, trending topics scanner, swipe file builder
- **Strategy**: niche definer, content pillars builder, audience persona builder, content calendar planner
- **Analytics and profile**: post performance critic, analytics interpreter, profile optimizer
- **Engagement**: comment opportunity finder, smart comment writer, comment reply manager, warm lead finder, engagement watchlist builder, daily engagement routine, engagement tracker
- **Networking**: connection request hook, DM opener

**Taplio MCP** (`https://mcp.taplio.com`, bundled via `.mcp.json`): lets the skills draft, schedule, and publish posts, browse your posts and drafts, research proven inspiration, read your analytics, find the posts and comments worth engaging with, draft and schedule comments and replies under your name, like posts, and queue connection requests. Publishing a post, committing a comment, and sending a connection request are always gated behind your explicit confirmation.

## Install

Add the marketplace, then install:

```bash
/plugin marketplace add anthropics/claude-plugins-community
/plugin install taplio@claude-community
```

Or load it locally for testing:

```bash
claude --plugin-dir ./taplio-linkedin-plugin
```

On first use of a skill, the bundled Taplio MCP asks you to connect your Taplio account (no account yet ? [start a free trial](https://app.taplio.com/signin?utm_source=github&utm_medium=repo&utm_campaign=linkedin-skills)). Skills are invoked as `/taplio:<skill-name>`, for example `/taplio:linkedin-post-writer`.

**Using Claude on the web, desktop, or mobile ?** Taplio is an official Claude connector : install it from [claude.ai/customize/connectors/id/taplio](https://claude.ai/customize/connectors/id/taplio) (or Customize > Connectors > Discover, search "Taplio", Connect to Claude, sign in, Allow access), then add the skills from the [skills repo](https://github.com/TaplioOfficial/taplio-linkedin-claude-skills). In ChatGPT, Cursor, or Manus, add a custom connector with the URL `https://mcp.taplio.com`.

## Links

- Skills source: https://github.com/TaplioOfficial/taplio-linkedin-claude-skills
- MCP server: https://github.com/TaplioOfficial/taplio-linkedin-mcp
- Product page: https://taplio.com/claude-skills-for-linkedin

## License

MIT
