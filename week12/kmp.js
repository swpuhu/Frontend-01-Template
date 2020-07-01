
// 时间复杂度 O(m * n)
function find(source, pattern) {
    for (let i = 0; i < source.length; i++) {
        let matched = true;
        for (let j = 0; j < pattern.length; j++) {
            if (source[i + j] !== pattern[j]) {
                matched = false;
                break;
            }
        }
        if (matched) {
            return true;
        }
    }
    return false;
}

/**
 * @description 错误的算法实例
 * 错误的case: source: 'abcxxyz',  pattern: 'xyz'
 * @param {string} source 
 * @param {string} pattern    
 */
function find2 (source, pattern) {
    let j = 0;
    for (let i = 0; i < source.length; i++) {
        console.log(source[i], pattern[j]);
        if (source[i] === pattern[j]) {
            j++;
        } else {
            j = 0;
            if (source[i] === pattern[j]) { 
                // 解决xx重复的问题
                // 不能通过的case: 'abcbacbax' ,'abcabx'
                j++;
            }
        }
        
        if (j === pattern.length) {
            return true;

        }
        
    }
    return false;
}



/**
 * @description KMP算法基本结构 时间复杂度 O(m + n)
 * @param {string} source 
 * @param {string} pattern 
 */
function find3 (source, pattern) {
    let table = new Array(pattern.length).fill(0);
    let k = 0;
    for (let j = 1; j < pattern.length; j++) {
        if (pattern[j] === pattern[k]) {
            k++;
        } else {
            k = 0;
        }
        table[j] = k;
    }
    console.log(table);
    let j = 0;
    for (let i = 0; i < source.length; i++) {
        console.log(source[i], pattern[j]);
        if (source[i] === pattern[j]) {
            j++;
        } else {
            // TODO: optimize
            // here is trackback
            while (source[i] !== pattern[j] && j > 0) { 
                j = table[j - 1];
            } 
            if (source[i] === pattern[j]) {
                j++;
            } else {
                j = 0;
            }
        }
        
        if (j === pattern.length) {
            return true;

        }
        
    }
    return false;
}


let res = find3('', 'ababc');
console.log(res);
