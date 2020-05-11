function test () {
    return new Promise ((resolve, reject) => {
        resolve();
        console.log('in promise');
    });
}


test().then(() => {
    console.log(1);
})