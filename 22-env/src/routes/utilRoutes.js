const BaseRoute = require('./base/baseRoute')
const { join } = require('path')


class UtilRoute extends BaseRoute{
    constructor() {
        super()
    }

    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            options: {
                auth: false,
            },
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}

module.exports = UtilRoute