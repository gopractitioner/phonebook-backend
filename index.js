require('dotenv').config()

const express = require('express');
const app = express();
const cors = require('cors');


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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
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
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})