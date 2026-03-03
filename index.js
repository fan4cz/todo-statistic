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

    if (command.startsWith('sort ')) {
        sortType = command.slice(5).trim();
        command = 'sort';
    }

    let date;
    if (command.startsWith('date ')) {
        date = command.slice(5).trim();
        command = 'date';
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
            todos.forEach(todo => {
                author = extractAuthorFromTodo(todo);
                if (author != null && author.toLowerCase() === username.toLowerCase()) {
                    console.log(todo);
                }
            });
            break;
        case 'sort':
            switch (sortType) {
                case 'date':
                    console.log(dateSorting(getAllTODO()));
                    break;
                case 'user':
                    console.log(userSorted(getAllTODO()));
                    break;
                case 'importance':
                    const todos = getAllTODO();
                    todos.sort((str1, str2) => {
                        const cnt1 = str1.split("!").length - 1;
                        const cnt2 = str2.split("!").length - 1;
                        return cnt2 - cnt1;
                    });
                    console.log(todos)
                    break;
                default:
                    break;
            }
            break
        case 'date':
            let parts = date.split('-').map(part => +part);
            if(parts.length == 1){
                parts.push(1);
                parts.push(1);
            }else if(parts.length == 2){
                parts.push(1);
            }
            let day = new Date(parts[0], parts[1], parts[2]);
            let dates = dateSorting(getAllTODO());
            dates = dates.filter(d => new Date(extractDateFromTodo(d)) > day);
            console.log(dates);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

// ToDo: you can do it!

// todoyou can do it!

//todoyou can do it!

function getAllTODO(isImportant) {
    const regex = /^\s*\/\/\s*TODO\s*:?\s*([^\n]*)/gmi;

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

function extractDateFromTodo(todoText) {
    const regex = /\/\/\s*TODO\s*([^;]+);\s*([^;]+);\s*(.*)/;
    const match = todoText.match(regex);
    return match ? match[2].trim() : null;
}

function dateSorting(todos) {
    const sorted = [...todos].sort((a, b) => {
        const dateAStr = extractDateFromTodo(a);
        const dateBStr = extractDateFromTodo(b);

        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            const timestamp = Date.parse(dateStr);
            return isNaN(timestamp) ? null : timestamp;
        };

        const tsA = parseDate(dateAStr);
        const tsB = parseDate(dateBStr);

        if (tsA !== null && tsB !== null) {
            return tsB - tsA;
        } else if (tsA !== null) {
            return -1;
        } else if (tsB !== null) {
            return 1;
        } else {
            return 0;
        }
    });
    return sorted;
}

function userSorted(todos) {
    let dict = {}
    todos.forEach(todo => {
        author = extractAuthorFromTodo(todo);
        if (author != null && author.toLowerCase().toLowerCase() !== null) {
            if (author.toLowerCase() in dict) {
                dict[author.toLowerCase()].push(todo);
            } else {
                dict[author.toLowerCase()] = [todo];
            }
        }
    });

    todos.forEach(todo => {
        author = extractAuthorFromTodo(todo);
        if (author === null) {
            if ('' in dict) {
                dict[''].push(todo);
            } else {
                dict[''] = [todo];
            }
        }
    });

    return dict;
}