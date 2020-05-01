import express from 'express'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { initAuth, getUid, required } from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'
import InitApp from './index'

async function init (host, port) {
  const knex = await initDB(path.join(__dirname, 'migrations'))
  const app = express()
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'dev'))
  const JSONBodyParser = bodyParser.json()

  process.env.ORIGIN_URL && app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    preflightContinue: false
  }))

  initAuth(app)

  const appContext = {
    express,
    knex,
    auth: { getUid, required },
    JSONBodyParser
  }
  app.use(InitApp(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT
  init(host, port)
} catch (err) {
  console.error(err)
}
