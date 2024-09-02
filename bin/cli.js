#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pmIndicatorPath = path.resolve(__dirname, '..', '.pm-indicator')
let packageManager = 'unknown'

if (fs.existsSync(pmIndicatorPath)) {
  packageManager = fs.readFileSync(pmIndicatorPath, 'utf8').trim()
}

console.log(`Running with package manager: ${packageManager}`)

import('./index.mjs')
  .then((module) => {
    // The CLI is already set up and parsed in the index.mjs file
  })
  .catch((error) => {
    console.error('Failed to load the CLI:', error)
    process.exit(1)
  })
