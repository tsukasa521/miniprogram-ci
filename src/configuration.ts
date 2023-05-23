import { resolve } from 'path'
import fs from 'fs'
import { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project'
import { ConfigurationOptions } from './types'

export let CONFIGURATION: IConfiguration

interface IConfiguration {
  load: (configPath: string) => Promise<ConfigurationOptions>
}

/**
 * 从Json读取用户的配置文件
 */
class JsonConfiguration implements IConfiguration {
  /**
   * 读取配置文件
   * @param configPath 配置文件路径 
   * @returns 
   */
  load = async (configPath: string) => {
    if (!configPath) {
      throw new Error('找不到配置文件')
    }

    const path = resolve(process.cwd(), configPath)

    if (!fs.existsSync(path)) {
      throw new Error(`找不到配置文件：${path}`)
    }

    const importConfigFile = (await import(path)).default

    const initialValue: ConfigurationOptions = {}
    const o = Object.entries(importConfigFile).reduce((prev, [k, v]: [string, any]) => {
      const appid = v['appid']
      const type = v['type']
      const projectPath = v['projectPath']
      const privateKeyPath = v['privateKeyPath']

      if (!appid || !projectPath || !privateKeyPath) {
        throw new Error('配置文件缺少必要配置')
      }

      const options: ICreateProjectOptions = { appid, type: type || 'miniProgram', projectPath, privateKeyPath, ignores: ['node_modules/**/*'] }
      prev[k] = options

      return prev
    }, initialValue)

    return o
  }
}

function init() {
  CONFIGURATION = new JsonConfiguration()
}

init()





