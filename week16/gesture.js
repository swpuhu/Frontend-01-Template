enableGesture(document.body);
function enableGesture(element) {
    const contexts = Object.create(null);

    const MOUSE_SYMBOL = Symbol("mouse");

    element.addEventListener('mousedown', (event) => {
        contexts[MOUSE_SYMBOL] = Object.create(null);
        start(event, contexts[MOUSE_SYMBOL]);
        const mousemove = event => {
            move(event, contexts[MOUSE_SYMBOL]);
        }

        const mouseend = event => {
            end(event, contexts[MOUSE_SYMBOL]);
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseend);
        }
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseend);
    })


    element.addEventListener('touchstart', (e) => {
        for (let touch of e.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    })


    element.addEventListener('touchmove', (e) => {
        for (let touch of e.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    });

    element.addEventListener('touchend', (e) => {
        for (let touch of e.changedTouches) {
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });

    // 被alert弹窗或者其他系统事件中断时就会出发cancel事件
    element.addEventListener('touchcancel', e => {
        for (let touch of e.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });


    // tap 
    // pan => panstart -> panmove -> panend
    // flick
    // press => pressstart -> pressend
    // 基本架构： 监听 --> 识别 --> 分发

    const start = (point, context) => {
        element.dispatchEvent(new CustomEvent('start', {
            startX: point.clientX,
            startY: point.clientY,
            clientX: point.clientX,
            clientY: point.clientY
        }));
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.moves = [];
        context.timeoutId = setTimeout(() => {
            if (context.isPan) return;
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            element.dispatchEvent(new CustomEvent('pressstart', {}));
            console.log("pressstart");
        }, 500);
        // console.log("start", point.clientX, point.clientY);
    }

    const move = (point, context) => {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress) {
                element.dispatchEvent(new CustomEvent('presscancel', {}));
            }
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            element.dispatchEvent(new CustomEvent('panstart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            }));
            console.log("panstart");
        }


        if (context.isPan) {
            context.moves.push({
                dx, dy,
                t: Date.now()
            });
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
            // console.log(context.moves);
            let e = new CustomEvent('pan');
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            });
            element.dispatchEvent(e);
            console.log("pan");
        }
        // console.log("move", dx, dy);
    }

    const end = (point, context) => {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        let record = context.moves[0];
        if (record) {

            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
            let isFilck = speed > 2.5;
            if (speed > 2.5) {
                element.dispatchEvent(new CustomEvent('flick', {
                    startX: context.clientX,
                    startY: context.clientY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed: speed,
                    isFlick: isFlick
                }));
                console.log('flick');
            }
            let e = new CustomEvent('panend');
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed: speed,
                isFilck: isFilck
                }
            );
            element.dispatchEvent(e);

        }
        if (context.isTap) {
            element.dispatchEvent(new CustomEvent('tap', {}));
            console.log("tap");
        }
        if (context.isPress) {
            element.dispatchEvent(new CustomEvent('pressend', {}));
            console.log("pressend");
        }
        clearTimeout(context.timeoutId);
    }

    const cancel = (point, context) => {
        element.dispatchEvent(new CustomEvent('cancel', {}));
        console.log("cancel");
        clearTimeout(context.timeoutId);
    }
}
