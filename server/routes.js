const express = require('express');
const router = express.Router();

// Mock data for demonstration
let generatedOutputs = [
  { id: 1, text: 'Generated output 1', date: new Date().toISOString() },
  { id: 2, text: 'Generated output 2', date: new Date().toISOString() },
];

router.get('/api/getGeneratedOutputsHistory', (req, res) => {
  res.json({ outputs: generatedOutputs });
});

router.post('/api/saveGeneratedOutputs', (req, res) => {
  const { outputs } = req.body;
  generatedOutputs = [...generatedOutputs, ...outputs];
  res.status(201).send();
});

router.delete('/api/deleteOutput/:id', (req, res) => {
  const { id } = req.params;
  generatedOutputs = generatedOutputs.filter(output => output.id !== parseInt(id, 10));
  res.status(200).send();
});

module.exports = router;
