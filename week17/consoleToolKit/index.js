const stdin = process.stdin;
const stdout = process.stdout;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');

function getChar () {
    return new Promise((resolve) => {
        stdin.once('data', key => {
            resolve(key);
        });
    })
}

function left (n = 1) {
    stdout.write('\033[' + n + 'D');
}

function right (n = 1) {
    stdout.write('\033[' + n + 'C');
}

function up (n = 1) {
    stdout.write('\033[' + n + 'A');
}

function down (n = 1) {
    stdout.write('\033[' + n + 'B');
}


void async function () {
    stdout.write('which framework do you want to use?\n');
    let list = ["vue", "react", "angular"];
    let answer = await select(list);
    stdout.write('you selected framework is ' + answer + '\n');
    process.exit();
    
}()


async function select (choices) {
    let selected = 0;
    for (let i = 0; i < choices.length; i++) {
        let choice = choices[i];
        if (i === selected) {
            stdout.write("[x] " + choice + '\n');
        } else {
            stdout.write("[ ] " + choice + '\n');
        }
        
    }
    up(choices.length);
    right();
    while (true) {
        let char = await getChar();
        if (char === '\u0003') {
            down(3);
            stdout.write('keyboard interrupt\n');
            process.exit();
            break;
        }
        if (char === 'w' && selected > 0) {
            stdout.write(" ");
            left();
            selected--;
            up();
            stdout.write("x");
            left();
        } else if (char === 's' && selected < choices.length - 1) {
            stdout.write(" ");
            left();
            selected++;
            down();
            stdout.write("x");
            left();
        } else if (char === '\r') {
            down(choices.length - selected);
            left();
            return choices[selected];
        }
    }

    // stdout.write();
}