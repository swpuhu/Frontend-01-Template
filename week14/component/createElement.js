export function createElement(Cls, attributes, ...children) {
    let o;
    if (typeof Cls === 'string') {
        o = new Wrapper(Cls);
    } else {
        o = new Cls;
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
        o[name] = attributes[name];
    }
    // console.log(o);
    let visit = (children) => {
        for (let child of children) {
            if (typeof child === 'object' && child instanceof Array) {
                visit(child);
                continue;
            }
            if (typeof child === 'string') {
                child = new Text(child);
            }
            o.appendChild(child);

        }
    }

    visit(children);
    return o;
}



class Cls {

}
export class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }

    setAttribute(name, value) { //attribute
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }


    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    get style () {
        return this.root.style;
    }
}
export class Div {
    constructor(config) {
        this.children = [];
        this.root = document.createElement('div');
    }
    set class(v) { // property
        console.log("Parent:: class", v);
    }

    setAttribute(name, value) { //attribute
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }

    render() {
        return <article >
            <header > I 'm a header</header> </article>
    }
}
export class Text {
    constructor(text) {
        this.children = [];
        this.root = document.createTextNode(text);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}