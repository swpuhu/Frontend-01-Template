const EOF = Symbol('EOF');
let state = data;
let returnState;
let token = null;
let tempBuffer = '';
let lastToken;
let stack = [];
let text = '';
let totalText = '';
function emit(token) {
    console.log(token);
    
    lastToken = token;
    if (token.type === 'startTag' && !token.isSelfClosingTag) {
        token.children = [];
        let top = stack[stack.length - 1];
        if (top) {
            if (text) {
                top.children.push(text);
                text = '';
            }
            top.children.push(token);
        }
        stack.push(token);
    } else if (token.isSelfClosingTag) {
        let top = stack[stack.length - 1];
        if (top) {
            top.children.push(token);
        }
    } else if (token.type === 'endTag') {
        if (text) {
            stack[stack.length - 1].children.push(text);
            text = '';
        }
        let obj = stack.pop();
        if (!stack.length) {
            console.log(obj);
            
        }
    } else if (token.type === 'text') {
        text += token.content;
        totalText += token.content;
    }
    // console.log(token);
}

function isAppropriateEndTagToken(token, lastToken) {
    return lastToken && lastToken.type === 'startTag' && lastToken.tagName === token.tagName;
}

function data(c) {
    if (c === '&') {
        returnState = characterReference;
        return data;
    } else if (c === '<') {
        return tagOpen;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit({
            type: 'text',
            content: c
        });
        return
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: c
        });
    }
    return data;
}

function RCDATA(c) {
    if (c === '&') {
        returnState = RCDATA;
        return characterReference;
    } else if (c === '<') {
        return RCDATALessthanSign;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit({
            type: 'text',
            content: '\ufffd'
        });
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: c
        });
    }
    return RCDATA;
}

function RAWTEXT(c) {
    if (c === '<') {
        return RAWTEXTLessthanSign;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit({
            type: 'text',
            content: '\ufffd'
        });
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: c
        })
    }
    return RAWTEXT;
}

function scriptData(c) {
    if (c === '<') {
        return scriptDataLessthanSign;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit({
            type: 'text',
            content: '\ufffd'
        });
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: c
        });;
    }
    return scriptData;
}

function PLAINTEXT(c) {
    if (!c) {
        console.error('unexpected-null-character parse error.');
        emit({
            type: 'text',
            content: '\ufffd'
        });
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
    } else {
        emit({
            type: 'text',
            content: c
        });
    }
    return PLAINTEXT;
}

function tagOpen(c) {
    if (c === '!') {
        return markUpDeclarationOpen;
    } else if (c === '/') {
        return endTagOpen;
    } else if (/[a-zA-Z]/.test(c)) {
        token = {
            type: 'startTag',
            tagName: '',
            attributeName: '',
            attributeValue: '',
            attributes: {}
        };
        return tagName(c);
    } else if (c === '?') {
        console.error('unexpected-question-mark-instead-of-tag-name parse error.');
        token = {
            type: 'comment',
            comment: ''
        };
        return bogusComment(c);
    } else if (c === EOF) {
        console.error('eof-before-tag-name parse error.');
        emit({
            type: 'EOF',
            content: '\u003c'
        });
    } else {
        console.error('invalid-first-character-of-tag-name parse error.');
        emit({
            type: 'text',
            content: '\u003c'
        });
        return data(c);
    }
    return tagOpen;
}

function endTagOpen(c) {
    if (/[a-zA-Z]/.test(c)) {
        token = {
            type: 'endTag',
            tagName: ''
        };
        return tagName(c);
    } else if (c === '>') {
        console.error('missing-end-tag-name parse error.');
        return data;
    } else if (c === EOF) {
        console.error('eof-before-tag-name parse error.');
        emit({
            type: 'EOF',
            content: '\u003c\u002f'
        });
    } else {
        console.error('invalid-first-character-of-tag-name parse error.');
        token = {
            type: 'comment',
            comment: ''
        };
        return bogusComment;
    }
    return endTagOpen;
}

function tagName(c) {
    if (/[\t\n\f ]/.test(c)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        emit(token);
        return data;
    } else if (/[A-Z]/.test(c)) {
        token.tagName += c.toLowerCase();
    } else if (!c) {
        console.error('unexpected-null-character parse error');
        token.tagName += '\ufffd';
        return tagName;
    } else if (c === EOF) {
        console.error('eof-in-tag parse error.');
        emit({
            type: 'EOF',
        });
        return tagName;
    } else {
        token.tagName += c;
        return tagName;
    }
    return tagName;
}

