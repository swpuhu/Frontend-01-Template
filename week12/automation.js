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


let obj = {};
let obj2 = obj;
let a = [...new Set([1,1,1,2,3,4,5,6,6,6, NaN, NaN, Infinity, Infinity, -Infinity, -Infinity, obj, obj2])]
console.log(a);

let automata = new AutoMata('abaacaabc');
let result = automata.search('abaacabbcabaacaabcabaac');
console.log(result);
