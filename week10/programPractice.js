let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];


let doc = document.createElement('div');
document.body.appendChild(doc);
doc.classList.add('flex');
doc.classList.add('tic-tac-toe');

let color = 1;
function show (array) {    
    doc.innerHTML = '';
    for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[0].length; col++) {
            let item = document.createElement('div');
            item.classList.add('item');
            if (array[row][col] === 2) {
                item.textContent = '❌';
            } else if (array[row][col] === 1) {
                item.textContent = '⭕️';
            }
            item.addEventListener('click', () => {
                move(col, row);
                let best = bestChoise(pattern, color);
                console.log(best);
                move(best.point[0], best.point[1]);
            })
            doc.appendChild(item);
        }
    }
}

function move(x, y) {
    if (pattern[y][x] !== 0) return;
    pattern[y][x] = color;
    show(pattern);
    let isWillWin = willWin(pattern, 3 - color);
    if (isWillWin) {
        console.log(`${color === 2 ? '⭕️' : '❌'} will win`);    
    }
    let isWin = check(pattern, color, x, y);
    if (isWin) {
        alert(`${color === 1 ? '⭕️' : '❌'} is win`);
    }
    color = 3 - color;
}

function check(pattern, color, x, y) {
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }

    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[j][i] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }

    {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[j][j] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }

    {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[j][2 - j] !== color) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }
    return false;
}

function clone (obj) {
    return JSON.parse(JSON.stringify(obj));
}


function willWin (pattern, color) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j] !== 0) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            if (check(tmp, color)) {
                return [j, i];
            }
        }
    }
    return false;
}

function bestChoise (pattern, color) {
    let point = null;
    let win = willWin(pattern, color);
    if (win) {
        point = win;
        return {
            point: point,
            result: 1
        }
    }

    let result = -1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j] !== 0) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            let opposite = bestChoise(tmp, 3 - color);
            if (-opposite.result > result) {
                point = [j, i];
                result = -opposite.result;
            }
        }
    }
    return {
        point: point,
        result: point ? result : 0
    }
}


show(pattern);