function RCDATALessthanSign(c) {
    if (c === '/') {
        tempBuffer = '';
        return RCDATAEndTagOpen;
    } else {
        emit({
            type: 'text',
            content: '\u003c'
        });
        return RCDATA(c);
    }
    return RCDATALessthanSign;
}

function RCDATAEndTagOpen(c) {
    if (/[a-zA-Z]/.test(c)) {
        token = {
            type: 'endTag',
            tagName: ''
        };
        return RCDATAEndTagName(c);
    } else {
        emit({
            type: 'text',
            content: '\u003c\u002f'
        });
        return RCDATA(c);
    }
    return RCDATAEndTagOpen;
}

function RCDATAEndTagName(c) {
    if (/[\t\n\f ]/.test(c)) {
        if (lastToken && lastToken.type === 'startTag' && lastToken.tagName === token.tagName) {
            return beforeAttributeName;
        } else {
            // treat is as anything else
            emit({
                type: 'text',
                content: '\u003c\u002f' + tempBuffer
            });
            return RCDATA(c);
        }
    } else if (c === '/') {
        if (lastToken && lastToken.type === 'startTag' && lastToken.tagName === token.tagName) {
            return selfClosingStartTag;
        } else {
            // treat is as anything else
            emit({
                type: 'text',
                content: '\u003c\u002f' + tempBuffer
            });
            return RCDATA(c);
        }
    } else if (c === '<') {
        if (lastToken && lastToken.type === 'startTag' && lastToken.tagName === token.tagName) {
            return data;
        } else {
            // treat is as anything else
            emit({
                type: 'text',
                content: '\u003c\u002f' + tempBuffer
            });
            return RCDATA(c);
        }
    } else if (/[A-Z]/.test(c)) {
        token.tagName += c.toLowerCase();
        tempBuffer += c.toLowerCase();
    } else if (/[a-z]/.test(c)) {
        token.tagName += c;
        tempBuffer += c;
    } else {
        emit({
            type: 'text',
            content: '\u003c\u002f' + tempBuffer
        });
        return RCDATA(c);
    }
    return RCDATAEndTagName;
}

function RAWTEXTLessthanSign(c) {
    if (c === '/') {
        tempBuffer = '';
        return RAWTEXTEndTagOpen;
    } else {
        emit({
            type: 'text',
            content: '\u003c'
        });
        return RAWTEXT(c);
    }
    return RAWTEXTLessthanSign;
}

function RAWTEXTEndTagOpen(c) {
    if (/[a-zA-Z]/.test(c)) {
        token = {
            type: 'endTag',
            tagName: ''
        };
        return RAWTEXTEndTagName;
    } else {
        emit({
            type: 'text',
            content: '\u003c\u002f'
        });
        return RAWTEXT(c);
    }
    return RAWTEXTEndTagOpen;
}

function RAWTEXTEndTagName(c) {
    if (/[\t\n\f ]/.test(c)) {
        if (isAppropriateEndTagToken(token, lastToken)) {
            return beforeAttributeName;
        } else {
            // treat it as anything else
            emit({
                type: 'eof',
                content: '\u003c\u002f' + tempBuffer
            });
            return RAWTEXT(c);
        }
    } else if (c === '/') {
        if (isAppropriateEndTagToken(token, lastToken)) {
            return selfClosingStartTag;
        } else {
            // treat it as anything else
            emit({
                type: 'eof',
                content: '\u003c\u002f' + tempBuffer
            });
            return RAWTEXT(c);
        }
    } else if (c === '>') {
        if (isAppropriateEndTagToken(token, lastToken)) {
            return data;
        } else {
            // treat it as anything else
            emit({
                type: 'eof',
                content: '\u003c\u002f' + tempBuffer
            });
            return RAWTEXT(c);
        }
    } else if (/[A-Z]/.test(c)) {
        token.tagName += c.toLowerCase();
    } else if (/[a-z]/.test(c)) {
        token.tagName += c;
    } else {
        emit({
            type: 'eof',
            content: '\u003c\u002f' + tempBuffer
        });
        return RAWTEXT(c);
    }
    return RAWTEXTEndTagName;
}

function scriptDataLessthanSign (c) {
    if (c === '/') {
        tempBuffer = '';
        return scriptDataEndTagOpen;
    } else if (c === '!') {
        emit ({
            type: 'text',
            content: '\u003c\u0021'
        })
        return scriptDataEscapeStart;
    } else {
        emit ({
            type: 'text',
            content: '\u003c'
        });
        return scriptData(c);
    }
    return scriptDataLessthanSign;
}

