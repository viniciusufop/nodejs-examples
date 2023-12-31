const ICrud = require('../interfaces/interfaceCrud')

class ContextStrategy extends ICrud{
    constructor(strategy) {
        super()
        this._database = strategy
    }

    create(item) {
        return this._database.create(item)
    }

    read(query, skip=0,limit=10) {
        return this._database.read(query, skip, limit)
    }

    update(id, item, upsert=false) {
        return this._database.update(id, item, upsert)
    }

    delete(id) {
        return this._database.delete(id)
    }

    isConnected() {
        return this._database.isConnected()
    }
}

module.exports = ContextStrategy