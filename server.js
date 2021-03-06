// import your node modules
const express = require('express');
const server = express();
server.use(express.json());
const cors = require('cors');
server.use(cors());

const db = require('./data/db.js');

server.post('/api/posts', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400)
      .json({ errorMessage: "Please provide title and contents for the post." });
    return;  
  }
  db.insert(req.body)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(() => {
      res.status(500)
        .json({ error: "There was an error while saving the post to the database" });
    });
});

server.get('/api/posts', (req, res) => {
  db.find()
    .then(response => res.status(200).json(response))
    .catch(() => res.status(500)
      .json({ error: "The posts information could not be retrieved." })
    );
});

server.get('/api/posts/:id', (req, res) => {
  db.findById(req.params.id)
    .then(response => {
      if (response.length === 0) {
        res.status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(response);
      }
    })
    .catch(err => {
      res.status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

server.delete('/api/posts/:id', (req, res) => {
  db.remove(req.params.id)
    .then(response => {
      if (response === 0) {
        res.status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(response => {
      res.status(500)
        .json({ error: "The user could not be removed" });
    });
});

server.put('/api/posts/:id', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400)
      .json({ errorMessage: "Please provide title and contents for the post." });
    return;  
  }
  db.update(req.params.id, req.body)
    .then(response => {
      if (response === 0) {
        res.status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200);
      }
    })
    .catch(() => {
      res.status(500)
        .json({ error: "The post information could not be modified." })
    });
})

server.listen(8000, () => console.log('API running on port 8000'));
