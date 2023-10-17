const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Agent = require('../models/agent');

router.post('/updateAgent/:id', async (req, res) => {
  try {
    const agentId = req.params.id;

    // Validate the agentId variable
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ message: 'Invalid agentId' });
    }

    const updatedAgent = await Agent.findByIdAndUpdate(
      agentId,
      { confirmFlag: req.body.confirmFlag },
      { new: true }
    );
    res.json(updatedAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating agent' });
  }
});

module.exports = router;