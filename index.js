import initSettingsRoutes from './api/comm_settings'

export default (ctx) => {
  const app = ctx.express()

  app.use('/settings', initSettingsRoutes(ctx))

  return app
}
