import packageJson from '../package.json'
import { program } from 'commander'
import {
  listConfigAction,
  publishMiniprogramProjectAction,
  updateConfigAction,
} from './actions'

function main() {
  program
    .name('mp-ci')
    .description(packageJson.description)
    .version(packageJson.version)
    .option('--verbose', '开启log')

  program
    .command('upload')
    .description('上传代码')
    .argument('<project name>', '保存在配置中的小程序项目名')
    .argument('<config path>', '配置文件地址')
    .option('--publish-version <publish version>', '发布的版本号')
    .option('--desc <desc>', '发布时的描述, 默认会设置为版本号')
    .option('--robot <robot>', '指定使用哪一个 ci 机器人', '1')
    .option('-p, --policy [odd | even | standard]', '版本提升策略,默认为奇数提升', 'odd')
    .action(publishMiniprogramProjectAction)

  const configCommand = program.command('project').description('新增/修改小程序项目')

  configCommand
    .command('ls')
    .description('显示所有小程序项目')
    .option('--raw', '原始数据格式')
    .action(listConfigAction)

  configCommand
    .command('update')
    .description('新建/修改小程序项目版本号')
    .argument('<project name>', '小程序项目名')
    .argument('<project version>', '项目版本号')
    .action(updateConfigAction)

  program.parse()
}

main()
