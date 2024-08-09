// services/chatViolationCounter.js
const { ChatViolation } = require('../models/chatRecord');
const { badWordList } = require('./chatService');

const checkAndCountViolations = async (message, userId) => {
  const lowercasedMessage = message.toLowerCase();
  let violationCount = 0;

  // Count the number of sensitive words in the message
  badWordList.forEach(word => {
    if (lowercasedMessage.includes(word)) {
      violationCount++;
    }
  });

  // If violations are found, update the ChatViolation model
  if (violationCount > 0) {
    let chatViolation = await ChatViolation.findOne({ where: { userId } });

    if (!chatViolation) {
      // If no record exists for the user, create one
      chatViolation = await ChatViolation.create({ userId, numberOfViolations: violationCount });
    } else {
      // If a record exists, increment the violation count
      chatViolation.numberOfViolations += violationCount;
      await chatViolation.save();
    }
  }
};

module.exports = {
  checkAndCountViolations,
};
