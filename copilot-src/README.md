# Taplio for LinkedIn (GitHub Copilot plugin)

Ten skills that let GitHub Copilot work on a LinkedIn presence from real data: the user's post analytics, their drafts and scheduled posts, the comments under their posts, and an index of public LinkedIn posts with engagement numbers. The plugin also configures the Taplio MCP server (`https://mcp.taplio.com/`), which provides that data.

Maintained by Taplio (lempire), the company that runs the Taplio service and its MCP server.

## Skills

| Skill | What it does | Data it reads through Taplio |
|---|---|---|
| `linkedin-analytics-interpreter` | Turns LinkedIn numbers into a diagnosis and 3 actions for next month | impressions, engagement and follower trends, per-post results |
| `linkedin-post-performance-critic` | Audits a draft on 6 dimensions and rewrites its weakest part | voice settings, saved drafts, high-performing posts on the same topic |
| `linkedin-content-pillars-builder` | Defines 3 to 5 content pillars with topic seeds | which of the user's own themes already perform |
| `linkedin-viral-post-analyzer` | Explains why a post performed and turns it into a reusable template | engagement numbers of public posts and of the user's own posts |
| `linkedin-trending-topics-scanner` | Lists the topics gaining traction this week, with two angles each | recent high-engagement posts in the niche |
| `linkedin-niche-creator-finder` | Ranks the creators who perform in a niche | high-engagement posts clustered by author |
| `linkedin-post-drafter` | Writes three variants of a post and saves the chosen one | voice settings, proven angles on the topic |
| `linkedin-content-calendar-planner` | Plans 4 weeks of posts and writes each one | existing drafts and recent posts |
| `linkedin-comment-reply-manager` | Triages the comments waiting under the user's posts and drafts replies | unanswered comments on the user's posts |
| `linkedin-comment-opportunity-finder` | Finds the posts worth commenting on today | Taplio's personalized selection and curated creator feeds |

Every skill also works without the server connected: it says so in one sentence and uses what the user pastes instead (post text, numbers from LinkedIn's analytics pages, comments). It never invents numbers.

## Install

From the Awesome Copilot marketplace:

```bash
copilot plugin install taplio@awesome-copilot
```

In VS Code, search `@agentPlugins taplio` in the Extensions view.

## Requirements and limits

- **A Taplio account.** The server uses OAuth 2.1 with PKCE: the browser opens to sign in on the first tool call. The plugin stores no API key.
- **Accounts without a subscription.** An account that never had a Taplio subscription gets 50 MCP calls, once. They cover the profile, posts, analytics, the post index, and drafts, which is what 8 of the 10 skills use. Scheduling or publishing a post needs a paid Taplio plan, and reading or answering comments needs the Growth plan or above. When a call is refused for plan reasons, the server's message says what is needed.
- **LinkedIn connection.** Actions that reach LinkedIn need the user's LinkedIn account connected in Taplio.

## What reaches LinkedIn

Nothing goes out without the user's explicit confirmation in the conversation. Publishing, scheduling, and posting a comment or a reply are each confirmed first, and the skills quote the scheduled time instead of saying something is live until the server confirms it.

## Data

The skills call no service other than the Taplio MCP server. Through it, they read the user's Taplio profile settings, posts, drafts, analytics, and comments, and search public LinkedIn posts. Privacy policy: https://taplio.com/our-privacy-policy

## Source

- This folder is generated from the shared skills of this repository by `scripts/build-copilot.mjs`. Edit `copilot-src/` or `skills/`, then rebuild; do not edit this folder by hand.
- MCP server: https://github.com/TaplioOfficial/taplio-linkedin-mcp

## License

MIT
