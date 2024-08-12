// services/sanitizeService.js
const { ChatViolation } = require('../models/chatRecord');
const { ChatMessage, ChatParticipant, Chat } = require('../models/chatModel');
const { badWordList } = require('../utils/chatHelper');

const sanitizeInput = (input) => {
    return input
        .replace(/'/g, "&#39;")  // Replace single quotes
        .replace(/"/g, "&#34;")  // Replace double quotes
        .replace(/</g, "&lt;")   // Replace '<' 
        .replace(/>/g, "&gt;");  // Replace '>'
};

// Function to sanitize messages for frontend display
const sanitizeForDisplay = (message) => {
    const sanitizedMessage = message
        .replace(/</g, "&lt;")   // Replace '<' 
        .replace(/>/g, "&gt;");  // Replace '>'

    const regexPattern = new RegExp(badWordList.join("|"), "gi");
    return sanitizedMessage.replace(regexPattern, match => "*".repeat(match.length));
};
const checkAndCountViolations = async (message, userId) => {
    const lowercasedMessage = message.toLowerCase();
    let violationCount = 0;

    badWordList.forEach(word => {
        if (lowercasedMessage.includes(word)) {
            violationCount++;
        }
    });

    if (violationCount > 0) {
        let chatViolation = await ChatViolation.findOne({ where: { userId } });

        if (!chatViolation) {
            chatViolation = await ChatViolation.create({ userId, numberOfViolations: violationCount });
        } else {
            chatViolation.numberOfViolations += violationCount;
            await chatViolation.save();
        }
    }
};

const enforceMessageTimer = async (userId, cooldownTime) => {
    const lastMessage = await ChatMessage.findOne({
        where: { senderId: userId },
        order: [['time', 'DESC']]
    });

    if (lastMessage) {
        const now = new Date();
        const lastMessageTime = new Date(lastMessage.time);
        const timeDiff = now - lastMessageTime;

        if (timeDiff < cooldownTime) {
            throw new Error('You are sending messages too quickly. Please wait a moment.');
        }
    }
};

const enforceMessageLength = (message, maxLength) => {
    if (message.length > maxLength) {
        throw new Error(`Message exceeds the maximum length of ${maxLength} characters.`);
    }
};

const updateLastMessage = async (chatId, messageId) => {
    const chat = await Chat.findByPk(chatId);
    if (chat) {
        chat.lastMessageId = messageId;
        await chat.save();
    }
};

const fetchMessagesInBatches = async (chatId, limit, offset) => {
    return await ChatMessage.findAll({
        where: { chatId },
        limit,
        offset,
        order: [['createdAt', 'ASC']]
    });
};

module.exports = {
    sanitizeInput,
    sanitizeForDisplay,
    checkAndCountViolations,
    enforceMessageTimer,
    enforceMessageLength,
    updateLastMessage,
    fetchMessagesInBatches
};
