/*
 0 obter usuario
 1 obter numero de telefone atraves do id
 2 obter o endereco do ususario pelo id
*/

// importamos um modulo interno do node.js para tratar promise
const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    // quando der algum problema -> reject(ERRO)
    // quando for sucesso a gente chama o resolve
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(function() {
            // return reject(new Error('Deu ruim com usuario'))
            return resolve({
                id: 1,
                nome: 'Vinicius',
                dataNascimento: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolvePromise(resolve, reject){
        setTimeout(() => {
            return resolve({
                telefone: '983011555',
                ddd: 61
            })
        }, 2000)
    })
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'Rua dos Geranios',
            numero: 98
        })
    }, 2000)
}


const usuarioPromisse = obterUsuario()
//para manipular o sucesso usa o .then
//para manipular erros usa o .catch
usuarioPromisse
    .then(function (usuario) {
        return obterTelefone(usuario.id)
                .then(function resolverTelefone(telefone){
                    return {
                        usuario: usuario,
                        telefone: telefone
                    }
                })
    })
    .then(function (resultado) {
        const endereco =  obterEnderecoAsync(resultado.usuario.id)
        return endereco.then(function resolverEndereco(endereco){
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: endereco
            }
        })
    })
    .then(function (resultado) {
            console.log(`
                usuario: ${resultado.usuario.nome},
                Endereco: ${resultado.endereco.rua},${resultado.endereco.numero}
                Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
            `)
    })
    .catch(function (error){
        console.error("Deu ruim", error)
    })
