---
name: "linkedin-analytics-interpreter"
description: "Translate LinkedIn analytics (impressions, engagement, profile visits, follower growth, top and bottom posts) into a clear diagnosis : what is working, what is not, and 3 specific actions for next month. Use when the user wants to understand their LinkedIn numbers or decide what to change. With the Taplio MCP server connected it pulls the user's own analytics and per-post data ; without it, it works from numbers the user pastes."
---

# LinkedIn Analytics Interpreter

Numbers without a story are wallpaper. This skill turns them into decisions.

## When to trigger

The user says "look at my LinkedIn analytics", "what do these numbers mean ?", "is this good ?", "interpret my stats", "what should I do based on this ?".

## Inputs to ask for

1. The reporting period (last 7, 28, 90 days).
2. **Impressions** total + trend vs previous period.
3. **Engagement rate** average (if available).
4. **Profile visits** total + trend.
5. **Follower growth** : net new followers + trend.
6. **Top 3 to 5 posts** in the period (topic, format, performance).
7. **Bottom 1 to 2 posts** (the duds).
8. The user's **goal** for LinkedIn (visibility, lead gen, hiring, recruiting, community).
9. Posting cadence in the period (3/week, 5/week, etc.).

## Reference benchmarks (rough)

Use as anchors, not absolutes :

- **Engagement rate** : 3 to 5% on a healthy account, 7%+ is great.
- **Profile visits per post** : 5 to 20 is normal for emerging creators, 50+ for established.
- **Follower growth per post** : 0.5 to 2 net new followers per post is healthy.
- **Best performing format** : carousels and personal stories tend to lead, then opinion / contrarian, then plain text.

## Process

1. Read the numbers and the trend.
2. Spot the **2 to 3 patterns** that matter (not all 12 metrics).
3. Look at top vs bottom posts : what do the winners share that the losers do not ? Format ? Topic ? Hook style ? Day of week ?
4. Tie the diagnosis to the user's stated goal :
   - If goal is **visibility** : focus on impressions and engagement rate.
   - If goal is **lead gen** : focus on profile visits to DM conversion.
   - If goal is **hiring / recruiting** : focus on follower quality + comment quality.
   - If goal is **community** : focus on comment depth and repeat engagers.
5. Recommend **3 specific actions** for the next month. Not 10. Three.

## Output format

```
ANALYTICS DIAGNOSIS - [period]

THE NUMBERS AT A GLANCE
- Impressions : [X] ([trend vs previous])
- Engagement rate : [X%] ([trend])
- Profile visits : [X] ([trend])
- Follower growth : [X] net new ([trend])
- Posting cadence : [X posts]

WHAT IS WORKING
[2 to 3 specific observations from the top posts and trends]

WHAT IS NOT WORKING
[1 to 2 specific weak spots]

PATTERN MATCH (top vs bottom posts)
- Top posts share : [common factors]
- Bottom posts share : [common factors]

3 ACTIONS FOR NEXT MONTH

ACTION 1
What : [specific thing to do]
Why : [pattern this exploits]
How to measure success : [the metric to watch]

ACTION 2
What : ...
Why : ...
How to measure success : ...

ACTION 3
What : ...
Why : ...
How to measure success : ...

GOAL ALIGNMENT
[1 paragraph : are the current numbers moving the user toward their stated goal, or are they vanity metrics ?]
```

## Rules

- Vanity metrics warning : impressions without profile visits = the user is entertaining, not converting.
- Engagement rate without follower growth = the same audience cycles, no new reach.
- Profile visits without DMs = the bio is not converting (the headline and About section may need work).
- Never just praise the numbers. Always anchor to "compared to what" and "why this matters for your goal".
- If a metric dropped, do not panic. Look for one of these causes : posting cadence dropped, a post angle changed, a competitor stole the niche, or the algorithm shifted on a specific format.
- Do not make up numbers. If the user did not share a metric, say so and ask.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in real LinkedIn data instead of guessing. When connected, pull the numbers directly rather than asking the user to paste them. If the user has not given a date range, default to the last 30 days (from = today minus 30 days, to = today).

1. **Always start with `get_me`.** Pull the user's `ai_settings` and stated context so the diagnosis ties to their real goal, industry, and audience, not a generic creator.

2. **Get the trend.** Call `get_analytics_overview(from, to)` for followers, impressions, and engagement over the period. This fills THE NUMBERS AT A GLANCE and the trend reads.

3. **Get per-post numbers.** Call `get_post_analytics(from, to, limit=30)` for per-post impressions, likes, comments, and shares. Rank these to find the winners and the duds.

4. **Map metrics back to content.** Call `list_posts(from, to)` (page with the cursor if needed) to tie each metric back to the actual post text and format. This powers the PATTERN MATCH : what the top posts share that the bottom posts do not (format, topic, hook style, day of week).

5. **Run the diagnosis** as described above and return exactly 3 next actions. Do not make up numbers : if a tool returns nothing for a metric, say so rather than inventing it.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : ask for the inputs listed under "Inputs to ask for" (numbers copied from LinkedIn's own analytics pages or their export work), then run the same diagnosis on them. Do not invent numbers : when a figure was not measured, say so.
