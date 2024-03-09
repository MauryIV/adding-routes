const diagnostics = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

// GET Route for retrieving diagnostic information
diagnostics.get('/', (req, res) => {
  readFromFile('./db/diagnostics.json').then((data) => res.json(JSON.parse(data)))
});

// POST Route for a error logging
diagnostics.post('/', (req, res) => {
  const { isValid, errors } = req.body;
  const newError = {
    time: Date.now(),
    error_id: uuidv4(),
    errors,
  }
  if (isValid) {
    res.json({message: 'Seems fine, here is the id to check up on it.', error_id: newError.error_id})
  } else {
    readAndAppend(newError, './db/diagnostics.json')
    const response = {
      status: 'Thank you for letting us know!',
      body: newError
    }
    res.json(response)
  }
});

module.exports = diagnostics;
