require('dotenv').config()

const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-1234569",
        "id": "1"
    },
    {
        "id": "2",
        "name": "gas oil",
        "number": "29-1291393-3"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    },
    {
        "id": "5",
        "name": "yue fei",
        "number": "123-123903"
    },
    {
        "id": "6",
        "name": "zhang juzheng",
        "number": "1368-1644"
    },
    {
        "id": "8",
        "name": "jeussss owe",
        "number": "194-3498"
    },
    {
        "id": "10",
        "name": "san diego",
        "number": "84848-3999"
    },
    {
        "id": "11",
        "name": "london uk",
        "number": "475-934"
    },
    {
        "id": "12",
        "name": "doh oo",
        "number": "333-9999"
    }
]

app.use(express.static('dist'))

app.use(express.json());
app.use(requestLogger)

app.use(cors());

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const date = new Date()
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    })

    // const date = new Date()
    // response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = new Person({
        //id: generateId().toString(), deleted to make Ids generated by mongo
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    // const id = request.params.id
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            if (result) {
                console.log('deleted...')
                response.status(204).end()
            } else {
                console.log('not found...')
                response.status(404).end()
            }
            //response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// notification: error handler middleware must be the last middleware to be loaded, 
//all routers must be loaded before error handler

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        console.log('error name is cast error')
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})