import { createElement } from './createElement';
import './index.css';



class Child {

}

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
            element.addEventListener('dragstart', e => false);
            return element;
        });
        let root = <div class="carousel">
            {children}
        </div>

        let position = 0;
        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length
            let current = children[position];
            let next = children[nextPosition];

            current.style.transition = 'none';
            next.style.transition = 'none';

            current.style.transform = `translateX(${-100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

            setTimeout(() => {
                current.style.transition = '';
                next.style.transition = '';

                current.style.transform = `translateX(${-100 - 100 * position}%)`;
                next.style.transform = `translateX(${-100 * nextPosition}%)`;
                position = nextPosition;

            }, 16);
            setTimeout(nextPic, 3000);
        }

        setTimeout(nextPic, 3000);

        return root
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }
}
// let component = <Div id="a" class="b" style="width: 100px; height: 100px; background-color: #f60">
//     <Div/>
//     <Div/>
//     hello world
//     <Div/>
// </Div>

let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />

component.mountTo(document.body);

// component.id = "b"