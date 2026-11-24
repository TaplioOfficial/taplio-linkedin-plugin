#!/usr/bin/env node
// Builds the ChatGPT plugin ZIP (dist/taplio-chatgpt.zip) from this repo,
// without touching the files the other clients read.
//
// What differs from the shared plugin, per OpenAI's plugin guidelines:
// - listing, review cases and release notes come from chatgpt/listing.json;
// - mcp.json declares OAuth with dynamic client registration and requests
//   the taplio:mcp scope on every authorization request;
// - each skill's "not connected" section points to this plugin instead of
//   offering a trial and Claude install steps, and the "Power up with Taplio"
//   section is left out (no promotion, no other assistant named).
//
// Usage: node scripts/build-chatgpt.mjs [--demo-url <url>]
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist', 'chatgpt', 'taplio');
const zip = join(root, 'dist', 'taplio-chatgpt.zip');
const listing = JSON.parse(readFileSync(join(root, 'chatgpt', 'listing.json'), 'utf8'));

const demoIdx = process.argv.indexOf('--demo-url');
const demoUrl = demoIdx > -1 ? process.argv[demoIdx + 1] : process.env.DEMO_RECORDING_URL;

const NOT_CONNECTED = `### Taplio is not connected yet? Stop here.

This skill needs the Taplio tools from this plugin. If they are unavailable or the first call fails, do not ask any questions and do not generate any output. Tell the user in one sentence to connect Taplio from this plugin and sign in with their Taplio account, then to run the request again.
`;

// Only the skills listed in includedSkills (listing.json) ship to ChatGPT: a
// small set with no overlapping triggers keeps ChatGPT's skill routing
// predictable and the review surface small. The others stay available to
// the other clients and can join ChatGPT in a later version.
const INCLUDED_SKILLS = new Set(listing.includedSkills ?? []);
if (INCLUDED_SKILLS.size === 0) throw new Error('listing.json: includedSkills is empty');

const POST_WRITER_DIRECT_SAVE = `If the user asks in the same request to save the post as a draft, write one post in their voice (no variants), call \`create_draft\` with it right away, and offer variants afterwards.
`;

