#!/usr/bin/env node
// Builds the GitHub Copilot package in copilot/ from this repo's shared
// skills, without touching the files the other clients read. The output is
// committed: the Awesome Copilot marketplace installs it from this repository
// (source.path "copilot") at a release tag.
//
// What differs from the shared plugin, per the Awesome Copilot review rules
// (https://github.com/github/awesome-copilot/discussions/968):
// - only the skills listed in copilot-src/listing.json, all built on data a
//   model cannot see by itself; descriptions come from that file;
// - no sign-up, trial or tracking link, no client-specific setup command, no
//   "Power up with Taplio" section;
// - when Taplio is not connected, each skill says so and works from what the
//   user pastes instead of stopping.
//
// Usage: node scripts/build-copilot.mjs
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'copilot-src');
const out = join(root, 'copilot');
const listing = JSON.parse(readFileSync(join(src, 'listing.json'), 'utf8'));
const SKILLS = listing.skills ?? {};
if (Object.keys(SKILLS).length === 0) throw new Error('listing.json: skills is empty');

const GATE = 'Before doing anything else, call `get_me`. If it succeeds, follow the steps below. If the Taplio tools are unavailable or the call fails, follow "Without Taplio connected" at the end of this section.';

const notConnected = (fallback) => `### Without Taplio connected

If the Taplio tools are unavailable or \`get_me\` fails, say in one sentence that Taplio is not connected, so this run uses only what the user provides, and that the Taplio server bundled with this plugin asks them to sign in on the first tool call if they want their own LinkedIn data used. If the call failed with a message about their Taplio account or plan, pass that message on in one sentence instead. Do not add links of your own. Then continue without the Taplio tools : ${fallback} Do not invent numbers : when a figure was not measured, say so.
`;

