// services/chatService.js


// NOTE: combine chatService & Violations
// NOTE: cleanup  controller anything to be moved here
// NOTE: design functions for message timer penalty, message length limit.
// NOTE: sanitization, includes SQL injection risk, script risk.
// NOTE: when message goes too long, how does the infinite scroll functions? batch-API call or ? (frontend)

const badWordList = [  'damn', 'hell', 'shit', 'fuck', 'bitch', 'bastard', 'asshole', 'dick', 'pussy', 'cunt', 
    'porn', 'sex', 'nude', 'whore', 'slut', 'erection', 'blowjob', 'clit',
    'faggot', 'nigger', 'chink', 'spic', 'kike', 'bitch', 'retard',
    'kill', 'murder', 'shoot', 'stab', 'rape',
    'weed', 'cocaine', 'heroin', 'meth', 'crack', 'joint', 'bong'];

const sanitizeMessage = (message) => {
  // Create a regex pattern to match any bad word from the list
  const regexPattern = new RegExp(badWordList.join("|"), "gi");
  
  // Replace each bad word with asterisks or any other blur-out pattern
  const sanitizedMessage = message.replace(regexPattern, (match) => {
    return "*".repeat(match.length); // Replace the word with asterisks
  });
  
  return sanitizedMessage;
};

module.exports = { badWordList, sanitizeMessage};
