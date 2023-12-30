// npm install hapi
const Hapi = require('hapi')
const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchemas')
const HeroRoute = require('./routes/heroesRoutes')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}


async function main() {
    const connection = MongoDB.connect()
    const context = new ContextStrategy(new MongoDB(connection, HeroesSchema))
    
    
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ])
    // await context.isConnected()
    await app.start()
    console.log('App rodando na porta ', app.info.port)
    return app
}

module.exports = main()    