import { TNAMES } from '../consts'
import _ from 'underscore'

export default (ctx) => {
  const app = ctx.express()
  const { auth, JSONBodyParser, knex } = ctx

  app.get('/', auth.required, (req, res, next) => {
    knex(TNAMES.COMM_PREFS).where({ uid: req.user }).then(found => {
      res.json(found.length ? found[0] : {})
      next()
    }).catch(next)
  })

  app.post('/', auth.required, JSONBodyParser, (req, res, next) => {
    Object.assign(req.body, { uid: req.user })
    knex(TNAMES.COMM_PREFS).insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put('/:id([0-9a-zA-Z_-]+)', auth.required, JSONBodyParser, (req, res, next) => {
    const change = _.omit(req.body, ['uid', 'created'])
    knex(TNAMES.COMM_PREFS).where({ uid: req.params.id }).update(change)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })

  return app
}
