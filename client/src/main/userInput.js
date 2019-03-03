// Accept a string to show as the question
// Invoke the function passed with the trimmed string value entered by the user
const askQuestion = (questionToAsk, functionToInvokeOnAnswer) => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question(`${questionToAsk}\n`, (inputedAnswer) => {
        functionToInvokeOnAnswer(inputedAnswer.trim());
        readline.close()
    });
};

exports.userInput = {
    askQuestion
};