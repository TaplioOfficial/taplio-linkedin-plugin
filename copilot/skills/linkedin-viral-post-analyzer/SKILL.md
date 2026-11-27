---
name: "linkedin-viral-post-analyzer"
description: "Decode why a specific LinkedIn post performed unusually well : hook, structure, format, emotional triggers, timing, and audience match, then a reusable template the user can apply to their own content. Use when the user pastes a high-performing post they want to learn from, or wants to study what wins in their niche. With the Taplio MCP server connected it can source high-engagement posts to study and pull the numbers of the user's own posts ; without it, it analyzes the post the user pastes."
---

# LinkedIn Viral Post Analyzer

Reverse-engineer the post. Steal the architecture, ship your own substance.

## When to trigger

The user pastes a LinkedIn post and says "why did this work ?", "analyze this viral post", "I want to write something like this", "give me the template".

## Inputs to ask for

1. The full post text.
2. The performance numbers if available (impressions, likes, comments, shares).
3. The author's typical baseline (so you can spot what made THIS post outperform).
4. Optional : the time of day / day of week it was posted.

## Process

1. Score the post on 7 dimensions :
   - **Hook strength** : does line 1 stop the scroll ?
   - **Structure** : is it scannable ? Where is the white space ?
   - **Emotional driver** : curiosity, anger, validation, hope, status, fear ?
   - **Specificity** : real names, real numbers, real dates ?
   - **Audience match** : does it talk to one specific person, not "everyone" ?
   - **CTA** : does it earn the comment / share / save ?
   - **Format** : text, list, story, contrarian take, screenshot, image ?
2. Identify the **2 to 3 levers that did the heavy lifting**. Not 7 levers, just the load-bearing ones.
3. Strip the post down to its **template** : replace the substance with placeholders so the user can plug in their own topic.

## Output format

```
POST AT A GLANCE
Author angle : [what they typically post about]
Performance : [numbers, or "above their baseline" if unknown]
Format : [story / list / opinion / contrarian / etc.]

WHAT WORKED (the load-bearing levers)
1. [lever 1 with specific quote from the post]
2. [lever 2 with specific quote]
3. [lever 3 with specific quote, optional]

WHAT DID NOT MATTER
[2-3 things that look important but were not, e.g. "post length", "emojis", "time of day"]

THE REUSABLE TEMPLATE
[
Hook : [pattern]
Setup : [pattern]
Twist : [pattern]
Payoff : [pattern]
CTA : [pattern]
]

HOW TO USE THIS TEMPLATE FOR YOUR NEXT POST
[3 specific topics from the user's world that fit this template]
```

## Rules

- Be honest if the post worked because of who the author is, not what they wrote. Reach is asymmetric on LinkedIn.
- Do not credit "luck". If you cannot identify why it worked, say so.
- Never recommend the user copy verbatim. Always extract the structure.
- If the user pastes their OWN post, treat them as a coach would : praise the lever that worked, name the one that did not.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in real LinkedIn data instead of guessing.

1. Call `get_me` first to orient on the user's niche, keywords, and language so the analysis and the template suggestions stay on-brand.
2. If the user already supplied a post, analyze it directly. If it is the user's OWN scheduled or sent post, fetch the exact text and metadata with `get_post(id)`, and pull its performance with `get_post_analytics(from, to, limit)` so the breakdown rests on real numbers, not a guess at the baseline.
3. If you need viral posts to study, source them with `search_inspiration(query="<topic or angle>", min_likes=2000, max_days_old=60, lang="<user language>", limit=20)`. Take the top hits and analyze the best one or two in full.
4. Run the 7-dimension breakdown on the chosen post, name the 2 to 3 load-bearing levers, and produce the reusable template exactly as the output format specifies.
5. Limitation : the MCP returns post text and engagement counts but not the original author's follower count or their per-post baseline, so judge "is this reach asymmetric ?" from the engagement-to-content ratio and say when you cannot confirm it.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : analyze the post the user pastes with the numbers they give, and say when the author's baseline cannot be checked. Do not invent numbers : when a figure was not measured, say so.