// Plain replacements applied to every SKILL.md body, in order. Each one must
// match where it is expected: see EXPECTED below.
const REPLACEMENTS = [
  ['gate', /^\*\*This skill requires the Taplio MCP and does not run without it\.\*\*.*$/m, GATE],
  ['heading', /^## Requires the Taplio MCP[ \t]*$/m, '## Working with Taplio'],
  ['fully-mcp', / This skill is fully MCP-powered : when connected, pull/g, ' When connected, pull'],
  ['required', / The Taplio MCP itself is required \(see the gate above\) : never run this skill without it\./g, ''],
  ['canvas', / \(for example Claude Artifacts or ChatGPT Canvas\)/g, ''],
  // Hand-offs to skills that are not in the Copilot package.
  ['profile-optimizer', / \(run the Profile Optimizer skill\)/g, ' (the headline and About section may need work)'],
  ['niche-definer', / If not defined, run the Niche Definer skill first\./g, ' If not defined, ask the user to state it in one sentence first.'],
  ['post-writer', /\(hand off to the Post Writer skill, then save it/g, '(use the Post Drafter skill, then save it'],
  ['daily-routine', /, or runs the Daily Engagement Routine\./g, '.'],
  ['warm-lead-1', / Answer, then flag them for the Warm Lead Finder skill\./g, ' Answer, then flag them as worth a follow-up conversation.'],
  ['warm-lead-2', /Flag : matches target audience, hand to Warm Lead Finder/g, 'Flag : matches target audience, worth a follow-up conversation'],
  ['smart-comment-1', /\(hand off to the Smart Comment Writer skill, one post at a time, or draft them all in a batch with the same rules\)/g, '(one post at a time, or all of them in a batch)'],
  ['smart-comment-2', /When they do, keep each pick's `post_urn` and hand off to the Smart Comment Writer skill, which saves the text with `create_comment_draft\(post_urn, content\)` and only schedules it through `commit_comment_draft` after the user's explicit go\./g,
    "When they do, write each comment in the user's voice with the angle chosen for that pick, save it with `create_comment_draft(post_urn, content)`, show it, and only schedule it with `commit_comment_draft(id)` after the user's explicit go. A commit schedules the comment : quote the `scheduled_for` time it returns and never say it is posted."],
  ['watchlist', / Use the Engagement Watchlist Builder skill to build one and keep it in the assistant's memory\./g, " The user can keep their own list of creators in the assistant's memory."],
];

// Replacements that must apply to a given skill (so an upstream rewording
// fails the build instead of silently leaving the old text in).
const EXPECTED = {
  'linkedin-analytics-interpreter': ['fully-mcp', 'profile-optimizer'],
  'linkedin-content-pillars-builder': ['required', 'niche-definer', 'post-writer'],
  'linkedin-content-calendar-planner': ['required'],
  'linkedin-post-writer': ['canvas'],
  'linkedin-comment-reply-manager': ['daily-routine', 'warm-lead-1', 'warm-lead-2'],
  'linkedin-comment-opportunity-finder': ['smart-comment-1', 'smart-comment-2', 'watchlist'],
};

const BANNED = [
  /\btrial\b/i, /utm_/i, /taplio\.com/i, /signin/i, /claude\.ai/i, /mcp add/i,
  /Power up with Taplio/, /\bClaude\b/, /ChatGPT/, /\bManus\b/, /\bCursor\b/,
  /does not run without/i, /STOP immediately/, /Requires the Taplio MCP/, /Post Writer/, /\u2014/,
];

function copilotSkill(text, name, spec) {
  const lines = text.split('\n');
  const result = [];
  let skipping = false;
  let replaced = false;
  for (const line of lines) {
    if (/^### The user does not have the Taplio MCP\? Stop here\./.test(line)) {
      skipping = true;
      result.push(notConnected(spec.fallback));
      replaced = true;
      continue;
    }
    if (/^## Power up with Taplio/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping && /^#{1,3} /.test(line)) skipping = false;
    if (!skipping) result.push(line);
  }
  if (!replaced) throw new Error(`${name}: "not connected" section not found`);
  let body = result.join('\n');

  // Frontmatter: name and description come from listing.json.
  const outName = spec.rename ?? name;
  if (spec.description.includes('"')) throw new Error(`${name}: description must not contain double quotes`);
  if (spec.description.length > 1024) throw new Error(`${name}: description is over 1024 characters`);
  const fm = body.match(/^---\n[\s\S]*?\n---\n/);
  if (!fm) throw new Error(`${name}: frontmatter not found`);
  body = `---\nname: "${outName}"\ndescription: "${spec.description}"\n---\n` + body.slice(fm[0].length);

  if (spec.title) {
    const before = body;
    body = body.replace(/^# LinkedIn .+$/m, `# LinkedIn ${spec.title}`);
    if (body === before) throw new Error(`${name}: title not replaced`);
  }

  const applied = new Set();
  for (const [key, from, to] of REPLACEMENTS) {
    const next = body.replace(from, to);
    if (next !== body) applied.add(key);
    body = next;
  }
  if (!applied.has('gate') || !applied.has('heading')) throw new Error(`${name}: MCP gate or heading not found`);
  for (const key of EXPECTED[name] ?? []) {
    if (!applied.has(key)) throw new Error(`${name}: expected replacement "${key}" did not apply`);
  }

  body = body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  for (const banned of BANNED) {
    if (banned.test(body)) throw new Error(`${name}: still contains ${banned}`);
  }
  return { outName, body };
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'skills'), { recursive: true });

const manifest = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: listing.name,
  description: listing.description,
  version: listing.version,
  author: { name: 'Taplio', url: 'https://taplio.com' },
  repository: 'https://github.com/TaplioOfficial/taplio-linkedin-plugin',
  license: 'MIT',
  keywords: listing.keywords,
};
writeFileSync(join(out, 'plugin.json'), JSON.stringify(manifest, null, 2) + '\n');
cpSync(join(root, 'mcp.json'), join(out, 'mcp.json'));
cpSync(join(root, 'LICENSE'), join(out, 'LICENSE'));

// Titles of the skills left out of the package: an included skill must not
// send the user to one of them.
const leftOutTitles = [];
for (const dir of readdirSync(join(root, 'skills'), { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name in SKILLS) continue;
  const file = join(root, 'skills', dir.name, 'SKILL.md');
  if (!existsSync(file)) continue;
  const title = (readFileSync(file, 'utf8').match(/^# LinkedIn (.+)$/m) || [])[1];
  if (title) leftOutTitles.push(title.trim());
}

const readme = readFileSync(join(src, 'README.md'), 'utf8');
for (const banned of [/utm_/i, /\btrial\b/i, /signin/i, /\u2014/]) {
  if (banned.test(readme)) throw new Error(`README: contains ${banned}`);
}

const built = [];
for (const [name, spec] of Object.entries(SKILLS)) {
  const file = join(root, 'skills', name, 'SKILL.md');
  if (!existsSync(file)) throw new Error(`${name}: not found in skills/`);
  const { outName, body } = copilotSkill(readFileSync(file, 'utf8'), name, spec);
  for (const title of leftOutTitles) {
    if (body.includes(title)) throw new Error(`${name}: refers to "${title}", a skill not in the Copilot package`);
  }
  if (!readme.includes(`\`${outName}\``)) throw new Error(`README: does not list ${outName}`);
  mkdirSync(join(out, 'skills', outName), { recursive: true });
  writeFileSync(join(out, 'skills', outName, 'SKILL.md'), body);
  built.push(outName);
}
writeFileSync(join(out, 'README.md'), readme);

console.log(`Built copilot/ with ${built.length} skills: ${built.join(', ')}.`);
