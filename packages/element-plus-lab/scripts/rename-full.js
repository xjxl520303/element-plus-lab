import { existsSync, readdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

// IIFE 重命名为 index.full.js / index.full.min.js
if (existsSync(join(dist, 'index.full.iife.js'))) {
  renameSync(join(dist, 'index.full.iife.js'), join(dist, 'index.full.js'))
  const map = join(dist, 'index.full.iife.js.map')
  if (existsSync(map))
    renameSync(map, join(dist, 'index.full.js.map'))
}
if (existsSync(join(dist, 'index.full.min.iife.js'))) {
  renameSync(join(dist, 'index.full.min.iife.js'), join(dist, 'index.full.min.js'))
}

// ESM 类型声明 .d.mts → .d.ts，便于 types 字段解析
function renameDmts(dir) {
  if (!existsSync(dir))
    return
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name)
    if (name.isDirectory()) {
      renameDmts(full)
    }
    else if (name.name.endsWith('.d.mts')) {
      renameSync(full, full.replace(/\.d\.mts$/, '.d.ts'))
    }
  }
}
renameDmts(join(dist, 'es'))