function scriptDataEndTagOpen (c) {
    if (/[a-zA-Z]/.test(c)) {
        token = {
            type: 'endTag',
            tagName: ''
        };
        return scriptDataEndTagOpen(c);
    } else {
        emit ({
            type: 'text',
            content: '\u003c\u002f'
        });
        return scriptData(c);
    }
    return scriptDataEndTagOpen;
}

function scriptDataEndTagName (c) {
    if (/[\t\n\f ]/.test(c)) {
        if (isAppropriateEndTagToken (token, lastToken)) {
            return beforeAttributeName;
        } else {
            // treat it as anything else
        }
    } else if (c === '/') {
        if (isAppropriateEndTagToken (token, lastToken)) {
            return selfClosingStartTag;
        } else {
            // treat it as anything else
        }
    } else if (c === '>') {
        if (isAppropriateEndTagToken (token, lastToken)) {
            return data;
        } else {
            // treat it as anything else
        }
    } else if (/[A-Z]/.test(c)) {
        token.tagName += c.toLowerCase();
        tempBuffer += c.toLowerCase();
    } else if (/[a-z]/.test(c)) {
        token.tagName += c;
        tempBuffer += c;
    } else {
        emit ({
            type: 'text',
            content: '\u003c\u002f' + tempBuffer
        });
        return scriptData(c);
    }
    return scriptDataEndTagName;
}


function scriptDataEscapeStart (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
        return scriptDataEscapeStartDash;
    } else {
        return scriptData(c);
    }
    return scriptDataEscapeStart;
}

function scriptDataEscapeStartDash (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
        return scriptDataEscapeDashDash;
    } else {
        return scriptData(c);
    }
    return scriptDataEscapeStartDash;
}

function scriptDataEscape(c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
        return scriptDataEscapeDash;
    } else if (c === '<') {
        return scriptDataEscapeLessthanSign;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit ({
            type: 'text',
            content: '\ufffd'
        });
    } else if (c === EOF) {
        console.error('eof-in-script-html-comment-like-text parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        emit ({
            type: 'text',
            content: c
        });
    }
    return scriptDataEscape;
}


function scriptDataEscapeDash (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content:'\u002d'
        });
        return scriptDataEscapeDashDash;
    } else if (c === '<') {
        return scriptDataEscapeLessthanSign;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        return scriptDataEscape;
    } else if (c === EOF) {
        console.error('eof-in-script-html-commenct-like-text parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        return scriptDataEscape;
    }
    return scriptDataEscapeDash;
}

function scriptDataEscapeDashDash (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
    } else if (c === '<') {
        return scriptDataEscapeLessthanSign;
    } else if (c === '>') {
        emit ({
            type: 'text',
            content: '\u003e'
        })
        return scriptData;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit ({
            type: 'text',
            content: '\ufffd'
        })
    } else if (c === EOF) {
        console.error('eof-in-script-html-comment-like-text parse error');
        emit({
            type: 'EOF'
        });
    } else {
        emit ({
            type: 'text',
            content: c
        })
        return scriptDataEscape;
    }
    return scriptDataEscapeDashDash;
}


function scriptDataEscapeLessthanSign (c) {
    if (c === '/') {
        tempBuffer = '';
        return scriptDataEscapeEndTagOpen;
    } else if (/[a-zA-Z]/.test(c)) {
        tempBuffer = '';
        emit ({
            type: 'text',
            content: '\u003c'
        });
        return scriptDataDoubleEscapeStart
    } else {
        emit ({
            type: 'text',
            content: '\u003c'
        });
        return scriptDataEscape(c);
    }
    return scriptDataEscapeLessthanSign;
}

function scriptDataEscapeEndTagOpen (c) {
    if (/[a-zA-Z]/.test(c)) {
        token = {
            type: 'endTag',
            tagName: ''
        };
        return scriptDataEscapeEndTagName(c);
    } else {
        emit ({
            type: 'text',
            content: '\u003c\u002f'
        });
        return scriptDataEscape(c);
    }
    return scriptDataEscapeEndTagOpen;
}

