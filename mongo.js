const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}



if (process.argv.length != 5 && process.argv.length != 3) {
    console.log('input password, name and number as argument or only password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://chopsticksmemset:mongodbroot123@cluster0.dfttyvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
    return
}

const newName = process.argv[3]
const newNumber = process.argv[4]


const person = new Person({
    name: newName,
    number: newNumber,
})

person.save().then(result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
})

