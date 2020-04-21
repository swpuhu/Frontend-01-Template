function fill(bin, num = 4) {
    while (bin.length < num) {
        bin = '0' + bin;
    }
    return bin;
}

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

let testString = `
    测试
`
let encodeArr = []
for (let char of testString) {
    encodeArr.push(encodeUTF8(char));
}
console.log(encodeArr);

let resString = '';
for (let code of encodeArr) {
    resString = resString + decodeUTF8(code);
}

let ret = encodeUTF8('🏠');
ret = decodeUTF8('0xf09f8fa0')

console.log(resString);
console.log(ret);