function scriptDataEscapeEndTagName (c) {
    if (/[\t\n\f ]/.test(c)) {
        if (isAppropriateEndTagToken (token, lastToken)) {
            return beforeAttributeName;
        } else {
            // treat it as anything else
        }
    } else if (c === '/') {
        if (isAppropriateEndTagToken (token, lastToken)) {
            return selfClosingStartTag;
        } else {
            // treat it as anything else
        }
    } else if (c === '>') {
        if (isAppropriateEndTagToken (token, lastToken)) {
            return data;
        } else {
            // treat it as anything else
        }
    } else if (/[A-Z]/.test(c)) {
        token.tagName += c.toLowerCase();
        tempBuffer += c.toLowerCase();
    } else if (/[a-z]/.test(c)) {
        token.tagName += c;
        tempBuffer += c;
    } else {
        emit ({
            type: 'text',
            content: '\u003c\u002f' + tempBuffer
        });
        return scriptDataEscape(c);
    }
    return scriptDataEscapeEndTagName;
}


function scriptDataDoubleEscapeStart (c) {
    if (/[\t\n\f \/>]/.test(c)) {
        emit ({
            type: 'text',
            content: 'c'
        })
        if (tempBuffer === '"script"') {
            return scriptDataDoubleEscape;
        } else {
            return scriptDataEscape;
        }
    } else if (/[A-Z]/.test(c)) {
        tempBuffer += c.toLowerCase();
        emit ({
            type: 'text',
            content: c
        });
    } else if (/[a-z]/.test(c)) {
        tempBuffer += c;
        emit ({
            type: 'text',
            content: c
        });
    } else {
        return scriptDataEscape(c);
    }
    return scriptDataDoubleEscapeStart;
}

function scriptDataDoubleEscape (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
        return scriptDataDoubleEscapeDash;
    } else if (c === '<') {
        emit ({
            type: 'text',
            content: '\u003c'
        });
        return scriptDataDoubleEscapeLessthanSign;
    } else if (!c) {
        console.error ('eof-in-script-html-comment-like-text parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        emit ({
            type: 'text',
            content: c
        });
    }
    return scriptDataDoubleEscape;
}

function scriptDataDoubleEscapeDash (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
        return scriptDataDoubleEscapeDashDash;
    } else if (c === '<') {
        emit ({
            type: 'text',
            content: '\u003c'
        });
        return scriptDataDoubleEscapeLessthanSign;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        emit ({
            type: 'text',
            content: '\ufffd'
        });
        return scriptDataDoubleEscape;
    } else if (c === EOF) {
        console.error ('eof-in-script-html-comment-like-text parse error');
        emit ({
            type: 'EOF',
        });
    } else {
        emit ({
            type: 'text',
            content: c
        });
        return scriptDataDoubleEscape;
    }
    return scriptDataDoubleEscapeDash;
}


function scriptDataDoubleEscapeDashDash (c) {
    if (c === '-') {
        emit ({
            type: 'text',
            content: '\u002d'
        });
    } else if (c === '<') {
        emit ({
            type: 'text',
            content: '\u003c'
        });
        return scriptDataDoubleEscapeLessthanSign;
    } else if (c === '>') {
        emit ({
            type: 'text',
            content: '\u003e'
        });
        return scriptData;
    } else if (!c) {
        console.error('eof-in-script-html-comment-like-text parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        emit ({
            type: 'text',
            content: c
        })
        return scriptDataDoubleEscape;
    }
    return scriptDataDoubleEscapeDashDash;
}

function scriptDataDoubleEscapeLessthanSign (c) {
    if (c === '/') {
        tempBuffer = '';
        emit ({
            type: 'text',
            content: '\u002f'
        });
        return scriptDataDoubleEscapeEnd;
    } else {
        return scriptDataDoubleEscape (c);
    }
    return scriptDataDoubleEscapeLessthanSign;
}

function scriptDataDoubleEscapeEnd (c) {
    if (/[\t\n\f \/>]/.test(c)) {
        emit ({
            type: 'text',
            content: c
        })
        if (tempBuffer === '"script"') {
            return scriptDataEscape;
        } else {
            return scriptDataDoubleEscape;
        }
    } else if (/[A-Z]/.test(c)) {
        tempBuffer += c.toLowerCase ();
        emit ({
            type: 'text',
            content: c
        });
    } else if (/[a-z]/.test(c)) {
        tempBuffer += c;
        emit ({
            type: 'text',
            content: c
        })
    } else {
        return scriptDataDoubleEscape;
    }
    return scriptDataDoubleEscapeEnd;
}

