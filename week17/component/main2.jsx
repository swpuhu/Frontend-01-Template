import { createElement } from './createElement';
import './index.css';
import './carousel.view';
import { Timeline, Animation } from './animation/animation.js';
import { cubicBezier, ease } from './animation/cubicBezier';
import {ListView} from './ListView';
class Carousel {
    constructor(config) {
        this.attributes = new Map();
        this.properties = new Map();
        this.children = [];
    }

    setAttribute(name, value) {
        this[name] = value;
        // this.attributes.set(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    render() {
        let children = this.data.map(url => {
            let element = <img src={url} />
            element.addEventListener('dragstart', e => e.preventDefault());
            return element;
        });
        let root = <div class="carousel">
            {children}
        </div>

        let position = 0;
        let timeline = new Timeline;
        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length
            let current = children[position];
            let next = children[nextPosition];
            let currentAnimation = new Animation(current.style, 'transform', (v) => `translateX(${v}%)`, -100 * position, -100 - 100 * position, 500, 0, ease);
            let nextAnimation = new Animation(next.style, "transform", (v) => `translateX(${v}%)`, 100 - 100 * nextPosition, -100 * nextPosition, 500, 0, ease);
            // current.style.transform = `translateX(${-100 * position}%)`;
            // next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;
            timeline.add(currentAnimation);
            timeline.add(nextAnimation);
            position = nextPosition;
            setTimeout(nextPic, 3000);
        }

        timeline.start();

        setTimeout(nextPic, 3000);
        root.addEventListener('mousedown', (e) => {
            let startX = e.clientX, startY = e.clientY;

            let lastPosition = (position - 1 + this.data.length) % this.data.length;
            let nextPosition = (position + 1) % this.data.length

            let current = children[position];
            let last = children[lastPosition];
            let next = children[nextPosition];


            current.style.transition = 'ease 0s';
            last.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';


            const move = (ev) => {

                current.style.transition = 'ease 0s';
                last.style.transition = 'ease 0s';
                next.style.transition = 'ease 0s';

                current.style.transform = `translateX(${-500 * position}px)`;
                last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
                next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;


                let offsetX = ev.clientX - startX;
                let offsetY = ev.clientY - startY;

                current.style.transform = `translateX(${offsetX - 500 * position}px)`;
                last.style.transform = `translateX(${offsetX - 500 - 500 * lastPosition}px)`;
                next.style.transform = `translateX(${offsetX + 500 - 500 * nextPosition}px)`;
            }

            const up = (ev) => {


                let offset = 0;
                let offsetX = ev.clientX - startX;
                if (offsetX > 250) {
                    offset = 1;
                } else if (offsetX < -250) {
                    offset = -1;
                }

                current.style.transition = '';
                last.style.transition = '';
                next.style.transition = '';


                current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
                last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
                next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;

                position = (position - offset + this.data.length) % this.data.length;
                console.log(position);

                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        })
        return root;
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }
}

class Panel {
    constructor(config) {
        this.attributes = new Map();
        this.properties = new Map();
        this.children = [];
        this.state = Object.create(null);
    }

    setAttribute(name, value) {
        this[name] = value;
        // this.attributes.set(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    select(i) {
        for (let view of this.childViews) {
            view.style.display = 'none';
        }
        this.childViews[i].style.display = "";
        for (let view of this.tilteViews) {
            view.classList.remove('selected');
        }
        this.tilteViews[i].classList.add('selected');
        // this.titleView.innerText = this.children[i].innerText;
    }

    render() {
        setTimeout(() => {
            this.select(0)
        }, 16);
        this.childViews = this.children.map(child => <div style="width: 300px;min-height:300px">{child}</div>)
        this.tilteViews = this.children.map((child, i) => <span onClick={() => { this.select(i) }} style="width: 300px;min-height:300px; padding: 5px;">{child.getAttribute('title')}</span>)
        this.titleView = <h1 style="background-color:lightgreen;width:300px;margin:0">title</h1>
        return <div class="panel">
            {this.tilteViews}
            <div>
                {this.childViews}
            </div>
        </div>
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }
}

// let component = <Carousel data={[
//     "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
//     "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
//     "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
//     "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
// ]} />

// let component = <Panel title="Panel">
//     <span title="title1">comments1</span>
//     <span title="title2">comments2</span>
//     <span title="title3">comments3</span>
//     <span title="title4">comments4</span>
//     <span title="title5">comments5</span>
// </Panel>

let data = [
    { title: "蓝猫", url: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg" },
    { title: "橘猫加白", url: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg" },
    { title: "狸花加白", url: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg" },
    { title: "橘猫", url: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg" }
];
let list = <ListView data={data}>
    {
        record => <figure>
            <img src={record.url}/>
            <figcaption>{record.title}</figcaption>
        </figure>
    }
</ListView>
// component.mountTo(document.body);
list.mountTo(document.body);

// component.id = "b"