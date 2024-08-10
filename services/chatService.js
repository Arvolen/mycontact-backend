// services/sanitizeService.js

const badWordList = [  'damn', 'hell', 'shit', 'fuck', 'bitch', 'bastard', 'asshole', 'dick', 'pussy', 'cunt', 
    'porn', 'sex', 'nude', 'whore', 'slut', 'erection', 'blowjob', 'clit',
    'faggot', 'nigger', 'chink', 'spic', 'kike', 'bitch', 'retard',
    'kill', 'murder', 'shoot', 'stab', 'rape',
    'weed', 'cocaine', 'heroin', 'meth', 'crack', 'joint', 'bong']; // Add the words you want to blur out here

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
