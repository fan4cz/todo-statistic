const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {

    if (command.startsWith('user ')) {
        username = command.slice(5).trim();
        command = 'user';
    }

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getAllTODO());
            break;
        case 'important':
            console.log(getAllTODO(true));
            break;
        case 'user':            
            const todos = getAllTODO();
            for (let i = 0; i < todos.length; i++) {
                if (extractAuthorFromTodo(todos[i]).toLowerCase() === username.toLowerCase()) {
                    console.log(todos[i]);
                }  
            }
            break;
        case 'sort':
            break
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTODO(isImportant) {
    const regex = /^\s*\/\/ TODO([^\n]*)/gm;

    let result = []
    for (const file of files) {
        const matches = [...file.matchAll(regex)];
        for (const match of matches) {
            result.push(match[0].trim());
        }
    }

    if (isImportant) {
        result = result.filter(todo => todo.includes("!"));
    }
    return result;
}

function extractAuthorFromTodo(todoText) {
    const regex = /\/\/\s*TODO\s*([^;]+);\s*([^;]+);\s*(.*)/;
    const match = todoText.match(regex);
    return match ? match[1].trim() : null;
}