class BinaryHeap {
    /**
     * 
     * @param {Array} data 
     * @param {*} compare 
     */
    constructor (data, compare) {
        this.data = [];
        this.compare = compare;
        for (let i = 0; i < data.length; i++) {
            this.insert(data[i]);
        }
    }
    
    getLeft (i) {
        return i * 2 + 1; 
    }

    getRight (i) {
        return i * 2 + 2; 
    }

    getParent (i) {
        return Math.floor((i - 1) / 2);
    }
    _shiftUp (k) {
        while (k > 0 && this.compare(this.data[k], this.data[this.getParent(k)])) {
            this._swap(k, this.getParent(k));
            k = this.getParent(k);
        }

    }

    _swap (i, j) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    _shiftDown (k) {
        while (this.getLeft(k) < this.data.length) {
            let j = this.getLeft(k);
            if (this.getRight(k) < this.data.length && this.compare(this.data[this.getRight(k)], this.data[j])) {
                j++;
            }

            if (this.compare(this.data[k], this.data[j])) {
                return;
            }
            this._swap(k, j);
            k = j;
        }
    }

    getMin () {
        return this.data[0];
    }
    take () {
        [this.data[0], this.data[this.data.length - 1]] = [this.data[this.data.length - 1], this.data[0]];
        let min = this.data.pop();
        this._shiftDown(0);
        return min;
    }

    insert (v) {
        this.data.push(v);
        this._shiftUp(this.data.length - 1);
    }

    get length() {
        return this.data.length;
    }
}


class Sorted {
    /**
     * 
     * @param {Array}} data 
     * @param {*} compare 
     */
    constructor (data, compare = (a, b) => a - b) {
        this.data = data;
        this.compare = compare;
    }

    take () {
        if (!this.data.length) {
            return;
        }
        let min = this.data[0];
        let minIndex = 0;
        for (let i = 1; i < this.data.length; i++) {
            if (this.compare(min, this.data[i]) > 0) {
                min = this.data[i];
                minIndex = i;
            }
        }
        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop();
        return min;
    }

    insert (v) {
        this.data.push(v);
    }

    get length () {
        return this.data.length;
    }
}


const container = document.getElementById('container');

let map = localStorage.getItem('map') ?
        JSON.parse(localStorage.getItem('map')) : new Array(10000).fill(0);

for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        if (map[y * 100 + x] === 1) {
            cell.style.backgroundColor = 'black';
        }
        cell.addEventListener('mouseover', function (e) {
            if (mouse) {
                if (clear) {
                    cell.style.backgroundColor = '';
                    map[y * 100 + x] = 0;
                } else {
                    cell.style.backgroundColor = 'black';
                    map[y * 100 + x] = 1;
                    if (y - 1 >= 0) {
                        map[(y - 1) * 100 + x] = 1;
                        container.children[(y - 1) * 100 + x].style.backgroundColor = 'black';
                    }
                    if (y + 1 < 100) {
                        map[(y + 1) * 100 + x] = 1;
                        container.children[(y + 1) * 100 + x].style.backgroundColor = 'black';
                    }
                    if (x - 1 >= 0) {
                        map[y * 100 + x - 1] = 1;
                        container.children[(y) * 100 + x - 1].style.backgroundColor = 'black';
                    }
                    if (x + 1 < 100) {
                        map[y * 100 + x + 1] = 1;   
                        container.children[(y) * 100 + x + 1].style.backgroundColor = 'black';
                    }
                }
            }
        });

        cell.onclick = () => {
            if (status === 1) {
                if (startCell) {
                    startCell.style.backgroundColor = '';
                }
                startCoord = [x, y];
                cell.style.backgroundColor = 'green';
                startCell = cell;
            } else {
                if (endCell) {
                    endCell.style.backgroundColor = '';
                }
                endCoord = [x, y];
                cell.style.backgroundColor = 'red';
                endCell = cell; 

            }
        }

        container.appendChild(cell);
    }
}

for (let i = 0; i < map.length; i++) {
    
}

let mouse = false;
let clear = false;

const erase = document.getElementById('erase');
const drawMode = document.getElementById('draw');
const clearAll = document.getElementById('clearAll');
const start = document.getElementById('start');
const end = document.getElementById('end');
const pathBtn = document.getElementById('path');
let startCell, endCell;
let status = null;
let startCoord, endCoord;
start.onclick = () => status = 1;
end.onclick = () => status = 2;
pathBtn.onclick = () => {
    if (startCoord && endCoord) {
        path(map, startCoord, endCoord);
    }
    
}


clearAll.addEventListener('click', function (e) {
    for (let i = 0; i < map.length; i++) {
        map[i] = 0;
        container.children[i].style.backgroundColor = '';
    }
});

document.addEventListener('mousedown', function (e) {
    mouse = true;
    clear = erase.checked;
})

document.addEventListener('mouseup', function (e) {
    mouse = false;
    clear = false;
    localStorage.setItem('map', JSON.stringify(map));
})







function sleep(t) {
    return new Promise((resolve, reject)=> {
        setTimeout(resolve, t);
    })
}



async function path (map, start, end) {
    function distance([x, y]) {
        return (x - end[0]) ** 2 + (y - end[1]) ** 2;
    }
    let collection = new BinaryHeap([start], (a, b) => distance(a) - distance(b) < 0);

    map = map.slice();
    async function insert([x, y], pre) {
        if (map[100 * y + x] !== 0) {
            return;
        } else if (x < 0 || y < 0 || x >= 100 || y >= 100) {
            return;
        }
        map[y * 100 + x] = pre;
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
        await sleep(0);
        collection.insert([x, y]);
    }
    while (collection.length) {
        let [x, y] = collection.take();
        if (x === end[0] && y === end[1]) {
            let path = [];
            
            while (x !== start[0] || y !== start[1]) {
                console.log(x, y);
                path.push([x, y]);
                container.children[y * 100 + x].style.backgroundColor = 'pink';
                [x, y] = map[y * 100 + x];
            }
            return true;
            
        }
        await insert([x - 1, y], [x, y]);
        await insert([x + 1, y], [x, y]);
        await insert([x, y - 1], [x, y]);
        await insert([x, y + 1], [x, y]);

        if (map[100 * (y - 1) + x] === 0 || map[100 * (y) + x - 1] === 0) {
            await insert([x - 1, y - 1], [x, y]);
        }
        if (map[100 * (y - 1) + x] === 0 || map[100 * (y) + x + 1] === 0) {
            await insert([x + 1, y - 1], [x, y]);
        }
        if (map[100 * (y + 1) + x] === 0 || map[100 * (y) + x - 1] === 0) {
            await insert([x - 1, y + 1], [x, y]);
        }
        if (map[100 * (y + 1) + x] === 0 || map[100 * (y) + x + 1] === 0) {
            await insert([x + 1, y + 1], [x, y]);
        }
        
        
        
    }
    return false;
}