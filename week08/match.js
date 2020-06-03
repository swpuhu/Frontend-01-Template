const {Parser} = require('htmlparser2');
const {DomHandler} = require('domhandler');
const fs = require('fs');
const CSSselect = require('css-select');

const rawHtml = fs.readFileSync(__dirname + '/page.html');

function match(selector, ele, context) {
    let res = CSSselect(selector, context);
    return res.indexOf(ele) > -1;
}

const handler = new DomHandler((err, dom) => {
    if (err) {

    } else {
        // console.log(dom);
        let res = CSSselect('#flex', dom);
        console.log(res);
        let isMatch = match('#flex', res[0], dom);
        console.log(isMatch);
    }
});

const parser = new Parser(handler);
parser.write(rawHtml);
parser.end();