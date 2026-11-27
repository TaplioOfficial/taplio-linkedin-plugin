/**
 * Taplio for LinkedIn, DeepSeek Harness plugin.
 *
 * Registers the Taplio MCP server (https://mcp.taplio.com/, Streamable HTTP, OAuth 2.1)
 * with the shared MCP manager for this plugin's lifetime, shows the Taplio account on the
 * Plugins page when the account registry runs, and contributes the 27 Taplio skills from
 * this repository's `skills/` directory. The manager owns connection, authorization,
 * saved grants and sign-out; once the user connects, the `mcp__taplio__*` tools appear.
 * @module taplio-linkedin-plugin
 */

import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { BUNDLED_SKILL_RANK } from '@deepseek-ai/dsh-skill'
import { COPY } from './locales.js'

export const name = 'taplio'
export const inject = ['mcpManager', 'systemPrompt', 'skills']

const SERVER_NAME = 'taplio'
const CREDENTIAL_KEY = 'mcp-client/taplio'
const SERVER_URL = 'https://mcp.taplio.com/'
const PACKAGE_NAME = 'taplio-linkedin-plugin'
const SKILLS_DIR = fileURLToPath(new URL('../skills/', import.meta.url))
const INVOCATION = { modelInvocable: true, userInvocable: true }

const GUIDANCE = 'Tools named `mcp__taplio__*` come from the Taplio plugin, which manages the user\'s own LinkedIn presence through their Taplio account. In user-facing replies, call it the Taplio plugin, not MCP.'
  + ' When a Taplio skill says to call a tool such as `get_me`, use the matching `mcp__taplio__` tool, for example `mcp__taplio__get_me`.'
  + ' If no `mcp__taplio__*` tool appears in your tool list, Taplio is not connected yet; ask the user to connect it on the Taplio plugin page in Plugins. This replaces any connector setup steps written for other apps in the skills.'

/**
 * Split a SKILL.md file into its frontmatter fields and body.
 * Only the flat `key: value` lines the skills use are read.
 * @param {string} text - whole file.
 * @returns {{ fields: Record<string, string>, body: string }}
 */
export function parseSkill(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!match) return { fields: {}, body: text }
  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    let value = kv[2].trim()
    if (value.startsWith('"') && value.endsWith('"')) value = JSON.parse(value)
    else if (value.startsWith('\'') && value.endsWith('\'')) value = value.slice(1, -1).replace(/''/g, '\'')
    fields[kv[1]] = value
  }
  return { fields, body: text.slice(match[0].length) }
}

/**
 * List the bundled skills as registry candidates.
 * @returns {Promise<object[]>}
 */
export async function listSkills() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true })
  const candidates = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const dir = join(SKILLS_DIR, entry.name)
    const path = join(dir, 'SKILL.md')
    let text
    try {
      text = await readFile(path, 'utf8')
    } catch {
      continue
    }
    const { fields } = parseSkill(text)
    if (fields.name !== entry.name || !fields.description) continue
    candidates.push({
      path,
      name: fields.name,
      description: fields.description,
      invocation: INVOCATION,
      provider: SERVER_NAME,
      source: 'bundled',
      resourceBase: { kind: 'directory', path: dir },
      rank: BUNDLED_SKILL_RANK,
      locator: path,
    })
  }
  return candidates.sort((a, b) => a.name.localeCompare(b.name))
}

const skillProvider = {
  name: SERVER_NAME,
  list: () => listSkills(),
  async get(candidate) {
    let text
    try {
      text = await readFile(candidate.locator, 'utf8')
    } catch {
      return undefined
    }
    return {
      path: candidate.path,
      name: candidate.name,
      description: candidate.description,
      invocation: candidate.invocation,
      provider: candidate.provider,
      source: candidate.source,
      resourceBase: candidate.resourceBase,
      content: parseSkill(text).body,
    }
  },
}

/**
 * Register the Taplio server, its naming guidance, the skills and, while the account
 * registry runs, the Plugins page account. All are withdrawn when the plugin unloads.
 * @param {import('@deepseek-ai/cordis').Context} ctx - context carrying the MCP manager, system prompt and skill registry.
 */
export function apply(ctx) {
  ctx.mcpManager.register(SERVER_NAME, {
    transport: 'streamable-http',
    url: SERVER_URL,
    oauth: { credentialKey: CREDENTIAL_KEY },
    toolLoading: 'on-demand',
  })
  ctx.systemPrompt.section({
    name: SERVER_NAME,
    order: ctx.systemPrompt.getSectionOrder('MCP_SERVERS'),
    text: GUIDANCE,
  })
  ctx.skills.registerProvider(() => skillProvider)
  ctx.inject(['mcpAccounts'], (scope) => {
    scope.effect(() => scope.mcpAccounts.register({ server: SERVER_NAME, packageName: PACKAGE_NAME, copy: COPY }), 'taplio: Plugins page account')
  })
}
