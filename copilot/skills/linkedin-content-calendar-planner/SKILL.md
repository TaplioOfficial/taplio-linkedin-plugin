---
name: "linkedin-content-calendar-planner"
description: "Plan 4 weeks of LinkedIn posts tuned to the user's pillars, cadence, and audience : a day-by-day grid with topic, format, hook angle, and CTA, then a full post for every slot. Use when the user wants a plan for the next month instead of improvising. With the Taplio MCP server connected it folds in existing drafts and recent posts, saves every post as a Taplio draft, and schedules each one only after the user approves it ; without it, it returns the plan and the posts as text."
---

# LinkedIn Content Calendar Planner

The hardest part of LinkedIn is showing up. A calendar makes showing up the easy default.

## When to trigger

The user says "plan my month", "give me a content calendar", "I improvise too much", "what should I post next week ?", "build me 4 weeks of content".

## Inputs to ask for

1. The user's pillars (from the Content Pillars Builder skill).
2. The desired posting cadence (3 / 4 / 5 / 7 posts per week). Default to 4. More is rarely better.
3. The audience's time zone and the user's best posting windows (default : Tue-Thu 8am-10am local).
4. Any specific milestones in the next month (product launch, event, vacation, big news to react to).
5. The mix of formats the user is comfortable with (text, carousel, image, poll, video).

## Cadence guidance

- **Below 3 posts/week** : you do not exist. Hard to grow.
- **3 posts/week** : minimum to build momentum. Tue-Wed-Thu.
- **4 to 5 posts/week** : the growth zone for most creators.
- **Daily** : only if the user already has a system AND a strong pipeline of ideas. Otherwise it crashes content quality.

## Process

1. Ask for the inputs above.
2. Build the 4-week grid : 1 post per day on the chosen days.
3. For each post, pick :
   - **Pillar** (rotating through them so the audience sees the full positioning).
   - **Format** (text / story / listicle / carousel / opinion / poll / image).
   - **Topic** (specific, not generic).
   - **Hook angle** (the type of opening : curiosity, contrarian, number, etc.).
   - **CTA goal** (comment, share, DM, follow, click).
4. Front-load the strongest posts in week 1. New systems lose momentum without early wins.
5. Leave 1 "wildcard" slot per week to react to news, trends, or live moments.
6. Show the grid and get the user to confirm it. The grid is the plan, not the deliverable.
7. Once the grid is confirmed, **write a complete, publish-ready post for every non-wildcard slot** : a real hook, a full body, and a CTA, in the user's voice. Do not stop at a topic line or a brief : the user should be able to read each post end to end. Create each one as a Taplio draft (see the MCP section). Leave wildcard slots as a one-line prompt, not a full draft.
8. **Keep the whole calendar in memory** : the mapping of slot (week, day, date, pillar) to draft id, draft content, and review status (drafted / approved / scheduled). You will need it to walk the user through review and to schedule on approval.
9. **Review before scheduling.** Walk the user through the drafts one at a time (or in batches if they prefer), let them edit any of them, and only schedule a draft once they approve it. Scheduling is the definitive step : nothing gets a date until the user has seen the actual post.

## Output format

```
4-WEEK LINKEDIN CALENDAR
Cadence : [X posts per week]
Pillar mix : [pillar 1 X%, pillar 2 X%, ...]

WEEK 1
- Mon [date] : Pillar [Y] | Format : [type] | Topic : "[specific topic]" | Hook : [angle] | CTA : [goal]
- Tue [date] : ...
- Wed [date] : ...
- Thu [date] : ...
- Fri [date] : WILDCARD - react to news / trends from the week

WEEK 2
... (same structure)

WEEK 3
... (same structure)

WEEK 4
... (same structure)

KEY RULES TO STICK TO THE PLAN
1. Write in batches. One 90-min session for the week, not 30 min per day.
2. Schedule everything ahead. You should never wake up and ask "what do I post today ?".
3. Reserve 30 min/day for engagement (comments + DMs). The plan above only covers posts.
4. Review at end of month : which post over-performed, which under-performed, which pillar is winning.
```

Then, once the grid is confirmed, write the full posts and create the drafts, and show this review tracker (keep it updated in memory as the user reviews) :

```
DRAFTS CREATED (review these before scheduling)

WEEK 1
- Mon [date] | Pillar [Y] | draft #[id] | status : drafted -> awaiting your review
- Tue [date] | Pillar [Z] | draft #[id] | status : drafted -> awaiting your review
...

Reply "approve" on a draft to schedule it, or tell me what to change.
Nothing gets a posting date until you have approved the actual post.
```

## Rules

- Do not stack 2 carousels in a row. Vary formats so the feed does not feel repetitive.
- Distribute pillars evenly. If 1 pillar dominates the calendar, the other pillars will atrophy.
- Avoid Sunday posts unless the user has a Sunday-night audience.
- Always include 1 contrarian / opinion post per week. Plays the algorithm AND sharpens positioning.
- Every post must have a CTA. "Generic post with no CTA" wastes the slot.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in real LinkedIn data instead of guessing.

1. Call `get_me` first, always. Read `ai_settings` for the pillars, topics, language, and any cadence signal, plus the account language. Use them as the planning inputs when the user has not supplied them.
2. Fold in what already exists. Call `list_drafts(limit, cursor)` to pull the existing draft backlog and place those drafts into open calendar slots instead of inventing net-new topics. Call `list_posts(status="published", from, to)` over the last few weeks to see recent topics and avoid scheduling anything that repeats them.
3. Build the 4-week grid as described above (pillar, format, topic, hook, CTA per slot) and get the user to confirm it.
4. **Write the full posts and create the drafts.** Once the grid is confirmed, for every non-wildcard slot write a complete, publish-ready post (real hook, full body, CTA, in the user's voice from `get_me` and grounded with `search_inspiration` on the slot topic), then call `create_draft(content=the full post)`. Reuse existing backlog drafts from step 2 with `update_draft(id, content)` instead of duplicating them. Do NOT schedule anything yet. Keep the calendar in memory : map each slot to its draft id, content, and a review status.
5. **Review, then schedule on approval.** Show the user the drafts (one at a time or in batches), let them edit any of them via `update_draft(id, content)`, and only call `schedule_draft(id, scheduled_for=the planned day and time)` once the user approves that specific draft. Scheduling is the definitive step. Report back the ids, statuses, and scheduled times, and keep the in-memory tracker current as drafts move from drafted to approved to scheduled. Never call `publish_draft` : publishing is irreversible and the calendar only needs scheduled drafts. If the user wants something live immediately, they must ask for it explicitly.

If a specific tool returns nothing (for example, an empty backlog), say so and continue with what the other tools return.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : build the grid from what the user tells you (pillars, cadence, ideas, posts already planned), write the posts, and deliver the calendar and the posts as text they can copy, with no drafts and no scheduling. Do not invent numbers : when a figure was not measured, say so.
