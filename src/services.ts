import { DATABASE } from "./database"
import { nextSemanticVersion, validateSemanticVersion } from "./util"
import { uploadMiniprogram } from "./miniprogramCi"
import { CONFIGURATION } from "./configuration"
import { CreateUpdateProjectOptions, PublishMiniprogramOptions, UpdateVersionOptions, listConfigOptions } from "./types"
import { Logger } from "./logger"

/**
 * 发布小程序
 * @param options 
 */
export async function publishMiniprogram(
  options: PublishMiniprogramOptions
) {
  const {
    projectName,
    config,
    publishVersion,
    desc,
    robot,
    policy
  } = options

  const version: string = publishVersion || (await nextSemanticVersion(projectName, policy))

  const configuration = await CONFIGURATION.load(config)

  Logger.info(`准备开始上传小程序，版本号: ${version}`)
  Logger.debug('上传参数:', configuration[projectName])

  await uploadMiniprogram(configuration[projectName], version, desc, robot)

  // await updateVersion({ projectName, version })
}

/**
 * 列表显示所有小程序项目
 * @param options 
 */
export async function getProjectList(options: listConfigOptions) {
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()
  if (options.raw) {
    Logger.info(db);
  } else {
    const displayDb = Object.entries(db).map(([k, v]) => {
      return {
        '项目名': k,
        '版本号': v.version || '--',
        'appid': v.appid || '--',
        'type': v.type || '--',
        'projectPath': v.projectPath || '--',
        'privateKey': v.privateKey || '--',
        'privateKeyPath': v.privateKeyPath || '--',
        'ignores': v.ignores || '--'
      }
    })
    console.table(displayDb)
  }
}

export async function createProject(projectName: string, options: CreateUpdateProjectOptions) {
  // todo 验证重复

  // todo 验证必填项

  validateSemanticVersion(options.projectVersion, '版本号不符合Semantic规则')

  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  db[projectName] = {
    appid: options.appid,
    projectPath: options.projectPath,
    type: options.type,
    version: options.projectVersion,
    ignores: options.ignores,
    privateKey: options.privateKey,
    privateKeyPath: options.privateKeyPath
  }

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)

  Logger.info(`${projectName} 新建成功, ${options.projectVersion}`);
}

/**
 * 
 * @param options 
 */
export async function updateProject(projectName: string, options: CreateUpdateProjectOptions) {
  // todo 验证项目是否存在

  validateSemanticVersion(options.projectVersion, '版本号不符合Semantic规则')
  
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()
  
  const originalVersion = db[projectName].version
  db[projectName].version = options.projectVersion

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)

  Logger.info(`${projectName} 更新成功, 从${originalVersion} -> ${options.projectVersion}`)
}