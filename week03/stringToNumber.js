function convertStringToNumber (string, x = 10) {
    let chars = string.split('');
    let number = 0;
    let i = 0;
    while (i < chars.length && chars[i] !== '.') {
        number = number * x;
        if (/[a-f]/.test(chars[i])) {
            number += chars[i].codePointAt(0) - 'a'.codePointAt() + 10;

        } else if (/[A-F]/.test(chars[i])) {
            number += chars[i].codePointAt(0) - 'A'.codePointAt() + 10;
        }
        i++;
    }
    if (chars[i] == '.') {
        i++;
    }
    let fraction = 1;
    while (i < chars.length) {
        fraction /= x;
        number += (chars[i].codePointAt(0) - '0'.codePointAt()) * fraction;
        
        i++;
    }
    // fraction /= x;
    return number;
}


function convertNumberToString(number, x = 10) {
    let integer = Math.floor(number);
    let fraction = number - integer;
    let string = '';
    while (integer) {
        string = integer % x + string;
        integer = Math.floor(integer / x);
    }
    if (fraction) {
        string += '.';
        while (fraction) {
            string += Math.floor(fraction * x);
            fraction = fraction * x - Math.floor(fraction * x);
        }
    }
    return string;
}

let res = convertStringToNumber('ff', 16);
console.log(res);

res = convertNumberToString(3, 2);

console.log(res);