// Plain replacements applied to every SKILL.md, in order.
const REPLACEMENTS = [
  [/^\*\*This skill requires the Taplio MCP and does not run without it\.\*\*.*$/m,
    'Before doing anything else, call `get_me`. If it fails or the Taplio tools are unavailable, follow "Taplio is not connected yet" below.'],
  [/^## Requires the Taplio MCP\s*$/m, '## Works with your Taplio account'],
  [/Requires the Taplio MCP/g, 'Uses Taplio'],
  [/\bthe Taplio MCP\b/g, 'the Taplio tools'],
  [/\bThe Taplio MCP\b/g, 'The Taplio tools'],
  [/fully MCP-powered/g, 'fully powered by Taplio'],
  [/\bwith (?:the )?MCP connected\b/g, 'with Taplio connected'],
  [/\bMCP connected\b/g, 'Taplio connected'],
  [/\bthe MCP\b/g, 'Taplio'],
  [/\bThe MCP\b/g, 'Taplio'],
  [/\(for example Claude Artifacts or ChatGPT Canvas\)/g, '(such as ChatGPT Canvas)'],
  [/keep it updated in memory/g, 'keep it updated in this conversation'],
  // Hand-offs to skills that are not in the ChatGPT package.
  [/ \(run the Profile Optimizer skill\)/g, ' (the profile bio may need work)'],
  [/, hand to Warm Lead Finder/g, ', worth a follow-up conversation'],
  [/ \(run the Warm Lead Finder\)/g, ' (worth a follow-up conversation)'],
  [/ \(from the Content Pillars Builder skill\)/g, ' (ask the user, or derive them from their best posts)'],
  [/ \(from the Engagement Watchlist Builder, or pick one that matches the niche\)/g, ' (pick one that matches the niche)'],
  [/ Use the Engagement Watchlist Builder skill to build one and keep it in the assistant's memory\./g, ' The user can keep their own list of creators in this conversation.'],
  [/ Answer, then flag them for the Warm Lead Finder skill\./g, ' Answer, then flag them as worth a follow-up conversation.'],
  [/For a weekly view, hand off to the Engagement Tracker skill\./g, 'For a weekly view, combine `list_comment_drafts` with `get_analytics_overview`.'],
  [/Daily cap of 5 outbound comments\. More looks like automation and dilutes quality\./g, 'Daily cap of 5 outbound comments, so each one gets real attention.'],
  [/Keep the whole calendar in memory/g, 'Keep the whole calendar in this conversation'],
  [/the assistant's memory and/g, 'this conversation and'],
];

const BANNED = [/looks like automation/i, /free trial/i, /\btrial\b/i, /claude\.ai/i, /claude mcp add/i, /\bClaude\b/, /utm_/i, /Power up with Taplio/, /\bMCP\b/];

function chatgptSkill(text, name) {
  const lines = text.split('\n');
  const result = [];
  let skipping = null; // 'notConnected' | 'powerUp'
  let replaced = false;
  for (const line of lines) {
    if (/^### The user does not have the Taplio MCP\? Stop here\./.test(line)) {
      skipping = 'notConnected';
      result.push(NOT_CONNECTED);
      replaced = true;
      continue;
    }
    if (/^## Power up with Taplio/.test(line)) {
      skipping = 'powerUp';
      continue;
    }
    if (skipping && /^#{1,3} /.test(line)) skipping = null;
    if (!skipping) result.push(line);
  }
  if (!replaced) throw new Error(`${name}: "not connected" section not found`);
  let body = result.join('\n');
  for (const [from, to] of REPLACEMENTS) body = body.replace(from, to);
  if (name === 'linkedin-post-writer') {
    // Right after the H1 title and its intro paragraph.
    body = body.replace(/(^# .+\n\n[^\n]+\n)/m, `$1\n${POST_WRITER_DIRECT_SAVE}`);
    if (!body.includes('call `create_draft` with it right away')) throw new Error('post-writer: direct-save rule not inserted');
  }
  body = body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  for (const banned of BANNED) {
    if (banned.test(body)) throw new Error(`${name}: still contains ${banned}`);
  }
  return body;
}

rmSync(join(root, 'dist', 'chatgpt'), { recursive: true, force: true });
rmSync(zip, { force: true });
mkdirSync(join(out, 'assets'), { recursive: true });

// Manifest (Agent Plugins layout) with the OpenAI extension.
const review = structuredClone(listing.review);
if (demoUrl) review.demo_recording_url = demoUrl;
const { includedSkills: _included, ...listingFields } = listing;
// OpenAI reads keywords as discovery terms and accepts at most 25.
if (!Array.isArray(listingFields.keywords) || listingFields.keywords.length === 0 || listingFields.keywords.length > 25) {
  throw new Error('listing.json: keywords must list 1 to 25 terms');
}
const manifest = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: listingFields.name,
  version: listingFields.version,
  description: listingFields.description,
  author: { name: 'Taplio', url: 'https://taplio.com' },
  homepage: 'https://taplio.com/taplio-linkedin-mcp',
  repository: 'https://github.com/TaplioOfficial/taplio-linkedin-plugin',
  license: 'MIT',
  keywords: listingFields.keywords,
  extensions: {
    'com.openai': {
      interface: listingFields.interface,
      review,
      publication: listingFields.publication,
    },
  },
};
writeFileSync(join(out, 'plugin.json'), JSON.stringify(manifest, null, 2) + '\n');

const mcp = JSON.parse(readFileSync(join(root, 'mcp.json'), 'utf8'));
for (const server of Object.values(mcp.mcpServers)) {
  server.extensions = {
    'com.openai': { auth: { type: 'oauth', client: { mode: 'dcr' }, baseScopes: ['taplio:mcp'] } },
  };
}
writeFileSync(join(out, 'mcp.json'), JSON.stringify(mcp, null, 2) + '\n');

cpSync(join(root, '.claude-plugin', 'icon.png'), join(out, 'assets', 'icon.png'));
cpSync(join(root, 'LICENSE'), join(out, 'LICENSE'));

// Titles of the skills left out of the package: an included skill must not
// send the user to one of them.
const leftOutTitles = [];
for (const dir of readdirSync(join(root, 'skills'), { withFileTypes: true })) {
  if (!dir.isDirectory() || INCLUDED_SKILLS.has(dir.name)) continue;
  const file = join(root, 'skills', dir.name, 'SKILL.md');
  if (!existsSync(file)) continue;
  const title = (readFileSync(file, 'utf8').match(/^# LinkedIn (.+)$/m) || [])[1];
  if (title) leftOutTitles.push(title.trim());
}

let count = 0;
for (const dir of readdirSync(join(root, 'skills'), { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name.startsWith('.') || !INCLUDED_SKILLS.has(dir.name)) continue;
  const src = join(root, 'skills', dir.name);
  const dst = join(out, 'skills', dir.name);
  cpSync(src, dst, { recursive: true });
  const skillFile = join(dst, 'SKILL.md');
  if (!existsSync(skillFile)) continue;
  const body = chatgptSkill(readFileSync(skillFile, 'utf8'), dir.name);
  for (const title of leftOutTitles) {
    if (body.includes(title)) throw new Error(`${dir.name}: refers to "${title}", a skill not in the ChatGPT package`);
  }
  writeFileSync(skillFile, body);
  count++;
}

execFileSync('zip', ['-qr', zip, 'taplio', '-x', '*.DS_Store'], { cwd: join(root, 'dist', 'chatgpt') });
if (count !== INCLUDED_SKILLS.size) throw new Error(`includedSkills lists ${INCLUDED_SKILLS.size} skills, ${count} found in skills/`);
console.log(`Built ${zip} with ${count} skills${demoUrl ? '' : ' (no demo_recording_url yet: pass --demo-url before submitting)'}.`);
