import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ALUMNI_FILE = fileURLToPath(new URL('./src/data/alumni.js', import.meta.url))
const VIRTUAL = 'virtual:alumni'
const RESOLVED = '\0' + VIRTUAL

// Serves `virtual:alumni`: the alumni data with unpublished people removed before it reaches the
// browser bundle. With PREVIEW_UNCONFIRMED false only `confirmed: true` entries are emitted, and a
// full `name` is dropped whenever a `displayName` is set.
function alumniData() {
  return {
    name: 'alumni-data',
    resolveId: (id) => (id === VIRTUAL ? RESOLVED : null),
    async load(id) {
      if (id !== RESOLVED) return null
      this.addWatchFile(ALUMNI_FILE)
      const mod = await import(`${pathToFileURL(ALUMNI_FILE).href}?t=${Date.now()}`)
      const preview = mod.PREVIEW_UNCONFIRMED === true
      const alumni = mod.ALUMNI
        .filter((a) => preview || a.confirmed === true)
        .map(({ name, ...a }) => (a.displayName ? a : { ...a, name }))
      return [
        `export const PREVIEW_UNCONFIRMED = ${JSON.stringify(preview)}`,
        `export const COLLEGES = ${JSON.stringify(mod.COLLEGES)}`,
        `export const ALUMNI = ${JSON.stringify(alumni)}`,
      ].join('\n')
    },
    handleHotUpdate({ file, server }) {
      if (file !== ALUMNI_FILE) return
      const m = server.moduleGraph.getModuleById(RESOLVED)
      if (m) server.moduleGraph.invalidateModule(m)
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}

export default defineConfig({ plugins: [react(), alumniData()] })