function beforeAttributeName (c) {
    if (/[\t\n\f ]/.test(c)) {
        return afterAttributeName;
    } else if (/[\/>]/.test(c) || c === EOF) {
        return afterAttributeName(c);
    }  else if (c === '=') {
        console.error('unexpected-equals-sign-before-attribute-name parse error.');
        // todo
    } else {
        token.attributes[token.attributeName] = token.attributeValue;
        token.attributeName = '';
        token.attributeValue = '';
        return attributeName(c);
    }
    return beforeAttributeName;
}

function attributeName (c) {
    if (/[\t\n\f \/>]/.test(c) || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (/[A-Z]/.test(c)) {
        token.attributeName += c.toLowerCase();
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        token.attributeName += '\ufffd';
    } else if (/["'<]/.test(c)) {
        console.error('unexpected-character-in-attribute-name parse error.');
        token.attributeName += c;
    } else {
        token.attributeName += c;
    }
    return attributeName;
}

function afterAttributeName (c) {
    if (/[\t\n\f ]/.test(c)) {
        return;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        emit (token);
        return data;
    } else if (c === EOF) {
        console.error('eof-in-tag parse error.');
    } else {
        token.attributes[token.attributeName] = token.attributeValue;
        return attributeName
    }
    return afterAttributeName;
}

function beforeAttributeValue (c) {
    
    if (/[\t\n\f ]/.test(c)) {
        return;
    } else if (c === '"') {
        return attributeValueDoubleQuoted;
    } else if (c === '\'') {
        return attributeValueSingleQuoted;
    } else if (c === '>') {
        console.error('missing-attribute-value parse error.');
        emit (token);
        return data;
    } else {
        return attributeValueUnquoted;
    }
    return beforeAttributeValue;
}

function attributeValueDoubleQuoted (c) {
    if (c === '"') {
        return afterAttributeValueQuoted;
    } else if (c === '&') {
        returnState = attributeValueDoubleQuoted;
        return characterReference;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        token.attributeValue += c;
    } else if (c === EOF) {
        console.error('eof-in-tag parse error.');
        emit ({
            type: 'EOF',
        });
    } else {
        token.attributeValue = c;
    }
    return attributeValueDoubleQuoted;
}

function attributeValueSingleQuoted (c) {
    if (c === '\'') {
        return afterAttributeValueQuoted;
    } else if (c === '&') {
        returnState = attributeValueSingleQuoted;
        return characterReference;
    } else if (!c) {
        console.error('unexpected-null-character parse error.');
        token.attributeValue += c;
    } else if (c === EOF) {
        console.error('eof-in-tag parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        token.attributeValue += c;
    }
    return attributeValueSingleQuoted;
}

function attributeValueUnquoted (c) {
    if (/[\t\n\f ]/.test(c)) {
        return beforeAttributeName;
    } else if (c === '&') {
        returnState = attributeValueUnquoted;
        return characterReference;
    } else if (c === '>') {
        emit (token);
        return data;
    } else if (!c) {
        console.error('unexpected-null-character parse error');
        token.attributeValue += '\ufffd';
    } else if (/["'<=`]/.test(c)) {
        console.error('unexpected-character-in-unquoted-attribute-value parse error.');
        token.attributeValue += c;
    } else if (c === EOF) {
        console.error('eof-in-tag parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        token.attributeValue += c;
    }
    return attributeValueUnquoted;
}

function afterAttributeValueQuoted(c) {
    if (/[\t\n\f ]/.test(c)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        emit (token);
        return data;
    } else if (c === EOF) {
        emit ({
            type: 'EOF'
        });
        console.error('eof-in-parse error');
    } else {
        console.error('missing-whitespace-between-attributes parse error.');
        return beforeAttributeName;
    }
    return afterAttributeValueQuoted;
}

function selfClosingStartTag (c) {
    if (c === '>') {
        token.isSelfClosingTag = true;
        emit (token);
        return data;
    } else if (c === EOF) {
        console.error('eof-in-tag parse error.');
        emit ({
            type: 'EOF'
        });
    } else {
        console.error('unexpected-solidus-in-tag parse error.');
        return beforeAttributeName;
    }
    return selfClosingStartTag;
}

function characterReference (c) {
    if (/[a-zA-Z0-9]/.test(c)) {
        return namedCharacterReference(c);
    } else if (c === '#') {
        tempBuffer += c;
        return numericCharacterReference;
    } else {
        return returnState(c);
    }
    return characterReference;
}

function namedCharacterReference (c) {
    return namedCharacterReference;
}


function parse (string) {
    for (let c of string) {
        let nextState = state(c);
        if (nextState) {
            state = nextState;
        }
    }
}


let testHtml = `<html maaa=a >
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
</html>
`

parse(testHtml);
