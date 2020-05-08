let globalProperty = [
    "Infinity",
    "NaN",
    "undefined",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect",
];

let queue = [];
for (let key of globalProperty) {
    queue.push({
        path: [key],
        object: this[key]
    });
}

let current;
let set = new Set();
let count = 0;
while (queue.length) {
    
    current = queue.shift();
    if (set.has(current.object)) {
        continue;
    }
    set.add(current.object);
    console.log(current.path.join('.'));
    if (current.object == undefined) continue;
    ++count;
    for (let p of Object.getOwnPropertyNames(current.object)) {
        let property = Object.getOwnPropertyDescriptor(current.object, p);

        if (property.hasOwnProperty('value') && 
        ((property.value != null) && (typeof property.value == 'object' || typeof property.value == 'function')) && 
        property.value instanceof Object) {
            queue.push({
                path: current.path.concat([p]),
                object: property.value
            });
        }

        if (property.hasOwnProperty('get') && property.get instanceof Object) {
            queue.push({
                path: current.path.concat([p]),
                object: property.get
            });
            
        }

        if (property.hasOwnProperty('set') && property.set instanceof Object) {
            queue.push({
                path: current.path.concat([p]),
                object: property.set
            });
            
        }
    }
}