import { createElement } from './createElement';


export class ListView {
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

    getAttribute(name) {
        return this[name];
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
        let data = this.getAttribute('data');
        return <div class="list-view" style="width: 300px">
            {
                data.map(this.children[0])
            }
        </div>
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }
}