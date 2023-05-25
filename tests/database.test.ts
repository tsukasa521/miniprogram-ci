import fs from 'fs'
import path from 'path';
import { rimrafSync } from "rimraf";
import { DATABASE, JsonDatabase, init } from "../src/database";
import { isEmptyObject } from '../src/util';

afterAll(() => {
  rimrafSync(path.resolve(process.cwd(), 'db'))
})

test('[init] standard', async () => {
  const spy = jest.spyOn(console, 'log')

  init()
  // expect(spy).toHaveBeenCalledWith('数据库初始化成功!')
  expect(fs.existsSync(path.resolve(process.cwd(), 'db'))).toBeTruthy()
  expect(fs.existsSync(path.resolve(process.cwd(), 'db', 'db.json'))).toBeTruthy()

  spy.mockRestore();
});

test('[JsonDatabase] empty database', async () => {
  const db = new JsonDatabase(path.resolve(process.cwd(), './tests/db/db1.json'))
  expect(db.connectionString).toEqual(path.resolve(process.cwd(), './tests/db/db1.json'))

  const r = await db.T_MINIPROGRAM_PROJECT.list()
  expect(isEmptyObject(r)).toBeTruthy()
});