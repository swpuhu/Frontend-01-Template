import {Timeline, Animation} from './animation.js';
import {cubicBezier} from './cubicBezier.js';
const el = document.getElementById('el');
const el2 = document.getElementById('el-another');
let tl = new Timeline();

let bezier = cubicBezier(0.25, 0.1, 0.25, 1);
console.log(bezier);
tl.add(new Animation(el.style, 'transform', v => `translateX(${v}px)`, 0, 200, 5000, 0, bezier));

tl.start();

let button = document.createElement('button');
button.textContent = 'Pause';
let resumeButton = document.createElement('button');
resumeButton.textContent = 'Resume';
document.body.appendChild(button);
document.body.appendChild(resumeButton);

let addButton = document.createElement('button');
addButton.textContent = 'Add Animation';
document.body.appendChild(addButton);

button.onclick = function () {
    tl.pause();
}

resumeButton.onclick = function () {
    tl.resume();
}

addButton.onclick = function () {
    tl.add(new Animation(el2.style, 'transform', v => `translateX(${v})`, 0, 200, 5000, 0, bezier));
}