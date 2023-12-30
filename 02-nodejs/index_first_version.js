/*
 0 obter usuario
 1 obter numero de telefone atraves do id
 2 obter o endereco do ususario pelo id
*/

function obterUsuario(callback) {
    setTimeout(function() {
        return callback(null, {
            id: 1,
            nome: 'Vinicius',
            dataNascimento: new Date()
        })
    }, 1000)
}

function obterTelefone(idUsuario, callback) {
    setTimeout(() => {
        return callback(null,{
            telefone: '983011555',
            ddd: 61
        })
    }, 2000)
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null,{
            rua: 'Rua dos Geranios',
            numero: 98
        })
    }, 2000)
}

obterUsuario(function resolverUsuario(error, usuario){
    // null || ""|| 0 == false
    if(error) {
        console.error('DEU RUIM em USUARIO', error)
        return;
    }
    obterTelefone(usuario.id, function resolverTelefone(error1, telefone){
        if(error1) {
            console.error('DEU RUIM em TELEFONE', error1)
            return;
        }
        obterEndereco(usuario.id, function resolverEndereco(error2, endereco){
            if(error2) {
                console.error('DEU RUIM em ENDERECO', error2)
                return;
            }
            console.log(`
                usuario: ${usuario.nome},
                Endereco: ${endereco.rua},${endereco.numero}
                Telefone: (${telefone.ddd}) ${telefone.numero}
            `)
        })
    })
})