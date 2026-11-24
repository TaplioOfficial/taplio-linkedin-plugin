---
name: "linkedin-trending-topics-scanner"
description: "Surface the topics gaining traction this week in the user's LinkedIn niche, with a with-the-wave and an against-the-wave angle for each, tied to their positioning. Use when the user is out of ideas or wants to react to what their industry is discussing. With the Taplio MCP server connected it reads recent high-engagement posts from Taplio's index of public LinkedIn posts ; without it, it works only from posts or news the user shares and does not claim anything is trending."
---

# LinkedIn Trending Topics Scanner

Riding a trend with a sharp angle beats inventing a topic from scratch.

## When to trigger

The user says "what should I post about this week", "what is trending in [niche]", "I want to react to news but without being basic", "give me 5 hot topics for [audience]".

## Inputs to ask for

1. The niche and audience.
2. The user's positioning or angle (so suggested topics stay on-brand).
3. How many topics they want (default to 5).

## Process

1. Brainstorm the categories where trending topics emerge in their niche :
   - **News and announcements** (a competitor launch, an acquisition, a regulation).
   - **Tools and products** (something everyone is suddenly using).
   - **Public debates** (a hot take that is dividing the industry).
   - **Conferences and events** (recap, reactions).
   - **Cultural shifts** (a way of working that is changing).
   - **Memes and recurring jokes** in the niche.
2. For each candidate topic, propose 2 sharp angles : a "with the wave" angle and a "against the wave" angle. Contrarian angles tend to outperform on LinkedIn.
3. Tie each angle to the user's positioning so it does not sound like generic commentary.

## Output format

```
TRENDING IN [niche] THIS WEEK

1. [Topic / event / debate]
   Why it is hot : [one-liner with context]
   Angle A (with the wave) : [post angle]
   Angle B (against the wave) : [contrarian angle]
   Format suggestion : [story / opinion / listicle / carousel]

2. ...

PICK ONE
[1 sentence recommendation : which topic + which angle is the strongest fit for the user's positioning, and why]
```

## Rules

- Never propose generic "trends" like "AI is changing everything". Be specific : a tool, an event, a debate, a name.
- Always include a contrarian angle. Even if the user does not use it, it sharpens the wave-aligned angle.
- If you do not know what is trending in their niche, say so and ask for sources (newsletters they read, podcasts, communities).
- Do not chase virality at the cost of relevance. A trend the user has no credibility on is a trap.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in real LinkedIn data instead of guessing.

1. Call `get_me` first to read the user's niche, target audience, topics, keywords, language, and positioning from `ai_settings`. This anchors what counts as "their niche" and keeps every angle on-brand.
2. See what is spiking THIS week with `search_inspiration(query="<niche keyword>", max_days_old=7, min_likes=500, lang="<user language>", limit=50)`. Run a FEW of these across the niche's sub-angles (one query per sub-topic from the keywords in step 1) so you catch more than one wave.
3. Cluster the fresh high-engagement posts into distinct topics. For each topic, give a with-the-wave angle AND an against-the-wave angle, both tied to the user's positioning from step 1, then follow the output format.
4. Limitation : the MCP has no native "engagement velocity" or "what's trending" ranking. You approximate the trend by filtering on `max_days_old=7` plus `min_likes`, so it reflects what is performing recently in the index, not a real-time velocity feed. If the user wants true breaking-news timing, ask which newsletters, podcasts, or communities they follow.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : say plainly that you have no live view of what is spiking on LinkedIn, then offer to cluster posts, headlines, or newsletter items the user pastes into topics and angles. Never present a topic as trending without that evidence. Do not invent numbers : when a figure was not measured, say so.
