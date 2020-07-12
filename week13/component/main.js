class Cls {

}
class Wrapper {
    constructor (type) {
        this.children = [];
        this.root = document.createElement(type);
    }
    set class (v) { // property
        console.log("Parent:: class", v);
    }

    setAttribute (name, value) { //attribute
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    mountTo (parent) {
        parent.appendChild(this.root);
        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }
}
class Div {
    constructor (config) {
        this.children = [];
        this.root = document.createElement('div');
    }
    set class (v) { // property
        console.log("Parent:: class", v);
    }

    setAttribute (name, value) { //attribute
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    mountTo (parent) {
        parent.appendChild(this.root);
        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }

    render () {
        this.slot = <div></div>
        return <article>
            <header>I'm a header</header>
        </article>
    }
}
class Text {
    constructor (text) {
        this.root = document.createTextNode(text);
    }

    mountTo (parent) {
        parent.appendChild(this.root);
    }
}


class Child {

}
let component = <Div id="a" class="b" style="width: 100px; height: 100px; background-color: #f60">
    <Div/>
    <Div/>
    hello world
    <Div/>
</Div>
console.log(component);
component.mountTo(document.body);

function create (Cls, attributes, ...children) {
    let o;
    if (typeof Cls === 'string') {
        o = new Wrapper(Cls);
    } else {
        o = new Cls;    
    }
    
    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
        if (typeof child === 'string') {
            child = new Text(child);
        }
        o.appendChild(child);
    }
    return o;
}
// component.id = "b"