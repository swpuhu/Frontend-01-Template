async function afoo() {
    console.log('-2');
    await new Promise(resolve => resolve());
    console.log('-1');
}


new Promise(resolve => (console.log('0'), resolve())).then(() => (console.log('1'), 
    new Promise(resolve => resolve()).then(() => console.log('1.5'))));

setTimeout(() => {
    console.log('2');

    new Promise(resolve => resolve()).then(console.log('3'));
}, 0);

console.log('4');
console.log('5');
afoo();

// ------- macro -------------- // ------- macro ------- //
// | 0, 4, 5, -2 | 1 | -1 | 1.5 // | 2 | 3               //
//   入队 1 -1    | 入队 1.5 