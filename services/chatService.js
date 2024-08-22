
// services/chatService.js


// NOTE: combine chatService & Violations
// NOTE: cleanup  controller anything to be moved here
// NOTE: design functions for message timer penalty, message length limit.
// NOTE: sanitization, includes SQL injection risk, script risk.
// NOTE: when message goes too long, how does the infinite scroll functions? batch-API call or ? (frontend)



// services/sanitizeService.js
const { ChatMessage, ChatParticipant, Chat, ChatViolation} = require('../models/chatModel');
const { badWordList } = require('../utils/chatHelper');

const sanitizeInput = (input) => {
    // Convert input to string to avoid non-string input issues
    input = String(input);


    // Basic HTML entity replacements
    input = input
        .replace(/'/g, "&#39;")  // Replace single quotes
        .replace(/"/g, "&#34;")  // Replace double quotes
        .replace(/</g, "&lt;")   // Replace '<' 
        .replace(/>/g, "&gt;");  // Replace '>'

    // Prevent Directory Traversal by removing suspicious patterns
    input = input
        .replace(/\.\.\//g, '')   // Remove '../'
        .replace(/\.\./g, '');    // Remove remaining '..'

    // Prevent Command Injection by removing special shell characters
    input = input
        .replace(/[\$&|;`\\]/g, '') // Remove shell-specific characters
        .replace(/\r?\n|\r/g, '');  // Remove newlines (to prevent command chaining)
        
    // Prevent potential null byte injections
    input = input.replace(/\0/g, '');  // Remove null bytes
    
    // Strip out any remaining non-alphanumeric characters that are not essential
    // You can adjust this regex based on the specific needs of your application
    input = input.replace(/[^\w\s@.-]/gi, '');

    return input;
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
        where: { userId: userId },
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
