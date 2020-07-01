# 每周总结可以写在这里

## 字符串分析算法

- 字典树
    - 大量字符串的完整模式匹配
- KMP算法
    - 长字符串中找子串 O(m + n)
- WildCard通配符算法
    - 长字符串中找子串的升级版
- 正则
    - 字符串通用模式匹配
- 状态机
    - 通用的字符串分析
- LL LR
    - 字符串多层级结构分析

## 字典树 （Trie)

```js
class Trie {
    constructor() {
        this.root = Object.create(null);
    }

    insert(word) {
        let node = this.root;
        for (let c of word) {
            if (!node[c]) {
                node[c] = Object.create(null);
            }
            node = node[c];
        }
        if (!("$" in node)) {
            node["$"] = 0;
        }
        node["$"]++;
    }

    most() {
        let max = 0;
        let maxWord = null;
        let visit = (node, word) => {
            if (node.$ && node.$ > max) {
                max = node.$;
                console.log(max);
                maxWord = word;
            }

            for (let p in node) {
                visit(node[p], word + p);
            }
        }

        visit(this.root, "");
        console.log(maxWord);

    }
}
```

## KMP 算法
```js

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

```

## 字符串匹配（根据输入模式自动生成有限状态机）

```js
class AutoMata {
	constructor (pattern) {
		this.pattern = pattern;
	}

	search (source, pattern) {
		if (pattern) {
			this.pattern = pattern;
		}
		
		let m = this.pattern.length;
		let n = source.length;
		let TF_len = m + 1;
		let TF = new Array(TF_len);

		this.compute_Transition_Function(this.pattern, m, TF);
		let state = 0;
		for (let i = 0; i < source.length; i++) {
			if (this.pattern.indexOf(source[i]) < 0) {
				state = TF[state].get(null);
			} else {
				state = TF[state].get(source[i]);
			}
			
			if (state === m) {
				return true;
			}
		}
	}

	compute_Transition_Function (pattern, m, TF) {
		let state, x;
		let charSet = [...new Set(pattern), null];
		for (state = 0; state <= m; state++) {
			let map = new Map();
			for (x = 0; x < charSet.length; x++) {
				if (charSet[x] === null) {
					map.set(charSet[x], 0);	
				}
				let nextState = this.getNextState(pattern, m, state, charSet[x]);
				map.set(charSet[x], nextState);
			}
			TF[state] = map;
		}
		console.log(TF);
	}

	getNextState (pattern, m, state, x) {
		if (state < m && x === pattern[state]) {
			return state + 1;
		}

		let ns, i;

		for (ns = state; ns > 0; ns--) {
			if (pattern[ns - 1] === x) {
				for (i = 0; i < ns - 1; i++) {
					if (pattern[i] !== pattern[state - ns + 1 + i]) {
						break;
					}
				}

				if (i === ns - 1) {
					return ns;
				}
			}
		}
		return 0;
	}
}
```

## WildCard 算法

```js
    function find(source, pattern) {
        let startCount = 0;
        let i = 0;
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === '*') {
                startCount++;
            }
        }
        if (startCount === 0) {
            for (let i = 0; i < pattern.length; i++) {
                if (pattern[i] !== source[i] && pattern[i] !== '?') {
                    return false;
                }
            }
            return;
        }


        i = 0;
        let lastIndex = 0;
        for (i = 0; pattern[i] !== '*'; i++) {
            if (pattern[i] !== source[i] && pattern[i] !== '?') {
                return false;
            }
        }

        lastIndex = i;

        for (let p = 0; p < startCount - 1; p++) {
            i++;
            let subPattern = "";
            while (pattern[i] !== '*') {
                subPattern += pattern[i];
                i++;
            }

            let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"));
            reg.lastIndex = lastIndex;

            console.log(reg.exec(source));

            lastIndex = reg.lastIndex;
        }

        for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
            if (pattern[pattern.length - j] !== source[source.length - j]
                && pattern[pattern.length - 1] !== '?') {
                return false;
            }
        }
        return true;

    }

```


