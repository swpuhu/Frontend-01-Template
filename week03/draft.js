
var x = 0;
function foo () {
    var o = {x: 1};
    x = 2;
    with (o) {
        var x = 3;

    }
    console.log(x);
    console.log(o.x);
    
}

foo();
console.log(x);

