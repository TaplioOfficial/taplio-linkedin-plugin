# Portal texts for the review (not in the ZIP)

Paste these in platform.openai.com > Plugins > Taplio > Add review information. Credentials never go in the ZIP.

## Reviewer credentials

- Sign-in method: Magic link or email code (mcp-review@theaicompany.org)
- Login URL: https://app.taplio.com/signin
- Tenant: none
- Sign-in steps:

```
1. In ChatGPT, open the Taplio plugin and select Connect.
2. On the Taplio sign-in page, enter mcp-review@theaicompany.org and open the sign-in link Taplio emails to that address.
3. Select "Allow" on the consent screen. You return to ChatGPT, connected.
The account is ready: it is on Taplio's highest plan, already connected to a LinkedIn test profile, and has sample drafts and published posts. There is nothing to set up.
```

## Reviewer notes

```
Taplio is a LinkedIn content and engagement tool by lempire. The plugin talks only to the Taplio API (https://mcp.taplio.com/, OAuth), on the user's own Taplio account.

How actions reach LinkedIn: ChatGPT never calls LinkedIn. It reads and writes the user's Taplio data: drafts, scheduled posts, comment drafts, likes and connection requests. Writes that reach LinkedIn (publishing, scheduled posts, comments, likes, connection requests) are created only after the user asks for them in the conversation, are queued in Taplio with the time they will go out, can be cancelled before that time, and are then carried out by Taplio from the LinkedIn account the user connected to Taplio. Inspiration search returns public LinkedIn posts from Taplio's own index.

Test account: a dedicated Taplio account connected to a LinkedIn test profile we own. It is not a real user's account, and every write on it is safe to run. Test case 3 schedules a real post on that test profile; ask "unschedule my scheduled post" to return it to drafts. publish_draft posts immediately and cannot be undone, which is why it is annotated destructive.

Plans: the test account has every feature. On a lower plan, a tool answers that the feature is not included in the user's current plan and links to the plan page in Taplio. The plugin does not sell or start a subscription.

Contact during review: [name, email], replies within one business day.
```
