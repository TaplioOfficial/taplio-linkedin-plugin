---
name: "linkedin-post-drafter"
description: "Write a publish-ready LinkedIn post from a raw idea : pick a format (story, opinion, listicle, contrarian, experience recap), write hook, body, and CTA, and return three variants to choose from. Use whenever the user has a topic but no draft. With the Taplio MCP server connected it reads the user's voice settings and proven angles from high-performing posts on the topic, then saves the chosen variant as a Taplio draft ; without it, it returns the final text to copy."
---

# LinkedIn Post Drafter

Turn a raw idea into a LinkedIn post that earns the scroll-stop and the comment.

## When to trigger

The user gives you a topic, an idea, an experience, an opinion, a product update, a learning, or a story and wants it turned into a LinkedIn post. They might say "write me a post about X", "help me post this", "I want to share that I did Y", "turn this into a LinkedIn post".

## Inputs to ask for (only if missing)

1. The raw idea, story, or topic.
2. The target audience (founders, marketers, devs, sales, etc.). If missing, infer from context or ask.
3. The desired format. Default to "let me pick the best one for you" and propose:
   - **Story** : a personal anecdote with a turning point.
   - **Opinion** : a strong stance + reasoning.
   - **Listicle** : a numbered list of tips, mistakes, or lessons.
   - **Contrarian** : a take that challenges conventional wisdom.
   - **Experience recap** : "I tried X for Y days, here is what I learned".
4. The CTA goal (comments, profile visits, DMs, link clicks). Default to "comments" since it boosts reach the most.

## Process

1. Choose the format that fits the raw input.
2. Write the **hook** (first 2 lines, the only thing visible before "see more"). It must create curiosity, contradict an assumption, or promise a payoff.
3. Write the **body** with short lines (max 8 words per line on average), white space, and one idea per line. No corporate filler.
4. Write a **CTA** that fits the goal (a question for comments, a tag for shares, a link for clicks).
5. Generate **3 variants** of the post so the user can pick the strongest hook.
6. Once the user picks a variant, render it directly in an editable block so they can tweak it in place (see "Editable block" below). Do this automatically, before saving it as a draft.

## Output format

```
VARIANT 1 - [format name]

[hook line 1]
[hook line 2]

[body, 80 to 200 words, short lines]

[CTA]

---

VARIANT 2 - ...

VARIANT 3 - ...
```

After the variants, add a one-line recommendation: "I would ship Variant X because [reason]".

## Editable block (do this automatically)

As soon as the user picks a variant, put it into an editable block yourself. Do not ask first.

If the client you are running in has an editable canvas or artifact feature, open one automatically and render the chosen post in it, containing only the post text : no variant label, no commentary, nothing the user would have to delete before posting. That way they edit it in place and copy it straight to LinkedIn.

Only if the client has no canvas or artifact feature, fall back to a plain fenced code block with just the post text, which is the most copy- and edit-friendly format available.

Only after the user is happy with the edited text do you save it as a draft via the MCP (see below). Save the edited version, not the original variant.

## Rules

- No emoji unless the user uses them.
- No em-dash, no special unicode bullets, no curly quotes.
- One idea per line, white space matters.
- 1300 characters is the sweet spot. Stay under unless the story really needs more.
- Never use "In today's world" or "In an era where". Cut filler.
- The hook must work on its own without the body. Read it aloud, if it sounds like a press release, rewrite it.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in the user's real LinkedIn data instead of guessing.

1. Call `get_me` first to read the user's `ai_settings` (industry, role, language, target audience, topics, keywords, description). Tailor voice, audience, and language of every variant to this.
2. Call `search_inspiration(query=the topic, min_likes=500, lang=user language, limit=10)` to pull proven angles and hooks before drafting. Mine these for what is landing in the niche, then write your 3 variants on top of that signal (do not copy, adapt).
3. After the user picks a variant and finishes editing it (see "Editable block" above), call `create_draft(content)` with the final edited text to save it as a LinkedIn draft. Then offer to call `schedule_draft(id, scheduled_for)` at a peak posting time, asking the user for the timing first. Never call `publish_draft` (it publishes now and is irreversible) without explicit user confirmation, and tell the user that.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : write the three variants from the idea and anything the user shares about their voice (a few past posts help), without the inspiration research, and finish with the final text in the editable block instead of saving a draft. Do not invent numbers : when a figure was not measured, say so.
