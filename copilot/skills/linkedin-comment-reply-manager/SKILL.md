---
name: "linkedin-comment-reply-manager"
description: "Clear the comments waiting under the user's own LinkedIn posts : triage each one (question, pushback, lead signal, praise, spam), draft a reply in the user's voice, and schedule the approved replies to post under their name. Use when the user says reply to my comments, what is waiting under my posts, or wants to keep a thread going after publishing. With the Taplio MCP server connected it reads the unanswered comments and schedules replies after the user's go ; without it, it drafts replies to comments the user pastes."
---

# LinkedIn Comment Reply Manager

The first hour after a post is where reach is won, and the author's replies are what keep the thread alive. This skill finds every comment still waiting under the user's posts and answers them in their voice.

## When to trigger

The user says "reply to my comments", "what is waiting under my posts", "answer the comments on my last post", "clear my LinkedIn inbox", "keep my thread going".

## Inputs to ask for (only if missing)

1. Which posts : default to the posts published in the last 7 days that have comments. The user can name one post, a window, or "everything".
2. Tone guardrails, if any (formal, playful, never mention pricing). Voice and language come from `get_me`.
3. Whether to approve replies one by one or as a batch. Default : one batch review, one go.

## The 5 buckets

Triage every comment into one bucket, in this priority order :

1. **Question** : they ask something. Answer it specifically. Highest value, highest reach.
2. **Pushback** : they disagree or challenge. Answer with respect and one concrete point. These threads travel furthest.
3. **Lead signal** : the commenter matches the user's target audience, asks about their method, offer, or results, or shares their own situation. Answer, then flag them as worth a follow-up conversation.
4. **Praise or agreement** : short, warm, specific. Add a follow-up question to extend the thread when the commenter looks worth talking to.
5. **Spam or bait** : self-promotion, generic AI filler, "DM me", trolling. Do not reply. List them so the user knows they were seen.

## Process

1. Orient : identity, username, language, target audience.
2. List the user's recent posts and keep the ones with comments, newest first. Posts under 48 hours old come first.
3. Pull the comments still waiting under those posts, a handful of posts at a time.
4. Triage each comment into a bucket. Note `pinned` comments and comments with replies already under them (`reply_count`) : those threads are visible to more people.
5. Draft one reply per comment in buckets 1 to 4 : 1 to 3 sentences, specific to what they wrote, first name when natural, a question at the end when the thread deserves to continue.
6. Present everything in one review table. The user approves all, edits some, or drops some.
7. Save each approved reply as a Taplio comment draft targeting that comment, then, on one explicit go for the batch, commit them. Quote the scheduled time of each.
8. Close with the queue status and the lead signals to pass on.

## Output format

```
COMMENT INBOX - [N] comments waiting under [M] posts

POST : [first line of the post] ([X hours ago], [comments] comments)

1. [Commenter name] - [headline, 8 words max] | bucket : QUESTION | pinned : no | replies under it : 0
   They said : "[comment text]"
   Reply : "[proposed reply]"

2. [Commenter] - [headline] | bucket : LEAD SIGNAL
   They said : "..."
   Reply : "..."
   Flag : matches target audience, worth a follow-up conversation

...

SKIPPED (no reply)
- [Commenter] : spam / bait / generic, reason in 5 words

REVIEW
Approve all, or tell me which numbers to edit or drop. Nothing is scheduled until you say go.

AFTER GO
- [N] replies scheduled. First due at [scheduled_for], last at [scheduled_for].
- [N] comment likes queued.
- Queue now : [pending count] pending.
- Lead signals to follow up : [names].
```

## Rules

- Reply early : LinkedIn rewards author replies in the first hour. If a post is fresh, run this before anything else.
- Never reply with a bare "Thanks !". Add one specific word about what they said, or a question.
- Never argue in public with a troll. One factual reply at most, then stop.
- Never reply to spam : it feeds the thread with noise and signals the algorithm that bait works.
- Replies go out through the user's hourly comment limit : a batch of 15 spreads over hours. That is expected, say so.
- Do not commit anything without the batch approval. Never say a reply is live until the MCP confirms it.
- Keep replies under 400 characters. The hard cap is 1250.

## Working with Taplio

Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.

Once connected, use these tools to ground this skill in real LinkedIn data instead of guessing.

1. Call `get_me` first. Read `name`, `username`, and `ai_settings` (language, role, target audience, topics, description). The username tells you which posts are the user's own, and the target audience drives the lead-signal bucket.
2. List the user's recent posts with `find_posts_to_comment(source="my_posts", limit=10)`. Each item has the `post_urn`, `text`, `posted_at`, and `metrics.comments`. Keep posts with comments, newest first. For a specific window, `list_posts(status="sent", from="<date>", to="<date>")` lists the same posts with their ids.
3. Pull the waiting comments with `find_comments_to_reply(post_ids="<urn1>,<urn2>,<urn3>", limit=50)`. Pass 3 to 5 posts per call, never more : each post costs one upstream call. The tool already filters out comments the user answered, wrote, or hid, so what comes back is the real backlog. Each comment has `comment_urn`, `post_urn`, `text`, `commenter` (name, headline, linkedin_url), `posted_at`, `reply_count`, and `pinned`. Do not use the `url` parameter : it needs the Enterprise plan, and `post_ids` does the job.
4. Triage and draft per the buckets and the output format.
5. For each approved reply, call `create_comment_draft(post_urn="<post_urn>", content="<reply>", comment_id="<comment_urn>")`. The `comment_id` is what makes it a reply to that comment instead of a new comment on the post. Keep every returned `id`. Edits before commit go through `update_comment_draft(id, content)`.
6. On the user's explicit go, call `commit_comment_draft(id)` once per approved draft. Each commit SCHEDULES the reply : it comes back `pending` with a `scheduled_for` time, and Taplio posts it from the user's account within minutes, or hours later if the user is outside their posting window or has hit their hourly comment limit. Quote the times, never say the replies are posted, and never commit the same draft twice (rejected).
7. Optional, in the same go : like each comment the user answers with `like_post(post_urn="<comment_urn>")`. It tells the commenter they were read, even before the reply lands. Growth plan or above ; a lower plan answers `insufficient_plan`, then skip it. The like joins the send queue : quote `scheduled_for`, never say it is done, and confirm with `get_post_like("<comment_urn>")`. Asking twice returns the same pending like. Never like spam or bait.
8. Close with `list_comment_drafts(status="pending", limit=50)` for the queue. If the user asks whether a reply went live, `get_comment_draft(id)` returns `posted` with a `comment_urn`, or `failed` / `cancelled` with a `failure_reason` (for example the post belongs to a group the user has not joined, or comments are restricted).

Limitation to state honestly : the MCP shows comments, not the likes or reposts other people left, and only comments the user has not answered yet. Threads the user already replied to on LinkedIn do not come back.

### Without Taplio connected

If the Taplio tools are unavailable or `get_me` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : ask the user to paste the comments to answer (commenter, headline if visible, comment text, which post), triage them, and draft the replies with the same rules. The user posts them on LinkedIn themselves. Do not invent numbers : when a figure was not measured, say so.
