# Taplio for LinkedIn (Claude Code plugin)

A Claude Code plugin that bundles **17 Claude Skills for LinkedIn** together with the **Taplio MCP server**. Install it once and Claude can write, plan, and grow your LinkedIn presence, working on your real voice, audience, and analytics through your Taplio account.

## What's inside

**17 skills** across four areas:

- **Content creation**: post writer, hook generator, carousel builder, repurposer, story extractor, CTA optimizer
- **Research and inspiration**: niche creator finder, viral post analyzer, trending topics scanner, swipe file builder
- **Strategy**: niche definer, content pillars builder, audience persona builder, content calendar planner
- **Analytics and profile**: post performance critic, analytics interpreter, profile optimizer

**Taplio MCP** (`https://mcp.taplio.com`, bundled via `.mcp.json`): lets the skills draft, schedule, and publish posts, browse your posts and drafts, research proven inspiration, and read your analytics. Publishing is always gated behind your explicit confirmation.

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

On first use of a skill, the bundled Taplio MCP asks you to connect your Taplio account (sign up at https://taplio.com). Skills are invoked as `/taplio:<skill-name>`, for example `/taplio:linkedin-post-writer`.

## Links

- Skills source: https://github.com/TaplioOfficial/taplio-linkedin-claude-skills
- MCP server: https://github.com/TaplioOfficial/taplio-linkedin-mcp
- Product page: https://taplio.com/claude-skills-for-linkedin

## License

MIT
