// show dbs
// use heroes
// show colletions
// create
db.heroes.insert({nome: 'Flash', poder: 'Velocidade'})


//read
db.heroes.find()
db.heroes.find().pretty()
db.heroes.findOne()
db.heroes.find().limit(1000).sort({nome: -1})
db.heroes.find({}, {poder:1, _id:0})

// update
db.heroes.updateMany({_id: ObjectId('658de8fca026587942f3e8f0')}, {$set:{nome:'Mulher Maravilha'}})
db.heroes.updateMany({_id: ObjectId('658de8fca026587942f3e8f0')}, {$set:{poder:'Força'}})

// delete
db.heroes.deleteOne({ _id: ObjectId('658de900a026587942f3e8f1') })
db.heroes.deleteMany({ _id: ObjectId('658de900a026587942f3e8f1') })
db.heroes.deleteMany({})