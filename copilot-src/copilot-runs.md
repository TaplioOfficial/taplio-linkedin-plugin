# Copilot runs of the Copilot package

Two skills of the `copilot/` package, each run in GitHub Copilot CLI once without the Taplio MCP server and once with it, on 2026-11-26.

## Setup

- GitHub Copilot CLI 1.0.116, default model, non-interactive mode (`copilot -p`).
- Package loaded from this repository with `--plugin-dir copilot`. Nothing else was installed; personal skill folders were excluded and `--no-custom-instructions` was set, so only the 10 skills of this package were available.
- Shell and file writes were denied for every run (`--deny-tool shell --deny-tool write`).
- **Without the MCP server:** `--disable-mcp-server taplio`.
- **With the MCP server:** signed in through the browser (OAuth) with a Taplio test account whose profile is about a different niche (art and nonprofit). Only read tools were allowed: `get_me` and `search_inspiration`, plus `get_draft` and `list_drafts` for the critic. Nothing was written to Taplio or LinkedIn.
- The test account name, creator names and post URLs are redacted below. Everything else is the CLI output as printed, with long dashes written as hyphens.

## 1. linkedin-trending-topics-scanner

Without the server, the skill says so in one sentence, offers ideas labelled as ideas rather than trends, and asks for material. Given pasted material, it builds the three topics from it and says where they come from. With the server, it reads `get_me`, runs three `search_inspiration` queries limited to the last 7 days, and builds the topics from measured posts, with dates and engagement.

**1a. Without the MCP server**

Prompt:

> What's trending in B2B SaaS marketing on LinkedIn this week? I'm a demand gen lead at a 50-person SaaS company and I want 3 topics I could post about.

Copilot CLI output:

```text
● skill(linkedin-trending-topics-scanner)

Taplio isn’t connected, and I don’t have a live view of what’s spiking on LinkedIn this week - so I can’t verify these as trends. For a 50-person SaaS demand-gen team, here are three timely **post ideas**, not trend claims:

1. **MQLs vs. pipeline the sales team actually accepts** - With the wave: explain how you’re aligning on quality. Against it: argue that “more qualified leads” is still a vanity metric without conversion data.
2. **Attribution when buyers research in private** - With the wave: share how you combine attribution with sales feedback. Against it: question whether adding another attribution tool solves the real problem.
3. **AI-assisted personalization at a small team** - With the wave: show one bounded workflow that saves time. Against it: make the case that better targeting beats generating more personalized copy.

Paste a few recent LinkedIn posts, headlines, or newsletter items and I can identify which three topics are genuinely gaining traction and shape both mainstream and contrarian angles.

Changes    +0 -0
AI Credits 0.17 (14s)
```

**1b. Without the MCP server, follow-up with pasted material**

Prompt:

> Here is what I keep seeing in my feed and newsletters this week:
> 1. Several posts saying MQLs are dead and teams should report on pipeline only.
> 2. A newsletter on buyers using AI assistants to shortlist vendors before talking to sales.
> 3. People debating whether gated ebooks still convert.
> 4. A thread about intent data vendors overpromising.
> 5. Founders saying LinkedIn ads got more expensive this quarter.

Copilot CLI output:

```text
## Trending in B2B SaaS marketing this week

Based on the posts and newsletter items you’re seeing - not an independent LinkedIn-wide trend check - these three look like strong fits for a demand gen lead at a 50-person SaaS company.

1. **Are MQLs dead, or just poorly defined?**  
   **Why it’s hot:** You’re seeing repeated calls to replace MQL reporting with pipeline-only metrics.  
   **With the wave:** Share how your team connects lead signals to sales-accepted pipeline.  
   **Against the wave:** Argue that dropping MQLs doesn’t fix the problem if teams still lack useful early indicators.  
   **Format:** Opinion with a practical example.

2. **AI assistants are shaping vendor shortlists before sales gets involved**  
   **Why it’s hot:** Your newsletter points to a change in how buyers discover and evaluate vendors.  
   **With the wave:** Explain what demand gen can do to make a company easier to understand and recommend.  
   **Against the wave:** Push back on the idea that “optimizing for AI” replaces clear positioning and useful customer proof.  
   **Format:** Listicle or practical framework.

3. **Are gated ebooks still worth the form fill?**  
   **Why it’s hot:** The debate puts a familiar lead-capture tactic under scrutiny.  
   **With the wave:** Share when gating still makes sense - and what you measure beyond downloads.  
   **Against the wave:** Make the case that ungated content can build trust and create better-informed conversations.  
   **Format:** Short experiment recap or opinion.

**Pick one:** Start with the MQL debate. It’s directly relevant to your role and gives you room to offer a nuanced take rather than simply echo “MQLs are dead.”

Changes    +0 -0
AI Credits 0.23 (22s)
```

**1c. With the MCP server**

Prompt:

> What's trending in B2B SaaS marketing on LinkedIn this week? I'm a demand gen lead at a 50-person SaaS company and I want 3 topics I could post about.

