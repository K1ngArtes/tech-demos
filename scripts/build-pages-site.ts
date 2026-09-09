/**
 * Build every apps/<slug> with a package.json "build" script into a combined
 * Cloudflare Pages site: dist/index.html + dist/<slug>/ + dist/_redirects.
 */
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises"
import { join } from "node:path"

const root = join(import.meta.dir, "..")
const appsDir = join(root, "apps")
const outDir = join(root, "dist")

type AppEntry = { slug: string; title: string }

function run(cmd: string[], cwd: string, label: string) {
  const result = Bun.spawnSync(cmd, {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  })
  if (result.exitCode !== 0) {
    throw new Error(`${label} failed (exit ${result.exitCode})`)
  }
}

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const apps: AppEntry[] = []
const names = (await readdir(appsDir)).sort()

for (const slug of names) {
  const appDir = join(appsDir, slug)
  const pkgPath = join(appDir, "package.json")
  const pkgFile = Bun.file(pkgPath)
  if (!(await pkgFile.exists())) continue

  const pkg = (await pkgFile.json()) as { name?: string; scripts?: { build?: string } }
  if (!pkg.scripts?.build) continue

  console.log(`\n→ ${slug}: bun install && bun run build`)
  run(["bun", "install"], appDir, `bun install (${slug})`)
  run(["bun", "run", "build"], appDir, `bun run build (${slug})`)

  const appDist = join(appDir, "dist")
  const built = await stat(join(appDist, "index.html")).catch(() => null)
  if (!built) {
    throw new Error(`${slug} did not produce dist/index.html`)
  }

  const dest = join(outDir, slug)
  await mkdir(dest, { recursive: true })
  await cp(appDist, dest, { recursive: true })
  apps.push({ slug, title: pkg.name ?? slug })
}

if (apps.length === 0) {
  throw new Error("No apps/<slug> with package.json + a build script were found.")
}

const list = apps
  .map(
    (app) =>
      `    <li><a href="/${app.slug}/">${app.slug}</a></li>`,
  )
  .join("\n")

const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>tech-demos</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font: 16px/1.5 ui-sans-serif, system-ui, sans-serif; background: #f0efeb; color: #1c1c1a; }
    main { max-width: 40rem; margin: 0 auto; padding: 3rem 1.5rem; }
    h1 { font-size: 1.5rem; letter-spacing: -0.02em; margin: 0 0 0.4rem; }
    p { color: #6a6963; margin: 0 0 1.5rem; }
    ul { padding: 0; margin: 0; list-style: none; }
    li { border-top: 1px solid #deddd6; }
    a { display: block; padding: 0.85rem 0; color: #1c1c1a; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <main>
    <h1>tech-demos</h1>
    <p>Self-contained weekday demos. Each app is also runnable locally with <code>bun install &amp;&amp; bun run dev</code> from <code>apps/&lt;slug&gt;/</code>.</p>
    <ul>
${list}
    </ul>
  </main>
</body>
</html>
`

await Bun.write(join(outDir, "index.html"), index)

const functionsApi = join(root, "functions", "api")
const functionsOk = await stat(functionsApi).catch(() => null)
if (!functionsOk) {
  throw new Error(
    "Missing repo-root functions/api — wrangler pages deploy looks for ./functions beside dist, not inside it.",
  )
}

// Functions only for /api/* so SPA 200 rewrites still apply to /<slug>/*.
await Bun.write(
  join(outDir, "_routes.json"),
  `${JSON.stringify(
    {
      version: 1,
      include: ["/api/*"],
      exclude: [],
    },
    null,
    2,
  )}\n`,
)

const redirects = [
  "# /api/* is Cloudflare Pages Functions (functions/api). Do not add a site-wide /* 200 rewrite.",
  ...apps.map((app) => `/${app.slug}/*    /${app.slug}/index.html    200`),
  "",
].join("\n")
await Bun.write(join(outDir, "_redirects"), redirects)

console.log(`\nCombined site → ${outDir}`)
for (const app of apps) console.log(`  /${app.slug}/`)
console.log(`Pages Functions → ${functionsApi}`)
