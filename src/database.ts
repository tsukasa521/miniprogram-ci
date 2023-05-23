import jsonfile from 'jsonfile'
import fs from 'fs'
import path from 'path'
import { T_Miniprogram_Project } from './types'
import { Logger } from './logger';

interface ITable<T> {
  list: () => Promise<T>,
  update: (content: object) => void
}

export interface IDatabase {
  connectionString: string
  
  T_MINIPROGRAM_PROJECT: ITable<T_Miniprogram_Project>
}

/**
 * 用Json文件持久化
 */
export class JsonDatabase implements IDatabase {
  connectionString: string

  constructor(connectionString: string) {
    this.connectionString = connectionString
  }

  T_MINIPROGRAM_PROJECT = {
    list: async (): Promise<T_Miniprogram_Project> => {
      return await jsonfile.readFile(this.connectionString)
    },
    update: async (content: object) => {
      return await jsonfile.writeFile(this.connectionString, content)
    }
  }
}

export let DATABASE: IDatabase

function init() {
  Logger.debug(__dirname)
  const dbDir = path.resolve(__dirname, './db')
  const dbFile = path.resolve(__dirname, './db/db.json')
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir)
  }

  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, '{}')
    Logger.info('数据库初始化成功!')
  }

  DATABASE = new JsonDatabase(dbFile)
}

init()
