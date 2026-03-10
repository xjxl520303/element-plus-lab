import { existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(rootDir, 'packages', 'element-plus-lab', 'dist')
if (existsSync(dist))
  rmSync(dist, { recursive: true })
