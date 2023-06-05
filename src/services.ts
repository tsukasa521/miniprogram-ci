import { DATABASE } from "./database"
import { nextSemanticVersion, validateSemanticVersion } from "./util"
import { uploadMiniprogram } from "./miniprogramCi"
import { CONFIGURATION } from "./configuration"
import { CreateProjectOptions, PublishMiniprogramOptions, UpdateProjectOptions, listProjectOptions } from "./types"
import { Logger } from "./logger"

/**
 * 发布小程序
 * @param options 
 */
export async function publishMiniprogram(projectName: string, options: PublishMiniprogramOptions) {

  const version: string = options.publishVersion || (await nextSemanticVersion(projectName, options.policy))
  const desc: string = options.desc || version
  const robot: number = options.robot || 1

  Logger.info(`准备开始上传小程序，版本号: ${version}`)
  // Logger.debug('上传参数:', configuration[projectName])


  const project = await getProjectByName(projectName)

  await uploadMiniprogram(project, version, desc, robot)

  await updateProject(projectName, { projectVersion: version })
}

export async function getProjectByName(projectName: string) {
  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  if (!db[projectName]) {
    // todo 
  }

  return db[projectName]
}

/**
 * 列表显示所有小程序项目
 * @param options 
 */
export async function getProjectList(options: listProjectOptions) {
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

export async function createProject(projectName: string, options: CreateProjectOptions) {
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
export async function updateProject(projectName: string, options: UpdateProjectOptions) {
  // todo 验证项目是否存在

  validateSemanticVersion(options.projectVersion || '', '版本号不符合Semantic规则')

  const db = await DATABASE.T_MINIPROGRAM_PROJECT.list()

  const originalVersion = db[projectName].version
  db[projectName].version = options.projectVersion || ''

  DATABASE.T_MINIPROGRAM_PROJECT.update(db)

  Logger.info(`${projectName} 更新成功, 从${originalVersion} -> ${options.projectVersion}`)
}