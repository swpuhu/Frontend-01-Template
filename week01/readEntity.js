const fs = require('fs');
const path = require('path');

function readEntity (str) {
    let startFlag = false;
    let endFlag = false;
    let res = [];
    let s = ''
    let token = '';
    for (let char of str.toString()) {
        s += char;
        if (/!ENTITY\s/.test(s)) {
            startFlag = true;
            s = '';
            continue;
        }
        if (startFlag) {
            if (char === ' ') {
                startFlag = false;
                res.push(token);
                token = '';
            }
            token += char;
        }
    }
    return res;
}

fs.readFile(path.resolve(__dirname, './xhtml-lat1.ent'), (err, data) => {
    if (!err) {
        let res = readEntity(data);
        res.shift();
        res = res.map(item => {
            return '- ' + item;
        })
        let str = res.join('\n');
        fs.writeFileSync(path.resolve(__dirname, './xhtml-lat1.txt'), str);
    }
})

fs.readFile(path.resolve(__dirname, './xhtml-special.ent'), (err, data) => {
    if (!err) {
        let res = readEntity(data);
        res.shift();
        res = res.map(item => {
            return '- ' + item;
        })
        let str = res.join('\n');
        fs.writeFileSync(path.resolve(__dirname, './xhtml-special.txt'), str);
    }
})

fs.readFile(path.resolve(__dirname, './xhtml-symbol.ent'), (err, data) => {
    if (!err) {
        let res = readEntity(data);
        res.shift();
        res = res.map(item => {
            return '- ' + item;
        })
        let str = res.join('\n');
        fs.writeFileSync(path.resolve(__dirname, './xhtml-symbol.txt'), str);
    }
})