import fs from 'fs'
import path from 'path';
import { rimrafSync } from "rimraf";
import { JsonDatabase, init } from "../src/database";
import { isEmptyObject } from '../src/util';

afterAll(async () => {
  rimrafSync(path.resolve(process.cwd(), 'src', 'db'))

  const db1 = new JsonDatabase(path.resolve(process.cwd(), './tests/db/db1.json'))
  await db1.T_MINIPROGRAM_PROJECT.update({})

  const db2 = new JsonDatabase(path.resolve(process.cwd(), './tests/db/db2.json'))
  db2.T_MINIPROGRAM_PROJECT.update({ "p1": { "version": "0.0.1" } })
})

test('[init] standard', async () => {
  const spy = jest.spyOn(console, 'info')

  init()
  expect(spy).toHaveBeenCalledWith('数据库初始化成功!')
  expect(fs.existsSync(path.resolve(process.cwd(), 'src', 'db'))).toBeTruthy()
  expect(fs.existsSync(path.resolve(process.cwd(), 'src', 'db', 'db.json'))).toBeTruthy()

  spy.mockRestore();
});

test('[JsonDatabase] empty database', async () => {
  const db = new JsonDatabase(path.resolve(process.cwd(), './tests/db/db1.json'))
  expect(db.connectionString).toEqual(path.resolve(process.cwd(), './tests/db/db1.json'))

  const r = await db.T_MINIPROGRAM_PROJECT.list()
  expect(isEmptyObject(r)).toBeTruthy()
});

test('[JsonDatabase] create data', async () => {
  const db = new JsonDatabase(path.resolve(process.cwd(), './tests/db/db1.json'))
  expect(db.connectionString).toEqual(path.resolve(process.cwd(), './tests/db/db1.json'))

  await db.T_MINIPROGRAM_PROJECT.update({ p1: { version: '0.0.1' } })

  const actualValue = await db.T_MINIPROGRAM_PROJECT.list()
  expect(actualValue).toEqual({ p1: { version: '0.0.1' } })
});

test('[JsonDatabase] update data', async () => {
  const db = new JsonDatabase(path.resolve(process.cwd(), './tests/db/db2.json'))
  expect(db.connectionString).toEqual(path.resolve(process.cwd(), './tests/db/db2.json'))

  const expectValue = { p1: { version: '0.0.1' }, p2: { version: '0.0.1' } }

  await db.T_MINIPROGRAM_PROJECT.update(expectValue)

  const actualValue = await db.T_MINIPROGRAM_PROJECT.list()
  expect(actualValue).toEqual(expectValue)
});