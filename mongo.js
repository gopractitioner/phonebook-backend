const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('input password, name and number as argument')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
    `mongodb+srv://chopsticksmemset:${password}@cluster0.dfttyvx.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name: newName,
    number: newNumber,
})

person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})

