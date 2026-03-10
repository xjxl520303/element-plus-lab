import { copyFileSync, existsSync, readdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(rootDir, 'packages', 'element-plus-lab', 'dist')

// IIFE 重命名为 index.full.cjs / index.full.min.cjs（.cjs 满足 publint 对 type:module 包中非 ESM 产物的要求）
if (existsSync(join(dist, 'index.full.iife.js'))) {
  renameSync(join(dist, 'index.full.iife.js'), join(dist, 'index.full.cjs'))
  const map = join(dist, 'index.full.iife.js.map')
  if (existsSync(map))
    renameSync(map, join(dist, 'index.full.cjs.map'))
}
if (existsSync(join(dist, 'index.full.min.iife.js'))) {
  renameSync(join(dist, 'index.full.min.iife.js'), join(dist, 'index.full.min.cjs'))
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

// 复制 ESM 类型声明为 .d.cts，供 exports require.types 使用，消除 publint 警告
const esIndexDts = join(dist, 'es', 'index.d.ts')
const esIndexDcts = join(dist, 'es', 'index.d.cts')
if (existsSync(esIndexDts))
  copyFileSync(esIndexDts, esIndexDcts)
