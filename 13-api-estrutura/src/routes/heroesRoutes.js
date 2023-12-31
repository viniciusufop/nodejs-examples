const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute{
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                return this.db.read({})
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            handler: (request, head) => {
                return this.db.read({})
            }
        }
    }
}

module.exports = HeroRoutes