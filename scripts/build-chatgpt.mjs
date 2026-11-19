#!/usr/bin/env node
// Builds the ChatGPT plugin ZIP (dist/taplio-chatgpt.zip) from this repo,
// without touching the files the other clients read.
//
// What differs from the shared plugin, per OpenAI's plugin guidelines:
// - listing, review cases and release notes come from chatgpt/listing.json;
// - mcp.json declares OAuth with dynamic client registration;
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
  const body = result.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  for (const banned of [/free trial/i, /\btrial\b/i, /claude\.ai/i, /claude mcp add/i, /utm_/i, /Power up with Taplio/]) {
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
const manifest = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: listing.name,
  version: listing.version,
  description: listing.description,
  author: { name: 'Taplio', url: 'https://taplio.com' },
  homepage: 'https://taplio.com/taplio-linkedin-mcp',
  repository: 'https://github.com/TaplioOfficial/taplio-linkedin-plugin',
  license: 'MIT',
  keywords: ['linkedin', 'taplio', 'content-creation', 'personal-branding', 'social-media'],
  extensions: {
    'com.openai': {
      interface: listing.interface,
      review,
      publication: listing.publication,
    },
  },
};
writeFileSync(join(out, 'plugin.json'), JSON.stringify(manifest, null, 2) + '\n');

const mcp = JSON.parse(readFileSync(join(root, 'mcp.json'), 'utf8'));
for (const server of Object.values(mcp.mcpServers)) {
  server.extensions = { 'com.openai': { auth: { type: 'oauth', client: { mode: 'dcr' } } } };
}
writeFileSync(join(out, 'mcp.json'), JSON.stringify(mcp, null, 2) + '\n');

cpSync(join(root, '.claude-plugin', 'icon.png'), join(out, 'assets', 'icon.png'));
cpSync(join(root, 'LICENSE'), join(out, 'LICENSE'));

let count = 0;
for (const dir of readdirSync(join(root, 'skills'), { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name.startsWith('.')) continue;
  const src = join(root, 'skills', dir.name);
  const dst = join(out, 'skills', dir.name);
  cpSync(src, dst, { recursive: true });
  const skillFile = join(dst, 'SKILL.md');
  if (!existsSync(skillFile)) continue;
  writeFileSync(skillFile, chatgptSkill(readFileSync(skillFile, 'utf8'), dir.name));
  count++;
}

execFileSync('zip', ['-qr', zip, 'taplio', '-x', '*.DS_Store'], { cwd: join(root, 'dist', 'chatgpt') });
console.log(`Built ${zip} with ${count} skills${demoUrl ? '' : ' (no demo_recording_url yet: pass --demo-url before submitting)'}.`);
