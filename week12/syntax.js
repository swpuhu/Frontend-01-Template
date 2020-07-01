
    let source = tokenize("1024 + 10 * 25");

    function Expression(source) {
        if (source[0].type === 'AdditiveExpression' && source[1].type === 'EOF') {
            let node = {
                type: 'Expression',
                children: [source.shift(), source.shift(), source.shift()]
            }
            source.unshift(node);
            return node;
        }

        AdditiveExpression(source);
        return Expression(source);

    }
    function AdditiveExpression(source) {
        if (source[0].type === TOKENTYPE.Number) {
            MultiplicativeExpression(source);
            return AdditiveExpression(source);
        }

        if (source[0].type === 'MultiplicativeExpression') {
            let node = {
                type: 'AdditiveExpression',
                children: [source.shift()]
            }
            source.unshift(node);
            return AdditiveExpression(source);
        }
        if (source[0].type === 'AdditiveExpression' &&
            source.length > 1 && source[1].type === TOKENTYPE.Plus) {
            let node = {
                type: 'AdditiveExpression',
                children: [source.shift(), source.shift()]
            }

            MultiplicativeExpression(source);
            node.children.push(source.shift());
            source.unshift(node);
            return AdditiveExpression(source);
        }
        if (source[0].type === 'AdditiveExpression' &&
            source.length > 1 && source[1].type === TOKENTYPE.Minus) {
            let node = {
                type: 'AdditiveExpression',
                children: [source.shift(), source.shift()]
            }

            MultiplicativeExpression(source);
            node.children.push(source.shift());
            source.unshift(node);
            return AdditiveExpression(source);
        }

        if (source[0].type === 'AdditiveExpression') {
            return source[0];
        }

    }


    function MultiplicativeExpression(source) {
        console.log(source);
        if (source[0].type === TOKENTYPE.Number) {
            let node = {
                type: "MultiplicativeExpression",
                children: source.shift()
            }
            source.unshift(node);
            return MultiplicativeExpression(source);
        }
        if (source[0].type === 'MultiplicativeExpression' &&
            source.length > 1 && source[1].type === TOKENTYPE.Multi) {
            let node = {
                type: 'MultiplicativeExpression',
                children: [source.shift(), source.shift(), source.shift()]
            }
            source.unshift(node);
            return MultiplicativeExpression(source);
        }


        if (source[0].type === 'MultiplicativeExpression' &&
            source.length > 1 && source[1].type === TOKENTYPE.Divide) {
            let node = {
                type: 'MultiplicativeExpression',
                children: [source.shift(), source.shit(), source.shift()]
            }
            source.unshift(node);
            return MultiplicativeExpression(source);
        }
        if (source[0].type === 'MultiplicativeExpression') {
            return source[0];
        }
    }


    Expression(source);