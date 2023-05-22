import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import packageJson from './package.json'

console.debug('Rollup building in', process.env.NODE_ENV)

const env = process.env.NODE_ENV || 'production'
const isDev = env === 'development'

/**
 * 将package json中的依赖项默认作为第三方依赖处理
 * @param {*} packageJson package json内容
 * @param {Array} external 额外还有需要作为第三方依赖的名称
 * @returns 
 */
export function convertDependencies2ArrayFromPackageJson(
  packageJson,
  external = []
) {
  if (!packageJson.dependencies) return []

  const dependencies = Object.keys(packageJson.dependencies).reduce(
    (prev, cur) => {
      prev.push(cur)
      return prev
    },
    []
  )

  const peerDependencies = Object.keys(
    packageJson.peerDependencies || {}
  ).reduce((prev, cur) => {
    prev.push(cur)
    return prev
  }, [])

  const r = dependencies.concat(peerDependencies).concat(external)
  return r
}

export default {
  input: {
    index: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: isDev,
    manualChunks(id) {
      if (id.includes('node_modules')) {
        return 'vendor'
      }
    },
  },
  plugins: [
    typescript({ tsconfig: 'tsconfig.json', sourcemap: isDev }),
    json(),
  ],
  external: convertDependencies2ArrayFromPackageJson(packageJson, [
    'path',
    'process',
    'url',
    'fs',
  ]),
}
