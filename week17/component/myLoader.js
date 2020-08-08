const {parseHTML} = require('./parser');

module.exports = function (source, map) {
    console.log('myloader is running!!!!!!!!!!\n', this.resourcePath);
    let res = parseHTML(source);
    console.log(res);
    return "";
}