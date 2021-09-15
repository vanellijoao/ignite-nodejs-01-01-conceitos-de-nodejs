const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    "id": "c50e4df5-30ff-49e1-b2d1-d7d3c54fa5cc",
    "name": "João Vanelli",
    "username": "vanelli",
    "todos": [
      {
        "id": "8b67b08b-abba-445d-8ee3-6b2612ce809d",
        "title": "Pancreas",
        "done": false,
        "deadline": "2021-09-18T03:00:00.000Z",
        "created_at": "2021-09-15T14:38:04.454Z"
      }
    ]
  }
];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(400).json({ error: 'User not found' });
  }

  request.user = user;

  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists'})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(newUser)

  response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user: { todos }} = request;

  response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user: { todos } } = request;
  const { title, deadline } = request.body;

  // const formattedDeadline = new Date(deadline + " 00:00");

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date
  };

  todos.push(newTodo);

  response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user: { todos } } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = todos.find((todo) => todo.id === id);

  if(!todo) return response.status(404).json({ error: "Not found"});

  const updatedTodo = {
    id,
    title,
    done: todo.done,
    deadline,
    created_at: todo.created_at,
  }

  todos.splice(todo, 1, updatedTodo);

  response.status(200).json(updatedTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;