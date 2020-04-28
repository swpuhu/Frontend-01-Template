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
        } else {
            number += chars[i].codePointAt(0) - '0'.codePointAt();
        }
        i++;
    }
    if (chars[i] == '.') {
        i++;
    }
    let fraction = 1;
    while (i < chars.length && chars[i] != 'e') {
        fraction /= x;
        number += (chars[i].codePointAt(0) - '0'.codePointAt()) * fraction;
        i++;
    }
    
    
    if (chars[i] == 'e') {
        i++;
    }
    let exp = 0;
    while (i < chars.length) {
        exp *= chars[i];
        exp += (chars[i].codePointAt(0) - '0'.codePointAt());
        i++;
    }
    return number * (10 ** exp);
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

let res = convertStringToNumber('2.13456e2', 10);
console.log(res);

res = convertNumberToString(0.1, 2);

console.log(res);
