const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'teste123'
const HASH = '$2b$04$GsNd4s3/TaclBgngkfWwX.lqhtITsDjNnHieSkPkMsYLrRFrofi/2'
describe('UserHelper test suite', function() {
    it('deve gerer um hash apartir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    }),
    it('deve comparar senha e hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })
})