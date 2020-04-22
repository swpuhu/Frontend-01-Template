# 每周总结可以写在这里

## Number 字面量

根据ECMA-262中11.8.3章节中的定义：

```
NumericLiteral ::= DecimalLiteral |
                    BinaryIntegerLiteral |
                    OctalIntegerLiteral |
                    HexIntegerLiteral

                => /
                    (^(0|[1-9][0-9]*)\.([0-9]+)?([eE][\+-]?[0-9]+)?$)|(^\.[0-9]+([eE][\+-]?[0-9]+)?$)|(^(0|[1-9][0-9]*)([eE][\+-]?[0-9]+)?$) |
                    (^0[bB][01]+$)|
                    (^0[oO][0-7]+$)|
                    (^0[xX][0-9a-fA-F]+$)
                /
                => /(^(0|[1-9][0-9]*)\.([0-9]+)?([eE][\+-]?[0-9]+)?$)|(^\.[0-9]+([eE][\+-]?[0-9]+)?$)|(^(0|[1-9][0-9]*)([eE][\+-]?[0-9]+)?$)|(^0[bB][01]+$)|(^0[oO][0-7]+$)|(^0[xX][0-9a-fA-F]+$)/

DecimalLiteral ::=  DecimalIntegerLiteral  '.'  DecimalDigits? ExponentPart? |
                    '.' DecimalDigits ExponentPart? |
                    DecimalIntegerLiteral ExponentPart?
                    => /
                        (^(0|[1-9][0-9]*)\.([0-9]+)?([eE][\+-]?[0-9]+)?$)|
                        (^\.[0-9]+([eE][\+-]?[0-9]+)?$)|
                        (^(0|[1-9][0-9]*)([eE][\+-]?[0-9]+)?$)
                    /
                    => /(^(0|[1-9][0-9]*)\.([0-9]+)?([eE][\+-]?[0-9]+)?$)|(^\.[0-9]+([eE][\+-]?[0-9]+)?$)|(^(0|[1-9][0-9]*)([eE][\+-]?[0-9]+)?$)/

DecimalIntegerLiteral ::=   0 |
                            NonZeroDigit DecimalDigits?
                            => /^(0|[1-9][0-9]*)$/

DecimalDigits ::= DecimalDigit | DecimalDigits DecimalDigit => /[0-9]+/

DecimalDigit ::= [0-9]

NonZeroDigit ::= [1-9]

ExponentPart ::= ExponentIndicator SignedInteger => /[eE][\+-]?[0-9]+/

ExponentIndicator ::= e | E

SignedInteger ::= DecimalDigits | '+' DecimalDigits | '-' DecimalDigits => /[\+-]?[0-9]+/


BinaryIntegerLiteral ::= 0b BinaryDigits | 0B BinaryDigits => /0[bB][01]+/

BinaryDigits ::= BinaryDigit | BinaryDigits BinaryDigit => /[01]+/

BinaryDigit ::= [01]

OctalIntegerLiteral ::= 0o OctalDigits | 0O OctalDigits => /0[oO][0-7]+/

OctalDigits ::= OctalDigit | OctalDigits OctalDigit => /[0-7]+/

OctalDigit ::= [0-7]

HexIntegerLiteral ::= 0x HexDigits | 0X HexDigits => /0[xX][0-9a-fA-F]+/

HexDigits ::= HexDigit | HexDigits HexDigit => /[0-9a-fA-F]+/

HexDigit ::= [0-9a-fA-F]

```

经过以上推导得出最后答案：

## 匹配Numeric字面量的正则表达式为：

```/(^(0|[1-9][0-9]*)\.([0-9]+)?([eE][\+-]?[0-9]+)?$)|(^\.[0-9]+([eE][\+-]?[0-9]+)?$)|(^(0|[1-9][0-9]*)([eE][\+-]?[0-9]+)?$)|(^0[bB][01]+$)|(^0[oO][0-7]+$)|(^0[xX][0-9a-fA-F]+$)/```


## 字符串字面量
同上， 推导过程如下：

