
const TOKENTYPE = {
    Number: Symbol('Number'),
    Multi: Symbol('Multi'),
    Divide: Symbol('Divide'),
    Plus: Symbol('Plus'),
    Minus: Symbol('Minus')
}

function isBlank(c) {
    return /[\t\r\n ]/.test(c);
}
function isOperator (c) {
    return /[\+\-\*\/]/.test(c);
}
function tokenize (source) {
    let token;
    let tokens = [];
    const emit = (token) => {
        tokens.push(token);
    }   

    const waitData = (c) => {
        if (isBlank(c)) {
            return waitData;
        } else if (/[0-9]/.test(c)) {
            token = {
                type: TOKENTYPE.Number,
                value: ''
            };
            return readNumber(c);
        } else if (isOperator(c)) {
            return readOperator(c);
        } else {
            throw new Error(`unexpected char:  ${c}, need a number.`);
        }
    }

    const readNumber = (c) => {
        if (isBlank(c)) {
            emit(token);
            return waitData;
        } else if (/[0-9]/.test(c)) {
            token.value += c;
            return readNumber;
        } else if (isOperator(c)) {
            emit(token);
            return readOperator(c);
        }
    }

    const readOperator = (c) => {
        if (c === '+') {
            token = {
                type: TOKENTYPE.Plus,
                value: '+'
            }
            emit(token);
        } else if (c === '-') {
            token = {
                type: TOKENTYPE.Minus,
                value: '-'
            }
            emit(token);
        } else if (c === '*') {
            token = {
                type: TOKENTYPE.Multi,
                value: '*'
            }
            emit(token);
        } else if (c === '/') {
            token = {
                type: TOKENTYPE.Divide,
                value: '/'
            }
            emit(token);
        } else {
            throw new Error(`unexpected char: ${c}, need an operator.`);
        }
        return waitData;
        
    }

    let state = waitData;
    for (let c of source) {
        state = state(c);
    }
    if (token) {
        emit(token);
    }
    emit({
        type: 'EOF'
    })
    return tokens;
}


// let res = tokenize('1024 * 8 - 90 +2');

