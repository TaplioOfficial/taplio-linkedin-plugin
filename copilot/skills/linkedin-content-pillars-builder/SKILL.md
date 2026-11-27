---
name: "linkedin-content-pillars-builder"
description: "Define 3 to 5 LinkedIn content pillars consistent with the user's positioning, plus 5 to 10 post topics for each. Use when the user's content feels random and they want a system. With the Taplio MCP server connected it grounds the pillars in which of the user's own themes already perform and in high-performing posts from their niche ; without it, it works from the user's expertise, audience, and any past posts they paste."
---

# LinkedIn Content Pillars Builder

Pillars are the 3 to 5 themes a creator returns to relentlessly. They make a profile recognizable in a feed.

## When to trigger

The user says "what should I post about", "I need a content system", "build me content pillars", "my LinkedIn feels random", "give me a content framework".

## Inputs to ask for

1. The user's niche statement (audience + problem + angle). If not defined, ask the user to state it in one sentence first.
2. The user's expertise areas (the 3 to 5 things they actually know deeply).
3. The audience's main jobs / pains / aspirations.
4. The desired ratio between pillars (default : 60% educational, 20% personal, 20% opinion).

## The 4 types of pillars

Most LinkedIn creators win with a mix of these :

1. **Educational** : how-to, frameworks, breakdowns, lessons. Builds authority.
2. **Stories and personal** : experiences, behind-the-scenes, journey. Builds connection.
3. **Opinion and contrarian** : hot takes, industry critique, predictions. Builds reach.
4. **Showcase** : results, case studies, client wins, product demos. Builds trust and inbound.

## Process

1. From the user's expertise + audience pains, propose 3 to 5 pillar candidates.
2. For each pillar, define :
   - The **theme** (one phrase).
   - The **promise to the audience** (what they get from this pillar).
   - The **post types** (educational, story, opinion, showcase).
   - The **frequency** (how often this pillar shows up in the calendar).
3. For each pillar, generate 5 to 10 concrete post topics so the user can ship tomorrow.
4. Close the skill (see the closing block in the output format) : tell the user to lock the pillars in two places (the assistant's memory and their Taplio AI settings), then offer the two next steps (full calendar, first post) and ask which they want.

## Output format

```
CONTENT PILLARS FOR [user]

PILLAR 1 - [Theme]
Promise : [what the audience gets]
Why this works : [link to niche / audience pain]
Post types : [educational / story / opinion / showcase mix]
Frequency : [X% of total content]
Topic seeds :
1. [topic]
2. [topic]
... (5 to 10)

PILLAR 2 - [Theme]
... (same structure)

PILLAR 3 - [Theme]
...

PILLAR 4 (optional) - ...
PILLAR 5 (optional) - ...

WEEKLY MIX (example for 5 posts/week)
- Mon : Pillar 1 (educational)
- Tue : Pillar 3 (opinion)
- Wed : Pillar 1 (story)
- Thu : Pillar 2 (showcase)
- Fri : Pillar 4 (educational)

WHAT TO DO NEXT
- Pin the pillars to a doc you can see when you write.
- Tag every post you publish with its pillar. After 4 weeks, check which pillar drives the strongest results (reach, comments, profile visits, DMs).
- Adjust the mix based on data, not vibes.
```

After printing the pillars, always close with this block :

```
LOCK IN YOUR PILLARS

1. Save these pillars to memory : ask the assistant you are using right now to
   remember them, so every post you write here from now on stays on-pillar.
2. Copy the pillars into your Taplio AI settings (the topics and "about you"
   fields) so everything Taplio generates is built on these themes too.
```

Then offer the two next steps and ask which one they want (or both) :
- **Build the full calendar** : turn these pillars into a 4-week posting plan (hand off to the Content Calendar Planner skill).
- **Write the first post now** : pick the strongest topic seed and draft it (use the Post Drafter skill, then save it with `create_draft` so it lands in their Taplio drafts).

## Rules

- 3 pillars minimum, 5 maximum. More than 5 = no positioning.
- Every pillar must serve the niche. If a pillar exists "because the user finds it interesting" but does not match the audience, cut it.
- Pillars should not overlap. If two pillars feel similar, merge them.
- Personal stories pillar : essential, not optional. It is what makes the user not an LLM.
- Avoid the "thought leadership" pillar. It is not a topic, it is a tone.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in real LinkedIn data instead of guessing.

1. Call `get_me` first, always. Read `ai_settings` for positioning (industry, role, target audience, topics, keywords, description). Use it as the source of truth for the niche if the user has not stated one.
2. Pull what already works. Call `list_posts(status="published", limit=...)` to list recent published posts, then `get_post_analytics(from, to, limit=30)` to see engagement per post. Map the top performers to themes : the pillars should be grounded in the themes that ALREADY perform for this account, not invented from scratch.
3. Call `search_inspiration(query=niche, max_followers, min_likes, lang, limit)` using the niche or topic keywords as the query, to surface high-performing posts in the space and harvest pillar and topic seeds.
4. Produce 3 to 5 pillars with their topic seeds, weighting the mix toward themes the analytics show are working. Note for each pillar whether it is data-backed (already performs) or a new bet.

This skill defines pillars only ; it does not schedule or publish. If a specific tool returns nothing, say so and build the pillars from what the other tools return.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : ask for the inputs listed under "Inputs to ask for" and, if they have them, their last 10 to 20 posts with rough engagement. Mark each pillar as a new bet unless the pasted posts show it already performs, and leave out the Taplio AI settings line of the closing block. Do not invent numbers : when a figure was not measured, say so.