Copilot CLI output:

```text
● skill(linkedin-trending-topics-scanner)

 ● My profile (MCP: … {"name":"<test account>","username":"<test account>","ai_settings":{"keywords":["...

 ● Search inspiration  Output too large to read at once (67.2 KB). Saved to: <temp file>

 ● Search inspiration  Output too large to read at once (59.2 KB). Saved to: <temp file>

 ● Search inspiration  Output too large to read at once (54.6 KB). Saved to: <temp file>

 ✗ Shell Inspect recent … (denied: shell is blocked in these runs)

 ● Read <temp file> L1:60 (60 line…

 ● Read <temp file> L1:60 (60 line…

 ● Read <temp file> L1:60 (60 line…

## B2B SaaS marketing on LinkedIn this week

These are patterns in Taplio’s indexed, high-engagement posts from **Nov. 19–24** - not a live trend-velocity ranking. I used the demand-gen context you gave; Taplio’s saved profile appears to describe a different niche.

1. **Attribution vs. incrementality.** A Nov. 24 post comparing channel credit under two measurement models drew **155 likes and 53 comments** ([source](<LinkedIn post URL>)).  
   **With the wave:** Share how you’re pressure-testing whether channels create pipeline, not just clicks.  
   **Against the wave:** Push back on overcomplicating measurement: for a 50-person team, a few disciplined experiments may beat an elaborate attribution stack.  
   **Format:** Opinion with a practical example.

2. **AI search as a discovery channel.** Posts on whether AI tools recommend or accurately describe brands appeared in the week’s results; one Nov. 19 post earned **64 likes and 41 comments** ([source](<LinkedIn post URL>)).  
   **With the wave:** Explain how your team is making its expertise and positioning easier to verify across your site and credible third-party sources.  
   **Against the wave:** Argue that “optimizing for AI” is premature if you haven’t nailed clear positioning and useful, trustworthy content.  
   **Format:** Short checklist or opinion.

3. **Pipeline math over “more leads.”** A Nov. 20 post working backward from ARR to meetings and channel assumptions drew **131 likes and 66 comments**; a Nov. 23 post challenged lead-volume-first thinking ([pipeline math](<LinkedIn post URL>), [lead quality](<LinkedIn post URL>)).  
   **With the wave:** Show how your actual conversion rates and sales cycle translate a revenue target into pipeline needs.  
   **Against the wave:** Challenge the reflex to buy more leads; focus on fit, handoffs, and where prospects drop out.  
   **Format:** Simple funnel breakdown.

**Best fit:** Start with pipeline math. It’s immediately useful to a lean team, and you can ground it in your own numbers rather than broad claims.

Changes    +0 -0
AI Credits 0.65 (38s)
```

