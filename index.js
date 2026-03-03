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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getAllTODO());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTODO() {
    const regex = /^\s*\/\/ TODO([^\n]*)/gm;

    let result = []
    for (const file of files) {
        const matches = [...file.matchAll(regex)];
        for (const match of matches) {
            result.push(match[0].trim());
        }
    }
    return result;
}
