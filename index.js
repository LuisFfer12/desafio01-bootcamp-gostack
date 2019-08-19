const express = require('express');

const server = express();

server.use(express.json());

let count = 0;

//midlware global
server.use((req, res, next) => {
  console.log(count++);
  return next();
});

const projects = [
  {
    id: '1',
    title: 'Teste',
    tasks: ['new task']
  }
];

//midlleware local
function checkProjectExist(req, res, next) {
  const { id } = req.params;

  const project = projects.filter(pr => {
    return pr.id == id;
  })[0];

  if (!project) {
    return res.status(400).json({ error: 'Projeto nao existe' });
  }

  return next();
}

server.get('/projects', (req, res) => {
  return res.send(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExist, (req, res) => {
  var id = req.params.id;
  var { title } = req.body;

  const project = projects.filter(pr => {
    return pr.id == id;
  })[0];
  const index = projects.indexOf(project);
  projects[index] = {
    id: id,
    title: title,
    tasks: projects[index].tasks
  };
  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params.id;

  let project = projects.filter(pr => {
    return pr.id == id;
  })[0];
  const index = projects.indexOf(project);

  projects.splice(index, 1);
  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.filter(pr => {
    return pr.id == id;
  })[0];
  /*
  const project = projects.find(p => p.id == id);
*/
  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
