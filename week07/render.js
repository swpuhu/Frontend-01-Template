const {createCanvas, loadImage} = require('canvas');
const fs = require('fs');
const out = fs.createWriteStream(__dirname + '/test.png');

const canvas = createCanvas(300, 150);
const ctx = canvas.getContext('2d');
const stream = canvas.createPNGStream()
stream.pipe(out);
out.on('finish', () => {
    console.log('The PNG file was created.');
});

function render(element) {
    console.log(JSON.stringify(element, " ", 4));
    if (element.style) {
        if (element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0, 0, 0)';
            color.match(/rgb\(\s?(\d+)\s?,\s?(\d+)\s?,\s?(\d+)\s?\)/);
            let r = +RegExp.$1;
            let g = +RegExp.$2;
            let b = +RegExp.$3;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(element.style.left || 0, element.style.top || 0, element.style.width, element.style.height);
            ctx.fill();
        }
    }
    if (element.children) {
        for (var child of element.children) {
            render(child);
        }
    }
}

module.exports = (viewport, element) => {
    canvas.width = viewport[0];
    canvas.height = viewport[1];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render(element);
    ctx.save();
}