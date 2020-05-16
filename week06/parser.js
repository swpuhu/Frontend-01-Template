const EOF = Symbol('EOF');
let currentToken = {};
let currentNode = null;
let obj;
let stack = [];
function emit (token) {
    console.log(token);
    if (token.type === 'startTag' && !obj) {
        obj = {
            tagName: token.tagName,
            children: [],
            text: ''
        };
    } else if (token.type === 'startTag') {
        stack.push(obj);
        let newTag = {
            tagName: token.tagName,
            children: [],
            text: ''
        };
        obj.children.push(newTag);
        obj = newTag;
    } else if (token.type === 'endTag') {
        let o = stack.pop();
        if (o) {
            obj = o;
        }
    } else if (token.type === 'attribute') {
        for (let key in token.attributes) {
            obj[key] = token.attributes[key];
        }
    } else if (token.type === 'text') {
        obj.text += token.content;
    }
    
}
function data (c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: 'EOF',
            content: ''
        });
        return ;
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data;
    }
}

function tagOpen (c) {
    if (c === '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z0-9]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ""
        }
        return tagName(c);
    } else {
        return ;
    }
}

function tagName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        emit(currentToken);
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z0-9]/)) {
        currentToken.tagName += c.toLowerCase();
        return tagName;
    } else if (c === '>') {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

function endTagOpen (c) {
    if (/^[a-zA-Z0-9]/.test(c)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c);
    } else if (c === '>') {
        throw new Error('missing ned tag name parse error');
    } else {
        throw new Error('invalid first character of tag name parse error.');
    }
}

function beforeAttributeName (c) {
    if (/^[\t\f\n ]$/.test(c)) {
        return afterAttributeName;
    } else if (c === '"') {
        return attributeValueDoubleQuoted;
    } else if (c === '\'') {
        return attributeValueSingleQuoted;
    } else if (c === '>') {
        throw new Error('missing attribute value parse error');
    } else {
        if (currentToken.attributeName) {
            currentToken.attributes[currentToken.attributeName] = currentToken.attributeValue;
            currentToken.attributeName = '';
            currentToken.attributeValue = '';
        } else {
            currentToken = {
                type: 'attribute',
                attributeName: '',
                attributeValue: '',
                attributes: {}
            };
        }
        return attributeName(c);
    }
}

function afterAttributeName (c) {
    if (/^[\t\f\n ]$/.test(c)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        emit(currentToken);
        return data;
    } else {
        currentToken.attributes[currentToken.attributeName] = currentToken.attributeValue;
        currentToken.attributeName = '';
        currentToken.attributeValue = '';
        return attributeName(c);
    }
}

function attributeName (c) {
    if (/^[\t\n\f \/>]/.test(c)) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (/[a-zA-Z0-9]/.test(c)) {
        currentToken.attributeName += c;
        return attributeName;
    } else {
        throw new Error ('unexpected-character in attribute name parse error');
    }
}

function beforeAttributeValue (c) {
    if (/^[\t\n\f \/>]/.test(c)) {
        return beforeAttributeName;
    } else if (c === '"') {
        return attributeValueDoubleQuoted;
    } else if (c === '\'') {
        return attributeValueSingleQuoted;
    } else if (c === '>') {
        throw new Error('missing attribute value parse error');
    } else {
        return attributeValueUnquoted(c);
    }

}

function attributeValueDoubleQuoted (c) {
    if (c === '"') {
        return afterAttributeValueQuoted;
    } else {
        currentToken.attributeValue += c;
    }
}

function attributeValueSingleQuoted (c) {
    if (c === '\'') {
        return afterAttributeValueQuoted;
    } else {
        currentToken.attributeValue += c;
    }
}

function attributeValueUnquoted (c) {
    if (/^[\t\n\f ]$/.test(c)) {
        return beforeAttributeName;
    } else if (c === '>') {
        emit(currentToken);
        return data;
    } else if (/["'<=`]/.test(c)) {
        throw new Error('unexpected character in unquoted attribute value parse error');
    } else {
        currentToken.attributeValue += c;
        return attributeValueUnquoted;
    }
}

function afterAttributeValueQuoted (c) {
    if (/^[\t\n\f ]$/.test(c)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        if (currentToken.attributeName) {
            currentToken.attributes[currentToken.attributeName] = currentToken.attributeValue;
            currentToken.attributeName = '';
            currentToken.attributeValue = '';
        }
        emit(currentToken);
        return data;
    } else {
        throw new Error('missing whitespace between attributes parse error.');
    }
}

function selfClosingStartTag (c) {
    if (c === '>') {
        currentToken.type === 'selfClosingTag';
        emit(currentToken);
        return data;
    } else {
        return beforeAttributeName(c);``
    }
}


const html = `<html>
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>`;
let currentState = data;
for (let char of html) {
    let state = currentState(char);
    if (state) {
        currentState = state;
    }
}
console.log(obj);
