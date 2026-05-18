import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, renameSync, statSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Self-healing fix for the macOS / iCloud "X 2.tsx" duplicate problem.
 *
 * iCloud Drive syncs the Desktop folder by default. When it detects a
 * conflict or restores from a snapshot, it sometimes re-introduces files
 * with a " 2" suffix and removes the canonical version. The build then
 * breaks because imports reference `AICoreScene`, not `AICoreScene 2`.
 *
 * Implementation choices:
 *  - Only scan ONCE at server boot via configResolved hook. No live
 *    fs.watch — iCloud's constant churn caused the watcher to fire
 *    thousands of events, blocking the event loop and crashing Vite HMR.
 *  - Only scan TWO specific directories where the duplicates live, not
 *    the whole src/ tree (that recursive scan was blocking for seconds).
 *  - If iCloud restores duplicates DURING a dev session, the user just
 *    restarts the dev server and the boot scan fixes it.
 */
function fixIcloudDuplicates(): Plugin {
  const targets = [
    'src/products/scenes',
    'src/products/components',
    'src/components/sections',
    'src/components/ui',
    'src/components/layout',
    'src/components/showroom',
  ];

  return {
    name: 'tapin-fix-icloud-duplicates',
    configResolved(cfg) {
      for (const rel of targets) {
        const dir = join(cfg.root, rel);
        let entries: string[];
        try {
          entries = readdirSync(dir);
        } catch {
          continue;
        }
        for (const name of entries) {
          const m = name.match(/^(.*) 2(\.[tj]sx?)$/);
          if (!m) continue;
          const from = join(dir, name);
          const to = join(dir, `${m[1]}${m[2]}`);
          try {
            statSync(to);
            // canonical already exists — skip
          } catch {
            try {
              renameSync(from, to);
              console.log(`[icloud-fix] "${name}" → "${m[1]}${m[2]}"`);
            } catch {
              // non-fatal
            }
          }
        }
      }
    },
  };
}

// Resolve the canonical pnpm copies of react / react-dom — used both to
// guarantee a SINGLE React copy in the bundle (the npm install of three.js
// dropped duplicate copies that produced "Invalid hook call") and to keep
// working even if iCloud purges the top-level symlinks in node_modules.
const __dirname = fileURLToPath(new URL('.', import.meta.url))
function findPnpmPackage(pkg: string): string | null {
  const pnpmDir = resolve(__dirname, 'node_modules/.pnpm')
  if (!existsSync(pnpmDir)) return null
  let bestDir: string | null = null
  for (const entry of readdirSync(pnpmDir)) {
    // Match folders like "react@19.2.6" or "react-dom@19.2.6_react@19.2.6"
    if (entry === pkg || entry.startsWith(pkg + '@')) {
      const candidate = resolve(pnpmDir, entry, 'node_modules', pkg)
      if (existsSync(candidate)) bestDir = candidate
    }
  }
  return bestDir
}

const REACT_DIR = findPnpmPackage('react')
const REACT_DOM_DIR = findPnpmPackage('react-dom')

// https://vite.dev/config/
export default defineConfig({
  plugins: [fixIcloudDuplicates(), react()],

  // Tell Vite that GLB/GLTF are binary static assets so the dev server
  // serves them correctly (not via SPA fallback).
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],

  resolve: {
    // Force every "import 'react'" anywhere in the bundle to resolve to the
    // SAME copy in node_modules/.pnpm/react@19.2.6/... — this kills the
    // duplicate-React problem ("Invalid hook call / resolveDispatcher null")
    // caused by npm install layering a flat node_modules/react on top of
    // pnpm's symlink-based layout.
    alias: [
      ...(REACT_DIR
        ? [
            { find: /^react$/, replacement: REACT_DIR },
            { find: /^react\//, replacement: REACT_DIR + '/' },
          ]
        : []),
      ...(REACT_DOM_DIR
        ? [
            { find: /^react-dom$/, replacement: REACT_DOM_DIR },
            { find: /^react-dom\//, replacement: REACT_DOM_DIR + '/' },
          ]
        : []),
    ],
    dedupe: ['react', 'react-dom'],
  },

  optimizeDeps: {
    // Force re-bundling of deps that previously got tangled with the rogue
    // React copy
    force: true,
    include: ['react', 'react-dom', 'react-dom/client', '@gsap/react'],
  },

  // Force localhost everywhere (HMR + browser URL agree). This avoids the
  // "(browser) localhost <--[WebSocket failing]--> (server) 127.0.0.1"
  // mismatch that produced thousands of "ws is undefined" errors.
  server: {
    host: 'localhost',
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
})