Each `search_inspiration` result was 55 to 67 KB, which Copilot saves to a file; it first tried a shell command to filter that file (denied by these runs' rules), then read the file directly.

## 2. linkedin-post-performance-critic

Without the server, the skill audits the pasted draft on its own. With the server, it reads the user's profile settings, searches comparable posts, retries once with a shorter query, and calibrates the audit against two posts on the same topic. It also flags that the profile saved in Taplio does not match the audience the user describes. It offers to save the rewrite as a Taplio draft and does not do it without a yes.

**2a. Without the MCP server**

Prompt:

> Can you critique this LinkedIn draft before I post it tomorrow? My audience is demand gen and RevOps people.
>
> ---
> We stopped reporting on MQLs in Q3.
>
> Not because MQLs are useless. Because they made us optimize for the wrong meeting.
>
> Our SDRs were chasing ebook downloads from students and job seekers. Sales stopped trusting marketing numbers. Every QBR became an argument about definitions.
>
> So we picked 3 signals instead: pricing page visits from target accounts, replies to founder-led outreach, and demo requests. That's it.
>
> Pipeline from marketing went up 22% in one quarter. Fewer leads, better conversations.
>
> What would you cut from your funnel reporting tomorrow?
> ---

Copilot CLI output:

```text
● skill(linkedin-post-performance-critic)

Taplio isn’t connected, so this critique uses only the draft and audience you provided; the Taplio server bundled with this plugin asks you to sign in on its first tool call if you want your own LinkedIn data used.

## POST AUDIT

**SCORES**
- Hook: **4/5** - Clear, specific, and likely to catch demand gen and RevOps readers.
- Structure: **5/5** - Easy to scan; each beat gets room.
- Specificity: **4/5** - Q3, the three signals, and 22% add credibility; the pipeline metric could use a clearer definition.
- Voice: **4/5** - Direct and grounded, though “Fewer leads, better conversations” feels a little familiar.
- Payoff: **3/5** - The result is compelling, but it’s unclear how the new signals relate to the 22% increase.
- CTA: **4/5** - Relevant question, but “what would you cut” may invite broad answers.

**OVERALL: 4/5**

## TOP 2 FIXES

**FIX 1 - Payoff**  
What’s unclear: “Pipeline from marketing went up 22%” doesn’t say what pipeline means or establish whether the new signals drove the change.  
Concrete change: Specify the metric you actually tracked (for example, sourced or influenced pipeline) and frame the 22% as an observed result, not proof of causation.

**FIX 2 - CTA**  
What’s weak: The question is easy to answer vaguely.  
Concrete change: Ask about a concrete reporting metric - something demand gen and RevOps readers can name and explain why they’d drop it.

## REWRITE OF THE WEAKEST SECTION

Original: “So we picked 3 signals instead: pricing page visits from target accounts, replies to founder-led outreach, and demo requests. That's it. Pipeline from marketing went up 22% in one quarter. Fewer leads, better conversations.”

Rewrite: “We replaced MQL volume with three signals: pricing-page visits from target accounts, replies to founder-led outreach, and demo requests. In the next quarter, marketing pipeline was up 22%. Fewer leads; better conversations. The signals gave Sales and Marketing a shared way to focus on buying intent.”

## VERDICT

**PUBLISH AFTER 5-MIN FIXES.** Clarify what “marketing pipeline” means, and make the CTA more specific to funnel reporting.

Changes    +0 -0
AI Credits 0.17 (11s)
```

**2b. With the MCP server**

Prompt:

> Can you critique this LinkedIn draft before I post it tomorrow? My audience is demand gen and RevOps people.
>
> ---
> We stopped reporting on MQLs in Q3.
>
> Not because MQLs are useless. Because they made us optimize for the wrong meeting.
>
> Our SDRs were chasing ebook downloads from students and job seekers. Sales stopped trusting marketing numbers. Every QBR became an argument about definitions.
>
> So we picked 3 signals instead: pricing page visits from target accounts, replies to founder-led outreach, and demo requests. That's it.
>
> Pipeline from marketing went up 22% in one quarter. Fewer leads, better conversations.
>
> What would you cut from your funnel reporting tomorrow?
> ---

Copilot CLI output:

```text
● skill(linkedin-post-performance-critic)

 ● My profile (MCP: … {"name":"<test account>","username":"<test account>","ai_settings":{"keywords":["...

 ● Search inspiration  Output too large to read at once (62.2 KB). Saved to: <temp file>

 ✗ Shell Review relevant… (denied: shell is blocked in these runs)

 ● Read <temp file> L1:18 (18 line…

 ● Search inspiration  Output too large to read at once (61.3 KB). Saved to: <temp file>

 ● Read <temp file> L1:75 (75 line…

## POST AUDIT

**Scores**
- Hook: **4/5** - Clear, direct, and relevant to demand gen and RevOps.
- Structure: **5/5** - Short paragraphs and a clean progression.
- Specificity: **3/5** - The 22% is compelling, but “pipeline from marketing” needs a definition or baseline.
- Voice: **4/5** - Sounds candid, not overly polished. One caveat: your Taplio profile currently positions you around art and nonprofit work, so this may feel off-brand unless that’s outdated or you have direct GTM experience.
- Payoff: **3/5** - The outcome lands, but it’s not clear what changed alongside the reporting signals - or how much the new approach drove the increase.
- CTA: **4/5** - A good question for your audience; asking about a specific reporting metric could get more useful replies.

**Overall: 4/5**

The niche benchmark supports the practical, numbers-led angle: One creator’s post working backward from sales targets used explicit funnel assumptions and drew 131 likes and 66 comments. Another creator’s post specifically cautioned against counting meetings that don’t become pipeline (286 likes, 214 comments). Your draft has the right ingredients; make the proof as concrete as those examples.

## TOP 2 FIXES

**FIX 1 - Specificity / payoff**  
What’s unclear: “Pipeline from marketing went up 22%” doesn’t say what counted as marketing pipeline or what you compared it against.  
Concrete change: Define the measure and comparison period, if you can. Avoid implying the reporting change caused the lift unless you can support that.

**FIX 2 - CTA**  
What’s missing: “What would you cut?” is broad enough to get vague answers.  
Concrete change: Ask for the specific metric or report your audience stopped using.

## REWRITE OF THE WEAKEST SECTION

**Original:** “So we picked 3 signals instead: pricing page visits from target accounts, replies to founder-led outreach, and demo requests. That's it.

Pipeline from marketing went up 22% in one quarter. Fewer leads, better conversations.”

**Rewrite:** “We replaced MQL volume with three signals: pricing-page visits from target accounts, replies to founder-led outreach, and demo requests.

The next quarter, marketing-sourced pipeline was up 22% versus [baseline]. We measured it as [your definition of marketing-sourced pipeline]. Fewer leads; better conversations.”

**VERDICT - PUBLISH AFTER 5-MIN FIXES.** Tighten the 22% attribution and make the CTA more specific. If you want to keep the rewrite, I can save it as a Taplio draft.

Changes    +0 -0
AI Credits 0.53 (46s)
```
