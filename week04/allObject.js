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
        object: this[key],
        parent: null,
    });
}

let current;
let set = new Set();
let count = 0;
let nodes = [];
let edges = [];
let id = 0;
let level = 0;
while (queue.length) {
    let size = queue.length;
    while (size--) {
        current = queue.shift();
        if (set.has(current.object)) {
            continue;
        }
        set.add(current.object);
        current.id = id++;
        current.pathName = current.path.join('.');
        nodes.push({
            id: current.id,
            label: current.path[current.path.length - 1],
            class: `level${level}`
        });
        if (current.parent) {
            edges.push({
                label: `e${current.parent.id}-${current.id}`,
                source: current.parent.id.toString(),
                target: current.id.toString(),
                weight: 1
            });
        }
        // console.log(current.path.join('.'));
        if (current.object == undefined) continue;
        ++count;
        for (let p of Object.getOwnPropertyNames(current.object)) {
            let property = Object.getOwnPropertyDescriptor(current.object, p);

            if (property.hasOwnProperty('value') &&
                ((property.value != null) && (typeof property.value == 'object' || typeof property.value == 'function')) &&
                property.value instanceof Object) {
                queue.push({
                    path: current.path.concat([p]),
                    object: property.value,
                    parent: current
                });
            }

            if (property.hasOwnProperty('get') && property.get instanceof Object) {
                queue.push({
                    path: current.path.concat([p]),
                    object: property.get,
                    parent: current
                });

            }

            if (property.hasOwnProperty('set') && property.set instanceof Object) {
                queue.push({
                    path: current.path.concat([p]),
                    object: property.set,
                    parent: current
                });

            }
        }
    }
    level++;
}

// set.add(globalThis);

nodes.forEach(node => {
    node.style = {
        lineWidth: 1,
        stroke: '#666',
        fill: 'steelblue',
        color: '#000'
    };
    node.type = 'circle';
    node.size = 30;
})
// console.log(nodes);
// console.log(edges);

let data = {nodes, edges};
console.log(data);

