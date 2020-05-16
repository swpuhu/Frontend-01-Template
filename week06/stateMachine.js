

function start (c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start;
    }
}

function foundA (c) {
    if (c === 'a') {
        return foundA;
    } else if (c === 'b') {
        return foundB;
    } else {
        return start;
    }
}

function foundB (c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start;
    }
}

function foundA2 (c) {
    if (c === 'a') {
        return foundA;
    } else if (c === 'b') {
        return foundB2;
    } else {
        return start;
    }
}

function foundB2 (c) {
    if (c === 'a') {
        return foundA2;
    } else if (c === 'x') {
        return end;
    } else {
        return start;
    }
}

function end () {
    return end;
}

let str = 'abcaqweaaababx';

let state = start;

for (let i = 0; i < str.length; i++) {
    state = state(str[i]);
}

console.log(state === end);