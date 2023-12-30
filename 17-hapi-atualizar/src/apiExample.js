// npm install hapi
const Hapi = require('hapi')
const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchemas')


const app = new Hapi.Server({
    port: 5000
})

async function main() {
    const connection = MongoDB.connect()
    const context = new ContextStrategy(new MongoDB(connection, HeroesSchema))
    app.route([
        {
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                return context.read({})
            }
        }
    ])
    // await context.isConnected()
    await app.start()
    console.log('App rodando na porta ', app.info.port)
}

main()    