```
Hex4Digits ::= [0-9a-fA-F]{4}

CodePoint ::=  数值不大于0x10FFFF的Hex4Digits

UnicodeEscapeSequence ::= u Hex4Digits |
                          u{CodePoint} 
                          => u[0-9a-fA-F]{4}
HexEscapeSequence ::= x HexDigit HexDigit => x[0-9a-fA-F]{2}

SingleEscapeCharacter ::= ['"bfnrtv]


EscapeCharacter ::= SingleEscapeCharacter |
                    DecimalDigit |
                    x |
                    u
                    => (['"bfnrtv]) | ([0-9]) | x | u
                    => ['"bfnrtvxu0-9]


SourceCharacter ::= any Unicode code point => /./

LineTerminator ::= <LF> | <CR> | <LS> | <PS>

NonEscapeCharacter ::= SourceCharacter but not one of EscapeCharacter or LineTerminator => [^'"bfnrtvxu0-9]|[\u000a\u000d\u2028\u2029]

CharacterEscapeSequence ::= SingleEscapeCharacter | NonEscapeCharacter =>  ['"bfnrtv] | [^'"bfnrtvxu0-9] | [\u000a\u000d\u2028\u2029]



EscapeSequence ::= CharacterEscapeSequence |
                    0 (注：0前面不能是DecimalDigit) |
                    HexEscapeSequence |
                    UnicodeEscapeSequence
                    => ['"bfnrtv] | [^'"bfnrtvxu0-9] | [\u000a\u000d\u2028\u2029] | (?<=[^1-9])0 | 



```

## UTF-8编码：
根据所查资料，代码如下：

```js
function encodeUTF8 (char) {
    let code = char.codePointAt();
    if (code >= 0x0000 && code <= 0x007f) {
        return '0x' + code.toString(16);
    } else if (code >= 0x0080 && code <= 0x07ff) {
        let code1 = code >> 6 & 0b11111 | (0b110 << 5);
        let code2 = code & 0b111111 | (0b10 << 6);
        return '0x' + code1.toString(16) + code2.toString(16);
    } else if (code >= 0x0800 && code <= 0xffff) {
        let code1 = code >> 12 & 0b1111 | (0b1110 << 4);
        let code2 = code >> 6 & 0b111111 | (0b10 << 6);
        let code3 = code & 0b111111 | (0b10 << 6);
        return '0x' + code1.toString(16) + code2.toString(16) + code3.toString(16);
    } else if (code >= 0x10000 && code <= 0x10ffff) {
        let code1 = code >> 18 & 0b111 | (0b11110 << 3);
        let code2 = code >> 12 & 0b111111 | (0b10 << 6);
        let code3 = code >> 6 & 0b111111 | (0b10 << 6);
        let code4 = code & 0b111111 | (0b10 << 6);
        return '0x' + code1.toString(16) + code2.toString(16) + code3.toString(16) + code4.toString(16);
    }
}

function decodeUTF8 (code) {
    let arr = [];
    for (let i = 0; i < code.length; i += 2) {
        arr.push(code.slice(i, i + 2));
    }
    arr.shift();
    arr = arr.map(item => parseInt(item, 16));
    let code0 = arr[0];
    if ((arr[0] & 0b11110000) === 0b11110000) {
        let code1 = arr[1];
        let code2 = arr[2];
        let code3 = arr[3];
        code0 = (code0 & 0b111) << 18;
        code1 = (code1 & 0b111111) << 12;
        code2 = (code2 & 0b111111) << 6;
        code3 = (code3 & 0b111111);
        return String.fromCodePoint(code0 | code1 | code2 | code3);
    } else if ((code0 & 0b11100000) === 0b11100000) {
        let code1 = arr[1];
        let code2 = arr[2];
        code0 = (code0 & 0b1111) << 12;
        code1 = (code1 & 0b111111) << 6;
        code2 = (code2 & 0b111111);
        return String.fromCodePoint(code0 | code1 | code2);        
    } else if ((code0 & 0b11000000) === 0b11000000) {
        let code1 = arr[1];
        code0 = (code0 & 0b11111) << 6;
        code1 = (code1 & 0b111111);
        return String.fromCodePoint(code0 | code1);
    } else {
        return String.fromCodePoint(code0);
    }
}

```

参考资料

- [Unicode 和 UTF-8有什么区别](https://www.zhihu.com/question/23374078)
