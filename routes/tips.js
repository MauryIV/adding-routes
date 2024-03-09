const tips = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the tips
tips.get('/', (req, res) => {
  readFromFile('./db/tips.json').then((data) => res.json(JSON.parse(data)));
});

// get route for tip by id
tips.get('/:idNum', (req, res) => {
  const tipId = req.params.idNum;
  readFromFile('./db/tips.json').then((data) => {
    const parsedTips = JSON.parse(data);
    const parsedTipId = parsedTips.find((tip) => tip.tip_id === tipId);
    if (parsedTipId) {
      res.json(parsedTipId);
    } else {
      res.sendFile(path.join(__dirname, '/public/pages/404.html'));
    }
  });
});

// delete route for tip by id
tips.delete('/:idNum', (req, res) => {
  const tipId = req.params.idNum;
  readFromFile('./db/tips.json').then((data) => {
    const parsedTips = JSON.parse(data);
    const updatedTips = parsedTips.filter((tip) => tip.tipId !== tipId);
    writeToFile('./db/tips.json', JSON.stringify(updatedTips, null, 4));
    res.json(`Tip ${tipId} has been deleted!`);
  });
});

// POST Route for a new UX/UI tip
tips.post('/', (req, res) => {
  console.log(req.body);

  const { username, topic, tip } = req.body;

  if (req.body) {
    const newTip = {
      username,
      tip,
      topic,
      tip_id: uuidv4(),
    };

    readAndAppend(newTip, './db/tips.json');
    res.json(`Tip added successfully`);
  } else {
    res.error('Error in adding tip');
  }
});

module.exports = tips;
