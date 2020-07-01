function fib (n) {
    if (n <= 2) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}

fib(20);
setImmediate(() => {
    console.log('immediately');
}, 0);


setTimeout(() => {
    console.log('set timeout');

}, 0)